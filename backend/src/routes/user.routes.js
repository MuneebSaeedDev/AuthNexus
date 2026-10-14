
const express = require("express");
const router = express.Router();
const { protect, superAdminOnly } = require("../middlewares/auth.middleware");
const { getUserById, deleteUserController } = require("../controllers/user.controller");

router.get("/:id", protect, superAdminOnly, getUserById);
router.delete("/:id", protect, superAdminOnly, deleteUserController);

module.exports = router;