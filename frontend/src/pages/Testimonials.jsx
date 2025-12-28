import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft,MessageCircleHeartIcon, } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TestimonialsCRUD = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ profession: "", feedback: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/testimonials`);
      setTestimonials(res.data);
    } catch (err) {
      console.error("Error fetching testimonials", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `${API_BASE}/api/testimonials/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(`${API_BASE}/api/testimonials`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({ profession: "", feedback: "" });
      setEditingId(null);
      fetchTestimonials();
    } catch (err) {
      console.error("Error submitting", err);
    }
  };

  const handleEdit = (t) => {
    setForm({ profession: t.profession, feedback: t.feedback });
    setEditingId(t._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTestimonials();
    } catch (err) {
      console.error("Error deleting", err);
    }
  };

  // ✅ Fix: normalize profile pic path
  const getProfilePic = (pic) => {
    if (!pic) return "/default-avatar.png";
    if (pic.startsWith("http")) return pic;
    return `${API_BASE}${pic.startsWith("/") ? "" : "/"}${pic}`;
  };

  // Fallback initials
  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: "url('/review.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-800 hover:text-gray-600 mb-6 font-medium translate-y-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

      <h2 className="flex items-center justify-center gap-3 text-4xl font-bold text-gray-900 mb-10">
  <MessageCircleHeartIcon className="w-9 h-9 text-gray-900" />
  Providers Feedback
</h2>

        {/* Add / Edit Form */}
        {user ? (
         <form
  onSubmit={handleSubmit}
  className="
    bg-white/80 backdrop-blur-xl
    ring-1 ring-black/5
    shadow-xl
    rounded-3xl
    p-6 sm:p-8
    mb-14
    space-y-5
    max-w-2xl mx-auto
  "
>
  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center">
    Share your experience
  </h3>

  <input
    type="text"
    placeholder="Your profession (optional)"
    value={form.profession}
    onChange={(e) =>
      setForm({ ...form, profession: e.target.value })
    }
    className="
      w-full
      rounded-xl
      border border-gray-300
      px-4 py-3
      focus:ring-2 focus:ring-indigo-500
      focus:outline-none
      text-sm sm:text-base
    "
  />

  <textarea
    placeholder="Write your feedback..."
    value={form.feedback}
    onChange={(e) =>
      setForm({ ...form, feedback: e.target.value })
    }
    rows="4"
    required
    className="
      w-full
      rounded-xl
      border border-gray-300
      px-4 py-3
      focus:ring-2 focus:ring-indigo-500
      focus:outline-none
      resize-none
      text-sm sm:text-base
    "
  />

  <button
    type="submit"
    className="
      w-full
      rounded-xl
      bg-gradient-to-r from-indigo-600 to-blue-600
      hover:from-indigo-700 hover:to-blue-700
      text-white
      py-3
      font-medium
      transition-all
      shadow-md
    "
  >
    {editingId ? "Update Feedback" : "Submit Feedback"}
  </button>
</form>

        ) : (
          <p className="text-center text-gray-700 mb-8">
            Please log in to leave feedback.
          </p>
        )}

        {/* Testimonials Grid */}
     {/* Testimonials Grid */}
{loading ? (
  // 🔹 Shimmer loader
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="bg-white/80 rounded-3xl p-6 shadow-lg ring-1 ring-black/5"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-300"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
        <div className="mt-4 h-3 bg-gray-200 rounded w-full"></div>
        <div className="mt-2 h-3 bg-gray-200 rounded w-4/5"></div>
      </div>
    ))}
  </div>
) : (
  // 🔹 Actual testimonials
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {testimonials.map((t) => (
      <div
        key={t._id}
        className="
          bg-white/85 backdrop-blur-lg
          ring-1 ring-black/5
          rounded-3xl
          shadow-lg
          p-6
          transition-all duration-300
          hover:shadow-2xl hover:-translate-y-1
        "
      >
        {/* Profile */}
        <div className="flex items-center gap-4">
          {t.user?.profilePic ? (
            <img
              src={getProfilePic(t.user.profilePic)}
              alt={t.user?.name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-indigo-500/40"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center font-bold">
              {getInitials(t.user?.name)}
            </div>
          )}

          <div>
            <h4 className="font-semibold text-gray-900">
              {t.user?.name || "Anonymous"}
            </h4>
            <p className="text-sm italic text-gray-500">
              {t.profession || "Customer"}
            </p>
          </div>
        </div>

        {/* Feedback */}
        <p className="mt-4 text-gray-700 text-sm sm:text-base leading-relaxed">
          “{t.feedback}”
        </p>

        {/* Footer */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-gray-400">Verified User</span>

          {user && t.user?._id === user._id && (
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(t)}
                className="px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-xs font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t._id)}
                className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 text-xs font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  );
};

export default TestimonialsCRUD;
