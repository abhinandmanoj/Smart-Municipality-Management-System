import {
  FaBuilding,
  FaCheckCircle,
} from "react-icons/fa";

function DepartmentPerformance() {

  const departments = [
    { name: "Sanitation", progress: 95 },
    { name: "Roads", progress: 80 },
    { name: "Water Supply", progress: 70 },
    { name: "Electrical", progress: 98 },
    { name: "Health", progress: 88 },
  ];

  return (
    <div className="bg-[#111827] rounded-2xl border border-gray-800 p-6 shadow-lg">

      <div className="flex items-center gap-3 mb-6">

        <FaBuilding className="text-orange-500 text-2xl" />

        <div>

          <h2 className="text-2xl font-bold text-white">
            Department Performance
          </h2>

          <p className="text-gray-400">
            Monthly resolution performance
          </p>

        </div>

      </div>

      <div className="space-y-5">

        {departments.map((dept, index) => (

          <div key={index}>

            <div className="flex justify-between mb-2">

              <span className="text-white">

                {dept.name}

              </span>

              <span className="text-green-400 font-semibold">

                {dept.progress}%

              </span>

            </div>

            <div className="w-full h-3 bg-[#1E293B] rounded-full">

              <div
                className="h-3 bg-orange-500 rounded-full"
                style={{ width: `${dept.progress}%` }}
              ></div>

            </div>

          </div>

        ))}

      </div>

      <div className="mt-6 flex items-center gap-2 text-green-400">

        <FaCheckCircle />

        Overall Performance Excellent

      </div>

    </div>
  );
}

export default DepartmentPerformance;