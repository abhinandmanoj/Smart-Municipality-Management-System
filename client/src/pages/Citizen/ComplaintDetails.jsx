import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaUser,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaUserTie,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaImage,
  FaShieldAlt,
} from "react-icons/fa";

function ComplaintDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // =================================================
  // GET COMPLAINT ID FROM URL
  // =================================================

  const complaintId = searchParams.get("id");

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =================================================
  // FETCH COMPLAINT
  // =================================================

  useEffect(() => {
    const fetchComplaint = async () => {
      if (!complaintId) {
        setError("Complaint ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/complaints/${complaintId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to load complaint."
          );
        }

        // Backend may return:
        // { complaint: {...} }
        // OR { data: {...} }
        // OR directly {...}

        const actualComplaint =
          data?.complaint ||
          data?.data ||
          data;

        setComplaint(actualComplaint);
      } catch (err) {
        console.error("Complaint details error:", err);

        setError(
          err.message ||
            "Unable to load complaint details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [complaintId]);

  // =================================================
  // LOGOUT
  // =================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // =================================================
  // LOADING
  // =================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-center">

          <div className="w-12 h-12 border-4 border-[#E8AA0C]/20 border-t-[#E8AA0C] rounded-full animate-spin mx-auto" />

          <p className="text-[#0B1B2B] font-semibold mt-4">
            Loading complaint details...
          </p>

        </div>
      </div>
    );
  }

  // =================================================
  // ERROR
  // =================================================

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] text-[#0B1B2B]">

        {/* NAVBAR */}

        <nav className="bg-[#0B1B2B] text-white">

          <div className="max-w-[1280px] mx-auto px-6">

            <div className="h-[68px] flex items-center justify-between">

              <div
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-3 cursor-pointer"
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

            </div>

          </div>

        </nav>

        {/* ERROR */}

        <main className="max-w-4xl mx-auto px-6 py-16">

          <div className="bg-white border border-[#DCE3EA] rounded-xl p-10 text-center">

            <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <FaExclamationTriangle />
            </div>

            <h2 className="text-xl font-bold mt-5">
              Unable to Load Complaint
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              {error || "Complaint not found."}
            </p>

            <button
              onClick={() => navigate("/my-complaints")}
              className="mt-6 bg-[#0B1B2B] text-white px-6 py-3 rounded-lg text-sm font-bold"
            >
              Back to My Complaints
            </button>

          </div>

        </main>

      </div>
    );
  }

  // =================================================
  // NORMALIZE DATA
  // =================================================

  const title =
    complaint.title ||
    complaint.complaintTitle ||
    "Complaint";

  const category =
    complaint.category ||
    complaint.department ||
    "Not Assigned";

  const description =
    complaint.description ||
    complaint.details ||
    "No description provided.";

  const location =
    complaint.location ||
    complaint.address ||
    "Location not provided";

  const priority =
    complaint.priority ||
    "Medium";

  const status =
    complaint.status ||
    "Pending";

  const officer =
    complaint.officer ||
    complaint.assignedOfficer ||
    `${category} Officer`;

  const id =
    complaint._id ||
    complaint.id ||
    complaintId;

  // =================================================
  // DATE
  // =================================================

  const rawDate =
    complaint.createdAt ||
    complaint.created_at ||
    complaint.date ||
    complaint.submittedAt;

  let formattedDate = "Date not available";

  if (rawDate) {
    const parsedDate = new Date(rawDate);

    if (!isNaN(parsedDate.getTime())) {
      formattedDate = parsedDate.toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } else {
      formattedDate = rawDate;
    }
  }

  // =================================================
  // DISPLAY REFERENCE ID
  // =================================================

  const referenceId =
    complaint.referenceId ||
    complaint.complaintId ||
    `CMP${String(id).slice(-4).toUpperCase()}`;

  // =================================================
  // STATUS HELPERS
  // =================================================

  const normalizedStatus =
    String(status).toLowerCase();

  const isAccepted =
    normalizedStatus === "accepted" ||
    normalizedStatus === "assigned" ||
    normalizedStatus === "in progress";

  const isCompleted =
    normalizedStatus === "completed" ||
    normalizedStatus === "resolved" ||
    normalizedStatus === "closed";

  const isRejected =
    normalizedStatus === "rejected" ||
    normalizedStatus === "declined" ||
    normalizedStatus === "cancelled";

  // =================================================
  // PAGE
  // =================================================

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
              className="flex items-center gap-3 cursor-pointer"
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

            <div className="hidden lg:flex items-center gap-1">

              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2.5 rounded-md text-sm text-gray-300 hover:text-white hover:bg-white/5"
              >
                Home
              </button>

              <button
                onClick={() => navigate("/register-complaint")}
                className="px-4 py-2.5 rounded-md text-sm text-gray-300 hover:text-white hover:bg-white/5"
              >
                Register Complaint
              </button>

              <button
                onClick={() => navigate("/my-complaints")}
                className="px-4 py-2.5 rounded-md bg-[#E8AA0C] text-[#0B1B2B] text-sm font-bold"
              >
                My Complaints
              </button>

              <button
                onClick={() => navigate("/departments")}
                className="px-4 py-2.5 rounded-md text-sm text-gray-300 hover:text-white hover:bg-white/5"
              >
                Departments
              </button>

              <button
                onClick={() => navigate("/notifications")}
                className="px-4 py-2.5 rounded-md text-sm text-gray-300 hover:text-white hover:bg-white/5"
              >
                Notifications
              </button>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-3">

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
                onClick={() => navigate("/profile")}
                className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center"
              >
                <FaUser className="text-[#E8AA0C] text-[13px]" />
              </button>

              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white text-sm ml-1"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </nav>

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6 py-9">

          <button
            onClick={() => navigate("/my-complaints")}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-xs mb-6"
          >
            <FaArrowLeft />
            Back to My Complaints
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">

            <div>

              <p className="text-[#E8AA0C] text-xs font-bold uppercase tracking-widest">
                Complaint Details
              </p>

              <h1 className="text-3xl md:text-4xl font-bold mt-2">
                {title}
              </h1>

              <p className="text-gray-400 text-sm mt-3">
                Reference ID:{" "}
                <span className="text-white font-semibold">
                  {referenceId}
                </span>
              </p>

            </div>

            <StatusBadge status={status} />

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="max-w-[1180px] mx-auto px-6 py-8">

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <div className="lg:col-span-2 space-y-6">

            {/* ================================================= */}
            {/* COMPLAINT INFORMATION */}
            {/* ================================================= */}

            <section className="bg-white border border-[#DCE3EA] rounded-xl p-6 md:p-7">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-lg bg-[#FFF8E6] text-[#A97400] flex items-center justify-center">
                  <FaClipboardList />
                </div>

                <div>

                  <h2 className="font-bold text-xl">
                    Complaint Information
                  </h2>

                  <p className="text-xs text-gray-400">
                    Details provided when the complaint was submitted.
                  </p>

                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-6">

                <InfoItem
                  icon={<FaClipboardList />}
                  label="Department"
                  value={category}
                />

                <InfoItem
                  icon={<FaCalendarAlt />}
                  label="Submitted On"
                  value={formattedDate}
                />

                <InfoItem
                  icon={<FaMapMarkerAlt />}
                  label="Location"
                  value={location}
                />

                <InfoItem
                  icon={<FaExclamationTriangle />}
                  label="Priority"
                  value={priority}
                />

              </div>

              <div className="border-t border-[#E8ECF0] mt-7 pt-6">

                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Description
                </p>

                <p className="text-sm text-gray-600 leading-7 mt-3">
                  {description}
                </p>

              </div>

            </section>

            {/* ================================================= */}
            {/* COMPLAINT IMAGE (citizen-uploaded evidence photo)  */}
            {/* ================================================= */}

            {complaint?.image && (

              <section className="bg-white border border-[#DCE3EA] rounded-xl p-6 md:p-7">

                <div className="flex items-center gap-3 mb-6">

                  <div className="w-10 h-10 rounded-lg bg-[#FFF8E6] text-[#A97400] flex items-center justify-center">
                    <FaImage />
                  </div>

                  <div>
                    <h2 className="font-bold text-xl">
                      Complaint Image
                    </h2>
                    <p className="text-xs text-gray-400">
                      Photo uploaded when the complaint was submitted.
                    </p>
                  </div>

                </div>

                <img
                  src={complaint.image}
                  alt="Complaint evidence"
                  className="w-full max-h-80 object-contain rounded-lg border border-[#DCE3EA]"
                />

                <a
                  href={complaint.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-xs text-[#A97400] hover:underline font-semibold"
                >
                  <FaImage /> View Full Image
                </a>

              </section>

            )}

            {/* ================================================= */}
            {/* COMPLAINT PROGRESS */}
            {/* ================================================= */}

            <section className="bg-white border border-[#DCE3EA] rounded-xl p-6 md:p-7">

              <div className="flex items-center gap-3 mb-7">

                <div className="w-10 h-10 rounded-lg bg-[#0B1B2B] text-[#E8AA0C] flex items-center justify-center">
                  <FaClock />
                </div>

                <div>

                  <h2 className="font-bold text-xl">
                    Complaint Progress
                  </h2>

                  <p className="text-xs text-gray-400">
                    Track the progress of your complaint.
                  </p>

                </div>

              </div>

              <div>

                {/* REGISTERED */}

                <TimelineItem
                  active={true}
                  icon={<FaCheckCircle />}
                  title="Complaint Registered"
                  date={formattedDate}
                  text="Your complaint has been successfully registered."
                />

                {/* DEPARTMENT REVIEW */}

                <TimelineItem
                  active={
                    isAccepted ||
                    isCompleted
                  }
                  icon={<FaClipboardList />}
                  title="Department Review"
                  date={
                    isAccepted ||
                    isCompleted
                      ? "Completed"
                      : "Pending"
                  }
                  text={
                    isAccepted ||
                    isCompleted
                      ? `Complaint reviewed by ${category}.`
                      : "Complaint is waiting for department review."
                  }
                />

                {/* OFFICER ASSIGNMENT */}

                <TimelineItem
                  active={
                    isAccepted ||
                    isCompleted
                  }
                  icon={<FaUserTie />}
                  title="Officer Assignment"
                  date={
                    isAccepted ||
                    isCompleted
                      ? "Assigned"
                      : "Pending"
                  }
                  text={
                    isAccepted ||
                    isCompleted
                      ? `Complaint assigned to ${category}.`
                      : "Complaint is waiting for officer assignment."
                  }
                />

                {/* RESOLUTION */}

                <TimelineItem
                  active={isCompleted}
                  last={true}
                  icon={
                    isCompleted
                      ? <FaCheckCircle />
                      : <FaClock />
                  }
                  title={
                    isCompleted
                      ? "Complaint Resolved"
                      : isRejected
                      ? "Complaint Closed"
                      : "Resolution Pending"
                  }
                  date={
                    isCompleted
                      ? "Completed"
                      : "Currently"
                  }
                  text={
                    isCompleted
                      ? "The complaint has been resolved."
                      : isRejected
                      ? "This complaint is no longer active."
                      : "The municipal department is working on the reported issue."
                  }
                />

              </div>

            </section>


            {/* ================================================= */}
            {/* RESOLUTION PROOF (shown when resolved with photo)  */}
            {/* ================================================= */}

            {(complaint?.completionProofImage || complaint?.completionProof?.image) && (

              <section className="bg-white border border-[#DCE3EA] rounded-xl p-6 md:p-7">

                <div className="flex items-center gap-3 mb-6">

                  <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <h2 className="font-bold text-xl">
                      Resolution Proof
                    </h2>
                    <p className="text-xs text-gray-400">
                      Completion proof provided by the officer.
                    </p>
                  </div>

                </div>


                {/* PROOF IMAGE */}

                <div className="mb-5">

                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Completion Proof Photo
                  </p>

                  <img
                    src={complaint.completionProofImage || complaint.completionProof?.image}
                    alt="Completion proof"
                    className="w-full max-h-80 object-contain rounded-lg border border-[#DCE3EA]"
                  />

                  <a
                    href={complaint.completionProofImage || complaint.completionProof?.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-xs text-[#A97400] hover:underline font-semibold"
                  >
                    <FaImage /> View Full Image
                  </a>

                </div>


                {/* OFFICER REMARKS */}

                {complaint?.resolutionNotes && (

                  <div>

                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Completion Remarks
                    </p>

                    <p className="text-sm text-gray-700 leading-6 mt-2 bg-gray-50 rounded-lg p-4 border border-[#E8ECF0]">
                      {complaint.resolutionNotes}
                    </p>

                  </div>

                )}

              </section>

            )}

          </div>

          {/* ================================================= */}
          {/* RIGHT */}
          {/* ================================================= */}

          <aside className="space-y-6">

            {/* ================================================= */}
            {/* CURRENT STATUS */}
            {/* ================================================= */}

            <section className="bg-white border border-[#DCE3EA] rounded-xl p-6">

              <p className="text-[#A97400] text-xs font-bold uppercase tracking-widest">
                Current Status
              </p>

              <div className="flex items-center gap-3 mt-5">

                <div className="w-11 h-11 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">

                  {isCompleted ? (
                    <FaCheckCircle />
                  ) : (
                    <FaClock />
                  )}

                </div>

                <div>

                  <h3 className="font-bold">
                    {status}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">

                    {isCompleted
                      ? "Complaint resolved"
                      : isRejected
                      ? "Complaint closed"
                      : "Awaiting resolution"}

                  </p>

                </div>

              </div>

              <div className="border-t border-[#E8ECF0] mt-5 pt-5">

                <p className="text-[10px] text-gray-400">
                  Estimated response
                </p>

                <p className="font-bold text-sm mt-1">

                  {isCompleted
                    ? "Resolved"
                    : "Within 2–3 working days"}

                </p>

              </div>

            </section>

            {/* ================================================= */}
            {/* ASSIGNED DEPARTMENT */}
            {/* ================================================= */}

            <section className="bg-white border border-[#DCE3EA] rounded-xl p-6">

              <p className="text-[#A97400] text-xs font-bold uppercase tracking-widest">
                Assigned Department
              </p>

              <div className="flex items-center gap-3 mt-5">

                <div className="w-11 h-11 rounded-lg bg-[#0B1B2B] text-[#E8AA0C] flex items-center justify-center">
                  <FaUserTie />
                </div>

                <div>

                  <h3 className="font-bold text-sm">
                    {category}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    Municipal Officer
                  </p>

                </div>

              </div>

              <p className="text-xs text-gray-500 leading-5 mt-5">
                {officer}
              </p>

            </section>

            {/* ================================================= */}
            {/* LOCATION */}
            {/* ================================================= */}

            <section className="bg-white border border-[#DCE3EA] rounded-xl overflow-hidden">

              <div className="h-40 bg-[#E9EEF2] flex items-center justify-center">

                <div className="text-center px-5">

                  <FaMapMarkerAlt className="text-[#A97400] text-3xl mx-auto" />

                  <p className="font-bold text-sm mt-3">
                    {location}
                  </p>

                  <p className="text-[10px] text-gray-400 mt-1">
                    Complaint Location
                  </p>

                </div>

              </div>

              <div className="p-5">

                <p className="text-xs text-gray-500">
                  Reported location
                </p>

                <p className="font-semibold text-sm mt-1">
                  {location}
                </p>

              </div>

            </section>

            {/* ================================================= */}
            {/* ACTIONS */}
            {/* ================================================= */}

            <button
              onClick={() => navigate("/my-complaints")}
              className="w-full border border-[#DCE3EA] bg-white rounded-lg py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              Back to Complaints
            </button>

            <button
              onClick={() => navigate("/register-complaint")}
              className="w-full bg-[#0B1B2B] text-white rounded-lg py-3 text-sm font-bold hover:bg-[#14283b]"
            >
              Register Another Complaint
            </button>

          </aside>

        </div>

      </main>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

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
/* STATUS BADGE */
/* ================================================= */

function StatusBadge({ status }) {
  const normalized = String(status).toLowerCase();

  let classes =
    "bg-yellow-400/10 text-[#E8AA0C] border-yellow-400/20";

  if (
    normalized === "completed" ||
    normalized === "resolved"
  ) {
    classes =
      "bg-green-400/10 text-green-500 border-green-400/20";
  }

  if (
    normalized === "rejected" ||
    normalized === "declined" ||
    normalized === "cancelled"
  ) {
    classes =
      "bg-red-400/10 text-red-500 border-red-400/20";
  }

  return (
    <span
      className={`w-fit px-4 py-2 rounded-full border text-xs font-bold ${classes}`}
    >
      {status}
    </span>
  );
}

/* ================================================= */
/* INFO ITEM */
/* ================================================= */

function InfoItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="w-9 h-9 rounded-lg bg-[#F5F7FA] text-[#A97400] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>

      <div>

        <p className="text-[10px] text-gray-400 uppercase font-bold">
          {label}
        </p>

        <p className="text-sm font-semibold mt-1">
          {value}
        </p>

      </div>

    </div>
  );
}

/* ================================================= */
/* TIMELINE ITEM */
/* ================================================= */

function TimelineItem({
  active,
  last,
  icon,
  title,
  date,
  text,
}) {
  return (
    <div className="relative flex gap-4 pb-7">

      {!last && (
        <div
          className={`absolute left-[15px] top-8 w-[2px] h-full ${
            active
              ? "bg-[#E8AA0C]"
              : "bg-[#DCE3EA]"
          }`}
        />
      )}

      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
          active
            ? "bg-[#FFF8E6] text-[#A97400]"
            : "bg-[#F1F3F5] text-gray-400"
        }`}
      >
        <span className="text-xs">
          {icon}
        </span>
      </div>

      <div>

        <div className="flex flex-wrap items-center gap-2">

          <h3 className="font-bold text-sm">
            {title}
          </h3>

          <span className="text-[9px] text-gray-400">
            {date}
          </span>

        </div>

        <p className="text-xs text-gray-500 leading-5 mt-1">
          {text}
        </p>

      </div>

    </div>
  );
}

export default ComplaintDetails;