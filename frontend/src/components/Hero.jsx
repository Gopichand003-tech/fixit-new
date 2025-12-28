import { useState, useRef, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PROFESSIONS, LOCATIONS } from "../data/searchData";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const navigate = useNavigate();

  const serviceRef = useRef(null);
  const locationRef = useRef(null);

  /* ---------------- Close dropdown on outside click ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        serviceRef.current &&
        !serviceRef.current.contains(e.target) &&
        locationRef.current &&
        !locationRef.current.contains(e.target)
      ) {
        setShowServiceSuggestions(false);
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- Search ---------------- */
  const handleSearch = () => {
    if (!searchQuery.trim() || !location.trim()) return;
    navigate("/workers", {
      state: {
        profession: searchQuery.trim(),
        location: location.trim(),
      },
    });
  };

  const handleAutoDetect = () => {
  if (!navigator.geolocation) {
    toast.error("Geolocation not supported");
    return;
  }

  setDetectingLocation(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;

        // Reverse geocoding (OpenStreetMap – free)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();

        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.county;

        if (city) {
          setLocation(city);
        } else {
          toast.error("Could not detect city");
        }
      } catch {
        toast.error("Failed to detect location");
      } finally {
        setDetectingLocation(false);
      }
    },
    (error) => {
      setDetectingLocation(false);
      if (error.code === 1) toast.error("Location permission denied");
      else toast.error("Unable to fetch location");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
    }
  );
};


  return (
    <section
      className="
        relative
        min-h-[90vh] sm:min-h-screen
        w-full bg-white
        -mt-24 sm:-mt-23
      "
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-28 sm:pt-32">

        {/* ---------------- Top Layout ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1
              className="
                text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                font-extrabold tracking-tight
                text-gray-900 leading-[1.1]
                mb-6
              "
            >
              Find Local <br />
              <span
                className="
                  text-transparent bg-clip-text
                  bg-gradient-to-r from-yellow-400 to-amber-500
                "
              >
                Service Providers
              </span>
            </h1>

            <p
              className="
                text-base sm:text-lg md:text-xl
                text-gray-600
                max-w-xl mx-auto lg:mx-0
                leading-relaxed
              "
            >
              Easily connect with trusted local professionals near you — from plumbing,
              electrical repairs, cleaning, carpentry, and more.
            </p>

            <p className="mt-4 text-sm text-gray-500">
              ✔ Verified professionals &nbsp;•&nbsp; ✔ Quick booking &nbsp;•&nbsp; ✔ Secure payments
            </p>
          </div>

          {/* Right Video */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="
                w-60 h-60
                sm:w-72 sm:h-72
                md:w-80 md:h-80
                lg:w-110 lg:h-110
                rounded-full overflow-hidden
                shadow-[0_30px_80px_rgba(0,0,0,0.15)]
                border border-gray-200
                bg-gray-500
              "
            >
              <video
                src="/bgvideo1.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* ---------------- Floating Search Bar ---------------- */}
        <div className="mt-16 flex justify-center">
          <div
            className="
              w-full max-w-4xl
              bg-gradient-to-br from-blue-400 via-white to-blue-300
              rounded-3xl
              p-3 sm:p-6
              shadow-[0_40px_80px_rgba(30,64,175,0.25)]
              border border-blue-200
              ring-1 ring-blue-400/20
            "
          >
            <div className="flex flex-col md:flex-row items-stretch gap-4">

{/* Service Input */}
<div className="flex-1 relative group" ref={serviceRef}>
  <Search
    className="
        absolute left-4 top-1/2 -translate-y-6
        text-gray-500 w-5 h-5
        group-focus-within:text-yellow-500
      "
    />

  <input
    type="text"
    placeholder="What service do you need?"
    value={searchQuery}
    onFocus={() => setShowServiceSuggestions(true)}
    onChange={(e) => setSearchQuery(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
    className="
      w-full h-11 sm:h-14
      pl-12 pr-4
      bg-white
      border border-gray-300
      rounded-2xl
      text-[15px] sm:text-base
      text-gray-900
      placeholder-gray-400
      shadow-sm
      focus:outline-none
      focus:border-yellow-400
      focus:ring-4 focus:ring-yellow-400/30
    "
  />

  {showServiceSuggestions && (
    <ul className="absolute top-[52px] sm:top-14 w-full bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.18)] max-h-52 overflow-y-auto z-50 border border-gray-200">
      {PROFESSIONS.map((p) => (
        <li
          key={p}
          className="px-4 py-2.5 hover:bg-yellow-50 cursor-pointer"
          onClick={() => {
            setSearchQuery(p);
            setShowServiceSuggestions(false);
          }}
        >
          {p}
        </li>
      ))}
    </ul>
  )}
</div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-gray-200 my-2" />

          {/* Location Input */}
<div className="flex-1" ref={locationRef}>

  {/* Input + Icon wrapper */}
  <div className="relative group">
    <MapPin
      className="
        absolute left-4 top-1/2 -translate-y-1/2
        text-gray-500 w-5 h-5
        group-focus-within:text-yellow-500
      "
    />

    <input
      type="text"
      placeholder="Enter your location"
      value={location}
      onFocus={() => setShowLocationSuggestions(true)}
      onChange={(e) => setLocation(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      className="
        w-full h-11 sm:h-14
        pl-12 pr-4
        bg-white
        border border-gray-300
        rounded-2xl
        text-[15px] sm:text-base
        text-gray-900
        placeholder-gray-400
        shadow-sm
        focus:outline-none
        focus:border-yellow-400
        focus:ring-4 focus:ring-yellow-400/30
      "
    />

    {showLocationSuggestions && (
      <ul className="absolute top-[52px] sm:top-14 w-full bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.18)] max-h-52 overflow-y-auto z-50 border border-gray-200">
        {LOCATIONS.map((l) => (
          <li
            key={l}
            className="px-4 py-2.5 hover:bg-yellow-50 cursor-pointer"
            onClick={() => {
              setLocation(l);
              setShowLocationSuggestions(false);
            }}
          >
            {l}
          </li>
        ))}
      </ul>
    )}
  </div>

  <button
  type="button"
  onClick={handleAutoDetect}
  disabled={detectingLocation}
  className="
    mt-2 ml-1
    flex items-center gap-2
    text-xs sm:text-sm
    text-yellow-600 font-medium
    hover:underline
    disabled:opacity-50
  "
>
  {detectingLocation ? (
    "Detecting location..."
  ) : (
    <>
      <span className="inline-flex w-2 h-2 rounded-full bg-yellow-400" />
      <span>Use my location</span>
    </>
  )}
</button>



  {showLocationSuggestions && (
    <ul
      className="
        absolute top-[52px] sm:top-14 w-full
        bg-white rounded-2xl
        shadow-[0_20px_40px_rgba(0,0,0,0.18)]
        max-h-52 overflow-y-auto
        z-50 border border-gray-200
      "
    >
      {LOCATIONS.filter((l) =>
        l.toLowerCase().includes(location.toLowerCase())
      ).map((l) => (
        <li
          key={l}
          className="px-4 py-2.5 hover:bg-yellow-50 cursor-pointer"
          onClick={() => {
            setLocation(l);
            setShowLocationSuggestions(false);
          }}
        >
          {l}
        </li>
      ))}
    </ul>
  )}
</div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="
                  flex items-center justify-center gap-2
                  h-11 sm:h-14
                  px-6 sm:px-10
                  bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500
                  hover:from-yellow-300 hover:to-amber-300
                  text-black font-semibold
                  rounded-2xl
                  shadow-[0_12px_30px_rgba(251,191,36,0.45)]
                  transition-all active:scale-95
                  focus:outline-none focus:ring-4 focus:ring-yellow-400/40
                "
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Find Services</span>
              </button>
            </div>

            {/* ---------------- Top Searches ---------------- */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <span className="inline-flex w-2 h-2 rounded-full bg-yellow-400" />
                <span className="font-medium tracking-wide uppercase">
                  Top Searches
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-2 px-2 sm:px-0">
                {["Electrician", "Plumber", "Mechanic", "Carpenter", "Photography", "Painting"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSearchQuery(item);
                        handleSearch();
                      }}
                      className="
                        px-4 py-1.5 sm:px-5 sm:py-2
                        rounded-full
                        bg-gray-100
                        border border-gray-200
                        text-gray-700 text-sm
                        hover:bg-yellow-100 hover:border-yellow-300 hover:text-gray-900
                        shadow-sm active:scale-95 transition-all
                      "
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
