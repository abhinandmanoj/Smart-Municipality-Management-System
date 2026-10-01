import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaCheckCircle,
  FaClipboardList,
  FaArrowLeft,
  FaTrash,
} from "react-icons/fa";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Complaint Status Updated",
      message:
        "Your complaint CMP1024 has been moved to In Progress.",
      time: "10 minutes ago",
      type: "status",
      read: false,
    },
    {
      id: 2,
      title: "Complaint Assigned",
      message:
        "Your complaint CMP1024 has been assigned to Road & Transport.",
      time: "Yesterday",
      type: "assigned",
      read: false,
    },
    {
      id: 3,
      title: "Complaint Registered",
      message:
        "Your complaint CMP1024 was successfully registered.",
      time: "2 days ago",
      type: "success",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter(
        (notification) => notification.id !== id
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type) => {
    if (type === "success") {
      return <FaCheckCircle />;
    }

    if (type === "assigned") {
      return <FaClipboardList />;
    }

    return <FaBell />;
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
                onClick={() => navigate("/my-complaints")}
                className="text-gray-300 hover:text-white"
              >
                My Complaints
              </button>

              <button
                className="text-[#E8AA0C] font-semibold"
              >
                Notifications
              </button>

            </div>


            {/* PROFILE */}

            <button
              onClick={() => navigate("/profile")}
              className="text-gray-300 hover:text-white"
            >
              Profile
            </button>

          </div>

        </div>

      </nav>


      {/* ================= HEADER ================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-5xl mx-auto px-6 py-12">

          <button
            onClick={() => navigate("/services")}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6"
          >

            <FaArrowLeft />

            Back to Services

          </button>


          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-[#E8AA0C] text-[#0B1B2B] flex items-center justify-center text-xl">

              <FaBell />

            </div>

            <div>

              <p className="text-[#E8AA0C] text-sm font-semibold uppercase tracking-widest">
                Citizen Portal
              </p>

              <h1 className="text-3xl md:text-4xl font-bold mt-1">
                Notifications
              </h1>

            </div>

          </div>

          <p className="text-gray-400 mt-4">
            Stay updated about your complaints and municipal services.
          </p>

        </div>

      </section>


      {/* ================= CONTENT ================= */}

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* TOP BAR */}

        <div className="bg-white border border-[#DCE3EA] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>

            <h2 className="font-bold text-[#0B1B2B]">
              Your Notifications
            </h2>

            <p className="text-sm text-gray-500 mt-1">

              {unreadCount > 0
                ? `${unreadCount} unread notification${
                    unreadCount > 1 ? "s" : ""
                  }`
                : "All notifications are read"}

            </p>

          </div>


          <div className="flex gap-3">

            {unreadCount > 0 && (

              <button
                onClick={markAllAsRead}
                className="text-sm font-semibold text-[#A97400] hover:text-[#805C00]"
              >
                Mark all as read
              </button>

            )}

            {notifications.length > 0 && (

              <button
                onClick={clearAll}
                className="text-sm font-semibold text-red-500 hover:text-red-600"
              >
                Clear all
              </button>

            )}

          </div>

        </div>


        {/* ================= NOTIFICATION LIST ================= */}

        <div className="mt-5 space-y-3">

          {notifications.length === 0 ? (

            <div className="bg-white border border-[#DCE3EA] rounded-xl p-12 text-center">

              <div className="w-14 h-14 mx-auto rounded-full bg-[#F5F7FA] flex items-center justify-center">

                <FaBell className="text-gray-300 text-xl" />

              </div>

              <h3 className="font-bold text-[#0B1B2B] mt-5">
                No Notifications
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                You're all caught up.
              </p>

            </div>

          ) : (

            notifications.map((notification) => (

              <div
                key={notification.id}
                className={`bg-white border rounded-xl p-5 transition ${
                  notification.read
                    ? "border-[#DCE3EA]"
                    : "border-[#F3D98A] bg-[#FFFDF5]"
                }`}
              >

                <div className="flex gap-4">

                  {/* ICON */}

                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                      notification.read
                        ? "bg-[#F5F7FA] text-gray-500"
                        : "bg-[#10263B] text-[#E8AA0C]"
                    }`}
                  >

                    {getIcon(notification.type)}

                  </div>


                  {/* CONTENT */}

                  <div className="flex-1 min-w-0">

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">

                      <div>

                        <div className="flex items-center gap-2">

                          <h3 className="font-bold text-[#0B1B2B]">
                            {notification.title}
                          </h3>

                          {!notification.read && (

                            <span className="w-2 h-2 rounded-full bg-[#E8AA0C]" />

                          )}

                        </div>

                        <p className="text-sm text-gray-500 leading-6 mt-1">
                          {notification.message}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                          {notification.time}
                        </p>

                      </div>


                      {/* ACTIONS */}

                      <div className="flex items-center gap-4 shrink-0">

                        {!notification.read && (

                          <button
                            onClick={() =>
                              markAsRead(notification.id)
                            }
                            className="text-xs font-semibold text-[#A97400]"
                          >
                            Mark as read
                          </button>

                        )}

                        <button
                          onClick={() =>
                            deleteNotification(notification.id)
                          }
                          className="text-gray-400 hover:text-red-500"
                        >

                          <FaTrash />

                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>


        {/* ================= COMPLAINT BUTTON ================= */}

        <div className="mt-8 bg-[#10263B] rounded-xl p-7 text-white flex flex-col sm:flex-row items-center justify-between gap-5">

          <div>

            <h2 className="font-bold">
              Check your complaint status
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              View the latest updates on your submitted complaints.
            </p>

          </div>

          <button
            onClick={() => navigate("/my-complaints")}
            className="bg-[#E8AA0C] text-[#0B1B2B] px-6 py-3 rounded-lg font-bold hover:bg-[#f3bd25] whitespace-nowrap"
          >
            My Complaints
          </button>

        </div>

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
                Digital civic services for a better community.
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

export default Notifications;