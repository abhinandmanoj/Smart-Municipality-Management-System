import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaUserShield,
  FaSignOutAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaSave,
  FaEdit,
  FaShieldAlt,
  FaKey,
} from "react-icons/fa";

function AdminProfile() {
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Municipality Administrator",
    email: "admin@smartmunicipality.com",
    phone: "+91 98765 43210",
    department: "Municipal Administration",
    role: "Administrator",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [saved, setSaved] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = () => {
    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const changePassword = () => {
    if (
      !passwords.current ||
      !passwords.newPassword ||
      !passwords.confirm
    ) {
      alert("Please fill all password fields.");
      return;
    }

    if (passwords.newPassword !== passwords.confirm) {
      alert("New passwords do not match.");
      return;
    }

    alert("Password updated successfully.");

    setPasswords({
      current: "",
      newPassword: "",
      confirm: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* NAVBAR */}

      <nav className="bg-[#0B1B2B] text-white">

        <div className="max-w-7xl mx-auto px-6">

          <div className="h-20 flex items-center justify-between">

            {/* LOGO */}

            <div
              onClick={() =>
                navigate("/admin/dashboard")
              }
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
                  Administration Portal
                </p>

              </div>

            </div>


            {/* NAVIGATION */}

            <div className="hidden lg:flex items-center gap-7">

              <button
                onClick={() =>
                  navigate("/admin/dashboard")
                }
                className="text-gray-300 hover:text-white"
              >
                Dashboard
              </button>

              <button
                onClick={() =>
                  navigate("/admin/complaints")
                }
                className="text-gray-300 hover:text-white"
              >
                Complaints
              </button>

              <button
                onClick={() =>
                  navigate("/admin/users")
                }
                className="text-gray-300 hover:text-white"
              >
                Users
              </button>

              <button
                onClick={() =>
                  navigate("/admin/departments")
                }
                className="text-gray-300 hover:text-white"
              >
                Departments
              </button>

              <button
                onClick={() =>
                  navigate("/admin/analytics")
                }
                className="text-gray-300 hover:text-white"
              >
                Analytics
              </button>

            </div>


            {/* RIGHT */}

            <div className="flex items-center gap-5">

              <button
                onClick={() =>
                  navigate("/admin/notifications")
                }
                className="relative text-gray-300 hover:text-white"
              >

                <FaBell />

                <span className="absolute -top-2 -right-2 bg-[#E8AA0C] text-[#0B1B2B] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  5
                </span>

              </button>

              <button className="text-white">
                <FaUserShield />
              </button>

              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400"
              >
                <FaSignOutAlt />
              </button>

            </div>

          </div>

        </div>

      </nav>


      {/* HEADER */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <p className="text-[#E8AA0C] text-sm font-semibold uppercase tracking-widest">
            Administration Portal
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Administrator Profile
          </h1>

          <p className="text-gray-400 mt-2">
            Manage your administrator account and security settings.
          </p>

        </div>

      </section>


      {/* MAIN */}

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* SUCCESS MESSAGE */}

        {saved && (

          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-5 py-3 text-sm font-semibold mb-6">
            Profile updated successfully.
          </div>

        )}


        <div className="grid lg:grid-cols-3 gap-6">


          {/* PROFILE CARD */}

          <section className="bg-white border border-[#DCE3EA] rounded-xl p-6">

            <div className="flex flex-col items-center text-center">

              {/* AVATAR */}

              <div className="w-24 h-24 rounded-full bg-[#0B1B2B] text-[#E8AA0C] flex items-center justify-center text-4xl">

                <FaUserShield />

              </div>

              <h2 className="text-xl font-bold text-[#0B1B2B] mt-5">
                {profile.name}
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                {profile.role}
              </p>


              <div className="mt-6 w-full space-y-3">

                <ProfileInfo
                  icon={<FaEnvelope />}
                  value={profile.email}
                />

                <ProfileInfo
                  icon={<FaPhone />}
                  value={profile.phone}
                />

                <ProfileInfo
                  icon={<FaBuilding />}
                  value={profile.department}
                />

              </div>

            </div>


            {/* SECURITY STATUS */}

            <div className="border-t border-[#E8ECF0] mt-6 pt-5">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                  <FaShieldAlt />
                </div>

                <div>

                  <p className="text-xs font-bold text-[#0B1B2B]">
                    Account Secure
                  </p>

                  <p className="text-[10px] text-gray-400 mt-1">
                    Your account is protected.
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* DETAILS */}

          <section className="lg:col-span-2 bg-white border border-[#DCE3EA] rounded-xl p-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-[#0B1B2B]">
                  Personal Information
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Update administrator account information.
                </p>

              </div>

              {!editing && (

                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 border border-[#DCE3EA] px-4 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-[#F8FAFC]"
                >

                  <FaEdit />

                  Edit

                </button>

              )}

            </div>


            <div className="grid md:grid-cols-2 gap-5 mt-7">

              <ProfileInput
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                icon={<FaUser />}
                disabled={!editing}
              />

              <ProfileInput
                label="Email Address"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                icon={<FaEnvelope />}
                disabled={!editing}
              />

              <ProfileInput
                label="Phone Number"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                icon={<FaPhone />}
                disabled={!editing}
              />

              <ProfileInput
                label="Department"
                name="department"
                value={profile.department}
                onChange={handleProfileChange}
                icon={<FaBuilding />}
                disabled={!editing}
              />

            </div>


            {editing && (

              <div className="flex gap-3 mt-6">

                <button
                  onClick={saveProfile}
                  className="flex items-center gap-2 bg-[#0B1B2B] text-white px-5 py-3 rounded-lg text-xs font-bold hover:bg-[#132B40]"
                >

                  <FaSave />

                  Save Changes

                </button>

                <button
                  onClick={() => setEditing(false)}
                  className="border border-[#DCE3EA] px-5 py-3 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

              </div>

            )}

          </section>

        </div>


        {/* PASSWORD */}

        <section className="bg-white border border-[#DCE3EA] rounded-xl p-6 mt-6">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-[#FFF8E6] text-[#A97400] flex items-center justify-center">
              <FaKey />
            </div>

            <div>

              <h2 className="text-lg font-bold text-[#0B1B2B]">
                Change Password
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Update your administrator account password.
              </p>

            </div>

          </div>


          <div className="grid md:grid-cols-3 gap-5 mt-6">

            <PasswordInput
              label="Current Password"
              name="current"
              value={passwords.current}
              onChange={handlePasswordChange}
            />

            <PasswordInput
              label="New Password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
            />

            <PasswordInput
              label="Confirm Password"
              name="confirm"
              value={passwords.confirm}
              onChange={handlePasswordChange}
            />

          </div>


          <button
            onClick={changePassword}
            className="flex items-center gap-2 mt-6 bg-[#E8AA0C] text-[#0B1B2B] px-5 py-3 rounded-lg text-xs font-bold hover:bg-[#D99D00]"
          >

            <FaLock />

            Update Password

          </button>

        </section>


        {/* ADMIN PERMISSIONS */}

        <section className="bg-[#0B1B2B] text-white rounded-xl p-6 mt-6">

          <div className="flex gap-4">

            <div className="w-11 h-11 rounded-lg bg-[#E8AA0C] text-[#0B1B2B] flex items-center justify-center flex-shrink-0">
              <FaShieldAlt />
            </div>

            <div>

              <h2 className="font-bold text-lg">
                Administrator Permissions
              </h2>

              <p className="text-sm text-gray-400 mt-2 leading-6">
                Your administrator account has access to
                municipality complaints, citizens, departments,
                analytics, notifications and system management.
              </p>

            </div>

          </div>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">

            <Permission text="Manage Complaints" />

            <Permission text="Manage Users" />

            <Permission text="Manage Departments" />

            <Permission text="View Analytics" />

          </div>

        </section>

      </main>


      {/* FOOTER */}

      <footer className="bg-[#071521] text-white py-8 mt-10">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between gap-4">

            <div>

              <h3 className="font-bold">
                Smart Municipality
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Administrator Account
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


/* ================================================= */
/* PROFILE INFO */
/* ================================================= */

function ProfileInfo({
  icon,
  value,
}) {
  return (
    <div className="flex items-center gap-3 text-left">

      <div className="w-8 h-8 rounded-lg bg-[#F5F7FA] text-gray-500 flex items-center justify-center text-xs">
        {icon}
      </div>

      <p className="text-xs text-gray-600 truncate">
        {value}
      </p>

    </div>
  );
}


/* ================================================= */
/* PROFILE INPUT */
/* ================================================= */

function ProfileInput({
  label,
  name,
  value,
  onChange,
  icon,
  disabled,
}) {
  return (
    <div>

      <label className="text-xs font-bold text-gray-500 uppercase">
        {label}
      </label>

      <div className="sm-input-box mt-2">

        <span>{icon}</span>

        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`h-[44px] rounded-lg pr-4 text-sm outline-none border ${
            disabled
              ? "bg-[#F8FAFC] border-[#E8ECF0] text-gray-500"
              : "bg-white border-[#DCE3EA] focus:border-[#E8AA0C]"
          }`}
        />

      </div>

    </div>
  );
}


/* ================================================= */
/* PASSWORD INPUT */
/* ================================================= */

function PasswordInput({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="text-xs font-bold text-gray-500 uppercase">
        {label}
      </label>

      <div className="sm-password-box mt-2">

        <FaLock />

        <input
          type="password"
          name={name}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className="h-[44px] border border-[#DCE3EA] rounded-lg pr-4 text-sm outline-none focus:border-[#E8AA0C]"
        />

      </div>

    </div>
  );
}


/* ================================================= */
/* PERMISSION */
/* ================================================= */

function Permission({
  text,
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3">

      <p className="text-xs text-gray-300">
        ✓ {text}
      </p>

    </div>
  );
}


export default AdminProfile;