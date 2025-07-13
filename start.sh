#!/bin/bash

echo "🎨 CloudSketch - Collaborative Whiteboard"
echo "=========================================="
echo

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

start_docker() {
    echo "🐳 Starting CloudSketch with Docker..."
    
    if ! command_exists docker; then
        echo "❌ Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command_exists docker-compose; then
        echo "❌ Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    echo "Building and starting all services..."
    docker-compose up -d
    
    echo "✅ CloudSketch is starting up!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:8080"
    echo "📊 Database: localhost:5432"
    echo
    echo "To stop the application, run: docker-compose down"
}

start_manual() {
    echo "🔧 Starting CloudSketch manually..."
    
    if ! command_exists java; then
        echo "❌ Java is not installed. Please install Java 17+ first."
        exit 1
    fi
    
    if ! command_exists node; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command_exists psql; then
        echo "⚠️  PostgreSQL client not found. Make sure PostgreSQL is installed and running."
    fi
    
    echo "Starting backend..."
    cd backend
    ./mvnw spring-boot:run &
    BACKEND_PID=$!
    cd ..
    
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    
    echo "Starting frontend..."
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    echo "✅ CloudSketch is starting up!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:8080"
    echo
    echo "Backend PID: $BACKEND_PID"
    echo "Frontend PID: $FRONTEND_PID"
    echo
    echo "To stop the application:"
    echo "kill $BACKEND_PID $FRONTEND_PID"
}

setup_database() {
    echo "🗄️  Setting up PostgreSQL database..."
    
    if ! command_exists psql; then
        echo "❌ PostgreSQL client not found. Please install PostgreSQL first."
        exit 1
    fi
    
    echo "Creating database and user..."
    sudo -u postgres psql << EOF
CREATE DATABASE cloudsketch;
CREATE USER cloudsketch_user WITH PASSWORD 'cloudsketch_password';
GRANT ALL PRIVILEGES ON DATABASE cloudsketch TO cloudsketch_user;
\q
EOF
    
    echo "✅ Database setup complete!"
}

show_status() {
    echo "📊 CloudSketch Status"
    echo "===================="
    
    if command_exists docker; then
        echo "Docker containers:"
        docker ps --filter "name=cloudsketch" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    fi
    
    echo
    echo "Services:"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend: http://localhost:8080"
    echo "🗄️  Database: localhost:5432"
}

case "$1" in
    "docker")
        start_docker
        ;;
    "manual")
        start_manual
        ;;
    "setup-db")
        setup_database
        ;;
    "status")
        show_status
        ;;
    "stop")
        echo "🛑 Stopping CloudSketch..."
        docker-compose down
        echo "✅ All services stopped."
        ;;
    *)
        echo "Usage: $0 {docker|manual|setup-db|status|stop}"
        echo
        echo "Commands:"
        echo "  docker    - Start with Docker Compose (recommended)"
        echo "  manual    - Start manually (requires PostgreSQL, Java, Node.js)"
        echo "  setup-db  - Setup PostgreSQL database"
        echo "  status    - Show application status"
        echo "  stop      - Stop Docker containers"
        echo
        echo "Examples:"
        echo "  $0 docker     # Start with Docker"
        echo "  $0 setup-db   # Setup database"
        echo "  $0 status     # Check status"
        exit 1
        ;;
esac
