import {
  FaSearch,
  FaBell,
  FaMoon,
  FaCog,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";

function Navbar() {
  return (
    <header className="h-24 bg-[#111827] border-b border-gray-800 px-10 flex items-center justify-between">

      {/* Left */}

      <div>

        <h1 className="text-4xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Welcome back, Ambadi 👋
        </p>

      </div>

      {/* Search */}

      <div className="w-[450px] relative">

        <FaSearch className="absolute left-5 top-5 text-gray-500 text-lg" />

        <input
          type="text"
          placeholder="Search complaints..."
          className="w-full bg-[#1E293B] border border-gray-700 rounded-2xl py-4 pl-14 pr-5 text-white outline-none focus:border-orange-500 transition"
        />

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Dark Mode */}

        <button className="w-12 h-12 rounded-xl bg-[#1E293B] hover:bg-orange-500 duration-300 flex justify-center items-center">

          <FaMoon className="text-white"/>

        </button>

        {/* Notification */}

        <button className="relative w-12 h-12 rounded-xl bg-[#1E293B] hover:bg-orange-500 duration-300 flex justify-center items-center">

          <FaBell className="text-white"/>

          <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-xs text-white flex justify-center items-center">

            5

          </span>

        </button>

        {/* Settings */}

        <button className="w-12 h-12 rounded-xl bg-[#1E293B] hover:bg-orange-500 duration-300 flex justify-center items-center">

          <FaCog className="text-white"/>

        </button>

        {/* Profile */}

        <div className="bg-[#1E293B] rounded-2xl px-5 py-3 flex items-center gap-4 cursor-pointer hover:bg-[#263548] transition">

          <FaUserCircle className="text-5xl text-orange-500"/>

          <div>

            <h3 className="text-white font-bold">

              Ambadi

            </h3>

            <p className="text-gray-400 text-sm">

              Citizen

            </p>

          </div>

          <FaChevronDown className="text-gray-400"/>

        </div>

      </div>

    </header>
  );
}

export default Navbar;