const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

// =====================================================
// ROUTES
// =====================================================

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/aiRoutes");
const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(helmet());

app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Smart Municipality API is running...",
  });
});

// =====================================================
// AUTHENTICATION ROUTES
// =====================================================

app.use("/api/auth", authRoutes);

// =====================================================
// COMPLAINT ROUTES
// =====================================================

app.use("/api/complaints", complaintRoutes);

// =====================================================
// ADMIN ROUTES
// =====================================================

app.use("/api/admin", adminRoutes);

// =====================================================
// USER ROUTES
// =====================================================
// GET    /api/users
// GET    /api/users/:id
// PUT    /api/users/:id
// DELETE /api/users/:id

app.use("/api/users", userRoutes);

// =====================================================
// AI ROUTES
// =====================================================

app.use("/api/ai", aiRoutes);

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("❌ API Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// =====================================================
// EXPORT APP
// =====================================================

module.exports = app;