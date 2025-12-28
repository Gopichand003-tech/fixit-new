// pages/BookingPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { issuesData } from "../data/issueOptions";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios";
import { motion } from "framer-motion";
import { professionIcons } from "../data/professionIcons"; // ✅ correct spelling
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

// Helper: Phone validation (10-digit India)
const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

// Helper: Centralized auth headers
const getAuthHeaders = () => {
  const token = Cookies.get("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper: Decode JWT and return userId
const getUserIdFromToken = () => {
  const token = Cookies.get("token");
  if (!token) return null;

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.id || decoded._id || decoded.userId || decoded.sub || null;
  } catch (err) {
    console.error("JWT decode error:", err);
    return null;
  }
};

const BookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [worker, setWorker] = useState(state?.worker || state || null);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [whatsappStatus, setWhatsappStatus] = useState(null); // ✅ WhatsApp feedback
  const [submitting, setSubmitting] = useState(false);
const [selectedDay, setSelectedDay] = useState("Today");
const [timePeriod, setTimePeriod] = useState("");
const isAvailableToday = selectedDay === "Today";


// ===== HANDLERS =====
const toggleIssue = (issue) => {
  setSelectedIssues((prev) => {
    const exists = prev.find((i) => i.label === issue.label);
    return exists
      ? prev.filter((i) => i.label !== issue.label)
      : [...prev, issue];
  });
};

const totalAmount = selectedIssues.reduce(
  (sum, i) => sum + Number(i.price || 0),
  0
);


const timeSlotsByPeriod = {
  Morning: ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"],
  Afternoon: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"],
  Evening: ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"],
};

// ===== HELPERS =====
const toMinutes = (time) => {
  const [hm, ap] = time.split(" ");
  let [h, m] = hm.split(":").map(Number);

  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;

  return h * 60 + m;
};


const isPastTime = (time) => {
  if (selectedDay !== "Today") return false;
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  return toMinutes(time) <= nowMin;
};

  useEffect(() => {
    if (state?.worker) setWorker(state.worker);
    else if (state) setWorker(state);
  }, [state]);

  if (!worker)
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        Worker details not available.
      </div>
    );

  // Issues dropdown based on profession
  const professionKey = Object.keys(issuesData).find(
    (key) =>
      key.toLowerCase() === worker?.profession?.toLowerCase().trim()
  );
  const issues = issuesData[professionKey] || [];

  const handleBooking = async () => {
   if (
  selectedIssues.length === 0 ||
  !userName ||
  !userPhone ||
  !userAddress ||
  !timeSlot ||
  !timePeriod ||
  !selectedDay
) {
  toast.error("⚠️ Please fill all fields before booking.");
  return;
}

    if (!isValidPhone(userPhone)) {
      toast.error("⚠️ Please enter a valid 10-digit phone number.");
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      toast.error("❌ You must be logged in to book a service.");
      navigate("/login");
      return;
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      toast.error("❌ Unable to identify user. Please login again.");
      Cookies.remove("token");
      navigate("/login");
      return;
    }

    // ✅ Sanitize worker phone number for E.164 format
    let formattedWorkerPhone = worker.phone?.replace(/\D/g, "");
    if (!formattedWorkerPhone.startsWith("91")) formattedWorkerPhone = "91" + formattedWorkerPhone;
    formattedWorkerPhone = "+" + formattedWorkerPhone;

   const bookingData = {
  workerId: worker.id || worker._id,
  workerName: worker.name,
  workerPhone: formattedWorkerPhone,

  issues: selectedIssues.map(i => ({
    label: i.label,
    price: i.price,
  })),
  totalPrice: totalAmount,

  userId,
  userName,
  userPhone,
  userAddress,
  timeSlot,
};


    // console.log("🚀 Sending booking request to:", import.meta.env.VITE_API_URL);
    // console.log("📦 Booking payload:", bookingData);

     setSubmitting(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        bookingData,
        { headers: getAuthHeaders() }
      );



      console.log("✅ Booking API Response:", res.data);
      
      // Update WhatsApp status for UI feedback
      if (res.data.whatsappStatus) setWhatsappStatus(res.data.whatsappStatus);
      if (res.data.whatsappStatus === "failed") {
        toast.error(`WhatsApp failed: ${res.data.whatsappError}`);
      } else {
        toast.success("✅ Booking submitted! Worker will be notified via WhatsApp.");
      } 

      // Optional: in-app notification
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/notifications`,
          {
           workerId: worker.id || worker._id,

message: `New booking from ${userName} for ${selectedIssues
  .map(i => i.label)
  .join(", ")} at ${timeSlot}`,
          },
          { headers: getAuthHeaders() }
        );
      } catch (err) {
        console.warn("⚠️ Notification failed", err);
      }

      navigate("/bookingsubmitted");
    } catch (err) {
      console.error("❌ Booking error:", err.response?.data || err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("❌ Token invalid or expired. Please login again.");
        Cookies.remove("token");
      } else if (err.response?.status === 400) {
        toast.error("❌ Booking failed. Invalid request data.");
      } else {
        toast.error("❌ Booking failed. Please try again later.");
      } 
       setSubmitting(false);
    }
  };

  const isFormValid =
    userName.trim() &&
    isValidPhone(userPhone) &&
    userAddress.trim() &&
    selectedIssues &&
    timeSlot;

  return (
   <div className="
  min-h-screen
  bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100
  px-3 sm:px-6
  py-6
  flex justify-center
">
  <div className="
    w-full max-w-7xl
    grid grid-cols-1 lg:grid-cols-[420px_1fr]
    gap-6 lg:gap-10
  ">

        {/* Worker Profile */}
<motion.div
  initial={{ opacity: 0, y: 40, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className="
    lg:sticky lg:top-6
    rounded-3xl overflow-hidden
    shadow-2xl ring-1 ring-white/20
  "
  style={{
    backgroundImage: `url(${worker.image || "/images/default-avatar.png"})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "520px",
  }}
