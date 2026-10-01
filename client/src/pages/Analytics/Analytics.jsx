import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaChartLine,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaUsers,
  FaArrowLeft,
} from "react-icons/fa";

function Analytics() {
  const navigate = useNavigate();

  const monthlyData = [
    { month: "Jan", complaints: 42 },
    { month: "Feb", complaints: 55 },
    { month: "Mar", complaints: 48 },
    { month: "Apr", complaints: 67 },
    { month: "May", complaints: 73 },
    { month: "Jun", complaints: 61 },
    { month: "Jul", complaints: 82 },
    { month: "Aug", complaints: 76 },
  ];

  const departments = [
    {
      name: "Road & Transport",
      complaints: 124,
      percentage: 82,
    },
    {
      name: "Waste Management",
      complaints: 98,
      percentage: 65,
    },
    {
      name: "Water Supply",
      complaints: 76,
      percentage: 51,
    },
    {
      name: "Street Light",
      complaints: 61,
      percentage: 41,
    },
    {
      name: "Drainage",
      complaints: 48,
      percentage: 32,
    },
  ];

  const maxComplaints = Math.max(
    ...monthlyData.map((item) => item.complaints)
  );

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
                className="text-[#E8AA0C] font-semibold"
              >
                Analytics
              </button>

              <button
                onClick={() => navigate("/my-complaints")}
                className="text-gray-300 hover:text-white"
              >
                My Complaints
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


      {/* ================= HEADER ================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-7xl mx-auto px-6 py-14">

          <button
            onClick={() => navigate("/services")}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6"
          >
            <FaArrowLeft />
            Back to Services
          </button>

          <p className="text-[#E8AA0C] text-sm font-semibold uppercase tracking-widest">
            Municipality Insights
          </p>

          <h1 className="text-4xl font-bold mt-3">
            Civic Analytics
          </h1>

          <p className="text-gray-400 mt-3 max-w-2xl">
            Explore complaint trends, resolution performance
            and the major civic issues reported by citizens.
          </p>

        </div>

      </section>


      {/* ================= CONTENT ================= */}

      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

          <StatCard
            icon={<FaClipboardList />}
            number="486"
            label="Total Complaints"
          />

          <StatCard
            icon={<FaCheckCircle />}
            number="342"
            label="Resolved"
          />

          <StatCard
            icon={<FaClock />}
            number="96"
            label="In Progress"
          />

          <StatCard
            icon={<FaUsers />}
            number="1,248"
            label="Registered Citizens"
          />

        </div>


        {/* MAIN ANALYTICS */}

        <div className="grid lg:grid-cols-3 gap-6 mt-7">

          {/* COMPLAINT TREND */}

          <div className="lg:col-span-2 bg-white border border-[#DCE3EA] rounded-xl p-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-bold text-[#0B1B2B]">
                  Complaint Trend
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Complaints registered over the last 8 months
                </p>

              </div>

              <div className="w-10 h-10 rounded-lg bg-[#10263B] text-[#E8AA0C] flex items-center justify-center">
                <FaChartLine />
              </div>

            </div>


            {/* BAR CHART */}

            <div className="mt-10 h-64 flex items-end justify-between gap-3">

              {monthlyData.map((item) => {

                const height =
                  (item.complaints / maxComplaints) * 100;

                return (
                  <div
                    key={item.month}
                    className="flex-1 h-full flex flex-col items-center justify-end"
                  >

                    <span className="text-xs text-gray-500 mb-2">
                      {item.complaints}
                    </span>

                    <div
                      className="w-full max-w-10 bg-[#E8AA0C] rounded-t-md hover:bg-[#D89A00] transition"
                      style={{
                        height: `${height}%`,
                      }}
                    />

                    <span className="text-xs text-gray-400 mt-3">
                      {item.month}
                    </span>

                  </div>
                );

              })}

            </div>

          </div>


          {/* RESOLUTION */}

          <div className="bg-white border border-[#DCE3EA] rounded-xl p-6">

            <h2 className="font-bold text-[#0B1B2B]">
              Resolution Rate
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Overall complaint resolution
            </p>


            <div className="flex justify-center mt-8">

              <div className="relative w-44 h-44">

                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(#E8AA0C 0% 70%, #E9EDF1 70% 100%)",
                  }}
                />

                <div className="absolute inset-5 rounded-full bg-white flex flex-col items-center justify-center">

                  <span className="text-4xl font-bold text-[#0B1B2B]">
                    70%
                  </span>

                  <span className="text-xs text-gray-500 mt-1">
                    Resolved
                  </span>

                </div>

              </div>

            </div>


            <div className="mt-7 space-y-3">

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">
                  Resolved
                </span>

                <span className="font-semibold text-green-600">
                  342
                </span>

              </div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-500">
                  Remaining
                </span>

                <span className="font-semibold text-gray-700">
                  144
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* DEPARTMENT PERFORMANCE */}

        <div className="bg-white border border-[#DCE3EA] rounded-xl p-6 mt-6">

          <div>

            <h2 className="font-bold text-[#0B1B2B]">
              Complaints by Department
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Departments receiving the highest number of complaints
            </p>

          </div>


          <div className="mt-7 space-y-6">

            {departments.map((department) => (

              <div key={department.name}>

                <div className="flex justify-between items-center mb-2">

                  <span className="text-sm font-semibold text-gray-700">
                    {department.name}
                  </span>

                  <span className="text-sm text-gray-500">
                    {department.complaints}
                  </span>

                </div>

                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-[#E8AA0C] rounded-full"
                    style={{
                      width: `${department.percentage}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* INSIGHT */}

        <div className="bg-[#10263B] rounded-xl p-6 mt-6 text-white">

          <div className="flex gap-4">

            <div className="w-11 h-11 rounded-lg bg-[#E8AA0C] text-[#0B1B2B] flex items-center justify-center shrink-0">
              <FaChartLine />
            </div>

            <div>

              <h2 className="font-bold">
                Key Civic Insight
              </h2>

              <p className="text-gray-400 text-sm leading-6 mt-2">
                Road and transport issues currently represent
                the highest share of reported complaints.
                Improving road maintenance and response times
                could significantly improve citizen satisfaction.
              </p>

            </div>

          </div>

        </div>


        {/* CTA */}

        <div className="text-center mt-10">

          <button
            onClick={() => navigate("/register-complaint")}
            className="bg-[#E8AA0C] text-[#0B1B2B] px-7 py-3 rounded-lg font-bold hover:bg-[#f3bd25] transition"
          >
            Report a Civic Issue
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


/* ================= STAT CARD ================= */

function StatCard({ icon, number, label }) {
  return (
    <div className="bg-white border border-[#DCE3EA] rounded-xl p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-2xl font-bold text-[#0B1B2B]">
            {number}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {label}
          </p>

        </div>

        <div className="w-11 h-11 rounded-lg bg-[#10263B] text-[#E8AA0C] flex items-center justify-center">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default Analytics;