const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =====================================================
    // USER NAME
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // EMAIL
    // =====================================================

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // =====================================================
    // PASSWORD
    // =====================================================

    password: {
      type: String,
      required: true,
    },

    // =====================================================
    // ROLE
    // =====================================================

    role: {
      type: String,
      enum: [
        "Citizen",
        "Officer",
        "Department Head",
        "Admin",
      ],
      default: "Citizen",
    },

    // =====================================================
    // DEPARTMENT
    // =====================================================

    department: {
      type: String,
      enum: [
        "",
        "Road & Transport",
        "Waste Management",
        "Water Supply",
        "Electrical",
        "Drainage & Sewage",
        "Public Health",
        "Parks & Public Spaces",
      ],
      default: "",
      trim: true,
    },

    // =====================================================
    // PHONE
    // =====================================================

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // =====================================================
    // PROFILE IMAGE
    // =====================================================

    profileImage: {
      type: String,
      default: "",
    },

    // =====================================================
    // ACCOUNT STATUS
    // =====================================================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);