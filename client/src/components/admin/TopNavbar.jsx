import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaUsers,
  FaBuilding,
  FaChartBar,
  FaRobot,
  FaBell,
  FaSearch,
  FaMoon,
  FaChevronDown,
} from "react-icons/fa";

function TopNavbar() {
  const menus = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome /> },
    { name: "Complaints", path: "/admin/complaints", icon: <FaClipboardList /> },
    { name: "Citizens", path: "/admin/citizens", icon: <FaUsers /> },
    { name: "Departments", path: "/admin/departments", icon: <FaBuilding /> },
    { name: "Analytics", path: "/admin/analytics", icon: <FaChartBar /> },
    { name: "AI Reports", path: "/admin/ai-reports", icon: <FaRobot /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#111827] border-b border-gray-800">

      {/* Top Bar */}
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">

        {/* Logo */}
        <div>
          <h1 className="text-xl font-bold text-white">
            Smart Municipality
          </h1>
          <p className="text-xs text-gray-400">
            AI Complaint Management
          </p>
        </div>

        {/* Search */}
        <div className="relative hidden lg:block">

          <FaSearch className="absolute left-4 top-3 text-gray-500" />

          <input
            type="text"
            placeholder="Search..."
            className="w-72 h-10 rounded-full bg-[#1E293B] border border-gray-700 pl-10 pr-4 text-sm text-white outline-none"
          />

        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          <button className="w-10 h-10 bg-[#1E293B] rounded-lg flex items-center justify-center text-white">
            <FaMoon />
          </button>

          <button className="relative w-10 h-10 bg-[#1E293B] rounded-lg flex items-center justify-center text-white">

            <FaBell />

            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center">
              7
            </span>

          </button>

          <div className="flex items-center gap-3 bg-[#1E293B] rounded-lg px-3 py-2">

            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
              A
            </div>

            <div className="hidden md:block">
              <p className="text-white text-sm font-semibold">
                Administrator
              </p>
              <p className="text-gray-400 text-xs">
                Super Admin
              </p>
            </div>

            <FaChevronDown className="text-gray-400 text-sm"/>

          </div>

        </div>

      </div>

      {/* Navigation */}
      <div className="border-t border-gray-800">

        <div className="max-w-7xl mx-auto flex items-center gap-2 px-6 h-12">

          {menus.map((menu) => (

            <NavLink
              key={menu.name}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-[#1E293B]"
                }`
              }
            >
              {menu.icon}
              {menu.name}
            </NavLink>

          ))}

        </div>

      </div>

    </header>
  );
}

export default TopNavbar;