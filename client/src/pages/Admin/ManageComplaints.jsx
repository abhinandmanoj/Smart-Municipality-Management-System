import AdminLayout from "../../layouts/AdminLayout";
import ComplaintTable from "../../components/admin/ComplaintTable";
import {
  FaSearch,
  FaFilter,
  FaPlus,
} from "react-icons/fa";

function ManageComplaints() {
  return (
    <AdminLayout>

      {/* Page Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold text-white">

            Manage Complaints

          </h1>

          <p className="text-gray-400 mt-2">

            View, assign and manage citizen complaints.

          </p>

        </div>

      </div>

      {/* Search & Filter */}

      <div className="bg-[#111827] rounded-2xl border border-gray-800 p-6 mb-8">

        <div className="grid lg:grid-cols-4 gap-4">

          {/* Search */}

          <div className="relative">

            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-[13px] pointer-events-none"/>

            <input
              type="text"
              placeholder="Search Complaint..."
              className="w-full h-[44px] bg-[#1E293B] rounded-xl pl-10 pr-4 text-white outline-none"
            />

          </div>

          {/* Category */}

          <select className="bg-[#1E293B] rounded-xl px-4 text-white">

            <option>All Categories</option>
            <option>Garbage</option>
            <option>Road</option>
            <option>Street Light</option>
            <option>Water Supply</option>

          </select>

          {/* Status */}

          <select className="bg-[#1E293B] rounded-xl px-4 text-white">

            <option>All Status</option>
            <option>Pending</option>
            <option>Assigned</option>
            <option>Resolved</option>

          </select>

          {/* Filter Button */}

          <button className="bg-orange-500 hover:bg-orange-600 rounded-xl text-white flex items-center justify-center gap-2">

            <FaFilter />

            Apply Filters

          </button>

        </div>

      </div>

      {/* Complaint Table */}

      <ComplaintTable />

    </AdminLayout>
  );
}

export default ManageComplaints;