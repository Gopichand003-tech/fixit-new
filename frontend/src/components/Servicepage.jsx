import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  PhoneCallIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Hammer,
  Wrench,
  Zap,
  Droplets,
  PaintRoller,
  Scissors,
  Laptop,
  Camera,
  Trash2 as CleanerIcon,
  EyeClosed,
  PawPrint,
  BookOpen,
  Truck,
  UtensilsCrossed,
  Music,
  Timer,
  Tv2,
} from "lucide-react";

/* ---------------- Professions Filter ---------------- */
const professions = [
  { name: "All", icon: Briefcase },
  { name: "Mechanic", icon: Wrench },
  { name: "Plumbing", icon: Droplets },
  { name: "Electrician", icon: Zap },
  { name: "Landscaping", icon: Scissors },
  { name: "Photography", icon: Camera },
  { name: "Carpenter", icon: Hammer },
  { name: "Beauty", icon: EyeClosed },
  { name: "Painting", icon: PaintRoller },
  { name: "Cleaning", icon: CleanerIcon },
  { name: "TechSupport", icon: Laptop },
  { name: "Pet Care", icon: PawPrint },
  { name: "Tutoring", icon: BookOpen },
  { name: "Delivery", icon: Truck },
  { name: "Catering", icon: UtensilsCrossed },
  { name: "MusicTeacher", icon: Music },
];

/* ---------------- Icon Mapper ---------------- */
const professionIcons = {
  Mechanic: <Wrench className="w-5 h-5 text-red-500" />,
  Plumbing: <Droplets className="w-5 h-5 text-blue-500" />,
  Electrician: <Zap className="w-5 h-5 text-yellow-500" />,
  Carpenter: <Hammer className="w-5 h-5 text-orange-500" />,
  Painting: <PaintRoller className="w-5 h-5 text-purple-500" />,
  Cleaning: <CleanerIcon className="w-5 h-5 text-green-500" />,
  TechSupport: <Laptop className="w-5 h-5 text-indigo-500" />,
  Photography: <Camera className="w-5 h-5 text-pink-500" />,
  Electronics: <Tv2 className="w-5 h-5 text-rose-500" />,
  Default: <Briefcase className="w-5 h-5 text-gray-500" />,
};

const WorkerList = () => {
  const [selectedProfession, setSelectedProfession] = useState("All");
  const [providers, setProviders] = useState([]);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  /* ---------------- Fetch Providers ---------------- */
  useEffect(() => {
    let active = true;

    axios
      .get(`${API_BASE}/api/providers`)
      .then(({ data }) => {
        if (!active || !Array.isArray(data)) return;
        setProviders(
          data.map((p) => ({
            id: p._id,
            name: p.name || "Unnamed",
            profession: p.service || "Service",
            location: p.location || "Unknown",
            phone: p.phone || "N/A",
            image: p.documents?.photo || "/placeholder-user.jpg",
            experience: p.experience || "New Provider",
              isOnline: p.isOnline,          // ✅ REAL DATA
             lastSeen: p.lastSeen,          // ✅ for text
          }))
        );
      })
      .catch(() => setProviders([]));

    return () => (active = false);
  }, [API_BASE]);

  /* ---------------- Auto Scroll ---------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      scrollRef.current?.scrollBy({ left: 260, behavior: "smooth" });
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const filtered =
    selectedProfession === "All"
      ? providers
      : providers.filter(
          (p) =>
            p.profession.toLowerCase() ===
            selectedProfession.toLowerCase()
        );
   

  return (
    <section
      id="servicepage"
      className="w-full bg-gradient-to-r from-blue-50 via-gray-50 to-indigo-50 py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Active Workers
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Book trusted professionals available today.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
          {professions.map((p) => (
            <button
              key={p.name}
              onClick={() => setSelectedProfession(p.name)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition
                ${
                  selectedProfession === p.name
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md scale-105"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50"
                }
              `}
            >
              <p.icon className="w-4 h-4" />
              {p.name}
            </button>
          ))}
        </div>

       {/* Carousel */}
