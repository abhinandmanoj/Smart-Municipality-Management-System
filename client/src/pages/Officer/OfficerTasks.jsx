import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaTasks,
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaSyncAlt,
  FaClipboardList,
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api/complaints";

/* =========================================================
   OFFICER TASKS
   REAL DATA FROM MONGODB
========================================================= */

function OfficerTasks() {
  const navigate = useNavigate();

  /* =========================================================
     STATE
  ========================================================= */

  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [updatingId, setUpdatingId] = useState(null);

  /* =========================================================
     LOGGED-IN OFFICER
  ========================================================= */

  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return {};
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Unable to read logged-in user:", error);
      return {};
    }
  };

  const user = getStoredUser();

  const officerName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "Officer";

  const officerEmail =
    user?.email ||
    user?.userEmail ||
    "";

  const officerDepartment =
    user?.department ||
    user?.dept ||
    user?.departmentName ||
    "";

  /* =========================================================
     FETCH REAL COMPLAINT DATA
  ========================================================= */

  const fetchComplaints = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(API_URL, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(
          `Unable to load complaints. Server returned ${response.status}.`
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || "Unable to load complaints."
        );
      }

      const data = Array.isArray(result.data)
        ? result.data
        : [];

      setComplaints(data);
    } catch (error) {
      console.error("Officer task data error:", error);

      setError(
        error.message ||
          "Unable to load task information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchComplaints();
  }, []);

  /* =========================================================
     NORMALIZE TEXT
  ========================================================= */

  const normalize = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "object") {
      return String(
        value.name ||
          value.department ||
          value.title ||
          value.email ||
          ""
      )
        .trim()
        .toLowerCase();
    }

    return String(value)
      .trim()
      .toLowerCase();
  };

  /* =========================================================
     GET DEPARTMENT
  ========================================================= */

  const getDepartment = (complaint) => {
    if (!complaint) {
      return "";
    }

    if (typeof complaint.department === "object") {
      return (
        complaint.department?.name ||
        complaint.department?.department ||
        complaint.department?.title ||
        ""
      );
    }

    return (
      complaint.department ||
      complaint.dept ||
      complaint.category ||
      ""
    );
  };

  /* =========================================================
     GET OFFICER NAME
  ========================================================= */

  const getOfficerName = (complaint) => {
    return (
      complaint?.officerName ||
      complaint?.assignedOfficer ||
      complaint?.officer?.name ||
      complaint?.assignedTo?.name ||
      complaint?.assignedOfficerName ||
      ""
    );
  };

  /* =========================================================
     GET OFFICER EMAIL
  ========================================================= */

  const getOfficerEmail = (complaint) => {
    return (
      complaint?.officerEmail ||
      complaint?.assignedOfficerEmail ||
      complaint?.officer?.email ||
      complaint?.assignedTo?.email ||
      ""
    );
  };

  /* =========================================================
     CHECK WHETHER COMPLAINT BELONGS TO OFFICER
  ========================================================= */

  const isAssignedToOfficer = (complaint) => {
    /*
      If database contains explicit officer information,
      use that first.
    */

    const complaintOfficerName =
      normalize(getOfficerName(complaint));

    const complaintOfficerEmail =
      normalize(getOfficerEmail(complaint));

    const currentOfficerName =
      normalize(officerName);

    const currentOfficerEmail =
      normalize(officerEmail);

    /*
      Match by officer email.
    */

    if (
      currentOfficerEmail &&
      complaintOfficerEmail
    ) {
      return (
        complaintOfficerEmail ===
        currentOfficerEmail
      );
    }

    /*
      Match by officer name.
    */

    if (
      currentOfficerName &&
      complaintOfficerName
    ) {
      return (
        complaintOfficerName ===
        currentOfficerName
      );
    }

    /*
      If explicit officer assignment is not stored,
      use department assignment.

      This allows your existing database structure to work
      even when complaints only contain department.
    */

    const currentDepartment =
      normalize(officerDepartment);

    const complaintDepartment =
      normalize(getDepartment(complaint));

    if (
      currentDepartment &&
      complaintDepartment
    ) {
      return (
        complaintDepartment ===
          currentDepartment ||
        complaintDepartment.includes(
          currentDepartment
        ) ||
        currentDepartment.includes(
          complaintDepartment
        )
      );
    }

    /*
      If no department is stored in the login,
      don't hide the real database complaints.
    */

    return true;
  };

  /* =========================================================
     REAL OFFICER COMPLAINTS
  ========================================================= */

  const assignedComplaints = useMemo(() => {
    return complaints.filter(
      (complaint) =>
        isAssignedToOfficer(complaint)
    );
  }, [
    complaints,
    officerName,
    officerEmail,
    officerDepartment,
  ]);

  /* =========================================================
     GET COMPLAINT ID
  ========================================================= */

  const getComplaintId = (complaint) => {
    return (
      complaint?.complaintId ||
      complaint?.complaintNumber ||
      complaint?.referenceId ||
      complaint?.id ||
      complaint?._id ||
      "N/A"
    );
  };

  /* =========================================================
     GET TITLE
  ========================================================= */

  const getTitle = (complaint) => {
    return (
      complaint?.title ||
      complaint?.subject ||
      complaint?.complaint ||
      "Untitled Complaint"
    );
  };

  /* =========================================================
     GET DESCRIPTION
  ========================================================= */

  const getDescription = (complaint) => {
    return (
      complaint?.description ||
      complaint?.details ||
      "No description available."
    );
  };

  /* =========================================================
     GET LOCATION
  ========================================================= */

  const getLocation = (complaint) => {
    const location = complaint?.location;

    if (!location) {
      return "Location not provided";
    }

    if (typeof location === "object") {
      return (
        location.address ||
        location.name ||
        location.location ||
        [
          location.street,
          location.city,
          location.district,
          location.state,
        ]
          .filter(Boolean)
          .join(", ") ||
        "Location not provided"
      );
    }

    return String(location);
  };

  /* =========================================================
     GET PRIORITY
  ========================================================= */

  const getPriority = (complaint) => {
    const priority = String(
      complaint?.priority || "Medium"
    ).trim();

    const lower = priority.toLowerCase();

    if (lower === "high") {
      return "High";
    }

    if (lower === "low") {
      return "Low";
    }

    return "Medium";
  };

  /* =========================================================
     GET STATUS
  ========================================================= */

  const getStatus = (complaint) => {
    const status = String(
      complaint?.status || "Pending"
    ).trim();

    const lower = status.toLowerCase();

    if (lower === "assigned") {
      return "Assigned";
    }

    if (
      lower === "in progress" ||
      lower === "in-progress" ||
      lower === "in_progress"
    ) {
      return "In Progress";
    }

    if (
      lower === "resolved" ||
      lower === "completed" ||
      lower === "closed"
    ) {
      return "Resolved";
    }

    return "Pending";
  };

  /* =========================================================
     GET DATE
  ========================================================= */

  const getDate = (complaint) => {
    return (
      complaint?.createdAt ||
      complaint?.created_on ||
      complaint?.submittedAt ||
      complaint?.date ||
      complaint?.updatedAt ||
      null
    );
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     STATISTICS
  ========================================================= */

  const totalTasks =
    assignedComplaints.length;

  const pendingCount =
    assignedComplaints.filter((complaint) => {
      const status =
        getStatus(complaint);

      return (
        status === "Pending" ||
        status === "Assigned"
      );
    }).length;

  const progressCount =
    assignedComplaints.filter(
      (complaint) =>
        getStatus(complaint) ===
        "In Progress"
    ).length;

  const completedCount =
    assignedComplaints.filter(
      (complaint) =>
        getStatus(complaint) ===
        "Resolved"
    ).length;

  /* =========================================================
     SEARCH + FILTER
  ========================================================= */

  const filteredComplaints =
    useMemo(() => {
      const searchText =
        search.toLowerCase().trim();

      return assignedComplaints.filter(
        (complaint) => {
          const id =
            getComplaintId(
              complaint
            );

          const title =
            getTitle(complaint);

          const description =
            getDescription(
              complaint
            );

          const location =
            getLocation(
              complaint
            );

          const department =
            getDepartment(
              complaint
            );

          const matchesSearch =
            !searchText ||
            String(id)
              .toLowerCase()
              .includes(searchText) ||
            title
              .toLowerCase()
              .includes(searchText) ||
            description
              .toLowerCase()
              .includes(searchText) ||
            location
              .toLowerCase()
              .includes(searchText) ||
            String(department)
              .toLowerCase()
              .includes(searchText);

          const status =
            getStatus(complaint);

          let matchesFilter = true;

          if (filter === "Pending") {
            matchesFilter =
              status === "Pending" ||
              status === "Assigned";
          } else if (
            filter === "In Progress"
          ) {
            matchesFilter =
              status === "In Progress";
          } else if (
            filter === "Completed"
          ) {
            matchesFilter =
              status === "Resolved";
          }

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      assignedComplaints,
      search,
      filter,
    ]);

  /* =========================================================
     UPDATE COMPLAINT STATUS
  ========================================================= */

  const updateComplaintStatus = async (
    complaint,
    selectedStatus
  ) => {
    const databaseId =
      complaint?._id ||
      complaint?.id;

    if (!databaseId) {
      alert(
        "Complaint database ID not found."
      );
      return;
    }

    /*
      Your backend uses "Resolved" rather than
      "Completed", so convert it before saving.
    */

    let backendStatus =
      selectedStatus;

    if (
      selectedStatus === "Completed"
    ) {
      backendStatus = "Resolved";
    }

    try {
      setUpdatingId(databaseId);

      const token =
        localStorage.getItem("token");

      const headers = {
        "Content-Type":
          "application/json",
      };

      if (token) {
        headers.Authorization =
          `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_URL}/${databaseId}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            status: backendStatus,
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to update complaint."
        );
      }

      /*
        Update local state immediately.
      */

      setComplaints(
        (previous) =>
          previous.map((item) => {
            const itemId =
              item?._id ||
              item?.id;

            if (
              String(itemId) ===
              String(databaseId)
            ) {
              return {
                ...item,
                status:
                  result?.data?.status ||
                  backendStatus,
              };
            }

            return item;
          })
      );

    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        error.message ||
          "Unable to update complaint status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  /* =========================================================
     OPEN COMPLAINT DETAILS
  ========================================================= */

  const openComplaint = (
    complaint
  ) => {
    const complaintId =
      complaint?.complaintId ||
      complaint?.complaintNumber ||
      complaint?.referenceId;

    if (!complaintId) {
      alert(
        "Complaint reference ID not found."
      );
      return;
    }

    /*
      IMPORTANT:
      This matches App.jsx:

      /officer/complaint-details/:id
    */

    navigate(
      `/officer/complaint-details/${complaintId}`
    );
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/");
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goTo = (path) => {
    navigate(path);
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="h-[68px] flex items-center justify-between">

            {/* LOGO */}

            <div
              onClick={() =>
                goTo(
                  "/officer/dashboard"
                )
              }
              className="flex items-center gap-3 cursor-pointer shrink-0"
            >

              <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] flex items-center justify-center">

                <FaBuilding className="text-[#0B1B2B]" />

              </div>

              <div>

                <div className="text-[18px] leading-5 font-bold">
                  Smart Municipality
                </div>

                <div className="text-[10px] text-gray-400">
                  Officer Portal
                </div>

              </div>

            </div>


            {/* NAVIGATION */}

            <div className="hidden lg:flex items-center gap-1 ml-auto mr-6">

              <button
                onClick={() =>
                  goTo(
                    "/officer/dashboard"
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
                  transition
                "
              >
                Dashboard
              </button>


              <button
                onClick={() =>
                  goTo(
                    "/officer/complaints"
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
                  transition
                "
              >
                Complaints
              </button>


              <button
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
                Tasks
              </button>


              <button
                onClick={() =>
                  goTo(
                    "/officer/notifications"
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
                  transition
                "
              >
                Notifications
              </button>

            </div>


            {/* RIGHT SIDE */}

            <div className="flex items-center gap-3 shrink-0">

              <button
                onClick={() =>
                  goTo(
                    "/officer/notifications"
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

                <FaBell />

              </button>


              <button
                onClick={() =>
                  goTo(
                    "/officer/profile"
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
                  hover:bg-white/15
                  transition
                "
              >

                <FaUser className="text-[#E8AA0C]" />

              </button>


              <button
                onClick={
                  handleLogout
                }
                className="
                  text-gray-300
                  hover:text-white
                  text-[14px]
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
          HERO
      ===================================================== */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="py-[42px]">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

              <div>

                <div
                  className="
                    text-[#E8AA0C]
                    text-[12px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                  "
                >
                  Officer Portal
                </div>


                <h1
                  className="
                    text-[36px]
                    md:text-[42px]
                    font-bold
                    leading-tight
                    mt-3
                  "
                >
                  My Tasks
                </h1>


                <p
                  className="
                    text-gray-400
                    text-[14px]
                    leading-6
                    mt-3
                    max-w-[700px]
                  "
                >
                  Track and manage municipal
                  complaints assigned to you.
                  Task information is loaded
                  directly from the municipality
                  database.
                </p>


                {/* ACTION BUTTONS */}

                <div className="flex items-center gap-3 mt-6">

                  <button
                    onClick={() =>
                      fetchComplaints(
                        true
                      )
                    }
                    disabled={refreshing}
                    className="
                      h-[44px]
                      px-5
                      bg-[#E8AA0C]
                      text-[#0B1B2B]
                      rounded-md
                      flex
                      items-center
                      gap-2
                      text-[14px]
                      font-bold
                      hover:bg-[#D99D00]
                      transition
                      disabled:opacity-60
                    "
                  >

                    <FaSyncAlt
                      className={
                        refreshing
                          ? "animate-spin"
                          : ""
                      }
                    />

                    {refreshing
                      ? "Refreshing..."
                      : "Refresh Tasks"}

                  </button>


                  <button
                    onClick={() =>
                      goTo(
                        "/officer/complaints"
                      )
                    }
                    className="
                      h-[44px]
                      px-5
                      border
                      border-gray-500
                      text-white
                      rounded-md
                      flex
                      items-center
                      gap-2
                      text-[14px]
                      font-bold
                      hover:bg-white/5
                      transition
                    "
                  >

                    <FaClipboardList />

                    View Complaints

                  </button>

                </div>

              </div>


              {/* DEPARTMENT */}

              <div
                className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-xl
                  px-5
                  py-4
                  min-w-[240px]
                "
              >

                <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                  Your Department
                </p>

                <p className="text-sm font-semibold text-white mt-1">
                  {officerDepartment ||
                    "Department not specified"}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {officerName}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (

        <div className="max-w-[1280px] mx-auto px-6 pt-6">

          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4 text-sm">

            <div className="font-bold">
              Unable to load task data
            </div>

            <div className="mt-1">
              {error}
            </div>

            <button
              onClick={() =>
                fetchComplaints()
              }
              className="
                mt-3
                text-xs
                font-bold
                underline
              "
            >
              Try Again
            </button>

          </div>

        </div>

      )}


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-[1280px] mx-auto px-6 py-[42px]">

        {/* SECTION HEADER */}

        <div>

          <div
            className="
              text-[#A97400]
              text-[12px]
              font-bold
              uppercase
              tracking-[0.16em]
            "
          >
            Task Overview
          </div>

          <h2
            className="
              text-[30px]
              md:text-[34px]
              font-semibold
              leading-tight
              mt-2
              text-[#0B1B2B]
            "
          >
            Your municipal workload
          </h2>

          <p className="text-gray-500 text-[14px] mt-2">
            Live statistics calculated from
            complaint records.
          </p>

        </div>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-5
            mt-7
          "
        >

          <TaskStat
            title="Total Tasks"
            value={
              loading
                ? "..."
                : totalTasks
            }
            description="Assigned municipal work"
            icon={<FaTasks />}
            iconClass="bg-blue-50 text-blue-600"
          />


          <TaskStat
            title="Pending"
            value={
              loading
                ? "..."
                : pendingCount
            }
            description="Tasks awaiting action"
            icon={<FaClock />}
            iconClass="bg-yellow-50 text-yellow-600"
          />


          <TaskStat
            title="In Progress"
            value={
              loading
                ? "..."
                : progressCount
            }
            description="Currently being handled"
            icon={
              <FaExclamationTriangle />
            }
            iconClass="bg-orange-50 text-orange-600"
          />


          <TaskStat
            title="Completed"
            value={
              loading
                ? "..."
                : completedCount
            }
            description="Resolved municipal work"
            icon={<FaCheckCircle />}
            iconClass="bg-green-50 text-green-600"
          />

        </div>


        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div className="bg-white border border-[#DCE3EA] rounded-xl p-5 mt-6">

          <div className="sm-filter-bar">

            <div className="sm-search-box flex-1">

              <FaSearch className="text-gray-400" />

              <input
                type="text"
                placeholder="Search complaints, locations, departments..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="
                  h-[44px]
                  border
                  border-[#DCE3EA]
                  rounded-lg
                  pr-4
                  text-sm
                  text-[#0B1B2B]
                  outline-none
                  focus:border-[#E8AA0C]
                "
              />

            </div>


            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value
                )
              }
              className="
                w-full
                lg:w-52
                h-[44px]
                border
                border-[#DCE3EA]
                rounded-lg
                px-4
                text-sm
                text-[#0B1B2B]
                outline-none
                focus:border-[#E8AA0C]
                bg-white
              "
            >

              <option value="All">All Tasks</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>

            </select>

          </div>

        </div>


        {/* =================================================
            TASK LIST
        ================================================= */}

        <div
          className="
            bg-white
            border
            border-[#DCE3EA]
            rounded-xl
            mt-6
            overflow-hidden
          "
        >

          {/* LIST HEADER */}

          <div
            className="
              p-6
              border-b
              border-[#E8ECF0]
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <div
                  className="
                    text-[#A97400]
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                  "
                >
                  Assigned Work
                </div>

                <h2
                  className="
                    text-[30px]
                    font-semibold
                    text-[#0B1B2B]
                    mt-1
                  "
                >
                  Municipal Tasks
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  {loading
                    ? "Loading..."
                    : `${filteredComplaints.length} tasks found`}
                </p>

              </div>

              <FaTasks
                className="
                  text-[#E8AA0C]
                  text-xl
                "
              />

            </div>

          </div>


          {/* LOADING */}

          {loading ? (

            <div className="py-20 text-center">

              <FaSyncAlt
                className="
                  mx-auto
                  text-3xl
                  text-[#E8AA0C]
                  animate-spin
                "
              />

              <p className="text-sm text-gray-500 mt-4">
                Loading tasks from MongoDB...
              </p>

            </div>

          ) : filteredComplaints.length >
            0 ? (

            <div className="divide-y divide-[#E8ECF0]">

              {filteredComplaints.map(
                (complaint) => (

                  <TaskCard
                    key={
                      complaint?._id ||
                      complaint?.id ||
                      getComplaintId(
                        complaint
                      )
                    }
                    complaint={
                      complaint
                    }
                    getComplaintId={
                      getComplaintId
                    }
                    getTitle={
                      getTitle
                    }
                    getDescription={
                      getDescription
                    }
                    getLocation={
                      getLocation
                    }
                    getDepartment={
                      getDepartment
                    }
                    getPriority={
                      getPriority
                    }
                    getStatus={
                      getStatus
                    }
                    getDate={
                      getDate
                    }
                    formatDate={
                      formatDate
                    }
                    updatingId={
                      updatingId
                    }
                    onStatusChange={
                      updateComplaintStatus
                    }
                    onOpen={
                      openComplaint
                    }
                  />

                )
              )}

            </div>

          ) : (

            <div className="py-20 text-center">

              <FaTasks
                className="
                  mx-auto
                  text-4xl
                  text-gray-300
                "
              />

              <h3
                className="
                  font-bold
                  text-[#0B1B2B]
                  mt-4
                "
              >
                No tasks found
              </h3>

              <p
                className="
                  text-sm
                  text-gray-400
                  mt-1
                "
              >
                {search
                  ? "Try changing your search."
                  : "There are currently no complaints assigned to you."}
              </p>

            </div>

          )}

        </div>


        {/* =================================================
            DATABASE INFORMATION
        ================================================= */}

        <div
          className="
            bg-[#FFFDF5]
            border
            border-[#F1DF9F]
            rounded-xl
            mt-6
            p-5
          "
        >

          <div className="flex items-start gap-4">

            <div
              className="
                w-10
                h-10
                rounded-lg
                bg-[#E8AA0C]
                text-[#0B1B2B]
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >

              <FaBuilding />

            </div>

            <div>

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-widest
                  font-bold
                  text-[#A97400]
                "
              >
                Live Database
              </p>

              <h3
                className="
                  font-bold
                  text-[#0B1B2B]
                  mt-1
                "
              >
                Task information is connected to
                complaint records.
              </h3>

              <p
                className="
                  text-xs
                  text-gray-500
                  mt-1
                  leading-5
                "
              >
                New complaints, status changes,
                priorities and assigned work are
                reflected automatically after
                refreshing the page.
              </p>

            </div>

          </div>

        </div>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className="
          bg-[#071521]
          text-white
          py-6
          mt-10
        "
      >

        <div className="max-w-[1280px] mx-auto px-6">

          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              justify-between
              gap-3
            "
          >

            <div>

              <p className="font-bold text-sm">
                Smart Municipality
              </p>

              <p className="text-gray-500 text-xs mt-1">
                Officer Task Management
              </p>

            </div>

            <p className="text-gray-500 text-xs">
              © 2026 Smart Municipality
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}


/* =========================================================
   TASK STAT
========================================================= */

function TaskStat({
  title,
  value,
  description,
  icon,
  iconClass,
}) {
  return (

    <div
      className="
        bg-white
        border
        border-[#DCE3EA]
        rounded-lg
        p-5
        min-h-[165px]
        hover:shadow-sm
        transition
      "
    >

      <div className="flex items-start justify-between">

        <div>

          <p
            className="
              text-[11px]
              uppercase
              tracking-wide
              text-gray-400
              font-bold
            "
          >
            {title}
          </p>

          <p
            className="
              text-[30px]
              font-bold
              text-[#0B1B2B]
              mt-2
            "
          >
            {value}
          </p>

        </div>


        <div
          className={`
            w-11
            h-11
            rounded-lg
            flex
            items-center
            justify-center
            ${iconClass}
          `}
        >
          {icon}
        </div>

      </div>


      <p
        className="
          text-[11px]
          text-gray-500
          mt-6
        "
      >
        {description}
      </p>

    </div>

  );
}


/* =========================================================
   TASK CARD
========================================================= */

function TaskCard({
  complaint,
  getComplaintId,
  getTitle,
  getDescription,
  getLocation,
  getDepartment,
  getPriority,
  getStatus,
  getDate,
  formatDate,
  updatingId,
  onStatusChange,
  onOpen,
}) {
  const priority =
    getPriority(complaint);

  const status =
    getStatus(complaint);

  const complaintId =
    getComplaintId(complaint);

  const title =
    getTitle(complaint);

  const description =
    getDescription(complaint);

  const location =
    getLocation(complaint);

  const department =
    getDepartment(complaint);

  const date =
    getDate(complaint);

  const databaseId =
    complaint?._id ||
    complaint?.id;

  const priorityClass = {
    High:
      "bg-red-50 text-red-600 border-red-200",

    Medium:
      "bg-yellow-50 text-yellow-700 border-yellow-200",

    Low:
      "bg-green-50 text-green-600 border-green-200",
  };

  const statusClass = {
    Pending:
      "bg-yellow-50 text-yellow-700",

    Assigned:
      "bg-purple-50 text-purple-700",

    "In Progress":
      "bg-blue-50 text-blue-600",

    Resolved:
      "bg-green-50 text-green-600",
  };

  return (

    <div
      className="
        p-5
        hover:bg-[#FAFBFC]
        transition
      "
    >

      <div
        className="
          flex
          flex-col
          xl:flex-row
          xl:items-center
          justify-between
          gap-5
        "
      >

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="flex gap-4 min-w-0">

          <div
            className="
              w-11
              h-11
              rounded-lg
              bg-[#0B1B2B]
              text-[#E8AA0C]
              flex
              items-center
              justify-center
              flex-shrink-0
            "
          >

            <FaTasks />

          </div>


          <div className="min-w-0">

            {/* TITLE */}

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >

              <h3
                className="
                  text-[20px]
                  font-semibold
                  text-[#0B1B2B]
                "
              >
                {title}
              </h3>

              <span
                className="
                  text-[10px]
                  font-semibold
                  text-gray-400
                "
              >
                #{complaintId}
              </span>

            </div>


            {/* DESCRIPTION */}

            <p
              className="
                text-xs
                text-gray-500
                mt-1
                max-w-[700px]
              "
            >
              {description}
            </p>


            {/* DETAILS */}

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-x-4
                gap-y-2
                mt-3
              "
            >

              {/* LOCATION */}

              <span
                className="
                  text-xs
                  text-gray-500
                  flex
                  items-center
                  gap-1
                "
              >

                <FaMapMarkerAlt className="text-[#A97400]" />

                {location}

              </span>


              {/* DEPARTMENT */}

              {department && (

                <span
                  className="
                    text-xs
                    text-gray-400
                  "
                >
                  {department}
                </span>

              )}


              {/* DATE */}

              <span
                className="
                  text-xs
                  text-gray-400
                  flex
                  items-center
                  gap-1
                "
              >

                <FaCalendarAlt />

                {formatDate(date)}

              </span>

            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT ACTIONS
        ================================================= */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
            xl:justify-end
          "
        >

          {/* PRIORITY */}

          <span
            className={`
              text-[10px]
              font-bold
              px-3
              py-1.5
              rounded-full
              border
              ${priorityClass[priority]}
            `}
          >
            {priority}
          </span>


          {/* STATUS */}

          <span
            className={`
              text-[10px]
              font-bold
              px-3
              py-1.5
              rounded-full
              ${statusClass[status]}
            `}
          >
            {status}
          </span>


          {/* STATUS SELECT */}

          {status !==
            "Resolved" && (

            <select
              value={
                status === "Assigned"
                  ? "Pending"
                  : status
              }
              disabled={
                updatingId ===
                databaseId
              }
              onChange={(e) =>
                onStatusChange(
                  complaint,
                  e.target.value
                )
              }
              className="
                border
                border-[#DCE3EA]
                rounded-lg
                px-3
                py-2
                text-xs
                outline-none
                focus:border-[#E8AA0C]
                bg-white
                disabled:opacity-50
              "
            >

              <option value="Pending">
                Pending
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>

            </select>

          )}


          {/* VIEW COMPLAINT */}

          <button
            onClick={() =>
              onOpen(
                complaint
              )
            }
            className="
              w-9
              h-9
              rounded-lg
              border
              border-[#DCE3EA]
              flex
              items-center
              justify-center
              text-gray-500
              hover:bg-[#0B1B2B]
              hover:text-[#E8AA0C]
              transition
            "
            title="View complaint details"
          >

            <FaArrowRight />

          </button>

        </div>

      </div>

    </div>

  );
}


export default OfficerTasks;