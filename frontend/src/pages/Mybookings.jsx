import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = Cookies.get("token");
      console.log("Token from cookie:", token);

      try {
      // 4️⃣ Save booking
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        bookingData,
        { headers: getAuthHeaders() }
      );

        console.log("Bookings from API:", data.bookings);
        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err.response?.data || err.message);
        setBookings([]); // fallback to empty
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-6">My Bookings</h1>

      {loading ? (
        <p className="text-gray-700">Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-700">You have no bookings yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-xl text-green-700">
                {b.workerName}
              </h2>
              <p className="text-gray-700 mt-1">
                Issue: <span className="font-medium">{b.issue}</span>
              </p>
              <p className="text-gray-700 mt-1">
                Time Slot: <span className="font-medium">{b.timeSlot}</span>
              </p>
              <p className="text-gray-700 mt-1">
                Amount: <span className="font-medium">₹{b.price}</span>
              </p>
              <p
                className={`mt-2 font-semibold ${
                  b.status.toLowerCase() === "confirmed"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                Status: {b.status || "Pending"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
