import MainLayout from "../../layout/MainLayout";

import {
  FaMoon,
  FaBell,
  FaLanguage,
  FaShieldAlt,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";

function Settings() {
  return (
    <MainLayout>

      <div>

        {/* Header */}

        <h1 className="text-4xl font-bold text-white">
          Settings
        </h1>

        <p className="text-gray-400 mt-2">
          Manage your application preferences
        </p>

        {/* Settings Cards */}

        <div className="grid grid-cols-2 gap-8 mt-10">

          {/* Appearance */}

          <div className="bg-[#1E293B] rounded-2xl p-6">

            <div className="flex items-center gap-4">

              <FaMoon className="text-4xl text-orange-500" />

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Appearance
                </h2>

                <p className="text-gray-400">
                  Dark / Light Mode
                </p>

              </div>

            </div>

            <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl">

              Dark Mode

            </button>

          </div>

          {/* Notifications */}

          <div className="bg-[#1E293B] rounded-2xl p-6">

            <div className="flex items-center gap-4">

              <FaBell className="text-4xl text-blue-500" />

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Notifications
                </h2>

                <p className="text-gray-400">
                  Email & Push Notifications
                </p>

              </div>

            </div>

            <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl">

              Enabled

            </button>

          </div>

          {/* Language */}

          <div className="bg-[#1E293B] rounded-2xl p-6">

            <div className="flex items-center gap-4">

              <FaLanguage className="text-4xl text-green-500" />

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Language
                </h2>

                <p className="text-gray-400">
                  Select your preferred language
                </p>

              </div>

            </div>

            <select className="mt-6 w-full bg-[#0F172A] p-3 rounded-xl text-white">

              <option>English</option>
              <option>Malayalam</option>
              <option>Hindi</option>

            </select>

          </div>

          {/* Security */}

          <div className="bg-[#1E293B] rounded-2xl p-6">

            <div className="flex items-center gap-4">

              <FaShieldAlt className="text-4xl text-red-500" />

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Security
                </h2>

                <p className="text-gray-400">
                  Password & Account Security
                </p>

              </div>

            </div>

            <button className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl">

              Change Password

            </button>

          </div>

        </div>

        {/* Account */}

        <div className="bg-[#1E293B] rounded-2xl p-8 mt-10">

          <div className="flex justify-between items-center">

            <div className="flex items-center gap-4">

              <FaUserShield className="text-5xl text-orange-500" />

              <div>

                <h2 className="text-3xl font-bold text-white">
                  Account
                </h2>

                <p className="text-gray-400">
                  Manage your account
                </p>

              </div>

            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl flex items-center gap-3">

              <FaSignOutAlt />

              Logout

            </button>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default Settings;