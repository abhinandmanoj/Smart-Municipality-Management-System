import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaUser,
  FaRoad,
  FaTrash,
  FaTint,
  FaLightbulb,
  FaWater,
  FaHeartbeat,
  FaTree,
  FaArrowRight,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

function Departments() {
  const navigate = useNavigate();

  /* =====================================================
     DEPARTMENTS DATA
  ===================================================== */

  const departments = [
    {
      icon: <FaRoad />,
      name: "Road & Transport",
      shortName: "Roads",
      description:
        "Handles potholes, damaged roads, traffic-related issues, footpaths and public transportation concerns.",
      services: [
        "Pothole & road damage",
        "Footpath problems",
        "Traffic issues",
        "Road maintenance",
      ],
      complaints: 24,
    },

    {
      icon: <FaTrash />,
      name: "Waste Management",
      shortName: "Waste",
      description:
        "Responsible for garbage collection, waste disposal, overflowing bins and cleanliness of public areas.",
      services: [
        "Garbage overflow",
        "Waste collection",
        "Illegal dumping",
        "Public cleanliness",
      ],
      complaints: 18,
    },

    {
      icon: <FaTint />,
      name: "Water Supply",
      shortName: "Water",
      description:
        "Manages water supply problems, leakages, pipeline damage and other public water-related issues.",
      services: [
        "Water leakage",
        "Pipeline damage",
        "Water supply",
        "Drainage complaints",
      ],
      complaints: 12,
    },

    {
      icon: <FaLightbulb />,
      name: "Electrical Department",
      shortName: "Electrical",
      description:
        "Handles street lights, public electrical infrastructure and lighting-related complaints.",
      services: [
        "Street light failure",
        "Damaged electrical poles",
        "Public lighting",
        "Electrical hazards",
      ],
      complaints: 9,
    },

    {
      icon: <FaWater />,
      name: "Drainage & Sewage",
      shortName: "Drainage",
      description:
        "Responsible for blocked drains, sewage overflow, flooding and drainage infrastructure.",
      services: [
        "Blocked drains",
        "Sewage overflow",
        "Flooding",
        "Drain maintenance",
      ],
      complaints: 15,
    },

    {
      icon: <FaHeartbeat />,
      name: "Public Health",
      shortName: "Health",
      description:
        "Manages public health concerns, sanitation issues and health-related municipal services.",
      services: [
        "Sanitation issues",
        "Public health concerns",
        "Mosquito control",
        "Food hygiene",
      ],
      complaints: 7,
    },

    {
      icon: <FaTree />,
      name: "Parks & Public Spaces",
      shortName: "Parks",
      description:
        "Maintains public parks, playgrounds, trees and other community spaces.",
      services: [
        "Tree-related issues",
        "Park maintenance",
        "Playground damage",
        "Public spaces",
      ],
      complaints: 6,
    },
  ];

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  const goToRegisterComplaint = () => {
    navigate("/register-complaint");
  };

  const goToMyComplaints = () => {
    navigate("/my-complaints");
  };

  const goToNotifications = () => {
    navigate("/notifications");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0B1B2B]">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="h-[68px] flex items-center justify-between">

            {/* =================================================
                LOGO
            ================================================= */}

            <div
              onClick={goToDashboard}
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


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <div className="hidden lg:flex items-center gap-2 ml-auto mr-6">

              {/* HOME */}

              <button
                type="button"
                onClick={goToDashboard}
                className="px-5 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Home
              </button>


              {/* REGISTER COMPLAINT */}

              <button
                type="button"
                onClick={goToRegisterComplaint}
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Register Complaint
              </button>


              {/* MY COMPLAINTS */}

              <button
                type="button"
                onClick={goToMyComplaints}
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                My Complaints
              </button>


              {/* DEPARTMENTS - ACTIVE */}

              <button
                type="button"
                onClick={() => navigate("/departments")}
                className="px-4 py-2.5 rounded-md bg-[#E8AA0C] text-[#0B1B2B] text-[14px] font-bold"
              >
                Departments
              </button>


              {/* NOTIFICATIONS */}

              <button
                type="button"
                onClick={goToNotifications}
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                Notifications
              </button>

            </div>


            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="flex items-center gap-3 shrink-0">

              {/* NOTIFICATION */}

              <button
                type="button"
                onClick={goToNotifications}
                className="relative w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white"
                title="Notifications"
              >

                <FaBell className="text-[15px]" />

                <span className="absolute top-0 right-0 w-[16px] h-[16px] rounded-full bg-[#E8AA0C] text-[#0B1B2B] text-[9px] font-bold flex items-center justify-center">
                  3
                </span>

              </button>


              {/* PROFILE */}

              <button
                type="button"
                onClick={goToProfile}
                className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center hover:bg-white/15 transition"
                title="Profile"
              >

                <FaUser className="text-[#E8AA0C] text-[13px]" />

              </button>


              {/* LOGOUT */}

              <button
                type="button"
                onClick={handleLogout}
                className="text-gray-300 hover:text-white text-[14px] ml-1"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </nav>


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="py-9">

            <div className="text-[#E8AA0C] text-[12px] font-bold uppercase tracking-[0.18em]">
              Citizen Portal
            </div>

            <h1 className="text-[38px] md:text-[42px] font-bold leading-tight mt-3">
              Municipal Departments
            </h1>

            <p className="text-gray-400 text-[14px] mt-3 max-w-3xl leading-6">
              Find the right municipal department for your civic issue.
              Our AI-powered complaint system can also automatically
              identify and route your complaint to the appropriate department.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="max-w-[1280px] mx-auto px-6 py-7">


        {/* =================================================
            DEPARTMENT INTRO
        ================================================= */}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">

          <div>

            <div className="text-[#A97400] text-[12px] font-bold uppercase tracking-[0.16em]">
              Our Departments
            </div>

            <h2 className="text-[30px] font-semibold mt-2">
              Find the right service
            </h2>

            <p className="text-[14px] text-gray-500 mt-2">
              Select a department to understand what services it handles.
            </p>

          </div>


          <div className="text-[13px] text-gray-500">
            {departments.length} Departments
          </div>

        </div>


        {/* =================================================
            DEPARTMENT GRID
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-7">

          {departments.map((department, index) => (

            <DepartmentCard
              key={index}
              department={department}
              onClick={goToRegisterComplaint}
            />

          ))}

        </div>


        {/* =================================================
            CONTACT SECTION
        ================================================= */}

        <section className="mt-10">

          <div className="text-center">

            <div className="text-[#A97400] text-[12px] font-bold uppercase tracking-[0.16em]">
              Need Assistance?
            </div>

            <h2 className="text-[30px] font-semibold mt-2">
              Contact Municipal Services
            </h2>

            <p className="text-[14px] text-gray-500 mt-2">
              For urgent assistance, you can contact the municipality directly.
            </p>

          </div>


          {/* =================================================
              CONTACT CARDS
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto mt-7">

            <ContactCard
              icon={<FaPhone />}
              title="Municipality Helpline"
              value="+91 1800 000 000"
              text="Available during working hours"
            />


            <ContactCard
              icon={<FaEnvelope />}
              title="Email Support"
              value="support@smartmunicipality.gov"
              text="For general citizen assistance"
            />

          </div>

        </section>

      </main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="bg-[#071521] text-white mt-8">

        <div className="max-w-[1280px] mx-auto px-6 py-6">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

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


/* =====================================================
   DEPARTMENT CARD
===================================================== */

function DepartmentCard({ department, onClick }) {
  return (
    <div className="bg-white border border-[#DCE3EA] rounded-lg overflow-hidden hover:shadow-sm transition">

      {/* =================================================
          CARD TOP
      ================================================= */}

      <div className="p-6">

        <div className="flex items-start justify-between">

          {/* ICON */}

          <div className="w-11 h-11 rounded-lg bg-[#0B1B2B] text-[#E8AA0C] flex items-center justify-center">
            {department.icon}
          </div>


          {/* ACTIVE COMPLAINTS */}

          <span className="text-[10px] bg-[#F5F7FA] text-gray-500 px-2.5 py-1 rounded-full">
            {department.complaints} active
          </span>

        </div>


        {/* NAME */}

        <h3 className="text-[21px] font-semibold text-[#0B1B2B] mt-5">
          {department.name}
        </h3>


        {/* DESCRIPTION */}

        <p className="text-[12px] text-gray-500 leading-5 mt-2 min-h-[60px]">
          {department.description}
        </p>

      </div>


      {/* =================================================
          SERVICES
      ================================================= */}

      <div className="border-t border-[#E8ECF0] px-6 py-5">

        <div className="text-[10px] uppercase tracking-[0.12em] text-gray-400 font-bold">
          Services
        </div>


        <div className="mt-3 space-y-2">

          {department.services.map((service, index) => (

            <div
              key={index}
              className="flex items-center gap-2 text-[12px] text-gray-600"
            >

              <span className="w-1.5 h-1.5 rounded-full bg-[#E8AA0C] shrink-0" />

              {service}

            </div>

          ))}

        </div>


        {/* REGISTER COMPLAINT BUTTON */}

        <button
          type="button"
          onClick={onClick}
          className="w-full mt-5 h-[42px] border border-[#DCE3EA] rounded-md text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-[#0B1B2B] hover:text-white transition"
        >

          Register Complaint

          <FaArrowRight className="text-[9px] text-[#A97400]" />

        </button>

      </div>

    </div>
  );
}


/* =====================================================
   CONTACT CARD
===================================================== */

function ContactCard({
  icon,
  title,
  value,
  text,
}) {
  return (
    <div className="bg-white border border-[#DCE3EA] rounded-lg p-6 flex items-start gap-4">

      {/* ICON */}

      <div className="w-10 h-10 rounded-lg bg-[#FFF8E6] text-[#A97400] flex items-center justify-center shrink-0">
        {icon}
      </div>


      {/* CONTENT */}

      <div>

        <p className="text-[11px] text-gray-400 uppercase font-bold">
          {title}
        </p>

        <p className="font-bold text-[14px] mt-1">
          {value}
        </p>

        <p className="text-[10px] text-gray-400 mt-1">
          {text}
        </p>

      </div>

    </div>
  );
}


export default Departments;