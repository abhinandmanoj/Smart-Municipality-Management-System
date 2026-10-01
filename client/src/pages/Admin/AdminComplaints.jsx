import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaUserShield,
  FaSignOutAlt,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaFilter,
  FaArrowRight,
  FaSearch,
} from "react-icons/fa";

function AdminComplaints() {
  const navigate = useNavigate();

  // =================================================
  // STATE
  // =================================================

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [updatingId, setUpdatingId] = useState(null);

  // =================================================
  // FETCH COMPLAINTS
  // =================================================

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/complaints"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }

      const result = await response.json();

      if (result.success) {
        setComplaints(result.data || []);
      } else {
        console.error(
          "Failed to load complaints:",
          result.message
        );
      }
    } catch (error) {
      console.error(
        "Error loading complaints:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // =================================================
  // LOGOUT
  // =================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // =================================================
  // STATUS NORMALIZATION
  // =================================================

  const getStatus = (complaint) => {
    return complaint?.status || "Pending";
  };

  // =================================================
  // PRIORITY NORMALIZATION
  // =================================================

  const getPriority = (complaint) => {
    return complaint?.priority || "Medium";
  };

  // =================================================
  // STATISTICS
  // =================================================

  const totalComplaints = complaints.length;

  const pendingCount = complaints.filter(
    (complaint) =>
      String(getStatus(complaint)).toLowerCase() ===
      "pending"
  ).length;

  const inProgressCount = complaints.filter(
    (complaint) => {
      const status = String(
        getStatus(complaint)
      ).toLowerCase();

      return (
        status === "in progress" ||
        status === "assigned"
      );
    }
  ).length;

  const resolvedCount = complaints.filter(
    (complaint) =>
      String(getStatus(complaint)).toLowerCase() ===
      "resolved"
  ).length;

  // =================================================
  // FILTER COMPLAINTS
  // =================================================

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const title =
        complaint.title ||
        complaint.subject ||
        complaint.complaint ||
        "";

      const description =
        complaint.description || "";

      const citizen =
        complaint.name ||
        complaint.userName ||
        complaint.citizenName ||
        "";

      const email =
        complaint.email ||
        complaint.userEmail ||
        "";

      const department =
        complaint.department || "";

      const location =
        complaint.location || "";

      const matchesSearch =
        !searchText ||
        title.toLowerCase().includes(searchText) ||
        description.toLowerCase().includes(searchText) ||
        citizen.toLowerCase().includes(searchText) ||
        email.toLowerCase().includes(searchText) ||
        department.toLowerCase().includes(searchText) ||
        location.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        String(getStatus(complaint))
          .toLowerCase() ===
          statusFilter.toLowerCase();

      const matchesPriority =
        priorityFilter === "All" ||
        String(getPriority(complaint))
          .toLowerCase() ===
          priorityFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    complaints,
    search,
    statusFilter,
    priorityFilter,
  ]);

  // =================================================
  // UPDATE STATUS
  // =================================================

  const handleStatusChange = async (
    complaint,
    newStatus
  ) => {
    try {
      const id =
        complaint._id || complaint.id;

      if (!id) {
        alert("Complaint ID not found.");
        return;
      }

      setUpdatingId(id);

      const response = await fetch(
        `http://localhost:5000/api/complaints/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to update complaint"
        );
      }

      setComplaints((previous) =>
        previous.map((item) => {
          const itemId =
            item._id || item.id;

          if (
            String(itemId) ===
            String(id)
          ) {
            return {
              ...item,
              status: newStatus,
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

  // =================================================
  // UPDATE DEPARTMENT
  // =================================================

  const handleDepartmentChange = async (
    complaint,
    newDepartment
  ) => {
    try {
      const id =
        complaint._id || complaint.id;

      if (!id) {
        alert("Complaint ID not found.");
        return;
      }

      setUpdatingId(id);

      const response = await fetch(
        `http://localhost:5000/api/complaints/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            department: newDepartment,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to assign department"
        );
      }

      // Update department immediately
      setComplaints((previous) =>
        previous.map((item) => {
          const itemId =
            item._id || item.id;

          if (
            String(itemId) ===
            String(id)
          ) {
            return {
              ...item,
              department: newDepartment,
            };
          }

          return item;
        })
      );
    } catch (error) {
      console.error(
        "Department update error:",
        error
      );

      alert(
        error.message ||
          "Unable to assign department."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =================================================
  // VIEW COMPLAINT
  // =================================================

  const handleViewComplaint = (complaint) => {
    const complaintId =
      complaint.complaintId ||
      complaint.complaintNumber ||
      complaint.referenceId ||
      complaint._id ||
      complaint.id;

    if (!complaintId) {
      alert("Complaint ID not found.");
      return;
    }

    navigate(
      `/admin/complaints/${complaintId}`
    );
  };

  // =================================================
  // COMPLAINT TITLE
  // =================================================

  const getTitle = (complaint) => {
    return (
      complaint.title ||
      complaint.subject ||
      complaint.complaint ||
      "Untitled Complaint"
    );
  };

  // =================================================
  // COMPLAINT ID
  // =================================================

  const getComplaintId = (complaint) => {
    return (
      complaint.complaintId ||
      complaint.complaintNumber ||
      complaint.referenceId ||
      complaint._id ||
      complaint.id ||
      "N/A"
    );
  };

  // =================================================
  // CITIZEN NAME
  // =================================================

  const getCitizenName = (complaint) => {
    return (
      complaint.name ||
      complaint.userName ||
      complaint.citizenName ||
      "Citizen"
    );
  };

  // =================================================
  // DEPARTMENT
  // =================================================

  const getDepartment = (complaint) => {
    return (
      complaint.department ||
      complaint.assignedDepartment ||
      "Not Assigned"
    );
  };

  // =================================================
  // STATUS STYLE
  // =================================================

  const getStatusClass = (status) => {
    const value = String(status)
      .toLowerCase();

    if (value === "resolved") {
      return "bg-green-50 text-green-700";
    }

    if (value === "in progress") {
      return "bg-blue-50 text-blue-700";
    }

    if (value === "assigned") {
      return "bg-purple-50 text-purple-700";
    }

    if (value === "rejected") {
      return "bg-red-50 text-red-700";
    }

    return "bg-yellow-50 text-yellow-700";
  };

  // =================================================
  // PRIORITY STYLE
  // =================================================

  const getPriorityClass = (priority) => {
    const value = String(priority)
      .toLowerCase();

    if (value === "high") {
      return "bg-red-50 text-red-600";
    }

    if (value === "low") {
      return "bg-green-50 text-green-600";
    }

    return "bg-yellow-50 text-yellow-700";
  };

  // =================================================
  // MAIN UI
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
              onClick={() =>
                navigate("/admin/dashboard")
              }
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
                  Administration Portal
                </div>

              </div>

            </div>

            {/* NAVIGATION */}

            <div className="hidden lg:flex items-center gap-1 ml-auto mr-6">

              <button
                onClick={() =>
                  navigate("/admin/dashboard")
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
                  navigate("/admin/complaints")
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

              <button
                onClick={() =>
                  navigate("/admin/departments")
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
                Departments
              </button>

              <button
                onClick={() =>
                  navigate("/admin/analytics")
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
                <span className="flex items-center gap-2">
                  AI Analytics
                </span>
              </button>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-3 shrink-0">

              {/* NOTIFICATIONS */}

              <button
                onClick={() =>
                  navigate("/admin/notifications")
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

              {/* PROFILE */}

              <button
                onClick={() =>
                  navigate("/admin/profile")
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

                <FaUserShield className="text-[#E8AA0C] text-[14px]" />

              </button>

              {/* LOGOUT */}

              <button
                onClick={handleLogout}
                className="
                  text-gray-300
                  hover:text-white
                  text-[14px]
                  ml-1
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

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="py-[38px]">

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
              Complaint Management
            </h1>

            <p className="text-gray-400 text-[14px] mt-2">
              Review, assign and monitor citizen complaints.
            </p>

          </div>

        </div>

      </section>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="max-w-[1280px] mx-auto px-6 py-7">

        {/* ================================================= */}
        {/* STATISTICS */}
        {/* ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
          "
        >

          <ComplaintStat
            title="Total Complaints"
            value={
              loading
                ? "..."
                : totalComplaints
            }
            icon={<FaClipboardList />}
            iconClass="bg-purple-50 text-purple-600"
          />

          <ComplaintStat
            title="Pending"
            value={
              loading
                ? "..."
                : pendingCount
            }
            icon={<FaClock />}
            iconClass="bg-yellow-50 text-yellow-600"
          />

          <ComplaintStat
            title="In Progress"
            value={
              loading
                ? "..."
                : inProgressCount
            }
            icon={<FaFilter />}
            iconClass="bg-blue-50 text-blue-600"
          />

          <ComplaintStat
            title="Resolved"
            value={
              loading
                ? "..."
                : resolvedCount
            }
            icon={<FaCheckCircle />}
            iconClass="bg-green-50 text-green-600"
          />

        </div>

        {/* ================================================= */}
        {/* FILTERS */}
        {/* ================================================= */}

        <section
          className="
            bg-white
            border
            border-[#DCE3EA]
            rounded-lg
            mt-5
            p-5
          "
        >

          <div className="sm-filter-bar">

            {/* SEARCH */}

            <div className="sm-search-box flex-1">

              <FaSearch className="text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search complaint, citizen, department or location..."
                className="
                  h-[44px]
                  border
                  border-[#DCE3EA]
                  rounded-md
                  pr-4
                  text-[13px]
                  text-[#0B1B2B]
                  outline-none
                  focus:border-[#E8AA0C]
                "
              />

            </div>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="
                h-[44px]
                md:w-[180px]
                border
                border-[#DCE3EA]
                rounded-md
                px-4
                text-[13px]
                text-[#0B1B2B]
                bg-white
                outline-none
                focus:border-[#E8AA0C]
              "
            >

              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>

            </select>

            {/* PRIORITY */}

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
              className="
                h-[44px]
                md:w-[180px]
                border
                border-[#DCE3EA]
                rounded-md
                px-4
                text-[13px]
                text-[#0B1B2B]
                bg-white
                outline-none
                focus:border-[#E8AA0C]
              "
            >

              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>

            </select>

          </div>

        </section>

        {/* ================================================= */}
        {/* COMPLAINT LIST */}
        {/* ================================================= */}

        <section
          className="
            bg-white
            border
            border-[#DCE3EA]
            rounded-lg
            mt-5
            overflow-hidden
          "
        >

          {/* LIST HEADER */}

          <div
            className="
              px-5
              py-4
              border-b
              border-[#E8ECF0]
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h2 className="text-[22px] font-semibold">
                Citizen Complaints
              </h2>

              <p className="text-[12px] text-gray-400 mt-1">
                {loading
                  ? "Loading complaints..."
                  : `${filteredComplaints.length} complaints found`}
              </p>

            </div>

            <FaClipboardList
              className="text-[#E8AA0C]"
            />

          </div>

          {/* LOADING */}

          {loading && (
            <div className="px-5 py-12 text-center">

              <div className="text-gray-400 text-sm">
                Loading complaints...
              </div>

            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            filteredComplaints.length === 0 && (
              <div className="px-5 py-12 text-center">

                <FaClipboardList
                  className="
                    mx-auto
                    text-3xl
                    text-gray-300
                  "
                />

                <p className="text-gray-500 text-sm mt-3">
                  No complaints found.
                </p>

                <p className="text-gray-400 text-xs mt-1">
                  Try changing your search or filters.
                </p>

              </div>
            )}

          {/* COMPLAINTS */}

          {!loading &&
            filteredComplaints.map(
              (complaint) => {

                const id =
                  complaint._id ||
                  complaint.id;

                const status =
                  getStatus(complaint);

                const priority =
                  getPriority(complaint);

                return (
                  <div
                    key={id}
                    className="
                      px-5
                      py-5
                      border-b
                      border-[#E8ECF0]
                      last:border-b-0
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
                        gap-4
                      "
                    >

                      {/* LEFT */}

                      <div className="flex gap-4 min-w-0">

                        {/* ICON */}

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
                            shrink-0
                          "
                        >
                          <FaClipboardList />
                        </div>

                        {/* CONTENT */}

                        <div className="min-w-0">

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
                                text-[18px]
                                font-semibold
                                text-[#0B1B2B]
                              "
                            >
                              {getTitle(complaint)}
                            </h3>

                            <span
                              className="
                                text-[11px]
                                text-gray-400
                              "
                            >
                              #{getComplaintId(complaint)}
                            </span>

                          </div>

                          {/* DESCRIPTION */}

                          <p
                            className="
                              text-[12px]
                              text-gray-500
                              mt-2
                              max-w-[700px]
                              line-clamp-2
                            "
                          >
                            {complaint.description ||
                              "No description provided."}
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

                            <span className="text-[11px] text-gray-500">

                              <strong className="text-[#0B1B2B]">
                                Citizen:
                              </strong>{" "}

                              {getCitizenName(
                                complaint
                              )}

                            </span>

                            <span className="text-[11px] text-gray-500">

                              <strong className="text-[#0B1B2B]">
                                Department:
                              </strong>{" "}

                              {getDepartment(
                                complaint
                              )}

                            </span>

                            {complaint.location && (
                              <span className="text-[11px] text-gray-500">

                                <strong className="text-[#0B1B2B]">
                                  Location:
                                </strong>{" "}

                                {complaint.location}

                              </span>
                            )}

                          </div>

                        </div>

                      </div>

                      {/* ================================================= */}
                      {/* RIGHT SIDE */}
                      {/* ================================================= */}

                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                          xl:justify-end
                          shrink-0
                        "
                      >

                        {/* PRIORITY */}

                        <span
                          className={`
                            px-3
                            py-1
                            rounded-full
                            text-[10px]
                            font-bold
                            ${getPriorityClass(
                              priority
                            )}
                          `}
                        >
                          {priority}
                        </span>

                        {/* STATUS */}

                        <span
                          className={`
                            px-3
                            py-1
                            rounded-full
                            text-[10px]
                            font-bold
                            ${getStatusClass(
                              status
                            )}
                          `}
                        >
                          {status}
                        </span>

                        {/* STATUS SELECT */}

                        <select
                          value={status}
                          disabled={
                            updatingId === id
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              complaint,
                              e.target.value
                            )
                          }
                          className="
                            h-[38px]
                            border
                            border-[#DCE3EA]
                            rounded-md
                            px-3
                            text-[12px]
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

                        {/* ================================================= */}
                        {/* DEPARTMENT SELECT */}
                        {/* ================================================= */}

                        <select
                          value={
                            complaint.department &&
                            complaint.department !== ""
                              ? complaint.department
                              : "Not Assigned"
                          }
                          disabled={
                            updatingId === id
                          }
                          onChange={(e) =>
                            handleDepartmentChange(
                              complaint,
                              e.target.value
                            )
                          }
                          className="
                            h-[38px]
                            min-w-[155px]
                            border
                            border-[#DCE3EA]
                            rounded-md
                            px-3
                            text-[12px]
                            text-[#0B1B2B]
                            bg-white
                            outline-none
                            focus:border-[#E8AA0C]
                          "
                        >

                          <option value="Not Assigned">
                            Assign Department
                          </option>

                          <option value="Road & Transport">
                            Road & Transport
                          </option>

                          <option value="Waste Management">
                            Waste Management
                          </option>

                          <option value="Water Supply">
                            Water Supply
                          </option>

                          <option value="Electrical">
                            Electrical
                          </option>

                          <option value="Drainage">
                            Drainage
                          </option>

                          <option value="Health">
                            Health
                          </option>

                          <option value="Other">
                            Other
                          </option>

                        </select>

                        {/* VIEW */}

                        <button
                          onClick={() =>
                            handleViewComplaint(
                              complaint
                            )
                          }
                          className="
                            h-[38px]
                            px-4
                            rounded-md
                            bg-[#0B1B2B]
                            text-white
                            text-[12px]
                            font-bold
                            flex
                            items-center
                            gap-2
                            hover:bg-[#142B40]
                            transition
                          "
                        >

                          View

                          <FaArrowRight
                            className="text-[10px]"
                          />

                        </button>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

        </section>

      </main>

      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer className="bg-[#071521] text-white mt-8">

        <div className="max-w-[1280px] mx-auto px-6 py-6">

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
// STAT CARD
// =========================================================

function ComplaintStat({
  title,
  value,
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
        min-h-[135px]
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
            w-10
            h-10
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

    </div>
  );
}

export default AdminComplaints;