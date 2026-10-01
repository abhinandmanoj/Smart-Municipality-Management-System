import AdminLayout from "../../layouts/AdminLayout";

function Settings() {
  return (
    <AdminLayout>

      <h1 className="text-4xl font-bold text-white mb-8">
        Settings
      </h1>

      <div className="bg-[#111827] rounded-2xl border border-gray-800 p-8">

        <div className="mb-6">

          <label className="block text-gray-400 mb-2">
            Municipality Name
          </label>

          <input
            type="text"
            defaultValue="Smart Municipality"
            className="w-full bg-[#1E293B] rounded-xl p-3 text-white outline-none"
          />

        </div>

        <div className="mb-6">

          <label className="block text-gray-400 mb-2">
            Contact Email
          </label>

          <input
            type="email"
            defaultValue="admin@municipality.com"
            className="w-full bg-[#1E293B] rounded-xl p-3 text-white outline-none"
          />

        </div>

        <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl text-white font-semibold">

          Save Changes

        </button>

      </div>

    </AdminLayout>
  );
}

export default Settings;