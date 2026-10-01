import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaBuilding,
  FaArrowLeft,
  FaClipboardList,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaRobot,
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaTimesCircle,
} from "react-icons/fa";

function ComplaintDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    /*
      Temporary data for UI testing.

      Later this will be replaced with:

      GET /api/complaints/:id
    */

    const demoComplaint = {
      _id: id,
      complaintId: "CMP1024",
      citizenName: "Citizen",
      email: "citizen@example.com",
      phone: "9876543210",

      category: "Road Damage",

      description:
        "There is a large pothole near the main bus stop. It is causing difficulty for vehicles and may be dangerous for pedestrians.",

      location: "Kannur Town",

      department: "Road & Transport",

      priority: "High",

      status: "In Progress",

      image: "",

      aiPrediction: {
        category: "Road Damage",
        confidence: 91,
        suggestedDepartment: "Road & Transport",
      },

      createdAt: "2026-08-08",

      updatedAt: "2026-08-09",
    };

    setComplaint(demoComplaint);
  }, [id]);

  if (!complaint) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <p className="text-gray-500">
          Loading complaint...
        </p>
      </div>
    );
  }

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
                onClick={() => navigate("/my-complaints")}
                className="text-[#E8AA0C] font-semibold"
              >
                My Complaints
              </button>

            </div>


            {/* ACTION */}

            <button
              onClick={() => navigate("/register-complaint")}
              className="bg-[#E8AA0C] text-[#0B1B2B] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#f3bd25]"
            >
              New Complaint
            </button>

          </div>

        </div>

      </nav>


      {/* ================= HEADER ================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-6xl mx-auto px-6 py-12">

          <button
            onClick={() => navigate("/my-complaints")}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6"
          >
            <FaArrowLeft />

            Back to My Complaints

          </button>


          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

            <div>

              <p className="text-[#E8AA0C] text-sm font-semibold uppercase tracking-widest">
                Complaint Details
              </p>

              <h1 className="text-3xl md:text-4xl font-bold mt-2">
                {complaint.complaintId}
              </h1>

            </div>


            <StatusBadge status={complaint.status} />

          </div>

        </div>

      </section>


      {/* ================= CONTENT ================= */}

      <main className="max-w-6xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ================= MAIN ================= */}

          <div className="lg:col-span-2 space-y-6">

            {/* COMPLAINT INFORMATION */}

            <div className="bg-white border border-[#DCE3EA] rounded-xl p-7">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-[#10263B] text-[#E8AA0C] flex items-center justify-center">

                  <FaClipboardList />

                </div>

                <h2 className="font-bold text-[#0B1B2B]">
                  Complaint Information
                </h2>

              </div>


              <div className="grid sm:grid-cols-2 gap-5 mt-7">

                <InfoItem
                  label="Category"
                  value={complaint.category}
                />

                <InfoItem
                  label="Department"
                  value={complaint.department}
                />

                <InfoItem
                  label="Priority"
                  value={complaint.priority}
                />

                <InfoItem
                  label="Location"
                  value={complaint.location}
                />

                <InfoItem
                  label="Submitted"
                  value={complaint.createdAt}
                />

                <InfoItem
                  label="Last Updated"
                  value={complaint.updatedAt}
                />

              </div>


              {/* DESCRIPTION */}

              <div className="mt-7">

                <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                  Description
                </p>

                <p className="text-gray-600 text-sm leading-7 mt-2">
                  {complaint.description}
                </p>

              </div>


              {/* IMAGE */}

              {complaint.image && (

                <div className="mt-7">

                  <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-3">
                    Uploaded Image
                  </p>

                  <img
                    src={complaint.image}
                    alt="Complaint"
                    className="rounded-xl max-h-80 object-cover"
                  />

                </div>

              )}

            </div>


            {/* ================= STATUS TIMELINE ================= */}

            <div className="bg-white border border-[#DCE3EA] rounded-xl p-7">

              <h2 className="font-bold text-[#0B1B2B]">
                Complaint Progress
              </h2>

              <div className="mt-7">

                <TimelineItem
                  title="Complaint Submitted"
                  description="Your complaint has been successfully registered."
                  date={complaint.createdAt}
                  completed={true}
                  first={true}
                />

                <TimelineItem
                  title="Complaint Assigned"
                  description={`Assigned to ${complaint.department}.`}
                  completed={true}
                />

                <TimelineItem
                  title="In Progress"
                  description="The responsible department is working on the issue."
                  completed={
                    complaint.status === "In Progress" ||
                    complaint.status === "Resolved"
                  }
                  active={complaint.status === "In Progress"}
                />

                <TimelineItem
                  title="Resolved"
                  description="The complaint has been resolved."
                  completed={complaint.status === "Resolved"}
                  last={true}
                />

              </div>

            </div>


            {/* ================= AI ANALYSIS ================= */}

            {complaint.aiPrediction && (

              <div className="bg-[#10263B] rounded-xl p-7 text-white">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] text-[#0B1B2B] flex items-center justify-center">

                    <FaRobot />

                  </div>

                  <div>

                    <h2 className="font-bold">
                      AI Analysis
                    </h2>

                    <p className="text-xs text-gray-400">
                      Automated complaint classification
                    </p>

                  </div>

                </div>


                <div className="grid sm:grid-cols-3 gap-4 mt-6">

                  <AIBox
                    label="Category"
                    value={complaint.aiPrediction.category}
                  />

                  <AIBox
                    label="Department"
                    value={complaint.aiPrediction.suggestedDepartment}
                  />

                  <AIBox
                    label="Confidence"
                    value={`${complaint.aiPrediction.confidence}%`}
                  />

                </div>

              </div>

            )}

          </div>


          {/* ================= SIDEBAR INFO ================= */}

          <div className="space-y-6">

            {/* STATUS */}

            <div className="bg-white border border-[#DCE3EA] rounded-xl p-6">

              <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
                Current Status
              </p>

              <div className="mt-4">

                <StatusBadge status={complaint.status} />

              </div>

              <p className="text-sm text-gray-500 leading-6 mt-4">

                Your complaint is currently being handled
                by the responsible municipal department.

              </p>

            </div>


            {/* CITIZEN */}

            <div className="bg-white border border-[#DCE3EA] rounded-xl p-6">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-[#10263B] text-[#E8AA0C] flex items-center justify-center">

                  <FaUser />

                </div>

                <h2 className="font-bold text-[#0B1B2B]">
                  Submitted By
                </h2>

              </div>


              <div className="mt-5 space-y-4">

                <ContactItem
                  icon={<FaUser />}
                  value={complaint.citizenName}
                />

                <ContactItem
                  icon={<FaPhone />}
                  value={complaint.phone}
                />

                <ContactItem
                  icon={<FaMapMarkerAlt />}
                  value={complaint.location}
                />

              </div>

            </div>


            {/* HELP */}

            <div className="bg-[#FFF8E6] border border-[#F3D98A] rounded-xl p-6">

              <h3 className="font-bold text-[#80651C]">
                Need Help?
              </h3>

              <p className="text-sm text-[#80651C] leading-6 mt-2">
                If the information about your complaint is
                incorrect, contact the municipality office.
              </p>

              <button
                onClick={() => navigate("/services")}
                className="mt-4 text-sm font-bold text-[#A97400]"
              >
                View Services →
              </button>

            </div>

          </div>

        </div>


        {/* BACK */}

        <div className="mt-8">

          <button
            onClick={() => navigate("/my-complaints")}
            className="flex items-center gap-2 text-sm font-semibold text-[#A97400]"
          >

            <FaArrowLeft />

            Back to My Complaints

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


/* ================= STATUS BADGE ================= */

function StatusBadge({ status }) {

  let style =
    "bg-yellow-50 text-yellow-700 border-yellow-200";

  let icon = <FaClock />;

  if (status === "Assigned") {
    style =
      "bg-purple-50 text-purple-600 border-purple-200";
    icon = <FaClipboardList />;
  }

  if (status === "In Progress") {
    style =
      "bg-blue-50 text-blue-600 border-blue-200";
    icon = <FaSpinner />;
  }

  if (status === "Resolved") {
    style =
      "bg-green-50 text-green-600 border-green-200";
    icon = <FaCheckCircle />;
  }

  if (status === "Rejected") {
    style =
      "bg-red-50 text-red-600 border-red-200";
    icon = <FaTimesCircle />;
  }

  return (
    <span
      className={`inline-flex items-center gap-2 text-sm font-semibold border px-4 py-2 rounded-full ${style}`}
    >
      {icon}
      {status}
    </span>
  );
}


/* ================= INFO ITEM ================= */

function InfoItem({ label, value }) {

  return (
    <div>

      <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
        {label}
      </p>

      <p className="text-sm font-semibold text-gray-700 mt-1">
        {value}
      </p>

    </div>
  );
}


/* ================= CONTACT ITEM ================= */

function ContactItem({ icon, value }) {

  return (
    <div className="flex items-center gap-3">

      <span className="text-[#A97400] text-sm">
        {icon}
      </span>

      <span className="text-sm text-gray-600">
        {value}
      </span>

    </div>
  );
}


/* ================= AI BOX ================= */

function AIBox({ label, value }) {

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">

      <p className="text-xs text-gray-400 uppercase">
        {label}
      </p>

      <p className="font-semibold text-sm mt-2">
        {value}
      </p>

    </div>
  );
}


/* ================= TIMELINE ================= */

function TimelineItem({
  title,
  description,
  date,
  completed,
  active,
  first,
  last,
}) {

  return (
    <div className="flex gap-4">

      {/* TIMELINE */}

      <div className="flex flex-col items-center">

        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
            completed
              ? "bg-[#E8AA0C] text-[#0B1B2B]"
              : "bg-gray-100 text-gray-400"
          }`}
        >

          {completed ? (
            <FaCheckCircle />
          ) : (
            <FaClock />
          )}

        </div>

        {!last && (
          <div
            className={`w-px h-16 ${
              completed
                ? "bg-[#E8AA0C]"
                : "bg-gray-200"
            }`}
          />
        )}

      </div>


      {/* CONTENT */}

      <div className="pb-7">

        <div className="flex flex-wrap items-center gap-3">

          <h3
            className={`font-semibold ${
              active
                ? "text-[#A97400]"
                : "text-[#0B1B2B]"
            }`}
          >
            {title}
          </h3>

          {active && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
              Current
            </span>
          )}

        </div>

        <p className="text-sm text-gray-500 mt-1">
          {description}
        </p>

        {date && (
          <p className="text-xs text-gray-400 mt-2">
            {date}
          </p>
        )}

      </div>

    </div>
  );
}

export default ComplaintDetails;