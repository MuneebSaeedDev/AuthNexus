
const { signupUser, loginUser, deleteUser, getAllUsers } = require("../services/user.service");
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id, role ) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// Set token cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id, user.role);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Cookie expires in 7 days
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const options = {
        expires: expiresAt,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };

    res.status(statusCode).cookie('token', token, options).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        session: {
            issuedAt: decodedToken.iat * 1000,
            expiresAt: decodedToken.exp * 1000,
            duration: '7 Days'
        }
    });
};

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            })
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: 'Email already in use'
            });
        }

        const user = await signupUser({
            name,
            email,
            password,
        });

        return res.status(201).json({
            success: true,
            message: 'Account created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,

            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        console.error("Signup error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await loginUser({ email, password });

        return sendTokenResponse(user, 200, res);

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};



const logout = async (req, res, next) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000), // expires in 10 seconds
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

const fetchAllUsers = async (req, res) => {
    try {
        if (req.user.role !== "super_admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Super Admin only.",
            });
        }

        const users = await getAllUsers();

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });

    } catch (error) {
        console.error("Fetch users error:", error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to fetch users",
        });
    }
};

module.exports = {
    signup,
    login,
    logout,
    fetchAllUsers,
    deleteUserController
};
