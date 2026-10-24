const express = require("express");
const router = express.Router();
const { uploadProduct } = require("../middleware/upload.middleware");

const {
  createProduct,
  getAllProducts,
  getProductByIdOrSlug,
  updateProduct,
  deleteProduct,
  getProductsByCreator,
} = require("../controllers/product.controller");

// Product Routes

// 1. Create a new product (Supports direct image file upload in form-data!)
router.post("/", uploadProduct.any(), createProduct);

// 2. Get all products (With filters)
router.get("/", getAllProducts);

// 3. Get products by creator User ID
router.get("/creator/:userId", getProductsByCreator);

// 4. Get product by ID or Slug
router.get("/:idOrSlug", getProductByIdOrSlug);

// 5. Update Product (Supports direct image file upload in form-data!)
router.put("/:id", uploadProduct.any(), updateProduct);
router.patch("/:id", uploadProduct.any(), updateProduct);

// 6. Delete Product
router.delete("/:id", deleteProduct);

module.exports = router;
