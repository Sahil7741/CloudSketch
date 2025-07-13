#!/bin/bash

echo "🏥 CloudSketch Health Check"
echo "=========================="
echo

check_service() {
    local service_name="$1"
    local url="$2"
    local expected_status="$3"
    
    echo -n "Checking $service_name... "
    
    if curl -f -s "$url" > /dev/null; then
        echo "✅ OK"
        return 0
    else
        echo "❌ FAILED"
        return 1
    fi
}

check_websocket() {
    echo -n "Checking WebSocket endpoint... "
    
    if curl -f -s "http://localhost:8080/ws/draw/info" > /dev/null; then
        echo "✅ OK"
        return 0
    else
        echo "❌ FAILED"
        return 1
    fi
}

check_service "Frontend (React)" "http://localhost:3000" "200"
FRONTEND_STATUS=$?

check_service "Backend API" "http://localhost:8080/actuator/health" "200"
BACKEND_STATUS=$?

check_websocket
WEBSOCKET_STATUS=$?

echo -n "Checking database connection... "
if curl -f -s "http://localhost:8080/actuator/health" | grep -q '"status":"UP"'; then
    echo "✅ OK"
    DB_STATUS=0
else
    echo "❌ FAILED"
    DB_STATUS=1
fi

echo
echo "Summary:"
echo "========"
echo "Frontend: $( [ $FRONTEND_STATUS -eq 0 ] && echo "✅ Healthy" || echo "❌ Unhealthy" )"
echo "Backend:  $( [ $BACKEND_STATUS -eq 0 ] && echo "✅ Healthy" || echo "❌ Unhealthy" )"
echo "WebSocket: $( [ $WEBSOCKET_STATUS -eq 0 ] && echo "✅ Healthy" || echo "❌ Unhealthy" )"
echo "Database: $( [ $DB_STATUS -eq 0 ] && echo "✅ Healthy" || echo "❌ Unhealthy" )"

if [ $FRONTEND_STATUS -eq 0 ] && [ $BACKEND_STATUS -eq 0 ] && [ $WEBSOCKET_STATUS -eq 0 ] && [ $DB_STATUS -eq 0 ]; then
    echo
    echo "🎉 All services are healthy!"
    echo "🌐 Access the application at: http://localhost:3000"
    exit 0
else
    echo
    echo "⚠️  Some services are unhealthy. Please check the logs."
    exit 1
fi
