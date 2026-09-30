const multer = require("multer");

const SUPPORTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 20);
if (!Number.isFinite(maxFileSizeMb) || maxFileSizeMb <= 0) {
  throw new Error("MAX_FILE_SIZE_MB must be a positive number");
}

const MAX_FILE_SIZE_BYTES = Math.floor(maxFileSizeMb * 1024 * 1024);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    if (!SUPPORTED_MIME_TYPES.has(file.mimetype)) {
      const error = new Error("Unsupported file type");
      error.code = "UNSUPPORTED_FILE_TYPE";
      return callback(error);
    }

    return callback(null, true);
  },
});

module.exports = {
  upload,
  MAX_FILE_SIZE_BYTES,
  SUPPORTED_MIME_TYPES,
};
