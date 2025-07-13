# CloudSketch - Collaborative Whiteboard Application

A full-stack collaborative whiteboard application with real-time drawing capabilities, user authentication, and WebSocket communication.

## 🌟 Features

### Authentication
- **User Registration & Login**: Secure signup/login with JWT tokens
- **Guest Access**: Anonymous users can join with auto-generated usernames
- **Password Security**: BCrypt hashing for secure password storage
- **Session Management**: JWT-based authentication with localStorage

### Collaborative Whiteboard
- **Real-time Drawing**: Synchronized drawing across all connected users
- **Drawing Tools**: Color picker, brush size adjustment, and color presets
- **Canvas Controls**: Clear canvas functionality
- **User Tracking**: Display connected users and online status
- **WebSocket Communication**: STOMP over SockJS for reliable real-time updates

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 3.2.0 with Java 17
- **Database**: PostgreSQL with Spring Data JPA
- **Security**: Spring Security + JWT authentication
- **WebSocket**: STOMP messaging protocol with SockJS fallback
- **API Endpoints**:
  - `POST /signup` - User registration
  - `POST /login` - User authentication
  - `GET /me` - Get current user info
  - `WS /ws/draw` - WebSocket endpoint for drawing

### Frontend (React)
- **Framework**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS for modern, responsive design
- **Routing**: React Router DOM for navigation
- **WebSocket**: SockJS + STOMP client for real-time communication
- **Canvas**: HTML5 Canvas API for drawing functionality
- **State Management**: React hooks (useState, useEffect, useRef)

### Database Schema
```sql
Users Table:
- id (Primary Key)
- username (Unique)
- password (BCrypt hashed)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- Maven 3.6+
- PostgreSQL 12+
- Docker & Docker Compose (optional)

### Method 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CloudSketch
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5432

### Method 2: Manual Setup

#### Database Setup
1. **Install PostgreSQL** and create database:
   ```sql
   CREATE DATABASE cloudsketch;
   CREATE USER cloudsketch_user WITH PASSWORD 'cloudsketch_password';
   GRANT ALL PRIVILEGES ON DATABASE cloudsketch TO cloudsketch_user;
   ```

#### Backend Setup
1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Configure environment variables** (optional)
   ```bash
   export JWT_SECRET=your-secret-key
   export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/cloudsketch
   export SPRING_DATASOURCE_USERNAME=cloudsketch_user
   export SPRING_DATASOURCE_PASSWORD=cloudsketch_password
   ```

3. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

#### Frontend Setup
1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Backend Configuration
The backend can be configured through `application.properties` or environment variables:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/cloudsketch
spring.datasource.username=cloudsketch_user
spring.datasource.password=cloudsketch_password

# JWT
app.jwt.secret=mySecretKey123456789mySecretKey123456789
app.jwt.expiration=86400000

# CORS
app.cors.allowed-origins=http://localhost:3000
```

### Frontend Configuration
Configure the frontend through `.env` file:

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=http://localhost:8080
```

## 📡 API Documentation

### Authentication Endpoints

#### POST /signup
Register a new user
```json
Request:
{
  "username": "sahil",
  "password": "securepassword"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "username": "sahil"
}
```

#### POST /login
Authenticate user
```json
Request:
{
  "username": "sahil",
  "password": "securepassword"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "username": "sahil"
}
```

#### GET /me
Get current user info (requires JWT token)
```json
Headers:
Authorization: Bearer <jwt-token>

