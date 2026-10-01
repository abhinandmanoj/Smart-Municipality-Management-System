import { FaTimes } from "react-icons/fa";

function ComplaintModal({ complaint, onClose }) {
  if (!complaint) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

      <div className="bg-[#111827] rounded-2xl w-[700px] p-8 border border-gray-800">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-3xl font-bold text-white">
            Complaint Details
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes size={24} />
          </button>

        </div>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-gray-400">Complaint ID</p>
            <h3 className="text-white">{complaint.id}</h3>
          </div>

          <div>
            <p className="text-gray-400">Citizen</p>
            <h3 className="text-white">{complaint.citizen}</h3>
          </div>

          <div>
            <p className="text-gray-400">Category</p>
            <h3 className="text-white">{complaint.category}</h3>
          </div>

          <div>
            <p className="text-gray-400">Department</p>
            <h3 className="text-white">{complaint.department}</h3>
          </div>

          <div>
            <p className="text-gray-400">Priority</p>
            <h3 className="text-red-400">{complaint.priority}</h3>
          </div>

          <div>
            <p className="text-gray-400">Status</p>
            <h3 className="text-orange-400">{complaint.status}</h3>
          </div>

        </div>

        <div className="mt-8">

          <p className="text-gray-400">
            Description
          </p>

          <div className="bg-[#1E293B] rounded-xl p-4 mt-2 text-gray-300">

            Garbage is overflowing near the market entrance for the last three days.

          </div>

        </div>

        <div className="mt-8 flex justify-end">

          <button
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl text-white"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

export default ComplaintModal;