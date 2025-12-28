import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Home, ArrowRight } from "lucide-react";

const BookingSubmitted = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        min-h-screen flex items-center justify-center
        bg-gradient-to-br from-green-50 via-teal-50 to-green-100
        px-4
      "
    >
      {/* Card */}
      <div
        className="
          w-full max-w-md
          bg-white/80 backdrop-blur-xl
          rounded-3xl
          shadow-2xl
          p-8 sm:p-10
          text-center
          ring-1 ring-black/5
        "
      >
        {/* Success Icon */}
        <div
          className="
            mx-auto mb-6
            w-20 h-20 sm:w-24 sm:h-24
            rounded-full
            bg-green-100
            flex items-center justify-center
            shadow-md
            animate-pulse
          "
        >
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-green-700 mb-3">
          Booking Submitted!
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-lg text-gray-600 mb-8 leading-relaxed">
          The worker has been notified via WhatsApp.
          <br className="hidden sm:block" />
          They will contact you shortly.
        </p>

        {/* Back to Dashboard Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="
            group
            w-full sm:w-auto
            inline-flex items-center justify-center gap-3
            px-7 py-3
            rounded-2xl
            font-semibold text-white
            bg-gradient-to-r from-green-600 to-teal-600
            shadow-lg
            ring-2 ring-green-400/30
            hover:shadow-2xl hover:ring-green-400/60
            transition-all duration-300
            active:scale-95
          "
        >
          <Home className="w-5 h-5" />
          Back to Dashboard
          <ArrowRight
            className="
              w-5 h-5
              transition-transform
              group-hover:translate-x-1
            "
          />
        </button>
      </div>
    </div>
  );
};

export default BookingSubmitted;
