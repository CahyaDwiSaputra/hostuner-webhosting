# ==============================================================================
# Production Backend Dockerfile - Multi-Stage Build
# Multi-stage build, rootless non-root user 'node', Alpine base
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Dependencies Resolution
# ------------------------------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm ci

# ------------------------------------------------------------------------------
# Stage 2: TypeScript Compilation / Build
# ------------------------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build
# Prune devDependencies to keep final image ultra-lightweight
RUN npm prune --production

# ------------------------------------------------------------------------------
# Stage 3: Hardened Production Runner
# ------------------------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

# Install dumb-init for proper PID 1 signal forwarding (SIGTERM / SIGINT) and wget for healthchecks
RUN apk add --no-cache dumb-init wget

ENV NODE_ENV=production
ENV PORT=5000

# Create application uploads and logs directory with ownership granted to unprivileged 'node' user
RUN mkdir -p /app/uploads /app/logs && chown -R node:node /app

# Copy production dependencies and compiled artifacts from previous stages
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/package.json ./package.json

# Switch to unprivileged user (DevOps Principle: Never run production containers as root)
USER node

EXPOSE 5000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:5000/health || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/server.js"]
