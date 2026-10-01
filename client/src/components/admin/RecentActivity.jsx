import {
  FaClipboardCheck,
  FaUserPlus,
  FaRobot,
  FaBuilding,
} from "react-icons/fa";

function RecentActivity() {

  const activities = [
    {
      icon: <FaClipboardCheck />,
      title: "Complaint CMP001 resolved",
      time: "10 mins ago",
      color: "bg-green-500",
    },
    {
      icon: <FaUserPlus />,
      title: "New citizen registered",
      time: "20 mins ago",
      color: "bg-blue-500",
    },
    {
      icon: <FaRobot />,
      title: "AI detected High Priority",
      time: "35 mins ago",
      color: "bg-orange-500",
    },
    {
      icon: <FaBuilding />,
      title: "Road Department updated",
      time: "1 hour ago",
      color: "bg-purple-500",
    },
    {
      icon: <FaClipboardCheck />,
      title: "Complaint assigned",
      time: "2 hours ago",
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="bg-[#111827] rounded-2xl border border-gray-800 p-6 shadow-lg">

      <h2 className="text-2xl font-bold text-white mb-6">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((item, index) => (

          <div
            key={index}
            className="flex items-center gap-4 border-b border-gray-800 pb-4"
          >

            <div
              className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center text-white`}
            >

              {item.icon}

            </div>

            <div className="flex-1">

              <p className="text-white font-medium">

                {item.title}

              </p>

              <p className="text-gray-400 text-sm">

                {item.time}

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default RecentActivity;