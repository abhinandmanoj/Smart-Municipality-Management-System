const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =====================================================
// ALLOWED DEPARTMENTS
// =====================================================

const ALLOWED_DEPARTMENTS = [
  "Road & Transport",
  "Waste Management",
  "Water Supply",
  "Electrical",
  "Drainage & Sewage",
  "Public Health",
  "Parks & Public Spaces",
];

// =====================================================
// ALLOWED ROLES
// =====================================================

const ALLOWED_ROLES = [
  "Citizen",
  "Officer",
  "Department Head",
  "Admin",
];

// =====================================================
// REGISTER USER
// PUBLIC REGISTRATION = CITIZEN ONLY
// =====================================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, Email and Password are required.",
      });
    }

    // =================================================
    // NORMALIZE EMAIL
    // =================================================

    const normalizedEmail =
      email.toLowerCase().trim();

    // =================================================
    // CHECK EXISTING USER
    // =================================================

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    // =================================================
    // HASH PASSWORD
    // =================================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // =================================================
    // CREATE CITIZEN
    //
    // Public registration can ONLY create citizens.
    // Officers are created by the municipality/admin.
    // =================================================

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "Citizen",
      department: "",
      phone: phone || "",
      isActive: true,
    });

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(201).json({
      success: true,
      message: "Registration Successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        department: user.department,
        profileImage: user.profileImage,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Registration Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =====================================================
// LOGIN USER
// =====================================================

const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and Password are required.",
      });
    }

    // =================================================
    // NORMALIZE EMAIL
    // =================================================

    const normalizedEmail =
      email.toLowerCase().trim();

    // =================================================
    // FIND USER
    // =================================================

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Email or Password.",
      });
    }

    // =================================================
    // CHECK ACCOUNT STATUS
    // =================================================

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been deactivated.",
      });
    }

    // =================================================
    // CHECK PASSWORD
    // =================================================

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Email or Password.",
      });
    }

    // =================================================
    // CHECK JWT SECRET
    // =================================================

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message:
          "JWT_SECRET is not configured in .env",
      });
    }

    // =================================================
    // OFFICER DEPARTMENT VALIDATION
    // =================================================

    if (user.role === "Officer") {
      if (
        !user.department ||
        !ALLOWED_DEPARTMENTS.includes(
          user.department
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Officer account does not have a valid department assigned.",
        });
      }
    }

    // =================================================
    // DEPARTMENT HEAD VALIDATION
    // =================================================

    if (user.role === "Department Head") {
      if (
        !user.department ||
        !ALLOWED_DEPARTMENTS.includes(
          user.department
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Department Head account does not have a valid department assigned.",
        });
      }
    }

    // =================================================
    // GENERATE JWT
    // =================================================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        department:
          user.department || "",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message: "Login Successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        department:
          user.department || "",
        profileImage:
          user.profileImage || "",
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL USERS
// =====================================================

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(
      "Get Users Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE USER
// =====================================================

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(
      "Get User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE USER
// =====================================================

const updateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role,
      department,
      profileImage,
      isActive,
    } = req.body;

    // =================================================
    // FIND USER
    // =================================================

    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // =================================================
    // NAME
    // =================================================

    if (name !== undefined) {
      user.name = name.trim();
    }

    // =================================================
    // EMAIL
    // =================================================

    if (email !== undefined) {
      const normalizedEmail =
        email.toLowerCase().trim();

      const existingUser =
        await User.findOne({
          email: normalizedEmail,
          _id: {
            $ne: req.params.id,
          },
        });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message:
            "Another user already uses this email.",
        });
      }

      user.email = normalizedEmail;
    }

    // =================================================
    // PHONE
    // =================================================

    if (phone !== undefined) {
      user.phone = phone;
    }

    // =================================================
    // ROLE
    // =================================================

    if (role !== undefined) {
      if (!ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role.",
        });
      }

      user.role = role;
    }

    // =================================================
    // DEPARTMENT
    // =================================================

    if (department !== undefined) {
      if (
        department !== "" &&
        !ALLOWED_DEPARTMENTS.includes(
          department
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid department.",
        });
      }

      user.department = department;
    }

    // =================================================
    // PROFILE IMAGE
    // =================================================

    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    // =================================================
    // ACCOUNT STATUS
    // =================================================

    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    // =================================================
    // SAVE
    // =================================================

    await user.save();

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message:
        "User updated successfully.",

      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        department:
          user.department,
        profileImage:
          user.profileImage,
        isActive:
          user.isActive,
        createdAt:
          user.createdAt,
        updatedAt:
          user.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Update User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE USER
// =====================================================

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await User.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "User deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};