Response:
{
  "username": "sahil"
}
```

### WebSocket Communication

#### Connection
Connect to: `/ws/draw` with SockJS

#### Subscribe
Topic: `/topic/board`

#### Send Drawing Data
Destination: `/app/draw`
```json
{
  "x": 150.5,
  "y": 200.3,
  "color": "#ff0000",
  "thickness": 5,
  "username": "sahil",
  "type": "draw"
}
```

## 🎨 Usage Guide

### For Registered Users
1. Visit http://localhost:3000
2. Click "Sign up here" to create an account
3. Fill in username (min 3 chars) and password (min 6 chars)
4. Upon successful registration, you'll be redirected to the whiteboard
5. Start drawing and see real-time collaboration!

### For Guest Users
1. Visit http://localhost:3000
2. Click "Continue as Guest"
3. You'll get an auto-generated username like "Guest-AXY2"
4. Start drawing immediately!

### Drawing Features
- **Color Selection**: Use color picker or quick color buttons
- **Brush Size**: Adjust with slider (1-20px)
- **Clear Canvas**: Remove all drawings
- **Real-time Sync**: See other users' drawings instantly
- **User Status**: View connected users and connection status

## 🏗️ Project Structure

```
CloudSketch/
├── backend/                          # Spring Boot backend
│   ├── src/main/java/com/cloudsketch/whiteboard/
│   │   ├── config/                   # Security, WebSocket, JWT config
│   │   ├── controller/               # REST and WebSocket controllers
│   │   ├── dto/                      # Data Transfer Objects
│   │   ├── model/                    # JPA entities
│   │   ├── repository/               # Data access layer
│   │   ├── service/                  # Business logic
│   │   └── WhiteboardBackendApplication.java
│   ├── src/main/resources/
│   │   └── application.properties    # App configuration
│   ├── Dockerfile                    # Backend Docker config
│   ├── pom.xml                       # Maven dependencies
│   └── .env                          # Environment variables
├── frontend/                         # React frontend
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── Login.js             # Login form
│   │   │   ├── Signup.js            # Registration form
│   │   │   └── Whiteboard.js        # Main drawing canvas
│   │   ├── services/                 # API and WebSocket services
│   │   │   ├── api.js               # REST API calls
│   │   │   └── websocket.js         # WebSocket management
│   │   ├── App.js                   # Main app component
│   │   ├── index.js                 # App entry point
│   │   └── index.css                # Tailwind CSS
│   ├── Dockerfile                   # Frontend Docker config
│   ├── package.json                 # NPM dependencies
│   ├── tailwind.config.js           # Tailwind configuration
│   └── .env                         # Frontend environment variables
├── docker-compose.yml               # Docker orchestration
└── README.md                        # This file
```

## 🔒 Security Features

- **Password Hashing**: BCrypt with salt for secure password storage
- **JWT Tokens**: Stateless authentication with configurable expiration
- **CORS Protection**: Configurable allowed origins
- **Input Validation**: Server-side validation for all user inputs
- **SQL Injection Prevention**: JPA/Hibernate parameterized queries
- **XSS Prevention**: React's built-in XSS protection

## 🧪 Testing

### Backend Testing
```bash
cd backend
./mvnw test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Production Deployment

### Environment Variables
Set these environment variables for production:

**Backend:**
```bash
JWT_SECRET=your-very-secure-secret-key-here
SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/cloudsketch
SPRING_DATASOURCE_USERNAME=your-db-username
SPRING_DATASOURCE_PASSWORD=your-db-password
APP_CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

**Frontend:**
```bash
REACT_APP_API_URL=https://your-backend-domain.com
```

### Docker Production
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🛠️ Development

### Adding New Features
1. **Backend**: Add controllers in `controller/`, services in `service/`
2. **Frontend**: Create components in `components/`, add routes in `App.js`
3. **Database**: Update entities in `model/`, repositories in `repository/`

### WebSocket Events
To add new WebSocket events:
1. Update `DrawingData` model in backend
2. Add message mapping in `DrawingController`
3. Handle new events in frontend `websocket.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Spring Boot for the robust backend framework
- React for the interactive frontend
- Tailwind CSS for beautiful styling
- SockJS/STOMP for reliable WebSocket communication
- PostgreSQL for reliable data storage

---

**Happy Drawing! 🎨**