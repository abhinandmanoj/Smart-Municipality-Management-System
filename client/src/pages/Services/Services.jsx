import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaClipboardList,
  FaRobot,
  FaMapMarkedAlt,
  FaChartBar,
  FaBell,
  FaUser,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

function Services() {
  const navigate = useNavigate();

  const services = [
    {
      icon: <FaClipboardList />,
      title: "Register Complaint",
      description:
        "Report potholes, garbage, water leakage, street light issues and other civic problems.",
      button: "Register Complaint",
      path: "/register-complaint",
    },
    {
      icon: <FaCheckCircle />,
      title: "My Complaints",
      description:
        "Track your submitted complaints and check their current status.",
      button: "View Complaints",
      path: "/my-complaints",
    },
    {
      icon: <FaRobot />,
      title: "AI Analysis",
      description:
        "Use AI to identify the complaint category, priority and responsible department.",
      button: "Try AI",
      path: "/ai-analysis",
    },
    {
      icon: <FaBuilding />,
      title: "Departments",
      description:
        "Find municipal departments and understand which civic services they handle.",
      button: "View Departments",
      path: "/departments",
    },
    {
      icon: <FaMapMarkedAlt />,
      title: "Civic Locations",
      description:
        "View important municipal locations and civic service areas.",
      button: "Explore",
      path: "/locations",
    },
    {
      icon: <FaChartBar />,
      title: "Civic Analytics",
      description:
        "Explore complaint trends, resolution rates and department performance.",
      button: "View Analytics",
      path: "/analytics",
    },
    {
      icon: <FaBell />,
      title: "Notifications",
      description:
        "Stay informed about complaint assignments, progress and resolutions.",
      button: "View Notifications",
      path: "/notifications",
    },
    {
      icon: <FaUser />,
      title: "Citizen Profile",
      description:
        "View and manage your personal information and account details.",
      button: "View Profile",
      path: "/profile",
    },
  ];

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

            <div className="hidden lg:flex items-center gap-8">

              <button
                onClick={() => navigate("/")}
                className="text-gray-300 hover:text-white"
              >
                Home
              </button>

              <button
                className="text-[#E8AA0C] font-semibold"
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
                onClick={() => navigate("/analytics")}
                className="text-gray-300 hover:text-white"
              >
                Analytics
              </button>

            </div>


            {/* AUTH */}

            <div className="flex items-center gap-3">

              <button
                onClick={() => navigate("/login")}
                className="hidden sm:block text-gray-300 hover:text-white"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="bg-[#E8AA0C] text-[#0B1B2B] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#f3bd25] transition"
              >
                Register
              </button>

            </div>

          </div>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-7xl mx-auto px-6 py-16">

          <p className="text-[#E8AA0C] text-sm font-semibold uppercase tracking-widest">
            Citizen Portal
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            Municipal Services
          </h1>

          <p className="text-gray-400 mt-4 max-w-2xl leading-7">
            Access digital civic services, report problems,
            track complaints and stay connected with your municipality.
          </p>

        </div>

      </section>


      {/* ================= SERVICES ================= */}

      <main className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {services.map((service) => (

            <div
              key={service.title}
              className="bg-white border border-[#DCE3EA] rounded-xl p-6 hover:shadow-md hover:-translate-y-1 transition duration-200 flex flex-col"
            >

              {/* ICON */}

              <div className="w-11 h-11 rounded-lg bg-[#10263B] text-[#E8AA0C] flex items-center justify-center text-lg">

                {service.icon}

              </div>


              {/* TITLE */}

              <h2 className="font-bold text-[#0B1B2B] mt-5">
                {service.title}
              </h2>


              {/* DESCRIPTION */}

              <p className="text-sm text-gray-500 leading-6 mt-2 flex-1">
                {service.description}
              </p>


              {/* BUTTON */}

              <button
                onClick={() => navigate(service.path)}
                className="mt-5 flex items-center justify-between text-sm font-bold text-[#A97400] hover:text-[#805C00]"
              >

                {service.button}

                <FaArrowRight className="text-xs" />

              </button>

            </div>

          ))}

        </div>


        {/* ================= FEATURE SECTION ================= */}

        <section className="mt-12 bg-[#10263B] rounded-2xl p-8 md:p-10 text-white">

          <div className="grid md:grid-cols-2 gap-10 items-center">

            <div>

              <p className="text-[#E8AA0C] text-xs font-bold uppercase tracking-widest">
                Smart Civic Platform
              </p>

              <h2 className="text-2xl md:text-3xl font-bold mt-3">
                Report once. Track everything.
              </h2>

              <p className="text-gray-400 mt-4 leading-7">
                Our platform connects citizens with the right
                municipal department and keeps them informed
                throughout the complaint resolution process.
              </p>

              <button
                onClick={() => navigate("/register-complaint")}
                className="mt-6 bg-[#E8AA0C] text-[#0B1B2B] px-6 py-3 rounded-lg font-bold hover:bg-[#f3bd25] transition"
              >
                Report an Issue
              </button>

            </div>


            <div className="grid grid-cols-2 gap-4">

              <Feature
                number="01"
                title="Submit"
                text="Report your civic issue."
              />

              <Feature
                number="02"
                title="AI Analyse"
                text="Automatically classify it."
              />

              <Feature
                number="03"
                title="Assign"
                text="Send it to the right department."
              />

              <Feature
                number="04"
                title="Resolve"
                text="Track it until completion."
              />

            </div>

          </div>

        </section>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="bg-[#071521] text-white py-8 mt-8">

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


/* ================= FEATURE BOX ================= */

function Feature({ number, title, text }) {
  return (
    <div className="border border-white/10 rounded-xl p-5">

      <span className="text-[#E8AA0C] text-xs font-bold">
        {number}
      </span>

      <h3 className="font-bold mt-3">
        {title}
      </h3>

      <p className="text-gray-500 text-sm mt-1">
        {text}
      </p>

    </div>
  );
}

export default Services;