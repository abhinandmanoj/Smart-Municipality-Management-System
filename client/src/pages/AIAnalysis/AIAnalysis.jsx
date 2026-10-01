import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaRobot,
  FaArrowLeft,
  FaSearch,
  FaCheckCircle,
  FaLightbulb,
} from "react-icons/fa";

function AIAnalysis() {
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeComplaint = () => {
    if (!complaint.trim()) {
      alert("Please enter a complaint.");
      return;
    }

    setLoading(true);
    setResult(null);

    // Temporary AI simulation.
    // Gemini API will be connected here later.
    setTimeout(() => {
      const text = complaint.toLowerCase();

      let category = "Other";
      let department = "General Administration";
      let priority = "Medium";
      let confidence = 78;

      if (
        text.includes("garbage") ||
        text.includes("waste") ||
        text.includes("trash")
      ) {
        category = "Garbage";
        department = "Waste Management";
        priority = "Medium";
        confidence = 94;
      } else if (
        text.includes("pothole") ||
        text.includes("road") ||
        text.includes("street")
      ) {
        category = "Road Damage";
        department = "Road & Transport";
        priority = "High";
        confidence = 91;
      } else if (
        text.includes("water") ||
        text.includes("leak") ||
        text.includes("pipeline")
      ) {
        category = "Water Supply";
        department = "Water Supply";
        priority = "High";
        confidence = 93;
      } else if (
        text.includes("light") ||
        text.includes("lamp") ||
        text.includes("electric")
      ) {
        category = "Street Light";
        department = "Street Light";
        priority = "Medium";
        confidence = 95;
      } else if (
        text.includes("drain") ||
        text.includes("flood") ||
        text.includes("sewage")
      ) {
        category = "Drainage";
        department = "Drainage";
        priority = "High";
        confidence = 89;
      } else if (
        text.includes("hospital") ||
        text.includes("health") ||
        text.includes("medical")
      ) {
        category = "Health";
        department = "Health Services";
        priority = "High";
        confidence = 87;
      }

      setResult({
        category,
        department,
        priority,
        confidence,
      });

      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* ================= NAVBAR ================= */}

      <nav className="bg-[#0B1B2B] text-white">

        <div className="max-w-7xl mx-auto px-6">

          <div className="h-20 flex items-center justify-between">

            {/* LOGO */}

            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer"
            >

              <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] flex items-center justify-center">

                <FaBuilding className="text-[#0B1B2B]" />

              </div>

              <div>

                <h1 className="font-bold text-lg">
                  Smart Municipality
                </h1>

                <p className="text-xs text-gray-400">
                  Digital Civic Services
                </p>

              </div>

            </div>


            {/* NAVIGATION */}

            <div className="hidden lg:flex items-center gap-7">

              <button
                onClick={() => navigate("/")}
                className="text-gray-300 hover:text-white"
              >
                Home
              </button>

              <button
                onClick={() => navigate("/services")}
                className="text-gray-300 hover:text-white"
              >
                Services
              </button>

              <button
                onClick={() => navigate("/departments")}
                className="text-gray-300 hover:text-white"
              >
                Departments
              </button>

              <button
                className="text-[#E8AA0C] font-semibold"
              >
                AI Analysis
              </button>

              <button
                onClick={() => navigate("/my-complaints")}
                className="text-gray-300 hover:text-white"
              >
                My Complaints
              </button>

            </div>


            {/* AUTH */}

            <div className="flex items-center gap-3">

              <button
                onClick={() => navigate("/login")}
                className="hidden sm:block text-gray-300 hover:text-white"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="bg-[#E8AA0C] text-[#0B1B2B] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#f3bd25] transition"
              >
                Register
              </button>

            </div>

          </div>

        </div>

      </nav>


      {/* ================= HEADER ================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-5xl mx-auto px-6 py-14">

          <button
            onClick={() => navigate("/services")}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6"
          >
            <FaArrowLeft />
            Back to Services
          </button>

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-[#E8AA0C] text-[#0B1B2B] flex items-center justify-center text-xl">
              <FaRobot />
            </div>

            <div>

              <p className="text-[#E8AA0C] text-sm font-semibold uppercase tracking-widest">
                Artificial Intelligence
              </p>

              <h1 className="text-3xl md:text-4xl font-bold mt-2">
                AI Complaint Analysis
              </h1>

            </div>

          </div>

          <p className="text-gray-400 mt-5 max-w-2xl">
            Describe a civic issue and our AI system will suggest
            the complaint category, department and priority.
          </p>

        </div>

      </section>


      {/* ================= AI CONTENT ================= */}

      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* INPUT CARD */}

        <div className="bg-white border border-[#DCE3EA] rounded-2xl p-7">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-[#10263B] text-[#E8AA0C] flex items-center justify-center">
              <FaRobot />
            </div>

            <div>

              <h2 className="font-bold text-[#0B1B2B]">
                Describe the Problem
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                The AI will analyse your complaint.
              </p>

            </div>

          </div>


          <textarea
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            rows="6"
            placeholder="Example: There is a large pothole near the main bus stop and it is dangerous for vehicles..."
            className="w-full mt-6 border border-[#D6DDE5] rounded-xl p-4 outline-none resize-none focus:border-[#E8AA0C] focus:ring-1 focus:ring-[#E8AA0C]"
          />


          <button
            onClick={analyzeComplaint}
            disabled={loading}
            className="mt-5 w-full bg-[#E8AA0C] text-[#0B1B2B] py-3.5 rounded-lg font-bold hover:bg-[#f3bd25] transition flex items-center justify-center gap-2 disabled:opacity-60"
          >

            <FaSearch />

            {loading ? "Analysing Complaint..." : "Analyse with AI"}

          </button>

        </div>


        {/* ================= RESULT ================= */}

        {result && (

          <div className="bg-white border border-[#DCE3EA] rounded-2xl p-7 mt-6">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                  <FaCheckCircle />
                </div>

                <div>

                  <h2 className="font-bold text-[#0B1B2B]">
                    AI Analysis Complete
                  </h2>

                  <p className="text-sm text-gray-500">
                    Suggested classification
                  </p>

                </div>

              </div>

              <span className="text-sm font-bold text-green-600">
                {result.confidence}% confidence
              </span>

            </div>


            {/* RESULTS */}

            <div className="grid md:grid-cols-3 gap-4 mt-7">

              <ResultBox
                label="Category"
                value={result.category}
              />

              <ResultBox
                label="Department"
                value={result.department}
              />

              <ResultBox
                label="Priority"
                value={result.priority}
              />

            </div>


            {/* AI NOTE */}

            <div className="mt-6 bg-[#FFF8E6] border border-[#F3D98A] rounded-lg p-4 flex gap-3">

              <FaLightbulb className="text-[#D89A00] mt-1 shrink-0" />

              <p className="text-sm text-[#80651C] leading-6">
                This is an AI-generated suggestion. The final
                department assignment can be verified by a
                municipal officer.
              </p>

            </div>


            {/* REGISTER */}

            <button
              onClick={() => navigate("/register-complaint")}
              className="mt-6 w-full border border-[#E8AA0C] text-[#A97400] py-3 rounded-lg font-semibold hover:bg-[#FFF8E6] transition"
            >
              Register This Complaint
            </button>

          </div>

        )}

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="bg-[#071521] text-white py-8 mt-10">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between gap-4">

            <div>

              <h3 className="font-bold">
                Smart Municipality
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                AI-powered digital civic services.
              </p>

            </div>

            <p className="text-gray-500 text-sm">
              © 2026 Smart Municipality
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}


/* ================= RESULT BOX ================= */

function ResultBox({ label, value }) {
  return (
    <div className="bg-[#F5F7FA] border border-[#E1E6EB] rounded-lg p-4">

      <p className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="font-bold text-[#0B1B2B] mt-2">
        {value}
      </p>

    </div>
  );
}

export default AIAnalysis;