>
  {/* Apple-style blur overlay */}
  <div className="absolute inset-0 backdrop-blur-s bg-black/40"></div>

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center text-center p-35">

    {/* Avatar
    <div className="p-1 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-xl">
      <img
        src={worker.image || "/images/default-avatar.png"}
        alt={worker.name}
        className="
          w-28 h-28 sm:w-36 sm:h-36
          rounded-full object-cover
          border-4 border-white
          shadow-lg
        "
      />
    </div> */}

    {/* Name */}
    <h2 className="mt-5 text-2xl sm:text-5xl font-extrabold text-white drop-shadow">
      {worker.name}
    </h2>

    {/* Profession */}
    <div className="
      mt-3 inline-flex items-center gap-2
      px-4 py-2 rounded-full
      bg-white/90 backdrop-blur
      text-emerald-600
      font-semibold capitalize
      shadow
    ">
      {professionIcons[worker.profession] || professionIcons.Default}
      <span>{worker.profession}</span>
    </div>

    {/* Availability Badge */}
    <div
      className={`
        mt-4 px-4 py-1.5 rounded-full text-sm font-semibold
        ${
          isAvailableToday
            ? "bg-emerald-500/90 text-white"
            : "bg-amber-400/90 text-black"
        }
      `}
    >
      {isAvailableToday ? "Available Today" : "Available Tomorrow"}
    </div>

    {/* Online Status */}
    <div className="relative mt-3 flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
      </span>
      <span className="text-sm text-white/90 font-medium">
        Online now
      </span>
    </div>

    {/* Location */}
    <div className="flex items-center gap-2 mt-5 text-white/90 text-sm sm:text-base">
      <MapPin className="w-4 h-4" />
      <span>{worker.location}</span>
    </div>

    {/* Experience */}
    <div className="flex items-center gap-2 mt-2 text-white/90 text-sm sm:text-base">
      <Timer className="w-4 h-4" />
      <span>{worker.experience}</span>
    </div>

   
  </div>
</motion.div>

        {/* Booking Form */}
<div className="
  bg-white/90 backdrop-blur-xl
  rounded-3xl
  shadow-2xl
  ring-1 ring-black/5
  p-6 sm:p-10
">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center justify-content-center translate-x-65 gap-2">
            <FileText className="w-6 h-6 text-teal-600 " /> Book Service
          </h3>

          {/* Personal info */}
          <div className="space-y-4">
<div className="
  flex items-center gap-3
  px-4 py-3
  rounded-xl
  bg-gray-50
  ring-1 ring-gray-200
  focus-within:ring-2 focus-within:ring-emerald-500
  transition
