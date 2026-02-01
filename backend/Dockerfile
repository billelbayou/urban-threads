# --- Stage 1: Build ---
FROM node:22-slim AS builder

# Install OpenSSL 3.0 (Required for Supabase/Prisma on modern Linux)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copy package files and prisma folder first to leverage cache
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# --- FIX FOR PRISMA 7 BUILD ERRORS ---
# Prisma 7 validates env variables during generation. 
# We provide "dummy" values so the build doesn't crash.
ARG DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ARG DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DIRECT_URL=$DIRECT_URL
ENV DATABASE_URL=$DATABASE_URL

# Generate the client (This creates the files in src/generated/prisma)
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Run the build (TSC will now see the generated types)
RUN npm run build

# --- Stage 2: Production ---
FROM node:22-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app

# Copy only the essentials from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/package.json ./package.json

# Render uses the PORT env var automatically, but we expose 8080 as you requested
EXPOSE 8080

# Start the application
CMD ["npm", "start"]