const express = require('express');
const { signup, login, logout, deleteUserController, fetchAllUsers } = require('../controllers/auth.controller');
const { protect, superAdminOnly } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/users', protect, fetchAllUsers);
module.exports = router;
