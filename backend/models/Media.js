const mongoose = require("mongoose");
const MEDIA_CATEGORIES = require("../utils/mediaCategories");

const mediaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    category: {
      type: String,
      required: true,
      enum: MEDIA_CATEGORIES,
    },
    type: {
      type: String,
      required: true,
      enum: ["image", "video"],
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    imageKitFileId: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
      min: 1,
    },
    mimeType: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

mediaSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Media", mediaSchema);
