import User from "../models/user.js";
import cloudinary from "../utils/cloudinary.js";   // ✅ Your Cloudinary config file
import streamifier from "streamifier";             // ✅ To stream the buffer to Cloudinary

// --- Multer with memory storage ---
import multer from "multer";
const storage = multer.memoryStorage();            // ✅ Store files only in RAM
export const upload = multer({ storage });         // Export for your route

 const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Provided by your protect middleware
    const { name, email } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update text fields if provided
    if (name) user.name = name;
    if (email) user.email = email;

    // ✅ Upload new profile picture if a file is provided
    if (req.file) {
      // Helper to upload buffer to Cloudinary
      const uploadFromBuffer = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "avatars" },  // Optional folder name in Cloudinary
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const result = await uploadFromBuffer();
      user.profilePic = result.secure_url; // Save Cloudinary URL to DB
    }

    // Save and respond with updated user data
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic, // ✅ Cloudinary URL
      token: req.token, // if you're reusing token from protect middleware
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export default updateProfile;