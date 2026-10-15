# Authentication Website — Comprehensive MERN Stack Architecture & Implementation Guide

A robust, production-ready full-stack MERN (MongoDB, Express.js, React, Node.js) authentication application featuring Role-Based Access Control (RBAC), secure HTTP-only JWT cookies, bcrypt password hashing, session persistence, and a responsive Tailwind CSS interface.

---

## 1. Quick Setup & Installation Guide

### Prerequisites
- **Node.js**: v18+ recommended (`node -v`)
- **MongoDB**: Local MongoDB Community Server running on port `27017` or a MongoDB Atlas connection string.

### Backend Setup
Open a PowerShell terminal and navigate to the backend directory:
```powershell
cd backend
npm install
```

Create a `.env` file in `backend/` with the following configuration:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/auth_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend development server (with watch mode):
```powershell
npm run dev
```
*(The API server runs at `http://localhost:5000`)*

### Frontend Setup
Open a **new** PowerShell terminal window and navigate to the frontend directory:
```powershell
cd frontend-react
npm install
```

Start the Vite development server:
```powershell
npm run dev
```
*(The frontend runs at `http://localhost:5173`)*

---

## 2. Project Architecture & Tech Stack & Dependencies Configuration

| Layer / Package | Purpose & Verified Configuration |
|---|---|
| **Node.js & Express** | Server-side runtime and REST API routing framework (`server.js`, `express.json()`, `cookieParser()`) |
| **MongoDB & Mongoose** | NoSQL database storage and schema validation (`config/db.js`, `models/user.model.js`) |
| **bcryptjs** | Secure password hashing with auto-generated salts in Mongoose pre-save hooks |
| **jsonwebtoken (JWT)** | Stateless authentication token generation and verification (`JWT_SECRET`, signed cookies) |
| **cors** | Cross-Origin Resource Sharing middleware configured with `origin: process.env.FRONTEND_URL` and `credentials: true` |
| **React 19 & Vite** | Lightning-fast frontend build tooling and component rendering (`main.jsx`, `App.jsx`) |
| **React Router DOM** | Declarative client-side routing (`ProtectedRoute`, `PublicRoute`, `/dashboard`) |
| **Axios** | HTTP client configured with `baseURL` and `withCredentials: true` (`services/api.js`) |
| **Tailwind CSS** | Utility-first CSS framework for responsive styling (`tailwind.config.js`) |

### End-to-End Request Flow
```
React Component ➔ Axios Service (withCredentials) ➔ Express Server ➔ Auth Middleware (Protect/Admin) ➔ Controller & Service ➔ Mongoose Model ➔ MongoDB
```

---

## 3. Key Features & Business Logic

- **Role-Based Access Control (RBAC)**:
  - **Super Admin (`super_admin`)**: Automatically assigned to the very first registered user in a fresh database. Gains access to the administrative console to view all system accounts, inspect user document metadata, and delete non-admin users.
  - **Standard User (`user`)**: Can register, log in, view personal secure session details, and log out.
- **Secure Authentication Lifecycle**:
  - Passwords are securely hashed with cryptographic salts using `bcryptjs`.
  - Successful logins generate a signed JWT containing user ID and role, delivered via secure `httpOnly` cookies (`sameSite: 'strict'`).
- **Session Persistence**: React `AuthContext` synchronizes with `localStorage` to preserve user authentication state across browser refreshes and page reloads.

---

## 4. Repository Structure

```
authNexus/
├── backend/
│   ├── package.json               # Backend dependencies & scripts
│   └── src/
│       ├── server.js              # Express app entry point & CORS configuration
│       ├── config/db.js          # Mongoose database connection setup
│       ├── models/user.model.js   # User schema, validations & bcrypt hooks
│       ├── controllers/           # Request handlers (auth.controller.js, user.controller.js)
│       ├── middlewares/           # JWT verification & admin authorization middleware
│       ├── routes/                # API routers (auth.routes.js, user.routes.js)
│       └── services/              # Core database query business logic (user.service.js)
└── frontend-react/
    ├── package.json               # Frontend dependencies & Vite scripts
    ├── tailwind.config.js         # Tailwind CSS styling configuration
    └── src/
        ├── App.jsx                # React Router setup & protected route components
        ├── context/AuthContext.jsx # Global auth state, login, signup, logout actions
        ├── services/api.js        # Preconfigured Axios client instance
        └── pages/                 # LoginPage.jsx, SignupPage.jsx, DashboardPage.jsx
```

---

## 5. Complete API Endpoints Reference

