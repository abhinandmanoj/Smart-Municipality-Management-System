import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaRoad,
  FaTrash,
  FaTint,
  FaLightbulb,
  FaTree,
  FaWater,
  FaArrowRight,
  FaCheckCircle,
  FaCity,
  FaUsers,
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#0B1B2B]">

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

      <nav className="bg-[#0B1B2B] text-white sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-6">

          <div className="h-[72px] flex items-center justify-between">

            {/* LOGO */}

            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer"
            >

              <div className="w-10 h-10 rounded-lg bg-[#E8AA0C] flex items-center justify-center">
                <FaBuilding className="text-[#0B1B2B] text-lg" />
              </div>

              <div>

                <h1 className="font-bold text-base">
                  Smart Municipality
                </h1>

                <p className="text-[10px] text-gray-400">
                  Digital Citizen Services
                </p>

              </div>

            </div>


            {/* NAVIGATION */}

            <div className="hidden md:flex items-center gap-7">

              <a
                href="#home"
                className="text-white text-sm font-semibold"
              >
                Home
              </a>

              <a
                href="#about"
                className="text-gray-300 hover:text-white text-sm"
              >
                About
              </a>

              <a
                href="#services"
                className="text-gray-300 hover:text-white text-sm"
              >
                Services
              </a>

            </div>


            {/* LOGIN */}

            <button
              onClick={() => navigate("/login")}
              className="bg-[#E8AA0C] text-[#0B1B2B] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#D99D00] transition"
            >
              Login
            </button>

          </div>

        </div>

      </nav>


      {/* ================================================= */}
      {/* HERO SECTION */}
      {/* ================================================= */}

      <section
        id="home"
        className="bg-[#0B1B2B] text-white"
      >

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT */}

            <div>

              <p className="text-[#E8AA0C] text-sm font-bold uppercase tracking-widest">
                Smart Municipality
              </p>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight mt-4">

                Building a

                <span className="text-[#E8AA0C]">
                  {" "}Better City.
                </span>

              </h1>

              <p className="text-gray-400 text-base md:text-lg leading-7 mt-6 max-w-xl">
                A digital platform that connects citizens with
                municipal services. Report civic issues, access
                important services and help create a cleaner,
                safer and smarter city.
              </p>


              {/* BUTTONS */}

              <div className="flex flex-wrap gap-4 mt-8">

                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-3 bg-[#E8AA0C] text-[#0B1B2B] px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#D99D00] transition"
                >
                  Get Started
                  <FaArrowRight className="text-xs" />
                </button>

                <a
                  href="#services"
                  className="flex items-center gap-3 border border-gray-500 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-white/5 transition"
                >
                  Explore Services
                  <FaArrowRight className="text-xs" />
                </a>

              </div>

            </div>


            {/* RIGHT */}

            <div className="hidden lg:flex justify-end">

              <div className="w-[420px] bg-white/5 border border-white/10 rounded-2xl p-8">

                <div className="w-14 h-14 rounded-xl bg-[#E8AA0C] flex items-center justify-center">

                  <FaCity className="text-[#0B1B2B] text-2xl" />

                </div>

                <h2 className="text-2xl font-bold mt-7">
                  One Platform.
                  <br />
                  Many Civic Services.
                </h2>

                <p className="text-gray-400 text-sm leading-6 mt-4">
                  Smart Municipality makes it easier for
                  citizens to communicate with their local
                  government and access essential services.
                </p>


                <div className="grid grid-cols-2 gap-3 mt-7">

                  <MiniFeature
                    icon={<FaUsers />}
                    text="Citizen Friendly"
                  />

                  <MiniFeature
                    icon={<FaCheckCircle />}
                    text="Easy Tracking"
                  />

                  <MiniFeature
                    icon={<FaCity />}
                    text="Smart City"
                  />

                  <MiniFeature
                    icon={<FaBuilding />}
                    text="Digital Services"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* ABOUT SECTION */}
      {/* ================================================= */}

      <section
        id="about"
        className="bg-white"
      >

        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT */}

            <div>

              <p className="text-[#A97400] text-xs font-bold uppercase tracking-widest">
                About the Platform
              </p>

              <h2 className="text-3xl md:text-4xl font-bold mt-3">
                What is Smart Municipality?
              </h2>

              <p className="text-gray-500 text-sm leading-7 mt-5">
                Smart Municipality is a digital citizen service
                platform designed to make communication between
                citizens and municipal authorities easier and more
                efficient.
              </p>

              <p className="text-gray-500 text-sm leading-7 mt-4">
                Citizens can use the platform to report civic
                problems such as damaged roads, garbage overflow,
                water leakage and broken street lights. Municipal
                departments can then receive, manage and resolve
                these issues.
              </p>

              <p className="text-gray-500 text-sm leading-7 mt-4">
                The platform also provides intelligent tools to
                help municipal authorities manage complaints,
                categorize issues and support faster decision-making.
              </p>

            </div>


            {/* RIGHT */}

            <div className="bg-[#F5F7FA] border border-[#DCE3EA] rounded-2xl p-7 md:p-8">

              <p className="text-[#A97400] text-xs font-bold uppercase tracking-widest">
                Our Goal
              </p>

              <h3 className="text-2xl font-bold mt-3">
                Better services for everyone.
              </h3>

              <p className="text-gray-500 text-sm leading-6 mt-4">
                Our goal is to create a transparent and
                citizen-friendly municipal service system where
                civic problems can be reported and managed
                digitally.
              </p>


              <div className="space-y-4 mt-7">

                <AboutPoint
                  title="Easy Access"
                  text="Citizens can access municipal services from one platform."
                />

                <AboutPoint
                  title="Faster Response"
                  text="Complaints can be directed to the appropriate department."
                />

                <AboutPoint
                  title="Transparency"
                  text="Citizens can track the progress of their complaints."
                />

                <AboutPoint
                  title="Smart Management"
                  text="Municipal authorities can use intelligent tools to analyze civic complaints."
                />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* SERVICES SECTION */}
      {/* ================================================= */}

      <section
        id="services"
        className="bg-[#F5F7FA]"
      >

        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">

          {/* HEADING */}

          <div className="text-center max-w-2xl mx-auto">

            <p className="text-[#A97400] text-xs font-bold uppercase tracking-widest">
              Municipal Services
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              Our Services
            </h2>

            <p className="text-sm text-gray-500 leading-6 mt-4">
              Citizens can report and access services related to
              common municipal and public infrastructure issues.
            </p>

          </div>


          {/* SERVICE CARDS */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">

            <ServiceCard
              icon={<FaRoad />}
              title="Road & Transport"
              description="Report potholes, damaged roads, traffic problems and other road-related issues."
            />

            <ServiceCard
              icon={<FaTrash />}
              title="Waste Management"
              description="Report garbage overflow, missed waste collection and illegal dumping."
            />

            <ServiceCard
              icon={<FaTint />}
              title="Water Supply"
              description="Report water leakage, supply interruptions and other water-related problems."
            />

            <ServiceCard
              icon={<FaLightbulb />}
              title="Electrical Services"
              description="Report broken street lights and other public electrical infrastructure issues."
            />

            <ServiceCard
              icon={<FaTree />}
              title="Environment & Public Areas"
              description="Report fallen trees, public-area problems and environmental issues."
            />

            <ServiceCard
              icon={<FaWater />}
              title="Drainage & Sanitation"
              description="Report blocked drains, drainage problems and sanitation-related issues."
            />

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* CTA */}
      {/* ================================================= */}

      <section className="bg-[#0B1B2B]">

        <div className="max-w-7xl mx-auto px-6 py-14">

          <div className="flex flex-col md:flex-row items-center justify-between gap-7">

            <div>

              <p className="text-[#E8AA0C] text-xs font-bold uppercase tracking-widest">
                Get Started
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">
                Help us build a better city.
              </h2>

              <p className="text-gray-400 text-sm mt-3 max-w-xl">
                Join Smart Municipality and help improve public
                services by reporting civic issues in your area.
              </p>

            </div>


            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-3 bg-[#E8AA0C] text-[#0B1B2B] px-7 py-3.5 rounded-lg font-bold text-sm whitespace-nowrap hover:bg-[#D99D00] transition"
            >
              Get Started
              <FaArrowRight />
            </button>

          </div>

        </div>

      </section>


      {/* ================================================= */}
      {/* FOOTER */}
      {/* ================================================= */}

      <footer className="bg-[#071521] text-white">

        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex flex-col md:flex-row justify-between gap-8">

            {/* BRAND */}

            <div>

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-[#E8AA0C] flex items-center justify-center">

                  <FaBuilding className="text-[#0B1B2B]" />

                </div>

                <span className="font-bold">
                  Smart Municipality
                </span>

              </div>

              <p className="text-gray-500 text-xs mt-3 max-w-xs">
                Digital citizen services for a cleaner,
                safer and smarter city.
              </p>

            </div>


            {/* LINKS */}

            <div>

              <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Quick Links
              </p>

              <div className="flex flex-col gap-2 mt-4">

                <a
                  href="#about"
                  className="text-gray-500 text-xs hover:text-white"
                >
                  About
                </a>

                <a
                  href="#services"
                  className="text-gray-500 text-xs hover:text-white"
                >
                  Services
                </a>

                <button
                  onClick={() => navigate("/login")}
                  className="text-left text-gray-500 text-xs hover:text-white"
                >
                  Login
                </button>

              </div>

            </div>

          </div>


          <div className="border-t border-white/10 mt-8 pt-5">

            <p className="text-gray-600 text-xs">
              © 2026 Smart Municipality. All rights reserved.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}


/* ================================================= */
/* MINI FEATURE */
/* ================================================= */

function MiniFeature({
  icon,
  text,
}) {
  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg p-3">

      <div className="text-[#E8AA0C] text-sm">
        {icon}
      </div>

      <p className="text-xs text-gray-300">
        {text}
      </p>

    </div>
  );
}


