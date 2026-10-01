import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaBell,
  FaUserShield,
  FaSignOutAlt,
  FaRoad,
  FaTrash,
  FaTint,
  FaBolt,
  FaHeartbeat,
  FaTools,
  FaPlus,
  FaClipboardList,
  FaCheckCircle,
  FaTimes,
  FaLeaf,
  FaSpinner,
  FaHome,
} from "react-icons/fa";

/* =========================================================
   DEFAULT DEPARTMENTS
   These 7 departments will ALWAYS appear.
========================================================= */

const DEFAULT_DEPARTMENTS = [
  {
    id: "road-transport",
    name: "Road & Transport",
    description:
      "Responsible for roads, traffic facilities, public transport and related infrastructure.",
    keywords: [
      "road",
      "roads",
      "transport",
      "traffic",
      "pothole",
      "potholes",
    ],
  },

  {
    id: "waste-management",
    name: "Waste Management",
    description:
      "Responsible for garbage collection, waste disposal, sanitation and cleanliness.",
    keywords: [
      "waste",
      "garbage",
      "sanitation",
      "cleaning",
      "dumping",
      "waste management",
    ],
  },

  {
    id: "water-supply",
    name: "Water Supply",
    description:
      "Responsible for drinking water supply, water leakage and water-related complaints.",
    keywords: [
      "water",
      "water supply",
      "water leakage",
      "leakage",
      "pipeline",
      "pipe",
    ],
  },

  {
    id: "electrical-services",
    name: "Electrical Services",
    description:
      "Responsible for street lights, electrical infrastructure and public lighting.",
    keywords: [
      "electrical",
      "electric",
      "electricity",
      "street light",
      "streetlight",
      "lighting",
      "power",
    ],
  },

  {
    id: "drainage-sewage",
    name: "Drainage & Sewage",
    description:
      "Responsible for drainage systems, sewage problems, blocked drains and wastewater.",
    keywords: [
      "drainage",
      "drain",
      "sewage",
      "sewer",
      "wastewater",
      "blocked drain",
      "drain blockage",
    ],
  },

  {
    id: "public-health",
    name: "Public Health",
    description:
      "Responsible for public health services, health-related civic issues and medical concerns.",
    keywords: [
      "health",
      "medical",
      "hospital",
      "disease",
      "public health",
      "healthcare",
    ],
  },

  {
    id: "parks-public-spaces",
    name: "Parks & Public Spaces",
    description:
      "Responsible for parks, gardens, public spaces, trees and recreational areas.",
    keywords: [
      "park",
      "parks",
      "garden",
      "gardens",
      "tree",
      "trees",
      "public space",
      "playground",
    ],
  },
];

/* =========================================================
   DEPARTMENT ICON
========================================================= */

const getDepartmentIcon = (name = "") => {
  const value = name.toLowerCase();

  if (
    value.includes("road") ||
    value.includes("transport")
  ) {
    return <FaRoad />;
  }

  if (
    value.includes("waste") ||
    value.includes("sanitation") ||
    value.includes("garbage")
  ) {
    return <FaTrash />;
  }

  if (
    value.includes("water") ||
    value.includes("supply")
  ) {
    return <FaTint />;
  }

  if (
    value.includes("electrical") ||
    value.includes("electric") ||
    value.includes("street")
  ) {
    return <FaBolt />;
  }

  if (
    value.includes("drainage") ||
    value.includes("sewage") ||
    value.includes("drain")
  ) {
    return <FaTools />;
  }

  if (
    value.includes("health") ||
    value.includes("medical")
  ) {
    return <FaHeartbeat />;
  }

  if (
    value.includes("park") ||
    value.includes("garden") ||
    value.includes("public space")
  ) {
    return <FaLeaf />;
  }

  if (
    value.includes("building") ||
    value.includes("construction")
  ) {
    return <FaHome />;
  }

  return <FaBuilding />;
};

/* =========================================================
   NORMALIZE DEPARTMENT NAME
========================================================= */

