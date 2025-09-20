import dotenv from 'dotenv';
dotenv.config();

import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


/* ----------------------------- ENV Checks ----------------------------- */
if (!process.env.JWT_SECRET) console.warn('⚠️ JWT_SECRET missing');
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS)
  console.warn('⚠️ EMAIL_USER or EMAIL_PASS missing');
if (!process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET)
  console.warn('⚠️ Cloudinary credentials missing');

/* -------------------------- Cloudinary Config -------------------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ------------------------------ Helpers ------------------------------ */
const signToken = (id, role = 'user') =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

const absoluteUrl = (req, maybePath) => {
  if (!maybePath) return null;
  if (/^https?:\/\//i.test(maybePath)) return maybePath; // already full URL
  const base = `${req.protocol}://${req.get('host')}`;
  return `${base}${maybePath.startsWith('/') ? '' : '/'}${maybePath}`;
};

const publicUser = (req, userDoc) => ({
  _id: userDoc._id,
  name: userDoc.name,
  email: userDoc.email,
  profilePic: absoluteUrl(req, userDoc.profilePic),
});

/* --------------------------- Mail Transport --------------------------- */
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});
transporter.verify()
  .then(() => console.log('✅ SMTP ready'))
  .catch(err => console.error('❌ SMTP error:', err.message));

/* ---------------------------- Google Login ---------------------------- */
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Google token missing' });
    if (!process.env.GOOGLE_CLIENT_ID)
      return res.status(500).json({ message: 'Missing GOOGLE_CLIENT_ID' });

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId,
        password: undefined,
        profilePic: picture || null,
      });
    } else {
      let updated = false;
      if (!user.googleId) { user.googleId = googleId; updated = true; }
      if (!user.profilePic && picture) { user.profilePic = picture; updated = true; }
      if (updated) await user.save();
    }

    const jwtToken = signToken(user._id);
    return res.json({ message: 'Google login successful', token: jwtToken, user: publicUser(req, user) });
  } catch (err) {
    console.error('Google login error:', err);
    return res.status(500).json({ message: 'Google login failed' });
  }
};

/* ------------------------------- Sign Up ------------------------------- */
export const userSignup = async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const normalizedEmail = email.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))
      return res.status(400).json({ message: 'Invalid email format' });

    if (await User.findOne({ email: normalizedEmail }))
      return res.status(409).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      profilePic: profilePic || null, // optional direct URL
    });

    const token = signToken(user._id);
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: publicUser(req, user),
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ------------------------------- Sign In ------------------------------- */
export const userSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.password)
      return res.status(400).json({ message: 'Use Google Sign-In for this account' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);
    return res.status(200).json({ message: 'Login successful', token, user: publicUser(req, user) });
  } catch (err) {
    console.error('Signin error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* --------------------------- Password Reset --------------------------- */
export const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: `FIX-IT Support <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your FIX-IT Password Reset OTP',
      html: `<h2>OTP: ${otp}</h2><p>Expires in 10 minutes.</p>`,
    });
    return res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('resetPasswordRequest error:', err);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.resetOtp !== otp || user.resetOtpExpiry < Date.now())
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();
    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ------------------------- Cloudinary Uploads ------------------------- */
// Avatar Upload (Profile Pics)
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'fixit/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 400, height: 400, crop: 'limit' }],
  },
});
export const uploadAvatar = multer({ storage: avatarStorage });

// // Provider Uploads (Photos & Documents)
// const providerStorage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'fixit/providers',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
//     transformation: [{ width: 800, height: 800, crop: 'limit' }],
//   },
// });
// export const uploadProviderFiles = multer({ storage: providerStorage });

/* ---------------------------- Update Profile --------------------------- */
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (req.file && req.file.path) updateData.profilePic = req.file.path; // ✅ secure_url from Cloudinary

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    return res.json({ message: 'Profile updated successfully', user: publicUser(req, updatedUser) });
  } catch (err) {
    console.error('updateProfile error:', err);
    return res.status(500).json({ message: 'Profile update failed' });
  }
};
