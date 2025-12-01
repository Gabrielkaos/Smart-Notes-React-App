# Note Manager - Full Stack MERN Application

note management application built with **Node.js**, **Express**, **React**, and **PostgreSQL**. Features authentication, CRUD operations, input validation, rate limiting, and professional error handling.

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



## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
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



## Security Features


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



## Testing

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