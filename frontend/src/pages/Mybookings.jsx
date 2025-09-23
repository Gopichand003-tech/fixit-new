import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Trash2 } from "lucide-react";

const statusColors = {
  "request-sent": "bg-yellow-100 text-yellow-800",
  "worker-viewed": "bg-blue-100 text-blue-800",
  "worker-accepted": "bg-green-100 text-green-800",
  "worker-rejected": "bg-red-100 text-red-800",
  "confirmed": "bg-teal-100 text-teal-800",
  "completed": "bg-purple-100 text-purple-800",
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // ✅ Filter out cancelled bookings
      const activeBookings = res.data.bookings.filter(b => b.status !== "user-cancelled");
      setBookings(activeBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err.response?.data || err.message);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const token = Cookies.get("token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings(); // Refresh list
    } catch (err) {
      console.error("Cancel booking error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-green-50 via-teal-50 to-green-50">
      <h2 className="text-3xl font-extrabold mb-6 text-center">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No bookings found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="relative bg-white rounded-3xl shadow-xl p-6 flex flex-col justify-between transition-transform hover:scale-105"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800">{b.issue}</h3>
                <p className="text-gray-600 mt-1">₹{b.price}</p>
                <p className="text-gray-500 mt-2">
                  <span className="font-semibold">Time Slot:</span> {b.timeSlot}
                </p>
                <p className="text-gray-500 mt-1">
                  <span className="font-semibold">Worker:</span> {b.workerName} | {b.workerPhone}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[b.status] || "bg-gray-100 text-gray-700"}`}
                >
                  {b.status.replace("-", " ")}
                </span>

                {(b.status !== "completed") && (
                  <button
                    onClick={() => cancelBooking(b._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
