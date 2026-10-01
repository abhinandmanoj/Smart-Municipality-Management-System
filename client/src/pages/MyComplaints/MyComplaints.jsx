import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaBuilding,
  FaBell,
  FaUser,
  FaPlus,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaSearch,
  FaArrowRight,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEye,
} from "react-icons/fa";

function MyComplaints() {
  const navigate = useNavigate();

  // =========================================================
  // USER
  // =========================================================

  const storedUser = localStorage.getItem("user");

  let user = {};

  try {
    user = storedUser ? JSON.parse(storedUser) : {};
  } catch (error) {
    console.error("User data error:", error);
  }

  const userName =
    user?.name ||
    user?.fullName ||
    "Citizen";

  const userEmail =
    user?.email ||
    "";

  // =========================================================
  // STATES
  // =========================================================

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // =========================================================
  // FETCH COMPLAINTS
  // =========================================================

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      if (!userEmail) {
        setComplaints([]);
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/complaints/user/${encodeURIComponent(
          userEmail
        )}`
      );

      const data =
        response.data?.complaints ||
        response.data ||
        [];

      setComplaints(
        Array.isArray(data) ? data : []
      );

    } catch (error) {
      console.error(
        "Failed to fetch complaints:",
        error.response?.data ||
          error.message
      );

      setComplaints([]);

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) => {
      const status =
        complaint.status?.toLowerCase();

      return (
        status === "pending" ||
        status === "assigned" ||
        status === "in progress" ||
        status === "in-progress"
      );
    }
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => {
      const status =
        complaint.status?.toLowerCase();

      return (
        status === "resolved" ||
        status === "completed" ||
        status === "closed"
      );
    }
  ).length;

  const highPriorityComplaints =
    complaints.filter(
      (complaint) =>
        complaint.priority?.toLowerCase() ===
        "high"
    ).length;

  // =========================================================
  // FILTER
  // =========================================================

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const title =
        complaint.title || "";

      const id =
        complaint.complaintId ||
        complaint._id ||
        "";

      const department =
        complaint.department ||
        complaint.category ||
        "";

      const searchText =
        `${title} ${id} ${department}`.toLowerCase();

      const matchesSearch =
        searchText.includes(
          search.toLowerCase()
        );

      const complaintStatus =
        complaint.status ||
        "Pending";

      const matchesStatus =
        statusFilter === "All Status" ||
        complaintStatus.toLowerCase() ===
          statusFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    complaints,
    search,
    statusFilter,
  ]);

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    const value =
      status?.toLowerCase() || "pending";

    if (
      value === "resolved" ||
      value === "completed" ||
      value === "closed"
    ) {
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        dot: "bg-green-500",
      };
    }

    if (
      value === "in progress" ||
      value === "in-progress" ||
      value === "assigned"
    ) {
      return {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        dot: "bg-blue-500",
      };
    }

    if (
      value === "rejected" ||
      value === "declined"
    ) {
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        dot: "bg-red-500",
      };
    }

    return {
      bg: "bg-[#FFF8E6]",
      text: "text-[#A97400]",
      border: "border-[#F0D58A]",
      dot: "bg-[#E8AA0C]",
    };
  };

  // =========================================================
  // PRIORITY STYLE
  // =========================================================

  const getPriorityStyle = (priority) => {
    const value =
      priority?.toLowerCase();

    if (value === "high") {
      return "bg-red-50 text-red-600 border-red-200";
    }

    if (value === "low") {
      return "bg-green-50 text-green-600 border-green-200";
    }

    return "bg-[#FFF8E6] text-[#A97400] border-[#F0D58A]";
  };

  // =========================================================
  // DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Date unavailable";
    }
  };

  // =========================================================
  // VIEW COMPLAINT
  // =========================================================

  const handleViewComplaint = (complaint) => {
    const complaintId =
      complaint.complaintId ||
      complaint._id;

    if (!complaintId) {
      return;
    }

    navigate(
      `/complaint-details?id=${complaintId}`
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0B1B2B]">

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <nav className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="h-[68px] flex items-center justify-between">

            {/* LOGO */}

            <div
              onClick={() =>
                navigate("/dashboard")
              }
              className="flex items-center gap-3 cursor-pointer shrink-0"
            >

              <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] flex items-center justify-center">

                <FaBuilding className="text-[#0B1B2B] text-base" />

              </div>

              <div>

                <div className="text-[18px] leading-5 font-bold text-white">
                  Smart Municipality
                </div>

                <div className="text-[10px] leading-4 text-gray-400">
                  Citizen Services
                </div>

              </div>

            </div>

            {/* NAVIGATION */}

            <div className="hidden lg:flex items-center gap-2 ml-auto mr-6">

              <button
                onClick={() =>
                  navigate("/dashboard")
                }
                className="px-5 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Home
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/register-complaint"
                  )
                }
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Register Complaint
              </button>

              <button
                className="px-5 py-2.5 rounded-md bg-[#E8AA0C] text-[#0B1B2B] text-[14px] font-bold"
              >
                My Complaints
              </button>

              <button
                onClick={() =>
                  navigate("/departments")
                }
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Departments
              </button>

              <button
                onClick={() =>
                  navigate("/notifications")
                }
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Notifications
              </button>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-3 shrink-0">

              <button
                onClick={() =>
                  navigate("/notifications")
                }
                className="relative w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white"
              >

                <FaBell className="text-[15px]" />

                <span className="absolute top-0 right-0 w-[16px] h-[16px] rounded-full bg-[#E8AA0C] text-[#0B1B2B] text-[9px] font-bold flex items-center justify-center">
                  3
                </span>

              </button>

              <button
                onClick={() =>
                  navigate("/profile")
                }
                className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/15 transition"
              >

                <FaUser className="text-[#E8AA0C] text-[13px]" />

              </button>

              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white text-[14px] ml-1"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </nav>

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="py-10">

            <div className="text-[#E8AA0C] text-[12px] font-bold uppercase tracking-[0.18em]">
              Citizen Portal
            </div>

            <h1 className="text-[38px] md:text-[42px] font-bold leading-tight mt-3">
              My Complaints
            </h1>

            <p className="text-gray-400 text-[14px] mt-3">
              View and track all your registered civic complaints.
            </p>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="max-w-[1280px] mx-auto px-6 py-8">

        {/* ================================================= */}
        {/* STATISTICS */}
        {/* ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* TOTAL */}

          <StatCard
            title="TOTAL"
            value={totalComplaints}
            icon={<FaClipboardList />}
            iconClass="bg-[#FFF8E6] text-[#A97400]"
          />

          {/* PENDING */}

          <StatCard
            title="PENDING"
            value={pendingComplaints}
            icon={<FaClock />}
            iconClass="bg-[#FFF8E6] text-[#D18A00]"
          />

          {/* RESOLVED */}

          <StatCard
            title="RESOLVED"
            value={resolvedComplaints}
            icon={<FaCheckCircle />}
            iconClass="bg-green-50 text-green-600"
          />

          {/* HIGH PRIORITY */}

          <StatCard
            title="HIGH PRIORITY"
            value={highPriorityComplaints}
            icon={<FaExclamationCircle />}
            iconClass="bg-red-50 text-red-500"
          />

        </div>

        {/* ================================================= */}
        {/* SEARCH / FILTER */}
        {/* ================================================= */}

        <section className="bg-white border border-[#DCE3EA] rounded-xl p-5 mt-5">

          <div className="sm-filter-bar">

            {/* SEARCH */}

            <div className="sm-search-box flex-1">

              <FaSearch className="text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by complaint title, ID or department..."
                className="h-[44px] border border-[#DCE3EA] rounded-lg pr-4 text-[14px] text-[#0B1B2B] outline-none focus:border-[#E8AA0C] focus:ring-1 focus:ring-[#E8AA0C]"
              />

            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="lg:w-[190px] h-[44px] border border-[#DCE3EA] rounded-lg px-4 text-[14px] text-[#0B1B2B] bg-white outline-none focus:border-[#E8AA0C]"
            >

              <option>All Status</option>
              <option>Pending</option>
              <option>Assigned</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Completed</option>
              <option>Declined</option>

            </select>

            {/* NEW COMPLAINT */}

            <button
              onClick={() =>
                navigate(
                  "/register-complaint"
                )
              }
              className="h-[44px] px-6 bg-[#0B1B2B] text-white rounded-lg flex items-center justify-center gap-2 text-[14px] font-bold hover:bg-[#132B40] transition whitespace-nowrap"
            >

              <FaPlus className="text-[#E8AA0C] flex-shrink-0" />

              New Complaint

            </button>

          </div>

        </section>

        {/* ================================================= */}
        {/* COMPLAINT HISTORY HEADER */}
        {/* ================================================= */}

        <div className="flex items-end justify-between mt-8 mb-5">

          <div>

            <div className="text-[#A97400] text-[12px] font-bold uppercase tracking-[0.16em]">
              Complaint History
            </div>

            <h2 className="text-[30px] font-semibold mt-2">
              Your Complaints
            </h2>

          </div>

          <div className="text-[13px] text-gray-400">

            {filteredComplaints.length}{" "}
            {filteredComplaints.length === 1
              ? "complaint"
              : "complaints"}

          </div>

        </div>

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading && (

          <div className="bg-white border border-[#DCE3EA] rounded-xl p-12 text-center">

            <div className="w-10 h-10 border-4 border-[#E8AA0C]/20 border-t-[#E8AA0C] rounded-full animate-spin mx-auto" />

            <p className="text-sm text-gray-500 mt-4">
              Loading your complaints...
            </p>

          </div>

        )}

        {/* ================================================= */}
        {/* EMPTY */}
        {/* ================================================= */}

        {!loading &&
          filteredComplaints.length === 0 && (

            <div className="bg-white border border-[#DCE3EA] rounded-xl p-12 text-center">

              <div className="w-14 h-14 bg-[#FFF8E6] text-[#A97400] rounded-xl flex items-center justify-center mx-auto">

                <FaClipboardList className="text-xl" />

              </div>

              <h3 className="text-xl font-bold mt-5">
                No complaints found
              </h3>

              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">

                {search ||
                statusFilter !== "All Status"
                  ? "Try changing your search or status filter."
                  : "You have not registered any complaints yet."}

              </p>

              {!search &&
                statusFilter ===
                  "All Status" && (

                <button
                  onClick={() =>
                    navigate(
                      "/register-complaint"
                    )
                  }
                  className="mt-6 px-5 py-3 bg-[#0B1B2B] text-white rounded-lg text-sm font-bold"
                >

                  Register a Complaint

                </button>

              )}

            </div>
          )}

        {/* ================================================= */}
        {/* COMPLAINT CARDS */}
        {/* ================================================= */}

        {!loading &&
          filteredComplaints.length > 0 && (

            <div className="space-y-4">

              {filteredComplaints.map(
                (complaint, index) => {

                  const status =
                    complaint.status ||
                    "Pending";

                  const priority =
                    complaint.priority ||
                    "Medium";

                  const statusStyle =
                    getStatusStyle(status);

                  const priorityStyle =
                    getPriorityStyle(
                      priority
                    );

                  const complaintId =
                    complaint.complaintId ||
                    complaint._id ||
                    `CMP-${index + 1}`;

                  return (

                    <div
                      key={
                        complaint._id ||
                        complaint.complaintId ||
                        index
                      }
                      className="bg-white border border-[#DCE3EA] rounded-xl p-5 md:p-6 hover:shadow-md transition"
                    >

                      {/* TOP */}

                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                        <div className="flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="text-[11px] font-bold text-[#A97400] uppercase tracking-wider">
                              {complaintId}
                            </span>

                            <span
                              className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                            >

                              <span
                                className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${statusStyle.dot}`}
                              />

                              {status}

                            </span>

                            <span
                              className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase ${priorityStyle}`}
                            >
                              {priority} Priority
                            </span>

                          </div>

                          <h3 className="text-[20px] font-bold mt-3 text-[#0B1B2B]">
                            {complaint.title ||
                              "Untitled Complaint"}
                          </h3>

                          <p className="text-[13px] text-gray-500 leading-6 mt-2 max-w-3xl">

                            {complaint.description ||
                              "No description available."}

                          </p>

                        </div>

                        {/* VIEW */}

                        <button
                          onClick={() =>
                            handleViewComplaint(
                              complaint
                            )
                          }
                          className="shrink-0 px-4 py-2.5 border border-[#DCE3EA] rounded-lg text-[#0B1B2B] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#F5F7FA] transition"
                        >

                          <FaEye className="text-[#A97400]" />

                          View Details

                        </button>

                      </div>

                      {/* BOTTOM INFO */}

                      <div className="border-t border-[#EEF1F4] mt-5 pt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-[12px] text-gray-500">

                        <div className="flex items-center gap-2">

                          <FaBuilding className="text-[#A97400]" />

                          <span>
                            {complaint.department ||
                              complaint.category ||
                              "Municipal Department"}
                          </span>

                        </div>

                        <div className="flex items-center gap-2">

                          <FaMapMarkerAlt className="text-[#A97400]" />

                          <span>
                            {complaint.location ||
                              "Location not provided"}
                          </span>

                        </div>

                        <div className="flex items-center gap-2">

                          <FaCalendarAlt className="text-[#A97400]" />

                          <span>
                            {formatDate(
                              complaint.createdAt ||
                                complaint.created_at ||
                                complaint.date
                            )}
                          </span>

                        </div>

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

      </main>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer className="bg-[#071521] text-white mt-10">

        <div className="max-w-[1280px] mx-auto px-6 py-6">

          <div className="flex items-center justify-between">

            <p className="text-[11px] text-gray-500">
              © 2026 Smart Municipality
            </p>

            <p className="text-[11px] text-gray-600">
              Digital Citizen Services
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  title,
  value,
  icon,
  iconClass,
}) {
  return (
    <div className="bg-white border border-[#DCE3EA] rounded-xl p-6 min-h-[150px]">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[11px] text-gray-400 font-bold tracking-wide">
            {title}
          </p>

          <p className="text-[32px] font-bold text-[#0B1B2B] mt-4">
            {value}
          </p>

        </div>

        <div
          className={`w-11 h-11 rounded-lg flex items-center justify-center text-[16px] ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default MyComplaints;