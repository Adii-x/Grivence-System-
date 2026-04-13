# Nexus - Student Grievance Management System

A full-stack web application for submitting, tracking, and managing student grievances across departments.

## Overview

Nexus provides a role-based workflow for:
- **Students** to submit and track complaints
- **Staff** to manage assigned complaints and update status
- **Admins** to monitor complaints and department-level performance

The project is split into:
- `Frontend/` - React + TypeScript + Vite client
- `Backend/` - Node.js + Express + MongoDB API

## Core Features

- Role-based authentication (`student`, `staff`, `admin`)
- Complaint submission with optional attachment upload
- Complaint lifecycle tracking (`Pending`, `In Progress`, `Resolved`, `Escalated`)
- Staff assignment and operational status updates
- Admin analytics and department insights
- Protected routes and JWT-based API security

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Hook Form
- Axios

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- Express Validator
- Helmet + Rate Limiting + CORS
- Multer + ImageKit integration for file uploads

## Project Structure

```text
Student Grivence Sys/
|-- Frontend/
|   |-- src/
|   |-- package.json
|-- Backend/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- services/
|   |-- server.js
|   |-- .env.example
|   |-- package.json
|-- README.md
```

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+
- MongoDB database (Atlas or local)

## Environment Variables

Create `Backend/.env` from `Backend/.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRE=7d
ALLOWED_ORIGIN=http://localhost:8080
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=
```

Notes:
- `ALLOWED_ORIGIN` is required by backend startup for secure CORS.
- Never commit `.env` to source control.

## Local Setup

### 1) Install dependencies

```bash
cd Backend && npm install
cd ../Frontend && npm install
```

### 2) Start backend

```bash
cd Backend
npm run dev
```

Backend runs on `http://localhost:5000` by default.

### 3) Start frontend

```bash
cd Frontend
npm run dev
```

Frontend runs on Vite dev server (commonly `http://localhost:8080`).

## Available Scripts

### Backend (`Backend/package.json`)
- `npm run dev` - Start backend with nodemon
- `npm start` - Start backend in production mode
- `npm run seed:users` - Seed test users for local testing

### Frontend (`Frontend/package.json`)
- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run build:dev` - Development-mode build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests once
- `npm run test:watch` - Run tests in watch mode

## API Base Routes

All backend routes are prefixed with `/api`:
- `/api/auth`
- `/api/complaints`
- `/api/staff`
- `/api/admin`
- `/api/health`

## Security Checklist Before Public Release

- Keep secrets only in local/deployment env vars
- Ensure `Backend/.env` is never committed
- Rotate any previously exposed credentials before publishing
- Set strict production `ALLOWED_ORIGIN`
- Remove or disable demo/test credentials in production UI

## Deployment Notes

- Build frontend using `npm run build` in `Frontend/`
- Set backend environment variables in your hosting platform
- Ensure frontend API base URL points to your deployed backend (`VITE_API_BASE_URL`)

## License

This project is currently unlicensed. Add a `LICENSE` file before public distribution if needed.

## Acknowledgements

Built for academic grievance management workflows with a focus on secure role-based operations and a modern UI experience.
