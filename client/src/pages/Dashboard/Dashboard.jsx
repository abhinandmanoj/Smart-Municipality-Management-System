import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaPlus,
  FaArrowRight,
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH COMPLAINTS ================= */

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        if (!user?.email) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/complaints?email=${encodeURIComponent(
            user.email
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch complaints");
        }

        const data = await response.json();

        /*
          Supports both:
          [
            {...},
            {...}
          ]

          and:

          {
            complaints: [...]
          }
        */

        const complaintList = Array.isArray(data)
          ? data
          : data.complaints || [];

        setComplaints(complaintList);
      } catch (error) {
        console.error(
          "Dashboard complaint fetch error:",
          error
        );

        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user?.email]);

  /* ================= COUNTS ================= */

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) =>
      String(complaint.status || "").toLowerCase() ===
      "pending"
  ).length;

  const resolvedComplaints = complaints.filter((complaint) => {
    const status = String(
      complaint.status || ""
    ).toLowerCase();

    return (
      status === "resolved" ||
      status === "completed"
    );
  }).length;

  /* ================= RECENT ================= */

  const recentComplaints = [...complaints]
    .sort((a, b) => {
      const dateA = new Date(
        a.createdAt || a.created_at || a.date || 0
      );

      const dateB = new Date(
        b.createdAt || b.created_at || b.date || 0
      );

      return dateB - dateA;
    })
    .slice(0, 3);

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">

      {/* ================= HEADER ================= */}

      <header className="h-16 bg-[#111827] border-b border-gray-800">

        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center">
              <span className="text-white font-bold">
                SM
              </span>
            </div>

            <div>
              <h1 className="text-base font-bold">
                Smart Municipality
              </h1>

              <p className="text-[10px] text-gray-500">
                Citizen Portal
              </p>
            </div>

          </div>

          {/* Navigation */}

          <nav className="hidden md:flex items-center gap-2">

            <button
              onClick={() => navigate("/citizen/dashboard")}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm"
            >
              Dashboard
            </button>

            <button
              onClick={() =>
                navigate("/register-complaint")
              }
              className="px-4 py-2 rounded-lg text-gray-300 hover:bg-[#1E293B] text-sm"
            >
              Register Complaint
            </button>

            <button
              onClick={() =>
                navigate("/my-complaints")
              }
              className="px-4 py-2 rounded-lg text-gray-300 hover:bg-[#1E293B] text-sm"
            >
              My Complaints
            </button>

          </nav>

          {/* User */}

          <div className="flex items-center gap-3">

            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "C"}
            </div>

            <div className="hidden sm:block">

              <p className="text-xs font-semibold">
                {user?.name || "Citizen"}
              </p>

              <p className="text-[10px] text-gray-500">
                Citizen
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-red-400 ml-2"
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Welcome */}

        <div className="mb-7">

          <p className="text-orange-500 text-sm font-medium">
            Citizen Portal
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Welcome, {user?.name || "Citizen"} 👋
          </h1>

          <p className="text-gray-400 mt-1 text-sm">
            Manage and track your civic complaints.
          </p>

        </div>

        {/* ================= STAT CARDS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Total */}

          <div className="bg-[#151F32] border border-gray-700 rounded-xl p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-xs">
                  Total Complaints
                </p>

                <h2 className="text-3xl font-bold mt-3">
                  {loading ? "..." : totalComplaints}
                </h2>

              </div>

              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <FaClipboardList className="text-orange-500" />
              </div>

            </div>

          </div>

          {/* Pending */}

          <div className="bg-[#151F32] border border-gray-700 rounded-xl p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-xs">
                  Pending
                </p>

                <h2 className="text-3xl font-bold mt-3">
                  {loading ? "..." : pendingComplaints}
                </h2>

              </div>

              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <FaClock className="text-yellow-500" />
              </div>

            </div>

          </div>

          {/* Resolved */}

          <div className="bg-[#151F32] border border-gray-700 rounded-xl p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-xs">
                  Resolved
                </p>

                <h2 className="text-3xl font-bold mt-3">
                  {loading ? "..." : resolvedComplaints}
                </h2>

              </div>

              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <FaCheckCircle className="text-green-500" />
              </div>

            </div>

          </div>

        </div>

        {/* ================= ACTION CARDS ================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

          {/* Register Complaint */}

          <button
            onClick={() =>
              navigate("/register-complaint")
            }
            className="text-left bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 hover:opacity-95 transition"
          >

            <div className="flex items-center justify-between">

              <div>

                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mb-5">
                  <FaPlus />
                </div>

                <h2 className="text-2xl font-semibold">
                  Report a Civic Issue
                </h2>

                <p className="text-orange-100 text-sm mt-2">
                  Submit a new complaint to your municipality.
                </p>

              </div>

              <FaArrowRight className="text-xl" />

            </div>

          </button>

          {/* Track Complaints */}

          <button
            onClick={() =>
              navigate("/my-complaints")
            }
            className="text-left bg-[#151F32] border border-gray-700 rounded-xl p-6 hover:border-orange-500 transition"
          >

            <div className="flex items-center justify-between">

              <div>

                <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center mb-5">
                  <FaClipboardList className="text-orange-500" />
                </div>

                <h2 className="text-2xl font-semibold">
                  Track My Complaints
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  View complaint status and updates.
                </p>

              </div>

              <FaArrowRight className="text-gray-500" />

            </div>

          </button>

        </div>

        {/* ================= RECENT COMPLAINTS ================= */}

        <div className="mt-7">

          <div className="flex items-center justify-between mb-4">

            <div>

              <h2 className="text-xl font-semibold">
                Recent Complaints
              </h2>

              <p className="text-gray-500 text-xs mt-1">
                Your latest reported civic issues
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/my-complaints")
              }
              className="text-orange-500 text-sm hover:text-orange-400"
            >
              View All
            </button>

          </div>

          {/* Loading */}

          {loading && (
            <div className="bg-[#151F32] border border-gray-700 rounded-xl p-6 text-center">

              <p className="text-gray-400 text-sm">
                Loading complaints...
              </p>

            </div>
          )}

          {/* No complaints */}

          {!loading && recentComplaints.length === 0 && (

            <div className="bg-[#151F32] border border-gray-700 rounded-xl p-6">

              <p className="text-gray-400 text-sm">
                You have not registered any complaints yet.
              </p>

              <button
                onClick={() =>
                  navigate("/register-complaint")
                }
                className="mt-4 text-orange-500 text-sm font-medium"
              >
                Register your first complaint →
              </button>

            </div>

          )}

          {/* Complaints */}

          {!loading &&
            recentComplaints.length > 0 && (

              <div className="space-y-3">

                {recentComplaints.map(
                  (complaint, index) => {

                    const status =
                      complaint.status ||
                      "Pending";

                    const title =
                      complaint.title ||
                      complaint.complaintTitle ||
                      complaint.subject ||
                      "Civic Complaint";

                    const category =
                      complaint.category ||
                      complaint.department ||
                      "Municipality";

                    const location =
                      complaint.location ||
                      "Location not provided";

                    const complaintId =
                      complaint.complaintId ||
                      complaint.id ||
                      complaint._id ||
                      `CMP${index + 1}`;

                    return (

                      <div
                        key={
                          complaint._id ||
                          complaint.id ||
                          index
                        }
                        className="bg-[#151F32] border border-gray-700 rounded-xl p-5 hover:border-orange-500 transition"
                      >

                        <div className="flex items-center justify-between gap-4">

                          <div className="min-w-0">

                            <div className="flex items-center gap-3">

                              <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">

                                <FaClipboardList className="text-orange-500" />

                              </div>

                              <div className="min-w-0">

                                <h3 className="font-medium truncate">
                                  {title}
                                </h3>

                                <p className="text-gray-500 text-xs mt-1">
                                  {category}
                                </p>

                                <p className="text-gray-500 text-xs mt-1">
                                  {location}
                                </p>

                                <p className="text-gray-600 text-[10px] mt-1">
                                  {complaintId}
                                </p>

                              </div>

                            </div>

                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-xs flex-shrink-0 ${
                              String(status).toLowerCase() ===
                              "resolved"
                                ? "bg-green-500/10 text-green-400"
                                : String(status).toLowerCase() ===
                                  "rejected"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-yellow-500/10 text-yellow-400"
                            }`}
                          >
                            {status}
                          </span>

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            )}

        </div>

      </main>

    </div>
  );
}

export default Dashboard;