import multer from "multer";
import path from "path";

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save inside /uploads
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname) // unique filename
    );
  },
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ext) cb(null, true);
  else cb(new Error("Only images allowed"));
};

export const upload = multer({ storage, fileFilter });
