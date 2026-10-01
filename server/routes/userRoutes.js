const express = require("express");

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

/* =====================================================
   USER ROUTES
   Base URL:
   /api/users
===================================================== */


/* =====================================================
   GET ALL USERS
   GET /api/users
===================================================== */

router.get("/", getUsers);


/* =====================================================
   GET SINGLE USER
   GET /api/users/:id
===================================================== */

router.get("/:id", getUserById);


/* =====================================================
   UPDATE USER
   PUT /api/users/:id
===================================================== */

router.put("/:id", updateUser);


/* =====================================================
   DELETE USER
   DELETE /api/users/:id
===================================================== */

router.delete("/:id", deleteUser);


/* =====================================================
   EXPORT ROUTER
===================================================== */

module.exports = router;