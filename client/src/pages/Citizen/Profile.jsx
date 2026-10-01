import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaBell,
  FaUser,
  FaEdit,
  FaSave,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: storedUser.name || "Abhinand",
    email: storedUser.email || "citizen@example.com",
    phone: storedUser.phone || "+91 98765 43210",
    address: storedUser.address || "Municipality Area",
    role: storedUser.role || "Citizen",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const handleChange = (e) => {
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
    localStorage.setItem(
      "user",
      JSON.stringify(profile)
    );

    setIsEditing(false);
  };

  const changePassword = (e) => {
    e.preventDefault();

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
    <div className="min-h-screen bg-[#F5F7FA] text-[#0B1B2B]">

      {/* ================= NAVBAR ================= */}

      <nav className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="h-[68px] flex items-center justify-between">

            {/* LOGO */}

            <div
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 cursor-pointer shrink-0"
            >

              <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] flex items-center justify-center">
                <FaBuilding className="text-[#0B1B2B] text-base" />
              </div>

              <div>
                <div className="text-[18px] leading-5 font-bold text-white">
                  Smart Municipality
                </div>

                <div className="text-[10px] leading-4 text-gray-400">
                  Citizen Services
                </div>
              </div>

            </div>


            {/* NAVIGATION */}

            <div className="hidden lg:flex items-center gap-2 ml-auto mr-6">

              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Home
              </button>

              <button
                onClick={() => navigate("/register-complaint")}
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Register Complaint
              </button>

              <button
                onClick={() => navigate("/my-complaints")}
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                My Complaints
              </button>

              <button
                onClick={() => navigate("/departments")}
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Departments
              </button>

              <button
                onClick={() => navigate("/notifications")}
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Notifications
              </button>

            </div>


            {/* RIGHT */}

            <div className="flex items-center gap-3 shrink-0">

              <button
                onClick={() => navigate("/notifications")}
                className="relative w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white"
              >

                <FaBell className="text-[15px]" />

                <span className="absolute top-0 right-0 w-[16px] h-[16px] rounded-full bg-[#E8AA0C] text-[#0B1B2B] text-[9px] font-bold flex items-center justify-center">
                  3
                </span>

              </button>

              <button
                className="w-9 h-9 rounded-md bg-[#E8AA0C] flex items-center justify-center"
              >
                <FaUser className="text-[#0B1B2B] text-[13px]" />
              </button>

            </div>

          </div>

        </div>

      </nav>


      {/* ================= HEADER ================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-6xl mx-auto px-6 py-10">

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-xs mb-6"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>

          <p className="text-[#E8AA0C] text-xs font-bold uppercase tracking-widest">
            Citizen Account
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            My Profile
          </h1>

          <p className="text-gray-400 text-sm mt-3">
            Manage your personal information and account settings.
          </p>

        </div>

      </section>


      {/* ================= MAIN ================= */}

      <main className="max-w-6xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ================= PROFILE CARD ================= */}

          <section className="bg-white border border-[#DCE3EA] rounded-xl p-7">

            <div className="text-center">

              <div className="w-24 h-24 rounded-full bg-[#0B1B2B] text-[#E8AA0C] flex items-center justify-center mx-auto text-3xl font-bold">

                {profile.name
                  ? profile.name.charAt(0).toUpperCase()
                  : "C"}

              </div>

              <h2 className="font-bold text-xl mt-5">
                {profile.name}
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                {profile.email}
              </p>

              <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-[10px] font-bold mt-4">
                <FaCheckCircle />
                Verified Citizen
              </div>

            </div>


            <div className="border-t border-[#E8ECF0] mt-7 pt-6 space-y-4">

              <ProfileRow
                icon={<FaIdCard />}
                label="Account Type"
                value="Citizen"
              />

              <ProfileRow
                icon={<FaEnvelope />}
                label="Email"
                value={profile.email}
              />

              <ProfileRow
                icon={<FaPhone />}
                label="Phone"
                value={profile.phone}
              />

              <ProfileRow
                icon={<FaMapMarkerAlt />}
                label="Area"
                value={profile.address}
              />

            </div>

          </section>


          {/* ================= RIGHT CONTENT ================= */}

          <div className="lg:col-span-2 space-y-6">

            {/* PERSONAL INFORMATION */}

            <section className="bg-white border border-[#DCE3EA] rounded-xl p-6 md:p-7">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div>

                  <p className="text-[#A97400] text-xs font-bold uppercase tracking-widest">
                    Account Information
                  </p>

                  <h2 className="text-xl font-bold mt-2">
                    Personal Information
                  </h2>

                  <p className="text-xs text-gray-400 mt-1">
                    Keep your contact details up to date.
                  </p>

                </div>


                {!isEditing ? (

                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-2 border border-[#DCE3EA] rounded-lg px-4 py-2.5 text-xs font-bold"
                  >
                    <FaEdit className="text-[#A97400]" />
                    Edit Profile
                  </button>

                ) : (

                  <button
                    onClick={saveProfile}
                    className="flex items-center justify-center gap-2 bg-[#0B1B2B] text-white rounded-lg px-4 py-2.5 text-xs font-bold"
                  >
                    <FaSave className="text-[#E8AA0C]" />
                    Save Changes
                  </button>

                )}

              </div>


              <div className="grid md:grid-cols-2 gap-5 mt-7">

                <InputField
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={<FaUser />}
                />

                <InputField
                  label="Email Address"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={<FaEnvelope />}
                />

                <InputField
                  label="Phone Number"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={<FaPhone />}
                />

                <InputField
                  label="Area / Address"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={<FaMapMarkerAlt />}
                />

              </div>

            </section>


            {/* SECURITY */}

            <section className="bg-white border border-[#DCE3EA] rounded-xl p-6 md:p-7">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-[#FFF8E6] text-[#A97400] flex items-center justify-center">
                  <FaLock />
                </div>

                <div>

                  <h2 className="font-bold text-lg">
                    Security
                  </h2>

                  <p className="text-xs text-gray-400">
                    Update your account password.
                  </p>

                </div>

              </div>


              <form
                onSubmit={changePassword}
                className="mt-7"
              >

                <div className="grid md:grid-cols-3 gap-4">

                  <PasswordField
                    label="Current Password"
                    name="current"
                    value={passwords.current}
                    onChange={handlePasswordChange}
                  />

                  <PasswordField
                    label="New Password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                  />

                  <PasswordField
                    label="Confirm Password"
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                  />

                </div>


                <div className="flex justify-end mt-5">

                  <button
                    type="submit"
                    className="bg-[#0B1B2B] text-white px-5 py-2.5 rounded-lg text-xs font-bold"
                  >
                    Update Password
                  </button>

                </div>

              </form>

            </section>


            {/* ACCOUNT STATUS */}

            <section className="bg-[#0B1B2B] rounded-xl p-6 md:p-7 text-white">

              <div className="flex items-start gap-4">

                <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] text-[#0B1B2B] flex items-center justify-center flex-shrink-0">
                  <FaCheckCircle />
                </div>

                <div>

                  <p className="text-[#E8AA0C] text-[10px] font-bold uppercase tracking-widest">
                    Account Status
                  </p>

                  <h3 className="font-bold text-lg mt-1">
                    Your citizen account is active
                  </h3>

                  <p className="text-gray-400 text-xs leading-5 mt-2">
                    You can submit complaints, track their progress,
                    receive notifications and access municipal services
                    through the Smart Municipality portal.
                  </p>

                </div>

              </div>

            </section>

          </div>

        </div>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="bg-[#071521] text-white mt-10">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex flex-col md:flex-row justify-between gap-5">

            <div>

              <div className="flex items-center gap-2">

                <div className="w-8 h-8 rounded-md bg-[#E8AA0C] flex items-center justify-center">
                  <FaBuilding className="text-[#0B1B2B] text-sm" />
                </div>

                <span className="font-bold">
                  Smart Municipality
                </span>

              </div>

              <p className="text-gray-500 text-xs mt-3">
                Digital citizen services for a smarter city.
              </p>

            </div>

            <p className="text-gray-600 text-xs">
              © 2026 Smart Municipality
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}


/* ================================================= */
/* PROFILE ROW */
/* ================================================= */

function ProfileRow({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="w-8 h-8 rounded-lg bg-[#F5F7FA] text-[#A97400] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[9px] text-gray-400 uppercase font-bold">
          {label}
        </p>

        <p className="text-xs font-semibold mt-1 break-words">
          {value}
        </p>

      </div>

    </div>
  );
}


/* ================================================= */
/* INPUT FIELD */
/* ================================================= */

function InputField({
  label,
  name,
  value,
  onChange,
  disabled,
  icon,
}) {
  return (
    <div>

      <label className="text-[10px] uppercase font-bold text-gray-500">
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
          className={`h-[44px] border rounded-lg pr-3 text-xs outline-none ${
            disabled
              ? "bg-[#F5F7FA] border-[#E8ECF0] text-gray-500"
              : "bg-white border-[#DCE3EA] focus:border-[#E8AA0C]"
          }`}
        />

      </div>

    </div>
  );
}


/* ================================================= */
/* PASSWORD FIELD */
/* ================================================= */

function PasswordField({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="text-[10px] uppercase font-bold text-gray-500">
        {label}
      </label>

      <input
        type="password"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-[44px] border border-[#DCE3EA] rounded-lg px-3 text-xs mt-2 outline-none focus:border-[#E8AA0C]"
        placeholder="••••••••"
      />

    </div>
  );
}


export default Profile;