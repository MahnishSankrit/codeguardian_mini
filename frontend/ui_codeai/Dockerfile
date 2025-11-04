# ===============================
# Stage 1: Build the React app
# ===============================
FROM node:18 AS build

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Use the production environment file
# (you can override these values in ECS)
ARG VITE_REPO_SERVICE_URL
ARG VITE_AI_REVIEW_SERVICE_URL
ARG VITE_METRICS_SERVICE_URL
ARG VITE_NOTIFICATION_SERVICE_URL
ARG VITE_INSIGHT_SERVICE_URL

ENV VITE_REPO_SERVICE_URL=$VITE_REPO_SERVICE_URL
ENV VITE_AI_REVIEW_SERVICE_URL=$VITE_AI_REVIEW_SERVICE_URL
ENV VITE_METRICS_SERVICE_URL=$VITE_METRICS_SERVICE_URL
ENV VITE_NOTIFICATION_SERVICE_URL=$VITE_NOTIFICATION_SERVICE_URL
ENV VITE_INSIGHT_SERVICE_URL=$VITE_INSIGHT_SERVICE_URL

# Build the app for production
RUN npm run build

# ===============================
# Stage 2: Serve with Nginx
# ===============================
FROM nginx:stable

# Copy built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Remove default Nginx config and add custom one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Expose port 80 for web traffic
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
