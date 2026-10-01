import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  Suspense,
  lazy,
} from "react";

/* =========================================================
   LOADING SCREEN
========================================================= */

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0B1B2B",
        color: "#E8AA0C",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "45px",
          height: "45px",
          border: "4px solid rgba(232,170,12,0.2)",
          borderTop: "4px solid #E8AA0C",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          marginBottom: "20px",
        }}
      />

      <h2>Smart Municipality 2.0</h2>

      <p
        style={{
          color: "#9CA3AF",
          marginTop: "8px",
        }}
      >
        Loading...
      </p>

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}

/* =========================================================
   PUBLIC PAGES
========================================================= */

const Home = lazy(() =>
  import("./pages/Home/Home")
);

const Login = lazy(() =>
  import("./pages/Login/Login")
);

const Register = lazy(() =>
  import("./pages/Register/Register")
);

/* =========================================================
   CITIZEN PAGES
========================================================= */

const CitizenDashboard = lazy(() =>
  import("./pages/Citizen/CitizenDashboard")
);

const SubmitComplaint = lazy(() =>
  import("./pages/Citizen/SubmitComplaint")
);

const CitizenComplaints = lazy(() =>
  import("./pages/Citizen/CitizenComplaints")
);



const AIChatbot = lazy(() =>
  import("./pages/Citizen/AIChatbot")
);

const CitizenComplaintDetails = lazy(() =>
  import("./pages/Citizen/ComplaintDetails")
);

const CitizenDepartments = lazy(() =>
  import("./pages/Citizen/Departments")
);

const CitizenNotifications = lazy(() =>
  import("./pages/Citizen/Notifications")
);

const CitizenProfile = lazy(() =>
  import("./pages/Citizen/Profile")
);

/* =========================================================
   GENERAL PAGES
========================================================= */

const Departments = lazy(() =>
  import("./pages/Departments/Departments")
);

const MyComplaints = lazy(() =>
  import("./pages/MyComplaints/MyComplaints")
);

const ComplaintDetails = lazy(() =>
  import("./pages/ComplaintDetails/ComplaintDetails")
);

const Notifications = lazy(() =>
  import("./pages/Notifications/Notifications")
);

const Profile = lazy(() =>
  import("./pages/Profile/Profile")
);

/* =========================================================
   OFFICER PAGES
========================================================= */

const OfficerDashboard = lazy(() =>
  import("./pages/Officer/OfficerDashboard")
);

const OfficerComplaints = lazy(() =>
  import("./pages/Officer/OfficerComplaints")
);

const OfficerComplaintDetails = lazy(() =>
  import("./pages/Officer/OfficerComplaintDetails")
);

const OfficerNotifications = lazy(() =>
  import("./pages/Officer/OfficerNotifications")
);

const OfficerProfile = lazy(() =>
  import("./pages/Officer/OfficerProfile")
);

const OfficerTasks = lazy(() =>
  import("./pages/Officer/OfficerTasks")
);

/* =========================================================
   ADMIN PAGES
========================================================= */

const AdminAnalytics = lazy(() =>
  import("./pages/Admin/AdminAnalytics")
);

const AdminComplaints = lazy(() =>
  import("./pages/Admin/AdminComplaints")
);

const AdminDashboard = lazy(() =>
  import("./pages/Admin/AdminDashboard")
);

const AdminDepartments = lazy(() =>
  import("./pages/Admin/AdminDepartments")
);

const AdminNotifications = lazy(() =>
  import("./pages/Admin/AdminNotifications")
);

const AdminProfile = lazy(() =>
  import("./pages/Admin/AdminProfile")
);

const AdminSettings = lazy(() =>
  import("./pages/Admin/AdminSettings")
);

const AdminUsers = lazy(() =>
  import("./pages/Admin/AdminUsers")
);

const AIReports = lazy(() =>
  import("./pages/Admin/AIReports")
);

const AdminDepartmentsPage = lazy(() =>
  import("./pages/Admin/Departments")
);

const ManageCitizens = lazy(() =>
  import("./pages/Admin/ManageCitizens")
);

const ManageComplaints = lazy(() =>
  import("./pages/Admin/ManageComplaints")
);

const AdminComplaintDetails = lazy(() =>
  import("./pages/Admin/ComplaintDetails")
);

/* =========================================================
   ROLE BASED REDIRECT
========================================================= */

