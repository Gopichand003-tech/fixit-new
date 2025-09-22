import React from "react";
import { Link } from "react-router-dom";
import { CheckCircleIcon, Home } from "lucide-react";

const BookingSubmitted = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-50 via-teal-50 to-green-50 p-6">
      
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-100 shadow-lg mb-6 animate-bounce">
        <CheckCircleIcon className="w-12 h-12 text-green-600" />
      </div>
      
      <h1 className="text-4xl font-extrabold text-green-700 mb-4 text-center">
        Booking Submitted!
      </h1>
      
      <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
        The worker has been notified via WhatsApp. They will contact you shortly.
      </p>

      <Link
        to="/dashboard"
        className="flex items-center gap-3 px-8 py-3 bg-white/70 backdrop-blur-md text-green-700 rounded-3xl font-semibold shadow-lg hover:shadow-2xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
      >
        <Home className="w-5 h-5" />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default BookingSubmitted;