<div className="relative">

  {/* Left Arrow */}
  <button
    onClick={() =>
      scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })
    }
    className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10
      p-3 bg-white shadow-xl rounded-full
      hover:scale-110 transition"
  >
    <ChevronLeft className="text-indigo-600" />
  </button>

  {/* Scroll Container */}
  <div
    ref={scrollRef}
    className="flex gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-12 scroll-smooth"
  >
    {filtered.length === 0 ? (
      <div className="w-full flex justify-center py-12">
        <p className="bg-white px-6 py-4 rounded-xl shadow text-gray-600">
          No workers available for {selectedProfession}
        </p>
      </div>
    ) : (
      filtered.map((w) => (

       <div
  key={w.id}
  className="
    group relative flex-shrink-0 w-[320px] h-[440px]
    rounded-3xl overflow-hidden
    shadow-[0_15px_50px_rgba(0,0,0,0.15)]
    hover:shadow-[0_30px_80px_rgba(0,0,0,0.25)]
    transition-all duration-500
    hover:-translate-y-3
  "
>
  {/* 🔹 Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center scale-110 group-hover:scale-125 transition duration-700"
    style={{ backgroundImage: `url(${w.image})` }}
  />

  {/* 🔹 Dark Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/70 to-black/20" />

 {/* 🔹 Real-time Availability */}
<div
  className={`absolute top-4 left-4 z-20 flex items-center gap-2
    backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg
    ${w.isOnline ? "bg-black/40" : "bg-black/60"}
  `}
>
  <span className="relative flex h-2.5 w-2.5">
    {w.isOnline && (
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
    )}
    <span
      className={`relative inline-flex rounded-full h-2.5 w-2.5
        ${w.isOnline ? "bg-emerald-500" : "bg-gray-400"}
      `}
    ></span>
  </span>

  <span
    className={`text-xs font-semibold
      ${w.isOnline ? "text-emerald-300" : "text-gray-300"}
    `}
  >
    {w.isOnline ? "Online now" : "Offline"}
  </span>
</div>
<div className="mt-2 text-center text-xs text-gray-400">
  {w.isOnline
    ? "Active now"
    : `Last seen ${Math.floor(
        (Date.now() - new Date(w.lastSeen)) / 60000
      )} min ago`}
</div>


  {/* 🔹 Profession Icon */}
  <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow flex items-center justify-center">
    {professionIcons[w.profession] || professionIcons.Default}
  </div>

  {/* <span className="
  absolute top-16 right-4
  px-3 py-1 rounded-full text-[11px] font-semibold
  bg-indigo-100 text-indigo-700
">
  ⚡ Fast response
</span> */}


  {/* 🔹 Content */}
  <div className="relative z-20 h-full flex flex-col justify-end p-6 text-white">

    {/* Avatar
    <div className="flex justify-center mb-4">
      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-[3px]">
        <img
          src={w.image}
          alt={w.name}
          className="w-full h-full rounded-full object-cover bg-white"
        />
      </div>
    </div> */}

    {/* Info */}
    <div className="text-center space-y-5">
      <h3 className="text-4xl font-bold tracking-tight">
        {w.name}
      </h3>

      <p className="text-xl font-semibold text-indigo-300">
        {w.profession}
      </p>

      <div className="flex justify-center items-center gap-2 text-sm text-gray-200">
        <Timer className="w-4 h-4" />
        {w.experience}
      </div>

      <div className="flex justify-center items-center gap-2 text-sm text-gray-300">
        <MapPin className="w-4 h-4" />
        {w.location}
      </div>
    </div>

   <div
  className="
    mt-4 flex items-center justify-center gap-2
    bg-white/10 backdrop-blur-md
    rounded-xl py-2 px-4
    text-sm font-semibold text-white
    hover:bg-white/20 transition
  "
>
  <PhoneCallIcon className="w-4 h-4 text-emerald-400" />
  <span>{w.phone}</span>
</div>


    {/* Actions */}
    <div className="flex gap-3 mt-5 ">
      <button
        onClick={() =>
          navigate(`/booking/${w.id}`, { state: { worker: w } })
        }
        className="flex-1 py-3 rounded-full
          bg-gradient-to-r from-indigo-500 to-blue-600
          text-white text-sm font-semibold
          hover:scale-[1.05] transition  "
      >
        Book a Slot
      </button>
    </div>
  </div>
</div>

      ))
    )}
  </div>

  {/* Right Arrow */}
  <button
    onClick={() =>
      scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })
    }
    className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10
      p-3 bg-white shadow-xl rounded-full
      hover:scale-110 transition"
  >
    <ChevronRight className="text-indigo-600" />
  </button>
</div>
</div>

      {/* Scrollbar Hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default WorkerList;
