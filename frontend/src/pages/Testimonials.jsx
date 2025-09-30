import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
          className="flex items-center gap-2 text-gray-800 hover:text-gray-600 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">
          💬 Customer Feedback
        </h2>

        {/* Add / Edit Form */}
        {user ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white/70 shadow-xl rounded-2xl p-6 mb-12 space-y-4 border"
          >
            <input
              type="text"
              placeholder="Profession"
              value={form.profession}
              onChange={(e) => setForm({ ...form, profession: e.target.value })}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
            <textarea
              placeholder="Your Feedback"
              value={form.feedback}
              onChange={(e) => setForm({ ...form, feedback: e.target.value })}
              required
              rows="3"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
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
        {loading ? (
          // 🔹 Shimmer loader while fetching
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/70 rounded-2xl shadow-lg border p-6 h-40"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-300"></div>
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="mt-4 h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="bg-white/90 rounded-2xl shadow-lg border p-6 hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                {/* Profile */}
                <div className="flex items-center gap-4">
                  {t.user?.profilePic ? (
                    <img
                      src={getProfilePic(t.user.profilePic)}
                      alt={t.user?.name || "User"}
                      className="w-14 h-14 rounded-full object-cover border-2 border-indigo-400 shadow"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/default-avatar.png"; // fallback image
                      }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                      {getInitials(t.user?.name)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {t.user?.name || "Anonymous"}
                    </h3>
                    <p className="text-sm italic text-gray-600">
                      {t.profession || "Not specified"}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-gray-700 leading-relaxed">
                  “{t.feedback || "No feedback provided."}”
                </p>

                <p className="text-xs text-gray-500 mt-3">
                  By: {t.user?.name || "Anonymous"}
                </p>

                {/* Owner Actions */}
                {user && t.user && t.user._id === user._id && (
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleEdit(t)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-1 rounded-lg transition shadow-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-1 rounded-lg transition shadow-md"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsCRUD;
