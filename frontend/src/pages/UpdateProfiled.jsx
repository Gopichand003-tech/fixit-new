// pages/UpdateProfile.jsx
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react"; // optional camera icon

const UpdateProfile = () => {
  const { user, token, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(user?.profilePic || "");
  const [loading, setLoading] = useState(false);

  // Preview new image if file changes
  useEffect(() => {
    if (profilePicFile) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result);
      reader.readAsDataURL(profilePicFile);
    } else {
      setProfilePicPreview(user?.profilePic || "");
    }
  }, [profilePicFile, user?.profilePic]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePicFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      if (profilePicFile) data.append("profilePic", profilePicFile); // ✅ match backend

      const res = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      updateUser(res.data); // update AuthContext immediately

      // ✅ update preview if new image path comes from backend
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
    ? profilePicPreview.startsWith("http") || profilePicPreview.startsWith("data:")
      ? profilePicPreview
      : `http://localhost:5000/${profilePicPreview}`
    : "https://via.placeholder.com/150";

  return (
   <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
  <Toaster position="top-center" richColors />

  {/* Background image with gradient overlay */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage:
        "url('/undraw_develop-app_yg6p.png')", // better cartoon illustration for profile
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/60 dark:from-gray-900/70 dark:via-gray-900/50 dark:to-gray-900/70"></div>
  </div>

  {/* Profile Card */}
  <div className="relative z-10 w-full max-w-md bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-200 dark:from-gray-800 dark:to-gray-900
 backdrop-blur-xl rounded-3xl shadow-2xl p-8 flex flex-col items-center">
    {/* Profile Picture */}
    <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg mb-4 cursor-pointer hover:scale-105 transition-transform">
      <img
        src={profilePicUrl}
        alt="Profile Preview"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition">
        <Camera className="w-6 h-6 text-white" />
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleProfilePicChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
    <span className="text-sm text-gray-700 dark:text-gray-400 mb-4">
      Click avatar to change
    </span>

    <h2 className="text-3xl font-extrabold text-purple-700 dark:text-purple-400 mb-6">
      Update Profile
    </h2>

    <form className="w-full space-y-5" onSubmit={handleSubmit}>
      {["name", "email"].map((field) => (
        <div key={field} className="relative">
          <input
            type={field === "email" ? "email" : "text"}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            placeholder={field === "name" ? "Full Name" : "Email"}
            required
            className="peer w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 focus:border-purple-500 outline-none text-gray-900 dark:text-white transition-all duration-200"
          />
        </div>
      ))}

      <Button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-bold rounded-xl hover:scale-105 transform transition-transform shadow-lg hover:shadow-2xl"
      >
        {loading ? "Updating..." : "Update Profile"}
      </Button>
    </form>

    {/* Back Button */}
    <button
      onClick={() => navigate(-1)}
      className="mt-6 px-6 py-2 bg-whitw/40 dark:bg-gray-800/60 text-purple-700 dark:text-purple-300 rounded-full shadow-md hover:shadow-xl backdrop-blur-sm transition transform hover:scale-105"
    >
      ← Back
    </button>
  </div>
</div>

  );
};

export default UpdateProfile;
