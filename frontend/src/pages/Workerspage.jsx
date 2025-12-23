import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin,
  PhoneCall as PhoneCallIcon,
  Briefcase,
  Timer,
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

  /* ---------------- Normalize Worker ---------------- */
  const normalizeWorker = (w) => {
    let imagePath = w.documents?.photo || w.image;
    const image =
      imagePath && imagePath.startsWith("http")
        ? imagePath
        : imagePath
        ? `${API_BASE}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`
        : "/placeholder-user.jpg";

    return {
      id: w._id || w.id,
      name: w.name || "Unnamed Worker",
      profession: w.profession || w.service || "Service",
      location: w.location || "Unknown",
      phone: w.phone || "N/A",
      image,
      experience: w.experience || "New Worker",
      available: w.available ?? true,
      isOnline: w.isOnline ?? false,
    };
  };

  /* ---------------- Fetch Workers ---------------- */
  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/providers`, {
        timeout: 5000,
      });

      if (!Array.isArray(data)) {
        setFilteredWorkers([]);
        return;
      }

      let workers = data.map(normalizeWorker);

      workers = workers.filter((w) => w.isOnline || w.available);

      if (selectedProfession !== "All") {
        workers = workers.filter(
          (w) =>
            w.profession.toLowerCase().trim() ===
            selectedProfession.toLowerCase().trim()
        );
      }

      if (selectedLocation) {
        workers = workers.filter((w) =>
          w.location.toLowerCase().includes(selectedLocation.toLowerCase())
        );
      }

      setFilteredWorkers(workers);
    } catch (err) {
      console.warn("⚠️ Keeping previous workers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
    const interval = setInterval(fetchWorkers, 30000);
    return () => clearInterval(interval);
  }, [selectedProfession, selectedLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white py-24 px-4">

      {/* BACK BUTTON */}
      <button
        type="button"
        onClick={() =>
          window.history.length > 1 ? navigate(-1) : navigate("/dashboard")
        }
        className="fixed top-6 left-6 z-[999] px-4 py-2 rounded-full bg-blue-500 text-white font-semibold shadow-lg hover:bg-blue-600 transition"
      >
        ← Back
      </button>

      {/* ---------------- TOP HERO ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-20 -translate-y-20 text-xl">

        {/* LEFT */}
        <div className="text-center lg:text-left translate-x-40">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-extrabold text-gray-900 mb-6 ">
            Find Local <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500">
              {selectedProfession === "All"
                ? "Service Providers"
                : selectedProfession}
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-xl">
            Easily connect with trusted professionals
            {selectedLocation && (
              <> in <span className="font-semibold">{selectedLocation}</span></>
            )}
            . Book skilled workers instantly.
          </p>

          <p className="mt-4 text-sm text-gray-800">
            ✔ Verified workers • ✔ Instant booking • ✔ Secure payments
          </p>
        </div>

        {/* RIGHT VIDEO */}
        <div className="flex justify-center lg:justify-end  -translate-x-40 mb-20 mt-20">
          <div className="w-72 h-72 lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden shadow-xl">
            <video
              src="/mainpage.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <p className="text-center text-gray-500 text-lg">
          Loading providers...
        </p>
      ) : filteredWorkers.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center mb-6">
            <Briefcase className="w-12 h-12 text-blue-500" />
          </div>

          <h3 className="text-3xl font-extrabold text-gray-800">
            No workers available
          </h3>

          <p className="mt-3 text-gray-600 max-w-md">
            We couldn’t find any{" "}
            <span className="font-semibold">
              {selectedProfession !== "All" ? selectedProfession : "providers"}
            </span>
            {selectedLocation && (
              <> in <span className="font-semibold">{selectedLocation}</span></>
            )}
            .
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow hover:scale-105 transition"
          >
            Go Back Home
          </button>
        </div>
      ) : (
        /* WORKER GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="group relative h-[420px] rounded-3xl overflow-hidden shadow-xl hover:-translate-y-2 transition"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-[1400ms]"
                style={{ backgroundImage: `url(${worker.image})` }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

              {worker.isOnline && (
                <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full">
                  ONLINE
                </span>
              )}

              <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white space-y-3">
                <h3 className="text-2xl font-extrabold">{worker.name}</h3>

                <p className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4" /> {worker.profession}
                </p>

                <p className="flex items-center gap-2 text-sm">
                  <Timer className="w-4 h-4" /> {worker.experience}
                </p>

                <p className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" /> {worker.location}
                </p>

                <button
                  onClick={() => setSelectedWorker(worker)}
                  className="mt-4 py-2 rounded-full bg-white text-indigo-700 font-semibold hover:scale-105 transition"
                >
                  Book a Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL (UNCHANGED) ================= */}
      {selectedWorker && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedWorker(null)}
          />

          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 md:hidden">
            <h3 className="text-xl font-bold text-center">
              {selectedWorker.name}
            </h3>
            <p className="text-center text-indigo-600">
              {selectedWorker.profession}
            </p>

            <button
              onClick={() =>
                navigate(`/booking/${selectedWorker.id}`, {
                  state: { worker: selectedWorker },
                })
              }
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-full font-semibold"
            >
              Confirm Booking
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkersPage;
