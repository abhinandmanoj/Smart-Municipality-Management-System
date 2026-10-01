const { GoogleGenerativeAI } = require("@google/generative-ai");

// =====================================================
// ENUMS
// =====================================================

const VALID_CATEGORIES = ["Garbage", "Road Damage", "Water Supply", "Street Light", "Drainage", "Health", "Other"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];

const CATEGORY_MAP = {
  "road": "Road Damage", "pothole": "Road Damage", "road damage": "Road Damage", "roads": "Road Damage",
  "garbage": "Garbage", "waste": "Garbage", "trash": "Garbage", "litter": "Garbage",
  "water": "Water Supply", "water supply": "Water Supply", "pipe": "Water Supply", "leak": "Water Supply",
  "light": "Street Light", "street light": "Street Light", "streetlight": "Street Light", "lamp": "Street Light",
  "drain": "Drainage", "drainage": "Drainage", "sewage": "Drainage", "flood": "Drainage",
  "health": "Health", "hospital": "Health", "disease": "Health", "sanitation": "Health",
};

const DEPT_MAP = {
  "Road Damage":  "Road & Transport",
  "Garbage":      "Waste Management",
  "Water Supply": "Water Supply",
  "Street Light": "Electrical",
  "Drainage":     "Drainage & Sewage",
  "Health":       "Public Health",
  "Other":        "Not Assigned",
};

// =====================================================
// HELPERS
// =====================================================

function normalizeExtracted(ec) {
  // Normalize category
  if (ec.category && !VALID_CATEGORIES.includes(ec.category)) {
    const lower = ec.category.toLowerCase();
    ec.category = CATEGORY_MAP[lower] || "Other";
  }
  // Auto-assign department
  ec.department = DEPT_MAP[ec.category] || "Not Assigned";
  // Normalize priority
  if (ec.priority && !VALID_PRIORITIES.includes(ec.priority)) {
    const p = ec.priority.toLowerCase();
    ec.priority = p.includes("high") ? "High" : p.includes("low") ? "Low" : "Medium";
  }
  return ec;
}

function stripFences(text) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

// =====================================================
// GEMINI IMAGE ANALYSIS
// Returns a string describing what is visible in the image
// for use as extra context in the Groq conversation.
// Returns null if Gemini is unavailable or fails.
// =====================================================

async function analyzeImageWithGemini(imageBase64) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey || !imageBase64) return null;

  try {
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Strip the data URL prefix if present: "data:image/jpeg;base64,..."
    const base64Data = imageBase64.includes(",")
      ? imageBase64.split(",")[1]
      : imageBase64;
    const mimeType = imageBase64.startsWith("data:")
      ? imageBase64.split(";")[0].replace("data:", "")
      : "image/jpeg";

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
      "Briefly describe what you see in this image in the context of a municipal complaint. In 1-2 sentences, focus on the civic problem visible (e.g. damaged road, overflowing garbage, broken street light, water leak). Do not greet or explain. Just describe what you see.",
    ]);

    const text = result.response.text().trim();
    return text || null;
  } catch (err) {
    console.error("Gemini image analysis failed:", err.message);
    return null; // Graceful fallback — do not crash
  }
}

// =====================================================
// SYSTEM PROMPT
// =====================================================

