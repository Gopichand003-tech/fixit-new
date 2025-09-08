import dotenv from 'dotenv';
dotenv.config();

import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET is missing in environment variables');
}
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('⚠️ Email credentials missing: EMAIL_USER/EMAIL_PASS');
}

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ----------------------------- helpers ----------------------------- */
const signToken = (id, role = 'user') =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });

const absoluteUrl = (req, maybePath) => {
  if (!maybePath) return null;
  if (/^https?:\/\//i.test(maybePath)) return maybePath;
  const base = `${req.protocol}://${req.get('host')}`;
  return `${base}${maybePath.startsWith('/') ? '' : '/'}${maybePath}`;
};

const publicUser = (req, userDoc) => ({
  _id: userDoc._id,
  name: userDoc.name,
  email: userDoc.email,
  profilePic: absoluteUrl(req, userDoc.profilePic),
});

/* --------------------------- mail transporter --------------------------- */
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify().then(() => {
  console.log('✅ SMTP ready');
}).catch((err) => {
  console.error('❌ SMTP configuration error:', err.message);
});

/* ----------------------------- GOOGLE LOGIN ---------------------------- */
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
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ message: 'Google login failed' });
  }
};

/* ----------------------------- SIGN UP ---------------------------- */
export const userSignup = async (req, res) => {
  try {
    const { name, email, password, profilePic } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const normalizedEmail = email.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))
      return res.status(400).json({ message: 'Invalid email format' });

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(409).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      profilePic: profilePic || null,
    });

    const token = signToken(user._id);
    return res.status(201).json({ message: 'User registered successfully', token, user: publicUser(req, user) });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ----------------------------- SIGN IN ---------------------------- */
export const userSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.password) return res.status(400).json({ message: 'Use Google Sign-In for this account' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);
    return res.json({ message: 'Login successful', token, user: publicUser(req, user) });
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* --------------------------- PASSWORD RESET FLOW -------------------------- */
/* --------------------------- PASSWORD RESET FLOW -------------------------- */
export const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2 style="color: #333;">FIX-IT Password Reset</h2>
        <p>Hello ${user.name || 'User'},</p>
        <p>Use the OTP below to reset your password:</p>
        <h1 style="background: #f4f4f4; display: inline-block; padding: 10px 20px; border-radius: 5px; letter-spacing: 5px;">${otp}</h1>
        <p style="color: #777; font-size: 14px;">This OTP will expire in 10 minutes.</p>
        <hr style="margin-top: 40px;">
        <p style="font-size: 12px; color: #aaa;">© 2025 FIX-IT. All rights reserved.</p>
      </div>
    `;

    const mailOptions = {
      from: `FIX-IT Support <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Your FIX-IT Password Reset OTP',
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✉️ OTP mail sent successfully:', info.messageId);

    return res.json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('❌ resetPasswordRequest error:', err);
    if (err.response) {
      console.error('SMTP response:', err.response);
      console.error('SMTP code:', err.responseCode);
      console.error('SMTP command:', err.command);
      console.error('SMTP message:', err.message);
    }
    return res.status(500).json({
      message: 'Failed to send OTP',
      error: err.message,
      smtpResponse: err.response || null,
    });
  }
};

// Confirmation email
export const sendPasswordResetConfirmation = async (userEmail, userName) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2 style="color: #333;">FIX-IT Password Reset Successful</h2>
        <p>Hello ${userName || 'User'},</p>
        <p>Your password has been successfully reset. You can now log in using your new password.</p>
        <hr style="margin-top: 40px;">
        <p style="font-size: 12px; color: #aaa;">© 2025 FIX-IT. All rights reserved.</p>
      </div>
    `;

    const mailOptions = {
      from: `FIX-IT Support <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Your FIX-IT Password Has Been Reset',
      text: `Your password has been successfully reset.`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✉️ Password reset confirmation email sent:', info.messageId);
  } catch (err) {
    console.error('❌ Error sending password reset confirmation:', err);
    if (err.response) {
      console.error('SMTP response:', err.response);
      console.error('SMTP code:', err.responseCode);
      console.error('SMTP command:', err.command);
      console.error('SMTP message:', err.message);
    }
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.resetOtp || !user.resetOtpExpiry)
      return res.status(400).json({ message: 'No OTP request found' });

    if (user.resetOtp !== otp)
      return res.status(400).json({ message: 'Invalid OTP' });

    if (user.resetOtpExpiry < Date.now())
      return res.status(400).json({ message: 'OTP expired' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    // Send confirmation email
    sendPasswordResetConfirmation(user.email, user.name);

    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};



/* ------------------------------ Multer setup ----------------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/avatars';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({ storage });

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (req.file) updateData.profilePic = `/uploads/avatars/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    return res.json({
      message: 'Profile updated successfully',
      user: publicUser(req, updatedUser),
    });
  } catch (err) {
    console.error('updateProfile error:', err);
    return res.status(500).json({ message: 'Profile update failed' });
  }
};
