# Fast development Dockerfile - much quicker builds
FROM node:20-alpine

# Install OpenSSL (required for Prisma)
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --ignore-scripts

# Copy everything else
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 8080

# Start the app
CMD ["node", "dist/server.js"]