#!/bin/sh
set -e

# Seed media volume se vuoto (primo deploy)
if [ -d /app/media_seed ] && [ "$(ls -A /app/media_seed 2>/dev/null)" ]; then
    if [ ! "$(ls -A /app/media/properties 2>/dev/null)" ]; then
        echo "Copiando media seed nel volume..."
        cp -r /app/media_seed/* /app/media/
        echo "Media copiati."
    fi
fi

echo "Eseguendo migrate..."
python manage.py migrate --noinput

echo "Raccogliendo file statici..."
python manage.py collectstatic --noinput

echo "Creando utente admin di test (se non esiste)..."
python manage.py create_default_admin

echo "Avviando gunicorn..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:${PORT:-8000} \
    --workers 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
