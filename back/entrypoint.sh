#!/bin/sh

# Wait for MySQL to be ready
while ! nc -z mysql-db 3306; do
  echo "Waiting for MySQL..."
  sleep 1
done

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput --clear

# Start the server
exec "$@"
