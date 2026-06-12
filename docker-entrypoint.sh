#!/bin/sh
# When running standalone (not in compose), 'api' won't resolve at startup.
# Add a loopback fallback so nginx can start. In compose, Docker DNS takes over.
if ! getent hosts api >/dev/null 2>&1; then
    echo "127.0.0.1 api" >> /etc/hosts
fi
exec "$@"
