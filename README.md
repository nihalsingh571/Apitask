# AI Safety Incident Log Service

A RESTful API service for logging and managing AI safety incidents, built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT Authentication
- 👥 User roles (admin/user)
- 📝 Input validation
- 📊 Pagination and filtering
- 🔒 Rate limiting
- 📈 Request logging
- 📚 Swagger API documentation
- 🧪 Unit tests
- 🔒 Security headers with Helmet

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/ai-safety-incidents
   JWT_SECRET=your-secret-key
   ```
   Note: If you're using MongoDB Atlas, replace the MONGODB_URI with your connection string.

4. Start the server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. Run tests:
   ```bash
   npm test
   ```

## API Documentation

Access the Swagger API documentation at:
```
http://localhost:3000/api-docs
```

## Authentication

### Register User
- **POST** `/users/register`
- Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login
- **POST** `/users/login`
- Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- Response includes JWT token to be used in subsequent requests

## API Endpoints

### 1. Get All Incidents
- **GET** `/incidents`
- Query Parameters:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10, max: 100)
  - `severity`: Filter by severity (Low/Medium/High)
  - `sort`: Sort field (reported_at/-reported_at/severity/-severity)
- Headers:
  - `Authorization: Bearer <token>`
- Response: 200 OK
```json
{
  "incidents": [
    {
      "id": "1",
      "title": "AI Model Bias Detection",
      "description": "Model showed significant bias in gender classification",
      "severity": "High",
      "reported_at": "2024-03-15T10:30:00Z",
      "reported_by": "user_id"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### 2. Create New Incident
- **POST** `/incidents`
- Headers:
  - `Authorization: Bearer <token>`
- Request Body:
```json
{
  "title": "New Incident Title",
  "description": "Detailed description here",
  "severity": "Medium"
}
```
- Response: 201 Created
```json
{
  "id": "2",
  "title": "New Incident Title",
  "description": "Detailed description here",
  "severity": "Medium",
  "reported_at": "2024-03-15T11:00:00Z",
  "reported_by": "user_id"
}
```

### 3. Get Single Incident
- **GET** `/incidents/:id`
- Headers:
  - `Authorization: Bearer <token>`
- Response: 200 OK
```json
{
  "id": "1",
  "title": "AI Model Bias Detection",
  "description": "Model showed significant bias in gender classification",
  "severity": "High",
  "reported_at": "2024-03-15T10:30:00Z",
  "reported_by": "user_id"
}
```

### 4. Delete Incident (Admin Only)
- **DELETE** `/incidents/:id`
- Headers:
  - `Authorization: Bearer <token>`
- Response: 204 No Content

## Security Features

1. **Rate Limiting**: 100 requests per 15 minutes per IP
2. **Helmet**: Security headers
3. **CORS**: Cross-origin resource sharing
4. **Input Validation**: Request body validation
5. **JWT Authentication**: Secure token-based authentication
6. **Role-based Access Control**: Admin/user roles

## Error Handling

The API includes comprehensive error handling for:
- Invalid request data (400 Bad Request)
- Authentication errors (401 Unauthorized)
- Authorization errors (403 Forbidden)
- Resource not found (404 Not Found)
- Rate limit exceeded (429 Too Many Requests)
- Server errors (500 Internal Server Error)

## Design Decisions

1. **MongoDB**: Chosen for its flexibility with document-based storage and ease of use with Node.js
2. **Express**: Selected for its minimalistic approach and robust middleware ecosystem
3. **Mongoose**: Used as an ODM to provide schema validation and type safety
4. **JWT**: Implemented for stateless authentication
5. **Swagger**: Added for interactive API documentation
6. **Jest**: Used for testing with supertest for HTTP assertions
7. **Helmet**: Implemented for security headers
8. **Morgan**: Added for request logging
9. **Express Rate Limit**: Implemented for API protection

## Sample Data

To populate the database with sample data, you can use MongoDB Compass or the MongoDB shell to insert the following documents:

```javascript
db.incidents.insertMany([
  {
    title: "AI Model Bias Detection",
    description: "Model showed significant bias in gender classification tasks",
    severity: "High",
    reported_at: new Date()
  },
  {
    title: "Data Privacy Breach",
    description: "Unauthorized access to training data",
    severity: "Medium",
    reported_at: new Date()
  }
])
``` 