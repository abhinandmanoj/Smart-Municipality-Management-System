const Complaint = require("../models/Complaint");
const mongoose = require("mongoose");


// =====================================================
// VALID DEPARTMENTS (must match Complaint.js enum exactly)
// =====================================================

const VALID_DEPARTMENTS = [
  "Road & Transport",
  "Waste Management",
  "Water Supply",
  "Electrical",
  "Drainage & Sewage",
  "Public Health",
  "Parks & Public Spaces",
];

// Maps AI category → exact department name
const CATEGORY_TO_DEPT = {
  "Road Damage":  "Road & Transport",
  "Garbage":      "Waste Management",
  "Water Supply": "Water Supply",
  "Street Light": "Electrical",
  "Drainage":     "Drainage & Sewage",
  "Health":       "Public Health",
  "Other":        null,
};

// Normalises fuzzy AI text to an exact department name (or null)
function normaliseDepartment(raw) {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();

  // Exact match first
  if (VALID_DEPARTMENTS.includes(trimmed)) return trimmed;

  // Case-insensitive fuzzy match
  const lower = trimmed.toLowerCase();
  if (lower.includes("road") || lower.includes("transport") || lower.includes("pothole"))
    return "Road & Transport";
  if (lower.includes("waste") || lower.includes("garbage") || lower.includes("trash"))
    return "Waste Management";
  if (lower.includes("water"))
    return "Water Supply";
  if (lower.includes("electric") || lower.includes("street light") || lower.includes("light"))
    return "Electrical";
  if (lower.includes("drain") || lower.includes("sewage") || lower.includes("sewer"))
    return "Drainage & Sewage";
  if (lower.includes("health") || lower.includes("mosquito") || lower.includes("sanitation"))
    return "Public Health";
  if (lower.includes("park") || lower.includes("playground") || lower.includes("public space"))
    return "Parks & Public Spaces";

  return null;
}

// =====================================================
// GROQ AI DEPARTMENT CLASSIFICATION
// Runs AFTER complaint is saved — never blocks creation
// =====================================================

