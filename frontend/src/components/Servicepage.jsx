import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  PhoneCallIcon,
  Briefcase,
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
    import.meta.env.VITE_API_URL ||
    "https://maxie-postacetabular-novelistically.ngrok-free.dev";

  /* ---------------- Fetch ONLINE Providers ---------------- */
  const fetchProviders = async () => {
  try {
    const { data } = await axios.get(`${API_BASE}/api/providers`, {
      timeout: 5000, // ⏱ avoid hanging requests
    });

    console.log(
  "📡 Providers fetched:",
  providers.map(p => ({ name: p.name, isOnline: p.isOnline }))
);


    if (!Array.isArray(data)) return;

    const online = data.filter((p) => p.isOnline === true);

    // ✅ update ONLY if backend returned something valid
    setProviders(
  online.map((p) => ({
    id: p._id,
    name: p.name,
    profession: p.service,
    location: p.location,
    phone: p.phone,
    image: p.documents?.photo || "/placeholder-user.jpg",
    experience: p.experience,
  }))
);

  } catch (err) {
    console.warn("⚠️ Keeping previous providers (fetch failed)");
    // ❗ DO NOTHING → keep old UI
  }
};

const formatPhone = (phone) => {
  if (!phone) return "";
  const p = phone.replace(/\D/g, "");
  if (p.length === 12 && p.startsWith("91")) {
    return `+91 ${p.slice(2, 7)} ${p.slice(7)}`;
  }
  return phone;
};



  /* ---------------- Initial + Auto Refresh ---------------- */
  useEffect(() => {
    fetchProviders();
    const interval = setInterval(fetchProviders, 5000); // 🔁 every 5 sec
    return () => clearInterval(interval);
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
    <section className="w-full bg-gray py-10">
      <div className="max-w-7xl mx-auto px-4">

      {/* Header */}
<div className="text-center mb-16">
  <h2
    className="
      text-3xl sm:text-4xl md:text-5xl lg:text-6xl
      font-extrabold
      tracking-tight
      bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500
      bg-clip-text text-transparent
      drop-shadow-sm
    "
  >
    Active Workers
  </h2>

  <div className="mt-4 flex justify-center">
    <span
      className="
        px-4 py-1.5
        rounded-full
        bg-indigo-50
        text-indigo-700
        text-sm md:text-base
        font-medium
        shadow-sm
      "
    >
      Professionals currently available online
    </span>
  </div>
</div>


        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {professions.map((p) => (
            <button
              key={p.name}
              onClick={() => setSelectedProfession(p.name)}
              className={`px-4 py-1.5 text-xs sm:text-sm rounded-full  font-semibold transition
                ${
                  selectedProfession === p.name
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-indigo-50"
                }`}
            >
              <p.icon className="w-4 h-4 inline mr-2" />
              {p.name}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-24 text-gray-500 text-lg">
            😴 No workers are online right now <br />
            Please check again later
          </div>
        )}

        {/* Cards */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-8 overflow-x-auto px-1 sm:px-2-auto scrollbar-hide "
        >
          {filtered.map((w) => (
            <div
              key={w.id}
              className="
                group relative w-[260px] h-[380px]
                sm:w-[300px] sm:h-[420px]
                rounded-3xl overflow-hidden
                shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                hover:-translate-y-2 transition-all duration-500
              "
            >
           <img
  src={w.image}
  alt={w.name}
  loading="lazy"
  className="
    absolute inset-0
    w-full h-full object-cover
    scale-100 group-hover:scale-[1.08]
    transition-transform duration-[1600ms] ease-out
    contrast-110 saturate-110 brightness-105
  "
/>



              {/* Bottom Gradient ONLY */}
             <div
  className="
    absolute inset-0
    bg-gradient-to-t
    from-black/65 via-black/30 to-transparent
  "
/>


              {/* ONLINE Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2
                px-3 py-1 rounded-full text-xs font-bold
                bg-emerald-500 text-white shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                ONLINE
              </div>

              {/* Profession Icon */}
              <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
                {professionIcons[w.profession] || professionIcons.Default}
              </div>

              {/* Content */}
<div className="relative z-20 h-full flex flex-col justify-end p-4 sm:p-6 text-white space-y-4">

  {/* Name – clean, no glass */}
  <div className="text-center">
    <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-lg">
      {w.name}
    </h3>
  </div>

  {/* Profession – glass pill */}
  <div className="flex justify-center">
    <span className="
      px-5 py-2 rounded-full
      bg-white/15 backdrop-blur-lg
      border border-white/25
      text-indigo-200 text-sm font-semibold uppercase tracking-wide
      shadow-md
    ">
      {w.profession}
    </span>
  </div>

 <div className="
  flex items-center justify-center gap-2
  bg-white/12 backdrop-blur-md
  rounded-xl
  px-1 py-1
  text-sm font-medium text-white
">
  <Timer className="w-4 h-4 text-indigo-300" />
  {w.experience}
</div>


<div className="
  flex items-center justify-center gap-2
  bg-white/12 backdrop-blur-md
  rounded-xl
  px-4 py-1
  text-sm font-medium text-white
">
  <MapPin className="w-4 h-4 text-emerald-300" />
  {w.location}
</div>

   <div className="flex items-center justify-center gap-2
whitespace-nowrap bg-white/10 backdrop-blur rounded-xl py-2 text-sm">
  <PhoneCallIcon className="w-4 h-4 text-emerald-400" />
  {formatPhone(w.phone)}
</div>


                <button
                  onClick={() =>
                    navigate(`/booking/${w.id}`, { state: { worker: w } })
                  }
                  className="mt-3 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 font-semibold"
                >
                  Book a Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hide Scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default WorkerList;
