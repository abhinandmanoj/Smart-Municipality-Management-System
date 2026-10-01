import { Link, useLocation } from "react-router-dom";

import {
  FaHome,
  FaClipboardList,
  FaPlusCircle,
  FaChartBar,
  FaRobot,
  FaBell,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaCity,
  FaChevronRight,
} from "react-icons/fa";

function Sidebar() {

  const location = useLocation();

  const menus = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
    },
    {
      name: "Register Complaint",
      icon: <FaPlusCircle />,
      path: "/register-complaint",
    },
    {
      name: "My Complaints",
      icon: <FaClipboardList />,
      path: "/my-complaints",
    },
    {
      name: "Analytics",
      icon: <FaChartBar />,
      path: "/analytics",
    },
    {
      name: "AI Analysis",
      icon: <FaRobot />,
      path: "/ai-analysis",
    },
    {
      name: "Notifications",
      icon: <FaBell />,
      path: "/notifications",
    },
    {
      name: "Profile",
      icon: <FaUserCircle />,
      path: "/profile",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/settings",
    },
  ];

  return (
    <aside className="w-[280px] bg-[#111827] border-r border-gray-800 flex flex-col">

      {/* Logo */}

      <div className="p-8">

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-xl">

            <FaCity className="text-white text-3xl"/>

          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">

              Smart City

            </h1>

            <p className="text-gray-400">

              AI Municipality

            </p>

          </div>

        </div>

      </div>

      <div className="border-t border-gray-800"/>

      {/* Menu */}

      <div className="flex-1 px-5 py-6">

        <p className="text-gray-500 uppercase text-xs tracking-widest mb-5">

          MAIN MENU

        </p>

        <div className="space-y-2">

          {menus.map((menu) => (

            <Link
              key={menu.name}
              to={menu.path}
              className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${
                location.pathname === menu.path
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl"
                  : "text-gray-400 hover:bg-[#1E293B] hover:text-white"
              }`}
            >

              <div className="flex items-center gap-4">

                <span className="text-xl">

                  {menu.icon}

                </span>

                <span>

                  {menu.name}

                </span>

              </div>

              <FaChevronRight className="text-xs"/>

            </Link>

          ))}

        </div>

      </div>

      {/* Bottom */}

      <div className="p-6 border-t border-gray-800">

        <button className="w-full bg-gradient-to-r from-red-500 to-red-700 py-4 rounded-2xl flex justify-center items-center gap-3 text-white hover:scale-105 duration-300">

          <FaSignOutAlt />

          Logout

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;