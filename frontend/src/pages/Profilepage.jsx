import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ProfilePicUpload = () => {
  const { user, token, setUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Choose a file first!");

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/upload-profile",
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      // Update user context with new pic
      setUser({ ...user, profilePic: res.data.profilePic });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow-md">
      <h2 className="font-semibold mb-2">Update Profile Picture</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Upload
      </button>
    </div>
  );
};

export default ProfilePicUpload;
