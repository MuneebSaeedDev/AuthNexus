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


const getAllUsers = async () => {
    const users = await User.find()
        .select("-passwordHash")
        .sort({ createdAt: -1 });

    return users;
};

module.exports = { signupUser, loginUser, deleteUser, getAllUsers };
