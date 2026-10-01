const express = require("express");

const router = express.Router();

router.get("/dashboard", async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        totalComplaints: 125,
        pending: 18,
        resolved: 102,
        critical: 5,
        citizens: 542,
        departments: 6,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;