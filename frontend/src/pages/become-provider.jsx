import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, UploadCloud, ArrowLeft, ArrowRight } from "lucide-react";

const SERVICES = [
  "Electronics",
  "Plumbing",
  "Painting",
  "Electrician",
  "Mechanic",
  "Cleaning",
  "Landscaping",
  "TechSupport",
  "Photography",
  "Carpenter",
  "Junk Removal",
  "Bodycare",
  "Catering",
  "Fitness Trainer",
  "MusicTeacher",
  "Tutoring",
  "Personal Shopper",
  "Business Consulting",
  "Healthcare",
  "Babysitting",
  "Pet Care",
  "AC Repair",
  "Event Planning",
  "Transport Service",
  "Industrial Services"
];

const LOCATIONS =[
  "Visakhapatnam",
  "Vijayawada",
  "Guntur",
  "Nellore",
  "Tirupati",
  "Kurnool",
  "Rajahmundry",
  "Kakinada",
  "Anantapur",
  "Kadapa",
  "Ongole",
  "Eluru",
  "Vizianagaram",
  "Machilipatnam",
  "Chittoor",
  "Hindupur",
  "Proddatur",
  "Tenali",
  "Adoni",
  "Nandyal"
];


export default function BecomeProvider() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
  name: "",
  service: "",
  experience: "", // fixed typo & added value
  location: "",
  phone: "",
  otp: "",
  documents: { photo: null, aadhaar: null, pancard: null },
  paymentSuccess: false,
});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFormData({ ...formData, documents: { ...formData.documents, [e.target.name]: e.target.files[0] } });

  // OTP Functions
  const sendOTP = async () => {
    if (!formData.phone) return alert("Enter phone number");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/otp/send-otp", { phone: formData.phone });
      alert("OTP sent!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };
  const verifyOTP = async () => {
    if (!formData.otp) return alert("Enter OTP");
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/otp/verify-otp", { phone: formData.phone, otp: formData.otp });
      alert("OTP verified!");
      setStep(5);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
    setLoading(false);
  };
const submitDocuments = async () => {
  const data = new FormData();

  // append required text fields
  data.append("name", formData.name);
  data.append("service", formData.service);
  data.append("experience", formData.experience);
  data.append("location", formData.location);
  data.append("phone", formData.phone);

  // append files correctly (multer expects these keys)
  if (formData.documents.photo) data.append("photo", formData.documents.photo);
  if (formData.documents.aadhaar) data.append("aadhaar", formData.documents.aadhaar);
  if (formData.documents.pancard) data.append("pancard", formData.documents.pancard);

  try {
    await axios.post("http://localhost:5000/api/providers", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setStep(6);
  } catch (err) {
    console.error("❌ Register error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to upload documents");
  }
};

  const handlePayment = () => {
    setFormData({ ...formData, paymentSuccess: true });
    setStep(7); 
  };

  const steps = [
    { id: 1, title: "Info" },
    { id: 2, title: "Service"},
     { id: 2, title: "experience"},
    { id: 3, title: "Location" },
    { id: 4, title: "Verify" },
    { id: 5, title: "Documents" },
    { id: 6, title: "Payment" },
    { id: 7, title: "Done" },
  ];

  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 to-blue-100 px-6">
      
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(step / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-center mt-2 text-sm font-medium text-gray-600">
          Step {step} of {steps.length}
        </p>
      </div>

      {/* Form Card */}
      <motion.div
        key={step}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl p-8"
      >
        {/* Step Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <div>
  <h2 className="text-2xl font-bold mb-4">Your Info</h2>

  {/* Full Name */}
  <input
    type="text"
    name="name"
    placeholder="Full Name"
    value={formData.name}
    onChange={handleChange}
    className="w-full px-4 py-3 mb-4 rounded-lg border focus:ring-2 focus:ring-blue-500"
  />


  <button
    onClick={() => setStep(2)}
    className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:opacity-90"
  >
    Continue →
  </button>
</div>

          )}

          {step === 2 && (
  <div>
    <h2 className="text-2xl font-bold mb-4">Select Service & Experience</h2>

    {/* Service Dropdown */}
    <select
      name="service"
      value={formData.service}
      onChange={handleChange}
      className="w-full px-4 py-3 mb-6 rounded-lg border focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Choose service...</option>
      {SERVICES.map((srv) => (
        <option key={srv} value={srv}>
          {srv}
        </option>
      ))}
    </select>

    {/* Experience Input */}
    <input
      type="text"
      name="experience"
      placeholder="Enter your experience (e.g., 3 years)"
      value={formData.experience}
      onChange={handleChange}
      className="w-full px-4 py-3 mb-6 rounded-lg border focus:ring-2 focus:ring-blue-500"
    />

    {/* Navigation Buttons */}
    <div className="flex justify-between">
      <button
        onClick={() => setStep(1)}
        className="px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-blue-600"
      >
        <ArrowLeft size={18} /> Back
      </button>
      <button
        onClick={() => setStep(3)}
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:opacity-90 flex items-center gap-2"
      >
        Next <ArrowRight size={18} />
      </button>
    </div>
  </div>
)}


          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Your Location</h2>
              <select name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 mb-6 rounded-lg border focus:ring-2 focus:ring-blue-500">
                <option value="">Select city...</option>
                {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
              </select>
              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-blue-600"><ArrowLeft size={18}/> Back</button>
                <button onClick={() => setStep(4)} className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:opacity-90 flex items-center gap-2">Next <ArrowRight size={18}/></button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Phone Verification</h2>
              <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 mb-3 rounded-lg border focus:ring-2 focus:ring-blue-500"/>
              <div className="flex gap-2 mb-4">
                <button onClick={sendOTP} disabled={loading} className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg">{loading ? "Sending..." : "Send OTP"}</button>
                <input type="text" name="otp" placeholder="Enter OTP" value={formData.otp} onChange={handleChange} className="flex-1 px-4 py-2 rounded-lg border"/>
                <button onClick={verifyOTP} disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded-lg">{loading ? "Verifying..." : "Verify"}</button>
              </div>
              <button onClick={() => setStep(3)} className="px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-blue-600"><ArrowLeft size={18}/> Back</button>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Upload Documents</h2>
              {["photo", "aadhaar", "pancard"].map((doc) => (
                <label key={doc} className="flex items-center justify-between border rounded-lg p-3 mb-3 cursor-pointer hover:border-blue-400 transition">
                  <span className="capitalize">{doc}</span>
                  <div className="flex items-center gap-2 text-blue-600">
                    <UploadCloud size={18}/> <span>{formData.documents[doc]?.name || "Choose file"}</span>
                  </div>
                  <input type="file" name={doc} onChange={handleFileChange} hidden/>
                </label>
              ))}
              <div className="flex justify-between">
                <button onClick={() => setStep(4)} className="px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-blue-600"><ArrowLeft size={18}/> Back</button>
                <button onClick={submitDocuments} className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:opacity-90">Next</button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6">Membership Payment</h2>
              <button onClick={handlePayment} className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:opacity-90">Pay & Continue</button>
              <div className="mt-3">
                <button onClick={() => setStep(5)} className="px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-blue-600 mx-auto"><ArrowLeft size={18}/> Back</button>
              </div>
            </div>
          )}

          {step === 7 && (
            <motion.div key="done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
              <CheckCircle2 size={80} className="mx-auto text-green-500 mb-4"/>
              <h2 className="text-2xl font-bold">Success!</h2>
              <p className="text-gray-600 mt-2">You are now a verified service provider 🎉</p>
              <button onClick={() => navigate("/dashboard")} className="mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:opacity-90">Go to Home</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
    
  );
}
