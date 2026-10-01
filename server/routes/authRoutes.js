const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const router = express.Router();

// =====================================================
// TEST AUTH ROUTE
// GET /api/auth/test
// =====================================================

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication Route Working",
  });
});

// =====================================================
// REGISTER
// POST /api/auth/register
// =====================================================

router.post(
  "/register",
  registerUser
);

// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post(
  "/login",
  loginUser
);

module.exports = router;