# Note Manager - Full Stack MERN Application

note management application built with **Node.js**, **Express**, **React**, and **SQLite3**. Features authentication, CRUD operations, input validation, rate limiting, and professional error handling.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org)
[![React Version](https://img.shields.io/badge/react-18.x-blue)](https://reactjs.org)

## Features

### Backend
- **JWT Authentication**
- **RESTful API**
- **Input Validation**
- **Rate Limiting**
- **Security Headers**
- **Error Handling**
- **Logging System**
- **CORS Protection**

### Frontend
- **React 18**
- **React Router**
- **Context API**
- **Axios**
- **Responsive Design**
- **Form Validation**
- **Error Boundaries**

### Features
- User registration and login
- Create, read, update, delete notes
- Protected routes and API endpoints

---

## 🏗️ Architecture

```
task-manager/
├── backend/
│   ├── config/
│   │   └── config.js          
│   ├── database/
│   │   ├── database.js              
│   │   └── notes.db     
│   ├── middleware/
│   │   ├── auth.js         
│   │   ├── errorHandler.js 
│   │   ├── security.js        
│   │   └── validation.js    
│   ├── routes/
│   │   ├── auth.js          
│   │   └── notes.js           
│   ├── utils/
│   │   └── logger.js         
│   ├── logs/                
│   ├── .env                   # Environment variables
│   ├── server.js              # Express server entry point
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── Axios.js 
    │   ├── components/
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Notes.js
    │   │   ├── Login.css
    │   │   └── Notes.css
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: express-validator
- **Security**: helmet, express-rate-limit
- **Logging**: Winston
- **Environment**: dotenv

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: Context API
- **Styling**: CSS

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### 1. Clone Repository
```bash
git clone https://github.com/Gabrielkaos/Smart-Notes-React-App.git
cd Smart-Notes-React-App
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=5000
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
EOF

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start React app
npm start
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Note Endpoints

#### Create Note (Protected)
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the MERN stack project"
}
```

#### Get All Notes (Protected)
```http
GET /api/notes
Authorization: Bearer <token>
```

#### Get Single Note (Protected)
```http
GET /api/notes/:id
Authorization: Bearer <token>
```

#### Update Note (Protected)
```http
PUT /api/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "updated description"
}
```

#### Delete Note (Protected)
```http
DELETE /api/notes/:id
Authorization: Bearer <token>
```

---

## 🔒 Security Features

### Authentication
- **Password Hashing**
- **JWT Tokens**
- **Token Storage**
- **Protected Routes**

### Input Validation
- Password strength requirements (min 8 chars, uppercase, lowercase, number)
- Username validation (alphanumeric + underscores only)

### Rate Limiting
- **Global**: 100 requests per 15 minutes
- **Auth Routes**: 5 attempts per 15 minutes

### HTTP Security
- Helmet.js security headers
- CORS configuration

---

## 🧪 Testing

### Manual Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test1234"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

**Create Note:**
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"My Note","description":"Note description"}'
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Notes Table
```sql
CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---