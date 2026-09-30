const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");
const Media = require("../models/Media");
const MEDIA_CATEGORIES = require("../utils/mediaCategories");
const {
  uploadToImageKit,
  deleteFromImageKit,
} = require("../services/imagekitService");
const {
  MAX_FILE_SIZE_BYTES,
  SUPPORTED_MIME_TYPES,
} = require("../middleware/uploadMiddleware");

const detectFileType = (buffer) =>
  import("file-type").then(({ fileTypeFromBuffer }) =>
    fileTypeFromBuffer(buffer),
  );

const toPublicMedia = (media) => ({
  id: media._id.toString(),
  title: media.title,
  category: media.category,
  type: media.type,
  fileName: media.fileName,
  fileUrl: media.fileUrl,
  fileSize: media.fileSize,
  mimeType: media.mimeType,
  favorite: media.favorite,
  createdAt: media.createdAt,
  updatedAt: media.updatedAt,
});

const getMedia = async (req, res) => {
  try {
    const media = await Media.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      media: media.map(toPublicMedia),
    });
  } catch (error) {
    console.error("Media retrieval failed:", error.name);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve media",
    });
  }
};

const uploadMedia = async (req, res) => {
  let uploadedFile;
  let mediaRecord;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const { title, category } = req.body;
    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.trim().length > 120 ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "A title of 120 characters or fewer and a category are required",
      });
    }

    if (!MEDIA_CATEGORIES.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported category",
      });
    }

    if (
      !SUPPORTED_MIME_TYPES.has(req.file.mimetype) ||
      req.file.size > MAX_FILE_SIZE_BYTES
    ) {
      return res.status(400).json({
        success: false,
        message:
          req.file.size > MAX_FILE_SIZE_BYTES
            ? "File size exceeds the allowed limit"
            : "Unsupported file type",
      });
    }

    const detectedType = await detectFileType(req.file.buffer);
    if (!detectedType || detectedType.mime !== req.file.mimetype) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type",
      });
    }

    const mediaType = detectedType.mime.startsWith("image/")
      ? "image"
      : detectedType.mime.startsWith("video/")
        ? "video"
        : null;

    if (!mediaType) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type",
      });
    }

    const originalFileName = path
      .basename(req.file.originalname.replace(/\\/g, "/"))
      .replace(/[\u0000-\u001f\u007f]/g, "");
    const safeFileName = `${crypto.randomUUID()}.${detectedType.ext}`;
    uploadedFile = await uploadToImageKit(
      req.file.buffer,
      safeFileName,
      req.user._id.toString(),
    );

    mediaRecord = await Media.create({
      userId: req.user._id,
      title: title.trim(),
      category,
      type: mediaType,
      fileName: originalFileName,
      fileUrl: uploadedFile.fileUrl,
      imageKitFileId: uploadedFile.imageKitFileId,
      fileSize: req.file.size,
      mimeType: detectedType.mime,
      favorite: false,
    });

    return res.status(201).json({
      success: true,
      media: toPublicMedia(mediaRecord),
    });
  } catch (error) {
    console.error("Media upload failed:", error.name);

    if (uploadedFile?.imageKitFileId) {
      try {
        await deleteFromImageKit(uploadedFile.imageKitFileId);
      } catch (cleanupError) {
        console.error("ImageKit upload cleanup failed:", cleanupError.name);
      }
    }

    if (error.code === "IMAGEKIT_NOT_CONFIGURED") {
      return res.status(503).json({
        success: false,
        message: "Media storage is not configured",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload media",
    });
  }
};

const toggleFavorite = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid media ID",
    });
  }

  try {
    const media = await Media.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    media.favorite = !media.favorite;
    await media.save();

    return res.status(200).json({
      success: true,
      media: toPublicMedia(media),
    });
  } catch (error) {
    console.error("Favorite update failed:", error.name);
    return res.status(500).json({
      success: false,
      message: "Failed to update favorite",
    });
  }
};

const deleteMedia = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid media ID",
    });
  }

  let deletedMedia;
  try {
    deletedMedia = await Media.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deletedMedia) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    await deleteFromImageKit(deletedMedia.imageKitFileId);

    return res.status(200).json({
      success: true,
      message: "Media deleted successfully",
    });
  } catch (error) {
    console.error("Media deletion failed:", error.name);

    if (deletedMedia) {
      try {
        await Media.create(deletedMedia.toObject());
      } catch (restoreError) {
        console.error("Media deletion rollback failed:", restoreError.name);
      }
    }

    if (error.code === "IMAGEKIT_NOT_CONFIGURED") {
      return res.status(503).json({
        success: false,
        message: "Media storage is not configured",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete media",
    });
  }
};

module.exports = {
  getMedia,
  uploadMedia,
  toggleFavorite,
  deleteMedia,
};
