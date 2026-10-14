const dotenv = require('dotenv');
// Load env vars first
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require("./routes/user.routes");
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS config for frontend credentials
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes)

const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
});
