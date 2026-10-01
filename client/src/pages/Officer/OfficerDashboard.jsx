import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTasks,
} from "react-icons/fa";

function OfficerDashboard() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    assigned: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  // =====================================================
  // LOAD LOGGED-IN OFFICER
  // =====================================================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);

      // Make sure only Officer can access this page
      if (
        parsedUser.role &&
        parsedUser.role.toLowerCase() !== "officer"
      ) {
        navigate("/");
        return;
      }
    } catch (error) {
      console.error("Invalid user data:", error);
      navigate("/");
    }
  }, [navigate]);

  // =====================================================
  // FETCH OFFICER COMPLAINTS
  // =====================================================

  useEffect(() => {
    if (!user) return;

    const fetchComplaints = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/complaints",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {}),
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch complaints"
          );
        }

        const result = await response.json();

        const complaints =
          result.data ||
          result.complaints ||
          [];

        // =================================================
        // GET OFFICER DEPARTMENT
        // =================================================

        const officerDepartment =
          user.department || "";

        // =================================================
        // FILTER ONLY THIS OFFICER'S DEPARTMENT
        // =================================================

        const departmentComplaints =
          complaints.filter((complaint) => {
            const complaintDepartment =
              complaint.department ||
              complaint.assignedDepartment ||
              complaint.assignedToDepartment ||
              "";

            return (
              String(complaintDepartment)
                .trim()
                .toLowerCase() ===
              String(officerDepartment)
                .trim()
                .toLowerCase()
            );
          });

        // =================================================
        // STATUS COUNTS
        // =================================================

        const assigned =
          departmentComplaints.length;

        const pending =
          departmentComplaints.filter(
            (complaint) => {
              const status = String(
                complaint.status || ""
              ).toLowerCase();

              return (
                status === "pending" ||
                status === "assigned"
              );
            }
          ).length;

        const inProgress =
          departmentComplaints.filter(
            (complaint) => {
              const status = String(
                complaint.status || ""
              ).toLowerCase();

              return (
                status === "in progress" ||
                status === "in-progress" ||
                status === "in_progress"
              );
            }
          ).length;

        const resolved =
          departmentComplaints.filter(
            (complaint) => {
              const status = String(
                complaint.status || ""
              ).toLowerCase();

              return (
                status === "resolved" ||
                status === "completed" ||
                status === "closed"
              );
            }
          ).length;

        setStats({
          assigned,
          pending,
          inProgress,
          resolved,
        });
      } catch (error) {
        console.error(
          "Error loading officer complaints:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const goTo = (path) => {
    navigate(path);
  };

  // =====================================================
  // OFFICER NAME
  // =====================================================

  const officerName =
    user?.name ||
    "Officer";

  const department =
    user?.department ||
    "Department";

  // =====================================================
  // UI
  // =====================================================

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
                goTo("/officer/dashboard")
              }
              className="flex items-center gap-3 cursor-pointer shrink-0"
            >

              <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] flex items-center justify-center">

                <FaBuilding className="text-[#0B1B2B] text-base" />

              </div>

              <div>

                <div className="text-[20px] leading-5 font-bold text-white">
                  Smart Municipality
                </div>

                <div className="text-[10px] leading-4 text-gray-400">
                  Officer Portal
                </div>

              </div>

            </div>

            {/* NAVIGATION */}

            <div className="hidden lg:flex items-center gap-1 ml-auto mr-6">

              {/* DASHBOARD */}

              <button
                onClick={() =>
                  goTo("/officer/dashboard")
                }
                className="
                  px-5
                  py-2.5
                  rounded-md
                  bg-[#E8AA0C]
                  text-[#0B1B2B]
                  text-[14px]
                  font-bold
                "
              >
                Dashboard
              </button>

              {/* COMPLAINTS */}

              <button
                onClick={() =>
                  goTo("/officer/complaints")
                }
                className="
                  px-4
                  py-2.5
                  rounded-md
                  text-[14px]
                  text-gray-300
                  hover:text-white
                  hover:bg-white/5
                  transition
                "
              >
                Complaints
              </button>

              {/* TASKS */}

              <button
                onClick={() =>
                  goTo("/officer/tasks")
                }
                className="
                  px-4
                  py-2.5
                  rounded-md
                  text-[14px]
                  text-gray-300
                  hover:text-white
                  hover:bg-white/5
                  transition
                "
              >
                Tasks
              </button>

              {/* NOTIFICATIONS */}

              <button
                onClick={() =>
                  goTo("/officer/notifications")
                }
                className="
                  px-4
                  py-2.5
                  rounded-md
                  text-[14px]
                  text-gray-300
                  hover:text-white
                  hover:bg-white/5
                  transition
                "
              >
                Notifications
              </button>

            </div>

            {/* RIGHT SIDE */}

            <div className="flex items-center gap-3 shrink-0">

              {/* NOTIFICATION */}

              <button
                onClick={() =>
                  goTo("/officer/notifications")
                }
                className="
                  relative
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  text-gray-300
                  hover:text-white
                "
              >

                <FaBell className="text-[15px]" />

                <span
                  className="
                    absolute
                    top-0
                    right-0
                    w-[16px]
                    h-[16px]
                    rounded-full
                    bg-[#E8AA0C]
                    text-[#0B1B2B]
                    text-[9px]
                    font-bold
                    flex
                    items-center
                    justify-center
                  "
                >
                  3
                </span>

              </button>

              {/* PROFILE */}

              <button
                onClick={() =>
                  goTo("/officer/profile")
                }
                className="
                  w-9
                  h-9
                  rounded-md
                  bg-white/10
                  flex
                  items-center
                  justify-center
                  hover:bg-white/15
                  transition
                "
              >

                <FaUser className="text-[#E8AA0C] text-[14px]" />

              </button>

              {/* LOGOUT */}

              <button
                onClick={handleLogout}
                className="
                  text-gray-300
                  hover:text-white
                  text-[14px]
                  ml-1
                  flex
                  items-center
                  gap-2
                "
              >

                Logout

                <FaSignOutAlt className="text-xs" />

              </button>

            </div>

          </div>

        </div>

      </nav>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="py-[42px] md:py-[48px]">

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 items-center">

              {/* LEFT */}

              <div>

                <div
                  className="
                    text-[#E8AA0C]
                    text-[12px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                  "
                >
                  Officer Portal
                </div>

                <h1
                  className="
                    text-[36px]
                    md:text-[42px]
                    font-bold
                    leading-[1.12]
                    mt-3
                  "
                >
                  Welcome, {department} Officer 👋
                </h1>

                <p
                  className="
                    text-gray-400
                    text-[14px]
                    leading-6
                    mt-3
                    max-w-[650px]
                  "
                >
                  Manage complaints assigned to your
                  department and monitor municipal tasks.
                </p>

                {/* BUTTONS */}

                <div className="flex items-center gap-3 mt-6">

                  <button
                    onClick={() =>
                      goTo("/officer/complaints")
                    }
                    className="
                      h-[44px]
                      px-5
                      bg-[#E8AA0C]
                      text-[#0B1B2B]
                      rounded-md
                      flex
                      items-center
                      gap-2
                      text-[14px]
                      font-bold
                      hover:bg-[#D99D00]
                      transition
                    "
                  >

                    <FaClipboardList className="text-[13px]" />

                    Manage Complaints

                  </button>

                  <button
                    onClick={() =>
                      goTo("/officer/tasks")
                    }
                    className="
                      h-[44px]
                      px-5
                      border
                      border-gray-500
                      text-white
                      rounded-md
                      flex
                      items-center
                      gap-2
                      text-[14px]
                      font-bold
                      hover:bg-white/5
                      transition
                    "
                  >

                    <FaTasks className="text-[13px]" />

                    My Tasks

                  </button>

                </div>

              </div>

              {/* DEPARTMENT CARD */}

              <div
                className="
                  border
                  border-gray-500
                  rounded-xl
                  p-7
                  min-h-[170px]
                  flex
                  flex-col
                  justify-center
                "
              >

                <p className="text-gray-400 text-[11px] uppercase tracking-wide">
                  Your Department
                </p>

                <h2 className="text-[20px] font-bold mt-4">
                  {department}
                </h2>

                <p className="text-gray-400 text-[13px] mt-4">
                  Department-specific access
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          DEPARTMENT OVERVIEW
      ================================================= */}

      <section className="bg-[#F5F7FA]">

        <div className="max-w-[1280px] mx-auto px-6 py-[42px]">

          {/* HEADER */}

          <div>

            <div
              className="
                text-[#A97400]
                text-[12px]
                font-bold
                uppercase
                tracking-[0.16em]
              "
            >
              Department Overview
            </div>

            <h2
              className="
                text-[30px]
                md:text-[34px]
                font-semibold
                leading-tight
                mt-2
                text-[#0B1B2B]
              "
            >
              {department}
            </h2>

            <p className="text-gray-500 text-[14px] mt-2">
              Current complaints assigned to your department.
            </p>

          </div>

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-5
              mt-7
            "
          >

            {/* ASSIGNED */}

            <OfficerStat
              title="Assigned"
              value={
                loading
                  ? "..."
                  : stats.assigned
              }
              description="Department complaints"
              icon={<FaClipboardList />}
            />

            {/* PENDING */}

            <OfficerStat
              title="Pending"
              value={
                loading
                  ? "..."
                  : stats.pending
              }
              description="Awaiting action"
              icon={<FaClock />}
            />

            {/* IN PROGRESS */}

            <OfficerStat
              title="In Progress"
              value={
                loading
                  ? "..."
                  : stats.inProgress
              }
              description="Currently handling"
              icon={<FaTasks />}
            />

            {/* RESOLVED */}

            <OfficerStat
              title="Resolved"
              value={
                loading
                  ? "..."
                  : stats.resolved
              }
              description="Successfully completed"
              icon={<FaCheckCircle />}
            />

          </div>

        </div>

      </section>

      {/* =================================================
          QUICK ACTION
      ================================================= */}

      <section className="bg-white border-t border-[#DCE3EA]">

        <div className="max-w-[1280px] mx-auto px-6 py-7">

          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-between
              gap-5
            "
          >

            <div>

              <p
                className="
                  text-[11px]
                  uppercase
                  tracking-wide
                  text-gray-400
                  font-bold
                "
              >
                Department Complaints
              </p>

              <p className="text-[14px] text-gray-500 mt-1">
                View and manage complaints assigned to{" "}
                {department}.
              </p>

            </div>

            <button
              onClick={() =>
                goTo("/officer/complaints")
              }
              className="
                flex
                items-center
                gap-2
                bg-[#0B1B2B]
                text-white
                px-5
                py-3
                rounded-md
                text-[14px]
                font-bold
                hover:bg-[#162B40]
                transition
              "
            >

              View Complaints

              <span className="text-lg">
                →
              </span>

            </button>

          </div>

        </div>

      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="bg-[#071521] text-white">

        <div className="max-w-[1280px] mx-auto px-6 py-6">

          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-between
              gap-3
            "
          >

            <p className="text-[11px] text-gray-500">
              © 2026 Smart Municipality
            </p>

            <p className="text-[11px] text-gray-600">
              Officer Management Portal
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

// =========================================================
// OFFICER STAT COMPONENT
// =========================================================

function OfficerStat({
  title,
  value,
  description,
  icon,
}) {
  return (
    <div
      className="
        bg-white
        border
        border-[#DCE3EA]
        rounded-lg
        p-5
        min-h-[165px]
        hover:shadow-sm
        transition
      "
    >

      {/* ICON */}

      <div
        className="
          w-11
          h-11
          rounded-lg
          bg-[#0B1B2B]
          text-[#E8AA0C]
          flex
          items-center
          justify-center
          text-[16px]
        "
      >
        {icon}
      </div>

      {/* TITLE */}

      <p
        className="
          text-[11px]
          uppercase
          tracking-wide
          text-gray-400
          font-bold
          mt-6
        "
      >
        {title}
      </p>

      {/* VALUE */}

      <p
        className="
          text-[30px]
          font-bold
          text-[#0B1B2B]
          mt-1
        "
      >
        {value}
      </p>

      {/* DESCRIPTION */}

      <p
        className="
          text-[11px]
          text-gray-500
          mt-1
        "
      >
        {description}
      </p>

    </div>
  );
}

export default OfficerDashboard;