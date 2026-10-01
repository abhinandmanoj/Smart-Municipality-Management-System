import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaUserShield,
  FaSignOutAlt,
  FaClipboardList,
  FaArrowLeft,
  FaTag,
  FaLandmark,
  FaMapMarkerAlt,
  FaExclamationCircle,
  FaClock,
  FaSyncAlt,
  FaImage,
  FaCheckCircle,
} from "react-icons/fa";

function ComplaintDetails() {
  const navigate = useNavigate();

  // IMPORTANT:
  // App.jsx uses /admin/complaints/:id
  // Therefore we must use "id" here.
  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newStatus, setNewStatus] = useState("Pending");
  const [newDepartment, setNewDepartment] =
    useState("Not Assigned");

  const [updating, setUpdating] = useState(false);

  // NEW: Admin proof review state
  const [adminReviewNote, setAdminReviewNote] =
    useState("");
  const [adminReviewDoing, setAdminReviewDoing] =
    useState(false);

  // =========================================================
  // FETCH COMPLAINT
  // =========================================================

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/complaints"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch complaints."
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to load complaints."
        );
      }

      const complaints = result.data || [];

      // Find complaint using multiple possible IDs
      const foundComplaint = complaints.find(
        (item) => {
          const possibleIds = [
            item.complaintId,
            item.complaintNumber,
            item.referenceId,
            item._id,
            item.id,
          ];

          return possibleIds.some(
            (possibleId) =>
              possibleId &&
              String(possibleId).toLowerCase() ===
                String(id).toLowerCase()
          );
        }
      );

      if (!foundComplaint) {
        setComplaint(null);
        setError("Complaint Not Found");
        return;
      }

      console.log(
        "Complaint loaded:",
        foundComplaint
      );

      setComplaint(foundComplaint);

      setNewStatus(
        foundComplaint.status || "Pending"
      );

      setNewDepartment(
        foundComplaint.department ||
          foundComplaint.assignedDepartment ||
          "Not Assigned"
      );
    } catch (err) {
      console.error(
        "Complaint details error:",
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

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // =========================================================
  // UPDATE STATUS + DEPARTMENT
  // =========================================================

  const handleUpdate = async () => {
    const databaseId =
      complaint?._id || complaint?.id;

    if (!databaseId) {
      alert(
        "Complaint database ID not found."
      );
      return;
    }

    if (
      !newDepartment ||
      newDepartment === "Not Assigned"
    ) {
      alert(
        "Please assign a department first."
      );
      return;
    }

    try {
      setUpdating(true);

      console.log(
        "Updating complaint:",
        databaseId
      );

      console.log(
        "Department:",
        newDepartment
      );

      console.log(
        "Status:",
        newStatus
      );

      const response = await fetch(
        `http://localhost:5000/api/complaints/${databaseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
            department: newDepartment,
            assignedDepartment: newDepartment,
          }),
        }
      );

      const result = await response.json();

      console.log(
        "Update response:",
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to update complaint."
        );
      }

      const updatedComplaint =
        result.data || {
          ...complaint,
          status: newStatus,
          department: newDepartment,
          assignedDepartment:
            newDepartment,
        };

      setComplaint(
        updatedComplaint
      );

      setNewStatus(
        updatedComplaint.status ||
          newStatus
      );

      setNewDepartment(
        updatedComplaint.department ||
          updatedComplaint.assignedDepartment ||
          newDepartment
      );

      alert(
        "Complaint updated successfully."
      );
    } catch (err) {
      console.error(
        "Update complaint error:",
        err
      );

      alert(
        err.message ||
          "Unable to update complaint."
      );
    } finally {
      setUpdating(false);
    }
  };


  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    // If backend sends an object
    if (typeof image === "object") {
      image =
        image.url ||
        image.path ||
        image.filename ||
        image.file ||
        "";

      if (!image) {
        return "";
      }
    }

    image = String(image).trim();

    if (!image) {
      return "";
    }

    // Base64 image
    if (
      image.startsWith("data:image/")
    ) {
      return image;
    }

    // Full URL
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Remove localhost if backend accidentally
    // returns it as a relative path
    if (
      image.startsWith(
        "http://localhost:5000/"
      )
    ) {
      return image;
    }

    // Windows path
    image = image.replaceAll("\\", "/");

    // Remove ./ from beginning
    image = image.replace(
      /^\.\/+/,
      ""
    );

    // If backend returns /uploads/...
    if (image.startsWith("/")) {
      return `http://localhost:5000${image}`;
    }

    // If backend returns uploads/...
    return `http://localhost:5000/${image}`;
  };

  // =========================================================
  // GET IMAGE FROM COMPLAINT
  // =========================================================

  const getComplaintImage = () => {
    if (!complaint) {
      return "";
    }

    return (
      complaint.image ||
      complaint.imageUrl ||
      complaint.photo ||
      complaint.photoUrl ||
      complaint.imagePath ||
      complaint.photoPath ||
      complaint.attachment ||
      complaint.attachmentUrl ||
      ""
    );
  };

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "resolved") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (value === "in progress") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (value === "assigned") {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }

    if (value === "rejected") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  // =========================================================
  // PRIORITY CLASS
  // =========================================================

  const getPriorityClass = (priority) => {
    const value = String(
      priority || ""
    ).toLowerCase();

    if (value === "high") {
      return "bg-red-50 text-red-600 border-red-200";
    }

    if (value === "low") {
      return "bg-green-50 text-green-600 border-green-200";
    }

    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">

        <nav className="bg-[#0B1B2B] text-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="h-[68px] flex items-center">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] flex items-center justify-center">
                  <FaBuilding className="text-[#0B1B2B]" />
                </div>

                <div>
                  <div className="text-[18px] font-bold">
                    Smart Municipality
                  </div>

                  <div className="text-[10px] text-gray-400">
                    Administration Portal
                  </div>
                </div>

              </div>

            </div>
          </div>
        </nav>

        <div className="min-h-[500px] flex items-center justify-center">

          <div className="text-center">

            <div
              className="
                w-10
                h-10
                border-4
                border-[#E8AA0C]/20
                border-t-[#E8AA0C]
                rounded-full
                animate-spin
                mx-auto
              "
            />

            <p className="mt-4 text-gray-500 text-sm">
              Loading complaint...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!complaint) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">

        <nav className="bg-[#0B1B2B] text-white">

          <div className="max-w-[1280px] mx-auto px-6">

            <div className="h-[68px] flex items-center">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] flex items-center justify-center">
                  <FaBuilding className="text-[#0B1B2B]" />
                </div>

                <div>
                  <div className="text-[18px] font-bold">
                    Smart Municipality
                  </div>

                  <div className="text-[10px] text-gray-400">
                    Administration Portal
                  </div>
                </div>

              </div>

            </div>

          </div>

        </nav>

        <div className="min-h-[500px] flex items-center justify-center">

          <div className="text-center">

            <FaClipboardList className="text-5xl text-gray-300 mx-auto" />

            <h1 className="text-3xl text-[#0B1B2B] mt-5">
              {error || "Complaint Not Found"}
            </h1>

            <button
              onClick={() =>
                navigate(
                  "/admin/complaints"
                )
              }
              className="
                mt-6
                px-6
                py-3
                bg-[#0B1B2B]
                text-white
                rounded-md
                text-sm
                font-bold
              "
            >
              Back to Complaints
            </button>

          </div>

        </div>

      </div>
    );
  }

  const rawImage =
    getComplaintImage();

  const imageUrl =
    getImageUrl(rawImage);

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0B1B2B]">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="h-[68px] flex items-center justify-between">

            {/* LOGO */}

            <div
              onClick={() =>
                navigate(
                  "/admin/dashboard"
                )
              }
              className="
                flex
                items-center
                gap-3
                cursor-pointer
              "
            >

              <div
                className="
                  w-10
                  h-10
                  rounded-lg
                  bg-[#E8AA0C]
                  flex
                  items-center
                  justify-center
                "
              >
                <FaBuilding className="text-[#0B1B2B]" />
              </div>

              <div>

                <div className="text-[18px] font-bold">
                  Smart Municipality
                </div>

                <div className="text-[10px] text-gray-400">
                  Administration Portal
                </div>

              </div>

            </div>

            {/* NAVIGATION */}

            <div className="hidden lg:flex items-center gap-1 ml-auto mr-6">

              <button
                onClick={() =>
                  navigate(
                    "/admin/dashboard"
                  )
                }
                className="
                  px-4
                  py-2.5
                  rounded-md
                  text-[14px]
                  text-gray-300
                  hover:text-white
                  hover:bg-white/5
                "
              >
                Dashboard
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/admin/complaints"
                  )
                }
                className="
                  px-5
                  py-2.5
                  rounded-md
                  bg-[#E8AA0C]
                  text-[#0B1B2B]
                  text-[14px]
                  font-bold
                "
              >
                Complaints
              </button>

              {/* USERS REMOVED */}

              <button
                onClick={() =>
                  navigate(
                    "/admin/departments"
                  )
                }
                className="
                  px-4
                  py-2.5
                  rounded-md
                  text-[14px]
                  text-gray-300
                  hover:text-white
                  hover:bg-white/5
                "
              >
                Departments
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/admin/analytics"
                  )
                }
                className="
                  px-4
                  py-2.5
                  rounded-md
                  text-[14px]
                  text-gray-300
                  hover:text-white
                  hover:bg-white/5
                "
              >
                <span className="flex items-center gap-2">
                  <span className="text-[#E8AA0C]">
                    🤖
                  </span>
                  AI Analytics
                </span>
              </button>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  navigate(
                    "/admin/notifications"
                  )
                }
                className="
                  relative
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  text-gray-300
                  hover:text-white
                "
              >

                <FaBell className="text-[15px]" />

                <span
                  className="
                    absolute
                    top-0
                    right-0
                    w-[16px]
                    h-[16px]
                    rounded-full
                    bg-[#E8AA0C]
                    text-[#0B1B2B]
                    text-[9px]
                    font-bold
                    flex
                    items-center
                    justify-center
                  "
                >
                  5
                </span>

              </button>

              <button
                onClick={() =>
                  navigate(
                    "/admin/profile"
                  )
                }
                className="
                  w-9
                  h-9
                  rounded-md
                  bg-white/10
                  flex
                  items-center
                  justify-center
                "
              >
                <FaUserShield className="text-[#E8AA0C]" />
              </button>

              <button
                onClick={handleLogout}
                className="
                  text-gray-300
                  hover:text-white
                  text-[13px]
                  flex
                  items-center
                  gap-2
                "
              >
                Logout
                <FaSignOutAlt className="text-xs" />
              </button>

            </div>

          </div>

        </div>

      </nav>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="py-[30px]">

            <div
              className="
                text-[#E8AA0C]
                text-[12px]
                font-bold
                uppercase
                tracking-[0.18em]
              "
            >
              Administration Portal
            </div>

            <h1
              className="
                text-[36px]
                md:text-[40px]
                font-bold
                leading-tight
                mt-2
              "
            >
              Complaint Details
            </h1>

            <p className="text-gray-400 text-[14px] mt-2">
              Review complete information about this citizen complaint.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-[1180px] mx-auto px-6 py-6">

        {/* BACK */}

        <button
          onClick={() =>
            navigate(
              "/admin/complaints"
            )
          }
          className="
            flex
            items-center
            gap-2
            text-[#B47D00]
            font-semibold
            text-[14px]
            mb-5
            hover:text-[#0B1B2B]
          "
        >
          <FaArrowLeft />
          Back to Complaints
        </button>

        {/* ===================================================
            COMPLAINT HEADER
        =================================================== */}

        <section
          className="
            bg-white
            border
            border-[#DCE3EA]
            rounded-xl
            overflow-hidden
          "
        >

          <div
            className="
              px-5
              py-5
              flex
              flex-col
              md:flex-row
              md:items-center
              justify-between
              gap-4
            "
          >

            <div className="flex items-center gap-4">

              <div
                className="
                  w-12
                  h-12
                  rounded-lg
                  bg-[#0B1B2B]
                  text-[#E8AA0C]
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <FaClipboardList />
              </div>

              <div>

                <h2
                  className="
                    text-[25px]
                    md:text-[30px]
                    font-semibold
                    text-[#0B1B2B]
                  "
                >
                  {complaint.title ||
                    complaint.subject ||
                    "Citizen Complaint"}
                </h2>

                <p className="text-[13px] text-gray-400 mt-1">
                  #
                  {complaint.complaintId ||
                    complaint.complaintNumber ||
                    complaint._id ||
                    "N/A"}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2">

              <span
                className={`
                  px-4
                  py-2
                  rounded-full
                  border
                  text-[11px]
                  font-bold
                  ${getPriorityClass(
                    complaint.priority
                  )}
                `}
              >
                {complaint.priority ||
                  "Medium"}
              </span>

              <span
                className={`
                  px-4
                  py-2
                  rounded-full
                  border
                  text-[11px]
                  font-bold
                  ${getStatusClass(
                    complaint.status
                  )}
                `}
              >
                {complaint.status ||
                  "Pending"}
              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            TWO COLUMNS
        =================================================== */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-5
            mt-5
          "
        >

          {/* COMPLAINT INFORMATION */}

          <section
            className="
              bg-white
              border
              border-[#DCE3EA]
              rounded-xl
              overflow-hidden
            "
          >

            <div
              className="
                px-5
                py-4
                border-b
                border-[#E8ECF0]
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  w-10
                  h-10
                  rounded-lg
                  bg-[#FFF6D9]
                  text-[#E8AA0C]
                  flex
                  items-center
                  justify-center
                "
              >
                <FaClipboardList />
              </div>

              <h2 className="text-[24px] font-semibold">
                Complaint Information
              </h2>

            </div>

            <div className="p-5">

              <DetailRow
                icon={<FaTag />}
                label="Category"
                value={
                  complaint.category ||
                  "Other"
                }
              />

              <DetailRow
                icon={<FaLandmark />}
                label="Department"
                value={
                  complaint.department ||
                  complaint.assignedDepartment ||
                  "Not Assigned"
                }
              />

              <DetailRow
                icon={<FaMapMarkerAlt />}
                label="Location"
                value={
                  complaint.location ||
                  "Location not provided"
                }
              />

              <DetailRow
                icon={<FaExclamationCircle />}
                label="Priority"
                value={
                  complaint.priority ||
                  "Medium"
                }
              />

              <DetailRow
                icon={<FaClock />}
                label="Status"
                value={
                  complaint.status ||
                  "Pending"
                }
              />

            </div>

          </section>

          {/* DESCRIPTION */}

          <section
            className="
              bg-white
              border
              border-[#DCE3EA]
              rounded-xl
              overflow-hidden
            "
          >

            <div
              className="
                px-5
                py-4
                border-b
                border-[#E8ECF0]
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  w-10
                  h-10
                  rounded-lg
                  bg-[#FFF6D9]
                  text-[#E8AA0C]
                  flex
                  items-center
                  justify-center
                "
              >
                <FaClipboardList />
              </div>

              <h2 className="text-[24px] font-semibold">
                Complaint Description
              </h2>

            </div>

            <div className="p-5 min-h-[150px]">

              <p
                className="
                  text-[14px]
                  text-[#334155]
                  leading-7
                "
              >
                {complaint.description ||
                  "No description provided."}
              </p>

            </div>

          </section>

        </div>

        {/* ===================================================
            PHOTO
        =================================================== */}

        <section
          className="
            bg-white
            border
            border-[#DCE3EA]
            rounded-xl
            overflow-hidden
            mt-5
          "
        >

          <div
            className="
              px-5
              py-4
              border-b
              border-[#E8ECF0]
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-lg
                bg-[#FFF6D9]
                text-[#E8AA0C]
                flex
                items-center
                justify-center
              "
            >
              <FaImage />
            </div>

            <div>

              <h2 className="text-[24px] font-semibold">
                Complaint Photo
              </h2>

              <p className="text-[11px] text-gray-400 mt-1">
                Photo provided by the citizen
              </p>

            </div>

          </div>

          <div className="p-5">

            {imageUrl ? (

              <div className="rounded-lg overflow-hidden border border-[#DCE3EA] bg-[#F8FAFC]">

                <img
                  src={imageUrl}
                  alt="Citizen complaint"
                  className="
                    w-full
                    max-h-[520px]
                    object-contain
                    mx-auto
                    block
                  "
                  onLoad={() => {
                    console.log(
                      "Complaint image loaded:",
                      imageUrl
                    );
                  }}
                  onError={(e) => {
                    console.error(
                      "Image failed:",
                      imageUrl
                    );

                    e.currentTarget.style.display =
                      "none";

                    const parent =
                      e.currentTarget.parentElement;

                    if (parent) {
                      parent.innerHTML = `
                        <div class="min-h-[300px] flex flex-col items-center justify-center text-gray-400 text-center p-6">
                          <div style="font-size:42px;">🖼️</div>
                          <p style="margin-top:12px;">
                            Unable to load complaint photo.
                          </p>
                          <p style="margin-top:6px;font-size:12px;">
                            Please check that the image exists in the backend uploads folder.
                          </p>
                        </div>
                      `;
                    }
                  }}
                />

              </div>

            ) : (

              <div
                className="
                  min-h-[280px]
                  border
                  border-dashed
                  border-[#DCE3EA]
                  rounded-lg
                  bg-[#F8FAFC]
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                "
              >

                <FaImage className="text-5xl text-gray-300" />

                <p className="text-gray-500 text-sm mt-4">
                  No photo provided by the citizen.
                </p>

              </div>

            )}

          </div>

        </section>




        {/* ===================================================
            RESOLUTION PROOF (shown when completion proof photo exists)
        =================================================== */}

        {(complaint?.completionProofImage || complaint?.completionProof?.image) && (
          <section
            className="
              bg-white
              border
              border-[#DCE3EA]
              rounded-xl
              overflow-hidden
              mt-5
            "
          >
            <div
              className="
                px-5
                py-4
                border-b
                border-[#E8ECF0]
                flex
                items-center
                gap-3
              "
            >
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <FaCheckCircle />
              </div>

              <div>
                <h2 className="text-[20px] font-semibold">
                  Resolution Proof
                </h2>
                <p className="text-[11px] text-gray-400">
                  Photo uploaded by the officer upon resolution
                </p>
              </div>
            </div>

            <div className="p-5">
              <div className="rounded-lg overflow-hidden border border-[#DCE3EA] bg-[#F8FAFC]">
                <img
                  src={complaint.completionProofImage || complaint.completionProof?.image}
                  alt="Resolution proof"
                  className="
                    w-full
                    max-h-[520px]
                    object-contain
                    mx-auto
                    block
                  "
                />
              </div>

              {complaint?.resolutionNotes && (
                <div className="mt-4">
                  <p className="text-[11px] text-gray-500 uppercase font-bold">
                    Resolution Notes
                  </p>
                  <p className="text-sm text-gray-700 leading-6 mt-1 bg-gray-50 rounded-lg p-3 border border-[#E8ECF0]">
                    {complaint.resolutionNotes}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ===================================================
            STATUS MANAGEMENT
        =================================================== */}

        <section
          className="
            bg-white
            border
            border-[#DCE3EA]
            rounded-xl
            overflow-hidden
            mt-5
          "
        >

          <div
            className="
              px-5
              py-4
              border-b
              border-[#E8ECF0]
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-lg
                bg-[#FFF6D9]
                text-[#E8AA0C]
                flex
                items-center
                justify-center
              "
            >
              <FaSyncAlt />
            </div>

            <h2 className="text-[24px] font-semibold">
              Complaint Management
            </h2>

          </div>

          <div className="p-5">

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-4
              "
            >

              {/* DEPARTMENT */}

              <div>

                <label
                  className="
                    block
                    text-[12px]
                    text-gray-500
                    font-semibold
                    mb-2
                  "
                >
                  Assign Department
                </label>

                <select
                  value={newDepartment}
                  onChange={(e) =>
                    setNewDepartment(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    h-[46px]
                    border
                    border-[#DCE3EA]
                    rounded-md
                    px-4
                    text-[13px]
                    bg-white
                    outline-none
                    focus:border-[#E8AA0C]
                  "
                >

                  <option value="Not Assigned">
                    Not Assigned
                  </option>

                  <option value="Roads & Transport">
                    Roads & Transport
                  </option>

                  <option value="Sanitation">
                    Sanitation
                  </option>

                  <option value="Water Supply">
                    Water Supply
                  </option>

                  <option value="Electrical">
                    Electrical
                  </option>

                  <option value="Health">
                    Health
                  </option>

                  <option value="Drainage">
                    Drainage
                  </option>

                  <option value="Public Works">
                    Public Works
                  </option>

                </select>

              </div>

              {/* STATUS */}

              <div>

                <label
                  className="
                    block
                    text-[12px]
                    text-gray-500
                    font-semibold
                    mb-2
                  "
                >
                  Update Status
                </label>

                <select
                  value={newStatus}
                  onChange={(e) =>
                    setNewStatus(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    h-[46px]
                    border
                    border-[#DCE3EA]
                    rounded-md
                    px-4
                    text-[13px]
                    bg-white
                    outline-none
                    focus:border-[#E8AA0C]
                  "
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Assigned">
                    Assigned
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>

                </select>

              </div>

            </div>

            {/* UPDATE BUTTON */}

            <button
              onClick={handleUpdate}
              disabled={updating}
              className="
                mt-5
                w-full
                md:w-auto
                px-7
                h-[44px]
                rounded-md
                bg-[#0B1B2B]
                text-white
                text-[13px]
                font-bold
                flex
                items-center
                justify-center
                gap-2
                hover:bg-[#142B40]
                disabled:opacity-50
              "
            >

              {updating ? (
                <>
                  <FaSyncAlt className="animate-spin" />
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

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-[#071521] text-white mt-8">

        <div className="max-w-[1280px] mx-auto px-6 py-5">

          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-between
              gap-2
            "
          >

            <p className="text-[11px] text-gray-500">
              © 2026 Smart Municipality
            </p>

            <p className="text-[11px] text-gray-600">
              Administration Management System
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

// =========================================================
// DETAIL ROW
// =========================================================

function DetailRow({
  icon,
  label,
  value,
}) {
  return (
    <div
      className="
        flex
        gap-4
        py-4
        border-b
        border-[#EEF1F4]
        last:border-b-0
      "
    >

      <div
        className="
          w-9
          h-9
          rounded-lg
          bg-[#FFF6D9]
          text-[#E8AA0C]
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[11px] text-gray-400">
          {label}
        </p>

        <p
          className="
            text-[14px]
            font-semibold
            text-[#0B1B2B]
            mt-1
            break-words
          "
        >
          {value}
        </p>

      </div>

    </div>
  );
}

export default ComplaintDetails;