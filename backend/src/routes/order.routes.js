const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

// POST /api/orders/checkout - Place new order
router.post("/checkout", orderController.createOrder);

// GET /api/orders/user/:userId - Get orders for a specific user
router.get("/user/:userId", orderController.getUserOrders);

// GET /api/orders - Get all orders
router.get("/", orderController.getAllOrders);

// GET /api/orders/:id - Get single order detail
router.get("/:id", orderController.getOrderById);

// PATCH /api/orders/:id/status - Update order status (Admin / Astrologer)
router.patch("/:id/status", orderController.updateOrderStatus);

module.exports = router;