const normalizeDepartmentName = (department) => {
  if (!department) {
    return "";
  }

  if (typeof department === "string") {
    return department.trim();
  }

  if (typeof department === "object") {
    return String(
      department.name ||
        department.department ||
        department.title ||
        ""
    ).trim();
  }

  return String(department).trim();
};

/* =========================================================
   FIND MATCHING DEFAULT DEPARTMENT
========================================================= */

const findDefaultDepartment = (name) => {
  const normalized = String(name || "")
    .toLowerCase()
    .trim();

  if (!normalized) {
    return null;
  }

  return DEFAULT_DEPARTMENTS.find((department) => {
    if (
      department.name.toLowerCase() === normalized
    ) {
      return true;
    }

    return department.keywords.some(
      (keyword) =>
        normalized.includes(keyword) ||
        keyword.includes(normalized)
    );
  });
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

function AdminDepartments() {
  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [adding, setAdding] = useState(false);

  const [newDepartment, setNewDepartment] =
    useState({
      name: "",
      description: "",
    });

  /* =======================================================
     FETCH DEPARTMENT DATA
  ======================================================= */

  useEffect(() => {
    fetchDepartmentData();
  }, []);

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/complaints"
      );

      if (!response.ok) {
        throw new Error(
          "Unable to fetch complaints from server."
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
            "Unable to load complaint data."
        );
      }

      const complaints = Array.isArray(result.data)
        ? result.data
        : [];

      /* =====================================================
         CREATE STATISTICS FOR ALL 7 DEPARTMENTS
      ===================================================== */

      const statistics = {};

      DEFAULT_DEPARTMENTS.forEach((department) => {
        statistics[department.id] = {
          complaints: 0,
          resolved: 0,
          officer: "Not Assigned",
        };
      });

      /* =====================================================
         PROCESS COMPLAINTS
      ===================================================== */

      complaints.forEach((complaint) => {
        const rawDepartment =
          normalizeDepartmentName(
            complaint.department
          );

        if (!rawDepartment) {
          return;
        }

        const matchedDepartment =
          findDefaultDepartment(
            rawDepartment
          );

        if (!matchedDepartment) {
          return;
        }

        const departmentStats =
          statistics[matchedDepartment.id];

        departmentStats.complaints += 1;

        /* =================================================
           OFFICER
        ================================================= */

        const officerName =
          complaint.officerName ||
          complaint.assignedOfficer ||
          complaint.officer?.name ||
          "";

        if (officerName) {
          departmentStats.officer =
            officerName;
        }

        /* =================================================
           RESOLVED COMPLAINTS
        ================================================= */

        const status = String(
          complaint.status || ""
        ).toLowerCase();

        if (
          status === "resolved" ||
          status === "completed" ||
          status === "closed"
        ) {
          departmentStats.resolved += 1;
        }
      });

      /* =====================================================
         BUILD FINAL LIST
      ===================================================== */

      const departmentList =
        DEFAULT_DEPARTMENTS.map(
          (department) => {
            const stats =
              statistics[department.id];

            return {
              ...department,

              complaints:
                stats.complaints,

              resolved:
                stats.resolved,

              officer:
                stats.officer,

              status: "Active",

              icon:
                getDepartmentIcon(
                  department.name
                ),
            };
          }
        );

      setDepartments(departmentList);
    } catch (err) {
      console.error(
        "Department data error:",
        err
      );

      setError(
        err.message ||
          "Unable to load department data."
      );

      /* =====================================================
         FALLBACK
         Still show all 7 departments.
      ===================================================== */

      const fallbackDepartments =
        DEFAULT_DEPARTMENTS.map(
          (department) => ({
            ...department,

            complaints: 0,

            resolved: 0,

            officer: "Not Assigned",

            status: "Active",

            icon:
              getDepartmentIcon(
                department.name
              ),
          })
        );

      setDepartments(
        fallbackDepartments
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewDepartment((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* =======================================================
     ADD DEPARTMENT
  ======================================================= */

  const addDepartment = async () => {
    const name =
      newDepartment.name.trim();

    const description =
      newDepartment.description.trim();

    if (!name) {
      alert(
        "Please enter a department name."
      );
      return;
    }

    try {
      setAdding(true);

      const response = await fetch(
        "http://localhost:5000/api/departments",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name,
            description,
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
            "Unable to create department."
        );
      }

      const created =
        result.data || {};

      const newDepartmentObject = {
        id:
          created._id ||
          created.id ||
          Date.now(),

        name:
          created.name || name,

        description:
          created.description ||
          description ||
          "Municipal department.",

        officer:
          created.officer ||
          "Not Assigned",

        complaints: 0,

        resolved: 0,

        status:
          created.status ||
          "Active",

        icon:
          getDepartmentIcon(
            created.name || name
          ),
      };

      setDepartments(
        (current) => [
          ...current,
          newDepartmentObject,
        ]
      );

      setNewDepartment({
        name: "",
        description: "",
      });

      setShowAddForm(false);

      alert(
        "Department created successfully."
      );
    } catch (err) {
      console.error(
        "Add department error:",
        err
      );

      alert(
        err.message ||
          "Unable to create department."
      );
    } finally {
      setAdding(false);
    }
  };

  /* =======================================================
     TOGGLE DEPARTMENT
  ======================================================= */

  const toggleDepartment = (id) => {
    setDepartments((current) =>
      current.map((department) =>
        department.id === id
          ? {
              ...department,

              status:
                department.status ===
                "Active"
                  ? "Inactive"
                  : "Active",
            }
          : department
      )
    );
  };

  /* =======================================================
     STATISTICS
  ======================================================= */

  const activeDepartments =
    departments.filter(
      (department) =>
        department.status === "Active"
    ).length;

  const totalComplaints =
    departments.reduce(
      (total, department) =>
        total +
        Number(
          department.complaints || 0
        ),
      0
    );

  const totalResolved =
    departments.reduce(
      (total, department) =>
        total +
        Number(
          department.resolved || 0
        ),
      0
    );

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <AdminNavbar
          navigate={navigate}
          handleLogout={handleLogout}
        />

        <div className="min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="text-4xl text-[#E8AA0C] animate-spin mx-auto" />

            <p className="mt-4 text-gray-500">
              Loading department data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN PAGE
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <AdminNavbar
        navigate={navigate}
        handleLogout={handleLogout}
      />

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="bg-[#0B1B2B] text-white">
        <div className="max-w-7xl mx-auto px-6 py-10">

          <p className="text-[#E8AA0C] text-sm font-semibold uppercase tracking-widest">
            Administration Portal
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Municipal Departments
          </h1>

          <p className="text-gray-400 mt-2">
            Manage departments and monitor
            their complaint handling.
          </p>

        </div>
      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg px-5 py-4 mb-6 text-sm">

            <strong>
              Server connection warning:
            </strong>

            <span className="ml-2">
              {error}
            </span>

            <button
              onClick={fetchDepartmentData}
              className="ml-4 underline font-bold"
            >
              Retry
            </button>

          </div>
        )}

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          <DepartmentStat
            title="Departments"
            value={departments.length}
            subtitle="Municipal departments"
            icon={<FaBuilding />}
            className="bg-purple-50 text-purple-600"
          />

          <DepartmentStat
            title="Active"
            value={activeDepartments}
            subtitle="Currently active"
            icon={<FaCheckCircle />}
            className="bg-green-50 text-green-600"
          />

          <DepartmentStat
            title="Complaints"
            value={totalComplaints}
            subtitle="Total complaints"
            icon={<FaClipboardList />}
            className="bg-blue-50 text-blue-600"
          />

          <DepartmentStat
            title="Resolved"
            value={totalResolved}
            subtitle="Resolved complaints"
            icon={<FaCheckCircle />}
            className="bg-yellow-50 text-yellow-700"
          />

        </div>

        {/* =================================================
            ADD DEPARTMENT BUTTON
        ================================================= */}

        <div className="flex justify-end mt-6">

          <button
            onClick={() =>
              setShowAddForm(
                !showAddForm
              )
            }
            className="flex items-center gap-2 bg-[#E8AA0C] hover:bg-[#D99D00] text-[#0B1B2B] font-bold px-5 py-3 rounded-lg text-sm transition"
          >

            {showAddForm ? (
              <FaTimes />
            ) : (
              <FaPlus />
            )}

            {showAddForm
              ? "Close Form"
              : "Add Department"}

          </button>

        </div>

        {/* =================================================
            ADD DEPARTMENT FORM
        ================================================= */}

        {showAddForm && (
          <section className="bg-white border border-[#DCE3EA] rounded-xl mt-4 p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-lg bg-[#FFF8E6] text-[#A97400] flex items-center justify-center">
                <FaPlus />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#0B1B2B]">
                  Add New Department
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Create a municipal department.
                </p>
              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-4">

              {/* NAME */}

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Department Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    newDepartment.name
                  }
                  onChange={handleChange}
                  placeholder="Department name"
                  className="w-full mt-2 border border-[#DCE3EA] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E8AA0C]"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Description
                </label>

                <input
                  type="text"
                  name="description"
                  value={
                    newDepartment.description
                  }
                  onChange={handleChange}
                  placeholder="Department description"
                  className="w-full mt-2 border border-[#DCE3EA] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E8AA0C]"
                />
              </div>

            </div>

            <button
              onClick={addDepartment}
              disabled={adding}
              className="mt-5 bg-[#0B1B2B] hover:bg-[#132B40] text-white px-5 py-3 rounded-lg text-sm font-bold disabled:opacity-50 flex items-center gap-2"
            >

              {adding ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FaPlus />
                  Create Department
                </>
              )}

            </button>

          </section>
        )}

        {/* =================================================
            DEPARTMENT CARDS
        ================================================= */}

        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">

          {departments.map(
            (department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                onToggle={() =>
                  toggleDepartment(
                    department.id
                  )
                }
              />
            )
          )}

        </section>

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="bg-[#071521] text-white py-8 mt-10">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between gap-4">

            <div>
              <h3 className="font-bold">
                Smart Municipality
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Department Management System
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
   ADMIN NAVBAR
