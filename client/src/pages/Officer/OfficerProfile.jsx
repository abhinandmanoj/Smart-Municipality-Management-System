import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaIdBadge,
  FaShieldAlt,
} from "react-icons/fa";

function OfficerProfile() {
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Officer",
    email: "officer@smartmunicipality.com",
    phone: "+91 9876543210",
    department: "Road & Transport Department",
    ward: "Ward 12",
    role: "Municipal Officer",
    employeeId: "OFF-1024",
  });

  const [tempProfile, setTempProfile] = useState(profile);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const handleChange = (e) => {
    setTempProfile({
      ...tempProfile,
      [e.target.name]: e.target.value,
    });
  };

  const startEditing = () => {
    setTempProfile(profile);
    setEditing(true);
  };

  const cancelEditing = () => {
    setTempProfile(profile);
    setEditing(false);
  };

  const saveProfile = () => {
    setProfile(tempProfile);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <nav className="bg-[#0B1B2B] text-white">

        <div className="max-w-7xl mx-auto px-6">

          <div className="h-20 flex items-center justify-between">

            {/* LOGO */}

            <div
              onClick={() =>
                navigate("/officer/dashboard")
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
                  Officer Portal
                </p>

              </div>

            </div>


            {/* NAVIGATION */}

            <div className="hidden lg:flex items-center gap-7">

              <button
                onClick={() =>
                  navigate("/officer/dashboard")
                }
                className="text-gray-300 hover:text-white"
              >
                Dashboard
              </button>

              <button
                onClick={() =>
                  navigate("/officer/complaints")
                }
                className="text-gray-300 hover:text-white"
              >
                Complaints
              </button>

              <button
                onClick={() =>
                  navigate("/officer/tasks")
                }
                className="text-gray-300 hover:text-white"
              >
                Tasks
              </button>

              <button
                onClick={() =>
                  navigate("/officer/notifications")
                }
                className="text-gray-300 hover:text-white"
              >
                Notifications
              </button>

            </div>


            {/* RIGHT */}

            <div className="flex items-center gap-5">

              <button
                onClick={() =>
                  navigate("/officer/notifications")
                }
                className="relative text-gray-300 hover:text-white"
              >

                <FaBell />

                <span className="absolute -top-2 -right-2 bg-[#E8AA0C] text-[#0B1B2B] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  3
                </span>

              </button>


              <button
                className="text-white"
              >

                <FaUser />

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


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <p className="text-[#E8AA0C] text-sm font-semibold uppercase tracking-widest">
            Officer Portal
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            My Profile
          </h1>

          <p className="text-gray-400 mt-2">
            Manage your officer account and department information.
          </p>

        </div>

      </section>


      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="max-w-5xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-3 gap-6">


          {/* ================================================= */}
          {/* PROFILE CARD */}
          {/* ================================================= */}

          <section className="bg-white border border-[#DCE3EA] rounded-xl p-6">

            <div className="flex flex-col items-center text-center">

              <div className="w-24 h-24 rounded-full bg-[#0B1B2B] text-[#E8AA0C] flex items-center justify-center">

                <FaUser className="text-4xl" />

              </div>


              <h2 className="text-xl font-bold text-[#0B1B2B] mt-5">
                {profile.name}
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                {profile.role}
              </p>


              <div className="mt-5 bg-[#FFF8E6] text-[#8B6800] text-xs font-bold px-4 py-2 rounded-full">
                Active Officer
              </div>

            </div>


            {/* EMPLOYEE ID */}

            <div className="border-t border-[#E8ECF0] mt-6 pt-6">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-[#F0F4F7] text-[#A97400] flex items-center justify-center">

                  <FaIdBadge />

                </div>

                <div>

                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    Employee ID
                  </p>

                  <p className="text-sm font-bold text-[#0B1B2B] mt-1">
                    {profile.employeeId}
                  </p>

                </div>

              </div>

            </div>


            {/* SECURITY */}

            <div className="border-t border-[#E8ECF0] mt-6 pt-6">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">

                  <FaShieldAlt />

                </div>

                <div>

                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    Account Status
                  </p>

                  <p className="text-sm font-bold text-green-600 mt-1">
                    Verified
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* ================================================= */}
          {/* DETAILS */}
          {/* ================================================= */}

          <section className="lg:col-span-2 bg-white border border-[#DCE3EA] rounded-xl">

            {/* HEADER */}

            <div className="p-6 border-b border-[#E8ECF0]">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <h2 className="text-xl font-bold text-[#0B1B2B]">
                    Account Information
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    Your registered officer information.
                  </p>

                </div>


                {!editing && (

                  <button
                    onClick={startEditing}
                    className="flex items-center gap-2 bg-[#0B1B2B] hover:bg-[#132B40] text-white px-4 py-2.5 rounded-lg text-xs font-bold"
                  >

                    <FaEdit />

                    Edit Profile

                  </button>

                )}

              </div>

            </div>


            {/* CONTENT */}

            <div className="p-6">

              {editing ? (

                <div className="space-y-5">

                  <ProfileInput
                    label="Full Name"
                    name="name"
                    value={tempProfile.name}
                    onChange={handleChange}
                  />

                  <ProfileInput
                    label="Email"
                    name="email"
                    value={tempProfile.email}
                    onChange={handleChange}
                    type="email"
                  />

                  <ProfileInput
                    label="Phone"
                    name="phone"
                    value={tempProfile.phone}
                    onChange={handleChange}
                  />


                  <div className="grid sm:grid-cols-2 gap-5">

                    <ProfileInput
                      label="Department"
                      name="department"
                      value={tempProfile.department}
                      onChange={handleChange}
                    />

                    <ProfileInput
                      label="Ward"
                      name="ward"
                      value={tempProfile.ward}
                      onChange={handleChange}
                    />

                  </div>


                  {/* BUTTONS */}

                  <div className="flex flex-wrap gap-3 pt-3">

                    <button
                      onClick={saveProfile}
                      className="flex items-center gap-2 bg-[#E8AA0C] hover:bg-[#D99D00] text-[#0B1B2B] font-bold px-5 py-3 rounded-lg text-sm"
                    >

                      <FaSave />

                      Save Changes

                    </button>


                    <button
                      onClick={cancelEditing}
                      className="flex items-center gap-2 border border-[#DCE3EA] text-gray-600 hover:bg-gray-50 font-bold px-5 py-3 rounded-lg text-sm"
                    >

                      <FaTimes />

                      Cancel

                    </button>

                  </div>

                </div>

              ) : (

                <div className="grid sm:grid-cols-2 gap-5">

                  <ProfileInfo
                    icon={<FaUser />}
                    label="Full Name"
                    value={profile.name}
                  />

                  <ProfileInfo
                    icon={<FaEnvelope />}
                    label="Email Address"
                    value={profile.email}
                  />

                  <ProfileInfo
                    icon={<FaPhone />}
                    label="Phone Number"
                    value={profile.phone}
                  />

                  <ProfileInfo
                    icon={<FaBriefcase />}
                    label="Role"
                    value={profile.role}
                  />

                  <ProfileInfo
                    icon={<FaBuilding />}
                    label="Department"
                    value={profile.department}
                  />

                  <ProfileInfo
                    icon={<FaMapMarkerAlt />}
                    label="Assigned Ward"
                    value={profile.ward}
                  />

                </div>

              )}

            </div>

          </section>

        </div>


        {/* ================================================= */}
        {/* DEPARTMENT INFORMATION */}
        {/* ================================================= */}

        <section className="bg-white border border-[#DCE3EA] rounded-xl mt-6">

          <div className="p-6 border-b border-[#E8ECF0]">

            <h2 className="text-xl font-bold text-[#0B1B2B]">
              Department Information
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Your current municipal department assignment.
            </p>

          </div>


          <div className="p-6">

            <div className="grid md:grid-cols-3 gap-4">

              <DepartmentBox
                title="Department"
                value={profile.department}
              />

              <DepartmentBox
                title="Assigned Area"
                value={profile.ward}
              />

              <DepartmentBox
                title="Position"
                value={profile.role}
              />

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* PROFILE NOTICE */}
        {/* ================================================= */}

        <div className="bg-[#FFFDF5] border border-[#F1DF9F] rounded-xl mt-6 p-5">

          <div className="flex gap-4">

            <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] text-[#0B1B2B] flex items-center justify-center flex-shrink-0">

              <FaShieldAlt />

            </div>

            <div>

              <h3 className="font-bold text-[#0B1B2B]">
                Account Security
              </h3>

              <p className="text-sm text-gray-500 leading-6 mt-1">
                Keep your account information updated. Your
                department and ward determine which municipal
                complaints and tasks are assigned to you.
              </p>

            </div>

          </div>

        </div>

      </main>


      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer className="bg-[#071521] text-white py-8 mt-10">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between gap-4">

            <div>

              <h3 className="font-bold">
                Smart Municipality
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Officer Profile Management
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
  label,
  value,
}) {
  return (
    <div className="bg-[#F8FAFC] rounded-lg p-4">

      <div className="flex items-center gap-2">

        <span className="text-[#A97400]">
          {icon}
        </span>

        <span className="text-[10px] uppercase font-bold text-gray-400">
          {label}
        </span>

      </div>

      <p className="text-sm font-semibold text-[#0B1B2B] mt-2">
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
  type = "text",
}) {
  return (
    <div>

      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-2 border border-[#DCE3EA] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E8AA0C]"
      />

    </div>
  );
}


/* ================================================= */
/* DEPARTMENT BOX */
/* ================================================= */

function DepartmentBox({
  title,
  value,
}) {
  return (
    <div className="border border-[#DCE3EA] rounded-lg p-5">

      <p className="text-[10px] uppercase font-bold text-gray-400">
        {title}
      </p>

      <p className="text-sm font-bold text-[#0B1B2B] mt-2">
        {value}
      </p>

    </div>
  );
}


export default OfficerProfile;