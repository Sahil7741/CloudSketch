# CloudSketch

A real-time collaborative whiteboard application built with Spring Boot and React.

## Project Structure

- `backend/` - Spring Boot backend with WebSocket support
- `frontend/` - React frontend with real-time drawing canvas

## Features

- ✅ Real-time collaborative drawing
- ✅ Multiple drawing tools (pen, eraser)
- ✅ Color picker and brush size controls
- ✅ Room-based collaboration
- ✅ User management
- ✅ WebSocket communication
- ✅ Docker containerization

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/Sahil7741/CloudSketch.git
cd CloudSketch

# Start all services
./start.sh

# Check health status
./health-check.sh
```

### Manual Setup

#### Backend
```bash
cd backend
mvn clean package
java -jar target/whiteboard-backend-0.0.1-SNAPSHOT.jar
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- WebSocket: ws://localhost:8080/ws

## Technology Stack

- **Backend**: Spring Boot, WebSocket, Maven
- **Frontend**: React, SockJS, STOMP
- **Database**: Redis (for session storage)
- **Deployment**: Docker, Docker Compose

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request