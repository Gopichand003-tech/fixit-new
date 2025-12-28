// pages/UpdateProfile.jsx
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";

const UpdateProfile = () => {
  const { user, token, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(
    user?.profilePic || ""
  );
  const [loading, setLoading] = useState(false);

  /* ---------------- Preview Image ---------------- */
  useEffect(() => {
    if (profilePicFile) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result);
      reader.readAsDataURL(profilePicFile);
    } else {
      setProfilePicPreview(user?.profilePic || "");
    }
  }, [profilePicFile, user?.profilePic]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePicFile(file);
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      if (profilePicFile) data.append("profilePic", profilePicFile);

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/update-profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      updateUser(res.data);

      if (res.data.profilePic) {
        setProfilePicPreview(res.data.profilePic);
      }

      toast.success("Profile updated successfully ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const profilePicUrl = profilePicPreview
    ? profilePicPreview.startsWith("http") ||
      profilePicPreview.startsWith("data:")
      ? profilePicPreview
      : `${import.meta.env.VITE_API_URL}/${profilePicPreview}`
    : "https://via.placeholder.com/150";

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10 relative overflow-hidden bg-blue-200">
      <Toaster position="top-center" richColors />

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-400/30 rounded-full blur-3xl" />

      {/* Card */}
      <div
        className="
          relative z-10
          w-full max-w-sm sm:max-w-md
          bg-white/80 backdrop-blur-2xl
          rounded-3xl
          shadow-[0_30px_80px_rgba(0,0,0,0.15)]
          px-6 sm:px-8 py-8
          flex flex-col items-center
        "
      >
        {/* Avatar */}
        <div className="relative group mb-4">
          <div
            className="
              w-28 h-28 sm:w-32 sm:h-32
              rounded-full overflow-hidden
              ring-4 ring-purple-400
              shadow-xl
              cursor-pointer
              transition-transform
              group-hover:scale-105
            "
          >
            <img
              src={profilePicUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-5">
          Tap on avatar to change photo
        </p>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-700 mb-6">
          Edit Profile
        </h2>

        {/* Form */}
        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="
              w-full px-4 py-3
              rounded-xl
              bg-gray-100
              border border-gray-300
              focus:border-purple-500
              focus:ring-4 focus:ring-purple-300/40
              outline-none
              transition
            "
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="
              w-full px-4 py-3
              rounded-xl
              bg-gray-100
              border border-gray-300
              focus:border-purple-500
              focus:ring-4 focus:ring-purple-300/40
              outline-none
              transition
            "
          />

          <Button
            type="submit"
            disabled={loading}
            className="
              w-full py-3
              rounded-xl
              bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400

              text-white font-bold
              shadow-lg
              hover:shadow-xl hover:scale-[1.02]
              transition-all
            "
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </form>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="
            mt-6
            px-6 py-2
            rounded-full
            bg-white/70
            text-purple-700 font-medium
            shadow
            hover:shadow-lg hover:scale-105
            transition
          "
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default UpdateProfile;
