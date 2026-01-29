import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// ✅ ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= STORAGE =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/temp"));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

// ================= FILE FILTER =================
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Only image files are allowed"
      ),
      false
    );
  }
};

// ================= EXPORT =================
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
