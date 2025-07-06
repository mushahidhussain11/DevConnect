// middlewares/multer.js
import multer from "multer";
import path from "path";

// Storage engine to save temporarily before Cloudinary upload
const storage = multer.diskStorage({
  destination: "uploads/", // local temp folder (you can .gitignore it)
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

