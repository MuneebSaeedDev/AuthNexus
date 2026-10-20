const { OAuth2Client } = require("google-auth-library");
const { getAllUsers } = require("../services/user.service");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// FIX: Initialize googleClient here!
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id, role) => {
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
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    res.status(statusCode)
        .cookie("token", token, options)
        .json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            session: {
                issuedAt: decodedToken.iat * 1000,
                expiresAt: decodedToken.exp * 1000,
                duration: "7 Days",
            },
        });
};

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email and password",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered",
            });
        }

        const existingUsersCount = await User.countDocuments();

        const user = await User.create({
            name,
            email: normalizedEmail,
            passwordHash: password,
            role: existingUsersCount === 0 ? "super_admin" : "user",
            authProvider: "local",
        });

        return sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create account",
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (user.authProvider === "google" && !user.passwordHash) {
            return res.status(401).json({
                success: false,
                message: "This account uses Google Sign-In. Please continue with Google.",
            });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        return sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google credential is required",
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (
            !payload ||
            !payload.sub ||
            !payload.email ||
            !payload.email_verified
        ) {
            return res.status(401).json({
                success: false,
                message: "Google account verification failed",
            });
        }

        const googleId = payload.sub;
        const email = payload.email.toLowerCase().trim();
        const name = payload.name || "Google User";

        let user = await User.findOne({
            $or: [{ googleId }, { email }],
        });

        if (!user) {
            const existingUsersCount = await User.countDocuments();

            user = await User.create({
                name,
                email,
                googleId,
                role: existingUsersCount === 0 ? "super_admin" : "user",
                authProvider: "google",
            });
        } else {
            if (user.googleId && user.googleId !== googleId) {
                return res.status(409).json({
                    success: false,
                    message: "This email is linked to another Google account",
                });
            }

            if (!user.googleId) {
                user.googleId = googleId;
                await user.save({ validateModifiedOnly: true });
            }
        }

        return sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error("Google login error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Account already exists. Please try again.",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Google authentication failed",
        });
    }
};


const logout = async (req, res, next) => {
    try {
        res.cookie("token", "none", {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({ message: "Logged out successfully" });
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
    googleLogin,
};