#!/bin/bash

# MSP Assistant Pro - Quick Deployment Script
# Run this script to deploy the application with Docker

set -e

echo "🚀 MSP Operations Assistant Pro - Deployment Script"
echo "=================================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 3000 is already in use."
    echo "   Please stop the service using port 3000 or change the port in docker-compose.yml"
    exit 1
fi

echo "✅ Port 3000 is available"
echo ""

# Stop any existing containers
echo "📦 Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Build and start
echo "🔨 Building Docker image..."
docker-compose build

echo ""
echo "🚀 Starting MSP Assistant Pro..."
docker-compose up -d

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "=================================================="
echo "🌐 Application is running at: http://localhost:3000"
echo "=================================================="
echo ""
echo "Useful Commands:"
echo "  View logs:        docker-compose logs -f"
echo "  Stop application: docker-compose down"
echo "  Restart:          docker-compose restart"
echo "  Rebuild:          docker-compose up -d --build"
echo ""
echo "Waiting 5 seconds for container to start..."
sleep 5

# Check if container is running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Container is running successfully!"
    echo ""
    echo "Opening browser in 3 seconds..."
    sleep 3
    
    # Try to open browser
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3000
    elif command -v open &> /dev/null; then
        open http://localhost:3000
    else
        echo "Please open http://localhost:3000 in your browser"
    fi
else
    echo "⚠️  Container may not be running. Check logs with: docker-compose logs"
fi
