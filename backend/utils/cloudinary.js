import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

/* ---------------- Cloudinary Config ---------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// /* -------------- Avatar/Profile Uploads -------------- */
// export const uploadAvatar = multer({
//   storage: new CloudinaryStorage({
//     cloudinary,
//     params: {
//       folder: "fixit/avatars",
//       allowed_formats: ["jpg", "jpeg", "png", "webp"],
//       transformation: [{ width: 400, height: 400, crop: "limit" }],
//     },
//   }),
// });

/* -------------- Provider Documents ------------------ */
export const uploadProviderFiles = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "fixit/providers",
      allowed_formats: ["jpg", "jpeg", "png", "pdf"],
      transformation: [{ width: 800, height: 800, crop: "limit" }],
    },
  }),
});

/* -------------- Export Cloudinary Instance ---------- */
export default cloudinary;
