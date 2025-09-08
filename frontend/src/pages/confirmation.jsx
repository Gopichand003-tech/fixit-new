import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  MapPin,
  Phone,
  User,
  Home,
  FileCheck,
  IndianRupee,
  Clock,
  GhostIcon,
  ToolCase,
  PartyPopper,
} from "lucide-react";

const ConfirmationPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (state) {
      // Send booking to backend
      const sendBooking = async () => {
        try {
          await axios.post("/api/bookings", {
            workerId: state.worker?._id,
            userName: state.userName,
            userPhone: state.userPhone,
            userAddress: state.userAddress,
            issue: state.issue,
            price: state.price,
            timeSlot: state.timeSlot,
          });
          console.log("Booking saved successfully!");
        } catch (error) {
          console.error("Error saving booking:", error);
        }
      };

      sendBooking();
    }
  }, [state]);


  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-teal-100 to-green-100 flex justify-center items-center p-6">
      <Card className="max-w-2xl w-full shadow-2xl rounded-2xl bg-white border border-gray-200">
        <CardContent className="space-y-8 p-8">
          {/* Success Message */}
          <div className="text-center">
            <FileCheck className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
            <h2 className="text-3xl font-bold text-gray-800 mt-4">
                <PartyPopper className="w-10  h-10 inline mr-2 text-purple-600" /> Booking Confirmed!
            </h2>
            <p className="text-gray-600 mt-2">
              Thank you,{" "}
              <span className="font-semibold text-teal-600">
                {state.userName}
              </span>
              ! Your service has been booked successfully.
            </p>
          </div>

         {/* Worker Info */}
<div className="bg-gray-50 rounded-xl p-5 shadow-sm">
  <h3 className="text-lg font-semibold text-gray-700 mb-3">
    <GhostIcon className="w-4 h-4 inline mr-2 text-teal-800" /> Worker Details
  </h3>
  <div className="flex flex-col gap-2 text-gray-600">
    <p>
      <User className="w-4 h-4 inline mr-2 text-teal-800" />{" "}
      {state.worker?.name}
    </p>
    <p>
      <MapPin className="w-4 h-4 inline mr-2 text-teal-800" />{" "}
      {state.worker?.location}
    </p>
  </div>
</div>


          {/* Service Details */}
          <div className="bg-teal-50 rounded-xl p-5 border border-teal-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
                <ToolCase className="w-6 h-6 inline mr-2 text-teal-600" /> Service Details
            </h3>
            <div className="flex items-center justify-between text-gray-700">
              <span>{state.issue}</span>
              <span className="flex items-center gap-1 font-semibold">
                <IndianRupee className="w-4 h-4 text-teal-600" /> {state.price}
              </span>
            </div>
            <hr className="my-3 border-teal-200" />
            <div className="flex items-center justify-between font-bold text-gray-800 text-lg">
              <span>Total Amount</span>
              <span className="flex items-center gap-1 text-teal-700">
                <IndianRupee className="w-5 h-5" /> {state.price}
              </span>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              👤 Your Details
            </h3>
            <div className="flex flex-col gap-2 text-gray-600">
              <p>
                <User className="w-4 h-4 inline mr-2 text-teal-600" />{" "}
                {state.userName}
              </p>
              <p>
                <Phone className="w-4 h-4 inline mr-2 text-teal-600" />{" "}
                {state.userPhone}
              </p>
              <p>
                <Home className="w-4 h-4 inline mr-2 text-teal-600" />{" "}
                {state.userAddress}
              </p>
              <p>
                <Clock className="w-4 h-4 inline mr-2 text-teal-600" />{" "}
                {state.timeSlot}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-5 mt-6">
            <Button
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl px-6 py-2 shadow-md hover:scale-105 transition-transform"
              onClick={() => navigate("/dashboard")}
            >
              Go to Home
            </Button>
            <Button
              variant="outline"
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl px-6 py-2 shadow-md hover:scale-105 transition-transform"
              onClick={() => navigate("/bookings")}
            >
              View My Bookings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmationPage;
