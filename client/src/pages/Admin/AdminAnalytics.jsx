import { useEffect, useMemo, useState } from "react";
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
  FaChartLine,
  FaChartPie,
  FaSyncAlt,
} from "react-icons/fa";

/* ============================================================
   MUNICIPAL DEPARTMENTS
   ============================================================ */

const DEPARTMENTS = [
  "Road & Transport",
  "Waste Management",
  "Water Supply",
  "Electrical Services",
  "Drainage & Sewage",
  "Public Health",
  "Parks & Public Spaces",
];

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

function AdminAnalytics() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  /* ==========================================================
     FETCH COMPLAINTS
     ========================================================== */

  const fetchComplaints = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

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
          `Failed to fetch complaints (${response.status})`
        );
      }

      const data = await response.json();

      let complaintData = [];

      if (Array.isArray(data)) {
        complaintData = data;
      } else if (Array.isArray(data.complaints)) {
        complaintData = data.complaints;
      } else if (Array.isArray(data.data)) {
        complaintData = data.data;
      }

      setComplaints(complaintData);
    } catch (err) {
      console.error("Analytics data error:", err);

      setError(
        "Unable to load complaint data. Please check that the backend server is running."
      );

      setComplaints([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  /* ==========================================================
     LOGOUT
     ========================================================== */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  /* ==========================================================
     STATUS HELPERS
     ========================================================== */

  const getStatus = (complaint) => {
    return String(
      complaint.status ||
        complaint.complaintStatus ||
        ""
    )
      .trim()
      .toLowerCase();
  };

  const getPriority = (complaint) => {
    return String(
      complaint.priority ||
        complaint.urgency ||
        ""
    )
      .trim()
      .toLowerCase();
  };

  const isResolved = (complaint) => {
    const status = getStatus(complaint);

    return [
      "resolved",
      "completed",
      "closed",
      "closed successfully",
    ].includes(status);
  };

  const isPending = (complaint) => {
    const status = getStatus(complaint);

    return [
      "pending",
      "submitted",
      "new",
      "open",
    ].includes(status);
  };

  const isHighPriority = (complaint) => {
    const priority = getPriority(complaint);

    return [
      "high",
      "urgent",
      "critical",
      "emergency",
    ].includes(priority);
  };

  const isInProgress = (complaint) => {
    const status = getStatus(complaint);

    return [
      "in progress",
      "in-progress",
      "assigned",
      "processing",
      "under review",
    ].includes(status);
  };

  const isRejected = (complaint) => {
    const status = getStatus(complaint);

    return [
      "rejected",
      "declined",
      "cancelled",
      "canceled",
    ].includes(status);
  };

  /* ==========================================================
     MAIN STATISTICS
     ========================================================== */

  const statistics = useMemo(() => {
    const total = complaints.length;

    const resolved = complaints.filter(
      isResolved
    ).length;

    const pending = complaints.filter(
      isPending
    ).length;

    const highPriority = complaints.filter(
      isHighPriority
    ).length;

    const inProgress = complaints.filter(
      isInProgress
    ).length;

    const rejected = complaints.filter(
      isRejected
    ).length;

    return {
      total,
      resolved,
      pending,
      highPriority,
      inProgress,
      rejected,
    };
  }, [complaints]);

  /* ==========================================================
     DEPARTMENT STATISTICS
     ========================================================== */

  const departmentData = useMemo(() => {
    return DEPARTMENTS.map((department) => {
      const departmentComplaints = complaints.filter(
        (complaint) => {
          const complaintDepartment = String(
            complaint.department ||
              complaint.category ||
              ""
          )
            .trim()
            .toLowerCase();

          return (
            complaintDepartment ===
              department.toLowerCase() ||
            complaintDepartment.includes(
              department.toLowerCase()
            ) ||
            department
              .toLowerCase()
              .includes(complaintDepartment)
          );
        }
      );

      const resolved = departmentComplaints.filter(
        isResolved
      ).length;

      const total = departmentComplaints.length;

      const rate =
        total === 0
          ? 0
          : Math.round((resolved / total) * 100);

      return {
        name: department,
        complaints: total,
        resolved,
        rate,
      };
    });
  }, [complaints]);

  /* ==========================================================
     LAST 7 MONTHS
     ========================================================== */

  const monthlyData = useMemo(() => {
    const now = new Date();

    const months = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      months.push({
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleString("en-US", {
          month: "short",
        }),
        count: 0,
      });
    }

    complaints.forEach((complaint) => {
      const dateValue =
        complaint.createdAt ||
        complaint.created_at ||
        complaint.date ||
        complaint.createdDate;

      if (!dateValue) {
        return;
      }

      const date = new Date(dateValue);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const matchingMonth = months.find(
        (item) =>
          item.year === date.getFullYear() &&
          item.month === date.getMonth()
      );

      if (matchingMonth) {
        matchingMonth.count += 1;
      }
    });

    return months;
  }, [complaints]);

  /* ==========================================================
     MAX MONTHLY COUNT
     ========================================================== */

  const maxMonthlyCount = useMemo(() => {
    const maximum = Math.max(
      ...monthlyData.map(
        (item) => item.count
      ),
      0
    );

    return maximum || 1;
  }, [monthlyData]);

  /* ==========================================================
     MONTHLY CHANGE
     ========================================================== */

  const monthlyChange = useMemo(() => {
    if (monthlyData.length < 2) {
      return 0;
    }

    const current =
      monthlyData[
        monthlyData.length - 1
      ].count;

    const previous =
      monthlyData[
        monthlyData.length - 2
      ].count;

    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return Math.round(
      ((current - previous) / previous) *
        100
    );
  }, [monthlyData]);

  /* ==========================================================
     RESOLUTION RATE
     ========================================================== */

  const resolutionRate = useMemo(() => {
    if (statistics.total === 0) {
      return 0;
    }

    return Math.round(
      (statistics.resolved /
        statistics.total) *
        100
    );
  }, [statistics]);

  /* ==========================================================
     STATUS DISTRIBUTION
     ========================================================== */

  const statusData = useMemo(() => {
    return {
      resolved: statistics.resolved,
      pending: statistics.pending,
      inProgress: statistics.inProgress,
      rejected: statistics.rejected,
    };
  }, [statistics]);

  /* ==========================================================
     DONUT CHART
     ========================================================== */

  const donutStyle = useMemo(() => {
    const total =
      statusData.resolved +
      statusData.pending +
      statusData.inProgress +
      statusData.rejected;

    if (total === 0) {
      return {
        background:
          "conic-gradient(#e5e7eb 0deg 360deg)",
      };
    }

    const resolvedDegrees =
      (statusData.resolved / total) * 360;

    const pendingDegrees =
      (statusData.pending / total) * 360;

    const progressDegrees =
      (statusData.inProgress / total) * 360;

    const rejectedDegrees =
      (statusData.rejected / total) * 360;

    const firstEnd =
      resolvedDegrees;

    const secondEnd =
      firstEnd + pendingDegrees;

    const thirdEnd =
      secondEnd + progressDegrees;

    const fourthEnd =
      thirdEnd + rejectedDegrees;

    return {
      background: `conic-gradient(
        #00C853 0deg ${firstEnd}deg,
        #E8AA0C ${firstEnd}deg ${secondEnd}deg,
        #3B82F6 ${secondEnd}deg ${thirdEnd}deg,
        #EF4444 ${thirdEnd}deg ${fourthEnd}deg
      )`,
    };
  }, [statusData]);

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <AdminNavbar
        navigate={navigate}
        handleLogout={handleLogout}
      />

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <p className="text-[#E8AA0C] text-sm font-semibold uppercase tracking-widest">
            Administration Portal
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Analytics & Reports
          </h1>

          <p className="text-gray-400 mt-2">
            Monitor municipal performance and
            complaint trends across all departments.
          </p>

        </div>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ===================================================
            REFRESH
        =================================================== */}

        <div className="flex justify-end mb-5">

          <button
            onClick={() =>
              fetchComplaints(true)
            }
            disabled={refreshing}
            className="flex items-center gap-2 bg-[#0B1B2B] hover:bg-[#132B40] text-white px-5 py-3 rounded-lg text-sm font-bold transition disabled:opacity-60"
          >

            <FaSyncAlt
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh Data"}

          </button>

        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-5 py-4 mb-6 text-sm">

            <strong>
              Server connection warning:
            </strong>

            <span className="ml-2">
              {error}
            </span>

            <button
              onClick={() =>
                fetchComplaints()
              }
              className="ml-4 underline font-bold"
            >
              Retry
            </button>

          </div>
        )}

        {/* ===================================================
            STATISTICS
        =================================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <AnalyticsStat
            title="Total Complaints"
            value={
              loading
                ? "—"
                : statistics.total
            }
            subtitle="All complaints"
            icon={<FaClipboardList />}
            className="bg-blue-50 text-blue-600"
            change={
              loading
                ? null
                : monthlyChange
            }
          />

          <AnalyticsStat
            title="Resolved"
            value={
              loading
                ? "—"
                : statistics.resolved
            }
            subtitle="Successfully resolved"
            icon={<FaCheckCircle />}
            className="bg-green-50 text-green-600"
            change={null}
          />

          <AnalyticsStat
            title="Pending"
            value={
              loading
                ? "—"
                : statistics.pending
            }
            subtitle="Awaiting action"
            icon={<FaClock />}
            className="bg-yellow-50 text-yellow-700"
            change={null}
          />

          <AnalyticsStat
            title="High Priority"
            value={
              loading
                ? "—"
                : statistics.highPriority
            }
            subtitle="Urgent complaints"
            icon={
              <FaExclamationTriangle />
            }
            className="bg-red-50 text-red-600"
            change={null}
          />

        </div>

        {/* ===================================================
            CHARTS
        =================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">

          {/* =================================================
              COMPLAINT TRENDS
          ================================================= */}

          <section className="xl:col-span-2 bg-white border border-[#DCE3EA] rounded-xl p-6">

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-xl font-bold text-[#0B1B2B]">
                  Complaint Trends
                </h2>

                <p className="text-xs text-gray-400 mt-2">
                  Complaints received during the
                  last 7 months
                </p>

              </div>

              <FaChartLine className="text-[#E8AA0C] text-xl" />

            </div>

            {/* BAR CHART */}

            <div className="mt-8">

              <div className="h-64 flex items-end justify-between gap-3 border-b border-[#E8ECF0] px-2">

                {monthlyData.map(
                  (item) => {

                    const height =
                      item.count === 0
                        ? 3
                        : Math.max(
                            (item.count /
                              maxMonthlyCount) *
                              210,
                            8
                          );

                    return (
                      <div
                        key={`${item.year}-${item.month}`}
                        className="flex-1 h-full flex flex-col justify-end items-center"
                      >

                        <span className="text-[10px] text-gray-400 mb-2">
                          {item.count}
                        </span>

                        <div
                          className="w-full max-w-[55px] bg-[#E8AA0C] rounded-t-lg transition-all duration-500"
                          style={{
                            height: `${height}px`,
                          }}
                        />

                      </div>
                    );
                  }
                )}

              </div>

              {/* MONTH LABELS */}

              <div className="flex justify-between gap-3 px-2 mt-3">

                {monthlyData.map(
                  (item) => (
                    <div
                      key={`${item.year}-${item.month}-label`}
                      className="flex-1 text-center text-[11px] font-semibold text-gray-400"
                    >
                      {item.label}
                    </div>
                  )
                )}

              </div>

            </div>

          </section>

          {/* =================================================
              STATUS DISTRIBUTION
          ================================================= */}

          <section className="bg-white border border-[#DCE3EA] rounded-xl p-6">

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-xl font-bold text-[#0B1B2B]">
                  Complaint Status
                </h2>

                <p className="text-xs text-gray-400 mt-2">
                  Current complaint distribution
                </p>

              </div>

              <FaChartPie className="text-[#E8AA0C] text-xl" />

            </div>

            {/* DONUT */}

            <div className="flex justify-center mt-7">

              <div
                className="w-44 h-44 rounded-full flex items-center justify-center"
                style={donutStyle}
              >

                <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center">

                  <span className="text-2xl font-bold text-[#0B1B2B]">
                    {resolutionRate}%
                  </span>

                  <span className="text-[10px] text-gray-400 mt-1">
                    Resolved
                  </span>

                </div>

              </div>

            </div>

            {/* LEGEND */}

            <div className="mt-7 space-y-3">

              <StatusRow
                label="Resolved"
                value={statusData.resolved}
                dotClass="bg-green-500"
              />

              <StatusRow
                label="Pending"
                value={statusData.pending}
                dotClass="bg-[#E8AA0C]"
              />

              <StatusRow
                label="In Progress"
                value={statusData.inProgress}
                dotClass="bg-blue-500"
              />

              <StatusRow
                label="Rejected"
                value={statusData.rejected}
                dotClass="bg-red-500"
              />

            </div>

          </section>

        </div>

        {/* ===================================================
            DEPARTMENT PERFORMANCE
        =================================================== */}

        <section className="bg-white border border-[#DCE3EA] rounded-xl p-6 mt-6">

          <div className="flex items-start justify-between">

            <div>

              <h2 className="text-xl font-bold text-[#0B1B2B]">
                Department Performance
              </h2>

              <p className="text-xs text-gray-400 mt-2">
                Complaint distribution across the
                7 municipal departments
              </p>

            </div>

            <FaBuilding className="text-[#E8AA0C] text-xl" />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">

            {departmentData.map(
              (department) => (
                <DepartmentPerformanceCard
                  key={department.name}
                  department={department}
                />
              )
            )}

          </div>

        </section>

        {/* ===================================================
            MUNICIPAL PERFORMANCE
        =================================================== */}

        <section className="bg-[#0B1B2B] text-white rounded-xl p-6 mt-6">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] text-[#0B1B2B] flex items-center justify-center">

                  <FaChartLine />

                </div>

                <h2 className="text-xl font-bold">
                  Municipal Performance
                </h2>

              </div>

              <p className="text-sm text-gray-400 mt-3 max-w-2xl leading-6">
                Analytics are calculated directly
                from complaints stored in the
                municipality database. The dashboard
                uses live complaint data and supports
                Road & Transport, Waste Management,
                Water Supply, Electrical Services,
                Drainage & Sewage, Public Health,
                and Parks & Public Spaces.
              </p>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <div className="bg-white/5 rounded-lg px-6 py-4 text-center">

                <p className="text-2xl font-bold text-[#E8AA0C]">
                  {loading
                    ? "—"
                    : `${resolutionRate}%`}
                </p>

                <p className="text-[10px] text-gray-500 uppercase mt-1">
                  Resolution Rate
                </p>

              </div>

              <div className="bg-white/5 rounded-lg px-6 py-4 text-center">

                <p className="text-2xl font-bold text-[#E8AA0C]">
                  {loading
                    ? "—"
                    : statistics.total}
                </p>

                <p className="text-[10px] text-gray-500 uppercase mt-1">
                  Total Records
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-[#071521] text-white py-8 mt-10">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between gap-4">

            <div>

              <h3 className="font-bold">
                Smart Municipality
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Municipal Analytics & Reporting System
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

/* ============================================================
   ADMIN NAVBAR
   Same style as AdminDepartments
   ============================================================ */

function AdminNavbar({
  navigate,
  handleLogout,
}) {
  return (
    <nav className="bg-[#0B1B2B] text-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="h-20 flex items-center justify-between">

          {/* LOGO */}

          <div
            onClick={() =>
              navigate("/admin/dashboard")
            }
            className="flex items-center gap-3 cursor-pointer"
          >

            <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] flex items-center justify-center">

              <FaBuilding className="text-[#0B1B2B]" />

            </div>

            <div>

              <h1 className="!text-lg !font-bold !leading-tight">
                Smart Municipality
              </h1>

              <p className="text-xs text-gray-400 mt-1">
                Administration Portal
              </p>

            </div>

          </div>

          {/* NAVIGATION */}

          <div className="hidden lg:flex items-center gap-2">

            <button
              onClick={() =>
                navigate("/admin/dashboard")
              }
              className="px-4 py-2.5 rounded-md text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Dashboard
            </button>

            <button
              onClick={() =>
                navigate("/admin/complaints")
              }
              className="px-4 py-2.5 rounded-md text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Complaints
            </button>

            <button
              onClick={() =>
                navigate("/admin/departments")
              }
              className="px-5 py-2.5 rounded-md text-sm font-bold text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Departments
            </button>

            <button
              className="px-5 py-2.5 rounded-md bg-[#E8AA0C] text-[#0B1B2B] text-sm font-bold"
            >
              Analytics
            </button>

          </div>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-5">

            {/* NOTIFICATIONS */}

            <button
              onClick={() =>
                navigate("/admin/notifications")
              }
              className="relative text-gray-300 hover:text-white"
            >

              <FaBell />

              <span className="absolute -top-2 -right-2 bg-[#E8AA0C] text-[#0B1B2B] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                5
              </span>

            </button>

            {/* PROFILE */}

            <button
              onClick={() =>
                navigate("/admin/profile")
              }
              className="text-gray-300 hover:text-white"
            >
              <FaUserShield />
            </button>

            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 flex items-center gap-2"
            >

              <span className="hidden sm:block text-sm">
                Logout
              </span>

              <FaSignOutAlt />

            </button>

          </div>

        </div>

      </div>

    </nav>
  );
}

/* ============================================================
   ANALYTICS STAT CARD
   ============================================================ */

function AnalyticsStat({
  title,
  value,
  subtitle,
  icon,
  className,
  change,
}) {
  const positive =
    change !== null &&
    change >= 0;

  return (
    <div className="bg-white border border-[#DCE3EA] rounded-xl p-5">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
            {title}
          </p>

          <p className="text-3xl font-bold text-[#0B1B2B] mt-2">
            {value}
          </p>

          <p className="text-[10px] text-gray-400 mt-1">
            {subtitle}
          </p>

        </div>

        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${className}`}
        >
          {icon}
        </div>

      </div>

      {change !== null && (
        <p
          className={`text-[10px] mt-4 font-medium ${
            positive
              ? "text-green-600"
              : "text-red-500"
          }`}
        >

          {positive ? "↑" : "↓"}{" "}
          {Math.abs(change)}%

          <span className="text-gray-400 ml-1">
            vs last month
          </span>

        </p>
      )}

    </div>
  );
}

/* ============================================================
   STATUS ROW
   ============================================================ */

function StatusRow({
  label,
  value,
  dotClass,
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-2">

        <span
          className={`w-2.5 h-2.5 rounded-full ${dotClass}`}
        />

        <span className="text-xs text-gray-500">
          {label}
        </span>

      </div>

      <span className="text-xs font-bold text-[#0B1B2B]">
        {value}
      </span>

    </div>
  );
}

/* ============================================================
   DEPARTMENT PERFORMANCE CARD
   ============================================================ */

function DepartmentPerformanceCard({
  department,
}) {
  return (
    <div className="border border-[#E5EAF0] rounded-lg p-4 hover:border-[#E8AA0C] transition">

      <div className="flex items-start justify-between gap-3">

        <div>

          <h3 className="text-sm font-bold text-[#0B1B2B]">
            {department.name}
          </h3>

          <p className="text-[10px] text-gray-400 mt-1">
            {department.complaints} complaints
          </p>

        </div>

        <span className="text-sm font-bold text-[#A97400]">
          {department.rate}%
        </span>

      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">

        <div
          className="h-full bg-[#E8AA0C] rounded-full transition-all"
          style={{
            width: `${department.rate}%`,
          }}
        />

      </div>

      <div className="flex justify-between mt-2">

        <span className="text-[10px] text-gray-400">
          Resolved
        </span>

        <span className="text-[10px] font-bold text-green-600">
          {department.resolved}
        </span>

      </div>

    </div>
  );
}

export default AdminAnalytics;