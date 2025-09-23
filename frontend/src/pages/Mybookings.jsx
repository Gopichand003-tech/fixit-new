import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.bookings);
    } catch (err) {
      console.error("Error fetching bookings:", err.response?.data || err.message);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const token = Cookies.get("token");
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(res.data.message);
      fetchBookings(); // Refresh list
    } catch (err) {
      console.error("Cancel booking error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li key={b._id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p>
                  <strong>{b.issue}</strong> - ₹{b.price}
                </p>
                <p>{b.timeSlot} | Status: {b.status}</p>
                <p>{b.workerName} | {b.workerPhone}</p>
              </div>
              {b.status !== "cancelled" && (
                <button
                  onClick={() => cancelBooking(b._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Cancel
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;
