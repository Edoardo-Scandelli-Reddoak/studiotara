#!/bin/sh
set -e

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
