// pages/BookingPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { issuesData } from "../data/issueOptions";
import { toast } from "sonner";
import axios from "axios";
import {
  MapPin,
  Phone,
  FileText,
  User,
  Home,
  Sun,
  Sunset,
  Moon,
  IndianRupee,
  Timer,
} from "lucide-react";

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// ✅ Phone validation (10 digit India)
const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

const BookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

 const [worker, setWorker] = useState(state?.worker || state || null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

useEffect(() => {
  if (state?.worker) setWorker(state.worker);
  else if (state) setWorker(state);
}, [state]);


  if (!worker) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        Worker details not available.
      </div>
    );
  }

  const professionKey = Object.keys(issuesData).find(
    (key) => key.toLowerCase() === worker?.profession?.toLowerCase().trim()
  );
  const issues = issuesData[professionKey] || [];

  const handleBooking = async () => {
    if (!selectedIssue || !userName || !userPhone || !userAddress || !timeSlot) {
      toast.error("⚠️ Please fill all fields before booking.");
      return;
    }

    if (!isValidPhone(userPhone)) {
      toast.error("📱 Please enter a valid 10-digit phone number.");
      return;
    }

    const bookingData = {
      workerId: worker._id || worker.id, // ✅ must be MongoDB ObjectId string
      workerName: worker.name,
      issue: selectedIssue.label,
      price: selectedIssue.price,
      userName,
      userPhone,
      userAddress,
      timeSlot,
    };

    try {
      await axios.post("http://localhost:5000/api/bookings", bookingData);

      try {
        await axios.post("http://localhost:5000/api/notifications", {
          workerId: worker._id || worker.id,
          message: `New booking from ${userName} for ${selectedIssue.label} at ${timeSlot}`,
        });
      } catch (err) {
        console.warn("Notification failed", err);
      }

      navigate("/confirmation", { state: bookingData });
      toast.success("✅ Booking confirmed!");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("❌ Booking failed. Check backend logs.");
    }
  };

  // ✅ Form validation includes phone check
  const isFormValid =
    userName.trim() &&
    isValidPhone(userPhone) &&
    userAddress.trim() &&
    selectedIssue &&
    timeSlot;

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-teal-50 to-green-100 p-6 flex justify-center items-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
     {/* Worker Profile with Background Image */}
<div
  className="relative rounded-3xl shadow-2xl overflow-hidden transform transition-transform hover:scale-105"
  style={{
    backgroundImage: `url('/bg.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "500px", // Adjust height as needed
  }}
>
  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>

  {/* Content Wrapper */}
  <div className="relative flex flex-col items-center justify-center text-center p-8">
    {/* Gradient Avatar Border */}
    <div className="p-1 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
      <img
        src={
          worker.image && worker.image.trim() !== ""
            ? worker.image
            : "/images/default-avatar.png"
        }
        alt={worker.name}
        className="w-40 h-40 md:w-56 md:h-56 rounded-full object-cover border-4 border-white shadow-lg"
        onError={(e) => {
          if (
            e.target.src !==
            window.location.origin + "/images/default-avatar.png"
          ) {
            e.target.src = "/images/default-avatar.png";
          }
        }}
      />
    </div>

    {/* Name & Profession */}
    <h2 className="text-2xl md:text-5xl font-extrabold text-white mt-6 drop-shadow-md">
      {worker.name}
    </h2>
    <p className="text-base md:text-xl text-yellow-400 capitalize mt-1">
      {worker.profession}
    </p>

    {/* Bio */}
    <p className="text-white/90 mt-3 max-w-md text-sm md:text-base">
      {worker.bio || "No bio available."}
    </p>

    {/* Location */}
    <div className="flex items-center gap-2 mt-4 text-white/80 md:text-2xl">
      <MapPin className="w-5 h-5" />
      <span>{worker.location}</span>
    </div>

    {/* Location */}
    <div className="flex items-center gap-2 mt-4 text-white/80 md:text-xl">
      <Timer className="w-5 h-5" />
      <span>{worker.experience}</span>
    </div>

    {/* Rating */}
    <div className="flex items-center gap-2 mt-2 text-yellow-400 font-semibold text-lg">
      ⭐ {worker.rating || "N/A"}
    </div>

    {/* Contact Button */}
    <a  href={`tel:${worker.phone}`}
     className="mt-6 px-6 py-2 bg-white/90 text-purple-700 font-semibold rounded-full shadow-lg hover:bg-white transition-colors">
      Contact
    </a>
  </div>
</div>



        {/* Booking Form */}
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <FileText className="w-5 h-5 text-teal-600" /> Book Service
          </h3>

          {/* User Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 shadow-sm">
              <User className="w-5 h-5 text-teal-600" />
              <input
                type="text"
                placeholder="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>
            <div
              className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-sm ${
                userPhone && !isValidPhone(userPhone)
                  ? "bg-red-50 border border-red-300"
                  : "bg-gray-50"
              }`}
            >
              <Phone className="w-5 h-5 text-teal-600" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>
            {userPhone && !isValidPhone(userPhone) && (
              <p className="text-red-500 text-sm ml-2">
                Enter a valid 10-digit phone number
              </p>
            )}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 shadow-sm">
              <Home className="w-5 h-5 text-teal-600" />
              <input
                type="text"
                placeholder="Full Address"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Issues Dropdown */}
          <h4 className="text-lg font-semibold text-gray-700 mt-8 mb-3">
            Select Issue
          </h4>
          <select
            value={selectedIssue?.label || ""}
            onChange={(e) => {
              const issue = issues.find((i) => i.label === e.target.value);
              setSelectedIssue(issue);
            }}
            className="w-full p-3 rounded-xl border bg-white shadow-sm focus:ring-2 focus:ring-teal-400"
          >
            <option value="">-- Select an Issue --</option>
            {issues.map((issue, idx) => (
              <option key={idx} value={issue.label}>
                {issue.label} - ₹{issue.price}
              </option>
            ))}
          </select>

          {/* Total Amount */}
          {selectedIssue && (
            <div className="mt-6 flex items-center justify-between bg-teal-50 border border-teal-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 text-teal-700 font-semibold">
                <IndianRupee className="w-5 h-5" />
                <span>Total Amount</span>
              </div>
              <span className="text-lg font-bold text-gray-800">
                ₹{selectedIssue.price}
              </span>
            </div>
          )}

          {/* Time Slots */}
          <h4 className="text-lg font-semibold text-gray-700 mt-8 mb-3">
            Select Time Slot
          </h4>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Morning", icon: Sun },
              { label: "Afternoon", icon: Sunset },
              { label: "Evening", icon: Moon },
            ].map((slot) => (
              <button
                key={slot.label}
                onClick={() => setTimeSlot(slot.label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                  timeSlot === slot.label
                    ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <slot.icon className="w-4 h-4" />
                {slot.label}
              </button>
            ))}
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleBooking}
            disabled={!isFormValid}
            className={`mt-8 w-full py-3 rounded-xl font-semibold text-lg shadow-lg transition-transform ${
              isFormValid
                ? "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:scale-[1.02]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
