import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
  });

  // ========================================
  // FETCH ALL USERS
  // ========================================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/users",
        {
          headers: token
            ? {
              Authorization: `Bearer ${token}`,
            }
            : {},
        }
      );

      // Handle both possible API response formats
      const userData = Array.isArray(response.data)
        ? response.data
        : response.data.users || response.data.data || [];

      setUsers(userData);
    } catch (err) {
      console.error("Error fetching users:", err);

      setError(
        err.response?.data?.message ||
        "Failed to load users. Please check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD USERS WHEN PAGE OPENS
  // ========================================
  useEffect(() => {
    fetchUsers();
  }, []);

  // ========================================
  // DELETE USER
  // ========================================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/users/${id}`,
        {
          headers: token
            ? {
              Authorization: `Bearer ${token}`,
            }
            : {},
        }
      );

      alert("User deleted successfully.");

      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);

      alert(
        err.response?.data?.message ||
        "Failed to delete user."
      );
    }
  };

  // ========================================
  // OPEN EDIT MODAL
  // ========================================
  const handleEdit = (user) => {
    setEditingUser(user);

    setEditData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "Citizen",
      department: user.department || "",
    });
  };

  // ========================================
  // HANDLE EDIT INPUT
  // ========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // UPDATE USER
  // ========================================
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingUser) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/users/${editingUser._id}`,
        editData,
        {
          headers: token
            ? {
              Authorization: `Bearer ${token}`,
            }
            : {},
        }
      );

      alert("User updated successfully.");

      setEditingUser(null);

      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);

      alert(
        err.response?.data?.message ||
        "Failed to update user."
      );
    }
  };

  // ========================================
  // LOADING
  // ========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E8AA0C]/20 border-t-[#E8AA0C] rounded-full animate-spin mx-auto" />
          <p className="text-[#0B1B2B] font-semibold mt-4">Loading users...</p>
        </div>
      </div>
    );
  }

  // ========================================
  // PAGE
  // ========================================
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0B1B2B]">

      {/* HEADER SECTION */}
      <section className="bg-[#0B1B2B] text-white">
        <div className="max-w-[1280px] mx-auto px-6 py-9">
          <div className="text-[#E8AA0C] text-[12px] font-bold uppercase tracking-[0.18em]">
            Administration Portal
          </div>
          <h1 className="text-[36px] md:text-[42px] font-bold leading-tight mt-3">
            Manage Users
          </h1>
          <p className="text-gray-400 text-[14px] mt-3">
            View and manage registered municipality users.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-[1280px] mx-auto px-6 py-7">

        {/* TOP BAR */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[#A97400] text-[12px] font-bold uppercase tracking-[0.16em]">User Management</div>
            <h2 className="text-[24px] font-semibold mt-1">All Users</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white border border-[#DCE3EA] rounded-lg px-4 py-2 text-[13px] text-gray-500">
              Total: <span className="font-bold text-[#0B1B2B]">{users.length}</span>
            </div>
            <button
              onClick={fetchUsers}
              className="h-[40px] px-5 bg-[#0B1B2B] text-white rounded-md text-[14px] font-bold hover:bg-[#142B40] transition"
            >
              Refresh
            </button>
          </div>
        </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5 text-red-700 text-[14px]">
          {error}
        </div>
      )}

      {/* USERS TABLE */}
      <div className="bg-white border border-[#DCE3EA] rounded-lg overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-[14px]">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#DCE3EA] bg-[#F5F7FA]">
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">Name</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">Email</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">Phone</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">Role</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">Department</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-[#DCE3EA] hover:bg-[#FAFBFC] transition"
                  >
                    <td className="px-5 py-4 text-[14px] text-[#0B1B2B] font-medium whitespace-nowrap">
                      {user.name || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-[14px] text-gray-500 whitespace-nowrap">
                      {user.email || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-[14px] text-gray-500 whitespace-nowrap">
                      {user.phone || "N/A"}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold ${
                          user.role === "Admin" || user.role === "admin"
                            ? "bg-[#FFF6DD] text-[#B77A00]"
                            : user.role === "Officer" || user.role === "officer"
                              ? "bg-[#EEF2FF] text-[#4338CA]"
                              : "bg-[#EAF8EF] text-[#0A9F4A]"
                        }`}
                      >
                        {user.role || "Citizen"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-[14px] text-gray-500 whitespace-nowrap">
                      {user.department || "N/A"}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="h-[32px] px-3.5 bg-[#0B1B2B] text-white rounded text-[12px] font-semibold hover:bg-[#142B40] transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(user._id)
                          }
                          className="h-[32px] px-3.5 bg-red-500 text-white rounded text-[12px] font-semibold hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-5 z-[1000]">
          <div className="w-full max-w-[480px] bg-white rounded-xl shadow-2xl overflow-hidden">

            <div className="px-6 py-5 border-b border-[#DCE3EA]">
              <h2 className="text-[20px] font-bold text-[#0B1B2B]">Edit User</h2>
              <p className="text-gray-500 text-[13px] mt-1">Update the user details below.</p>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={editData.name}
                  onChange={handleChange}
                  className="w-full h-[42px] px-4 border border-[#DCE3EA] rounded-md outline-none text-[14px] text-[#0B1B2B] focus:border-[#E8AA0C]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={editData.email}
                  onChange={handleChange}
                  className="w-full h-[42px] px-4 border border-[#DCE3EA] rounded-md outline-none text-[14px] text-[#0B1B2B] focus:border-[#E8AA0C]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={editData.phone}
                  onChange={handleChange}
                  className="w-full h-[42px] px-4 border border-[#DCE3EA] rounded-md outline-none text-[14px] text-[#0B1B2B] focus:border-[#E8AA0C]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Role</label>
                <select
                  name="role"
                  value={editData.role}
                  onChange={handleChange}
                  className="w-full h-[42px] px-4 border border-[#DCE3EA] rounded-md outline-none text-[14px] bg-white text-[#0B1B2B] focus:border-[#E8AA0C]"
                >
                  <option value="Citizen">Citizen</option>
                  <option value="Officer">Officer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-gray-600 mb-1.5">Department</label>
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  value={editData.department}
                  onChange={handleChange}
                  className="w-full h-[42px] px-4 border border-[#DCE3EA] rounded-md outline-none text-[14px] text-[#0B1B2B] focus:border-[#E8AA0C]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 h-[44px] bg-[#0B1B2B] text-white rounded-md font-bold text-[14px] hover:bg-[#142B40] transition"
                >
                  Update User
                </button>

                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 h-[44px] border border-[#DCE3EA] text-gray-600 rounded-md font-semibold text-[14px] hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </main>
    </div>
  );
};

// ========================================
// TABLE STYLES (kept for backwards compat)
// ========================================

const thStyle = {
  padding: "15px",
  textAlign: "left",
  color: "#e2e8f0",
  fontWeight: "600",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "15px",
  color: "#cbd5e1",
  whiteSpace: "nowrap",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  marginTop: "12px",
  background: "#0f172a",
  color: "white",
  border: "1px solid #475569",
  borderRadius: "7px",
  outline: "none",
};

export default AdminUsers;