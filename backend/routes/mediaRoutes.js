const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");
const {
  getMedia,
  uploadMedia,
  toggleFavorite,
  deleteMedia,
} = require("../controllers/mediaController");

const router = express.Router();

router.use(authMiddleware);
router.get("/", getMedia);
router.post("/upload", upload.single("file"), uploadMedia);
router.patch("/:id/favorite", toggleFavorite);
router.delete("/:id", deleteMedia);

router.use((error, req, res, next) => {
  if (error.code === "UNSUPPORTED_FILE_TYPE") {
    return res.status(400).json({
      success: false,
      message: "Unsupported file type",
    });
  }

  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File size exceeds the allowed limit",
    });
  }

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: "Only one file may be uploaded in the file field",
    });
  }

  if (error instanceof Error) {
    console.error("Media request failed:", error.name);
  }

  return res.status(500).json({
    success: false,
    message: "Media request failed",
  });
});

module.exports = router;
