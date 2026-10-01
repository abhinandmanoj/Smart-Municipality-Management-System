import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaUser,
  FaPlus,
  FaSearch,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";

function CitizenComplaints() {
  const navigate = useNavigate();

  /* =====================================================
     USER
  ===================================================== */

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
    user?.email || "";

  /* =====================================================
     STATE
  ===================================================== */

  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  /* =====================================================
     FETCH USER COMPLAINTS
  ===================================================== */

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        if (!userEmail) {
          setComplaints([]);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/complaints/user/${encodeURIComponent(
            userEmail
          )}`
        );

        const data = await response.json();

        if (response.ok) {
          const complaintData =
            Array.isArray(data)
              ? data
              : data.complaints || data.data || [];

          setComplaints(complaintData);
        } else {
          console.error(
            "Failed to fetch complaints:",
            data
          );

          setComplaints([]);
        }
      } catch (error) {
        console.error(
          "Error fetching complaints:",
          error
        );

        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [userEmail]);

  /* =====================================================
     STATISTICS
  ===================================================== */

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) =>
      String(complaint.status || "").toLowerCase() ===
        "pending" ||
      String(complaint.status || "").toLowerCase() ===
        "assigned" ||
      String(complaint.status || "").toLowerCase() ===
        "in progress"
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => {
      const status = String(
        complaint.status || ""
      ).toLowerCase();

      return (
        status === "resolved" ||
        status === "completed"
      );
    }
  ).length;

  const highPriorityComplaints = complaints.filter(
    (complaint) =>
      String(complaint.priority || "").toLowerCase() ===
      "high"
  ).length;

  /* =====================================================
     FILTER COMPLAINTS
  ===================================================== */

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const title =
        complaint.title ||
        complaint.complaintTitle ||
        "";

      const department =
        complaint.department ||
        complaint.category ||
        "";

      const id =
        complaint._id ||
        complaint.id ||
        "";

      const searchText =
        `${title} ${department} ${id}`.toLowerCase();

      const matchesSearch =
        searchText.includes(
          search.toLowerCase()
        );

      const complaintStatus =
        String(
          complaint.status || ""
        ).toLowerCase();

      const selectedStatus =
        statusFilter.toLowerCase();

      const matchesStatus =
        statusFilter === "All Status" ||
        complaintStatus === selectedStatus;

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

  /* =====================================================
     STATUS STYLE
  ===================================================== */

  const getStatusStyle = (status) => {
    const value = String(
      status || "Pending"
    ).toLowerCase();

    if (
      value === "resolved" ||
      value === "completed"
    ) {
      return {
        bg: "#EAF8EF",
        text: "#0A9F4A",
      };
    }

    if (
      value === "in progress" ||
      value === "assigned"
    ) {
      return {
        bg: "#FFF6DD",
        text: "#B77A00",
      };
    }

    if (
      value === "rejected" ||
      value === "declined"
    ) {
      return {
        bg: "#FDECEC",
        text: "#D9363E",
      };
    }

    return {
      bg: "#FFF6DD",
      text: "#B77A00",
    };
  };

  /* =====================================================
     PRIORITY STYLE
  ===================================================== */

  const getPriorityStyle = (priority) => {
    const value = String(
      priority || "Medium"
    ).toLowerCase();

    if (value === "high") {
      return {
        bg: "#FDECEC",
        text: "#D9363E",
      };
    }

    if (value === "low") {
      return {
        bg: "#EAF8EF",
        text: "#0A9F4A",
      };
    }

    return {
      bg: "#FFF6DD",
      text: "#B77A00",
    };
  };

  /* =====================================================
     DATE FORMAT
  ===================================================== */

  const formatDate = (date) => {
    if (!date) return "Not available";

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
      return "Not available";
    }
  };

  /* =====================================================
     VIEW COMPLAINT
  ===================================================== */

  const viewComplaint = (complaint) => {
    const id =
      complaint._id ||
      complaint.id;

    if (id) {
      navigate(
        `/complaint-details?id=${id}`
      );
    }
  };

  /* =====================================================
     DELETE COMPLAINT
  ===================================================== */

  const deleteComplaint = async (complaint) => {
    const id =
      complaint._id ||
      complaint.id;

    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setComplaints((previous) =>
          previous.filter(
            (item) =>
              (item._id || item.id) !== id
          )
        );
      } else {
        alert(
          "Unable to delete the complaint."
        );
      }
    } catch (error) {
      console.error(
        "Delete complaint error:",
        error
      );

      alert(
        "Server error while deleting complaint."
      );
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0B1B2B]">

      {/* =================================================
          NAVBAR
      ================================================= */}

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
                  navigate("/register-complaint")
                }
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Register Complaint
              </button>

              <button
                className="px-4 py-2.5 rounded-md bg-[#E8AA0C] text-[#0B1B2B] text-[14px] font-bold"
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

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="py-9">

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

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="max-w-[1280px] mx-auto px-6 py-7">

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* TOTAL */}

          <div className="bg-white border border-[#DCE3EA] rounded-lg p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  Total Complaints
                </p>

                <h2 className="text-[32px] font-bold mt-3">
                  {totalComplaints}
                </h2>

              </div>

              <div className="w-11 h-11 rounded-lg bg-[#FFF6DD] flex items-center justify-center">
                <FaClipboardList className="text-[#B77A00]" />
              </div>

            </div>

          </div>

          {/* PENDING */}

          <div className="bg-white border border-[#DCE3EA] rounded-lg p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  Pending
                </p>

                <h2 className="text-[32px] font-bold mt-3">
                  {pendingComplaints}
                </h2>

              </div>

              <div className="w-11 h-11 rounded-lg bg-[#FFF6DD] flex items-center justify-center">
                <FaClock className="text-[#D18B00]" />
              </div>

            </div>

          </div>

          {/* RESOLVED */}

          <div className="bg-white border border-[#DCE3EA] rounded-lg p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  Resolved
                </p>

                <h2 className="text-[32px] font-bold mt-3">
                  {resolvedComplaints}
                </h2>

              </div>

              <div className="w-11 h-11 rounded-lg bg-[#EAF8EF] flex items-center justify-center">
                <FaCheckCircle className="text-[#0A9F4A]" />
              </div>

            </div>

          </div>

          {/* HIGH PRIORITY */}

          <div className="bg-white border border-[#DCE3EA] rounded-lg p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  High Priority
                </p>

                <h2 className="text-[32px] font-bold mt-3">
                  {highPriorityComplaints}
                </h2>

              </div>

              <div className="w-11 h-11 rounded-lg bg-[#FDECEC] flex items-center justify-center">
                <FaExclamationCircle className="text-[#D9363E]" />
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            SEARCH AREA
        ================================================= */}

        <div className="bg-white border border-[#DCE3EA] rounded-lg mt-6 p-5">

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
                className="h-[44px] border border-[#DCE3EA] rounded-md outline-none text-[14px] text-[#0B1B2B] focus:border-[#E8AA0C]"
              />

            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="h-[44px] lg:w-[190px] px-4 border border-[#DCE3EA] rounded-md outline-none text-[14px] bg-white text-[#0B1B2B]"
            >

              <option>All Status</option>
              <option>Pending</option>
              <option>Assigned</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Completed</option>
              <option>Rejected</option>

            </select>

            {/* NEW COMPLAINT */}

            <button
              onClick={() =>
                navigate("/register-complaint")
              }
              className="h-[44px] px-6 bg-[#0B1B2B] text-white rounded-md flex items-center justify-center gap-2 text-[14px] font-bold hover:bg-[#142B40] transition whitespace-nowrap"
            >

              <FaPlus className="text-[#E8AA0C] flex-shrink-0" />

              New Complaint

            </button>

          </div>

        </div>

        {/* =================================================
            COMPLAINT HISTORY
        ================================================= */}

        <div className="mt-8">

          <div className="flex items-end justify-between mb-5">

            <div>

              <div className="text-[#A97400] text-[12px] font-bold uppercase tracking-[0.16em]">
                Complaint History
              </div>

              <h2 className="text-[30px] font-semibold mt-2">
                Your Complaints
              </h2>

            </div>

            <div className="text-[13px] text-gray-500">
              {filteredComplaints.length} complaint
              {filteredComplaints.length !== 1
                ? "s"
                : ""}
            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="bg-white border border-[#DCE3EA] rounded-lg p-10 text-center">

              <div className="w-9 h-9 mx-auto border-4 border-gray-200 border-t-[#E8AA0C] rounded-full animate-spin" />

              <p className="text-gray-500 text-[14px] mt-4">
                Loading your complaints...
              </p>

            </div>
          )}

          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            filteredComplaints.length === 0 && (

              <div className="bg-white border border-[#DCE3EA] rounded-lg p-12 text-center">

                <div className="w-14 h-14 mx-auto rounded-full bg-[#FFF6DD] flex items-center justify-center">

                  <FaClipboardList className="text-[#D18B00] text-xl" />

                </div>

                <h3 className="text-[20px] font-semibold mt-5">
                  No complaints found
                </h3>

                <p className="text-gray-500 text-[14px] mt-2">
                  You haven't registered any complaints matching your search.
                </p>

                <button
                  onClick={() =>
                    navigate("/register-complaint")
                  }
                  className="mt-5 h-[44px] px-5 bg-[#E8AA0C] text-[#0B1B2B] rounded-md font-bold text-[14px]"
                >
                  Register a Complaint
                </button>

              </div>

            )}

          {/* =================================================
              COMPLAINT LIST
          ================================================= */}

          {!loading &&
            filteredComplaints.length > 0 && (

              <div className="space-y-4">

                {filteredComplaints.map(
                  (complaint, index) => {

                    const title =
                      complaint.title ||
                      complaint.complaintTitle ||
                      "Untitled Complaint";

                    const department =
                      complaint.department ||
                      complaint.category ||
                      "General";

                    const status =
                      complaint.status ||
                      "Pending";

                    const priority =
                      complaint.priority ||
                      "Medium";

                    const id =
                      complaint._id ||
                      complaint.id ||
                      `CMP-${index + 1}`;

                    const statusStyle =
                      getStatusStyle(status);

                    const priorityStyle =
                      getPriorityStyle(priority);

                    return (

                      <div
                        key={id}
                        className="bg-white border border-[#DCE3EA] rounded-lg p-5 hover:shadow-sm transition"
                      >

                        <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                          {/* LEFT */}

                          <div className="flex-1 min-w-0">

                            <div className="flex items-start gap-4">

                              <div className="w-11 h-11 rounded-lg bg-[#0B1B2B] text-[#E8AA0C] flex items-center justify-center shrink-0">
                                <FaClipboardList />
                              </div>

                              <div className="min-w-0">

                                <h3 className="text-[18px] font-semibold text-[#0B1B2B] truncate">
                                  {title}
                                </h3>

                                <div className="flex flex-wrap items-center gap-3 mt-2 text-[12px] text-gray-500">

                                  <span>
                                    ID: {id}
                                  </span>

                                  <span>
                                    •
                                  </span>

                                  <span>
                                    {department}
                                  </span>

                                  <span>
                                    •
                                  </span>

                                  <span>
                                    {formatDate(
                                      complaint.createdAt ||
                                      complaint.date
                                    )}
                                  </span>

                                </div>

                              </div>

                            </div>

                          </div>

                          {/* STATUS */}

                          <div className="flex items-center gap-2">

                            <span
                              className="px-3 py-1.5 rounded-full text-[11px] font-bold"
                              style={{
                                backgroundColor:
                                  statusStyle.bg,
                                color:
                                  statusStyle.text,
                              }}
                            >
                              {status}
                            </span>

                            <span
                              className="px-3 py-1.5 rounded-full text-[11px] font-bold"
                              style={{
                                backgroundColor:
                                  priorityStyle.bg,
                                color:
                                  priorityStyle.text,
                              }}
                            >
                              {priority}
                            </span>

                          </div>

                          {/* ACTIONS */}

                          <div className="flex items-center gap-2">

                            <button
                              onClick={() =>
                                viewComplaint(
                                  complaint
                                )
                              }
                              className="w-10 h-10 rounded-md border border-[#DCE3EA] flex items-center justify-center text-[#0B1B2B] hover:bg-[#F5F7FA]"
                              title="View complaint"
                            >

                              <FaEye className="text-[13px]" />

                            </button>

                            <button
                              onClick={() =>
                                deleteComplaint(
                                  complaint
                                )
                              }
                              className="w-10 h-10 rounded-md border border-[#FDECEC] flex items-center justify-center text-[#D9363E] hover:bg-[#FDECEC]"
                              title="Delete complaint"
                            >

                              <FaTrash className="text-[13px]" />

                            </button>

                          </div>

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            )}

        </div>

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="bg-[#071521] text-white mt-8">

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

export default CitizenComplaints;