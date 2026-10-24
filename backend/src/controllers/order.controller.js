const Order = require("../models/order.model");

// Create New Order (Checkout)
exports.createOrder = async (req, res) => {
  try {
    const { customerInfo, items, totalAmount, paymentMethod, userId } = req.body;

    if (
      !customerInfo ||
      !customerInfo.fullName ||
      !customerInfo.phone ||
      !customerInfo.address ||
      !customerInfo.city ||
      !customerInfo.state ||
      !customerInfo.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Full Name, Phone, Address, City, State, and Pincode are required.",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Please add items to checkout.",
      });
    }

    const generatedOrderId = "ORD-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000);

    const newOrder = new Order({
      orderId: generatedOrderId,
      user: req.user ? req.user._id : (userId && userId.length === 24 ? userId : null),
      customerInfo: {
        fullName: customerInfo.fullName,
        email: customerInfo.email ? customerInfo.email.trim().toLowerCase() : "",
        phone: customerInfo.phone ? customerInfo.phone.trim() : "",
        alternatePhone: customerInfo.alternatePhone || "",
        address: customerInfo.address,
        landmark: customerInfo.landmark || "",
        city: customerInfo.city,
        state: customerInfo.state,
        country: customerInfo.country || "India",
        pincode: customerInfo.pincode,
        addressType: customerInfo.addressType || "HOME",
      },
      items: items.map((item) => ({
        product: item.id && item.id.length === 24 ? item.id : null,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "",
      })),
      totalAmount: Number(totalAmount) || items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0),
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "ONLINE" ? "COMPLETED" : "PENDING",
      orderStatus: "PLACED",
    });

    await newOrder.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error while processing checkout.",
      error: error.message,
    });
  }
};

// Get User Orders (by User ID, Phone, or Email)
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email, phone } = req.query;

    const queryConditions = [];

    if (userId && userId !== "guest" && userId !== "null" && userId.length === 24) {
      queryConditions.push({ user: userId });
    }

    if (email && email.trim() !== "") {
      const lowerEmail = email.trim().toLowerCase();
      // Case-insensitive regex match for email
      queryConditions.push({ "customerInfo.email": { $regex: new RegExp(`^${lowerEmail}$`, "i") } });
    }

    if (phone && phone.trim() !== "") {
      const cleanPhone = phone.trim();
      // Match raw phone or stripped digits match
      queryConditions.push({ "customerInfo.phone": cleanPhone });
      queryConditions.push({ "customerInfo.phone": { $regex: cleanPhone.replace(/^\+91/, "").trim() } });
    }

    let orders = [];
    if (queryConditions.length > 0) {
      orders = await Order.find({ $or: queryConditions }).sort({ createdAt: -1 });
    } else {
      // Fallback: If no query provided, return all orders to ensure user sees recent orders
      orders = await Order.find().sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user orders.",
      error: error.message,
    });
  }
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
      error: error.message,
    });
  }
};

// Get Single Order by Order ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order detail.",
      error: error.message,
    });
  }
};

// Update Order Status (Admin / Astrologer)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // MongoDB _id
    const { orderStatus, paymentStatus } = req.body;

    const allowedOrderStatuses = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    const allowedPaymentStatuses = ["PENDING", "COMPLETED", "FAILED"];

    if (orderStatus && !allowedOrderStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid orderStatus. Must be one of: ${allowedOrderStatuses.join(", ")}`,
      });
    }

    if (paymentStatus && !allowedPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid paymentStatus. Must be one of: ${allowedPaymentStatuses.join(", ")}`,
      });
    }

    const updateFields = {};
    if (orderStatus) updateFields.orderStatus = orderStatus;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least orderStatus or paymentStatus to update.",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status.",
      error: error.message,
    });
  }
};


