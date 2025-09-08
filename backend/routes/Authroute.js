// routes/Authroute.js
import express from "express";
import { 
  userSignup, 
  userSignin, 
  resetPassword, 
  resetPasswordRequest, 
  googleLogin,
  updateProfile,
  upload  // make sure you export this from Authcontroller.js
} from "../controllers/Authcontroller.js";

// ✅ import protect middleware
import { protect } from "../middleware/protect.js";  

const router = express.Router();

// User authentication
router.post('/signup', userSignup);
router.post('/login', userSignin);

// Password reset
router.post('/forgot-password', resetPasswordRequest);
router.post('/new-password', resetPassword);

// Google login
router.post('/google', googleLogin);

// Update profile (protected route)
router.put('/update-profile', protect, upload.single('profilePic'), updateProfile);

export default router;
