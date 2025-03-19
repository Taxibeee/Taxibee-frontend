# Stage 1: Build the frontend
FROM node:23.10.0 AS builder
WORKDIR /app

## Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build 

# Stage 2: Serve with Nginx
FROM nginx:alpine

# remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from builder stage to nginx serving directory
COPY --from=builder /app/build /usr/share/nginx/html 

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]