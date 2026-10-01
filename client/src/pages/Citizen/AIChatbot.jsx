import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaImage,
  FaTimes,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const API_BASE = "http://localhost:5000/api";

/* ============================================================
   DEPT MAP (mirrors backend)
============================================================ */
const DEPT_MAP = {
  "Road Damage":   "Road & Transport",
  "Garbage":       "Waste Management",
  "Water Supply":  "Water Supply",
  "Street Light":  "Electrical",
  "Drainage":      "Drainage & Sewage",
  "Health":        "Public Health",
  "Other":         "Not Assigned",
};

/* ============================================================
   COMPONENT
============================================================ */
function AIChatbot() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I'm your AI Complaint Assistant. Describe the municipal problem you want to report and I'll help you register it." },
  ]);
  const [input, setInput]       = useState("");
  const [image, setImage]       = useState(null);       // blob URL for preview
  const [imageBase64, setImageBase64] = useState("");   // base64 for payload
  const [loading, setLoading]   = useState(false);
  const [registering, setRegistering] = useState(false);

  // Extracted complaint data — shown as summary when complete
  const [draft, setDraft]       = useState(null);

  // After successful registration
  const [registered, setRegistered] = useState(null);  // { complaintId, _id }

  // Inline error for registration step
  const [regError, setRegError] = useState("");

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, draft, registered]);

  /* ----------------------------------------------------------
     IMAGE UPLOAD
  ---------------------------------------------------------- */
  const handleImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        addMessage("ai", "Image must be smaller than 5 MB. Please choose a different file.");
        return;
      }
      setImage(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => setImageBase64(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImageBase64("");
  };

  /* ----------------------------------------------------------
     HELPERS
  ---------------------------------------------------------- */
  const addMessage = (role, text) => {
    setMessages(prev => [...prev, { role, text }]);
  };

  /* ----------------------------------------------------------
     SEND MESSAGE TO AI
  ---------------------------------------------------------- */
  const handleSend = async () => {
    const text = input.trim();
    if (!text && !imageBase64) return;

    // Show the user's message; if image-only show a clear label
    const displayText = text || "📷 Image uploaded — please analyse this complaint."; 
    const newMsgs = [...messages, { role: "citizen", text: displayText }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    setRegError("");

    try {
      const { data } = await axios.post(`${API_BASE}/ai/chat`, {
        messages: newMsgs,
        imageBase64,
      });

      if (!data.success) {
        // Show server message but keep conversation context intact
        addMessage("ai", data.message || "I'm having trouble right now. Your information is still here — please try sending again.");
        return;
      }

      // Strip markdown fences on the frontend too for safety
      let reply = data.reply
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      // Try to parse as extracted_complaint JSON
      try {
        const parsed = JSON.parse(reply);
        if (parsed.extracted_complaint) {
          const ec = parsed.extracted_complaint;
          // Ensure department is always mapped
          if (!ec.department || ec.department === "Not Assigned") {
            ec.department = DEPT_MAP[ec.category] || "Not Assigned";
          }
          setDraft(ec);
          addMessage("ai", "I have all the information I need. Please review your complaint summary below and click 'Register Complaint' to submit it.");
          return;
        }
      } catch (_) {
        // Not JSON — conversational response, show as-is
      }

      addMessage("ai", reply);
    } catch (err) {
      console.error("Chat error:", err);
      // Use server error message when available; keep conversation intact
      const serverMsg = err.response?.data?.message;
      addMessage("ai", serverMsg || "I'm having trouble processing this right now. Your information is still here — please try sending again.");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------------------------
     EDIT DRAFT (back to conversation)
  ---------------------------------------------------------- */
  const handleEditDraft = () => {
    setDraft(null);
    addMessage("ai", "Sure! What would you like to change? Tell me the updated details.");
  };

  /* ----------------------------------------------------------
     REGISTER COMPLAINT
  ---------------------------------------------------------- */
  const handleRegister = async () => {
    setRegistering(true);
    setRegError("");

    try {
      // Get logged-in user from localStorage
      const userStr = localStorage.getItem("user");
      const token   = localStorage.getItem("token");

      if (!userStr || !token) {
        setRegError("Session expired. Please log in again.");
        return;
      }

      const user = JSON.parse(userStr);
      const citizenName = user.name || user.fullName || "";
      const email       = user.email || "";
      const phone       = user.phone || "";

      if (!citizenName || !email || !phone) {
        setRegError("Your profile is incomplete. Please update your name, email, and phone number in your profile before submitting.");
        return;
      }

      const payload = {
        title:       draft.title       || "Complaint",
        citizenName,
        email,
        phone,
        category:    draft.category    || "Other",
        description: draft.description || "",
        location:    draft.location    || "",
        priority:    draft.priority    || "Medium",
        image:       imageBase64       || "",
      };

      const res = await axios.post(`${API_BASE}/complaints`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data && res.data.success) {
        const saved = res.data.data;
        setRegistered({
          complaintId: saved.complaintId,
          _id:         saved._id,
        });
        setDraft(null);
      } else {
        setRegError(res.data?.message || "Failed to register complaint. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setRegError(err.response?.data?.message || "Failed to register complaint. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  /* ============================================================
     RENDER
  ============================================================ */
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">

      {/* NAVBAR */}
      <nav className="bg-[#0B1B2B] text-white shrink-0">
        <div className="max-w-[800px] mx-auto px-6 h-[68px] flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition"
          >
            <FaArrowLeft />
          </button>
          <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] flex items-center justify-center shrink-0">
            <FaRobot className="text-[#0B1B2B] text-lg" />
          </div>
          <div>
            <h1 className="font-bold text-[18px]">AI Complaint Assistant</h1>
            <p className="text-xs text-gray-400">Describe your issue and I'll register it for you</p>
          </div>
        </div>
      </nav>

      {/* CHAT AREA */}
      <main className="flex-1 max-w-[800px] w-full mx-auto p-4 md:p-6 overflow-y-auto">
        <div className="space-y-5">

          {/* MESSAGE BUBBLES */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${msg.role === "citizen" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "citizen"
                  ? "bg-[#0B1B2B] text-white"
                  : "bg-[#E8AA0C] text-[#0B1B2B]"
              }`}>
                {msg.role === "citizen" ? <FaUser className="text-xs" /> : <FaRobot className="text-xs" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === "citizen"
                  ? "bg-[#0B1B2B] text-white rounded-tr-none"
                  : "bg-white border border-[#DCE3EA] rounded-tl-none text-[#0B1B2B]"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* LOADING INDICATOR */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E8AA0C] text-[#0B1B2B] flex items-center justify-center shrink-0">
                <FaRobot className="text-xs" />
              </div>
              <div className="bg-white border border-[#DCE3EA] rounded-2xl rounded-tl-none px-5 py-4">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {/* COMPLAINT SUMMARY (when draft is ready) */}
          {draft && !registered && (
            <div className="ml-11 max-w-[80%] bg-white border border-[#DCE3EA] rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-[#E8ECF0] bg-[#FFFBEF]">
                <p className="text-xs text-[#A97400] font-bold uppercase tracking-wider">Complaint Summary</p>
                <p className="text-xs text-gray-500 mt-0.5">Review before submitting</p>
              </div>
              <div className="p-5 space-y-3 text-sm text-[#0B1B2B]">
                <Row label="Title"       value={draft.title} />
                <Row label="Category"    value={draft.category} />
                <Row label="Department"  value={draft.department || DEPT_MAP[draft.category] || "Not Assigned"} />
                <Row label="Priority"    value={draft.priority} />
                <Row label="Location"    value={draft.location} />
                <div>
                  <span className="font-semibold text-gray-500 text-xs uppercase block mb-1">Description</span>
                  <p className="bg-gray-50 border border-[#E8ECF0] rounded-lg p-3 text-sm leading-relaxed">{draft.description}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-500 text-xs uppercase block mb-1">Photo</span>
                  {image ? (
                    <div>
                      <p className="text-sm text-green-600 font-semibold mb-2">Uploaded ✓</p>
                      <img src={image} alt="Complaint" className="w-full max-h-48 object-cover rounded-lg border border-[#DCE3EA]" />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Not uploaded — optional</p>
                  )}
                </div>
              </div>

              {regError && (
                <div className="mx-5 mb-4 flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                  <FaExclamationCircle className="mt-0.5 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <div className="px-5 pb-5 flex gap-3">
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="flex-1 bg-[#E8AA0C] hover:bg-[#D99D00] text-[#0B1B2B] font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-60"
                >
                  {registering ? (
                    <div className="w-5 h-5 border-2 border-[#0B1B2B]/30 border-t-[#0B1B2B] rounded-full animate-spin" />
                  ) : (
                    <><FaCheckCircle /> Register Complaint</>
                  )}
                </button>
                <button
                  onClick={handleEditDraft}
                  disabled={registering}
                  className="px-5 border border-[#DCE3EA] text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-60 text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {registered && (
            <div className="ml-11 max-w-[80%] bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="flex items-center gap-2 text-green-700 font-bold mb-2">
                <FaCheckCircle />
                Complaint Registered Successfully!
              </div>
              <p className="text-sm text-green-700 mb-1">
                Reference ID: <span className="font-bold">{registered.complaintId}</span>
              </p>
              <p className="text-xs text-green-600 mb-4">
                Your complaint is now visible to municipal officers and will be acted upon shortly.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/my-complaints`)}
                  className="text-sm bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                  View My Complaints
                </button>
                <button
                  onClick={() => {
                    setMessages([{ role: "ai", text: "Hello! I'm your AI Complaint Assistant. Describe the municipal problem you want to report and I'll help you register it." }]);
                    setDraft(null);
                    setRegistered(null);
                    setImage(null);
                    setImageBase64("");
                    setRegError("");
                  }}
                  className="text-sm border border-green-300 text-green-700 font-semibold px-4 py-2 rounded-lg hover:bg-green-100 transition"
                >
                  Register Another
                </button>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </main>

      {/* INPUT AREA — hidden once summary shown or after registration */}
      {!draft && !registered && (
        <div className="bg-white border-t border-[#DCE3EA] p-4 shrink-0">
          <div className="max-w-[800px] mx-auto">

            {/* Image preview */}
            {image && (
              <div className="mb-3 relative inline-block">
                <img src={image} alt="Preview" className="h-20 rounded-lg border border-[#DCE3EA] object-cover" />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600 shadow text-xs"
                >
                  <FaTimes />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <label className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-[#0B1B2B] hover:bg-gray-100 rounded-full cursor-pointer transition shrink-0">
                <FaImage className="text-xl" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                  disabled={loading}
                />
              </label>

              <input
                type="text"
                placeholder="Describe your complaint..."
                className="flex-1 h-12 bg-gray-100 rounded-full px-5 text-sm outline-none focus:ring-2 focus:ring-[#E8AA0C] transition"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                disabled={loading}
              />

              <button
                onClick={handleSend}
                disabled={loading || (!input.trim() && !imageBase64)}
                title={!input.trim() && !imageBase64 ? "Type a message or upload an image" : "Send"}
                className="w-12 h-12 bg-[#0B1B2B] text-white rounded-full flex items-center justify-center hover:bg-black transition disabled:opacity-40 shrink-0"
              >
                {loading
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <FaPaperPlane />
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Small helper component for summary rows */
function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <span className="font-semibold text-gray-500 text-xs uppercase w-24 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export default AIChatbot;
