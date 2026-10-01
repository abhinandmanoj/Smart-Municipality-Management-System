import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaRobot,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaClipboardList,
  FaUserTie,
  FaSpinner,
  FaDirections,
  FaUpload,
  FaImage,
  FaShieldAlt,
} from "react-icons/fa";


/* =========================================================
   API BASE URL
========================================================= */

const API_BASE_URL =
  "http://localhost:5000/api";


/* =========================================================
   MAIN COMPONENT
========================================================= */

function OfficerComplaintDetails() {

  const navigate = useNavigate();

  const { id } = useParams();


  /* =======================================================
     STATE
  ======================================================= */

  const [complaint, setComplaint] =
    useState(null);

  const [status, setStatus] =
    useState("Assigned");

  const [officerNotes, setOfficerNotes] =
    useState("");

  const [resolutionNotes, setResolutionNotes] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  const [proofImageBase64, setProofImageBase64] =
    useState("");

  const [proofImageName, setProofImageName] =
    useState("");


  /* =======================================================
     GET COMPLAINT
  ======================================================= */

  useEffect(() => {

    const fetchComplaint = async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_BASE_URL}/complaints/${id}`
          );

        const result =
          await response.json();

        if (!response.ok) {

          throw new Error(
            result.message ||
            "Failed to load complaint."
          );

        }

        const data =
          result.data;

        setComplaint(data);

        setStatus(
          data.status || "Assigned"
        );

        setOfficerNotes(
          data.officerNotes || ""
        );

        setResolutionNotes(
          data.resolutionNotes || ""
        );

      } catch (err) {

        console.error(
          "Fetch complaint error:",
          err
        );

        setError(
          err.message ||
          "Unable to load complaint."
        );

      } finally {

        setLoading(false);

      }

    };


    if (id) {
      fetchComplaint();
    }

  }, [id]);


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/");

  };


  /* =======================================================
     UPDATE STATUS
  ======================================================= */

  const handleStatusUpdate =
    async () => {

      try {

        setSaving(true);
        setSuccess("");
        setError("");

        if (status === "Resolved" && !proofImageBase64) {
          setError("Please upload a completion proof photo before resolving the complaint.");
          setSaving(false);
          return;
        }

        const updateData = {

          status:
            status,

          officerNotes:
            officerNotes,

          resolutionNotes:
            resolutionNotes,

          ...(status === "Resolved"
            ? {
                resolvedAt:
                  new Date().toISOString(),
                completionProofImage: proofImageBase64,
              }
            : {}),

        };


        const response =
          await fetch(
            `${API_BASE_URL}/complaints/${id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  updateData
                ),
            }
          );


        const result =
          await response.json();


        if (!response.ok) {

          throw new Error(
            result.message ||
            "Failed to update complaint."
          );

        }


        setComplaint(
          result.data
        );


        setSuccess(
          "Complaint updated successfully."
        );


        setTimeout(() => {

          setSuccess("");

        }, 3000);


      } catch (err) {

        console.error(
          "Update complaint error:",
          err
        );

        setError(
          err.message ||
          "Unable to update complaint."
        );

      } finally {

        setSaving(false);

      }

    };


  /* =======================================================
     NEW — PROOF IMAGE FILE HANDLER
  ======================================================= */

  const handleProofImageChange = (e) => {

    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProofError("Image must be under 5 MB.");
      return;
    }

    setProofImageName(file.name);

    const reader = new FileReader();

    reader.onload = (ev) => {
      setProofImageBase64(ev.target.result);
      setProofError("");
    };

    reader.readAsDataURL(file);

  };


  /* =======================================================
     NEW — SUBMIT COMPLETION PROOF
  ======================================================= */

  const handleSubmitProof = async () => {

    if (!proofRemarks.trim()) {
      setProofError("Please enter completion remarks.");
      return;
    }

    if (!proofImageBase64) {
      setProofError("Please upload a proof image.");
      return;
    }

    try {

      setProofUploading(true);
      setProofError("");
      setProofSuccess("");

      const response = await fetch(
        `${API_BASE_URL}/ai/proof/${id}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            remarks:    proofRemarks,
            proofImage: proofImageBase64,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Failed to submit proof."
        );
      }

      setProofSuccess(
        "Completion proof submitted! AI verification is in progress."
      );

      // Refresh complaint to show proof data
      const refreshed = await fetch(
        `${API_BASE_URL}/complaints/${id}`
      );
      const refreshedData = await refreshed.json();
      if (refreshedData?.data) {
        setComplaint(refreshedData.data);
      }

    } catch (err) {

      console.error("Submit proof error:", err);

      setProofError(
        err.message || "Unable to submit proof."
      );

    } finally {

      setProofUploading(false);

    }

  };


  /* =======================================================
     OPEN GOOGLE MAPS
  ======================================================= */

  const handleViewMap = () => {

    if (!complaint?.location) {
      return;
    }

    const encodedLocation =
      encodeURIComponent(
        complaint.location
      );

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
      "_blank"
    );

  };


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (

      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">

        <div className="text-center">

          <FaSpinner
            className="animate-spin text-[#E8AA0C] text-4xl mx-auto"
          />

          <p className="mt-4 text-[#0B1B2B] font-semibold">
            Loading complaint...
          </p>

        </div>

      </div>

    );

  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (error && !complaint) {

    return (

      <div className="min-h-screen bg-[#F5F7FA]">

        <div className="bg-[#0B1B2B] text-white p-6">

          <button
            onClick={() =>
              navigate(
                "/officer/complaints"
              )
            }
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >

            <FaArrowLeft />

            Back to Complaints

          </button>

        </div>


        <div className="max-w-3xl mx-auto px-6 py-16">

          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">

            <FaExclamationTriangle
              className="text-red-500 text-4xl mx-auto"
            />

            <h2 className="text-xl font-bold text-red-700 mt-4">
              Complaint Not Found
            </h2>

            <p className="text-red-600 text-sm mt-2">
              {error}
            </p>

            <button
              onClick={() =>
                navigate(
                  "/officer/complaints"
                )
              }
              className="mt-6 bg-[#0B1B2B] text-white px-6 py-3 rounded-lg font-semibold"
            >
              Back to Complaints
            </button>

          </div>

        </div>

      </div>

    );

  }


  /* =======================================================
     STATUS BADGE
  ======================================================= */

  const getStatusClass = () => {

    if (
      status === "Resolved"
    ) {

      return "bg-green-500/10 border-green-400/30 text-green-300";

    }

    if (
      status === "In Progress"
    ) {

      return "bg-blue-500/10 border-blue-400/30 text-blue-300";

    }

    if (
      status === "Rejected"
    ) {

      return "bg-red-500/10 border-red-400/30 text-red-300";

    }

    return "bg-yellow-500/10 border-yellow-400/30 text-yellow-300";

  };


  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate =
    (date) => {

      if (!date) {
        return "Not available";
      }

      try {

        return new Date(
          date
        ).toLocaleString(
          "en-IN",
          {
            dateStyle: "medium",
            timeStyle: "short",
          }
        );

      } catch {

        return date;

      }

    };


  /* =======================================================
     PAGE
  ======================================================= */

  return (

    <div className="min-h-screen bg-[#F5F7FA]">


      {/* ===================================================
          NAVBAR
      =================================================== */}

      <nav className="bg-[#0B1B2B] text-white">

        <div className="max-w-7xl mx-auto px-6">

          <div className="h-20 flex items-center justify-between">


            {/* LOGO */}

            <div
              onClick={() =>
                navigate(
                  "/officer/dashboard"
                )
              }
              className="flex items-center gap-3 cursor-pointer"
            >

              <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] flex items-center justify-center">

                <FaBuilding
                  className="text-[#0B1B2B]"
                />

              </div>


              <div>

                <h1 className="font-bold text-lg">
                  Smart Municipality
                </h1>

                <p className="text-xs text-gray-400">
                  Officer Portal
                </p>

              </div>

            </div>


            {/* NAVIGATION */}

            <div className="hidden lg:flex items-center gap-7">

              <button
                onClick={() =>
                  navigate(
                    "/officer/dashboard"
                  )
                }
                className="text-gray-300 hover:text-white"
              >
                Dashboard
              </button>


              <button
                onClick={() =>
                  navigate(
                    "/officer/complaints"
                  )
                }
                className="text-white font-semibold"
              >
                Complaints
              </button>


              <button
                onClick={() =>
                  navigate(
                    "/officer/tasks"
                  )
                }
                className="text-gray-300 hover:text-white"
              >
                Tasks
              </button>


              <button
                onClick={() =>
                  navigate(
                    "/officer/notifications"
                  )
                }
                className="text-gray-300 hover:text-white"
              >
                Notifications
              </button>

            </div>


            {/* RIGHT */}

            <div className="flex items-center gap-5">

              <button
                onClick={() =>
                  navigate(
                    "/officer/notifications"
                  )
                }
                className="relative text-gray-300 hover:text-white"
              >

                <FaBell />

                <span className="absolute -top-2 -right-2 bg-[#E8AA0C] text-[#0B1B2B] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  3
                </span>

              </button>


              <button
                onClick={() =>
                  navigate(
                    "/officer/profile"
                  )
                }
                className="text-gray-300 hover:text-white"
              >

                <FaUser />

              </button>


              <button
                onClick={
                  handleLogout
                }
                className="text-gray-400 hover:text-red-400"
              >

                <FaSignOutAlt />

              </button>

            </div>

          </div>

        </div>

      </nav>


      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-7xl mx-auto px-6 py-8">


          <button
            onClick={() =>
              navigate(
                "/officer/complaints"
              )
            }
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-5"
          >

            <FaArrowLeft />

            Back to Complaints

          </button>


          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">


            <div>

              <p className="text-[#E8AA0C] text-xs font-bold uppercase tracking-widest">
                Complaint Details
              </p>


              <h1 className="text-3xl font-bold mt-2">
                {complaint?.title}
              </h1>


              <p className="text-gray-400 text-sm mt-2">
                Complaint ID: #
                {complaint?.complaintId}
              </p>

            </div>


            {/* STATUS */}

            <div className="flex items-center gap-3">

              <span className="bg-red-500/10 border border-red-400/30 text-red-300 text-xs font-bold px-4 py-2 rounded-full">
                {complaint?.priority || "Medium"} Priority
              </span>


              <span
                className={`border text-xs font-bold px-4 py-2 rounded-full ${getStatusClass()}`}
              >
                {status}
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================
          ALERTS
      =================================================== */}

      <div className="max-w-7xl mx-auto px-6">


        {success && (

          <div className="mt-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4 flex items-center gap-3">

            <FaCheckCircle />

            <p className="text-sm font-semibold">
              {success}
            </p>

          </div>

        )}


        {error && (

          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 flex items-center gap-3">

            <FaExclamationTriangle />

            <p className="text-sm font-semibold">
              {error}
            </p>

          </div>

        )}

      </div>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-3 gap-6">


          {/* =================================================
             LEFT
          ================================================= */}

          <div className="lg:col-span-2 space-y-6">


            {/* =================================================
               DESCRIPTION
            ================================================= */}

            <section className="bg-white border border-[#DCE3EA] rounded-xl">

              <div className="p-6 border-b border-[#E8ECF0]">

                <h2 className="text-xl font-bold text-[#0B1B2B]">
                  Complaint Description
                </h2>

              </div>


              <div className="p-6">

                <p className="text-gray-600 text-sm leading-7">
                  {complaint?.description}
                </p>


                <div className="grid sm:grid-cols-2 gap-4 mt-6">


                  <InfoItem
                    icon={
                      <FaClipboardList />
                    }
                    label="Category"
                    value={
                      complaint?.category
                    }
                  />


                  <InfoItem
                    icon={
                      <FaCalendarAlt />
                    }
                    label="Submitted"
                    value={
                      formatDate(
                        complaint?.createdAt
                      )
                    }
                  />


                  <InfoItem
                    icon={
                      <FaMapMarkerAlt />
                    }
                    label="Location"
                    value={
                      complaint?.location
                    }
                  />


                  <InfoItem
                    icon={
                      <FaClock />
                    }
                    label="Current Status"
                    value={status}
                  />

                </div>

              </div>

            </section>


            {/* =================================================
               LOCATION
            ================================================= */}

            <section className="bg-white border border-[#DCE3EA] rounded-xl">

              <div className="p-6 border-b border-[#E8ECF0]">

                <h2 className="text-xl font-bold text-[#0B1B2B]">
                  Complaint Location
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Visit this location to inspect and solve the complaint.
                </p>

              </div>


              <div className="p-6">

                <div className="h-64 bg-[#E9EEF3] rounded-lg flex flex-col items-center justify-center">


                  <div className="w-14 h-14 rounded-full bg-[#0B1B2B] text-[#E8AA0C] flex items-center justify-center">

                    <FaMapMarkerAlt className="text-xl" />

                  </div>


                  <p className="font-bold text-[#0B1B2B] mt-3 text-center px-4">
                    {complaint?.location}
                  </p>


                  <p className="text-xs text-gray-500 mt-2">
                    Complaint location
                  </p>


                  <button
                    onClick={
                      handleViewMap
                    }
                    className="mt-4 bg-[#0B1B2B] hover:bg-[#142B42] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2"
                  >

                    <FaDirections />

                    Go to Location

                  </button>

                </div>

              </div>

            </section>


            {/* =================================================
               COMPLAINT IMAGE
            ================================================= */}

            {complaint?.image && (

              <section className="bg-white border border-[#DCE3EA] rounded-xl">

                <div className="p-6 border-b border-[#E8ECF0]">

                  <h2 className="text-xl font-bold text-[#0B1B2B]">
                    Complaint Image
                  </h2>

                </div>


                <div className="p-6">

                  <img
                    src={complaint.image}
                    alt="Complaint"
                    className="w-full max-h-96 object-contain rounded-lg border border-[#DCE3EA]"
                  />

                </div>

              </section>

            )}


            {/* =================================================
               AI ANALYSIS
            ================================================= */}

            <section className="bg-[#FFFDF5] border border-[#F1DF9F] rounded-xl">

              <div className="p-6 border-b border-[#F1DF9F]">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] text-[#0B1B2B] flex items-center justify-center">

                    <FaRobot />

                  </div>


                  <div>

                    <h2 className="text-xl font-bold text-[#0B1B2B]">
                      AI Complaint Analysis
                    </h2>

                    <p className="text-xs text-gray-500">
                      Automatically generated analysis
                    </p>

                  </div>

                </div>

              </div>


              <div className="p-6">

                <div className="grid sm:grid-cols-3 gap-4">


                  <AIBox
                    label="AI Department"
                    value={
                      complaint?.aiPrediction?.suggestedDepartment ||
                      complaint?.department ||
                      "Not Assigned"
                    }
                  />


                  <AIBox
                    label="AI Confidence"
                    value={
                      complaint?.aiPrediction?.confidence
                        ? `${complaint.aiPrediction.confidence}%`
                        : "Not available"
                    }
                  />


                  <AIBox
                    label="Priority"
                    value={
                      complaint?.priority ||
                      "Medium"
                    }
                  />

                </div>


                <div className="mt-5 bg-white border border-[#F1DF9F] rounded-lg p-4">

                  <p className="text-xs font-bold text-[#8B6800] uppercase tracking-wide">
                    AI Classification
                  </p>

                  <p className="text-sm text-gray-600 leading-6 mt-2">

                    AI classified this complaint as{" "}

                    <strong>
                      {complaint?.aiPrediction?.category ||
                        complaint?.category}
                    </strong>

                    {" "}and suggested the{" "}

                    <strong>
                      {complaint?.aiPrediction?.suggestedDepartment ||
                        complaint?.department}
                    </strong>

                    {" "}for handling.

                  </p>

                </div>

              </div>

            </section>


            {/* =================================================
               OFFICER ACTION
            ================================================= */}

            <section className="bg-white border border-[#DCE3EA] rounded-xl">

              <div className="p-6 border-b border-[#E8ECF0]">

                <h2 className="text-xl font-bold text-[#0B1B2B]">
                  Officer Action
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Update the complaint after visiting the location.
                </p>

              </div>


              <div className="p-6">


                {/* STATUS */}

                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Complaint Status
                </label>


                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value
                    )
                  }
                  className="w-full mt-2 border border-[#DCE3EA] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E8AA0C]"
                >

                  <option value="Assigned">
                    Assigned
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>

                </select>


                {/* OFFICER NOTES */}

                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mt-6">
                  Work Notes
                </label>


                <textarea
                  value={officerNotes}
                  onChange={(e) =>
                    setOfficerNotes(
                      e.target.value
                    )
                  }
                  rows="4"
                  placeholder="Example: Visited the location and inspected the damaged road. Repair work has started..."
                  className="w-full mt-2 border border-[#DCE3EA] rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-[#E8AA0C]"
                />


                {/* RESOLUTION NOTES */}

                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mt-6">
                  Resolution Notes
                </label>


                <textarea
                  value={
                    resolutionNotes
                  }
                  onChange={(e) =>
                    setResolutionNotes(
                      e.target.value
                    )
                  }
                  rows="4"
                  placeholder="Enter how the complaint was solved..."
                  className="w-full mt-2 border border-[#DCE3EA] rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-[#E8AA0C]"
                />


                {/* NEW — SIMPLE COMPLETION PROOF PHOTO FOR EXISTING UPDATE */}

                {status === "Resolved" && (
                  <div className="mt-6 border-t border-[#E8ECF0] pt-6 mb-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Completion Proof Photo
                      <span className="text-red-500 ml-1">*</span>
                    </label>

                    <div className="mt-2">
                      <label
                        htmlFor="proof-image-input"
                        className="flex items-center gap-3 border-2 border-dashed border-[#DCE3EA] hover:border-[#E8AA0C] rounded-lg px-4 py-4 cursor-pointer transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-[#F0F4F7] text-[#A97400] flex items-center justify-center">
                          <FaImage />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0B1B2B]">
                            {proofImageName || "Click to upload proof photo"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            JPG, PNG, WEBP — max 5 MB
                          </p>
                        </div>
                      </label>
                      <input
                        id="proof-image-input"
                        type="file"
                        accept="image/*"
                        onChange={handleProofImageChange}
                        className="hidden"
                      />
                    </div>

                    {proofImageBase64 && (
                      <div className="mt-3">
                        <img
                          src={proofImageBase64}
                          alt="Proof preview"
                          className="w-full max-h-48 object-contain rounded-lg border border-[#DCE3EA]"
                        />
                      </div>
                    )}
                  </div>
                )}


                {/* UPDATE BUTTON */}

                <button
                  onClick={
                    handleStatusUpdate
                  }
                  disabled={saving}
                  className="mt-5 bg-[#E8AA0C] hover:bg-[#D99D00] disabled:opacity-60 text-[#0B1B2B] font-bold px-6 py-3 rounded-lg text-sm flex items-center gap-2"
                >

                  {saving ? (

                    <>
                      <FaSpinner className="animate-spin" />
                      Updating...
                    </>

                  ) : (

                    <>
                      <FaCheckCircle />
                      Update Complaint
                    </>

                  )}

                </button>

              </div>

            </section>

          </div>


          {/* =================================================
             RIGHT
          ================================================= */}

          <div className="space-y-6">


            {/* =================================================
               CITIZEN
            ================================================= */}

            <section className="bg-white border border-[#DCE3EA] rounded-xl">

              <div className="p-6 border-b border-[#E8ECF0]">

                <h2 className="font-bold text-[#0B1B2B]">
                  Citizen Information
                </h2>

              </div>


              <div className="p-6">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-full bg-[#0B1B2B] text-[#E8AA0C] flex items-center justify-center">

                    <FaUser />

                  </div>


                  <div>

                    <p className="font-bold text-[#0B1B2B]">
                      {complaint?.citizenName}
                    </p>

                    <p className="text-xs text-gray-400">
                      Citizen
                    </p>

                  </div>

                </div>


                <div className="mt-6 space-y-4">


                  <ContactItem
                    icon={<FaPhone />}
                    value={
                      complaint?.phone
                    }
                  />


                  <ContactItem
                    icon={
                      <FaEnvelope />
                    }
                    value={
                      complaint?.email
                    }
                  />

                </div>

              </div>

            </section>


            {/* =================================================
               ASSIGNED OFFICER
            ================================================= */}

            <section className="bg-white border border-[#DCE3EA] rounded-xl p-6">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-[#F0F4F7] text-[#0B1B2B] flex items-center justify-center">

                  <FaUserTie />

                </div>


                <div>

                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Assigned To
                  </p>


                  <p className="font-bold text-[#0B1B2B] mt-1">

                    {complaint?.assignedOfficerName ||
                      "Officer"}

                  </p>

                </div>

              </div>


              <div className="mt-5 pt-5 border-t border-[#E8ECF0]">

                <p className="text-xs text-gray-400">
                  Department
                </p>


                <p className="text-sm font-semibold text-[#0B1B2B] mt-1">

                  {complaint?.department ||
                    "Not Assigned"}

                </p>


                {complaint?.assignedOfficerEmail && (

                  <p className="text-xs text-gray-500 mt-2 break-all">

                    {complaint.assignedOfficerEmail}

                  </p>

                )}

              </div>

            </section>


            {/* =================================================
               PRIORITY
            ================================================= */}

            <section className="bg-red-50 border border-red-100 rounded-xl p-6">

              <div className="flex gap-3">

                <FaExclamationTriangle className="text-red-500 mt-1" />


                <div>

                  <h3 className="font-bold text-red-700">

                    {complaint?.priority || "Medium"} Priority Complaint

                  </h3>


                  <p className="text-xs text-red-600 leading-5 mt-2">

                    {complaint?.priority === "High"

                      ? "This complaint requires immediate attention. Please visit the location and take necessary action."

                      : "Please inspect the complaint location and take the necessary action."
                    }

                  </p>

                </div>

              </div>

            </section>


            {/* =================================================
               CURRENT STATUS
            ================================================= */}

            <section className="bg-white border border-[#DCE3EA] rounded-xl p-6">

              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Current Status
              </p>


              <p className="text-2xl font-bold text-[#0B1B2B] mt-2">
                {status}
              </p>


              {complaint?.resolvedAt && (

                <p className="text-xs text-gray-500 mt-2">

                  Resolved on{" "}

                  {formatDate(
                    complaint.resolvedAt
                  )}

                </p>

              )}

            </section>

          </div>

        </div>

      </main>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="bg-[#071521] text-white py-8 mt-10">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between gap-4">

            <div>

              <h3 className="font-bold">
                Smart Municipality
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Officer Complaint Management
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


/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  icon,
  label,
  value,
}) {

  return (

    <div className="bg-[#F8FAFC] rounded-lg p-4">

      <div className="flex items-center gap-2">

        <span className="text-[#A97400]">
          {icon}
        </span>

        <span className="text-xs text-gray-400">
          {label}
        </span>

      </div>


      <p className="text-sm font-semibold text-[#0B1B2B] mt-2">
        {value || "Not available"}
      </p>

    </div>

  );

}


/* =========================================================
   AI BOX
========================================================= */

function AIBox({
  label,
  value,
}) {

  return (

    <div className="bg-white border border-[#F1DF9F] rounded-lg p-4">

      <p className="text-[10px] uppercase font-bold text-gray-400">
        {label}
      </p>


      <p className="text-sm font-bold text-[#0B1B2B] mt-2">
        {value || "Not available"}
      </p>

    </div>

  );

}


/* =========================================================
   CONTACT ITEM
========================================================= */

function ContactItem({
  icon,
  value,
}) {

  return (

    <div className="flex items-center gap-3">

      <div className="w-8 h-8 rounded-lg bg-[#F0F4F7] text-[#A97400] flex items-center justify-center text-xs">

        {icon}

      </div>


      <p className="text-xs text-gray-600 break-all">

        {value || "Not available"}

      </p>

    </div>

  );

}


export default OfficerComplaintDetails;