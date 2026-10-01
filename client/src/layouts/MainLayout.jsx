import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaBuilding,
} from "react-icons/fa";

function MainLayout({ children }) {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/");
  };

  const navLink = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm transition ${
      isActive
        ? "bg-orange-500 text-white"
        : "text-gray-300 hover:text-white hover:bg-[#1E293B]"
    }`;

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">

      {/* ================= NAVBAR ================= */}

      <header className="h-16 bg-[#111827] border-b border-gray-800">

        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

          {/* Logo */}

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center">

              <FaBuilding className="text-white text-sm" />

            </div>

            <div>

              <h1 className="text-base font-bold text-white">
                Smart Municipality
              </h1>

              <p className="text-[10px] text-gray-500">
                Citizen Portal
              </p>

            </div>

          </div>


          {/* Navigation */}

          <nav className="hidden md:flex items-center gap-1">

            <NavLink
              to="/dashboard"
              className={navLink}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/register-complaint"
              className={navLink}
            >
              Register Complaint
            </NavLink>

            <NavLink
              to="/my-complaints"
              className={navLink}
            >
              My Complaints
            </NavLink>

          </nav>


          {/* Right Side */}

          <div className="flex items-center gap-3">

            {/* Notification */}

            <button
              onClick={() =>
                navigate("/notifications")
              }
              className="w-9 h-9 rounded-lg bg-[#1E293B] flex items-center justify-center text-gray-400 hover:text-white"
            >
              <FaBell size={13} />
            </button>


            {/* User */}

            <div className="flex items-center gap-2">

              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">

                <FaUser
                  className="text-white"
                  size={12}
                />

              </div>

              <div className="hidden lg:block">

                <p className="text-xs font-medium text-white">
                  {user?.name || "Citizen"}
                </p>

                <p className="text-[10px] text-gray-500">
                  Citizen
                </p>

              </div>

            </div>


            {/* Logout */}

            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10"
              title="Logout"
            >
              <FaSignOutAlt size={12} />
            </button>

          </div>

        </div>

      </header>


      {/* ================= MAIN CONTENT ================= */}

      <main className="max-w-7xl mx-auto px-6 py-6">

        {children}

      </main>

    </div>
  );
}

export default MainLayout;