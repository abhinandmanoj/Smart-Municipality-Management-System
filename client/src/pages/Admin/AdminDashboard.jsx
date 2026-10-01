import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaUserShield,
  FaSignOutAlt,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaRobot,
  FaUsers,
} from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();

  // =================================================
  // STATE
  // =================================================

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalCitizens: 0,
    totalComplaints: 0,
    pending: 0,
    resolved: 0,
    highPriority: 0,
  });

  // =================================================
  // FETCH COMPLAINTS
  // =================================================

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:5000/api/complaints"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch complaints");
        }

        const result = await response.json();

        if (result.success) {
          const complaintData = result.data || [];

          // -----------------------------------------
          // TOTAL COMPLAINTS
          // -----------------------------------------

          const totalComplaints = complaintData.length;

          // -----------------------------------------
          // PENDING
          // -----------------------------------------

          const pending = complaintData.filter(
            (complaint) =>
              String(complaint.status).toLowerCase() ===
              "pending"
          ).length;

          // -----------------------------------------
          // RESOLVED
          // -----------------------------------------

          const resolved = complaintData.filter(
            (complaint) =>
              String(complaint.status).toLowerCase() ===
              "resolved"
          ).length;

          // -----------------------------------------
          // HIGH PRIORITY
          // -----------------------------------------

          const highPriority = complaintData.filter(
            (complaint) =>
              String(complaint.priority).toLowerCase() ===
              "high"
          ).length;

          // -----------------------------------------
          // UNIQUE CITIZENS
          // -----------------------------------------

          const uniqueCitizens = new Set(
            complaintData
              .map(
                (complaint) =>
                  complaint.email ||
                  complaint.userEmail ||
                  complaint.user?.email
              )
              .filter(Boolean)
          );

          // -----------------------------------------
          // UPDATE STATS
          // -----------------------------------------

          setStats({
            totalCitizens: uniqueCitizens.size,
            totalComplaints,
            pending,
            resolved,
            highPriority,
          });
        } else {
          console.error(
            "Failed to load complaints:",
            result.message
          );
        }
      } catch (error) {
        console.error(
          "Error loading complaints:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // =================================================
  // LOGOUT
  // =================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // =================================================
  // NAVIGATION
  // =================================================

  const goTo = (path) => {
    navigate(path);
  };

  // =================================================
  // UI
  // =================================================

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0B1B2B]">

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <nav className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="h-[68px] flex items-center justify-between">

            {/* ================================================= */}
            {/* LOGO */}
            {/* ================================================= */}

            <div
              onClick={() => goTo("/admin/dashboard")}
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
                  Administration Portal
                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* NAVIGATION */}
            {/* ================================================= */}

            <div className="hidden lg:flex items-center gap-1 ml-auto mr-6">

              {/* DASHBOARD */}

              <button
                onClick={() => goTo("/admin/dashboard")}
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
                onClick={() => goTo("/admin/complaints")}
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

              {/* DEPARTMENTS */}

              <button
                onClick={() => goTo("/admin/departments")}
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
                Departments
              </button>

              {/* AI ANALYTICS */}

              <button
                onClick={() => goTo("/admin/analytics")}
                className="
                  px-4
                  py-2.5
                  rounded-md
                  text-[14px]
                  text-gray-300
                  hover:text-white
                  hover:bg-white/5
                  transition
                  flex
                  items-center
                  gap-2
                "
              >

                

                AI Analytics

              </button>

            </div>

            {/* ================================================= */}
            {/* RIGHT SIDE */}
            {/* ================================================= */}

            <div className="flex items-center gap-3 shrink-0">

              {/* NOTIFICATIONS */}

              <button
                onClick={() =>
                  goTo("/admin/notifications")
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
                  5
                </span>

              </button>

              {/* PROFILE */}

              <button
                onClick={() =>
                  goTo("/admin/profile")
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

                <FaUserShield className="text-[#E8AA0C] text-[14px]" />

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

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="py-[42px] md:py-[48px]">

            {/* LABEL */}

            <div
              className="
                text-[#E8AA0C]
                text-[12px]
                font-bold
                uppercase
                tracking-[0.18em]
              "
            >
              Administration Portal
            </div>

            {/* TITLE */}

            <h1
              className="
                text-[36px]
                md:text-[42px]
                font-bold
                leading-[1.12]
                mt-3
              "
            >
              Welcome back, Administrator!
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                text-gray-400
                text-[14px]
                leading-6
                mt-3
                max-w-[650px]
              "
            >
              Monitor citizen complaints, manage municipal
              services and improve civic operations with
              data-driven insights.
            </p>

            {/* BUTTONS */}

            <div className="flex items-center gap-3 mt-6">

              <button
                onClick={() =>
                  goTo("/admin/complaints")
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
                  goTo("/admin/analytics")
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

                <FaRobot className="text-[13px]" />

                AI Analytics

              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* MUNICIPALITY OVERVIEW */}
      {/* ================================================= */}

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
              Municipality Overview
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
              City at a glance
            </h2>

            <p className="text-gray-500 text-[14px] mt-2">
              Current statistics from the municipality database.
            </p>

          </div>

          {/* ================================================= */}
          {/* STATISTICS */}
          {/* ================================================= */}

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

            {/* TOTAL COMPLAINTS */}

            <AdminStat
              title="Total Complaints"
              value={
                loading
                  ? "..."
                  : stats.totalComplaints
              }
              description="Registered civic complaints"
              icon={<FaClipboardList />}
            />

            {/* PENDING */}

            <AdminStat
              title="Pending"
              value={
                loading
                  ? "..."
                  : stats.pending
              }
              description="Complaints awaiting action"
              icon={<FaClock />}
            />

            {/* RESOLVED */}

            <AdminStat
              title="Resolved"
              value={
                loading
                  ? "..."
                  : stats.resolved
              }
              description="Successfully completed"
              icon={<FaCheckCircle />}
            />

            {/* HIGH PRIORITY */}

            <AdminStat
              title="High Priority"
              value={
                loading
                  ? "..."
                  : stats.highPriority
              }
              description="Requires immediate attention"
              icon={<FaExclamationTriangle />}
            />

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* SMALL SYSTEM SUMMARY */}
      {/* ================================================= */}

      <section className="bg-white border-t border-[#DCE3EA]">

        <div className="max-w-[1280px] mx-auto px-6 py-6">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* CITIZENS */}

            <div className="flex items-center gap-3">

              <div
                className="
                  w-10
                  h-10
                  rounded-lg
                  bg-[#0B1B2B]
                  text-[#E8AA0C]
                  flex
                  items-center
                  justify-center
                "
              >
                <FaUsers />
              </div>

              <div>

                <p className="text-[11px] uppercase tracking-wide text-gray-400 font-bold">
                  Active Citizens
                </p>

                <p className="text-[20px] font-bold text-[#0B1B2B]">
                  {loading ? "..." : stats.totalCitizens}
                </p>

              </div>

            </div>

            {/* VIEW COMPLAINTS */}

            <button
              onClick={() =>
                goTo("/admin/complaints")
              }
              className="
                flex
                items-center
                gap-2
                text-[#A97400]
                text-[14px]
                font-bold
                hover:text-[#0B1B2B]
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

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

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
              Administration Management System
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

// =========================================================
// ADMIN STAT COMPONENT
// =========================================================

function AdminStat({
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

export default AdminDashboard;