import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = Cookies.get("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        { headers: getAuthHeaders() }
      );

      // Make sure you use the correct key from the backend
      // If backend sends { bookings: [...] } then use res.data.bookings
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) return <p>Loading your bookings...</p>;

  if (!bookings.length)
    return <p>No bookings found. Make a booking first!</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      <ul className="space-y-4">
        {bookings.map((b) => (
          <li
            key={b._id}
            className="p-4 border rounded-lg shadow-sm flex justify-between"
          >
            <div>
              <p>
                <strong>Worker:</strong> {b.workerName} ({b.workerPhone})
              </p>
              <p>
                <strong>Issue:</strong> {b.issue} | <strong>Price:</strong> ₹{b.price}
              </p>
              <p>
                <strong>Time Slot:</strong> {b.timeSlot} | <strong>Status:</strong> {b.status}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBookings;
