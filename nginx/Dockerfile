# ==============================================================================
# Production Nginx Reverse Proxy Dockerfile
# Based on unprivileged / hardened Alpine image
# ==============================================================================

FROM nginx:1.27-alpine

# Install curl/wget for healthchecks and openssl for certificate verification
RUN apk add --no-cache curl wget openssl

# Remove default boilerplate configurations
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy hardened base configuration and security headers
COPY nginx.conf /etc/nginx/nginx.conf
COPY security-headers.conf /etc/nginx/security-headers.conf

# Create directory structure for SSL certificates and ACME challenges
RUN mkdir -p /etc/nginx/ssl /var/www/certbot /var/log/nginx

# Ensure log files exist and permissions are correct
RUN touch /var/log/nginx/access.log /var/log/nginx/error.log

EXPOSE 80 443

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
