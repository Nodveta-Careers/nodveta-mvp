# NodeMeta MVP Production Dockerfile
# Multi-stage build for optimized production deployment

# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production runtime
FROM node:18-alpine AS runner

# Set NODE_ENV
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodemeta && \
    adduser --system --uid 1001 nodemeta

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nodemeta:nodemeta /app/node_modules ./node_modules
COPY --from=builder --chown=nodemeta:nodemeta /app/.next ./.next
COPY --from=builder --chown=nodemeta:nodemeta /app/public ./public
COPY --from=builder --chown=nodemeta:nodemeta /app/package.json ./package.json
COPY --from=builder --chown=nodemeta:nodemeta /app/next.config.js ./next.config.js
COPY --from=builder --chown=nodemeta:nodemeta /app/server ./server

# Create directory for logs
RUN mkdir -p /app/logs && chown nodemeta:nodemeta /app/logs

# Switch to non-root user
USER nodemeta

# Expose ports
EXPOSE 5000 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node server/healthcheck.js || exit 1

# Start the application
CMD ["npm", "start"]