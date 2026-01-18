# Cine Kandy Films - Backend API

Node.js + Express + MongoDB backend API.

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```
MONGODB_URI=mongodb://localhost:27017/cinekandy
JWT_SECRET=your_secret_key
PORT=5000
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## API Endpoints

- `/api/gallery` - Gallery management
- `/api/blog` - Blog posts
- `/api/contact` - Contact forms
- `/api/admin` - Admin authentication

## Features

- JWT authentication
- File upload with Multer
- MongoDB with Mongoose
- RESTful API
- CORS enabled
- Error handling
- Password hashing

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Multer
