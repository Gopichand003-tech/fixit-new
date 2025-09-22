import express from "express";
import {
  userSignup,
  userSignin,
  resetPassword,
  resetPasswordRequest,
  googleLogin,
  updateProfile,
  uploadAvatar,
  uploadToCloudinary
} from "../controllers/Authcontroller.js";

import protect from "../Middleware/protect.js";

const router = express.Router();

// User authentication
router.post('/signup', userSignup);
router.post('/login', userSignin);

// Password reset
router.post('/forgot-password', resetPasswordRequest);
router.post('/new-password', resetPassword);

// Google login
router.post('/google', googleLogin);

router.put(
  '/update-profile',
  uploadAvatar.single('profilePic'),
  uploadToCloudinary('fixit/avatars'),
  updateProfile
);


export default router;
