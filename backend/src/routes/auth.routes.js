const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/auth.controller");

// Auth Routes
router.post("/register", registerUser);
router.post("/astrologer/register", registerUser); // Alias for backwards compatibility
router.post("/login", loginUser);

module.exports = router;