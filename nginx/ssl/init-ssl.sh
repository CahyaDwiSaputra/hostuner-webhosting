#!/bin/sh
# ==============================================================================
# Automatic Let's Encrypt SSL Provisioning Script
# CV. Buana Logika Utama - Production VPS Deployment
# ==============================================================================

set -e

DOMAIN="${DOMAIN_NAME:-buanalogikautama.co.id}"
EMAIL="${SSL_EMAIL:-sysadmin@buanalogikautama.co.id}"
STAGING="${CERTBOT_STAGING:-0}" # Set to 1 for test certificates

if [ -z "$DOMAIN" ]; then
    echo "ERROR: DOMAIN_NAME environment variable is not defined."
    exit 1
fi

echo "==> Requesting Let's Encrypt SSL certificate for $DOMAIN ($EMAIL)..."

STAGING_ARG=""
if [ "$STAGING" != "0" ]; then
    STAGING_ARG="--staging"
fi

# Request certificate using certbot container
docker run -it --rm --name certbot \
    -v buana_certbot_www:/var/www/certbot \
    -v buana_certbot_conf:/etc/letsencrypt \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    $STAGING_ARG \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d "$DOMAIN" -d "www.$DOMAIN"

echo "==> Certificate successfully issued! Reloading Nginx..."
docker exec buana_nginx_proxy nginx -s reload
echo "==> SSL activation complete!"
