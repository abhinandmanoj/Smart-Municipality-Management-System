import { useEffect, useState } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";

function ComplaintTable() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/complaints"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch complaints"
        );
      }

      setComplaints(data.data || []);
      setError("");
    } catch (error) {
      console.error("Fetch complaints error:", error);
      setError("Unable to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase();

    return (
      complaint.complaintId?.toLowerCase().includes(searchText) ||
      complaint.citizenName?.toLowerCase().includes(searchText) ||
      complaint.category?.toLowerCase().includes(searchText)
    );
  });

  const priorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500/20 text-red-400";

      case "Medium":
        return "bg-yellow-500/20 text-yellow-400";

      case "Low":
        return "bg-green-500/20 text-green-400";

      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-500/20 text-green-400";

      case "Assigned":
        return "bg-blue-500/20 text-blue-400";

      case "In Progress":
        return "bg-purple-500/20 text-purple-400";

      case "Rejected":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-orange-500/20 text-orange-400";
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/complaints/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete complaint"
        );
      }

      setComplaints((previous) =>
        previous.filter((complaint) => complaint._id !== id)
      );
    } catch (error) {
      console.error("Delete complaint error:", error);
      alert("Failed to delete complaint.");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#111827] rounded-xl p-6">
        <p className="text-gray-400">
          Loading complaints...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#111827] rounded-xl p-6">
        <p className="text-red-400">
          {error}
        </p>

        <button
          onClick={fetchComplaints}
          className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#111827] rounded-xl shadow-lg">

      {/* Header */}

      <div className="flex justify-between items-center p-5 border-b border-gray-800">

        <div>
          <h2 className="text-xl font-semibold text-white">
            Recent Complaints
          </h2>

          <p className="text-gray-400 text-sm">
            Latest registered complaints
          </p>
        </div>

        {/* Search */}

        <div className="relative">

          <FaSearch className="absolute left-3 top-3 text-gray-500" />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 h-10 rounded-lg bg-[#1E293B] border border-gray-700 pl-10 pr-3 text-sm text-white outline-none"
          />

        </div>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="text-gray-400 text-sm border-b border-gray-800">

              <th className="py-3 px-5 text-left">
                ID
              </th>

              <th className="text-left">
                Citizen
              </th>

              <th className="text-left">
                Category
              </th>

              <th className="text-left">
                Department
              </th>

              <th className="text-left">
                Priority
              </th>

              <th className="text-left">
                Status
              </th>

              <th className="text-left">
                Date
              </th>

              <th className="text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredComplaints.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  className="text-center py-10 text-gray-500"
                >
                  No complaints found.
                </td>

              </tr>

            ) : (

              filteredComplaints.map((complaint) => (

                <tr
                  key={complaint._id}
                  className="border-b border-gray-800 hover:bg-[#1E293B]"
                >

                  <td className="py-3 px-5 text-orange-400 font-medium">
                    {complaint.complaintId}
                  </td>

                  <td className="text-white">
                    {complaint.citizenName}
                  </td>

                  <td className="text-gray-300">
                    {complaint.category}
                  </td>

                  <td className="text-gray-300">
                    {complaint.department}
                  </td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColor(
                        complaint.priority
                      )}`}
                    >
                      {complaint.priority}
                    </span>

                  </td>

                  <td>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>

                  </td>

                  <td className="text-gray-400 text-sm">
                    {complaint.createdAt
                      ? new Date(
                          complaint.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>

                    <div className="flex justify-center gap-2">

                      {/* View */}

                      <button
                        className="w-8 h-8 rounded-lg bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white"
                        title="View"
                      >
                        <FaEye size={12} />
                      </button>

                      {/* Edit */}

                      <button
                        className="w-8 h-8 rounded-lg bg-green-500 hover:bg-green-600 flex items-center justify-center text-white"
                        title="Edit"
                      >
                        <FaEdit size={12} />
                      </button>

                      {/* Delete */}

                      <button
                        onClick={() =>
                          handleDelete(complaint._id)
                        }
                        className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center text-white"
                        title="Delete"
                      >
                        <FaTrash size={12} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Footer */}

      <div className="flex justify-between items-center p-4">

        <p className="text-gray-400 text-sm">
          Showing {filteredComplaints.length} of{" "}
          {complaints.length} complaints
        </p>

      </div>

    </div>
  );
}

export default ComplaintTable;