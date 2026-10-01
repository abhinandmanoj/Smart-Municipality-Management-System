const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    // =====================================================
    // COMPLAINT ID
    // =====================================================
    complaintId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    // =====================================================
    // COMPLAINT TITLE
    // =====================================================
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // CITIZEN DETAILS
    // =====================================================
    citizenName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // CATEGORY
    // =====================================================
    category: {
      type: String,
      required: true,
      enum: [
        "Garbage",
        "Road Damage",
        "Water Supply",
        "Street Light",
        "Drainage",
        "Health",
        "Other",
      ],
    },

    // =====================================================
    // DESCRIPTION
    // =====================================================
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // LOCATION
    // =====================================================
    location: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================================
    // COMPLAINT IMAGE
    // =====================================================
    image: {
      type: String,
      default: "",
    },

    // =====================================================
    // DEPARTMENT
    // =====================================================
    department: {
      type: String,
      enum: [
        "Road & Transport",
        "Waste Management",
        "Water Supply",
        "Electrical",
        "Drainage & Sewage",
        "Public Health",
        "Parks & Public Spaces",
        "Not Assigned",
      ],
      default: "Not Assigned",
      trim: true,
    },

    // =====================================================
    // ASSIGNED OFFICER
    // =====================================================
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedOfficerName: {
      type: String,
      default: "",
      trim: true,
    },

    assignedOfficerEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    // =====================================================
    // PRIORITY
    // =====================================================
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    // =====================================================
    // STATUS
    // =====================================================
    status: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "In Progress",
        "Resolved",
        "Rejected",
      ],
      default: "Pending",
    },

    // =====================================================
    // OFFICER WORK DETAILS
    // =====================================================

    // Notes written while working at the location
    officerNotes: {
      type: String,
      default: "",
      trim: true,
    },

    // Final explanation after solving the complaint
    resolutionNotes: {
      type: String,
      default: "",
      trim: true,
    },

    // Date and time complaint was resolved
    resolvedAt: {
      type: Date,
      default: null,
    },

    // =====================================================
    // AI PREDICTION (existing — do not remove)
    // =====================================================
    aiPrediction: {
      category: {
        type: String,
        default: "",
      },

      confidence: {
        type: Number,
        default: 0,
      },

      suggestedDepartment: {
        type: String,
        default: "",
      },
    },

    // =====================================================
    // COMPLETION PROOF — NEW (Officer uploads after resolve)
    // =====================================================
    completionProof: {
      image: {
        type: String,
        default: "",
      },
      remarks: {
        type: String,
        default: "",
        trim: true,
      },
      submittedAt: {
        type: Date,
        default: null,
      },
    },


    // =====================================================
    // COMPLETION PROOF PHOTO
    // =====================================================
    completionProofImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Complaint",
  complaintSchema
);