async function classifyDepartmentWithGroq(complaintId, title, category, description) {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) return;

  const prompt = `You are a municipal complaint classifier. Given a civic complaint, return ONLY a JSON object with no extra text.

Complaint Title: ${title}
Category: ${category}
Description: ${description}

Choose exactly ONE department from this list:
- Road & Transport
- Waste Management
- Water Supply
- Electrical
- Drainage & Sewage
- Public Health
- Parks & Public Spaces

Respond ONLY with this JSON (no markdown, no explanation):
{"department":"<chosen department>","category":"<complaint category>","priority":"<Low|Medium|High>","confidence":<0-100>,"reason":"<one sentence>"}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen3.8-27b",
        messages: [
          { role: "system", content: "You classify municipal complaints into departments. Always respond with valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      console.error("Groq department classification failed:", response.status);
      return;
    }

    const data = await response.json();
    let rawText = data.choices[0].message.content.trim();

    // Strip markdown fences if present
    rawText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (_) {
      console.error("Groq returned non-JSON for department:", rawText);
      return;
    }

    const aiDepartment = normaliseDepartment(parsed.department);
    if (!aiDepartment) {
      console.warn("Groq returned unrecognised department:", parsed.department);
      return;
    }

    // Build aiPrediction from category map or AI-returned category
    const aiCategory = parsed.category || category || "";
    const aiPriority = ["Low", "Medium", "High"].includes(parsed.priority) ? parsed.priority : null;

    const updateData = {
      department: aiDepartment,
      "aiPrediction.suggestedDepartment": aiDepartment,
      "aiPrediction.category": aiCategory,
      "aiPrediction.confidence": typeof parsed.confidence === "number" ? parsed.confidence : 0,
    };
    if (aiPriority) {
      updateData["aiPrediction.priority"] = aiPriority;
    }

    await Complaint.findByIdAndUpdate(complaintId, updateData);

    console.log(`AI Department assigned to ${complaintId}: ${aiDepartment}`);

  } catch (err) {
    // Groq failure must NEVER crash or affect complaint creation
    console.error("Groq classification error (non-blocking):", err.message);
  }
}


// =====================================================
// CREATE COMPLAINT
// =====================================================

const createComplaint = async (req, res) => {
  try {
    const {
      title,
      citizenName,
      email,
      phone,
      category,
      description,
      location,
      image,
      priority,
    } = req.body;

    if (
      !title ||
      !citizenName ||
      !email ||
      !phone ||
      !category ||
      !description ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required complaint details.",
      });
    }

    const randomNumber = Math.floor(
      1000 + Math.random() * 9000
    );

    const complaintId = `CMP${randomNumber}`;

    // Fallback department from category before AI runs
    const fallbackDept = CATEGORY_TO_DEPT[category] || "Not Assigned";

    const complaint = new Complaint({
      complaintId,
      title,
      citizenName,
      email: email.toLowerCase(),
      phone,
      category,
      description,
      location,
      image: image || "",
      priority: priority || "Medium",
      department: fallbackDept,
      status: "Pending",
    });

    const savedComplaint = await complaint.save();

    // Respond immediately — AI runs in background, never blocks the response
    res.status(201).json({
      success: true,
      message: "Complaint registered successfully",
      data: savedComplaint,
    });

    // Run Groq classification after responding (non-blocking)
    classifyDepartmentWithGroq(
      savedComplaint._id,
      title,
      category,
      description
    );

  } catch (error) {
    console.error("Create Complaint Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET ALL COMPLAINTS
// =====================================================

const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate(
        "assignedOfficer",
        "name email phone department role"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });

  } catch (error) {
    console.error("Get Complaints Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET COMPLAINTS BY USER
// =====================================================

const getComplaintsByUser = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const complaints = await Complaint.find({
      email: email.toLowerCase(),
    })
      .populate(
        "assignedOfficer",
        "name email phone department role"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });

  } catch (error) {
    console.error(
      "Get User Complaints Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET SINGLE COMPLAINT
// =====================================================

const getComplaintById = async (req, res) => {
  try {
    const id = req.params.id;

    let complaint = null;

    // Check MongoDB _id
    if (mongoose.Types.ObjectId.isValid(id)) {
      complaint = await Complaint.findById(id).populate(
        "assignedOfficer",
        "name email phone department role"
      );
    }

    // Check custom complaint ID
    if (!complaint) {
      complaint = await Complaint.findOne({
        complaintId: id,
      }).populate(
        "assignedOfficer",
        "name email phone department role"
      );
    }

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: complaint,
    });

  } catch (error) {
    console.error(
      "Get Complaint Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// UPDATE COMPLAINT
// =====================================================

const updateComplaint = async (req, res) => {
  try {
    const id = req.params.id;

    let complaint = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      complaint =
        await Complaint.findByIdAndUpdate(
          id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        ).populate(
          "assignedOfficer",
          "name email phone department role"
        );
    }

    if (!complaint) {
      complaint =
        await Complaint.findOneAndUpdate(
          {
            complaintId: id,
          },
          req.body,
          {
            new: true,
            runValidators: true,
          }
        ).populate(
          "assignedOfficer",
          "name email phone department role"
        );
    }

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      data: complaint,
    });

  } catch (error) {
    console.error(
      "Update Complaint Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// UPDATE COMPLAINT STATUS
// =====================================================

const updateComplaintStatus = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      status,
      officerNotes,
      resolutionNotes,
      completionProofImage,
    } = req.body;

    const allowedStatuses = [
      "Pending",
      "Assigned",
      "In Progress",
      "Resolved",
      "Rejected",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status.",
      });
    }

    const updateData = {
      status,
    };

    // Save officer notes
    if (officerNotes !== undefined) {
      updateData.officerNotes = officerNotes;
    }

    // Save resolution notes
    if (resolutionNotes !== undefined) {
      updateData.resolutionNotes =
        resolutionNotes;
    }

    // If resolved, save current date/time and enforce completion photo
    if (status === "Resolved") {
      if (!completionProofImage) {
        return res.status(400).json({
          success: false,
          message: "Please upload a completion proof photo before resolving the complaint.",
        });
      }
      updateData.resolvedAt = new Date();
      updateData.completionProofImage = completionProofImage;
    } else {
      updateData.resolvedAt = null;
    }

    let complaint = null;

    // MongoDB _id
    if (mongoose.Types.ObjectId.isValid(id)) {
      complaint =
        await Complaint.findByIdAndUpdate(
          id,
          updateData,
          {
            new: true,
            runValidators: true,
          }
        ).populate(
          "assignedOfficer",
          "name email phone department role"
        );
    }

    // Custom complaint ID
    if (!complaint) {
      complaint =
        await Complaint.findOneAndUpdate(
          {
            complaintId: id,
          },
          updateData,
          {
            new: true,
            runValidators: true,
          }
        ).populate(
          "assignedOfficer",
          "name email phone department role"
        );
    }

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found.",
      });
    }

    console.log(
      "Complaint status updated:",
      complaint.complaintId,
      "=>",
      complaint.status
    );

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully.",
      data: complaint,
    });

  } catch (error) {
    console.error(
      "Update Complaint Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// DELETE COMPLAINT
// =====================================================

const deleteComplaint = async (req, res) => {
  try {
    const id = req.params.id;

    let complaint = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      complaint =
        await Complaint.findByIdAndDelete(id);
    }

    if (!complaint) {
      complaint =
        await Complaint.findOneAndDelete({
          complaintId: id,
        });
    }

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Complaint Error:",
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
  createComplaint,
  getComplaints,
  getComplaintsByUser,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  deleteComplaint,
};