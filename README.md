# Authentication App — Light Theme Rebuild

A clean, modern authentication application built with a responsive single-tenant frontend and a robust backend. The project focuses exclusively on secure Signup, Login, and Logout flows without unnecessary enterprise cruft.

## Tech Stack

**Backend:**
- Node.js & Express
- MongoDB with Mongoose
- bcryptjs for password hashing
- JSON Web Tokens (JWT) via HttpOnly cookies

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios (configured for credentials)

## Features

- **Pristine Architecture:** Clean separation of concerns with a single-tenant design.
- **Light Theme UI:** A beautiful, responsive split-screen layout with an orange accent (#f97316).
- **Secure Authentication:** JWT tokens are stored securely in HttpOnly cookies to mitigate XSS attacks.
- **Robust Error Handling:** Comprehensive global error handler for Mongoose validation and authentication failures.

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas connection string
- npm or yarn

## Getting Started

### 1. Database Setup

Ensure MongoDB is running locally on port 27017, or obtain a MongoDB URI.

### 2. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://[IP_REDACTED]:27017/auth_api
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend-react
npm install
```

Configuration is already handled via Axios and the proxy/baseURL pointing to `http://localhost:5000/api/v1`.

Start the frontend development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Testing the Application

1. **Signup:** Navigate to `http://localhost:5173/signup`. Create an account. Verify that duplicate emails are gracefully rejected and that you are logged in automatically.
2. **Login:** Navigate to `http://localhost:5173/login`. Enter valid credentials to log in and be redirected to the Dashboard. Test with invalid credentials to see the error alert.
3. **Logout:** From the Dashboard (`http://localhost:5173/dashboard`), click the Logout button to clear your session (HttpOnly cookie) and return to the login screen.
4. **Health Check:** Ping `http://localhost:5000/healthz` to verify the backend is running properly.
