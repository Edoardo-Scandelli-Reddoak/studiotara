import { incrementViews } from '@/lib/property-api';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const origin = request.headers.get('origin');
  // Same-origin browser calls only; server-to-server credentials stay here.
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await params;
  try {
    const count = await incrementViews(id);
    return Response.json(count == null ? { error: 'Not found' } : { visualizzazioni: count }, {
      status: count == null ? 404 : 200, headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json({ error: 'Servizio temporaneamente non disponibile.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
