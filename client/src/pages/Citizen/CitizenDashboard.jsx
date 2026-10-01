import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaUser,
  FaArrowRight,
  FaPlus,
  FaRoad,
  FaTrash,
  FaTint,
  FaLightbulb,
  FaRobot,
} from "react-icons/fa";

function CitizenDashboard() {
  const navigate = useNavigate();

  // =================================================
  // USER
  // =================================================

  const storedUser = localStorage.getItem("user");

  let user = {};

  try {
    user = storedUser ? JSON.parse(storedUser) : {};
  } catch (error) {
    console.error("User data error:", error);
  }

  const userName =
    user?.name ||
    user?.fullName ||
    "Citizen";

  // =================================================
  // LOGOUT
  // =================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // =================================================
  // SERVICES
  // =================================================

  const services = [
    {
      icon: <FaRoad />,
      title: "Road & Transport",
      description:
        "Report potholes, damaged roads and traffic issues.",
    },
    {
      icon: <FaTrash />,
      title: "Waste Management",
      description:
        "Report garbage overflow and waste collection issues.",
    },
    {
      icon: <FaTint />,
      title: "Water Supply",
      description:
        "Report water leakage and supply problems.",
    },
    {
      icon: <FaLightbulb />,
      title: "Electrical",
      description:
        "Report broken street lights and electrical issues.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0B1B2B]">

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

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
                className="px-5 py-2.5 rounded-md bg-[#E8AA0C] text-[#0B1B2B] text-[14px] font-bold"
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

              {/* NOTIFICATION */}

              <button
                onClick={() => navigate("/notifications")}
                className="relative w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white"
              >

                <FaBell className="text-[15px]" />

                <span className="absolute top-0 right-0 w-[16px] h-[16px] rounded-full bg-[#E8AA0C] text-[#0B1B2B] text-[9px] font-bold flex items-center justify-center">
                  3
                </span>

              </button>


              {/* PROFILE */}

              <button
                onClick={() => navigate("/profile")}
                className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/15 transition"
              >

                <FaUser className="text-[#E8AA0C] text-[13px]" />

              </button>


              {/* LOGOUT */}

              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white text-[14px] ml-1"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </nav>


      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="py-[72px] md:py-[78px]">

            {/* LABEL */}

            <div className="text-[#E8AA0C] text-[12px] font-bold uppercase tracking-[0.18em]">
              Citizen Portal
            </div>


            {/* TITLE */}

            <h1 className="text-[42px] md:text-[48px] font-bold leading-[1.12] mt-4">

              Better City.

              <br />

              <span className="text-[#E8AA0C]">
                Better Living.
              </span>

            </h1>


            {/* DESCRIPTION */}

            <p className="text-gray-400 text-[15px] leading-7 mt-5 max-w-[610px]">

              Welcome back,{" "}

              <span className="text-white font-bold">
                {userName}
              </span>

              . Report civic issues, track complaints
              and connect with your municipality easily.

            </p>


            {/* BUTTONS */}

            <div className="flex items-center gap-3 mt-7">

              <button
                onClick={() => navigate("/ai-assistant")}
                className="h-[48px] px-5 bg-blue-600 text-white rounded-md flex items-center gap-3 text-[14px] font-bold hover:bg-blue-700 transition"
              >
                <FaRobot className="text-[13px]" />
                AI Assistant
              </button>

              <button
                onClick={() => navigate("/register-complaint")}
                className="h-[48px] px-5 bg-[#E8AA0C] text-[#0B1B2B] rounded-md flex items-center gap-3 text-[14px] font-bold hover:bg-[#D99D00] transition"
              >

                <FaPlus className="text-[13px]" />

                Register a Complaint

              </button>


              <button
                onClick={() => navigate("/my-complaints")}
                className="h-[48px] px-5 border border-gray-500 text-white rounded-md flex items-center gap-3 text-[14px] font-bold hover:bg-white/5 transition"
              >

                Track Complaints

                <FaArrowRight className="text-[12px]" />

              </button>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* SERVICES */}
      {/* ================================================= */}

      <section className="bg-[#F5F7FA]">

        <div className="max-w-[1280px] mx-auto px-6 py-[48px] md:py-[52px]">

          {/* HEADER */}

          <div className="flex items-end justify-between">

            <div>

              <div className="text-[#A97400] text-[12px] font-bold uppercase tracking-[0.16em]">
                Municipal Services
              </div>

              <h2 className="text-[30px] md:text-[32px] font-semibold leading-tight mt-2 text-[#0B1B2B]">
                How can we help?
              </h2>

              <p className="text-gray-500 text-[14px] mt-2">
                Access important municipality services quickly.
              </p>

            </div>


            <button
              onClick={() => navigate("/departments")}
              className="hidden sm:flex items-center gap-2 text-[#A97400] text-[14px] font-bold hover:text-[#8A6200]"
            >

              View all

              <FaArrowRight className="text-[10px]" />

            </button>

          </div>


          {/* CARDS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-7">

            {services.map((service, index) => (

              <button
                key={index}
                onClick={() => navigate("/register-complaint")}
                className="group text-left bg-white border border-[#DCE3EA] rounded-lg p-5 h-[190px] hover:-translate-y-1 hover:shadow-md transition-all"
              >

                {/* ICON */}

                <div className="w-11 h-11 rounded-lg bg-[#0B1B2B] text-[#E8AA0C] flex items-center justify-center text-[17px]">

                  {service.icon}

                </div>


                {/* TITLE */}

                <h3 className="text-[18px] font-semibold leading-6 mt-6 text-[#0B1B2B]">
                  {service.title}
                </h3>


                {/* DESCRIPTION */}

                <p className="text-[12px] leading-5 text-gray-500 mt-2">
                  {service.description}
                </p>

              </button>

            ))}

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer className="bg-[#071521] text-white">

        <div className="max-w-[1280px] mx-auto px-6 py-6">

          <div className="flex items-center justify-between">

            <p className="text-[11px] text-gray-500">
              © 2026 Smart Municipality
            </p>

            <p className="text-[11px] text-gray-600">
              Digital Citizen Services
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default CitizenDashboard;