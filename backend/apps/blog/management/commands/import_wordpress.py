import os
import re
import xml.etree.ElementTree as ET
from io import BytesIO
from urllib.parse import urlparse
from urllib.request import urlopen, Request
from urllib.error import URLError

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand, CommandError
from django.utils.dateparse import parse_datetime
from django.utils.text import slugify

from apps.blog.models import Article

NS = {
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'excerpt': 'http://wordpress.org/export/1.2/excerpt/',
    'wp': 'http://wordpress.org/export/1.2/',
    'dc': 'http://purl.org/dc/elements/1.1/',
}

BLOCK_COMMENT_RE = re.compile(r'<!--.*?-->', re.DOTALL)


def strip_blocks(html: str) -> str:
    return BLOCK_COMMENT_RE.sub('', html).strip()


def download_image(url: str) -> tuple[bytes, str] | None:
    try:
        req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urlopen(req, timeout=15) as resp:
            data = resp.read()
        path = urlparse(url).path
        filename = os.path.basename(path) or 'image.jpg'
        return data, filename
    except (URLError, Exception):
        return None


class Command(BaseCommand):
    help = 'Import blog articles from a WordPress XML export file'

    def add_arguments(self, parser):
        parser.add_argument('xml_file', type=str, help='Path to WordPress XML export file')
        parser.add_argument(
            '--skip-images',
            action='store_true',
            help='Skip downloading featured images',
        )

    def handle(self, *args, **options):
        xml_path = options['xml_file']
        skip_images = options['skip_images']

        if not os.path.exists(xml_path):
            raise CommandError(f'File not found: {xml_path}')

        self.stdout.write(f'Parsing {xml_path} ...')
        tree = ET.parse(xml_path)
        root = tree.getroot()
        channel = root.find('channel')
        if channel is None:
            raise CommandError('Invalid WordPress XML: no <channel> found')

        # Build attachment map: wp:post_id → attachment_url
        attachment_map: dict[str, str] = {}
        for item in channel.findall('item'):
            post_type = item.findtext('wp:post_type', namespaces=NS)
            if post_type == 'attachment':
                post_id = item.findtext('wp:post_id', namespaces=NS)
                att_url = item.findtext('wp:attachment_url', namespaces=NS)
                if post_id and att_url:
                    attachment_map[post_id] = att_url

        self.stdout.write(f'Found {len(attachment_map)} attachments')

        created = updated = skipped = 0

        for item in channel.findall('item'):
            post_type = item.findtext('wp:post_type', namespaces=NS)
            status = item.findtext('wp:status', namespaces=NS)

            if post_type != 'post' or status != 'publish':
                continue

            titolo = item.findtext('title') or ''
            slug_wp = item.findtext('wp:post_name', namespaces=NS) or slugify(titolo)
            pub_date_str = item.findtext('wp:post_date', namespaces=NS) or ''
            content_raw = item.findtext('content:encoded', namespaces=NS) or ''
            excerpt_raw = item.findtext('excerpt:encoded', namespaces=NS) or ''

            content_clean = strip_blocks(content_raw)
            excerpt_clean = strip_blocks(excerpt_raw)

            pub_date = None
            if pub_date_str and pub_date_str != '0000-00-00 00:00:00':
                try:
                    pub_date = parse_datetime(pub_date_str.replace(' ', 'T'))
                except Exception:
                    pass

            # Find featured image thumbnail id
            thumbnail_id = None
            for meta in item.findall('wp:postmeta', namespaces=NS):
                key = meta.findtext('wp:meta_key', namespaces=NS)
                val = meta.findtext('wp:meta_value', namespaces=NS)
                if key == '_thumbnail_id' and val:
                    thumbnail_id = val
                    break

            image_url = attachment_map.get(thumbnail_id) if thumbnail_id else None

            try:
                article = Article.objects.get(slug=slug_wp)
                is_new = False
            except Article.DoesNotExist:
                article = Article(slug=slug_wp)
                is_new = True

            article.titolo = titolo
            article.contenuto = content_clean
            article.excerpt = excerpt_clean
            article.pubblicato = True
            article.data_pubblicazione = pub_date

            # Download image only if not already saved or if it's a new article
            if image_url and not skip_images and (is_new or not article.immagine):
                result = download_image(image_url)
                if result:
                    img_data, filename = result
                    article.immagine.save(filename, ContentFile(img_data), save=False)
                    self.stdout.write(f'  Downloaded image: {filename}')
                else:
                    self.stdout.write(self.style.WARNING(f'  Could not download: {image_url}'))

            article.save()

            if is_new:
                created += 1
                self.stdout.write(f'  Created: {titolo[:60]}')
            else:
                updated += 1
                self.stdout.write(f'  Updated: {titolo[:60]}')

        self.stdout.write(self.style.SUCCESS(
            f'\nDone. Created: {created}, Updated: {updated}, Skipped: {skipped}'
        ))
