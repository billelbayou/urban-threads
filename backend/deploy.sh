#!/bin/bash

# Pre-deployment script for Prisma 7 + Docker
# Run this before deploying to ensure everything is ready

set -e  # Exit on error

echo "🚀 Pre-Deployment Checklist for Prisma 7 + Docker"
echo "=================================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "   Create a .env file with your environment variables"
    echo "   See .env.example for reference"
    exit 1
fi
echo "✅ .env file found"

# Check if required environment variables are set
source .env

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set in .env"
    exit 1
fi
echo "✅ DATABASE_URL is set"

if [ -z "$DIRECT_URL" ]; then
    echo "❌ DIRECT_URL not set in .env"
    exit 1
fi
echo "✅ DIRECT_URL is set"

# Check if prisma.config.ts exists
if [ ! -f prisma.config.ts ]; then
    echo "❌ prisma.config.ts not found!"
    exit 1
fi
echo "✅ prisma.config.ts found"

# Check if schema exists
if [ ! -f prisma/schema.prisma ]; then
    echo "❌ prisma/schema.prisma not found!"
    exit 1
fi
echo "✅ schema.prisma found"

echo ""
echo "📦 Installing dependencies..."
npm ci

echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

echo ""
echo "🗄️  Running migrations..."
echo "   Using DIRECT_URL for migrations (port 5432)"
npx prisma migrate deploy

echo ""
echo "🐳 Building Docker image..."
docker build -t my-express-app .

echo ""
echo "✅ Pre-deployment checks complete!"
echo ""
echo "Next steps:"
echo "1. Test locally: docker-compose up"
echo "2. Push to registry: docker tag my-express-app your-registry/my-express-app:latest"
echo "3. Deploy to your platform"
echo ""
