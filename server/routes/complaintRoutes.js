const express = require("express");

const router = express.Router();

const {
  createComplaint,
  getComplaints,
  getComplaintsByUser,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
} = require("../controllers/complaintController");


// =====================================================
// CREATE
// POST /api/complaints
// =====================================================

router.post(
  "/",
  createComplaint
);


// =====================================================
// GET ALL
// GET /api/complaints
// =====================================================

router.get(
  "/",
  getComplaints
);


// =====================================================
// GET USER COMPLAINTS
// GET /api/complaints/user/:email
// =====================================================

router.get(
  "/user/:email",
  getComplaintsByUser
);


// =====================================================
// GET SINGLE COMPLAINT
// GET /api/complaints/:id
// =====================================================

router.get(
  "/:id",
  getComplaintById
);


// =====================================================
// UPDATE COMPLAINT
// PUT /api/complaints/:id
// =====================================================

router.put(
  "/:id",
  updateComplaint
);


// =====================================================
// UPDATE STATUS
// PUT /api/complaints/:id/status
// =====================================================

router.put(
  "/:id/status",
  updateComplaintStatus
);


// =====================================================
// DELETE
// DELETE /api/complaints/:id
// =====================================================

router.delete(
  "/:id",
  deleteComplaint
);


module.exports = router;