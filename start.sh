#!/bin/bash

echo "Starting CloudSketch Application..."

if ! command -v docker-compose &> /dev/null; then
    echo "docker-compose is not installed. Please install it first."
    exit 1
fi

echo "Building and starting services..."
docker-compose up --build -d

echo "Waiting for services to start..."
sleep 10

echo "Checking service health..."
if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "Backend is running on http://localhost:8080"
else
    echo "Backend health check failed"
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "Frontend is running on http://localhost:3000"
else
    echo "Frontend health check failed"
fi

echo "CloudSketch is ready!"
echo "Access the application at: http://localhost:3000"
