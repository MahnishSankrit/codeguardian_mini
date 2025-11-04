FROM node:20-alpine

WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies (production only)
RUN npm install --omit=dev



# Copy app source
COPY . .

# Expose the port
EXPOSE 5002

# Healthcheck endpoint (uses /health)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5002/health || exit 1

# Start app
CMD ["npm", "start"]
