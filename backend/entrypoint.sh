#!/usr/bin/env bash

# Run migrations before starting the application
python3 -m flask db upgrade

# Start the application
python3 -m gunicorn -u appuser --bind "0.0.0.0:${PORT:-8080}" "app:create_app()"