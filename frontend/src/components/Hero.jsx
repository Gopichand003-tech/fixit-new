import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { serviceWorkers } from "../data/Serviceworkers"; // ✅ use worker data

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const navigate = useNavigate();

  // Extract unique professions & locations and enrich with more
  const professions = [
    ...new Set(serviceWorkers.map((w) => w.profession)),
    
  "Electronics",
  "Plumbing",
  "Painting",
  "Electrician",
  "Mechanic",
  "Cleaning",
  "Landscaping",
  "TechSupport",
  "Photography",
  "Carpenter",
  "Junk Removal",
  "Bodycare",
  "Catering",
  "Fitness Trainer",
  "MusicTeacher",
  "Tutoring",
  "Personal Shopper",
  "Business Consulting",
  "Healthcare",
  "Babysitting",
  "Pet Care",
  "AC Repair",
  "Event Planning",
  "Transport Service",
  "Industrial Services"
];


  const locations = [
    ...new Set(serviceWorkers.map((w) => w.location)),
    "Visakhapatnam",
  "Vijayawada",
  "Guntur",
  "Nellore",
  "Tirupati",
  "Kurnool",
  "Rajahmundry",
  "Kakinada",
  "Anantapur",
  "Kadapa",
  "Ongole",
  "Eluru",
  "Vizianagaram",
  "Machilipatnam",
  "Chittoor",
  "Hindupur",
  "Proddatur",
  "Tenali",
  "Adoni",
  "Nandyal",
  "Mangalagiri"
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a service you're looking for");
      return;
    }
    if (!location.trim()) {
      alert("Please enter your location");
      return;
    }
    navigate("/workers", {
      state: { profession: searchQuery.trim(), location: location.trim() },
    });
  };

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden 
                        ml-[-50vw] left-[50%] w-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-500 to-yellow-400 animate-[bgFlow_18s_ease_infinite] z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none z-10" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl px-6 md:px-12 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6">
          Find Local
          <br />
          <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
            Service Providers
          </span>
        </h1>

        {/* Search Bar */}
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-lg relative">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Service Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 h-5 w-5" />
              <input
                type="text"
                placeholder="What service do you need?"
                className="pl-12 pr-4 h-14 w-full bg-white/20 border border-white/30 text-white placeholder:text-white/70 text-lg rounded-lg focus:outline-none"
                value={searchQuery}
                onFocus={() => setShowServiceSuggestions(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              {/* Service Suggestions */}
              {showServiceSuggestions && (
                <ul className="absolute top-16 left-0 w-full bg-white text-black rounded-lg shadow-md max-h-48 overflow-y-auto z-50">
                  {professions
                    .filter((p) =>
                      p.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((p, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
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
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 h-5 w-5" />
              <input
                type="text"
                placeholder="Enter your location"
                className="pl-12 pr-4 h-14 w-full bg-white/20 border border-white/30 text-white placeholder:text-white/70 text-lg rounded-lg focus:outline-none"
                value={location}
                onFocus={() => setShowLocationSuggestions(true)}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              {/* Location Suggestions */}
              {showLocationSuggestions && (
                <ul className="absolute top-16 left-0 w-full bg-white text-black rounded-lg shadow-md max-h-48 overflow-y-auto z-50">
                  {locations
                    .filter((loc) =>
                      loc.toLowerCase().includes(location.toLowerCase())
                    )
                    .map((loc, idx) => (
                      <li
                        key={idx}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setLocation(loc);
                          setShowLocationSuggestions(false);
                        }}
                      >
                        {loc}
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Search Button */}
            <button
              className="h-14 px-8 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold rounded-lg transition duration-200"
              onClick={handleSearch}
            >
              Find Services
            </button>
          </div>
        </div>

        {/* Description under search bar */}
        <p className="mt-6 text-lg md:text-xl text-white/90 max-w-3xl">
          Easily connect with trusted local professionals near you.  
          From fixing leaky taps to electrical repairs, painting, carpentry, and more — 
          all services are just a search away.
        </p>
      </div>
    </section>
  );
};

export default Hero;
