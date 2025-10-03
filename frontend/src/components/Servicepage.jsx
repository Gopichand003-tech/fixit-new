// Servicepage.jsx
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  PhoneCallIcon,
  Briefcase,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CameraIcon,
  Hammer,
  Wrench,
  Paintbrush,
  Droplets,
  PaintBucket,
  Zap,
  Car,
  Home,
  Scissors,
  Laptop,
  Camera,
  Sparkles,
  Tv,
  Utensils,
  Dumbbell,
  Music,
  BookOpen,
  ShoppingBag,
  Heart,
  Baby,
  PawPrint,
  AirVent,
  CupSoda,
  Factory,
  PartyPopper,
  Gift,
  PaintRoller,
  EyeClosed,
  BrushCleaning,
  Truck,
  UtensilsCrossed,
  Timer,
  Tv2
} from "lucide-react";

const WorkerList = () => {
  const [selectedProfession, setSelectedProfession] = useState("All");
  const [dbProviders, setDbProviders] = useState([]);
  const scrollContainer = useRef(null);
  const isAdmin = false; // admin flag

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
    { name: "Cleaning", icon: BrushCleaning },
    { name: "TechSupport", icon: Laptop },
    { name: "Pet Care", icon: PawPrint },
    { name: "Tutoring", icon: BookOpen },
    { name: "Delivery", icon: Truck },
    { name: "Catering", icon: UtensilsCrossed },
    { name: "MusicTeacher", icon: Music },
  ];

  const professionIcons = {
    Carpenter: <Hammer className="w-6 h-6 text-yellow-600" />,
    Plumbing: <Wrench className="w-6 h-6 text-blue-600" />,
    Painting: <PaintRoller className="w-6 h-6 text-pink-600" />,
    Electrician: <Zap className="w-6 h-6 text-purple-600" />,
    WaterSupplier: <Droplets className="w-6 h-6 text-cyan-500" />,
    InteriorDesigner: <PaintBucket className="w-6 h-6 text-amber-600" />,
    Technician: <Zap className="w-6 h-6 text-yellow-500" />,
    Driver: <Car className="w-6 h-6 text-gray-700" />,
    Builder: <Home className="w-6 h-6 text-indigo-600" />,
    Barber: <Scissors className="w-6 h-6 text-pink-500" />,
    TechSupport: <Laptop className="w-6 h-6 text-sky-600" />,
    Photographer: <Camera className="w-6 h-6 text-purple-500" />,
    Cleaner: <Trash2 className="w-6 h-6 text-green-600" />,
    Beautician: <Sparkles className="w-6 h-6 text-fuchsia-500" />,
    TVRepair: <Tv className="w-6 h-6 text-blue-700" />,
    Chef: <Utensils className="w-6 h-6 text-orange-600" />,
    Trainer: <Dumbbell className="w-6 h-6 text-red-600" />,
    Musician: <Music className="w-6 h-6 text-purple-600" />,
    Tutor: <BookOpen className="w-6 h-6 text-emerald-600" />,
    Shopkeeper: <ShoppingBag className="w-6 h-6 text-pink-700" />,
    Doctor: <Heart className="w-6 h-6 text-red-500" />,
    Babysitter: <Baby className="w-6 h-6 text-pink-400" />,
    PetCare: <PawPrint className="w-6 h-6 text-brown-600" />,
    ACMechanic: <AirVent className="w-6 h-6 text-cyan-600" />,
    Caterer: <CupSoda className="w-6 h-6 text-orange-400" />,
    Delivery: <Truck className="w-6 h-6 text-indigo-700" />,
    FactoryWorker: <Factory className="w-6 h-6 text-gray-800" />,
    EventPlanner: <PartyPopper className="w-6 h-6 text-purple-500" />,
    GiftShop: <Gift className="w-6 h-6 text-rose-600" />,
    WallPainter: <PaintRoller className="w-6 h-6 text-green-500" />,
    Security: <EyeClosed className="w-6 h-6 text-gray-600" />,
    Mechanic: <Car className="w-6 h-6 text-red-600" />,
    Landscaping: <Scissors className="w-6 h-6 text-green-600" />,
    Photography: <CameraIcon className="w-6 h-6 text-indigo-600" />,
    Catering: <UtensilsCrossed className="w-6 h-6 text-orange-600" />,
    MusicTeacher: <Music className="w-6 h-6 text-pink-600" />,
    Electronics: <Tv2 className="w-6 h-6 text-rose-600" />,
    Default: <Briefcase className="w-6 h-6 text-gray-600" />,
  };

  const API_BASE =
    import.meta.env.VITE_API_URL ||
    (typeof process !== "undefined" && process.env.REACT_APP_API_URL) ||
    "http://localhost:5000";

  // Fetch providers
  useEffect(() => {
    let mounted = true;
    axios
      .get(`${API_BASE}/api/providers`)
      .then(({ data }) => {
        if (!mounted) return;
        if (!Array.isArray(data)) return setDbProviders([]);
        const mapped = data.map((p) => ({
          _id: p._id,
          name: p.name || "Unnamed Provider",
          profession: p.service || "Service",
          location: p.location || "Unknown",
          phone: p.phone || "N/A",
          image: p.documents?.photo || "/placeholder-user.jpg",
          available: true,
          experience: p.experience || "New Provider",
        }));
        setDbProviders(mapped);
      })
      .catch(() => setDbProviders([]));
    return () => (mounted = false);
  }, [API_BASE]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this provider?")) return;
    try {
      const res = await axios.delete(`${API_BASE}/api/providers/${id}`, {
        headers: { "x-admin-secret": "superSecret123" },
      });
      alert(res.data.message || "Provider deleted");
      setDbProviders((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete provider");
    }
  };

  const allWorkers = dbProviders;
  const filteredWorkers =
    selectedProfession === "All"
      ? allWorkers
      : allWorkers.filter(
          (w) =>
            (w.profession || "").toString().trim().toLowerCase() ===
            selectedProfession.toString().trim().toLowerCase()
        );

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainer.current) {
        scrollContainer.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="servicepage"
      className="w-screen bg-gradient-to-r from-blue-50 via-gray-50 to-indigo-50 py-16 overflow-x-hidden relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Active Workers
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-6 rounded-full"></div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover the Active workers of{" "}
          <span className="font-semibold drop-shadow-lg animate-sunlight">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          . And Book your service now.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-14">
        {professions.map((profession) => (
          <button
            key={profession.name}
            onClick={() => setSelectedProfession(profession.name)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold border transition-all duration-300 transform ${
              selectedProfession === profession.name
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md"
            }`}
          >
            <profession.icon className="w-4 h-4" />
            {profession.name}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="relative">
        <button
          onClick={() => scrollContainer.current.scrollBy({ left: -300, behavior: "smooth" })}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div ref={scrollContainer} className="flex gap-9 overflow-x-auto scrollbar-hide scroll-smooth px-12">
          {filteredWorkers.length === 0 ? (
            <div className="flex justify-center items-center w-full py-10">
              <p className="text-xl font-semibold text-gray-600 bg-white shadow-md rounded-2xl px-6 py-4 border border-gray-200">
                😔 Sorry, no workers are available right now for{" "}
                <span className="font-bold text-indigo-600">{selectedProfession}</span>.
              </p>
            </div>
          ) : (
            filteredWorkers.map((worker) => (
             <div
  key={worker._id || worker.id}
  className="flex-shrink-0 w-64 relative rounded-3xl border border-gray-200 p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-3 hover:border-indigo-400 hover:ring-4 hover:ring-indigo-100 transition-all duration-300 overflow-hidden"
  style={{
    backgroundImage: `url(${worker.image || "/placeholder-bg.jpg"})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backdropFilter: "blur(8px)",
  }}
>
  {/* Overlay for readability */}
  <div className="absolute inset-0 bg-black/65 rounded-3xl"></div>

  {/* Profession Icon */}
  <div className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md z-10">
    {professionIcons[worker.profession] || professionIcons.Default}
  </div>

  {/* Admin Delete Button */}
  {isAdmin && (
    <button
      onClick={() => handleDelete(worker._id)}
      className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition z-10"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  )}

  {/* Card Body */}
  <div className="flex flex-col items-center text-center mb-4 relative z-10">
    <div className="relative p-1 rounded-full bg-gradient-to-r from-green-500 to-pink-500 shadow-lg">
      <img
        src={worker.image}
        alt={worker.name}
        loading="lazy"
        className="w-32 h-32 rounded-full object-cover border-4 border-white"
      />
      {worker.available && (
        <span className="absolute -bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow">
          Active
        </span>
      )}
    </div>

    <h2 className="mt-4 text-2xl font-bold text-white">{worker.name}</h2>
    <p className="flex items-center gap-2 text-lg text-white font-semibold">
      <Briefcase className="w-5 h-5" /> {worker.profession}
    </p>
    <p className="flex items-center gap-2 text-sm text-white">
      <Timer className="w-5 h-5 text-blue-200" /> {worker.experience}
    </p>
    <p className="flex items-center gap-2 text-sm text-white">
      <MapPin className="w-5 h-5 text-orange-300" /> {worker.location}
    </p>
    <p className="flex items-center gap-2 text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-300">
      <PhoneCallIcon className="w-5 h-5" /> {worker.phone}
    </p>
    <p className={`text-sm mt-1 font-semibold ${worker.available ? "text-green-400" : "text-red-400"}`}>
      {worker.available ? "Available" : "Not Available"}
    </p>
  </div>

  {/* Action Buttons */}
  <div className="mt-5 flex justify-center gap-4 relative z-10">
    <button
      disabled={!worker.available}
      onClick={() =>
        worker.available && navigate(`/booking/${worker._id || worker.id}`, { state: { worker } })
      }
      className={`px-5 py-2 rounded-full text-sm font-semibold shadow-md transform transition-all duration-300 ${
        worker.available
          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:scale-105 hover:shadow-lg"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      Book
    </button>
    <a
      href={`tel:${worker.phone}`}
      className={`px-5 py-2 rounded-full text-sm font-semibold shadow-md transform transition-all duration-300 ${
        worker.available
          ? "bg-gradient-to-r from-purple-500 to-indigo-300 text-white hover:scale-105 hover:shadow-xl"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      Call Now
    </a>
  </div>
</div>
            ))
          )}
        </div>

        <button
          onClick={() => scrollContainer.current.scrollBy({ left: 300, behavior: "smooth" })}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes sunlightGlow {
          0% { color: #a11026ff; text-shadow: 0 0 5px #be7184ff, 0 0 10px #24c5fbff; }
          50% { color: #b10944ff; text-shadow: 0 0 10px #bc8099ff, 0 0 20px #0bcaf5ff; }
          100% { color: #a6154fff; text-shadow: 0 0 5px #a7758bff, 0 0 10px #24c9fbff; }
        }
        .animate-sunlight { animation: sunlightGlow 2s infinite alternate; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default WorkerList;
