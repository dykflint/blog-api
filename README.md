# Blog API with Public and Admin Frontends

A full-stack blog platform featuring a RESTful API backend, a public-facing blog frontend, and an authenticated admin dashboard for content management.

This project demonstrates authentication, authorization, role-based access control, and clean separation between public and administrative interfaces.

---

## Features

### Public Blog

- View published blog posts
- Browse posts by category
- Read full post content
- Create comments as a guest or authenticated user
- View comment threads per post

### Admin Dashboard

- JWT-based authentication
- Role-based authorization (Admin / Author)
- Create, edit, publish, and delete posts
- Manage categories (CRUD)
- Moderate and delete comments
- Toggle post published status

### Backend API

- RESTful API architecture
- Secure authentication with JWT
- Password hashing with bcrypt
- Prisma ORM with relational models
- PostgreSQL database
- Middleware-based authorization
- Clean separation of routes, controllers, and middleware

---

## Tech Stack

### Frontend

- React
- React Router
- Fetch API
- Vite

### Backend

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT)
- bcrypt

---

## Project Structure

```text
backend/
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── prisma/
│   ├── app.js
│   └── index.js

admin-frontend/
├── src/
│   ├── pages/
│   ├── utils/
│   └── App.jsx

public-frontend/
├── src/
│   ├── pages/
│   ├── components/
│   └── App.jsx
```

---

## Authentication and Authorization

- Users authenticate via username and password
- Passwords are hashed using bcrypt
- JWT tokens are issued on login
- Tokens are required for protected routes
- Role-based access control:
  - Admin: full access
  - Author: manage own posts
  - Public: read-only access

---

## API Endpoints

### Authentication

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

### Posts

- GET /api/posts
- GET /api/posts/:id
- POST /api/posts
- PUT /api/posts/:id
- DELETE /api/posts/:id

### Categories

- GET /api/categories
- GET /api/categories/:id
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id

### Comments

- GET /api/posts/:postId/comments
- POST /api/posts/:postId/comments
- PUT /api/posts/comments/:id
- DELETE /api/posts/comments/:id

---

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- npm

### Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

Create a .env file with the following:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/blog
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

### Admin Frontend

```bash
cd admin-frontend
npm install
npm run dev
```

### Public Frontend

```bash
cd public-frontend
npm install
npm run dev
```

---

## Database Notes

- Posts are linked to authors and categories
- Comments support both authenticated users and anonymous guests
- Published state is enforced server-side
- Authorization checks are handled in middleware

---

## What This Project Demonstrates

- Full-stack application architecture
- Secure authentication and authorization
- Role-based permissions
- REST API design
- Separation of concerns
- Real-world admin dashboard workflows

---

## License

This project is open source and available under the MIT License.