">
              <User className="w-5 h-5 text-teal-600" />
              <input type="text" placeholder="Your Name" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-transparent outline-none"/>
            </div>

            <div className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-sm ${userPhone && !isValidPhone(userPhone) ? "bg-red-50 border border-red-300" : "bg-gray-50"}`}>
              <Phone className="w-5 h-5 text-teal-600" />
              <input type="tel" placeholder="Phone Number" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} className="w-full bg-transparent outline-none"/>
            </div>

{userPhone && !isValidPhone(userPhone) && (
  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
     Enter a valid 10-digit Indian number
  </p>
)}
            
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 shadow-sm">
              <Home className="w-5 h-5 text-teal-600" />
              <input type="text" placeholder="Full Address" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} className="w-full bg-transparent outline-none"/>
            </div>
          </div>


     {/* Issue Selection (Multiple) */}
<h4 className="text-lg font-semibold text-gray-700 mt-8 mb-3">
  Select Issues
</h4>

<div className="flex flex-wrap gap-2">
  {issues.map((issue) => {
    const active = selectedIssues.some(
      (i) => i.label === issue.label
    );

    return (
      <button
        key={issue.label}
        type="button"
        onClick={() => toggleIssue(issue)}
        className={`
          px-3 py-1.5 rounded-full
          text-sm font-medium
          border transition
          ${
            active
              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }
        `}
      >
        {issue.label}
        <span className="ml-1 text-xs opacity-80">
          ₹{issue.price}
        </span>
      </button>
    );
  })}
</div>

{/* Selected Issues Summary */}
{selectedIssues.length > 0 && (
  <div className="mt-3 text-sm">
    {/* Top row */}
    <div className="flex items-center justify-between">
      <span className="text-gray-600">
        {selectedIssues.length} issue(s) selected
      </span>

      <span className="flex items-center gap-1 font-semibold text-emerald-700">
        <IndianRupee className="w-4 h-4" />
        {totalAmount}
      </span>
    </div>

    {/* Compact list */}
    <div className="mt-1 flex flex-wrap gap-2">
      {selectedIssues.map((i) => (
        <span
          key={i.label}
          className="
            px-2 py-0.5
            rounded-full
            bg-emerald-50
            text-emerald-700
            text-xs
            border border-emerald-200
          "
        >
          {i.label} · ₹{i.price}
        </span>
      ))}
    </div>
  </div>
)}


{/* Select Time of Day */}
<h4 className="text-lg font-semibold text-gray-700 mt-8 mb-3 -translate-y-3">
  Select Day
</h4>

<div className="flex gap-3 -translate-y-4">
  {["Today", "Tomorrow"].map((day) => (
    <button
      key={day}
      type="button"
      onClick={() => {
        setSelectedDay(day);
        setTimeSlot("");
        setTimePeriod("");
      }}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
        selectedDay === day
          ? "bg-emerald-600 text-white shadow"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {day}
    </button>
  ))}
</div>

<div className="flex gap-3 flex-wrap">
  {[
    { label: "Morning", icon: Sun },
    { label: "Afternoon", icon: Sunset },
    { label: "Evening", icon: Moon },
  ].map((slot) => (
    <button
      key={slot.label}
      type="button"
      onClick={() => {
        setTimePeriod(slot.label);
        setTimeSlot("");
      }}
      className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
        timePeriod === slot.label
          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md scale-105"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      <slot.icon className="w-4 h-4" />
      {slot.label}
    </button>
  ))}
</div>

{/* Select Exact Time (LEFTOVER TIME LOGIC) */}
{timePeriod && (
  <>
    <h4 className="text-lg font-semibold text-gray-700 mt-8 mb-3">
      Select Exact Time
    </h4>

    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {timeSlotsByPeriod[timePeriod].map((time) => {
        const disabled = isPastTime(time);
        return (
          <button
            key={time}
            type="button"
            disabled={disabled}
            onClick={() => setTimeSlot(`${selectedDay} • ${time}`)}
            className={`px-4 py-3 rounded-xl text-sm font-semibold transition ${
              disabled
                ? "bg-gray-200 text-gray-400 cursor-not-allowed line-through"
                : timeSlot.includes(time)
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {time}
          </button>
        );
      })}
    </div>
  </>
)}

{/* Selected Slot Summary */}
{timeSlot && (
  <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-sm">
     Selected Slot: {timeSlot}
  </div>
)}

          {whatsappStatus && (
            <p className={`mt-4 font-semibold ${whatsappStatus === "success" ? "text-green-600" : "text-red-600"}`}>
              WhatsApp Status: {whatsappStatus === "success" ? "Sent ✅" : "Failed ❌"}
            </p>
          )}

         <button
  onClick={handleBooking}
  disabled={!isFormValid || submitting}
  className={`
    mt-8 w-full
    py-4 rounded-2xl
    text-lg font-bold
    flex items-center justify-center gap-3
    transition-all
    ${
      submitting
        ? "bg-gray-400 text-white cursor-not-allowed"
        : isFormValid
        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:scale-[1.02] shadow-xl"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
  `}
>
  {submitting ? (
    <>
      <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
      Booking...
    </>
  ) : (
    "Confirm Booking"
  )}
</button>


        </div>
      </div>
    </div>
  );
};

export default BookingPage;
