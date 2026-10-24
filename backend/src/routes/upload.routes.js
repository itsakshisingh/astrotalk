const express = require("express");
const router = express.Router();
const { uploadProfile, uploadProduct, uploadCertificate } = require("../middleware/upload.middleware");
const {
  uploadProfileImage,
  uploadSingleProductImage,
  uploadMultipleProductImages,
  uploadCertificateImages,
} = require("../controllers/upload.controller");

// Profile Image Upload Route
router.post(
  "/profile-image",
  uploadProfile.single("profileImage"),
  uploadProfileImage
);

// Single Product Image Upload Route
router.post(
  "/product-image",
  uploadProduct.single("productImage"),
  uploadSingleProductImage
);

// Multiple Product Images Upload Route (Up to 5 images)
router.post(
  "/product-images",
  uploadProduct.array("productImages", 5),
  uploadMultipleProductImages
);

// Certificate Images Upload Route (Unlimited images per request)
router.post(
  "/certificate-images",
  uploadCertificate.array("certificateImages"),
  uploadCertificateImages
);

module.exports = router;
