import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
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
  Factory,
  PartyPopper,
  Gift,
  EyeClosed,
  CameraIcon,
  Timer,
  Tv2,
  Truck,
  PaintRoller,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const WorkersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedProfession = location.state?.profession || "All";
  const selectedLocation = location.state?.location || "";

  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Profession → Icon mapping
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
    Delivery: <Truck className="w-6 h-6 text-indigo-700" />,
    FactoryWorker: <Factory className="w-6 h-6 text-gray-800" />,
    EventPlanner: <PartyPopper className="w-6 h-6 text-purple-500" />,
    GiftShop: <Gift className="w-6 h-6 text-rose-600" />,
    Security: <EyeClosed className="w-6 h-6 text-gray-600" />,
    Mechanic: <Car className="w-6 h-6 text-red-600" />,
    Landscaping: <Scissors className="w-6 h-6 text-green-600" />,
    Photography: <CameraIcon className="w-6 h-6 text-indigo-600" />,
    Catering: <UtensilsCrossed className="w-6 h-6 text-orange-600" />,
    MusicTeacher: <Music className="w-6 h-6 text-pink-600" />,
    Electronics: <Tv2 className="w-6 h-6 text-rose-600" />,
    Default: <Briefcase className="w-6 h-6 text-gray-600" />,
  };

  const normalizeWorker = (w) => {
    let imagePath = w.documents?.photo || w.image;
    const image =
      imagePath && (imagePath.startsWith("http://") || imagePath.startsWith("https://"))
        ? imagePath
        : imagePath
        ? `${API_BASE}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`
        : "/placeholder-user.jpg";

    return {
      _id: w._id || w.id,
      id: w._id || w.id,
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
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/providers`);
        const backendWorkers = res.data.map((w) => normalizeWorker(w));

        let filtered = backendWorkers;
        if (selectedProfession !== "All") {
          filtered = filtered.filter(
            (w) =>
              w.profession?.toLowerCase().trim() ===
              selectedProfession.toLowerCase().trim()
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
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, [selectedProfession, selectedLocation]);

  return (
    <div
      className="w-screen min-h-screen py-16 overflow-x-hidden relative bg-cover bg-center"
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
<h2 className="text-4xl md:text-6xl font-extrabold 
               text-white px-8 py-4 rounded-3xl 
                 bg-gradient-to-r from-blue-700 to-gray-800
               shadow-lg mt-8 mb-6 mx-auto text-center w-fit">
                            {selectedProfession === "All" ? "All Services" : selectedProfession}
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-4 rounded-full"></div>
        <p className="text-lg text-gray-200 max-w-3xl mx-auto">
          Discover the most requested services in your area. All our providers are verified and highly rated.
        </p>
      </div>

      {/* Worker Cards */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-10 py-8">
        {loading ? (
          // 🔹 Shimmer Loading UI
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-3xl p-6 shadow-lg bg-white/20 backdrop-blur-md h-80"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-gray-300"></div>
                <div className="mt-4 h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                <div className="mt-2 h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
                <div className="mt-2 h-3 bg-gray-300 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : filteredWorkers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredWorkers.map((worker) => (
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
  <div className="absolute inset-0 bg-black/60 rounded-3xl"></div>

  {/* Profession Icon */}
  <div className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md z-10">
    {professionIcons[worker.profession] || professionIcons.Default}
  </div>

  

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
        // worker.available && navigate(`/booking/${worker._id || worker.id}`, { state: { worker } })
        setSelectedWorker(worker)
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
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center w-full py-20">
            <p className="text-2xl font-semibold text-gray-200 bg-black/40 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-lg border border-indigo-300">
              😔 Sorry, no workers are available right now
              {selectedProfession !== "All" && (
                <> for <span className="font-bold text-indigo-300">{selectedProfession}</span></>
              )}
              {selectedLocation && (
                <> in <span className="font-bold text-indigo-300">{selectedLocation}</span></>
              )}.
            </p>
          </div>
        )}
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
                <img
                  src={selectedWorker.image}
                  alt={selectedWorker.name}
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
