# Stage 1: Build the frontend
FROM node:23.10.0 AS builder
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of your source code
COPY . .

# Build the app (assumes Vite outputs to 'dist')
RUN npm run build

# Stage 2: Run the Node.js server dynamically
FROM node:23.10.0 AS runner
WORKDIR /app

# Copy the node_modules folder from builder stage so that dependencies like dotenv are available
COPY --from=builder /app/node_modules ./node_modules

# Copy the build output from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the Node.js server script
COPY --from=builder /app/server.js .

# Set environment variable for Cloud Run and expose port 8080
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