| Method | Endpoint | Access Level | Description |
|---|---|---|---|
| **POST** | `/api/v1/auth/signup` | Public | Register a new user account |
| **POST** | `/api/v1/auth/login` | Public | Authenticate user credentials & set HTTP-only cookie |
| **POST** | `/api/v1/auth/logout` | Authenticated | Clear session cookie & terminate session |
| **GET** | `/api/v1/auth/users` | Super Admin (`super_admin`) | Fetch all registered user accounts in the system |
| **DELETE** | `/api/v1/users/:id` | Super Admin (`super_admin`) | Delete a specific non-admin user account by ID |

---

## 6. Detailed Backend Architecture Deep-Dive & Module Configurations

### A. Server Entry Point (`backend/src/server.js`)
The Express application is initialized after configuring dotenv environment variables. Core middleware includes:
- `express.json()` and `express.urlencoded({ extended: true })` for parsing incoming JSON and URL-encoded request payloads.
- `cookie-parser` for reading and writing HTTP cookies.
- `cors` configured with `origin: process.env.FRONTEND_URL` and `credentials: true` to permit cross-port cookie exchange between Vite (`5173`) and Express (`5000`).

### B. Database Connection (`backend/src/config/db.js`)
Establishes a reliable connection to MongoDB using Mongoose with `MONGO_URI`. Includes try/catch error handling that logs connection failures and gracefully terminates the process via `process.exit(1)` if the database is unreachable.

### C. Mongoose Models & Bcrypt Configuration (`backend/src/models/user.model.js`)
Defines the user schema with strict validation rules:
- `name`: Required trimmed string.
- `email`: Required, unique, lowercase string validated via regex.
- `passwordHash`: Required string storing the hashed password.
- `role`: Enum `['user', 'super_admin']` with default `'user'`.
- `timestamps`: Automatically manages `createdAt` and `updatedAt`.
- **Pre-save Hook (`bcryptjs`)**: Automatically hashes plaintext passwords with cryptographic salts whenever the password field is modified.
- **Instance Method (`matchPassword`)**: Compares plaintext login credentials against the stored hash using `bcrypt.compare`.

### D. Authentication Middleware & JWT Configuration (`backend/src/middlewares/auth.middleware.js`)
- `protect`: Extracts JWT tokens (`jsonwebtoken`) from `Authorization: Bearer <token>` or `req.cookies.token`. Verifies the token signature using `JWT_SECRET`, queries the user from MongoDB (excluding password hash), and attaches the user document to `req.user`.
- `superAdminOnly`: Verifies that `req.user.role === 'super_admin'`, rejecting unauthorized standard users with a `403 Forbidden` response.

---

## 7. Detailed Frontend Architecture Deep-Dive & Module Configurations

### A. Axios Client Configuration (`frontend-react/src/services/api.js`)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```
Enabling `withCredentials: true` ensures that HttpOnly authentication cookies are automatically sent with every HTTP request.

### B. React Context & State Management (`frontend-react/src/context/AuthContext.jsx`)
Acts as the global state hub for authentication:
- Initializes `user` state from `localStorage` to persist sessions across page reloads.
- Provides memoized actions: `login`, `signup`, `logout`, `AllUsersFetch`, `deleteUserById`, and `fetchUserById`.
- Synchronizes state changes with `localStorage` via React `useEffect`.

### C. Protected Routing & React Router DOM (`frontend-react/src/App.jsx`)
- Uses `react-router-dom` to manage client-side views (`/login`, `/signup`, `/dashboard`).
- `ProtectedRoute`: Wraps dashboard components, verifying if `user` is authenticated; redirects unauthenticated visitors to `/login`.
- `DashboardPage.jsx`: Conditionally renders the Super Admin Management Console when `user.role === 'super_admin'`, displaying user statistics, data tables, and deletion triggers. Standard users see their profile and session metadata card.

---

## 8. Troubleshooting & Common Issues

- **MongoDB Connection Failure**: 
  - *Cause*: MongoDB service is not running locally or URI is incorrect.
  - *Fix*: Start local MongoDB (`net start MongoDB`) or verify your MongoDB Atlas connection string in `backend/.env`.
- **CORS or Cookie Issues**: 
  - *Cause*: Cross-origin cookie blocked between `5173` and `5000`.
  - *Fix*: Ensure `backend/server.js` has `origin: 'http://localhost:5173'` with `credentials: true`, and frontend `api.js` has `withCredentials: true`.
- **403 Forbidden on Admin Console**: 
  - *Cause*: Logged-in user has role `user` instead of `super_admin`.
  - *Fix*: Register a fresh account (first account automatically receives Super Admin privileges) or update the user role directly in MongoDB.
- **Port In Use (`EADDRINUSE`)**: 
  - *Cause*: Another Node process is occupying port `5000` or `5173`.
  - *Fix*: Terminate existing node terminal instances or change the `PORT` variable in `backend/.env`.
