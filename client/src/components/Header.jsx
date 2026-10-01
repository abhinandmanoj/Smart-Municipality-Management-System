import { Link } from "react-router-dom";

import {
  FaSearch,
  FaBell,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#0B1120]/95 backdrop-blur-md border-b border-gray-800">

      <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">

        {/* Logo */}

        <Link
          to="/dashboard"
          className="flex items-center gap-4"
        >

          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">

            <span className="text-white text-2xl">
              🏛
            </span>

          </div>

          <div>

            <h1 className="text-2xl font-bold text-white">

              Smart Municipality

            </h1>

            <p className="text-sm text-gray-400">

              AI Powered Complaint Management

            </p>

          </div>

        </Link>

        {/* Search */}

        <div className="relative w-[420px]">

          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"/>

          <input
            type="text"
            placeholder="Search complaints, locations..."
            className="w-full bg-[#111827] border border-gray-700 rounded-full py-3 pl-14 pr-5 text-white outline-none focus:border-orange-500"
          />

        </div>

        {/* Right */}

        <div className="flex items-center gap-5">

          {/* Notification */}

          <button className="relative">

            <FaBell className="text-2xl text-white"/>

            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">

              5

            </span>

          </button>

          {/* User */}

          <div className="flex items-center gap-3 cursor-pointer">

            <FaUserCircle className="text-5xl text-orange-500"/>

            <div>

              <h3 className="text-white font-semibold">

                Ambadi

              </h3>

              <p className="text-gray-400 text-sm">

                Citizen

              </p>

            </div>

            <FaChevronDown className="text-gray-500"/>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;