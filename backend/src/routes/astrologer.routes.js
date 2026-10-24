const express = require("express");
const router = express.Router();

const {
  getAstrologerProfile,
  updateAstrologerProfile,
  getPublicAstrologers,
} = require("../controllers/astrologer.controller");

// Public API: Get all active & verified astrologers
router.get("/public", getPublicAstrologers);

// Get Profile by Astrologer User ID
router.get("/profile/:userId", getAstrologerProfile);

// Update / Complete Astrologer Profile
router.put("/profile/:userId", updateAstrologerProfile);
router.patch("/profile/:userId", updateAstrologerProfile);

module.exports = router;
