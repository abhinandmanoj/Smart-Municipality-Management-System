import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaUserCircle,
  FaSignOutAlt,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaMapMarkerAlt,
} from "react-icons/fa";

function OfficerComplaints() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  // =====================================================
  // GET LOGGED-IN OFFICER
  // =====================================================

  const getOfficer = () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      return user;
    } catch (error) {
      console.error("User data error:", error);
      return null;
    }
  };

  // =====================================================
  // FETCH COMPLAINTS
  // =====================================================

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const user = getOfficer();

      if (!user) {
        navigate("/");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/complaints"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch complaints"
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to load complaints"
        );
      }

      let data = result.data || [];

      // =================================================
      // FILTER BY OFFICER DEPARTMENT
      // =================================================

      if (
        user.role === "Officer" &&
        user.department
      ) {
        data = data.filter((complaint) => {
          return (
            complaint.department ===
              user.department ||
            complaint.assignedDepartment ===
              user.department
          );
        });
      }

      setComplaints(data);

      // =================================================
      // CALCULATE STATISTICS
      // =================================================

      const total = data.length;

      const pending = data.filter(
        (complaint) =>
          String(
            complaint.status || ""
          ).toLowerCase() === "pending"
      ).length;

      const inProgress = data.filter(
        (complaint) => {
          const status = String(
            complaint.status || ""
          ).toLowerCase();

          return (
            status === "in progress" ||
            status === "in_progress" ||
            status === "inprogress"
          );
        }
      ).length;

      const resolved = data.filter(
        (complaint) =>
          String(
            complaint.status || ""
          ).toLowerCase() === "resolved"
      ).length;

      setStats({
        total,
        pending,
        inProgress,
        resolved,
      });
    } catch (error) {
      console.error(
        "Error loading complaints:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchComplaints();
  }, []);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const goTo = (path) => {
    navigate(path);
  };

  // =====================================================
  // FILTER COMPLAINTS
  // =====================================================

  const filteredComplaints =
    complaints.filter((complaint) => {
      const searchText =
        search.toLowerCase();

      const title =
        complaint.title ||
        complaint.subject ||
        complaint.complaintTitle ||
        "";

      const category =
        complaint.category || "";

      const location =
        complaint.location || "";

      const matchesSearch =
        title
          .toLowerCase()
          .includes(searchText) ||
        category
          .toLowerCase()
          .includes(searchText) ||
        location
          .toLowerCase()
          .includes(searchText);

      const complaintStatus =
        String(
          complaint.status || ""
        ).toLowerCase();

      const selectedStatus =
        statusFilter.toLowerCase();

      let matchesStatus = true;

      if (
        statusFilter !== "All Status"
      ) {
        if (
          selectedStatus ===
          "in progress"
        ) {
          matchesStatus =
            complaintStatus ===
              "in progress" ||
            complaintStatus ===
              "in_progress" ||
            complaintStatus ===
              "inprogress";
        } else {
          matchesStatus =
            complaintStatus ===
            selectedStatus;
        }
      }

      const complaintPriority =
        String(
          complaint.priority || ""
        ).toLowerCase();

      const matchesPriority =
        priorityFilter ===
          "All Priority" ||
        complaintPriority ===
          priorityFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "";

    try {
      return new Date(
        date
      ).toLocaleDateString("en-GB");
    } catch {
      return "";
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "resolved") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (
      value === "in progress" ||
      value === "in_progress" ||
      value === "inprogress"
    ) {
      return "bg-orange-50 text-orange-700 border-orange-200";
    }

    return "bg-blue-50 text-blue-700 border-blue-200";
  };

  // =====================================================
  // PRIORITY STYLE
  // =====================================================

  const getPriorityStyle = (priority) => {
    const value = String(
      priority || ""
    ).toLowerCase();

    if (value === "high") {
      return "bg-red-50 text-red-600 border-red-200";
    }

    if (value === "medium") {
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }

    return "bg-green-50 text-green-700 border-green-200";
  };

  // =====================================================
  // COMPLAINT TITLE
  // =====================================================

  const getTitle = (complaint) => {
    return (
      complaint.title ||
      complaint.subject ||
      complaint.complaintTitle ||
      "Untitled Complaint"
    );
  };

  // =====================================================
  // COMPLAINT LOCATION
  // =====================================================

  const getLocation = (complaint) => {
    if (
      typeof complaint.location ===
      "string"
    ) {
      return complaint.location;
    }

    if (
      complaint.location?.address
    ) {
      return complaint.location.address;
    }

    return "Location not available";
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0B1B2B]">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="h-[68px] flex items-center justify-between">

            {/* LOGO */}

            <div
              onClick={() =>
                goTo("/officer/dashboard")
              }
              className="flex items-center gap-3 cursor-pointer shrink-0"
            >

              <div className="w-10 h-10 rounded-lg bg-[#F2B400] flex items-center justify-center">

                <FaBuilding className="text-[#0B1B2B]" />

              </div>

              <div>

                <div className="text-[18px] leading-5 font-bold">
                  Smart Municipality
                </div>

                <div className="text-[10px] leading-4 text-gray-400">
                  Officer Portal
                </div>

              </div>

            </div>

            {/* NAVIGATION */}

            <div className="hidden lg:flex items-center gap-1 ml-auto mr-6">

              <button
                onClick={() =>
                  goTo("/officer/dashboard")
                }
                className="
                  px-5
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
                  goTo("/officer/complaints")
                }
                className="
                  px-5
                  py-2.5
                  rounded-md
                  bg-[#F2B400]
                  text-[#0B1B2B]
                  text-[14px]
                  font-bold
                "
              >
                Complaints
              </button>

              <button
                onClick={() =>
                  goTo("/officer/tasks")
                }
                className="
                  px-5
                  py-2.5
                  rounded-md
                  text-[14px]
                  text-gray-300
                  hover:text-white
                  hover:bg-white/5
                  transition
                "
              >
                Tasks
              </button>

              <button
                onClick={() =>
                  goTo("/officer/notifications")
                }
                className="
                  px-5
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

            <div className="flex items-center gap-4 shrink-0">

              {/* NOTIFICATION */}

              <button
                onClick={() =>
                  goTo("/officer/notifications")
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

                <span
                  className="
                    absolute
                    top-0
                    right-0
                    w-[16px]
                    h-[16px]
                    rounded-full
                    bg-[#F2B400]
                    text-[#0B1B2B]
                    text-[9px]
                    font-bold
                    flex
                    items-center
                    justify-center
                  "
                >
                  3
                </span>

              </button>

              {/* PROFILE */}

              <button
                onClick={() =>
                  goTo("/officer/profile")
                }
                className="text-gray-300 hover:text-white"
              >
                <FaUserCircle className="text-[17px]" />
              </button>

              {/* LOGOUT */}

              <button
                onClick={handleLogout}
                className="
                  text-gray-300
                  hover:text-white
                  text-[14px]
                  flex
                  items-center
                  gap-2
                "
              >
                <span>Logout</span>
                <FaSignOutAlt />
              </button>

            </div>

          </div>

        </div>

      </nav>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="py-[42px]">

            <div
              className="
                text-[#F2B400]
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
                font-normal
                leading-tight
                mt-3
              "
            >
              Assigned Complaints
            </h1>

            <p
              className="
                text-gray-400
                text-[15px]
                mt-2
              "
            >
              Review, prioritize and manage
              complaints assigned to your
              department.
            </p>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="bg-[#F5F7FA]">

        <div className="max-w-[1280px] mx-auto px-6 py-4">

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
            "
          >

            {/* TOTAL */}

            <OfficerStat
              title="Total"
              value={
                loading
                  ? "..."
                  : stats.total
              }
            />

            {/* PENDING */}

            <OfficerStat
              title="Pending"
              value={
                loading
                  ? "..."
                  : stats.pending
              }
            />

            {/* IN PROGRESS */}

            <OfficerStat
              title="In Progress"
              value={
                loading
                  ? "..."
                  : stats.inProgress
              }
            />

            {/* RESOLVED */}

            <OfficerStat
              title="Resolved"
              value={
                loading
                  ? "..."
                  : stats.resolved
              }
            />

          </div>

          {/* =================================================
              SEARCH & FILTERS
          ================================================= */}

          <div
            className="
              bg-white
              border
              border-[#DCE3EA]
              rounded-lg
              p-6
              mt-5
            "
          >

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-[1fr_190px_190px]
                gap-5
              "
            >

              {/* SEARCH */}

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search complaints..."
                className="
                  w-full
                  h-[58px]
                  border
                  border-[#D6DEE8]
                  rounded-lg
                  px-4
                  text-[15px]
                  text-[#0B1B2B]
                  outline-none
                  focus:border-[#F2B400]
                "
              />

              {/* STATUS */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="
                  h-[58px]
                  border
                  border-[#D6DEE8]
                  rounded-lg
                  px-4
                  bg-white
                  text-[#0B1B2B]
                  outline-none
                  focus:border-[#F2B400]
                "
              >

                <option>
                  All Status
                </option>

                <option>
                  Pending
                </option>

                <option>
                  In Progress
                </option>

                <option>
                  Resolved
                </option>

              </select>

              {/* PRIORITY */}

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(
                    e.target.value
                  )
                }
                className="
                  h-[58px]
                  border
                  border-[#D6DEE8]
                  rounded-lg
                  px-4
                  bg-white
                  text-[#0B1B2B]
                  outline-none
                  focus:border-[#F2B400]
                "
              >

                <option>
                  All Priority
                </option>

                <option>
                  High
                </option>

                <option>
                  Medium
                </option>

                <option>
                  Low
                </option>

              </select>

            </div>

          </div>

          {/* =================================================
              COMPLAINT LIST
          ================================================= */}

          <div
            className="
              bg-white
              border
              border-[#DCE3EA]
              rounded-lg
              mt-5
              overflow-hidden
            "
          >

            {/* HEADER */}

            <div
              className="
                px-6
                py-5
                border-b
                border-[#DCE3EA]
                flex
                items-center
                justify-between
              "
            >

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
                  Department Activity
                </div>

                <h2
                  className="
                    text-[26px]
                    font-medium
                    mt-1
                  "
                >
                  Assigned Complaints
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Latest complaints requiring
                  your department's attention.
                </p>

              </div>

              <div className="text-sm text-gray-500">
                {filteredComplaints.length} complaints
              </div>

            </div>

            {/* LOADING */}

            {loading && (
              <div className="p-12 text-center text-gray-500">
                Loading complaints...
              </div>
            )}

            {/* EMPTY */}

            {!loading &&
              filteredComplaints.length === 0 && (
                <div className="p-12 text-center">

                  <FaClipboardList
                    className="
                      mx-auto
                      text-4xl
                      text-gray-300
                    "
                  />

                  <p className="mt-4 text-gray-500">
                    No complaints found.
                  </p>

                </div>
              )}

            {/* COMPLAINTS */}

            {!loading &&
              filteredComplaints.map(
                (complaint, index) => (
                  <div
                    key={
                      complaint._id ||
                      complaint.id ||
                      index
                    }
                    className="
                      px-6
                      py-7
                      border-b
                      border-[#E4E8ED]
                      last:border-b-0
                      hover:bg-[#FAFBFC]
                      transition
                    "
                  >

                    <div
                      className="
                        flex
                        flex-col
                        lg:flex-row
                        lg:items-center
                        justify-between
                        gap-6
                      "
                    >

                      {/* LEFT */}

                      <div className="flex gap-5">

                        <div
                          className="
                            w-10
                            h-10
                            rounded-lg
                            bg-[#0B1B2B]
                            text-[#F2B400]
                            flex
                            items-center
                            justify-center
                            shrink-0
                          "
                        >
                          <FaClipboardList />
                        </div>

                        <div>

                          <div className="flex items-center gap-2 flex-wrap">

                            <h3
                              className="
                                text-[22px]
                                font-medium
                                text-[#0B1B2B]
                              "
                            >
                              {getTitle(
                                complaint
                              )}
                            </h3>

                            <span
                              className="
                                text-[11px]
                                text-gray-400
                              "
                            >
                              #
                              {complaint.complaintId ||
                                complaint._id?.slice(
                                  -6
                                ) ||
                                `CMP${index + 1}`}
                            </span>

                          </div>

                          <p
                            className="
                              text-[13px]
                              text-[#8A9AB0]
                              mt-2
                            "
                          >
                            {complaint.category ||
                              "General Complaint"}
                          </p>

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-[12px]
                              text-[#6F8298]
                              mt-4
                            "
                          >

                            <FaMapMarkerAlt />

                            <span>
                              {getLocation(
                                complaint
                              )}
                            </span>

                          </div>

                        </div>

                      </div>

                      {/* RIGHT */}

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          flex-wrap
                          lg:justify-end
                        "
                      >

                        {/* PRIORITY */}

                        <span
                          className={`
                            px-3
                            py-1
                            rounded-full
                            border
                            text-[11px]
                            font-medium
                            ${getPriorityStyle(
                              complaint.priority
                            )}
                          `}
                        >
                          {complaint.priority ||
                            "Medium"}{" "}
                          Priority
                        </span>

                        {/* STATUS */}

                        <span
                          className={`
                            px-3
                            py-1
                            rounded-full
                            border
                            text-[11px]
                            font-medium
                            ${getStatusStyle(
                              complaint.status
                            )}
                          `}
                        >
                          {complaint.status ||
                            "Pending"}
                        </span>

                        {/* DATE */}

                        <span
                          className="
                            text-[11px]
                            text-gray-400
                            ml-2
                          "
                        >
                          {formatDate(
                            complaint.createdAt ||
                              complaint.date
                          )}
                        </span>

                        {/* ARROW */}

                        <button
                          onClick={() =>
                            navigate(
                              `/officer/complaints/${complaint._id}`
                            )
                          }
                          className="
                            ml-2
                            text-gray-300
                            hover:text-[#A97400]
                            transition
                          "
                        >
                          <FaArrowRight />
                        </button>

                      </div>

                    </div>

                  </div>
                )
              )}

          </div>

        </div>

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer
        className="
          bg-[#071521]
          text-white
          mt-8
        "
      >

        <div
          className="
            max-w-[1280px]
            mx-auto
            px-6
            py-6
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
            Officer Management Portal
          </p>

        </div>

      </footer>

    </div>
  );
}

// =========================================================
// STAT CARD
// =========================================================

function OfficerStat({
  title,
  value,
}) {
  return (
    <div
      className="
        bg-white
        border
        border-[#DCE3EA]
        rounded-lg
        p-6
        min-h-[165px]
      "
    >

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
          mt-4
        "
      >
        {value}
      </p>

    </div>
  );
}

export default OfficerComplaints;