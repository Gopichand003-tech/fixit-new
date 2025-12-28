import React, { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVICES, LOCATION } from "../data/searchData";
import { Toaster, toast } from "react-hot-toast";

import {
  CheckCircle2,
  UploadCloud,
  ArrowLeft,
  Briefcase,
  User,
  CreditCard,
  Mail,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function BecomeProvider() {
  const navigate = useNavigate();
  const totalSteps = 6;

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [uploading, setUploading] = useState(false);
const [plan, setPlan] = useState("1");
const [paymentMode, setPaymentMode] = useState("upi");
const [processing, setProcessing] = useState(false);


  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    service: "",
    experience: "",
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

  const normalizePhone = (phone) => {
    let clean = phone.replace(/\D/g, "");
    if (clean.startsWith("0")) clean = clean.slice(1);
    if (clean.length === 10) clean = "91" + clean;
    return clean;
  };

  /* ---------------- OTP ---------------- */
  const sendOtp = async () => {
    try {
      setVerifying(true);
      const res = await axios.post(`${API}/api/email/send-otp`, { email });
      setServerOtp(res.data.otp); // demo only
      setOtpSent(true);
      toast.success("OTP sent to your email");

    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setVerifying(false);
    }
  };

  const verifyOtp = () => {
    if (otp === String(serverOtp)) {
      setStep(4);
    } else {
      toast.error("Invalid OTP");
    }
  };

  // documents submission
  const submitDocuments = async () => {
  const data = new FormData();
  data.append("name", formData.name);
  data.append("phone", normalizePhone(formData.phone));
  data.append("location", formData.location);
  data.append("service", formData.service);
  data.append("experience", formData.experience);

  Object.entries(formData.documents).forEach(
    ([key, file]) => file && data.append(key, file)
  );

  try {
    setUploading(true);
    await axios.post(`${API}/api/providers`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Documents uploaded successfully");
    setStep(5);
  } catch (err) {
    if (err.response?.status === 409) {
      toast.error(err.response.data.message);
    } else {
      toast.error("Document upload failed. Try again.");
    }
  } finally {
    setUploading(false);
  }
};

// weclcome mail twilio usage explaination
const sendWelcomeEmail = async () => {
  try {
    await axios.post(`${API}/api/email/send-provider-welcome`, {
      email,
      name: formData.name,
    });
    toast.success("Welcome email sent 📧");
  } catch (err) {
    console.error("Welcome email failed");
  }
};

useEffect(() => {
  if (step === 6) {
    sendWelcomeEmail();
  }
}, [step]);


// loading
  const Shimmer = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/2" />
    <div className="h-12 bg-gray-200 rounded" />
    <div className="h-12 bg-gray-200 rounded" />
    <div className="h-12 bg-gray-200 rounded" />
  </div>
);


  const inputStyle = `
    w-full px-4 py-4 rounded-2xl bg-white
    border border-gray-200 text-[15px]
    placeholder-gray-400
    focus:outline-none focus:ring-4 focus:ring-indigo-500/30
    transition
  `;

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
    from-indigo-200 via-sky-200 to-blue-300 px-4 py-8">

      <Toaster position="top-right" />


      <div className="w-full max-w-xl">

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
            <span>Personal</span>
            <span>Profession</span>
            <span>Email</span>
            <span>Docs</span>
            <span>Pay</span>
            <span>Done</span>
          </div>

          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-600 to-blue-600"
              animate={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>

          <p className="text-center text-xs mt-3 text-gray-600">
            Step {step} of {totalSteps}
          </p>
        </div>

        {/* Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-2xl rounded-[28px]
          shadow-[0_40px_80px_rgba(0,0,0,0.18)] p-6 sm:p-10"
        >
          <AnimatePresence mode="wait">

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold mb-5 flex gap-2">
                  <User className="text-indigo-600" /> Personal Details
                </h2>

                <input name="name" placeholder="Full Name"
                  onChange={handleChange} className={inputStyle} />

                <input name="phone" maxLength={10}
                  placeholder="Phone Number"
                  onChange={handleChange}
                  className={`${inputStyle} mt-3`} />

                <select name="location"
                  onChange={handleChange}
                  className={`${inputStyle} mt-3`}>
                  <option value="">Select Location</option>
                  {LOCATION.map(l => <option key={l}>{l}</option>)}
                </select>

                <button
                  onClick={() => setStep(2)}
                  className="w-full mt-6 py-4 rounded-2xl font-semibold text-white
                  bg-gradient-to-r from-indigo-600 to-blue-600 shadow-xl">
                  Continue
                </button>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold mb-5 flex gap-2">
                  <Briefcase className="text-indigo-600" /> Profession Details
                </h2>

                <select name="service"
                  onChange={handleChange}
                  className={inputStyle}>
                  <option value="">Choose Service</option>
                  {SERVICES.map(s => <option key={s}>{s}</option>)}
                </select>

                <input name="experience"
                  placeholder="Experience (eg: 3 years)"
                  onChange={handleChange}
                  className={`${inputStyle} mt-3`} />

                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-gray-600">
                    <ArrowLeft size={18} /> Back
                  </button>
                  <button onClick={() => setStep(3)}
                    className="px-6 py-3 rounded-xl bg-indigo-600 text-white">
                    Next
                  </button>
                </div>
              </>
            )}

           {/* STEP 3 */}
{step === 3 && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="space-y-5"
  >
    <div className="text-center space-y-2">
      <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-indigo-100">
        <Mail className="text-indigo-600" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold">
        Verify your Email
      </h2>
      <p className="text-sm text-gray-500">
        We’ll send a 6-digit OTP to confirm your email
      </p>
    </div>

    {!otpSent ? (
      <>
        {/* Email Input */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Email address
          </label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputStyle} mt-2`}
          />
        </div>

        <button
          onClick={sendOtp}
          disabled={verifying || !email}
          className="w-full mt-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3.5 rounded-xl shadow-lg disabled:opacity-60"
        >
          {verifying ? "Sending OTP..." : "Send OTP"}
        </button>
      </>
    ) : (
      <>
        {/* OTP Input */}
        <div>
          <label className="text-sm font-medium text-gray-600">
            Enter OTP
          </label>
          <input
            type="text"
            maxLength={6}
            inputMode="numeric"
            placeholder="● ● ● ● ● ●"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className={`${inputStyle} mt-2 text-center tracking-[0.5em] text-lg font-semibold`}
          />
        </div>

        <button
          onClick={verifyOtp}
          disabled={otp.length !== 6}
          className="w-full mt-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3.5 rounded-xl shadow-lg disabled:opacity-60"
        >
          Verify OTP
        </button>

        {/* Resend */}
        <p
          onClick={sendOtp}
          className="text-center text-sm text-indigo-600 mt-3 cursor-pointer hover:underline"
        >
          Didn’t receive OTP? Resend
        </p>
      </>

    )}
    

    <button
      onClick={() => setStep(2)}
      className="flex items-center gap-1 text-gray-500 text-sm mx-auto mt-2"
    >
      <ArrowLeft size={16} /> Back
    </button>
  </motion.div>
)}

          {/* STEP 4 */}
{step === 4 && (
  uploading ? (
    <Shimmer />
  ) : (
    <>
      <h2 className="text-xl font-bold mb-4">Upload Documents</h2>

      {["photo", "aadhaar", "pancard"].map(doc => (
        <label
          key={doc}
          className="flex justify-between items-center
          px-5 py-4 mb-4 rounded-2xl border border-dashed
          border-indigo-300 bg-indigo-50 cursor-pointer"
        >
          <span className="capitalize font-medium">{doc}</span>
          <UploadCloud />
          <input
            hidden
            type="file"
            name={doc}
            onChange={handleFileChange}
          />
        </label>
      ))}

      <button
        onClick={submitDocuments}
        className="w-full py-4 rounded-2xl bg-indigo-600 text-white"
      >
        Continue
      </button>
    </>
  )
)}

            {/* STEP 5 */}
{step === 5 && (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-center">
      Choose Membership Plan
    </h2>

    {/* Plans */}
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: "1 Month", price: "₹199", value: "1" },
        { label: "3 Months", price: "₹499", value: "3" },
        { label: "6 Months", price: "₹899", value: "6" },
      ].map(p => (
        <div
          key={p.value}
          onClick={() => setPlan(p.value)}
          className={`cursor-pointer rounded-2xl p-4 border text-center
          ${plan === p.value
            ? "border-indigo-600 bg-indigo-50"
            : "border-gray-200"}`}
        >
          <p className="font-semibold">{p.label}</p>
          <p className="text-sm text-gray-500">{p.price}</p>
        </div>
      ))}
    </div>

    {/* Payment Methods */}
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-600">
        Payment Method
      </p>

      {["upi", "card", "netbanking"].map(m => (
        <label
          key={m}
          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer
          ${paymentMode === m
            ? "border-emerald-500 bg-emerald-50"
            : "border-gray-200"}`}
        >
          <input
            type="radio"
            checked={paymentMode === m}
            onChange={() => setPaymentMode(m)}
          />
          <span className="capitalize">{m}</span>
        </label>
      ))}
    </div>

    {/* Pay Button */}
    <button
      onClick={() => {
        setProcessing(true);
        toast.loading("Processing payment...");
        setTimeout(() => {
          toast.dismiss();
          toast.success("Payment successful");
          setProcessing(false);
          setStep(6);
        }, 3000);
      }}
      className="w-full py-4 rounded-2xl bg-gradient-to-r
      from-emerald-500 to-green-600 text-white font-semibold"
    >
      Pay Now
    </button>

    {/* Payment animation */}
    {processing && (
      <div className="flex justify-center mt-4">
        <video
          autoPlay
          loop
          muted
          className="w-32"
          src="/cashflow2.mp4"
        />
      </div>
    )}
  </div>
)}


          {/* STEP 6 */}
{step === 6 && (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center space-y-6"
  >
    {/* Success Icon */}
    <div className="w-24 h-24 mx-auto flex items-center justify-center
      rounded-full bg-emerald-100 shadow-inner">
      <CheckCircle2
        size={64}
        className="text-emerald-600 animate-pulse"
      />
    </div>

    {/* Title */}
    <h2 className="text-3xl font-extrabold text-gray-800">
      Registration Successful 🎉
    </h2>

    {/* Subtitle */}
    <p className="text-gray-600 text-sm max-w-sm mx-auto">
      Your provider profile has been created and is currently under verification.
    </p>

    {/* Email Info Box */}
    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4
      text-sm text-indigo-700 max-w-md mx-auto">
      📧 <strong>Check your email!</strong><br />
      We’ve sent you important instructions to manage your
      <span className="font-semibold"> online / offline status</span>
      and start receiving booking requests.
    </div>

    {/* CTA Button */}
    <button
      onClick={() => navigate("/dashboard")}
      className="mt-4 w-full sm:w-auto px-8 py-3 rounded-xl
      bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold
      shadow-lg hover:scale-[1.03] active:scale-[0.97] transition"
    >
      Go to Dashboard
    </button>

    {/* Footer Hint */}
    <p className="text-xs text-gray-500 mt-2">
      Didn’t receive the email? Check your spam folder or contact support.
    </p>
  </motion.div>
)}


          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
