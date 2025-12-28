import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Trash2,
  X,
  Calendar,
  Phone,
  IndianRupee,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { motion } from "framer-motion";


/* ---------------- STATUS STYLES ---------------- */
const statusStyles = {
  "request-sent": "bg-yellow-100 text-yellow-800",
  "worker-viewed": "bg-blue-100 text-blue-800",
  "worker-accepted": "bg-green-100 text-green-800",
  "worker-rejected": "bg-red-100 text-red-800",
  confirmed: "bg-teal-100 text-teal-800",
  completed: "bg-purple-100 text-purple-800",
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [cancelId, setCancelId] = useState(null);
  const [loadingCancel, setLoadingCancel] = useState(false);

  /* ---------------- FORMAT STATUS ---------------- */
  const formatStatus = (status) =>
    status
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");

  /* ---------------- FETCH BOOKINGS ---------------- */
 const fetchBookings = async () => {
  try {
    const token = Cookies.get("token");

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/bookings`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const activeBookings = res.data.bookings.filter(
      (b) => b.status !== "user-cancelled"
    );

    setBookings((prev) => {
      activeBookings.forEach((newB) => {
        const old = prev.find((p) => p._id === newB._id);

        if (
          old &&
          old.status !== newB.status &&
          newB.status === "worker-accepted"
        ) {
          toast.success("🎉 Your booking has been accepted!");
        }

        if (
          old &&
          old.status !== newB.status &&
          newB.status === "worker-rejected"
        ) {
          toast.error("❌ Your booking was rejected");
        }
      });

      return activeBookings;
    });
  } catch (err) {
    toast.error("Failed to fetch bookings");
  }
};

  useEffect(() => {
    fetchBookings();

    // Optional auto-refresh every 8s
    const interval = setInterval(fetchBookings, 8000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- CANCEL BOOKING ---------------- */
  const confirmCancel = async () => {
    if (!cancelId) return;

    setLoadingCancel(true);

    try {
      const token = Cookies.get("token");

      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${cancelId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        res.data.whatsappStatus === "failed"
          ? "Booking cancelled (WhatsApp failed)"
          : "Booking cancelled & worker notified ✅"
      );

      setBookings((prev) =>
        prev.filter((b) => b._id !== cancelId)
      );
    } catch (err) {
      toast.error("Cancel failed. Syncing again...");
      fetchBookings();
    } finally {
      setCancelId(null);
      setLoadingCancel(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <Toaster position="top-center" richColors />

      {/* ---------------- HEADER ---------------- */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
          My Bookings
        </h2>
        <p className="mt-2 text-gray-500">
          Track and manage your service bookings
        </p>
      </div>

      {/* ---------------- EMPTY STATE ---------------- */}
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No bookings available
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {bookings.map((b) => (
    <motion.div
      key={b._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        relative
        bg-white/90 backdrop-blur-xl
        rounded-3xl p-6
        shadow-[0_20px_60px_rgba(0,0,0,0.12)]
        hover:-translate-y-1 hover:shadow-2xl
        transition-all duration-300
        flex flex-col justify-between
        border border-white/40
      "
    >
      {/* Status Ribbon */}
      <span
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold
        ${statusStyles[b.status] || "bg-gray-100 text-gray-700"}`}
      >
        {formatStatus(b.status)}
      </span>

      {/* ---------------- BOOKING INFO ---------------- */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-gray-800 leading-tight">
          {b.issue}
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-gray-800">₹{b.price}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            {b.timeSlot}
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-500" />
            <span className="font-medium">{b.workerName}</span>
            <span className="text-gray-400">·</span>
            {b.workerPhone}
          </div>
        </div>
      </div>

      {/* ---------------- FOOTER ACTIONS ---------------- */}
      <div className="mt-6 flex items-center justify-between">
        {b.status === "worker-accepted" && (
          <span className="text-xs text-emerald-600 font-semibold">
            🎉 Provider accepted your request
          </span>
        )}

        {b.status !== "completed" &&
          b.status !== "worker-rejected" && (
            <button
              onClick={() => setCancelId(b._id)}
              className="
                flex items-center gap-1
                px-4 py-2
                rounded-full
                bg-red-500/90 text-white text-sm font-semibold
                hover:bg-red-600 active:scale-95
                transition
              "
            >
              <Trash2 className="w-4 h-4" />
              Cancel
            </button>
          )}
      </div>
    </motion.div>
  ))}
</div>

      )}

      {/* ---------------- CANCEL MODAL ---------------- */}
      {cancelId && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setCancelId(null)}
          />

          {/* Modal */}
          <div className="fixed inset-x-4 bottom-6 sm:inset-0 sm:flex sm:items-center sm:justify-center z-50">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl w-full max-w-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Cancel Booking?
                </h3>
                <button onClick={() => setCancelId(null)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-6">
                Are you sure you want to cancel this booking?
                The worker will be notified immediately.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setCancelId(null)}
                  className="
                    flex-1 py-2.5
                    rounded-full
                    bg-gray-100 text-gray-700 font-medium
                    hover:bg-gray-200
                    transition
                  "
                >
                  Keep Booking
                </button>

                <button
                  onClick={confirmCancel}
                  disabled={loadingCancel}
                  className="
                    flex-1 py-2.5
                    rounded-full
                    bg-red-500 text-white font-semibold
                    hover:bg-red-600
                    transition
                  "
                >
                  {loadingCancel ? "Cancelling..." : "Cancel Booking"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyBookings;