function RoleRedirect() {
  const token = localStorage.getItem("token");

  const storedUser =
    localStorage.getItem("user");

  /* -------------------------------------------------------
     NOT LOGGED IN
  ------------------------------------------------------- */

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /* -------------------------------------------------------
     READ USER
  ------------------------------------------------------- */

  let user = {};

  try {
    user = storedUser
      ? JSON.parse(storedUser)
      : {};
  } catch (error) {
    console.error(
      "User data error:",
      error
    );
  }

  /* -------------------------------------------------------
     GET ROLE
  ------------------------------------------------------- */

  const role = String(
    user?.role ||
      user?.userRole ||
      "citizen"
  ).toLowerCase();

  /* -------------------------------------------------------
     ADMIN
  ------------------------------------------------------- */

  if (
    role === "admin" ||
    role === "administrator"
  ) {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }

  /* -------------------------------------------------------
     OFFICER
  ------------------------------------------------------- */

  if (
    role === "officer" ||
    role === "municipal officer"
  ) {
    return (
      <Navigate
        to="/officer/dashboard"
        replace
      />
    );
  }

  /* -------------------------------------------------------
     CITIZEN
  ------------------------------------------------------- */

  return (
    <Navigate
      to="/dashboard"
      replace
    />
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <BrowserRouter>

      <Suspense
        fallback={
          <LoadingScreen />
        }
      >

        <Routes>

          {/* =================================================
             PUBLIC
          ================================================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/redirect"
            element={<RoleRedirect />}
          />


          {/* =================================================
             CITIZEN
          ================================================= */}

          <Route
            path="/dashboard"
            element={<CitizenDashboard />}
          />

          <Route
            path="/ai-assistant"
            element={<AIChatbot />}
          />

          <Route
            path="/register-complaint"
            element={<SubmitComplaint />}
          />

          <Route
            path="/my-complaints"
            element={<CitizenComplaints />}
          />

          <Route
            path="/complaint-details"
            element={<CitizenComplaintDetails />}
          />

          <Route
            path="/departments"
            element={<CitizenDepartments />}
          />

          <Route
            path="/notifications"
            element={<CitizenNotifications />}
          />

          <Route
            path="/profile"
            element={<CitizenProfile />}
          />


          {/* =================================================
             CITIZEN ALTERNATIVE ROUTES
          ================================================= */}

          <Route
            path="/citizen/dashboard"
            element={<CitizenDashboard />}
          />

          <Route
            path="/citizen/submit-complaint"
            element={<SubmitComplaint />}
          />

          <Route
            path="/citizen/complaints"
            element={<CitizenComplaints />}
          />

          <Route
            path="/citizen/complaint-details"
            element={<CitizenComplaintDetails />}
          />

          <Route
            path="/citizen/departments"
            element={<CitizenDepartments />}
          />

          <Route
            path="/citizen/notifications"
            element={<CitizenNotifications />}
          />

          <Route
            path="/citizen/profile"
            element={<CitizenProfile />}
          />


          {/* =================================================
             GENERAL
          ================================================= */}

          <Route
            path="/general-departments"
            element={<Departments />}
          />

          <Route
            path="/general-complaints"
            element={<MyComplaints />}
          />

          <Route
            path="/general-complaint-details"
            element={<ComplaintDetails />}
          />

          <Route
            path="/general-notifications"
            element={<Notifications />}
          />

          <Route
            path="/general-profile"
            element={<Profile />}
          />


          {/* =================================================
             OFFICER
          ================================================= */}

          <Route
            path="/officer/dashboard"
            element={<OfficerDashboard />}
          />

          <Route
            path="/officer/complaints"
            element={<OfficerComplaints />}
          />

          {/* =================================================
             OFFICER COMPLAINT DETAILS

             IMPORTANT

             Complaint ID is passed in URL.

             Example:

             /officer/complaint-details/CMP2514

             /officer/complaint-details/CMP2577
          ================================================= */}

          <Route
            path="/officer/complaint-details/:id"
            element={
              <OfficerComplaintDetails />
            }
          />

          <Route
            path="/officer/notifications"
            element={<OfficerNotifications />}
          />

          <Route
            path="/officer/profile"
            element={<OfficerProfile />}
          />

          <Route
            path="/officer/tasks"
            element={<OfficerTasks />}
          />


          {/* =================================================
             ADMIN DASHBOARD
          ================================================= */}

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />


          {/* =================================================
             ADMIN ANALYTICS
          ================================================= */}

          <Route
            path="/admin/analytics"
            element={<AdminAnalytics />}
          />


          {/* =================================================
             ADMIN COMPLAINTS
          ================================================= */}

          <Route
            path="/admin/complaints"
            element={<AdminComplaints />}
          />

          <Route
            path="/admin/complaints/:id"
            element={
              <AdminComplaintDetails />
            }
          />


          {/* =================================================
             ADMIN DEPARTMENTS
          ================================================= */}

          <Route
            path="/admin/departments"
            element={<AdminDepartments />}
          />


          {/* =================================================
             ADMIN NOTIFICATIONS
          ================================================= */}

          <Route
            path="/admin/notifications"
            element={<AdminNotifications />}
          />


          {/* =================================================
             ADMIN PROFILE
          ================================================= */}

          <Route
            path="/admin/profile"
            element={<AdminProfile />}
          />


          {/* =================================================
             ADMIN SETTINGS
          ================================================= */}

          <Route
            path="/admin/settings"
            element={<AdminSettings />}
          />


          {/* =================================================
             ADMIN USERS
          ================================================= */}

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />


          {/* =================================================
             AI REPORTS
          ================================================= */}

          <Route
            path="/admin/ai-reports"
            element={<AIReports />}
          />


          {/* =================================================
             MANAGE CITIZENS
          ================================================= */}

          <Route
            path="/admin/manage-citizens"
            element={<ManageCitizens />}
          />


          {/* =================================================
             MANAGE COMPLAINTS
          ================================================= */}

          <Route
            path="/admin/manage-complaints"
            element={<ManageComplaints />}
          />


          {/* =================================================
             ADMIN DEPARTMENT LIST
          ================================================= */}

          <Route
            path="/admin/department-list"
            element={<AdminDepartmentsPage />}
          />


          {/* =================================================
             FALLBACK
          ================================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </Suspense>

    </BrowserRouter>
  );
}

export default App;