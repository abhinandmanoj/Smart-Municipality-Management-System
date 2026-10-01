import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaClipboardList,
  FaMapMarkerAlt,
  FaImage,
  FaPaperPlane,
  FaArrowLeft,
} from "react-icons/fa";

function RegisterComplaint() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "Medium",
    location: "",
    description: "",
    image: null,
  });

  const [imageName, setImageName] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({
        ...formData,
        image: files[0],
      });

      setImageName(files[0]?.name || "");
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.category ||
      !formData.location ||
      !formData.description
    ) {
      alert("Please fill all required fields.");
      return;
    }

    console.log("Complaint:", formData);

    alert("Complaint submitted successfully!");

    // Backend API will be connected here later.
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* ================= NAVBAR ================= */}

      <nav className="bg-[#0B1B2B] text-white">

        <div className="max-w-7xl mx-auto px-6">

          <div className="h-20 flex items-center justify-between">

            {/* LOGO */}

            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer"
            >

              <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] flex items-center justify-center">

                <FaBuilding className="text-[#0B1B2B]" />

              </div>

              <div>

                <h1 className="font-bold text-lg">
                  Smart Municipality
                </h1>

                <p className="text-xs text-gray-400">
                  Digital Civic Services
                </p>

              </div>

            </div>


            {/* NAVIGATION */}

            <div className="hidden md:flex items-center gap-8">

              <button
                onClick={() => navigate("/")}
                className="text-gray-300 hover:text-white"
              >
                Home
              </button>

              <button
                onClick={() => navigate("/services")}
                className="text-gray-300 hover:text-white"
              >
                Services
              </button>

              <button
                onClick={() => navigate("/departments")}
                className="text-gray-300 hover:text-white"
              >
                Departments
              </button>

              <button className="text-[#E8AA0C] font-semibold">
                Register Complaint
              </button>

            </div>


            {/* AUTH */}

            <div className="flex items-center gap-3">

              <button
                onClick={() => navigate("/login")}
                className="hidden sm:block text-gray-300 hover:text-white"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="bg-[#E8AA0C] text-[#0B1B2B] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#f3bd25] transition"
              >
                Register
              </button>

            </div>

          </div>

        </div>

      </nav>


      {/* ================= PAGE HEADER ================= */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-7xl mx-auto px-6 py-14">

          <button
            onClick={() => navigate("/services")}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6"
          >
            <FaArrowLeft />
            Back to Services
          </button>

          <p className="text-[#E8AA0C] text-sm font-semibold uppercase tracking-widest">
            Citizen Service
          </p>

          <h1 className="text-4xl font-bold mt-3">
            Register a Complaint
          </h1>

          <p className="text-gray-400 mt-3 max-w-2xl">
            Report a civic issue to your municipality. Provide
            accurate details so the concerned department can
            respond quickly.
          </p>

        </div>

      </section>


      {/* ================= FORM ================= */}

      <main className="max-w-5xl mx-auto px-6 py-14">

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#DCE3EA] rounded-2xl shadow-sm overflow-hidden"
        >

          {/* FORM TITLE */}

          <div className="px-7 py-6 border-b border-[#E5EAF0]">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-[#10263B] text-[#E8AA0C] flex items-center justify-center">

                <FaClipboardList />

              </div>

              <div>

                <h2 className="text-xl font-bold text-[#0B1B2B]">
                  Complaint Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Enter the details of the civic issue.
                </p>

              </div>

            </div>

          </div>


          <div className="p-7 space-y-7">

            {/* TITLE + CATEGORY */}

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Complaint Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: Road damaged near bus stop"
                  className="w-full border border-[#D6DDE5] rounded-lg px-4 py-3 outline-none focus:border-[#E8AA0C] focus:ring-1 focus:ring-[#E8AA0C]"
                />

              </div>


              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-[#D6DDE5] rounded-lg px-4 py-3 outline-none bg-white focus:border-[#E8AA0C]"
                >

                  <option value="">
                    Select Category
                  </option>

                  <option value="Garbage">
                    Garbage
                  </option>

                  <option value="Road Damage">
                    Road Damage
                  </option>

                  <option value="Water Supply">
                    Water Supply
                  </option>

                  <option value="Street Light">
                    Street Light
                  </option>

                  <option value="Drainage">
                    Drainage
                  </option>

                  <option value="Health">
                    Health
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

            </div>


            {/* PRIORITY + LOCATION */}

            <div className="grid md:grid-cols-2 gap-6">

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full border border-[#D6DDE5] rounded-lg px-4 py-3 outline-none bg-white focus:border-[#E8AA0C]"
                >

                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                </select>

              </div>


              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>

                <div className="flex items-center border border-[#D6DDE5] rounded-lg px-4 focus-within:border-[#E8AA0C]">

                  <FaMapMarkerAlt className="text-[#D89A00]" />

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter complaint location"
                    className="w-full px-3 py-3 outline-none"
                  />

                </div>

              </div>

            </div>


            {/* DESCRIPTION */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the problem clearly..."
                className="w-full border border-[#D6DDE5] rounded-lg px-4 py-3 outline-none resize-none focus:border-[#E8AA0C] focus:ring-1 focus:ring-[#E8AA0C]"
              />

            </div>


            {/* IMAGE */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Complaint Image
              </label>

              <label className="border-2 border-dashed border-[#D6DDE5] rounded-xl p-7 flex flex-col items-center justify-center cursor-pointer hover:border-[#E8AA0C] transition">

                <FaImage className="text-3xl text-[#D89A00]" />

                <p className="font-semibold text-gray-700 mt-3">
                  Upload an image
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG or JPEG
                </p>

                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />

              </label>


              {imageName && (

                <p className="text-sm text-green-600 mt-3">
                  Selected: {imageName}
                </p>

              )}

            </div>


            {/* AI NOTICE */}

            <div className="bg-[#FFF8E6] border border-[#F3D98A] rounded-lg p-4">

              <p className="text-sm font-semibold text-[#8A6500]">
                AI-Assisted Complaint Processing
              </p>

              <p className="text-xs text-[#927A35] mt-1 leading-5">
                After submission, our AI system can analyse the
                complaint and suggest the appropriate category
                and municipal department.
              </p>

            </div>


            {/* BUTTON */}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">

              <button
                type="submit"
                className="flex-1 bg-[#E8AA0C] text-[#0B1B2B] font-bold py-3.5 rounded-lg hover:bg-[#f3bd25] transition flex items-center justify-center gap-2"
              >

                <FaPaperPlane />

                Submit Complaint

              </button>


              <button
                type="button"
                onClick={() => navigate("/")}
                className="sm:w-32 border border-[#D6DDE5] text-gray-600 font-semibold py-3.5 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>

            </div>

          </div>

        </form>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="bg-[#071521] text-white py-8">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between gap-4">

            <div>

              <h3 className="font-bold">
                Smart Municipality
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                Digital civic services for a better community.
              </p>

            </div>

            <p className="text-gray-500 text-sm">
              © 2026 Smart Municipality
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default RegisterComplaint;