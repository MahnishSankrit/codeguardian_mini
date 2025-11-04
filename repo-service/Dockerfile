# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Add CA and curl if you need health checks that use curl (optional)
# RUN apk add --no-cache curl

# Copy package metadata and lockfile first for better caching
COPY package*.json ./
# If you have a build step (e.g. transpile), include dev deps and run build
RUN npm ci

# Copy source
COPY . .

# If you need a build step (e.g. TypeScript), run it here:
# RUN npm run build

# --- Runtime stage ---
FROM node:20-alpine AS runtime
WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only production node_modules & built artifacts from build stage
COPY --from=build /app/package*.json ./
# If you used a build step and generated dist/, copy that too
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app ./

ENV NODE_ENV=production
EXPOSE 5001

USER appuser

# Healthcheck: use node-based endpoint (keeps image minimal)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); });"

CMD ["npm", "start"]
