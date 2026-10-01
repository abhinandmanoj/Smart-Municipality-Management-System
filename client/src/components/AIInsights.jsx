import {
  FaRobot,
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

function AIInsights() {
  return (
    <div className="bg-[#1E293B] rounded-2xl p-6 shadow-lg h-full">

      <div className="flex items-center gap-3 mb-6">

        <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">

          <FaRobot className="text-white text-2xl" />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-white">
            AI Insights
          </h2>

          <p className="text-gray-400 text-sm">
            Complaint Prediction
          </p>

        </div>

      </div>

      <div className="space-y-5">

        <div className="bg-[#0F172A] rounded-xl p-4">

          <div className="flex items-center gap-3">

            <FaExclamationTriangle className="text-red-500 text-xl" />

            <div>

              <h3 className="text-white font-semibold">
                Top Complaint
              </h3>

              <p className="text-gray-400">
                Garbage Overflow
              </p>

            </div>

          </div>

        </div>

        <div className="bg-[#0F172A] rounded-xl p-4">

          <div className="flex items-center gap-3">

            <FaChartLine className="text-blue-400 text-xl" />

            <div>

              <h3 className="text-white font-semibold">
                Prediction
              </h3>

              <p className="text-gray-400">
                Complaints may increase by 12%
              </p>

            </div>

          </div>

        </div>

        <div className="bg-[#0F172A] rounded-xl p-4">

          <div className="flex items-center gap-3">

            <FaCheckCircle className="text-green-500 text-xl" />

            <div>

              <h3 className="text-white font-semibold">
                Resolution Rate
              </h3>

              <p className="text-gray-400">
                92% Complaints Resolved
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AIInsights;