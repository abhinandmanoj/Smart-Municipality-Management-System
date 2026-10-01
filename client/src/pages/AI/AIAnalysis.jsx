import MainLayout from "../../layout/MainLayout";

import {
  FaRobot,
  FaBrain,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBuilding,
  FaPercentage,
  FaImage,
} from "react-icons/fa";

function AIAnalysis() {
  return (
    <MainLayout>

      <div>

        {/* Header */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold text-white">
              AI Complaint Analysis
            </h1>

            <p className="text-gray-400 mt-2">
              Artificial Intelligence powered complaint classification
            </p>

          </div>

          <div className="bg-orange-500 p-4 rounded-2xl">

            <FaRobot className="text-4xl text-white" />

          </div>

        </div>

        {/* Image + Prediction */}

        <div className="grid grid-cols-2 gap-8 mt-10">

          {/* Uploaded Image */}

          <div className="bg-[#1E293B] rounded-2xl p-8">

            <h2 className="text-2xl text-white font-bold mb-6">
              Uploaded Image
            </h2>

            <div className="h-[350px] bg-[#0F172A] rounded-xl flex flex-col justify-center items-center">

              <FaImage className="text-7xl text-orange-500" />

              <p className="text-gray-500 mt-4">
                Complaint image preview
              </p>

            </div>

          </div>

          {/* AI Prediction */}

          <div className="bg-[#1E293B] rounded-2xl p-8">

            <h2 className="text-2xl text-white font-bold mb-8">
              AI Prediction
            </h2>

            <div className="space-y-6">

              <div className="flex gap-4 items-center">

                <FaBrain className="text-blue-500 text-3xl"/>

                <div>

                  <h3 className="text-gray-400">
                    Category
                  </h3>

                  <p className="text-xl text-white">
                    Garbage Overflow
                  </p>

                </div>

              </div>

              <div className="flex gap-4 items-center">

                <FaExclamationTriangle className="text-red-500 text-3xl"/>

                <div>

                  <h3 className="text-gray-400">
                    Priority
                  </h3>

                  <p className="text-red-400 text-xl">
                    High
                  </p>

                </div>

              </div>

              <div className="flex gap-4 items-center">

                <FaBuilding className="text-green-500 text-3xl"/>

                <div>

                  <h3 className="text-gray-400">
                    Department
                  </h3>

                  <p className="text-white text-xl">
                    Sanitation Department
                  </p>

                </div>

              </div>

              <div className="flex gap-4 items-center">

                <FaPercentage className="text-orange-500 text-3xl"/>

                <div>

                  <h3 className="text-gray-400">
                    Confidence
                  </h3>

                  <p className="text-white text-xl">
                    96%
                  </p>

                </div>

              </div>

              <div className="flex gap-4 items-center">

                <FaCheckCircle className="text-green-500 text-3xl"/>

                <div>

                  <h3 className="text-gray-400">
                    Recommendation
                  </h3>

                  <p className="text-white">
                    Assign immediately to the Sanitation Department.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* AI Summary */}

        <div className="bg-[#1E293B] rounded-2xl p-8 mt-10">

          <h2 className="text-2xl font-bold text-white">

            AI Generated Summary

          </h2>

          <p className="text-gray-300 leading-8 mt-6">

            AI identified the uploaded complaint as a garbage overflow issue.
            Based on image analysis and complaint description, the priority
            has been marked as HIGH because it affects public hygiene.
            The complaint should be assigned to the Sanitation Department
            immediately.

          </p>

        </div>

      </div>

    </MainLayout>
  );
}

export default AIAnalysis;