========================================================= */

function AdminNavbar({
  navigate,
  handleLogout,
}) {
  return (
    <nav className="bg-[#0B1B2B] text-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="h-20 flex items-center justify-between">

          {/* LOGO */}

          <div
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
            className="flex items-center gap-3 cursor-pointer"
          >

            <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] flex items-center justify-center">

              <FaBuilding className="text-[#0B1B2B]" />

            </div>

            <div>

              <h1 className="!text-lg !font-bold !leading-tight">
                Smart Municipality
              </h1>

              <p className="text-xs text-gray-400 mt-1">
                Administration Portal
              </p>

            </div>

          </div>

          {/* NAVIGATION */}

          <div className="hidden lg:flex items-center gap-2">

            {/* DASHBOARD */}

            <button
              onClick={() =>
                navigate(
                  "/admin/dashboard"
                )
              }
              className="px-4 py-2.5 rounded-md text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Dashboard
            </button>

            {/* COMPLAINTS */}

            <button
              onClick={() =>
                navigate(
                  "/admin/complaints"
                )
              }
              className="px-4 py-2.5 rounded-md text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              Complaints
            </button>

            {/* DEPARTMENTS */}

            <button
              className="px-5 py-2.5 rounded-md bg-[#E8AA0C] text-[#0B1B2B] text-sm font-bold"
            >
              Departments
            </button>

            {/* AI ANALYTICS */}

            <button
              onClick={() =>
                navigate(
                  "/admin/analytics"
                )
              }
              className="px-4 py-2.5 rounded-md text-sm text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2 transition"
            >
              <span className="text-[#E8AA0C]">
                🤖
              </span>

              AI Analytics
            </button>

          </div>

          {/* RIGHT SIDE */}

          <div className="flex items-center gap-5">

            {/* NOTIFICATIONS */}

            <button
              onClick={() =>
                navigate(
                  "/admin/notifications"
                )
              }
              className="relative text-gray-300 hover:text-white"
            >

              <FaBell />

              <span className="absolute -top-2 -right-2 bg-[#E8AA0C] text-[#0B1B2B] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                5
              </span>

            </button>

            {/* PROFILE */}

            <button
              onClick={() =>
                navigate(
                  "/admin/profile"
                )
              }
              className="text-gray-300 hover:text-white"
            >
              <FaUserShield />
            </button>

            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 flex items-center gap-2"
            >

              <span className="hidden sm:block text-sm">
                Logout
              </span>

              <FaSignOutAlt />

            </button>

          </div>

        </div>

      </div>

    </nav>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function DepartmentStat({
  title,
  value,
  subtitle,
  icon,
  className,
}) {
  return (
    <div className="bg-white border border-[#DCE3EA] rounded-xl p-5">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
            {title}
          </p>

          <p className="text-3xl font-bold text-[#0B1B2B] mt-2">
            {Number(
              value || 0
            ).toLocaleString()}
          </p>

          <p className="text-[10px] text-gray-400 mt-1">
            {subtitle}
          </p>

        </div>

        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${className}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   DEPARTMENT CARD
========================================================= */

function DepartmentCard({
  department,
  onToggle,
}) {
  const complaints =
    Number(
      department.complaints || 0
    );

  const resolved =
    Number(
      department.resolved || 0
    );

  const resolutionRate =
    complaints === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (resolved / complaints) *
              100
          )
        );

  return (
    <div className="bg-white border border-[#DCE3EA] rounded-xl p-6 hover:border-[#E8AA0C] hover:shadow-sm transition">

      {/* TOP */}

      <div className="flex items-start justify-between">

        <div className="w-12 h-12 rounded-lg bg-[#FFF8E6] text-[#A97400] flex items-center justify-center text-xl">
          {department.icon}
        </div>

        <span
          className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${
            department.status ===
            "Active"
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {department.status}
        </span>

      </div>

      {/* NAME */}

      <h2 className="!text-lg !font-bold !leading-tight text-[#0B1B2B] mt-5">
        {department.name}
      </h2>

      {/* DESCRIPTION */}

      <p className="text-xs text-gray-400 leading-5 mt-2 min-h-[40px]">
        {department.description}
      </p>

      {/* OFFICER */}

      <div className="border-t border-[#E8ECF0] mt-5 pt-4">

        <div className="flex items-center justify-between gap-3">

          <span className="text-[10px] uppercase font-bold text-gray-400">
            Assigned Officer
          </span>

          <span className="text-xs font-bold text-[#0B1B2B] text-right">
            {department.officer ||
              "Not Assigned"}
          </span>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 gap-3 mt-4">

        <div className="bg-[#F8FAFC] rounded-lg p-3">

          <p className="text-[10px] uppercase text-gray-400 font-bold">
            Complaints
          </p>

          <p className="text-lg font-bold text-[#0B1B2B] mt-1">
            {complaints.toLocaleString()}
          </p>

        </div>

        <div className="bg-[#F8FAFC] rounded-lg p-3">

          <p className="text-[10px] uppercase text-gray-400 font-bold">
            Resolved
          </p>

          <p className="text-lg font-bold text-green-600 mt-1">
            {resolved.toLocaleString()}
          </p>

        </div>

      </div>

      {/* PROGRESS */}

      <div className="mt-4">

        <div className="flex justify-between">

          <span className="text-[10px] font-bold text-gray-400">
            Resolution Rate
          </span>

          <span className="text-[10px] font-bold text-[#0B1B2B]">
            {resolutionRate}%
          </span>

        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">

          <div
            className="h-full bg-[#E8AA0C] rounded-full transition-all"
            style={{
              width: `${resolutionRate}%`,
            }}
          />

        </div>

      </div>

      {/* ACTION */}

      <button
        onClick={onToggle}
        className={`w-full mt-5 py-2.5 rounded-lg text-xs font-bold transition ${
          department.status ===
          "Active"
            ? "border border-[#DCE3EA] text-gray-600 hover:bg-red-50 hover:text-red-500"
            : "bg-[#0B1B2B] text-white hover:bg-[#132B40]"
        }`}
      >

        {department.status ===
        "Active"
          ? "Deactivate Department"
          : "Activate Department"}

      </button>

    </div>
  );
}

export default AdminDepartments;