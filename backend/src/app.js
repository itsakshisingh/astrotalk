const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const uploadRoutes = require("./routes/upload.routes");
const adminRoutes = require("./routes/admin.routes");
const astrologerRoutes = require("./routes/astrologer.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static uploads folder (e.g. http://localhost:5000/uploads/profiles/profile-xxx.jpg)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/astrologer", astrologerRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Astrology Backend API is running",
  });
});

// Global Error Handling Middleware (Handles Multer & Route Errors as JSON)
app.use((err, req, res, next) => {
  if (err) {
    console.error("Global Express Error:", err.message);
    return res.status(400).json({
      success: false,
      message: err.message || "An error occurred during request processing",
    });
  }
  next();
});

module.exports = app;