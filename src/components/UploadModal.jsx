import { useEffect, useState } from "react";
import MEDIA_CATEGORIES from "../constants/mediaCategories";
import { uploadMedia } from "../services/mediaService";

function getSuggestedTitle(fileName) {
  return fileName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
}

function UploadModal({ onClose, onUploadSuccess, onSessionExpired }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(MEDIA_CATEGORIES[0]);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && !isUploading) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isUploading, onClose]);

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0] || null;
    setFile(nextFile);
    if (nextFile && !title.trim()) {
      setTitle(getSuggestedTitle(nextFile.name));
    }
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setError("Please select a file.");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title.trim());
    formData.append("category", category);

    setError("");
    setIsUploading(true);
    try {
      const result = await uploadMedia(formData);
      onUploadSuccess(result.media);
    } catch (uploadError) {
      if (uploadError.status === 401) {
        onSessionExpired();
      } else {
        setError(uploadError.message);
      }
      setIsUploading(false);
    }
  }

  return (
    <div
      className="admin-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isUploading) {
          onClose();
        }
      }}
    >
      <section
        className="admin-confirm-dialog upload-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-media-title"
      >
        <h2 id="upload-media-title">Add to your gallery</h2>
        <p>Choose an image or video and add a few details.</p>

        <form
          className="upload-modal-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <label className="upload-modal-field">
            <span>Photo or video</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>

          <label className="upload-modal-field">
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
            />
          </label>

          <label className="upload-modal-field">
            <span>Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              disabled={isUploading}
            >
              {MEDIA_CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {error && (
            <p className="upload-modal-error" role="alert">
              {error}
            </p>
          )}

          <div className="admin-dialog-actions">
            <button
              className="admin-cancel-button"
              type="button"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              className="admin-confirm-delete-button upload-submit-button"
              type="submit"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default UploadModal;
