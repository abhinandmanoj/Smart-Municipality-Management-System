import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaUserShield,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClipboardList,
  FaUserPlus,
  FaRobot,
  FaTrash,
  FaCheck,
  FaCircle,
} from "react-icons/fa";

function AdminNotifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "High Priority Complaint",
      message:
        "A high-priority road damage complaint has been submitted in Ward 5.",
      time: "10 minutes ago",
      type: "complaint",
      read: false,
    },
    {
      id: 2,
      title: "Complaint Resolved",
      message:
        "Complaint CMP1021 regarding a broken street light has been resolved.",
      time: "35 minutes ago",
      type: "success",
      read: false,
    },
    {
      id: 3,
      title: "New Citizen Registered",
      message:
        "A new citizen account has been successfully registered.",
      time: "1 hour ago",
      type: "user",
      read: false,
    },
    {
      id: 4,
      title: "AI Classification Completed",
      message:
        "AI has classified 12 new complaints and assigned them to departments.",
      time: "2 hours ago",
      type: "ai",
      read: true,
    },
    {
      id: 5,
      title: "Department Update",
      message:
        "Waste Management department has updated the status of 8 complaints.",
      time: "4 hours ago",
      type: "complaint",
      read: true,
    },
    {
      id: 6,
      title: "Complaint Pending",
      message:
        "Complaint CMP1018 has remained pending for more than 48 hours.",
      time: "Yesterday",
      type: "warning",
      read: true,
    },
  ]);

  const [filter, setFilter] = useState("All");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((current) =>
      current.filter(
        (notification) => notification.id !== id
      )
    );
  };

  const clearAll = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all notifications?"
    );

    if (!confirmClear) return;

    setNotifications([]);
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const filteredNotifications =
    filter === "All"
      ? notifications
      : filter === "Unread"
      ? notifications.filter(
          (notification) => !notification.read
        )
      : notifications.filter(
          (notification) => notification.type === filter
        );

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <nav className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="h-[68px] flex items-center justify-between">

            {/* LOGO */}

            <div
              onClick={() =>
                navigate("/admin/dashboard")
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
                  Administration Portal
                </div>

              </div>

            </div>


            {/* NAVIGATION */}

            <div className="hidden lg:flex items-center gap-1 ml-auto mr-6">

              <button
                onClick={() =>
                  navigate("/admin/dashboard")
                }
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Dashboard
              </button>

              <button
                onClick={() =>
                  navigate("/admin/complaints")
                }
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Complaints
              </button>

              <button
                onClick={() =>
                  navigate("/admin/users")
                }
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Users
              </button>

              <button
                onClick={() =>
                  navigate("/admin/departments")
                }
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Departments
              </button>

              <button
                onClick={() =>
                  navigate("/admin/analytics")
                }
                className="px-4 py-2.5 rounded-md bg-[#E8AA0C] text-[#0B1B2B] text-[14px] font-bold"
              >
                Analytics
              </button>

            </div>


            {/* RIGHT */}

            <div className="flex items-center gap-3 shrink-0">

              <button
                onClick={() => navigate("/admin/notifications")}
                className="relative w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white"
              >

                <FaBell className="text-[15px]" />

                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-[16px] h-[16px] rounded-full bg-[#E8AA0C] text-[#0B1B2B] text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}

              </button>

              <button
                onClick={() =>
                  navigate("/admin/profile")
                }
                className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/15 transition"
              >
                <FaUserShield className="text-[#E8AA0C] text-[14px]" />
              </button>

              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white text-[14px] ml-1 flex items-center gap-2"
              >
                Logout
                <FaSignOutAlt className="text-xs" />
              </button>

            </div>

          </div>

        </div>

      </nav>


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6 py-9">

          <div className="text-[#E8AA0C] text-[12px] font-bold uppercase tracking-[0.18em]">
            Administration Portal
          </div>

          <h1 className="text-[36px] md:text-[42px] font-bold leading-tight mt-3">
            Notifications
          </h1>

          <p className="text-gray-400 text-[14px] mt-3">
            Stay updated with important municipal activities.
          </p>

        </div>

      </section>


      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="max-w-[1280px] mx-auto px-6 py-7">


        {/* ================================================= */}
        {/* SUMMARY */}
        {/* ================================================= */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <NotificationStat
            title="Total"
            value={notifications.length}
            icon={<FaBell />}
            className="bg-purple-50 text-purple-600"
          />

          <NotificationStat
            title="Unread"
            value={unreadCount}
            icon={<FaCircle />}
            className="bg-yellow-50 text-yellow-600"
          />

          <NotificationStat
            title="Complaints"
            value={
              notifications.filter(
                (item) => item.type === "complaint"
              ).length
            }
            icon={<FaClipboardList />}
            className="bg-blue-50 text-blue-600"
          />

          <NotificationStat
            title="AI Alerts"
            value={
              notifications.filter(
                (item) => item.type === "ai"
              ).length
            }
            icon={<FaRobot />}
            className="bg-green-50 text-green-600"
          />

        </div>


        {/* ================================================= */}
        {/* CONTROLS */}
        {/* ================================================= */}

        <section className="bg-white border border-[#DCE3EA] rounded-xl mt-6 p-5">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* FILTER */}

            <div className="flex flex-wrap gap-2">

              <FilterButton
                active={filter === "All"}
                onClick={() => setFilter("All")}
              >
                All
              </FilterButton>

              <FilterButton
                active={filter === "Unread"}
                onClick={() => setFilter("Unread")}
              >
                Unread
              </FilterButton>

              <FilterButton
                active={filter === "complaint"}
                onClick={() => setFilter("complaint")}
              >
                Complaints
              </FilterButton>

              <FilterButton
                active={filter === "success"}
                onClick={() => setFilter("success")}
              >
                Updates
              </FilterButton>

              <FilterButton
                active={filter === "ai"}
                onClick={() => setFilter("ai")}
              >
                AI
              </FilterButton>

            </div>


            {/* ACTIONS */}

            <div className="flex gap-2">

              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 border border-[#DCE3EA] px-4 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-[#F8FAFC]"
              >

                <FaCheck />

                Mark all read

              </button>

              <button
                onClick={clearAll}
                className="flex items-center gap-2 border border-[#DCE3EA] px-4 py-2 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50"
              >

                <FaTrash />

                Clear all

              </button>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* NOTIFICATION LIST */}
        {/* ================================================= */}

        <section className="bg-white border border-[#DCE3EA] rounded-xl mt-6 overflow-hidden">

          <div className="p-6 border-b border-[#E8ECF0]">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-[#0B1B2B]">
                  Recent Notifications
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  {filteredNotifications.length} notifications
                </p>

              </div>

              <FaBell className="text-[#E8AA0C] text-xl" />

            </div>

          </div>


          {filteredNotifications.length > 0 ? (

            <div className="divide-y divide-[#E8ECF0]">

              {filteredNotifications.map(
                (notification) => (

                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={markAsRead}
                    onDelete={deleteNotification}
                  />

                )
              )}

            </div>

          ) : (

            <div className="py-16 text-center">

              <FaBell className="mx-auto text-4xl text-gray-300" />

              <h3 className="font-bold text-[#0B1B2B] mt-4">
                No notifications
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                You're all caught up.
              </p>

            </div>

          )}

        </section>


        {/* ================================================= */}
        {/* NOTIFICATION INFO */}
        {/* ================================================= */}

        <section className="bg-[#0B1B2B] text-white rounded-xl p-6 mt-6">

          <div className="flex gap-4">

            <div className="w-11 h-11 rounded-lg bg-[#E8AA0C] text-[#0B1B2B] flex items-center justify-center flex-shrink-0">
              <FaRobot />
            </div>

            <div>

              <h3 className="font-bold">
                Smart Notifications
              </h3>

              <p className="text-sm text-gray-400 mt-2 leading-6">
                The Smart Municipality system can generate
                automatic alerts when high-priority complaints
                are received, complaints remain unresolved for
                too long, or AI detects important patterns.
              </p>

            </div>

          </div>

        </section>

      </main>


      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer className="bg-[#071521] text-white py-8 mt-10">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between gap-4">

            <div>

              <h3 className="font-bold">
                Smart Municipality
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Notification & Alert System
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


/* ================================================= */
/* STAT CARD */
/* ================================================= */

function NotificationStat({
  title,
  value,
  icon,
  className,
}) {
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

        </div>

        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${className}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}


/* ================================================= */
/* FILTER BUTTON */
/* ================================================= */

function FilterButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
        active
          ? "bg-[#0B1B2B] text-white"
          : "bg-[#F8FAFC] text-gray-500 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}


/* ================================================= */
/* NOTIFICATION ITEM */
/* ================================================= */

function NotificationItem({
  notification,
  onRead,
  onDelete,
}) {
  const getIcon = () => {

    if (notification.type === "complaint") {
      return (
        <div className="w-11 h-11 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
          <FaExclamationTriangle />
        </div>
      );
    }

    if (notification.type === "success") {
      return (
        <div className="w-11 h-11 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
          <FaCheckCircle />
        </div>
      );
    }

    if (notification.type === "user") {
      return (
        <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
          <FaUserPlus />
        </div>
      );
    }

    if (notification.type === "ai") {
      return (
        <div className="w-11 h-11 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
          <FaRobot />
        </div>
      );
    }

    return (
      <div className="w-11 h-11 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
        <FaClockIcon />
      </div>
    );
  };

  return (
    <div
      className={`p-5 transition ${
        notification.read
          ? "bg-white"
          : "bg-[#FFFDF5]"
      } hover:bg-[#FAFBFC]`}
    >

      <div className="flex items-start gap-4">

        {/* ICON */}

        {getIcon()}


        {/* CONTENT */}

        <div className="flex-1 min-w-0">

          <div className="flex items-start justify-between gap-4">

            <div>

              <div className="flex items-center gap-2">

                {!notification.read && (
                  <span className="w-2 h-2 rounded-full bg-[#E8AA0C]" />
                )}

                <h3
                  className={`text-sm ${
                    notification.read
                      ? "font-semibold text-gray-700"
                      : "font-bold text-[#0B1B2B]"
                  }`}
                >
                  {notification.title}
                </h3>

              </div>

              <p className="text-xs text-gray-500 mt-2 leading-5">
                {notification.message}
              </p>

              <p className="text-[10px] text-gray-400 mt-2">
                {notification.time}
              </p>

            </div>


            {/* DELETE */}

            <button
              onClick={() =>
                onDelete(notification.id)
              }
              className="text-gray-300 hover:text-red-500 flex-shrink-0"
              title="Delete notification"
            >
              <FaTrash />
            </button>

          </div>


          {/* READ BUTTON */}

          {!notification.read && (

            <button
              onClick={() =>
                onRead(notification.id)
              }
              className="flex items-center gap-2 text-[10px] font-bold text-[#A97400] mt-3 hover:underline"
            >

              <FaCheck />

              Mark as read

            </button>

          )}

        </div>

      </div>

    </div>
  );
}


/* ================================================= */
/* SMALL CLOCK ICON */
/* ================================================= */

function FaClockIcon() {
  return (
    <FaClock className="text-yellow-600" />
  );
}


export default AdminNotifications;