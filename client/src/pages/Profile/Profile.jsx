import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaSave,
  FaArrowLeft,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const [user, setUser] = useState({
    name: "Citizen",
    email: "citizen@example.com",
    phone: "9876543210",
    role: "Citizen",
    department: "General",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setEditing(false);

    // Later we will update MongoDB here.
    alert("Profile updated successfully");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
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

              <button className="text-[#E8AA0C] font-semibold">
                Profile
              </button>

            </div>


            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 text-gray-300 hover:text-red-400"
            >

              <FaSignOutAlt />

              Logout

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


          <p className="text-[#E8AA0C] text-sm font-semibold uppercase tracking-widest">
            Citizen Account
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            My Profile
          </h1>

          <p className="text-gray-400 mt-3">
            View and manage your Smart Municipality account.
          </p>

        </div>

      </section>


      {/* ================= CONTENT ================= */}

      <main className="max-w-5xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ================= PROFILE CARD ================= */}

          <div className="bg-white border border-[#DCE3EA] rounded-xl p-7">

            <div className="flex flex-col items-center text-center">

              {/* AVATAR */}

              <div className="w-24 h-24 rounded-full bg-[#10263B] text-[#E8AA0C] flex items-center justify-center text-4xl">

                <FaUser />

              </div>


              <h2 className="text-xl font-bold text-[#0B1B2B] mt-5">
                {user.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {user.email}
              </p>


              <span className="mt-4 bg-[#FFF8E6] border border-[#F3D98A] text-[#A97400] text-xs font-semibold px-4 py-2 rounded-full">
                {user.role}
              </span>

            </div>


            {/* COMPLAINT BUTTON */}

            <button
              onClick={() => navigate("/my-complaints")}
              className="mt-7 w-full border border-[#DCE3EA] text-gray-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#F5F7FA]"
            >

              <FaClipboardList />

              My Complaints

            </button>


            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              className="mt-3 w-full border border-red-200 text-red-500 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-50"
            >

              <FaSignOutAlt />

              Logout

            </button>

          </div>


          {/* ================= PROFILE INFORMATION ================= */}

          <div className="lg:col-span-2 bg-white border border-[#DCE3EA] rounded-xl p-7">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-[#0B1B2B]">
                  Personal Information
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Your registered account details.
                </p>

              </div>


              {!editing ? (

                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 border border-[#E8AA0C] text-[#A97400] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#FFF8E6]"
                >

                  <FaEdit />

                  Edit

                </button>

              ) : (

                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-[#E8AA0C] text-[#0B1B2B] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#f3bd25]"
                >

                  <FaSave />

                  Save

                </button>

              )}

            </div>


            {/* FORM */}

            <div className="grid md:grid-cols-2 gap-5 mt-8">

              <ProfileField
                icon={<FaUser />}
                label="Full Name"
                name="name"
                value={user.name}
                editing={editing}
                onChange={handleChange}
              />

              <ProfileField
                icon={<FaEnvelope />}
                label="Email"
                name="email"
                value={user.email}
                editing={editing}
                onChange={handleChange}
                type="email"
              />

              <ProfileField
                icon={<FaPhone />}
                label="Phone"
                name="phone"
                value={user.phone}
                editing={editing}
                onChange={handleChange}
              />

              <div>

                <label className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                  Role
                </label>

                <div className="mt-2 bg-[#F5F7FA] border border-[#E1E6EB] rounded-lg px-4 py-3 text-sm text-gray-600">
                  {user.role}
                </div>

              </div>


              <div>

                <label className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                  Department
                </label>

                <div className="mt-2 bg-[#F5F7FA] border border-[#E1E6EB] rounded-lg px-4 py-3 text-sm text-gray-600">
                  {user.department}
                </div>

              </div>

            </div>


            {/* ACCOUNT INFO */}

            <div className="border-t border-[#E8ECF0] mt-8 pt-7">

              <h3 className="font-bold text-[#0B1B2B]">
                Account Information
              </h3>

              <div className="grid sm:grid-cols-2 gap-5 mt-5">

                <div>

                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Account Type
                  </p>

                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    Citizen Account
                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Account Status
                  </p>

                  <p className="text-sm font-semibold text-green-600 mt-1">
                    Active
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ================= REGISTER COMPLAINT ================= */}

        <div className="mt-8 bg-[#10263B] rounded-xl p-7 text-white flex flex-col md:flex-row items-center justify-between gap-5">

          <div>

            <h2 className="font-bold text-lg">
              Have a civic issue?
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Register a complaint and let the municipality handle it.
            </p>

          </div>

          <button
            onClick={() => navigate("/register-complaint")}
            className="bg-[#E8AA0C] text-[#0B1B2B] px-6 py-3 rounded-lg font-bold hover:bg-[#f3bd25] whitespace-nowrap"
          >
            Register Complaint
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


/* ================= PROFILE FIELD ================= */

function ProfileField({
  icon,
  label,
  name,
  value,
  editing,
  onChange,
  type = "text",
}) {
  return (
    <div>

      <label className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
        {label}
      </label>

      <div className="flex items-center gap-3 mt-2 border border-[#E1E6EB] rounded-lg px-4">

        <span className="text-[#A97400] text-sm">
          {icon}
        </span>

        {editing ? (

          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full py-3 outline-none text-sm text-gray-700"
          />

        ) : (

          <p className="py-3 text-sm text-gray-600">
            {value}
          </p>

        )}

      </div>

    </div>
  );
}

export default Profile;