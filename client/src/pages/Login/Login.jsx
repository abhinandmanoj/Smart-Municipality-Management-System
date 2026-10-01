import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // VALID DEPARTMENTS
  // =====================================================

  const validDepartments = [
    "Road & Transport",
    "Waste Management",
    "Water Supply",
    "Electrical",
    "Drainage & Sewage",
    "Public Health",
    "Parks & Public Spaces",
  ];

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // =================================================
      // SEND LOGIN REQUEST
      // =================================================

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      // =================================================
      // CHECK SERVER RESPONSE
      // =================================================

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      // =================================================
      // CHECK USER DATA
      // =================================================

      if (!data.user) {
        throw new Error(
          "User information was not returned by the server."
        );
      }

      // =================================================
      // GET USER ROLE
      // =================================================

      const role = data.user.role
        ?.trim()
        .toLowerCase();

      // =================================================
      // GET DEPARTMENT
      // =================================================

      const department =
        data.user.department
          ?.trim() || "";

      console.log("LOGIN SUCCESS");
      console.log("User:", data.user);
      console.log("Role:", role);
      console.log("Department:", department);

      // =================================================
      // SAVE USER
      // =================================================

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // =================================================
      // SAVE TOKEN
      // =================================================

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      // =================================================
      // ADMIN
      // =================================================

      if (role === "admin") {
        // Remove any old officer department
        localStorage.removeItem(
          "officerDepartment"
        );

        navigate("/admin/dashboard");
        return;
      }

      // =================================================
      // OFFICER
      // =================================================

      if (role === "officer") {
        // -----------------------------------------------
        // Check officer department
        // -----------------------------------------------

        if (!department) {
          throw new Error(
            "Officer account does not have a department assigned."
          );
        }

        // -----------------------------------------------
        // Check department is valid
        // -----------------------------------------------

        if (
          !validDepartments.includes(
            department
          )
        ) {
          throw new Error(
            `Invalid officer department: ${department}`
          );
        }

        // -----------------------------------------------
        // Save officer department
        // -----------------------------------------------

        localStorage.setItem(
          "officerDepartment",
          department
        );

        // -----------------------------------------------
        // Go to officer dashboard
        // -----------------------------------------------

        navigate("/officer/dashboard");
        return;
      }

      // =================================================
      // DEPARTMENT HEAD
      // =================================================

      if (role === "department head") {
        // Department Head can also have a department

        if (department) {
          localStorage.setItem(
            "officerDepartment",
            department
          );
        }

        navigate("/officer/dashboard");
        return;
      }

      // =================================================
      // CITIZEN
      // =================================================

      if (role === "citizen") {
        localStorage.removeItem(
          "officerDepartment"
        );

        navigate("/citizen/dashboard");
        return;
      }

      // =================================================
      // UNKNOWN ROLE
      // =================================================

      throw new Error(
        "Invalid user role. Please contact the administrator."
      );

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#0B1929] flex items-center justify-center px-4">

      {/* ================================================= */}
      {/* LOGIN CONTAINER */}
      {/* ================================================= */}

      <div className="w-full max-w-md">

        {/* ================================================= */}
        {/* LOGO / TITLE */}
        {/* ================================================= */}

        <div className="text-center mb-8">

          <div className="flex justify-center mb-4">

            <div className="w-14 h-14 bg-[#F2B400] rounded-xl flex items-center justify-center">

              <span className="text-[#0B1929] text-2xl">
                🏢
              </span>

            </div>

          </div>

          <h1 className="text-4xl font-semibold text-white">
            Smart Municipality
          </h1>

          <p className="text-[#8FA6BD] mt-2">
            Digital Civic Services
          </p>

        </div>

        {/* ================================================= */}
        {/* LOGIN CARD */}
        {/* ================================================= */}

        <div className="bg-[#111C2C] border border-[#344356] rounded-2xl overflow-hidden">

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="px-7 py-6 border-b border-[#273547]">

            <h2 className="text-2xl font-semibold text-white">
              Welcome Back
            </h2>

            <p className="text-[#8FA6BD] text-sm mt-1">
              Login to your account
            </p>

          </div>

          {/* ================================================= */}
          {/* ERROR */}
          {/* ================================================= */}

          {error && (

            <div className="mx-7 mt-5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-3 text-sm">

              {error}

            </div>

          )}

          {/* ================================================= */}
          {/* FORM */}
          {/* ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="p-7 space-y-5"
          >

            {/* ================================================= */}
            {/* EMAIL */}
            {/* ================================================= */}

            <div>

              <label className="block text-[#D6DEE8] text-sm mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="Enter your email"
                className="w-full bg-[#0B1929] border border-[#405064] rounded-lg px-4 py-3 text-white placeholder-[#64778C] outline-none focus:border-[#F2B400]"
              />

            </div>

            {/* ================================================= */}
            {/* PASSWORD */}
            {/* ================================================= */}

            <div>

              <label className="block text-[#D6DEE8] text-sm mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full bg-[#0B1929] border border-[#405064] rounded-lg px-4 py-3 text-white placeholder-[#64778C] outline-none focus:border-[#F2B400]"
              />

            </div>

            {/* ================================================= */}
            {/* LOGIN BUTTON */}
            {/* ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-[#0B1929] font-semibold transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#F2B400] hover:bg-[#E0A600]"
              }`}
            >

              {loading
                ? "Logging in..."
                : "Login"}

            </button>

          </form>

          {/* ================================================= */}
          {/* REGISTER */}
          {/* ================================================= */}

          <div className="px-7 pb-7 text-center">

            <p className="text-[#8FA6BD] text-sm">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="text-[#F2B400] hover:text-[#FFD04A] font-medium"
              >
                Register
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;