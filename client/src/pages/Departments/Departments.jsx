import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaRoad,
  FaTrash,
  FaTint,
  FaLightbulb,
  FaWater,
  FaHeartbeat,
  FaArrowRight,
  FaClipboardList,
} from "react-icons/fa";

function Departments() {
  const navigate = useNavigate();

  const departments = [
    {
      name: "Road & Transport",
      icon: <FaRoad />,
      description:
        "Handles potholes, damaged roads, traffic-related civic issues and road maintenance.",
      complaints: [
        "Potholes",
        "Road Damage",
        "Traffic Issues",
      ],
    },

    {
      name: "Waste Management",
      icon: <FaTrash />,
      description:
        "Manages garbage collection, waste disposal and cleanliness-related complaints.",
      complaints: [
        "Garbage Overflow",
        "Waste Collection",
        "Illegal Dumping",
      ],
    },

    {
      name: "Water Supply",
      icon: <FaTint />,
      description:
        "Responsible for water supply, pipeline problems and water leakage complaints.",
      complaints: [
        "Water Leakage",
        "No Water Supply",
        "Pipeline Damage",
      ],
    },

    {
      name: "Street Light",
      icon: <FaLightbulb />,
      description:
        "Handles damaged street lights, electrical civic issues and lighting maintenance.",
      complaints: [
        "Broken Street Light",
        "Dark Streets",
        "Electrical Issues",
      ],
    },

    {
      name: "Drainage",
      icon: <FaWater />,
      description:
        "Handles drainage blockages, sewage problems and waterlogging issues.",
      complaints: [
        "Blocked Drainage",
        "Waterlogging",
        "Sewage Issues",
      ],
    },

    {
      name: "Health Services",
      icon: <FaHeartbeat />,
      description:
        "Handles public health, sanitation and health-related municipal concerns.",
      complaints: [
        "Public Health",
        "Sanitation",
        "Health Facilities",
      ],
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
                onClick={() => navigate("/services")}
                className="text-gray-300 hover:text-white"
              >
                Services
              </button>

              <button
                className="text-[#E8AA0C] font-semibold"
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
            Municipal Administration
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            Our Departments
          </h1>

          <p className="text-gray-400 mt-4 max-w-2xl leading-7">
            Find the department responsible for your civic issue.
            Our AI system can also automatically suggest the
            appropriate department when you submit a complaint.
          </p>

        </div>

      </section>


      {/* ================= DEPARTMENTS ================= */}

      <main className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {departments.map((department) => (

            <div
              key={department.name}
              className="bg-white border border-[#DCE3EA] rounded-xl p-6 hover:shadow-md hover:-translate-y-1 transition duration-200"
            >

              {/* ICON */}

              <div className="w-12 h-12 rounded-lg bg-[#10263B] text-[#E8AA0C] flex items-center justify-center text-xl">

                {department.icon}

              </div>


              {/* NAME */}

              <h2 className="text-xl font-bold text-[#0B1B2B] mt-5">
                {department.name}
              </h2>


              {/* DESCRIPTION */}

              <p className="text-sm text-gray-500 leading-6 mt-3">
                {department.description}
              </p>


              {/* COMPLAINT TYPES */}

              <div className="mt-5">

                <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                  Handles
                </p>

                <div className="flex flex-wrap gap-2 mt-3">

                  {department.complaints.map((item) => (

                    <span
                      key={item}
                      className="text-xs bg-[#F5F7FA] border border-[#E1E6EB] text-gray-600 px-3 py-1.5 rounded-full"
                    >
                      {item}
                    </span>

                  ))}

                </div>

              </div>


              {/* ACTION */}

              <button
                onClick={() => navigate("/register-complaint")}
                className="mt-6 w-full flex items-center justify-center gap-2 border border-[#E8AA0C] text-[#A97400] py-2.5 rounded-lg font-semibold hover:bg-[#FFF8E6] transition"
              >

                Report an Issue

                <FaArrowRight className="text-xs" />

              </button>

            </div>

          ))}

        </div>


        {/* ================= AI SECTION ================= */}

        <section className="mt-12 bg-[#10263B] rounded-2xl p-8 md:p-10 text-white">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

            <div className="flex gap-5">

              <div className="w-12 h-12 rounded-xl bg-[#E8AA0C] text-[#0B1B2B] flex items-center justify-center text-xl shrink-0">

                <FaClipboardList />

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Not sure which department to choose?
                </h2>

                <p className="text-gray-400 text-sm leading-6 mt-2 max-w-xl">
                  Don't worry. Describe your civic issue and our
                  AI system will analyse it and suggest the
                  appropriate department automatically.
                </p>

              </div>

            </div>


            <button
              onClick={() => navigate("/ai-analysis")}
              className="bg-[#E8AA0C] text-[#0B1B2B] px-6 py-3 rounded-lg font-bold hover:bg-[#f3bd25] transition whitespace-nowrap"
            >
              Try AI Analysis
            </button>

          </div>

        </section>


        {/* ================= REGISTER CTA ================= */}

        <div className="text-center mt-10">

          <p className="text-gray-500 text-sm">
            Found a civic problem?
          </p>

          <button
            onClick={() => navigate("/register-complaint")}
            className="mt-3 bg-[#E8AA0C] text-[#0B1B2B] px-7 py-3 rounded-lg font-bold hover:bg-[#f3bd25] transition"
          >
            Register a Complaint
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

export default Departments;