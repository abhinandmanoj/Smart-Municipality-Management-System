import {
  FaRobot,
  FaBrain,
  FaExclamationTriangle,
  FaBuilding,
} from "react-icons/fa";

function AIInsights() {
  return (
    <div className="bg-[#111827] rounded-xl shadow-lg p-4 h-fit">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">

        <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
          <FaRobot className="text-white text-lg" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            AI Insights
          </h2>

          <p className="text-xs text-gray-400">
            Live Summary
          </p>
        </div>

      </div>

      {/* Items */}

      <div className="space-y-3">

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-2">

            <FaBrain className="text-purple-400" />

            <span className="text-gray-300 text-sm">
              Accuracy
            </span>

          </div>

          <span className="text-white font-semibold">
            96%
          </span>

        </div>

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-2">

            <FaExclamationTriangle className="text-red-400" />

            <span className="text-gray-300 text-sm">
              High Priority
            </span>

          </div>

          <span className="text-red-400 font-semibold">
            05
          </span>

        </div>

        <div className="flex justify-between items-center">

          <div className="flex items-center gap-2">

            <FaBuilding className="text-blue-400" />

            <span className="text-gray-300 text-sm">
              Department
            </span>

          </div>

          <span className="text-white text-sm">
            Sanitation
          </span>

        </div>

      </div>

      {/* Footer */}

      <div className="mt-4 pt-3 border-t border-gray-800">

        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 text-center">

          <p className="text-green-400 text-xs font-medium">
            AI System Active ✓
          </p>

        </div>

      </div>

    </div>
  );
}

export default AIInsights;