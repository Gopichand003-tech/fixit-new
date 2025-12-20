import { useState, useRef, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PROFESSIONS, LOCATIONS } from "../data/searchData";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const navigate = useNavigate();

  const serviceRef = useRef(null);
  const locationRef = useRef(null);


  /* ---------------- Close dropdown on outside click ---------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        serviceRef.current && !serviceRef.current.contains(e.target) &&
        locationRef.current && !locationRef.current.contains(e.target)
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

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-500 to-yellow-400 animate-[bgFlow_18s_ease_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[length:40px_40px]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-10 text-center flex flex-col items-center">

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
          Find Local <br />
          <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
            Service Providers
          </span>
        </h1>

        {/* Search Card */}
        <div className="w-full max-w-4xl bg-white/15 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/25 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">

            {/* Service Input */}
            <div className="flex-1 relative" ref={serviceRef}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="text"
                placeholder="What service do you need?"
                value={searchQuery}
                onFocus={() => setShowServiceSuggestions(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full h-12 sm:h-14 pl-12 pr-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />

              {showServiceSuggestions && (
                <ul className="absolute top-14 w-full bg-white rounded-xl shadow-lg max-h-48 overflow-y-auto z-50">
                  {PROFESSIONS
                    .filter((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((p) => (
                      <li
                        key={p}
                        className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
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

            {/* Location Input */}
            <div className="flex-1 relative" ref={locationRef}>
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter your location"
                value={location}
                onFocus={() => setShowLocationSuggestions(true)}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full h-12 sm:h-14 pl-12 pr-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />

              {showLocationSuggestions && (
                <ul className="absolute top-14 w-full bg-white rounded-xl shadow-lg max-h-48 overflow-y-auto z-50">
                  {LOCATIONS
                    .filter((l) => l.toLowerCase().includes(location.toLowerCase()))
                    .map((l) => (
                      <li
                        key={l}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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

            {/* Button */}
            <button
              onClick={handleSearch}
              className="h-12 sm:h-14 px-6 sm:px-8 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-xl transition shadow-md"
            >
              Find Services
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
          Easily connect with trusted local professionals near you — from plumbing
          and electrical repairs to cleaning, carpentry, and more.
        </p>
      </div>
    </section>
  );
};

export default Hero;
