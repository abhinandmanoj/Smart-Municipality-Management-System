import {
  FaClipboardList,
  FaUsers,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

function DashboardCards() {
  const cards = [
    {
      title: "Total Complaints",
      value: "125",
      change: "+12%",
      icon: <FaClipboardList />,
      color: "bg-orange-500",
    },
    {
      title: "Citizens",
      value: "542",
      change: "+8%",
      icon: <FaUsers />,
      color: "bg-blue-500",
    },
    {
      title: "Pending",
      value: "18",
      change: "-3%",
      icon: <FaClock />,
      color: "bg-yellow-500",
    },
    {
      title: "Resolved",
      value: "102",
      change: "+18%",
      icon: <FaCheckCircle />,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

      {cards.map((card, index) => (

        <div
          key={index}
          className="bg-[#111827] rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-5"
        >

          {/* Top */}

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400 text-sm">
                {card.title}
              </p>

              <h2 className="text-3xl font-bold text-white mt-2">
                {card.value}
              </h2>

            </div>

            <div
              className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg`}
            >
              {card.icon}
            </div>

          </div>

          {/* Bottom */}

          <div className="mt-5 flex items-center gap-2">

            <span className="text-green-400 text-sm font-semibold">
              {card.change}
            </span>

            <span className="text-gray-500 text-sm">
              this month
            </span>

          </div>

        </div>

      ))}

    </div>
  );
}

export default DashboardCards;