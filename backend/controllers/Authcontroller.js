import dotenv from 'dotenv';
dotenv.config();

import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

/* ------------------------- Environment Checks ------------------------- */
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing in .env');
}

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.warn('⚠️ Cloudinary credentials missing');
}

/* -------------------------- Cloudinary Config -------------------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ------------------------------ Helpers ------------------------------ */
const signToken = (id, role = 'user') =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

const absoluteUrl = (req, maybePath) => {
  if (!maybePath) return null;

  if (/^https?:\/\//i.test(maybePath)) {
    return maybePath;
  }

  const base = `${req.protocol}://${req.get('host')}`;

  return `${base}${maybePath.startsWith('/') ? '' : '/'}${maybePath}`;
};

const publicUser = (req, userDoc) => ({
  _id: userDoc._id,
  name: userDoc.name,
  email: userDoc.email,
  profilePic: absoluteUrl(req, userDoc.profilePic),
});

/* ---------------------------- Google Login ---------------------------- */
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: 'Google token missing',
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      email,
      name,
      sub: googleId,
      picture,
    } = payload;

    if (!email) {
      return res.status(400).json({
        message: 'Google account email missing',
      });
    }

    let user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId,
        profilePic: picture || null,
      });
    } else {
      let updated = false;

      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }

      if (!user.profilePic && picture) {
        user.profilePic = picture;
        updated = true;
      }

      if (updated) {
        await user.save();
      }
    }

    const jwtToken = signToken(user._id);

    return res.status(200).json({
      message: 'Google login successful',
      token: jwtToken,
      user: publicUser(req, user),
    });
  } catch (err) {
    console.error('Google login error:', err);

    return res.status(401).json({
      message: 'Invalid Google token',
    });
  }
};

/* ------------------------------- Sign Up ------------------------------- */
export const userSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      profilePic,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const normalizedEmail = email.toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: 'Invalid email format',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      profilePic: profilePic || null,
    });

    const token = signToken(user._id);

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: publicUser(req, user),
    });
  } catch (err) {
    console.error('Signup error:', err);

    return res.status(500).json({
      message: 'Server error',
    });
  }
};

/* ------------------------------- Sign In ------------------------------- */
export const userSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select('+password');

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: 'Use Google Sign-In for this account',
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const token = signToken(user._id);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: publicUser(req, user),
    });
  } catch (err) {
    console.error('Signin error:', err);

    return res.status(500).json({
      message: 'Server error',
    });
  }
};

/* ---------------------------- Update Profile --------------------------- */
export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { name, email } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (name) {
      user.name = name;
    }

    if (email) {
      const normalizedEmail = email.toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'Email already in use',
        });
      }

      user.email = normalizedEmail;
    }

    // Cloudinary URL from middleware
    if (req.file?.path) {
      user.profilePic = req.file.path;
    }

    await user.save();

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error('updateProfile error:', err.stack);

    return res.status(500).json({
      message: 'Server error',
    });
  }
};

/* ------------------------- Multer + Cloudinary ------------------------- */
const storage = multer.memoryStorage();

export const uploadAvatar = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed'));
    }

    cb(null, true);
  },
});

export const uploadToCloudinary =
  (folder) => async (req, res, next) => {
    if (!req.file) {
      return next();
    }

    try {
      const result = await new Promise(
        (resolve, reject) => {
          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder,

                transformation: [
                  {
                    width: 400,
                    height: 400,
                    crop: 'fill',
                    gravity: 'face',
                  },
                  {
                    quality: 'auto',
                  },
                ],
              },
              (error, result) =>
                error
                  ? reject(error)
                  : resolve(result)
            );

          streamifier
            .createReadStream(req.file.buffer)
            .pipe(stream);
        }
      );

      req.file.path = result.secure_url;

      next();
    } catch (err) {
      console.error(
        'Cloudinary upload error:',
        err
      );

      return res.status(500).json({
        message: 'File upload failed',
      });
    }
  };
