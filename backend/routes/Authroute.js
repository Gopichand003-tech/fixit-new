import express from 'express';
import { 
  userSignup, 
  userSignin, 
  googleLogin, 
  resetPasswordRequest, 
  resetPassword, 
  updateProfile, 
  uploadAvatar, 
  uploadToCloudinary 
} from '../controllers/Authcontroller.js';
import protect from '../Middleware/authMiddleware.js'; // your auth middleware

const router = express.Router();

/* ---------------------------- Public Routes --------------------------- */
router.post('/signup', userSignup);
router.post('/signin', userSignin);
router.post('/google-login', googleLogin);
router.post('/reset-password-request', resetPasswordRequest);
router.post('/reset-password', resetPassword);

/* ---------------------------- Protected Routes ------------------------ */
// Update profile: protected, supports avatar upload
router.put(
  '/update-profile',
  protect,
  uploadAvatar.single('profilePic'),       // multer middleware
  uploadToCloudinary('fixit/avatars'),    // Cloudinary middleware
  updateProfile
);

export default router;
