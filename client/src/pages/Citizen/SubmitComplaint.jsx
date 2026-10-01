import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaBuilding,
  FaBell,
  FaUser,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCamera,
  FaPaperPlane,
  FaInfoCircle,
  FaLocationArrow,
  FaSearch,
} from "react-icons/fa";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

/* ============================================================
   MAP VIEW CONTROLLER
============================================================ */

function MapViewController({ position }) {
  const map = useMap();

  if (position) {
    map.setView(position, 16, {
      animate: true,
    });
  }

  return null;
}

/* ============================================================
   MAP CLICK COMPONENT
============================================================ */

function LocationMarker({
  position,
  setPosition,
  setLocation,
}) {
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPosition([lat, lng]);

      setLocation(
        `${lat.toFixed(6)}, ${lng.toFixed(6)}`
      );
    },
  });

  if (!position) {
    return null;
  }

  return (
    <CircleMarker
      center={position}
      radius={10}
      pathOptions={{
        color: "#E8AA0C",
        fillColor: "#E8AA0C",
        fillOpacity: 0.9,
      }}
    />
  );
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

function SubmitComplaint() {
  const navigate = useNavigate();

  /* ============================================================
     FORM DATA
  ============================================================ */

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    priority: "Medium",
  });

  /* ============================================================
     IMAGE
  ============================================================ */

  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");

  /* ============================================================
     SUBMISSION
  ============================================================ */

  const [submitted, setSubmitted] = useState(false);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ============================================================
     MAP
  ============================================================ */

  const [position, setPosition] = useState(null);

  const defaultPosition = [10.8505, 76.2711];

  /* ============================================================
     LOCATION SEARCH
  ============================================================ */

  const [searchLocation, setSearchLocation] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchingLocation, setSearchingLocation] =
    useState(false);

  /* ============================================================
     HANDLE INPUT
  ============================================================ */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ============================================================
     IMAGE
  ============================================================ */

  const handleImage = (e) => {
    if (
      e.target.files &&
      e.target.files[0]
    ) {
      const selectedImage = e.target.files[0];

      if (
        selectedImage.size >
        5 * 1024 * 1024
      ) {
        alert(
          "Image size must be less than 5 MB."
        );
        return;
      }

      setImage(selectedImage);

      // Convert to base64 so it can be sent to the backend
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImageBase64(ev.target.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  /* ============================================================
     SEARCH LOCATION
  ============================================================ */

  const handleSearchLocation = async () => {
    const query = searchLocation.trim();

    if (!query) {
      alert("Please enter a location to search.");
      return;
    }

    try {
      setSearchingLocation(true);
      setSearchResults([]);

      const url =
        `https://nominatim.openstreetmap.org/search` +
        `?format=json` +
        `&q=${encodeURIComponent(query)}` +
        `&limit=5` +
        `&countrycodes=in` +
        `&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Accept-Language": "en",
        },
      });

      if (!response.ok) {
        throw new Error(
          "Location search failed"
        );
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        alert(
          "Location not found. Try another place name."
        );
        setSearchResults([]);
        return;
      }

      setSearchResults(data);
    } catch (error) {
      console.error(
        "Location search error:",
        error
      );

      alert(
        "Unable to search location. Please check your internet connection and try again."
      );
    } finally {
      setSearchingLocation(false);
    }
  };

  /* ============================================================
     SELECT SEARCH RESULT
  ============================================================ */

  const handleSelectLocation = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    setPosition([lat, lng]);

    setFormData((previous) => ({
      ...previous,
      location:
        result.display_name ||
        `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    }));

    setSearchLocation(
      result.display_name || ""
    );

    setSearchResults([]);
  };

  /* ============================================================
     SEARCH ON ENTER
  ============================================================ */

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchLocation();
    }
  };

  /* ============================================================
     USE CURRENT LOCATION
  ============================================================ */

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const lat =
          location.coords.latitude;

        const lng =
          location.coords.longitude;

        setPosition([lat, lng]);

        setFormData((previous) => ({
          ...previous,
          location: `${lat.toFixed(
            6
          )}, ${lng.toFixed(6)}`,
        }));

        setSearchLocation(
          `${lat.toFixed(
            6
          )}, ${lng.toFixed(6)}`
        );

        setSearchResults([]);
      },
      (error) => {
        console.error(
          "Location error:",
          error
        );

        alert(
          "Unable to get your location. Please allow location permission or search/select the location manually."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  /* ============================================================
     SUBMIT COMPLAINT
  ============================================================ */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /* ----------------------------------------------------------
       REQUIRED FIELD CHECK
    ---------------------------------------------------------- */

    if (
      !formData.title ||
      !formData.category ||
      !formData.description ||
      !formData.location
    ) {
      alert(
        "Please fill in all required fields."
      );
      return;
    }

    try {
      setLoading(true);

      /* --------------------------------------------------------
         GET LOGGED-IN USER
      -------------------------------------------------------- */

      const storedUser =
        localStorage.getItem("user");

      const token =
        localStorage.getItem("token");

      if (!storedUser) {
        alert(
          "Please login before submitting a complaint."
        );

        navigate("/login");

        return;
      }

      let user;

      try {
        user = JSON.parse(storedUser);
      } catch (error) {
        console.error(
          "Invalid user data:",
          error
        );

        alert(
          "Session data is invalid. Please login again."
        );

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        navigate("/login");

        return;
      }

      /* --------------------------------------------------------
         CATEGORY MAPPING
      -------------------------------------------------------- */

      const categoryMap = {
        "Road & Transport":
          "Road Damage",

        "Waste Management":
          "Garbage",

        "Water Supply":
          "Water Supply",

        Electrical:
          "Street Light",

        Drainage:
          "Drainage",

        "Public Health":
          "Health",

        Parks:
          "Other",

        Other:
          "Other",
      };

      /* --------------------------------------------------------
         LATITUDE / LONGITUDE
      -------------------------------------------------------- */

      const latitude = position
        ? position[0]
        : null;

      const longitude = position
        ? position[1]
        : null;

      /* --------------------------------------------------------
         COMPLAINT DATA
      -------------------------------------------------------- */

      const complaintData = {
        title: formData.title,

        citizenName:
          user.name ||
          user.fullName ||
          "",

        email:
          user.email ||
          "",

        phone:
          user.phone ||
          "",

        category:
          categoryMap[
            formData.category
          ] || "Other",

        department:
          formData.category,

        description:
          formData.description,

        location:
          formData.location,

        latitude:
          latitude,

        longitude:
          longitude,

        priority:
          formData.priority,

        image: imageBase64 || "",
      };

      /* --------------------------------------------------------
         USER DETAILS CHECK
      -------------------------------------------------------- */

      if (
        !complaintData.citizenName ||
        !complaintData.email ||
        !complaintData.phone
      ) {
        alert(
          "Your profile information is incomplete. Please update your name, email and phone number."
        );

        setLoading(false);

        return;
      }

      console.log(
        "Sending complaint:",
        complaintData
      );

      /* --------------------------------------------------------
         SEND TO BACKEND
      -------------------------------------------------------- */

      const response = await axios.post(
        "http://localhost:5000/api/complaints",
        complaintData,
        {
          headers: token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {},
        }
      );

      console.log(
        "Complaint saved:",
        response.data
      );

      setComplaint(
        response.data.complaint ||
          response.data
      );

      setSubmitted(true);
    } catch (error) {
      console.error(
        "Complaint submission error:",
        error.response?.data ||
          error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to submit complaint. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     SUCCESS PAGE
  ============================================================ */

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">

        {/* NAVBAR */}

        <nav className="bg-[#0B1B2B] text-white">

          <div className="max-w-7xl mx-auto px-6">

            <div className="h-[68px] flex items-center justify-between">

              <div
                onClick={() =>
                  navigate("/dashboard")
                }
                className="flex items-center gap-3 cursor-pointer"
              >

                <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] flex items-center justify-center">

                  <FaBuilding className="text-[#0B1B2B]" />

                </div>

                <div>

                  <h1 className="text-[18px] leading-5 font-bold">
                    Smart Municipality
                  </h1>

                  <p className="text-[10px] text-gray-400">
                    Citizen Services
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4">

                <button
                  onClick={() =>
                    navigate(
                      "/notifications"
                    )
                  }
                  className="text-gray-300 hover:text-white"
                >
                  <FaBell />
                </button>

                <button
                  onClick={() =>
                    navigate("/profile")
                  }
                  className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center"
                >
                  <FaUser className="text-[#E8AA0C]" />
                </button>

              </div>

            </div>

          </div>

        </nav>

        {/* SUCCESS */}

        <main className="max-w-3xl mx-auto px-6 py-16">

          <div className="bg-white border border-[#DCE3EA] rounded-2xl p-8 md:p-12 text-center">

            <div className="w-20 h-20 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>

            <p className="text-[#A97400] text-xs font-bold uppercase tracking-widest mt-7">
              Complaint Submitted
            </p>

            <h1 className="text-3xl font-bold mt-3 text-[#0B1B2B]">
              Your complaint has been registered
            </h1>

            <p className="text-gray-500 text-sm leading-6 max-w-xl mx-auto mt-4">
              Thank you for reporting this
              civic issue. The complaint has
              been forwarded to the
              appropriate municipal
              department.
            </p>

            <div className="bg-[#F8FAFC] border border-[#E8ECF0] rounded-xl p-5 mt-7 text-left">

              <p className="text-xs text-gray-400 uppercase font-bold">
                Complaint Reference
              </p>

              <p className="text-xl font-bold text-[#0B1B2B] mt-2">

                {complaint?.complaintId ||
                  complaint?._id ||
                  "Processing..."}

              </p>

              <p className="text-xs text-gray-500 mt-2">
                Keep this reference number to
                track your complaint.
              </p>

            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">

              <button
                onClick={() =>
                  navigate(
                    "/my-complaints"
                  )
                }
                className="bg-[#0B1B2B] text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-[#132B40]"
              >
                Track My Complaint
              </button>

              <button
                onClick={() => {

                  setSubmitted(false);

                  setComplaint(null);

                  setPosition(null);

                  setSearchLocation("");

                  setSearchResults([]);

                  setFormData({
                    title: "",
                    category: "",
                    description: "",
                    location: "",
                    priority: "Medium",
                  });

                  setImage(null);

                }}
                className="border border-[#DCE3EA] px-6 py-3 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50"
              >
                Register Another
              </button>

            </div>

          </div>

        </main>

      </div>
    );
  }

  /* ============================================================
     MAIN FORM
  ============================================================ */

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0B1B2B]">

      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <nav className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1280px] mx-auto px-6">

          <div className="h-[68px] flex items-center justify-between">

            {/* LOGO */}

            <div
              onClick={() =>
                navigate("/dashboard")
              }
              className="flex items-center gap-3 cursor-pointer shrink-0"
            >

              <div className="w-10 h-10 bg-[#E8AA0C] rounded-lg flex items-center justify-center">

                <FaBuilding className="text-[#0B1B2B]" />

              </div>

              <div>

                <div className="text-[18px] leading-5 font-bold text-white">
                  Smart Municipality
                </div>

                <div className="text-[10px] leading-4 text-gray-400">
                  Citizen Services
                </div>

              </div>

            </div>

            {/* NAVIGATION */}

            <div className="hidden lg:flex items-center gap-2 ml-auto mr-6">

              <button
                onClick={() =>
                  navigate("/dashboard")
                }
                className="px-5 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5"
              >
                Home
              </button>

              <button
                className="px-5 py-2.5 rounded-md bg-[#E8AA0C] text-[#0B1B2B] text-[14px] font-bold"
              >
                Register Complaint
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/my-complaints"
                  )
                }
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5"
              >
                My Complaints
              </button>

              <button
                onClick={() =>
                  navigate("/departments")
                }
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5"
              >
                Departments
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/notifications"
                  )
                }
                className="px-4 py-2.5 rounded-md text-[14px] text-gray-300 hover:text-white hover:bg-white/5"
              >
                Notifications
              </button>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-3 shrink-0">

              <button
                onClick={() =>
                  navigate(
                    "/notifications"
                  )
                }
                className="relative w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white"
              >

                <FaBell className="text-[15px]" />

                <span className="absolute top-0 right-0 w-[16px] h-[16px] rounded-full bg-[#E8AA0C] text-[#0B1B2B] text-[9px] font-bold flex items-center justify-center">
                  3
                </span>

              </button>

              <button
                onClick={() =>
                  navigate("/profile")
                }
                className="w-9 h-9 rounded-md bg-white/10 flex items-center justify-center"
              >

                <FaUser className="text-[#E8AA0C] text-[13px]" />

              </button>

            </div>

          </div>

        </div>

      </nav>

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <section className="bg-[#0B1B2B] text-white">

        <div className="max-w-[1000px] mx-auto px-6 py-9">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="flex items-center gap-2 text-gray-400 hover:text-white text-xs mb-5"
          >

            <FaArrowLeft />

            Back to Dashboard

          </button>

          <p className="text-[#E8AA0C] text-xs font-bold uppercase tracking-widest">
            Citizen Services
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Register a Complaint
          </h1>

          <p className="text-gray-400 text-sm mt-3 max-w-2xl">
            Tell us about a civic issue in
            your area. Your complaint will be
            reviewed and assigned to the
            appropriate department.
          </p>

        </div>

      </section>

      {/* ======================================================
          FORM
      ====================================================== */}

      <main className="max-w-[1000px] mx-auto px-6 py-8">

        <section className="bg-white border border-[#DCE3EA] rounded-xl p-6 md:p-8">

          {/* FORM HEADER */}

          <div className="flex items-center gap-3 mb-7">

            <div className="w-10 h-10 rounded-lg bg-[#FFF8E6] text-[#A97400] flex items-center justify-center">

              <FaInfoCircle />

            </div>

            <div>

              <h2 className="font-bold text-lg">
                Complaint Information
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Fields marked with * are required.
              </p>

            </div>

          </div>

          <form onSubmit={handleSubmit}>

            {/* =================================================
                TITLE
            ================================================= */}

            <div className="mb-5">

              <label className="text-xs font-bold text-gray-600">
                Complaint Title *
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Garbage overflowing near bus stop"
                className="w-full mt-2 border border-[#DCE3EA] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E8AA0C]"
              />

            </div>

            {/* =================================================
                CATEGORY
            ================================================= */}

            <div className="mb-5">

              <label className="text-xs font-bold text-gray-600">
                Department / Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full mt-2 border border-[#DCE3EA] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E8AA0C] bg-white"
              >

                <option value="">
                  Select a department
                </option>

                <option value="Road & Transport">
                  Road & Transport
                </option>

                <option value="Waste Management">
                  Waste Management
                </option>

                <option value="Water Supply">
                  Water Supply
                </option>

                <option value="Electrical">
                  Electrical
                </option>

                <option value="Drainage">
                  Drainage & Sewage
                </option>

                <option value="Public Health">
                  Public Health
                </option>

                <option value="Parks">
                  Parks & Public Spaces
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <div className="mb-5">

              <label className="text-xs font-bold text-gray-600">
                Description *
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe the issue clearly. Include useful details such as what happened, when you noticed it and how it affects the area."
                className="w-full mt-2 border border-[#DCE3EA] rounded-lg px-4 py-3 text-sm outline-none focus:border-[#E8AA0C] resize-none"
              />

            </div>

            {/* =================================================
                LOCATION
            ================================================= */}

            <div className="mb-5">

              <div className="flex items-center justify-between mb-2">

                <label className="text-xs font-bold text-gray-600">
                  Location *
                </label>

                <button
                  type="button"
                  onClick={
                    handleUseMyLocation
                  }
                  className="flex items-center gap-2 text-xs font-bold text-[#A97400] hover:text-[#8A6200]"
                >

                  <FaLocationArrow />

                  Use My Location

                </button>

              </div>

              {/* =================================================
                  SEARCH LOCATION
              ================================================= */}

              <div className="sm-search-box">

                <FaSearch className="text-[#A97400]" />

                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) =>
                    setSearchLocation(
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleSearchKeyDown
                  }
                  placeholder="Search location e.g. Kannur, Kuthuparamba, Nemmara..."
                  className="h-[44px] border border-[#DCE3EA] rounded-lg pr-[110px] text-sm outline-none focus:border-[#E8AA0C]"
                />

                <button
                  type="button"
                  onClick={
                    handleSearchLocation
                  }
                  disabled={
                    searchingLocation
                  }
                  style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)' }}
                  className="h-[34px] bg-[#E8AA0C] text-[#0B1B2B] px-4 rounded-md text-xs font-bold hover:bg-[#d99d00] disabled:bg-gray-300 disabled:text-gray-500 flex items-center whitespace-nowrap"
                >

                  {searchingLocation
                    ? "Searching..."
                    : "Search"}

                </button>

              </div>

              {/* =================================================
                  SEARCH RESULTS
              ================================================= */}

              {searchResults.length >
                0 && (

                <div className="mt-2 border border-[#DCE3EA] rounded-lg bg-white shadow-lg overflow-hidden">

                  <div className="px-4 py-2 bg-[#F8FAFC] border-b border-[#E8ECF0]">

                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      Search Results
                    </p>

                  </div>

                  {searchResults.map(
                    (result, index) => (

                      <button
                        type="button"
                        key={
                          result.place_id ||
                          index
                        }
                        onClick={() =>
                          handleSelectLocation(
                            result
                          )
                        }
                        className="w-full text-left px-4 py-3 border-b border-[#F0F2F4] last:border-b-0 hover:bg-[#FFF8E6] transition flex items-start gap-3"
                      >

                        <FaMapMarkerAlt className="text-[#A97400] mt-1 shrink-0" />

                        <div>

                          <p className="text-sm font-semibold text-[#0B1B2B]">

                            {result.name ||
                              result.display_name?.split(
                                ","
                              )[0] ||
                              "Location"}

                          </p>

                          <p className="text-[11px] text-gray-500 mt-1 leading-4">

                            {result.display_name}

                          </p>

                        </div>

                      </button>

                    )
                  )}

                </div>

              )}

              {/* =================================================
                  SELECTED LOCATION
              ================================================= */}

              <div className="sm-search-box mt-3">

                <FaMapMarkerAlt className="text-[#A97400]" />

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Selected location will appear here"
                  className="h-[44px] border border-[#DCE3EA] rounded-lg pr-4 text-sm outline-none focus:border-[#E8AA0C]"
                />

              </div>

              {/* =================================================
                  MAP
              ================================================= */}

              <div className="mt-4 rounded-xl overflow-hidden border border-[#DCE3EA]">

                <MapContainer
                  center={
                    position ||
                    defaultPosition
                  }
                  zoom={
                    position ? 16 : 8
                  }
                  scrollWheelZoom={true}
                  style={{
                    height: "320px",
                    width: "100%",
                  }}
                >

                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapViewController
                    position={position}
                  />

                  <LocationMarker
                    position={position}
                    setPosition={
                      setPosition
                    }
                    setLocation={(value) =>
                      setFormData(
                        (previous) => ({
                          ...previous,
                          location:
                            value,
                        })
                      )
                    }
                  />

                </MapContainer>

              </div>

              <p className="text-[10px] text-gray-400 mt-2">

                🔎 Search a place above, click a
                search result, use your current
                location, or click anywhere on
                the map to select the exact
                location.

              </p>

              {/* COORDINATES */}

              {position && (
                <div className="mt-2 bg-[#F8FAFC] border border-[#E8ECF0] rounded-lg px-4 py-2">

                  <p className="text-[10px] text-gray-400">
                    Selected Coordinates
                  </p>

                  <p className="text-xs font-semibold text-[#0B1B2B] mt-1">

                    Latitude:{" "}
                    {position[0].toFixed(
                      6
                    )}
                    {"  |  "}
                    Longitude:{" "}
                    {position[1].toFixed(
                      6
                    )}

                  </p>

                </div>
              )}

            </div>

            {/* =================================================
                PRIORITY
            ================================================= */}

            <div className="mb-5">

              <label className="text-xs font-bold text-gray-600">
                Priority
              </label>

              <div className="grid grid-cols-3 gap-3 mt-2">

                <PriorityButton
                  value="Low"
                  current={
                    formData.priority
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      priority: "Low",
                    })
                  }
                />

                <PriorityButton
                  value="Medium"
                  current={
                    formData.priority
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      priority: "Medium",
                    })
                  }
                />

                <PriorityButton
                  value="High"
                  current={
                    formData.priority
                  }
                  onClick={() =>
                    setFormData({
                      ...formData,
                      priority: "High",
                    })
                  }
                />

              </div>

            </div>

            {/* =================================================
                IMAGE
            ================================================= */}

            <div className="mb-7">

              <label className="text-xs font-bold text-gray-600">
                Attach Image
              </label>

              <label className="mt-2 border-2 border-dashed border-[#DCE3EA] rounded-lg p-5 flex items-center gap-4 cursor-pointer hover:bg-[#FAFBFC] transition">

                <div className="w-12 h-12 rounded-lg bg-[#FFF8E6] flex items-center justify-center shrink-0">

                  <FaCamera className="text-xl text-[#A97400]" />

                </div>

                <div>

                  <p className="text-sm font-semibold">

                    {image
                      ? image.name
                      : "Upload an image"}

                  </p>

                  <p className="text-[10px] text-gray-400 mt-1">

                    JPG, PNG or JPEG • Maximum
                    5 MB

                  </p>

                </div>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImage}
                  className="hidden"
                />

              </label>

            </div>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3.5 rounded-lg flex items-center justify-center gap-3 font-bold text-sm transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#0B1B2B] hover:bg-[#132B40]"
              }`}
            >

              <FaPaperPlane className="text-[#E8AA0C]" />

              {loading
                ? "Submitting Complaint..."
                : "Submit Complaint"}

            </button>

          </form>

        </section>

      </main>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="bg-[#071521] text-white mt-4">

        <div className="max-w-[1280px] mx-auto px-6 py-6">

          <div className="flex items-center justify-between">

            <p className="text-[11px] text-gray-500">
              © 2026 Smart Municipality
            </p>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="text-[11px] text-gray-400 hover:text-white"
            >
              Back to Home
            </button>

          </div>

        </div>

      </footer>

    </div>
  );
}

/* ============================================================
   PRIORITY BUTTON
============================================================ */

function PriorityButton({
  value,
  current,
  onClick,
}) {
  const active = value === current;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-3 rounded-lg border text-xs font-bold transition ${
        active
          ? "bg-[#0B1B2B] text-white border-[#0B1B2B]"
          : "bg-white text-gray-500 border-[#DCE3EA] hover:border-[#E8AA0C]"
      }`}
    >
      {value}
    </button>
  );
}

export default SubmitComplaint;