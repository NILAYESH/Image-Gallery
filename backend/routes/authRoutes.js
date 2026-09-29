const express = require("express");
const {
  signup,
  login,
  getCurrentUser,
  logout,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// User signup
router.post("/signup", signup);

// User login
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/logout", logout);

module.exports = router;