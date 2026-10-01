import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaBuilding,
  FaBell,
  FaUser,
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTrash,
  FaCheckDouble,
  FaArrowRight,
  FaSyncAlt,
} from "react-icons/fa";

function Notifications() {
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

  const userEmail = user?.email || "";

  // =========================================================
  // STATES
  // =========================================================

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [readNotifications, setReadNotifications] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("readNotifications") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [deletedNotifications, setDeletedNotifications] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("deletedNotifications") || "[]"
      );
    } catch {
      return [];
    }
  });

  // =========================================================
  // FETCH USER COMPLAINTS
  // =========================================================

  useEffect(() => {
    fetchComplaints();
  }, [userEmail]);

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
        response.data?.data ||
        response.data ||
        [];

      console.log("Notifications complaints:", data);

      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Failed to fetch complaints:",
        error.response?.data || error.message
      );

      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // GET COMPLAINT ID
  // =========================================================

  const getComplaintId = (complaint) => {
    return (
      complaint?.complaintId ||
      complaint?._id ||
      complaint?.id ||
      complaint?.referenceId ||
      ""
    );
  };

  // =========================================================
  // GET DEPARTMENT
  // =========================================================

  const getDepartment = (complaint) => {
    return (
      complaint?.department ||
      complaint?.category ||
      "Municipal Department"
    );
  };

  // =========================================================
  // GET TITLE
  // =========================================================

  const getTitle = (complaint) => {
    return (
      complaint?.title ||
      complaint?.complaintTitle ||
      complaint?.subject ||
      "Civic Complaint"
    );
  };

  // =========================================================
  // GET DATE
  // =========================================================

  const getDate = (complaint) => {
    return (
      complaint?.updatedAt ||
      complaint?.updated_at ||
      complaint?.createdAt ||
      complaint?.created_at ||
      complaint?.date ||
      complaint?.submittedAt ||
      null
    );
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    try {
      const parsed = new Date(date);

      if (Number.isNaN(parsed.getTime())) {
        return "Date unavailable";
      }

      return parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Date unavailable";
    }
  };

  // =========================================================
  // TIME AGO
  // =========================================================

  const timeAgo = (date) => {
    if (!date) {
      return "Recently";
    }

    const now = new Date();
    const past = new Date(date);

    if (Number.isNaN(past.getTime())) {
      return "Recently";
    }

    const seconds = Math.floor(
      (now.getTime() - past.getTime()) / 1000
    );

    if (seconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} minute${
        minutes !== 1 ? "s" : ""
      } ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${
        hours !== 1 ? "s" : ""
      } ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days} day${
        days !== 1 ? "s" : ""
      } ago`;
    }

    return formatDate(date);
  };

  // =========================================================
  // CREATE NOTIFICATIONS
  // =========================================================

  const notifications = useMemo(() => {
    const result = [];

    complaints.forEach((complaint) => {
      const complaintId = getComplaintId(complaint);

      if (!complaintId) {
        return;
      }

      const department = getDepartment(complaint);
      const title = getTitle(complaint);

      const createdDate =
        complaint?.createdAt ||
        complaint?.created_at ||
        complaint?.date ||
        complaint?.submittedAt;

      const updatedDate =
        complaint?.updatedAt ||
        complaint?.updated_at ||
        createdDate;

      const status = complaint?.status || "Pending";

      const priority = complaint?.priority || "Medium";

      const normalizedStatus = String(status).toLowerCase();

      // =====================================================
      // 1. COMPLAINT REGISTERED
      // =====================================================

      result.push({
        id: `${complaintId}-registered`,
        complaintId,
        type: "success",
        title: "Complaint registered successfully",
        message: `Your complaint ${complaintId} has been registered successfully.`,
        time: timeAgo(createdDate),
        date: createdDate,
      });

      // =====================================================
      // 2. DEPARTMENT ASSIGNED
      // =====================================================

      if (
        complaint?.department ||
        complaint?.category
      ) {
        result.push({
          id: `${complaintId}-department`,
          complaintId,
          type: "info",
          title: "Complaint assigned to department",
          message: `${complaintId} has been assigned to the ${department} for further action.`,
          time: timeAgo(updatedDate),
          date: updatedDate,
        });
      }

      // =====================================================
      // 3. HIGH PRIORITY
      // =====================================================

      if (
        String(priority).toLowerCase() === "high"
      ) {
        result.push({
          id: `${complaintId}-priority`,
          complaintId,
          type: "warning",
          title: "High priority complaint",
          message: `${complaintId} has been marked as High Priority and may require faster attention.`,
          time: timeAgo(updatedDate),
          date: updatedDate,
        });
      }

      // =====================================================
      // 4. STATUS UPDATE
      // =====================================================

      if (normalizedStatus !== "pending") {
        let notificationType = "info";

        if (
          normalizedStatus === "resolved" ||
          normalizedStatus === "completed" ||
          normalizedStatus === "closed"
        ) {
          notificationType = "success";
        }

        if (
          normalizedStatus === "rejected" ||
          normalizedStatus === "declined" ||
          normalizedStatus === "cancelled"
        ) {
          notificationType = "warning";
        }

        result.push({
          id: `${complaintId}-status-${normalizedStatus}`,
          complaintId,
          type: notificationType,
          title: "Complaint status updated",
          message: `The status of ${complaintId} has been updated to ${status}.`,
          time: timeAgo(updatedDate),
          date: updatedDate,
        });
      }
    });

    // =====================================================
    // SORT NEWEST FIRST
    // =====================================================

    result.sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();

      return dateB - dateA;
    });

    return result;
  }, [complaints]);

  // =========================================================
  // VISIBLE NOTIFICATIONS
  // =========================================================

  const visibleNotifications = notifications.filter(
    (notification) =>
      !deletedNotifications.includes(notification.id)
  );

  // =========================================================
  // UNREAD COUNT
  // =========================================================

  const unreadCount = visibleNotifications.filter(
    (notification) =>
      !readNotifications.includes(notification.id)
  ).length;

  // =========================================================
  // MARK ONE AS READ
  // =========================================================

  const markRead = (id) => {
    if (!id) {
      return;
    }

    if (readNotifications.includes(id)) {
      return;
    }

    const updated = [
      ...readNotifications,
      id,
    ];

    setReadNotifications(updated);

    localStorage.setItem(
      "readNotifications",
      JSON.stringify(updated)
    );
  };

  // =========================================================
  // MARK ALL AS READ
  // =========================================================

  const markAllRead = () => {
    const allIds = visibleNotifications.map(
      (notification) => notification.id
    );

    setReadNotifications(allIds);

    localStorage.setItem(
      "readNotifications",
      JSON.stringify(allIds)
    );
  };

  // =========================================================
  // DELETE NOTIFICATION
  // =========================================================

  const deleteNotification = (id) => {
    if (!id) {
      return;
    }

    const updated = deletedNotifications.includes(id)
      ? deletedNotifications
      : [
          ...deletedNotifications,
          id,
        ];

    setDeletedNotifications(updated);

    localStorage.setItem(
      "deletedNotifications",
      JSON.stringify(updated)
    );
  };

  // =========================================================
  // VIEW COMPLAINT
  // =========================================================

  const handleViewComplaint = (complaintId) => {
    if (!complaintId) {
      return;
    }

    navigate(
      `/complaint-details?id=${encodeURIComponent(
        complaintId
      )}`
    );
  };

  // =========================================================
  // ICON
  // =========================================================

  const getIcon = (type) => {
    if (type === "success") {
      return <FaCheckCircle />;
    }

    if (type === "warning") {
      return <FaExclamationTriangle />;
    }

    return <FaInfoCircle />;
  };

  // =========================================================
  // ICON STYLE
  // =========================================================

  const getIconStyle = (type) => {
    if (type === "success") {
      return "bg-green-50 text-green-600";
    }

    if (type === "warning") {
      return "bg-yellow-50 text-yellow-600";
    }

    return "bg-blue-50 text-blue-600";
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0B1B2B]">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

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
                type="button"
                onClick={() =>
                  navigate("/dashboard")
                }
                className="px-5 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Home
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/register-complaint")
                }
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Register Complaint
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/my-complaints")
                }
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                My Complaints
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/departments")
                }
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Departments
              </button>

              <button
                type="button"
                className="px-4 py-2.5 rounded-md bg-[#E8AA0C] text-[#0B1B2B] text-[14px] font-bold"
              >
                Notifications
              </button>

            </div>

            {/* RIGHT SIDE */}

            <div className="flex items-center gap-3 shrink-0">

              {/* BELL */}

              <button
                type="button"
                onClick={() =>
                  navigate("/notifications")
                }
                className="relative w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white"
                title="Notifications"
              >

                <FaBell className="text-[15px]" />

                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 min-w-[16px] h-[16px] px-1 rounded-full bg-[#E8AA0C] text-[#0B1B2B] text-[9px] font-bold flex items-center justify-center">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}

              </button>

              {/* PROFILE */}

              <button
                type="button"
                onClick={() =>
                  navigate("/profile")
                }
                className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/15 transition"
                title="Profile"
              >

                <FaUser className="text-[#E8AA0C] text-[13px]" />

              </button>

              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="text-gray-300 hover:text-white text-[14px] ml-1"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </nav>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="py-10">

            <div className="text-[#E8AA0C] text-[12px] font-bold uppercase tracking-[0.18em]">
              Citizen Portal
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

              <div>

                <h1 className="text-[38px] md:text-[42px] font-bold leading-tight mt-3">
                  Notifications
                </h1>

                <p className="text-gray-400 text-[14px] mt-3">
                  Stay updated about your complaints and municipal services.
                </p>

              </div>

              {/* UNREAD */}

              <div className="border border-white/60 rounded-lg px-7 py-4 min-w-[190px] text-center">

                <span className="text-[#E8AA0C] text-[16px] font-bold">
                  {unreadCount}
                </span>

                <span className="text-white text-[12px] font-medium ml-1">
                  unread notifications
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-[1280px] mx-auto px-6 py-7">

        {/* TITLE */}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">

          <div>

            <div className="text-[#A97400] text-[12px] font-bold uppercase tracking-[0.16em]">
              Updates
            </div>

            <h2 className="text-[30px] font-semibold mt-2">
              Recent Notifications
            </h2>

          </div>

          {visibleNotifications.length > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="flex items-center gap-2 text-[14px] font-bold text-[#A97400] hover:text-[#0B1B2B]"
            >

              <FaCheckDouble />

              Mark all as read

            </button>
          )}

        </div>

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (

          <div className="bg-white border border-[#DCE3EA] rounded-xl p-14 text-center">

            <div className="w-10 h-10 border-4 border-[#E8AA0C]/20 border-t-[#E8AA0C] rounded-full animate-spin mx-auto" />

            <p className="text-sm text-gray-500 mt-4">
              Loading your notifications...
            </p>

          </div>

        )}

        {/* =====================================================
            NO NOTIFICATIONS
        ===================================================== */}

        {!loading &&
          visibleNotifications.length === 0 && (

            <div className="bg-white border border-[#DCE3EA] rounded-xl p-14 text-center">

              <div className="w-14 h-14 rounded-xl bg-[#FFF8E6] text-[#A97400] flex items-center justify-center mx-auto">

                <FaBell className="text-xl" />

              </div>

              <h3 className="text-xl font-bold mt-5">
                No notifications
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                You don't have any complaint updates yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/register-complaint")
                }
                className="mt-6 px-5 py-3 bg-[#0B1B2B] text-white rounded-lg text-sm font-bold"
              >
                Register a Complaint
              </button>

            </div>

          )}

        {/* =====================================================
            NOTIFICATION LIST
        ===================================================== */}

        {!loading &&
          visibleNotifications.length > 0 && (

            <div className="space-y-3">

              {visibleNotifications.map(
                (notification) => {

                  const isUnread =
                    !readNotifications.includes(
                      notification.id
                    );

                  return (

                    <div
                      key={notification.id}
                      onClick={() =>
                        markRead(notification.id)
                      }
                      className={`bg-white border border-[#DCE3EA] rounded-xl px-6 py-6 cursor-pointer transition hover:shadow-sm ${
                        isUnread
                          ? "border-l-4 border-l-[#E8AA0C]"
                          : ""
                      }`}
                    >

                      <div className="flex items-start gap-5">

                        {/* ICON */}

                        <div
                          className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconStyle(
                            notification.type
                          )}`}
                        >

                          {getIcon(
                            notification.type
                          )}

                        </div>

                        {/* CONTENT */}

                        <div className="flex-1 min-w-0">

                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">

                            <div className="flex items-center gap-2">

                              <h3
                                className={`text-[18px] md:text-[20px] ${
                                  isUnread
                                    ? "font-semibold"
                                    : "font-medium"
                                } text-[#0B1B2B]`}
                              >
                                {notification.title}
                              </h3>

                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-[#E8AA0C] shrink-0" />
                              )}

                            </div>

                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                              {notification.time}
                            </span>

                          </div>

                          <p className="text-[12px] text-gray-500 leading-5 mt-3">
                            {notification.message}
                          </p>

                          {/* VIEW COMPLAINT */}

                          <button
                            type="button"
                            onClick={(event) => {

                              event.stopPropagation();

                              markRead(
                                notification.id
                              );

                              handleViewComplaint(
                                notification.complaintId
                              );

                            }}
                            className="flex items-center gap-2 text-[13px] font-bold text-[#A97400] mt-5 hover:text-[#0B1B2B]"
                          >

                            View Complaint

                            <FaArrowRight className="text-[9px]" />

                          </button>

                        </div>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={(event) => {

                            event.stopPropagation();

                            deleteNotification(
                              notification.id
                            );

                          }}
                          className="text-gray-300 hover:text-red-500 p-1 flex-shrink-0"
                          title="Delete notification"
                        >

                          <FaTrash className="text-xs" />

                        </button>

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

        {/* =====================================================
            REFRESH
        ===================================================== */}

        {!loading && complaints.length > 0 && (

          <div className="flex justify-center mt-8">

            <button
              type="button"
              onClick={fetchComplaints}
              className="flex items-center gap-2 px-5 py-2.5 border border-[#DCE3EA] bg-white rounded-lg text-[12px] font-bold text-[#0B1B2B] hover:bg-[#F5F7FA] transition"
            >

              <FaSyncAlt className="text-[#A97400]" />

              Refresh Notifications

            </button>

          </div>

        )}

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-[#071521] text-white mt-10">

        <div className="max-w-[1280px] mx-auto px-6 py-6">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

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

export default Notifications;