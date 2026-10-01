import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", complaints: 45 },
  { month: "Feb", complaints: 55 },
  { month: "Mar", complaints: 50 },
  { month: "Apr", complaints: 72 },
  { month: "May", complaints: 80 },
  { month: "Jun", complaints: 90 },
  { month: "Jul", complaints: 85 },
  { month: "Aug", complaints: 110 },
];

function AnalyticsChart() {
  return (
    <div className="bg-[#111827] rounded-xl shadow-lg p-5">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">

        <div>

          <h2 className="text-xl font-semibold text-white">
            Complaint Analytics
          </h2>

          <p className="text-gray-400 text-sm">
            Monthly complaint trend
          </p>

        </div>

        <select className="bg-[#1E293B] text-gray-300 text-sm px-3 py-2 rounded-lg border border-gray-700 outline-none">
          <option>This Year</option>
          <option>Last Year</option>
        </select>

      </div>

      {/* Chart */}

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>

          <defs>

            <linearGradient id="complaints" x1="0" y1="0" x2="0" y2="1">

              <stop offset="5%" stopColor="#F97316" stopOpacity={0.6}/>

              <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>

            </linearGradient>

          </defs>

          <CartesianGrid stroke="#374151" strokeDasharray="3 3" />

          <XAxis dataKey="month" stroke="#9CA3AF" />

          <YAxis stroke="#9CA3AF" />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="complaints"
            stroke="#F97316"
            strokeWidth={3}
            fill="url(#complaints)"
          />

        </AreaChart>
      </ResponsiveContainer>

      {/* Footer */}

      <div className="grid grid-cols-3 gap-4 mt-5 border-t border-gray-800 pt-4">

        <div>

          <p className="text-gray-400 text-xs">
            Total
          </p>

          <h3 className="text-white text-xl font-bold">
            125
          </h3>

        </div>

        <div>

          <p className="text-gray-400 text-xs">
            Resolved
          </p>

          <h3 className="text-green-400 text-xl font-bold">
            102
          </h3>

        </div>

        <div>

          <p className="text-gray-400 text-xs">
            Pending
          </p>

          <h3 className="text-orange-400 text-xl font-bold">
            18
          </h3>

        </div>

      </div>

    </div>
  );
}

export default AnalyticsChart;