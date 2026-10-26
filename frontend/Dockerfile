# ==============================================================================
# Production Frontend Dockerfile - Multi-Stage Build
# Multi-stage: Node Build -> Nginx Hardened Static Server
# ==============================================================================

# Stage 1: Build Application
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ARG VITE_API_URL=/api
ARG VITE_APP_NAME="CV. Buana Logika Utama"
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME

RUN npm run build

# Stage 2: Serve via Lightweight Nginx Alpine
FROM nginx:1.27-alpine AS runner

RUN apk add --no-cache wget

# Remove default nginx configs
RUN rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

# Copy custom frontend nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:80/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
