import AdminLayout from "../../layouts/AdminLayout";
import {
  FaSearch,
  FaUserCircle,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

function ManageCitizens() {

  const citizens = [
    {
      id: "USR001",
      name: "Rahul Kumar",
      email: "rahul@gmail.com",
      phone: "9876543210",
      complaints: 5,
      status: "Active",
    },
    {
      id: "USR002",
      name: "Anjali",
      email: "anjali@gmail.com",
      phone: "9876543211",
      complaints: 2,
      status: "Active",
    },
    {
      id: "USR003",
      name: "Arjun",
      email: "arjun@gmail.com",
      phone: "9876543212",
      complaints: 8,
      status: "Blocked",
    },
  ];

  return (
    <AdminLayout>

      {/* Title */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-white">
          Manage Citizens
        </h1>

        <p className="text-gray-400 mt-2">
          View and manage registered citizens.
        </p>

      </div>

      {/* Search */}

      <div className="bg-[#111827] rounded-2xl border border-gray-800 p-6 mb-8">

        <div className="relative">

          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-[13px] pointer-events-none"/>

          <input
            type="text"
            placeholder="Search Citizen..."
            className="w-full h-[44px] bg-[#1E293B] rounded-xl pl-10 pr-4 text-white outline-none"
          />

        </div>

      </div>

      {/* Table */}

      <div className="bg-[#111827] rounded-3xl border border-gray-800 shadow-xl overflow-x-auto">

        <table className="w-full">

          <thead className="bg-[#1E293B]">

            <tr className="text-left text-gray-400">

              <th className="p-5">Citizen</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Complaints</th>
              <th>Status</th>
              <th className="text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {citizens.map((user) => (

              <tr
                key={user.id}
                className="border-t border-gray-800 hover:bg-[#1E293B]"
              >

                <td className="p-5">

                  <div className="flex items-center gap-3">

                    <FaUserCircle className="text-4xl text-orange-500"/>

                    <div>

                      <h3 className="text-white font-semibold">

                        {user.name}

                      </h3>

                      <p className="text-gray-500 text-sm">

                        {user.id}

                      </p>

                    </div>

                  </div>

                </td>

                <td className="text-gray-300">
                  {user.email}
                </td>

                <td className="text-gray-300">
                  {user.phone}
                </td>

                <td className="text-gray-300">
                  {user.complaints}
                </td>

                <td>

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      user.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {user.status}
                  </span>

                </td>

                <td>

                  <div className="flex justify-center gap-3">

                    <button className="w-10 h-10 rounded-xl bg-blue-500 hover:bg-blue-600 flex justify-center items-center text-white">

                      <FaEye />

                    </button>

                    <button className="w-10 h-10 rounded-xl bg-green-500 hover:bg-green-600 flex justify-center items-center text-white">

                      <FaEdit />

                    </button>

                    <button className="w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 flex justify-center items-center text-white">

                      <FaTrash />

                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </AdminLayout>
  );
}

export default ManageCitizens;