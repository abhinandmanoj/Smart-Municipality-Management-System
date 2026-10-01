import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClipboardList,
  FaRobot,
  FaClock,
  FaTrash,
  FaCheckDouble,
} from "react-icons/fa";

function OfficerNotifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "priority",
      title: "High Priority Complaint",
      message:
        "Complaint CMP1024 has been marked as High Priority by the AI system.",
      time: "20 minutes ago",
      unread: true,
    },
    {
      id: 2,
      type: "complaint",
      title: "New Complaint Assigned",
      message:
        "A new road damage complaint has been assigned to your department.",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      type: "task",
      title: "Task Due Soon",
      message:
        "Task TSK-1021 is due today. Please complete the inspection.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 4,
      type: "ai",
      title: "AI Classification Completed",
      message:
        "The AI system has classified CMP1019 as a Water Supply complaint.",
      time: "4 hours ago",
      unread: false,
    },
    {
      id: 5,
      type: "success",
      title: "Complaint Resolved",
      message:
        "Complaint CMP1018 has been successfully marked as resolved.",
      time: "Yesterday",
      unread: false,
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
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
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

  const filteredNotifications =
    filter === "Unread"
      ? notifications.filter(
          (notification) => notification.unread
        )
      : notifications;

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <nav className="bg-[#0B1B2B] text-white">

        <div className="max-w-7xl mx-auto px-6">

          <div className="h-20 flex items-center justify-between">

            {/* LOGO */}

            <div
              onClick={() =>
                navigate("/officer/dashboard")
              }
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
                  Officer Portal
                </p>

              </div>

            </div>


            {/* NAVIGATION */}

            <div className="hidden lg:flex items-center gap-7">

              <button
                onClick={() =>
                  navigate("/officer/dashboard")
                }
                className="text-gray-300 hover:text-white"
              >
                Dashboard
              </button>

              <button
                onClick={() =>
                  navigate("/officer/complaints")
                }
                className="text-gray-300 hover:text-white"
              >
                Complaints
              </button>

              <button
                onClick={() =>
                  navigate("/officer/tasks")
                }
                className="text-gray-300 hover:text-white"
              >
                Tasks
              </button>

              <button
                className="text-white font-semibold"
              >
                Notifications
              </button>

            </div>


            {/* RIGHT */}

            <div className="flex items-center gap-5">

              <button
                className="relative text-white"
              >

                <FaBell />

                {unreadCount > 0 && (

                  <span className="absolute -top-2 -right-2 bg-[#E8AA0C] text-[#0B1B2B] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">

                    {unreadCount}

                  </span>

                )}

              </button>


              <button
                onClick={() =>
                  navigate("/officer/profile")
                }
                className="text-gray-300 hover:text-white"
              >

                <FaUser />

              </button>


              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400"
              >

                <FaSignOutAlt />

              </button>

            </div>

          </div>

        </div>

      </nav>


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <p className="text-[#E8AA0C] text-sm font-semibold uppercase tracking-widest">
            Officer Portal
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

            <div>

              <h1 className="text-3xl md:text-4xl font-bold mt-2">
                Notifications
              </h1>

              <p className="text-gray-400 mt-2">
                Stay updated with complaints, tasks and AI alerts.
              </p>

            </div>


            <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4">

              <p className="text-xs text-gray-500">
                UNREAD NOTIFICATIONS
              </p>

              <p className="text-2xl font-bold text-[#E8AA0C] mt-1">
                {unreadCount}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="max-w-5xl mx-auto px-6 py-10">


        {/* ================================================= */}
        {/* CONTROLS */}
        {/* ================================================= */}

        <div className="bg-white border border-[#DCE3EA] rounded-xl p-5">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex items-center gap-2">

              <button
                onClick={() => setFilter("All")}
                className={`px-4 py-2 rounded-lg text-xs font-bold ${
                  filter === "All"
                    ? "bg-[#0B1B2B] text-white"
                    : "bg-[#F3F5F7] text-gray-500"
                }`}
              >
                All
              </button>

              <button
                onClick={() => setFilter("Unread")}
                className={`px-4 py-2 rounded-lg text-xs font-bold ${
                  filter === "Unread"
                    ? "bg-[#0B1B2B] text-white"
                    : "bg-[#F3F5F7] text-gray-500"
                }`}
              >
                Unread
              </button>

            </div>


            <button
              onClick={markAllAsRead}
              className="flex items-center justify-center gap-2 text-xs font-bold text-[#A97400] hover:text-[#0B1B2B]"
            >

              <FaCheckDouble />

              Mark all as read

            </button>

          </div>

        </div>


        {/* ================================================= */}
        {/* NOTIFICATION LIST */}
        {/* ================================================= */}

        <div className="bg-white border border-[#DCE3EA] rounded-xl mt-6 overflow-hidden">

          <div className="p-6 border-b border-[#E8ECF0]">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-[#0B1B2B]">
                  Recent Notifications
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Important updates from the municipality system.
                </p>

              </div>

              <FaBell className="text-[#E8AA0C] text-xl" />

            </div>

          </div>


          {filteredNotifications.length > 0 ? (

            <div className="divide-y divide-[#E8ECF0]">

              {filteredNotifications.map(
                (notification) => (

                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onRead={markAsRead}
                    onDelete={deleteNotification}
                    onOpen={() => {

                      if (
                        notification.type ===
                          "complaint" ||
                        notification.type ===
                          "priority"
                      ) {
                        navigate(
                          "/officer/complaints"
                        );
                      }

                      if (
                        notification.type === "task"
                      ) {
                        navigate(
                          "/officer/tasks"
                        );
                      }

                    }}
                  />

                )
              )}

            </div>

          ) : (

            <div className="py-16 text-center">

              <FaBell className="mx-auto text-4xl text-gray-300" />

              <h3 className="font-bold text-[#0B1B2B] mt-4">
                No unread notifications
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                You're all caught up.
              </p>

            </div>

          )}

        </div>


        {/* ================================================= */}
        {/* NOTIFICATION INFO */}
        {/* ================================================= */}

        <div className="bg-[#FFFDF5] border border-[#F1DF9F] rounded-xl mt-6 p-5">

          <div className="flex gap-4">

            <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] text-[#0B1B2B] flex items-center justify-center flex-shrink-0">

              <FaRobot />

            </div>

            <div>

              <h3 className="font-bold text-[#0B1B2B]">
                AI-Powered Alerts
              </h3>

              <p className="text-sm text-gray-500 leading-6 mt-1">
                You'll receive notifications when AI identifies
                high-priority complaints, assigns departments,
                detects duplicate complaints or identifies
                important patterns.
              </p>

            </div>

          </div>

        </div>

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
                Officer Notification Center
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
/* NOTIFICATION CARD */
/* ================================================= */

function NotificationCard({
  notification,
  onRead,
  onDelete,
  onOpen,
}) {

  const typeDetails = {

    priority: {
      icon: <FaExclamationTriangle />,
      iconClass: "bg-red-50 text-red-600",
    },

    complaint: {
      icon: <FaClipboardList />,
      iconClass: "bg-blue-50 text-blue-600",
    },

    task: {
      icon: <FaClock />,
      iconClass: "bg-yellow-50 text-yellow-600",
    },

    ai: {
      icon: <FaRobot />,
      iconClass: "bg-purple-50 text-purple-600",
    },

    success: {
      icon: <FaCheckCircle />,
      iconClass: "bg-green-50 text-green-600",
    },

  };

  const details =
    typeDetails[notification.type] ||
    typeDetails.complaint;

  return (

    <div
      className={`p-6 transition ${
        notification.unread
          ? "bg-[#FFFEF8]"
          : "bg-white"
      }`}
    >

      <div className="flex gap-4">

        {/* ICON */}

        <div
          className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${details.iconClass}`}
        >
          {details.icon}
        </div>


        {/* CONTENT */}

        <div className="flex-1 min-w-0">

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">

            <div>

              <div className="flex items-center gap-2">

                <h3 className="font-bold text-[#0B1B2B]">
                  {notification.title}
                </h3>

                {notification.unread && (

                  <span className="w-2 h-2 rounded-full bg-[#E8AA0C]" />

                )}

              </div>

              <p className="text-sm text-gray-500 leading-6 mt-2">
                {notification.message}
              </p>

            </div>


            {/* TIME */}

            <span className="text-[10px] text-gray-400 whitespace-nowrap">
              {notification.time}
            </span>

          </div>


          {/* ACTIONS */}

          <div className="flex flex-wrap items-center gap-4 mt-4">

            {notification.unread && (

              <button
                onClick={() =>
                  onRead(notification.id)
                }
                className="text-xs font-bold text-[#A97400] hover:text-[#0B1B2B]"
              >
                Mark as read
              </button>

            )}


            {(notification.type ===
              "complaint" ||
              notification.type ===
                "priority" ||
              notification.type === "task") && (

              <button
                onClick={onOpen}
                className="text-xs font-bold text-[#0B1B2B] hover:text-[#A97400]"
              >
                View details →
              </button>

            )}


            <button
              onClick={() =>
                onDelete(notification.id)
              }
              className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
            >

              <FaTrash className="text-[10px]" />

              Delete

            </button>

          </div>

        </div>

      </div>

    </div>

  );
}


export default OfficerNotifications;