/* ================================================= */
/* ABOUT POINT */
/* ================================================= */

function AboutPoint({
  title,
  text,
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="w-6 h-6 rounded-full bg-[#FFF8E6] text-[#A97400] flex items-center justify-center flex-shrink-0 mt-0.5">

        <FaCheckCircle className="text-xs" />

      </div>

      <div>

        <h4 className="font-bold text-sm">
          {title}
        </h4>

        <p className="text-xs text-gray-500 mt-1 leading-5">
          {text}
        </p>

      </div>

    </div>
  );
}


/* ================================================= */
/* SERVICE CARD */
/* ================================================= */

function ServiceCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="bg-white border border-[#DCE3EA] rounded-xl p-6 hover:shadow-md hover:-translate-y-1 transition-all">

      <div className="w-12 h-12 rounded-lg bg-[#0B1B2B] text-[#E8AA0C] flex items-center justify-center text-lg">

        {icon}

      </div>

      <h3 className="font-bold text-lg mt-5">
        {title}
      </h3>

      <p className="text-sm text-gray-500 leading-6 mt-2">
        {description}
      </p>

      <div className="flex items-center gap-2 text-xs font-bold text-[#A97400] mt-5">

        Report an Issue

        <FaArrowRight className="text-[9px]" />

      </div>

    </div>
  );
}


export default Home;