import { useEffect, useRef, useState } from "react";

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5Z" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 16V7.8L8.2 10.6 6.8 9.2 12 4l5.2 5.2-1.4 1.4L13 7.8V16h-2Z" />
      <path d="M5 18h14v2H5v-2Z" />
    </svg>
  );
}

function UploadModal({ open, theme, categories, onClose, onUpload }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    category: "",
    date: "",
  });

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setIsDragging(false);
      setFormState({
        name: "",
        category: "",
        date: "",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open]);

  if (!open) {
    return null;
  }

  function openPicker() {
    fileInputRef.current?.click();
  }

  function resetAndClose() {
    setIsDragging(false);
    setFormState({
      name: "",
      category: "",
      date: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onClose();
  }

  function handleFiles(fileList) {
    const files = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (files.length === 0) {
      return;
    }

    onUpload({
      files,
      name: formState.name,
      category: formState.category,
      date: formState.date,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleFileChange(event) {
    handleFiles(event.target.files);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      resetAndClose();
    }
  }

  function handleChange(field) {
    return (event) => {
      setFormState((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };
  }

  return (
    <div
      className="upload-modal"
      data-theme={theme}
      role="presentation"
      onClick={handleOverlayClick}
    >
      <div
        className="upload-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-modal-title"
        aria-describedby="upload-modal-note"
      >
        <h2 className="upload-modal__title" id="upload-modal-title">
          Upload images
        </h2>

        <div className="upload-modal__topbar">
          <button
            className="upload-modal__icon-button"
            type="button"
            onClick={resetAndClose}
            aria-label="Close upload modal"
          >
            <CloseIcon />
          </button>

          <button
            className="upload-modal__submit"
            type="button"
            onClick={openPicker}
          >
            <UploadIcon />
            <span>Upload</span>
          </button>
        </div>

        <div className="upload-modal__body">
          <button
            className={`upload-modal__dropzone ${
              isDragging ? "is-dragging" : ""
            }`}
            type="button"
            onClick={openPicker}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <span className="upload-modal__drop-icon">
              <PlusIcon />
            </span>
            <strong>Drag & Drop image here</strong>
            <span className="upload-modal__drop-divider">Or</span>
            <span className="upload-modal__drop-link">
              Choose image by clicking
            </span>
            <span className="upload-modal__drop-hint">
              PNG, JPG, WEBP, and other image files
            </span>
          </button>

          <div className="upload-modal__form-area">
            <div className="upload-modal__fields">
              <label className="upload-field">
                <span>Picture name (Optional)</span>
                <input
                  type="text"
                  value={formState.name}
                  onChange={handleChange("name")}
                  placeholder="Mountain morning"
                />
              </label>

              <label className="upload-field">
                <span>Picture Category (Optional)</span>
                <select
                  value={formState.category}
                  onChange={handleChange("category")}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="upload-field">
                <span>Date (Optional)</span>
                <input
                  type="date"
                  value={formState.date}
                  onChange={handleChange("date")}
                />
              </label>
            </div>

            <aside className="upload-modal__note" id="upload-modal-note">
              <p>
                Picture name and category are optional. Date defaults to today
                so the gallery stays grouped and searchable.
              </p>
            </aside>
          </div>
        </div>

        <input
          ref={fileInputRef}
          className="upload-modal__input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}

export default UploadModal;
