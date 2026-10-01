import {
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";

function RecentNotifications() {

  const notifications = [
    {
      title: "Complaint Approved",
      message: "Your garbage complaint has been approved.",
      icon: <FaCheckCircle className="text-green-500 text-2xl" />,
      time: "5 min ago",
    },
    {
      title: "New Complaint",
      message: "Road damage complaint submitted successfully.",
      icon: <FaBell className="text-blue-500 text-2xl" />,
      time: "20 min ago",
    },
    {
      title: "High Priority",
      message: "Water leakage marked as High Priority.",
      icon: <FaExclamationTriangle className="text-red-500 text-2xl" />,
      time: "1 hour ago",
    },
    {
      title: "Complaint Resolved",
      message: "Street light issue has been resolved.",
      icon: <FaClock className="text-orange-500 text-2xl" />,
      time: "Yesterday",
    },
  ];

  return (
    <section className="mt-8">

      <div className="bg-[#111827] rounded-3xl border border-gray-800 shadow-xl">

        <div className="flex justify-between items-center p-6 border-b border-gray-800">

          <div>

            <h2 className="text-2xl font-bold text-white">
              Recent Notifications
            </h2>

            <p className="text-gray-400 mt-1">
              Latest municipality updates
            </p>

          </div>

        </div>

        <div className="divide-y divide-gray-800">

          {notifications.map((item, index) => (

            <div
              key={index}
              className="flex justify-between items-center p-6 hover:bg-[#1E293B] transition"
            >

              <div className="flex gap-4">

                {item.icon}

                <div>

                  <h3 className="text-white font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-gray-400 mt-1">
                    {item.message}
                  </p>

                </div>

              </div>

              <span className="text-sm text-gray-500">
                {item.time}
              </span>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default RecentNotifications;