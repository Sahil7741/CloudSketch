#!/bin/bash

BACKEND_URL="http://localhost:8080"
FRONTEND_URL="http://localhost:3000"

echo "CloudSketch Health Check"
echo "======================="

echo -n "Backend Health: "
if curl -f $BACKEND_URL/api/health > /dev/null 2>&1; then
    echo "✓ Healthy"
else
    echo "✗ Unhealthy"
fi

echo -n "Frontend Health: "
if curl -f $FRONTEND_URL > /dev/null 2>&1; then
    echo "✓ Healthy"
else
    echo "✗ Unhealthy"
fi

echo -n "Redis Health: "
if docker-compose exec redis redis-cli ping > /dev/null 2>&1; then
    echo "✓ Healthy"
else
    echo "✗ Unhealthy"
fi