function buildSystemPrompt() {
  return `You are an AI complaint assistant for a Smart Municipality system.
Your ONLY job is to help citizens register civic complaints by collecting the required information.

VALID CATEGORIES (use EXACTLY one of these, no variations):
- Garbage
- Road Damage
- Water Supply
- Street Light
- Drainage
- Health
- Other

VALID PRIORITIES: Low, Medium, High

REQUIRED FIELDS to collect:
1. title       — Short 5-10 word summary. ALWAYS generate this yourself from the description.
2. description — What is the problem.
3. category    — MUST be one of the valid categories. Auto-determine if possible.
4. location    — WHERE the problem is. NEVER invent a location. ALWAYS ask the citizen.
5. priority    — Auto-determine from urgency when possible (dangerous/urgent → High, etc.).

RULES:
- Extract as much as possible from the citizen's message automatically.
- Ask for ONLY ONE missing field at a time.
- For each missing field, give a plain-language explanation AND a short example.
- Show a progress checklist ONLY when two or more fields have been confirmed and one is still missing:
    "Almost ready! I still need:
    ✓ Description — provided
    ✓ Category — Road Damage
    ✓ Priority — High
    ✗ Location — please provide

    📍 Where is the problem happening?
    Example: 'Near Iritty bus stand, Kannur'"
- NEVER ask for category or priority if you can infer them confidently.
- NEVER say an image is required. It is optional.
- NEVER say "Please provide all required complaint details." — always name the SPECIFIC missing field.
- NEVER invent a location.

FIELD-SPECIFIC EXAMPLES TO USE WHEN ASKING:
- title: "Example: 'Large pothole near bus stand'"
- description: "Example: 'There are several large potholes on the road near the bus stand. Vehicles are having difficulty passing.'"
- location: "Example: 'Near Kuthuparamba bus stand, Kannur'"
- category: "Example: 'Road damage', 'Garbage overflow', 'Water leakage', 'Blocked drain', 'Broken street light'"
- priority: "How urgent is it? 1=Low (minor), 2=Medium (needs attention), 3=High (dangerous/urgent)"

FINAL OUTPUT:
When ALL 5 fields are available, respond ONLY with this exact JSON (no markdown, no extra text, no code fences):
{"extracted_complaint":{"title":"...","category":"...","priority":"...","description":"...","location":"..."}}`;
}

// =====================================================
// GROQ CHAT
// =====================================================

async function callGroq(systemPrompt, conversationMessages) {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) return null;

  // Map citizen/ai roles to user/assistant; filter leading assistant messages
  const mapped = conversationMessages
    .filter(m => m.role === "citizen" || m.role === "ai")
    .map(m => ({
      role: m.role === "citizen" ? "user" : "assistant",
      content: m.text || "",
    }));

  // Groq requires conversation to start with a user message
  const firstUser = mapped.findIndex(m => m.role === "user");
  const filtered = firstUser === -1 ? [] : mapped.slice(firstUser);

  if (filtered.length === 0) return null;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${groqKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "qwen/qwen3.8-27b",
      messages: [{ role: "system", content: systemPrompt }, ...filtered],
      temperature: 0.15,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    console.error("Groq API error:", response.status, errData);
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// =====================================================
// MAIN HANDLER
// =====================================================

const processChat = async (req, res) => {
  try {
    const { messages, imageBase64 } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: "messages array is required." });
    }

    // ---- Gemini image analysis (non-blocking) ----
    let imageContext = null;
    if (imageBase64) {
      imageContext = await analyzeImageWithGemini(imageBase64);
    }

    // ---- Build conversation with image context injected ----
    let conversationMessages = [...messages];

    // If Gemini returned a description, inject it as an AI message before the last user message
    // so Groq sees it as part of the conversation context
    if (imageContext) {
      const lastUserIdx = conversationMessages.reduce(
        (last, m, idx) => (m.role === "citizen" ? idx : last),
        -1
      );
      if (lastUserIdx !== -1) {
        const imageContextMsg = {
          role: "citizen",
          text: `[Image provided by citizen]: ${imageContext}`,
        };
        conversationMessages = [
          ...conversationMessages.slice(0, lastUserIdx),
          imageContextMsg,
          ...conversationMessages.slice(lastUserIdx),
        ];
      }
    }

    const systemPrompt = buildSystemPrompt();

    // ---- Call Groq ----
    let aiResponse;
    try {
      aiResponse = await callGroq(systemPrompt, conversationMessages);
    } catch (groqErr) {
      console.error("Groq call failed:", groqErr.message);
      return res.status(503).json({
        success: false,
        message: "I'm having trouble processing your request right now. Your information is still here — please try sending again.",
      });
    }

    if (!aiResponse) {
      return res.status(503).json({
        success: false,
        message: "AI service is unavailable. Please try again shortly.",
      });
    }

    // ---- Strip markdown fences ----
    aiResponse = stripFences(aiResponse);

    // ---- If it looks like JSON, parse and normalize ----
    try {
      const parsed = JSON.parse(aiResponse);
      if (parsed.extracted_complaint) {
        parsed.extracted_complaint = normalizeExtracted(parsed.extracted_complaint);
        aiResponse = JSON.stringify(parsed);
      }
    } catch (_) {
      // Not JSON — conversational text, pass through
    }

    return res.json({ success: true, reply: aiResponse });

  } catch (error) {
    console.error("AI Chat Error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
    });
  }
};

module.exports = { processChat, DEPT_MAP, VALID_CATEGORIES };
