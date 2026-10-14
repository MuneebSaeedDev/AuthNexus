const bcrypt = require('bcryptjs')

const User = require("../models/user.model");

const signupUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({});

    const role = existingUser ? "user" : "super_admin";

    const user = await User.create({ name, email, passwordHash: password, role });

    return user;
};

const loginUser = async ({ email, password }) => {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }
    const isPasswordValid = await existingUser.matchPassword(password);
    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    return existingUser;
};

const deleteUser = async ({ id, requester }) => {
    if (requester.role !== "super_admin") {
        const error = new Error("Only Super Admin can delete users");
        error.statusCode = 403;
        throw error;
    }

    const existingUser = await User.findById(id);

    if (!existingUser) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (existingUser.role === "super_admin") {
        const error = new Error("Super Admin cannot be deleted");
        error.statusCode = 403;
        throw error;
    }

    await User.findByIdAndDelete(id);

    return {
        message: "User successfully deleted",
    };
};


const getUserById = async (id) => {
    const user = await User.findById(id)
        .select("name email role createdAt");

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};


const getAllUsers = async () => {
    const users = await User.find()
        .select("-passwordHash")
        .sort({ createdAt: -1 });

    return users;
};

module.exports = { signupUser, loginUser, deleteUser, getUserById, getAllUsers };
