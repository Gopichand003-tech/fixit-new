import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVICES, LOCATION } from "../data/searchData";
import {
  CheckCircle2,
  UploadCloud,
  ArrowLeft,
  ArrowRight,
  Mail,
  User,
  Phone,
  Briefcase,
  CreditCard,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function BecomeProvider() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    service: "",
    experience: "",
    email: "",
    otp: "",
    documents: {
      photo: null,
      aadhaar: null,
      pancard: null,
    },
  });

  /* ---------------- Helpers ---------------- */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setFormData({
      ...formData,
      documents: { ...formData.documents, [e.target.name]: e.target.files[0] },
    });

  /* ---------------- EMAIL OTP ---------------- */
  const sendEmailOTP = async () => {
    if (!formData.email) return alert("Enter email");
    setLoading(true);
    try {
      await axios.post(`${API}/api/otp/send-otp`, {
        email: formData.email,
      });
      alert("OTP sent to your email");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  const verifyEmailOTP = async () => {
    if (!formData.otp) return alert("Enter OTP");
    setLoading(true);
    try {
      await axios.post(`${API}/api/otp/verify-otp`, {
        email: formData.email,
        otp: formData.otp,
      });
      setStep(4);
    } catch {
      alert("Invalid OTP");
    }
    setLoading(false);
  };

  /* ---------------- UPLOAD ---------------- */
  const submitDocuments = async () => {
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (k !== "documents") data.append(k, v);
    });
    Object.entries(formData.documents).forEach(
      ([k, v]) => v && data.append(k, v)
    );

    try {
      await axios.post(`${API}/api/providers`, data);
      setStep(5);
    } catch {
      alert("Upload failed");
    }
  };

  const totalSteps = 6;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
      <div className="w-full max-w-xl">

        {/* Progress */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"
              animate={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          <p className="text-center text-sm mt-2 text-gray-600">
            Step {step} of {totalSteps}
          </p>
        </div>

        {/* Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8"
        >
          <AnimatePresence mode="wait">

            {/* STEP 1 – PERSONAL DETAILS */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex gap-2">
                  <User /> Personal Details
                </h2>

                <input
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  className="w-full px-4 py-3 mb-3 border rounded-lg"
                />

                <input
                  name="phone"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  className="w-full px-4 py-3 mb-3 border rounded-lg"
                />

                <select
                  name="location"
                  onChange={handleChange}
                  className="w-full px-4 py-3 mb-4 border rounded-lg"
                >
                  <option value="">Select Location</option>
                  {LOCATION.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg"
                >
                  Continue
                </button>
              </div>
            )}

            {/* STEP 2 – SERVICE */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex gap-2">
                  <Briefcase /> Profession
                </h2>

                <select
                  name="service"
                  onChange={handleChange}
                  className="w-full px-4 py-3 mb-3 border rounded-lg"
                >
                  <option value="">Choose Service</option>
                  {SERVICES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>

                <input
                  name="experience"
                  placeholder="Experience (e.g. 3 years)"
                  onChange={handleChange}
                  className="w-full px-4 py-3 mb-4 border rounded-lg"
                />

                <div className="flex justify-between">
                  <button onClick={() => setStep(1)} className="flex gap-2">
                    <ArrowLeft /> Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 – EMAIL OTP */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex gap-2">
                  <Mail /> Email Verification
                </h2>

                <input
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  className="w-full px-4 py-3 mb-3 border rounded-lg"
                />

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={sendEmailOTP}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg"
                  >
                    Send OTP
                  </button>
                  <input
                    name="otp"
                    placeholder="OTP"
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border rounded-lg"
                  />
                  <button
                    onClick={verifyEmailOTP}
                    className="bg-green-500 text-white px-4 rounded-lg"
                  >
                    Verify
                  </button>
                </div>

                <button onClick={() => setStep(2)} className="flex gap-2">
                  <ArrowLeft /> Back
                </button>
              </div>
            )}

            {/* STEP 4 – DOCUMENTS */}
            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Upload Documents</h2>

                {["photo", "aadhaar", "pancard"].map((doc) => (
                  <label
                    key={doc}
                    className="flex justify-between items-center border rounded-lg p-3 mb-3 cursor-pointer"
                  >
                    <span className="capitalize">{doc}</span>
                    <UploadCloud />
                    <input
                      type="file"
                      name={doc}
                      hidden
                      onChange={handleFileChange}
                    />
                  </label>
                ))}

                <button
                  onClick={submitDocuments}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg"
                >
                  Continue
                </button>
              </div>
            )}

            {/* STEP 5 – PAYMENT */}
            {step === 5 && (
              <div className="text-center">
                <CreditCard size={48} className="mx-auto mb-4" />
                <button
                  onClick={() => setStep(6)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-lg"
                >
                  Pay Membership & Continue
                </button>
              </div>
            )}

            {/* STEP 6 – DONE */}
            {step === 6 && (
              <div className="text-center">
                <CheckCircle2 size={80} className="mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-bold">Registration Complete 🎉</h2>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg"
                >
                  Go to Home
                </button>
              </div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
