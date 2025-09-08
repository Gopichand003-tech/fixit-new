import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { serviceWorkers } from "../data/Serviceworkers"; // ✅ static workers
import {
  MapPin,
  PhoneCall as PhoneCallIcon,
  User,
  Briefcase,
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
  Trash2,
  Sparkles,
  Tv,
  Utensils,
  UtensilsCrossed,
  Dumbbell,
  Music,
  BookOpen,
  ShoppingBag,
  Heart,
  Baby,
  PawPrint,
  AirVent,
  CupSoda,
  Bus,
  Factory,
  PartyPopper,
  Gift,
  EyeClosed,
  CameraIcon,
  Timer,
} from "lucide-react";

const API_BASE = "http://localhost:5000";

const WorkersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProfession = location.state?.profession || "All";
  const selectedLocation = location.state?.location || "";

  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);

  // ✅ Profession → Icon mapping
  const professionIcons = {
    Carpenter: <Hammer className="w-6 h-6 text-yellow-600" />,
    Plumbing: <Wrench className="w-6 h-6 text-blue-600" />,
    Painting: <Paintbrush className="w-6 h-6 text-pink-600" />,
    Electrician: <Zap className="w-6 h-6 text-purple-600" />,
    WaterSupplier: <Droplets className="w-6 h-6 text-cyan-500" />,
    InteriorDesigner: <PaintBucket className="w-6 h-6 text-amber-600" />,
    Technician: <Zap className="w-6 h-6 text-yellow-500" />,
    Driver: <Car className="w-6 h-6 text-gray-700" />,
    Builder: <Home className="w-6 h-6 text-indigo-600" />,
    Barber: <Scissors className="w-6 h-6 text-pink-500" />,
    TechSupport: <Laptop className="w-6 h-6 text-sky-600" />,
    Cleaner: <Trash2 className="w-6 h-6 text-green-600" />,
    Beautician: <Sparkles className="w-6 h-6 text-fuchsia-500" />,
    TVRepair: <Tv className="w-6 h-6 text-blue-700" />,
    Chef: <Utensils className="w-6 h-6 text-orange-600" />,
    Trainer: <Dumbbell className="w-6 h-6 text-red-600" />,
    Tutor: <BookOpen className="w-6 h-6 text-emerald-600" />,
    Shopkeeper: <ShoppingBag className="w-6 h-6 text-pink-700" />,
    Doctor: <Heart className="w-6 h-6 text-red-500" />,
    Babysitter: <Baby className="w-6 h-6 text-pink-400" />,
    PetCare: <PawPrint className="w-6 h-6 text-brown-600" />,
    ACMechanic: <AirVent className="w-6 h-6 text-cyan-600" />,
    Caterer: <CupSoda className="w-6 h-6 text-orange-400" />,
    BusDriver: <Bus className="w-6 h-6 text-indigo-700" />,
    FactoryWorker: <Factory className="w-6 h-6 text-gray-800" />,
    EventPlanner: <PartyPopper className="w-6 h-6 text-purple-500" />,
    GiftShop: <Gift className="w-6 h-6 text-rose-600" />,
    Security: <EyeClosed className="w-6 h-6 text-gray-600" />,
    Mechanic: <Car className="w-6 h-6 text-red-600" />,
    Landscaping: <Scissors className="w-6 h-6 text-green-600" />,
    Photography: <CameraIcon className="w-6 h-6 text-indigo-600" />,
    Catering: <UtensilsCrossed className="w-6 h-6 text-orange-600" />,
    MusicTeacher: <Music className="w-6 h-6 text-pink-600" />,
    Default: <Briefcase className="w-6 h-6 text-gray-600" />,
  };

  // ✅ Normalize workers
  const normalizeWorker = (w, isStatic = false) => {
    const imagePath = !isStatic ? w.documents?.photo || w.image : w.image;
    const image = imagePath
      ? `${!isStatic ? API_BASE : ""}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`
      : "/placeholder-user.jpg";

    return {
      _id: w._id || w.id,   // <-- always provide _id
       id: w._id || w.id,    // optional, keep both if UI needs id
      name: w.name || "Unnamed Worker",
      profession: w.profession || w.service || "Service",
      location: w.location || "Unknown",
      phone: w.phone || "N/A",
      image,
      available: w.available ?? true,
      experience: w.experience || "New Worker",
    };
  };

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/providers`);
        const backendWorkers = res.data.map((w) => normalizeWorker(w));
        const staticWorkers = serviceWorkers.map((w) => normalizeWorker(w, true));
        let allWorkers = [...staticWorkers, ...backendWorkers];

        // ✅ Filter by profession + location
        let filtered = allWorkers;
        if (selectedProfession !== "All") {
          filtered = filtered.filter(
            (w) =>
              w.profession?.toLowerCase().trim() === selectedProfession.toLowerCase().trim()
          );
        }
        if (selectedLocation) {
          filtered = filtered.filter((w) =>
            w.location?.toLowerCase().includes(selectedLocation.toLowerCase())
          );
        }
        setFilteredWorkers(filtered);
      } catch (err) {
        console.error("❌ Error fetching workers:", err);
      }
    };
    fetchWorkers();
  }, [selectedProfession, selectedLocation]);

  return (
    <div className="w-screen min-h-screen py-16 overflow-x-hidden relative bg-cover bg-center"
      style={{ backgroundImage: "url('../type3.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Back Button */}
<div className="absolute top-18 left-6 z-20">
  <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white text-indigo-700 font-semibold rounded-full shadow-lg transition-all"
  >
    ← Back
  </button>
</div>


      {/* Header */}
      <div className="relative z-10 text-center mb-8 px-4">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">
          {selectedProfession === "All" ? "All Services" : selectedProfession}
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-4 rounded-full"></div>
        <p className="text-lg text-gray-200 max-w-3xl mx-auto">
          Discover the most requested services in your area. All our providers are verified and highly rated.
        </p>
      </div>

      {/* Worker Cards */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-10 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredWorkers.map((worker) => (
            <div key={worker.id}
              className="relative rounded-3xl border border-transparent p-6 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-3 hover:border-indigo-500 hover:ring-4 hover:ring-indigo-100 transition-all duration-300 overflow-hidden"
              style={{
                background: `
                  linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(133, 109, 150, 0.95) 40%, rgba(224,231,255,1) 100%),
                  radial-gradient(circle at top left, rgba(6, 36, 33, 0.15), transparent 60%),
                  radial-gradient(circle at bottom right, rgba(16,185,129,0.15), transparent 60%)
                `,
                backdropFilter: "blur(12px)",
              }}
            >
              {/* Profession Icon */}
              <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md">
                {professionIcons[worker.profession] || professionIcons.Default}
              </div>

              {/* Card Content */}
              <div className="flex flex-col items-center text-center mb-4">
              <div className="relative p-1 rounded-full bg-gradient-to-r from-green-500 to-pink-500 shadow-lg">
                <img
                  src={worker.image}
                  alt={worker.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white"
                />
                {worker.available && (
                  <span className="absolute -bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow">
                    Active
                  </span>
                )}
              </div>
                <h2 className="mt-4 text-2xl font-bold text-pink-800">
                  {worker.name}
                </h2>
                <p className="flex items-center gap-2 text-lg text-indigo-900 font-semibold">
                  <Briefcase className="w-5 h-5" /> {worker.profession}
                </p>
                <p className="flex items-center gap-2 text-sm text-indigo-900 mt-2">
                      <Timer className="w-5 h-5 text-blue-500" />{worker.experience}
                </p>
                <p className="flex items-center gap-2 text-sm text-indigo-800">
                  <MapPin className="w-5 h-5 text-orange-800" /> {worker.location}
                </p>
                <p className="flex items-center gap-2 text-sm font-semibold bg-gradient-to-r from-pink-700 to-purple-700 bg-clip-text text-transparent">
                  <PhoneCallIcon className="w-5 h-5" /> {worker.phone}
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-5 flex justify-center gap-4">
                <button
                  disabled={!worker.available}
                  onClick={() => setSelectedWorker(worker)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold shadow-md ${
                    worker.available
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Book
                </button>
                <a href={`tel:${worker.phone}`}
                  className="px-5 py-2 rounded-full text-sm font-semibold shadow-md bg-gradient-to-r from-purple-500 to-indigo-300 text-white"
                >
                  Call Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Worker Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl shadow-xl max-w-3xl w-full p-8 relative">
            <button
              onClick={() => setSelectedWorker(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
            >
              ✕
            </button>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center w-1/3">
                <img src={selectedWorker.image} alt={selectedWorker.name}
                  className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-indigo-500"
                />
                <h2 className="mt-4 text-2xl font-bold text-indigo-800 text-center">
                  {selectedWorker.name}
                </h2>
              </div>
              <div className="flex flex-col justify-between w-2/3">
                <div className="grid grid-cols-1 gap-3">
                  <p className="flex items-center gap-2 text-gray-700 font-medium">
                    <User className="w-5 h-5 text-blue-500" /> {selectedWorker.profession}
                  </p>
                  <p className="flex items-center gap-2 text-gray-500 italic">
                    <Briefcase className="w-5 h-5 text-purple-500" /> {selectedWorker.experience}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-red-500" /> {selectedWorker.location}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <PhoneCallIcon className="w-5 h-5 text-green-500" /> {selectedWorker.phone}
                  </p>
                </div>
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() =>
                      navigate(`/booking/${selectedWorker._id}`, {
                        state: { worker: selectedWorker },
                      })
                    }
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full shadow-lg hover:scale-105 transition-all"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => setSelectedWorker(null)}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full shadow hover:scale-105 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkersPage;
