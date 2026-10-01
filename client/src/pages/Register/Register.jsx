import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";

import {
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      alert("Please fill all fields");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must contain at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await registerUser(formData);

      alert(
        res.data.message || "Registration successful"
      );

      navigate("/login");

    } catch (err) {
      console.error("Registration Error:", err);

      alert(
        err.response?.data?.message ||
          "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1B2B] flex items-center justify-center px-4 py-8">

      {/* REGISTER CARD */}
      <div className="w-full max-w-md">

        <div className="bg-[#111D2D] border border-gray-600 rounded-xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-[#0B1B2B] text-center px-6 py-7 border-b border-gray-700">

            <div className="w-12 h-12 mx-auto mb-4 bg-[#E8AA0C] rounded-lg flex items-center justify-center">
              <FaBuilding className="text-[#0B1B2B] text-xl" />
            </div>

            <h1 className="text-3xl font-bold text-white">
              Smart Municipality
            </h1>

            <p className="text-[#E8AA0C] text-sm mt-2">
              Create your citizen account
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleRegister}
            className="p-7"
          >

            {/* NAME */}
            <div className="mb-4">

              <label className="block text-gray-300 text-sm mb-2">
                Full Name
              </label>

              <div className="flex items-center bg-[#0B1B2B] border border-gray-600 rounded-lg px-3 focus-within:border-[#E8AA0C]">

                <FaUser className="text-gray-500 text-sm" />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent px-3 py-3 text-white placeholder-gray-500 outline-none"
                />

              </div>

            </div>

            {/* EMAIL */}
            <div className="mb-4">

              <label className="block text-gray-300 text-sm mb-2">
                Email Address
              </label>

              <div className="flex items-center bg-[#0B1B2B] border border-gray-600 rounded-lg px-3 focus-within:border-[#E8AA0C]">

                <FaEnvelope className="text-gray-500 text-sm" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent px-3 py-3 text-white placeholder-gray-500 outline-none"
                />

              </div>

            </div>

            {/* PHONE */}
            <div className="mb-4">

              <label className="block text-gray-300 text-sm mb-2">
                Phone Number
              </label>

              <div className="flex items-center bg-[#0B1B2B] border border-gray-600 rounded-lg px-3 focus-within:border-[#E8AA0C]">

                <FaPhone className="text-gray-500 text-sm" />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent px-3 py-3 text-white placeholder-gray-500 outline-none"
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="mb-6">

              <label className="block text-gray-300 text-sm mb-2">
                Password
              </label>

              <div className="flex items-center bg-[#0B1B2B] border border-gray-600 rounded-lg px-3 focus-within:border-[#E8AA0C]">

                <FaLock className="text-gray-500 text-sm" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent px-3 py-3 text-white placeholder-gray-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="text-gray-500 hover:text-[#E8AA0C]"
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

              <p className="text-xs text-gray-500 mt-2">
                Password must contain at least 6 characters.
              </p>

            </div>

            {/* ACCOUNT TYPE */}
            <div className="bg-[#0B1B2B] border border-gray-700 rounded-lg p-4 mb-5">

              <div className="flex items-center gap-3">

                <FaBuilding className="text-[#E8AA0C]" />

                <div>
                  <p className="text-[#E8AA0C] text-sm font-semibold">
                    Citizen Account
                  </p>

                  <p className="text-gray-500 text-xs mt-1">
                    New registrations are created as Citizen accounts.
                  </p>
                </div>

              </div>

            </div>

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold transition ${
                loading
                  ? "bg-gray-600 cursor-not-allowed text-gray-300"
                  : "bg-[#E8AA0C] text-[#0B1B2B] hover:bg-[#D99D00]"
              }`}
            >
              {loading
                ? "Creating Account..."
                : "Create Citizen Account"}
            </button>

            {/* LOGIN */}
            <p className="text-center text-sm text-gray-400 mt-6">

              Already have an account?{" "}

              <Link
                to="/login"
                className="text-[#E8AA0C] font-semibold hover:underline"
              >
                Login
              </Link>

            </p>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Register;