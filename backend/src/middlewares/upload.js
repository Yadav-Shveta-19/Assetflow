import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/", "application/pdf", "text/csv", "application/vnd.openxmlformats-officedocument"];
    if (allowed.some((type) => file.mimetype.startsWith(type) || file.mimetype === type)) return cb(null, true);
    cb(new Error("Unsupported file type"));
  }
});
