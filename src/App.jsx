// App route shell: decides which page to render for the current URL and preserves the client/gallery flow.
import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import {
  getCurrentUser,
  logout as logoutRequest,
} from "./services/authService";
import Navbar from "./components/Navbar";
import Gallery from "./components/Gallery";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";

const initialGalleryItems = [
  {
    id: 1,
    title: "Mountain Morning",
    date: "Thu, Jul 30",
    time: "7:58 PM",
    section: "July",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    alt: "Cabin and mountains in warm morning light",
    favorite: true,
    size: "wide",
  },
  {
    id: 2,
    title: "Forest Walk",
    date: "Thu, Jul 30",
    time: "8:24 PM",
    section: "July",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
    alt: "Green forest trail with tall trees",
    favorite: false,
    size: "tall",
  },
  {
    id: 3,
    title: "Kyoto Evening",
    date: "Tue, Jul 28",
    time: "6:12 PM",
    section: "July",
    src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=80",
    alt: "Traditional street in Kyoto at evening",
    favorite: true,
    size: "portrait",
  },
  {
    id: 4,
    title: "Coastal Highway",
    date: "Tue, Jul 28",
    time: "5:47 PM",
    section: "July",
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    alt: "Open road beside a dramatic coastline",
    favorite: false,
    size: "wide",
  },
  {
    id: 5,
    title: "Brunch Table",
    date: "Sun, Jul 19",
    time: "11:18 AM",
    section: "July",
    src: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80",
    alt: "Colorful brunch plates arranged on a table",
    favorite: false,
    size: "landscape",
  },
  {
    id: 6,
    title: "Coffee Notes",
    date: "Sun, Jul 19",
    time: "9:36 AM",
    section: "July",
    src: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
    alt: "Cup of coffee beside handwritten notes",
    favorite: true,
    size: "square",
  },
];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

function toTitleCase(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function cleanFileName(fileName) {
  return fileName.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
}

function groupItemsBySection(items) {
  return items.reduce((sections, item) => {
    let sectionGroup = sections.find((group) => group.section === item.section);

    if (!sectionGroup) {
      sectionGroup = { section: item.section, dates: [] };
      sections.push(sectionGroup);
    }

    let dateGroup = sectionGroup.dates.find((group) => group.date === item.date);

    if (!dateGroup) {
      dateGroup = { date: item.date, items: [] };
      sectionGroup.dates.push(dateGroup);
    }

    dateGroup.items.push(item);
    return sections;
  }, []);
}

function GalleryPage({ onLogout, currentUser, logoutError }) {
  const [galleryItems, setGalleryItems] = useState(initialGalleryItems);
  const [showFavorites, setShowFavorites] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const cancelDeleteRef = useRef(null);
  const fileInputRef = useRef(null);

  const favoriteCount = useMemo(
    () => galleryItems.filter((item) => item.favorite).length,
    [galleryItems],
  );

  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      const matchesFavorites = !showFavorites || item.favorite;
      return matchesFavorites;
    });
  }, [galleryItems, showFavorites]);

  useEffect(() => {
    if (!mediaToDelete) return undefined;

    cancelDeleteRef.current?.focus();
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMediaToDelete(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mediaToDelete]);

  const groupedGallery = useMemo(
    () => groupItemsBySection(filteredItems),
    [filteredItems],
  );

  function handleToggleFavorite(photoId) {
    setGalleryItems((currentItems) =>
      currentItems.map((item) =>
        item.id === photoId ? { ...item, favorite: !item.favorite } : item,
      ),
    );
  }

  function handleClearFilters() {
    setShowFavorites(false);
  }

  function confirmDeleteMedia() {
    if (!mediaToDelete) return;

    setGalleryItems((currentItems) =>
      currentItems.filter((item) => item.id !== mediaToDelete.id),
    );
    setMediaToDelete(null);
  }

  function handleDeleteMedia(mediaId, mediaTitle) {
    setMediaToDelete({ id: mediaId, title: mediaTitle });
  }

  function handleOpenFilePicker() {
    fileInputRef.current?.click();
  }

  function handleUploadFiles(fileList) {
    const files = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/") || file.type.startsWith("video/"),
    );

    if (files.length === 0) {
      return;
    }

    const now = new Date();
    const dateLabel = dateFormatter.format(now);
    const monthLabel = monthFormatter.format(now);
    const timeLabel = timeFormatter.format(now);

    setGalleryItems((currentItems) => {
      const newItems = files.map((file, index) => {
        const mediaType = file.type.startsWith("video/") ? "video" : "image";
        const fallbackTitle = toTitleCase(
          cleanFileName(file.name) || `Uploaded ${mediaType}`,
        );

        return {
          id: Date.now() + index + currentItems.length + 1,
          title: fallbackTitle,
          date: dateLabel,
          time: timeLabel,
          section: monthLabel,
          src: URL.createObjectURL(file),
          alt: fallbackTitle,
          mediaType,
          favorite: false,
          size: "landscape",
        };
      });

      return [...newItems, ...currentItems];
    });
  }

  function handleFileChange(event) {
    handleUploadFiles(event.target.files);
    event.target.value = "";
  }

  return (
    <div className="app-shell">
      <Navbar
        onAddClick={handleOpenFilePicker}
        showFavorites={showFavorites}
        onFavoritesToggle={() => setShowFavorites((current) => !current)}
        favoriteCount={favoriteCount}
        onLogout={onLogout}
        currentUser={currentUser}
      />

      {logoutError && (
        <p className="login-error" role="alert">
          {logoutError}
        </p>
      )}

      <main className="gallery-dashboard">
        <section className="library-header" aria-labelledby="gallery-title">
          <div>
            <p className="eyebrow">Personal Library</p>
            <h1 id="gallery-title">Photo Gallery</h1>
            <p className="library-summary">
              Recent trips, meals, notes, and everyday moments in one calm
              library.
            </p>
          </div>

          <div className="library-stats" aria-label="Gallery summary">
            <span>
              <strong>{galleryItems.length}</strong>
              Media
            </span>
            <span>
              <strong>{favoriteCount}</strong>
              Favorites
            </span>
            <span>
              <strong>{filteredItems.length}</strong>
              Showing
            </span>
          </div>
        </section>

        <Gallery
          groupedGallery={groupedGallery}
          onToggleFavorite={handleToggleFavorite}
          onClearFilters={handleClearFilters}
          onDeleteMedia={handleDeleteMedia}
        />
      </main>

      {mediaToDelete && (
        <div
          className="admin-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setMediaToDelete(null);
          }}
        >
          <section
            className="admin-confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-media-title"
            aria-describedby="delete-media-description"
          >
            <h2 id="delete-media-title">Delete this media?</h2>
            <p id="delete-media-description">
              {mediaToDelete.title} will be removed from your library.
            </p>
            <div className="admin-dialog-actions">
              <button
                ref={cancelDeleteRef}
                className="admin-cancel-button"
                type="button"
                onClick={() => setMediaToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="admin-confirm-delete-button"
                type="button"
                onClick={confirmDeleteMedia}
              >
                Delete
              </button>
            </div>
          </section>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        onChange={handleFileChange}
      />

      <footer className="site-footer">
        <p>(c) 2026 Photo Gallery. Student React project.</p>
      </footer>
    </div>
  );
}

function App() {
  const [path, setPath] = useState(() => window.location.pathname);
  const [accountCreated, setAccountCreated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function restoreSession() {
      try {
        const user = await getCurrentUser();
        if (isActive && user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        if (isActive) {
          setSessionError(error.message);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    function handlePopState() {
      setPath(window.location.pathname);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!isLoading && path === "/gallery" && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, path]);

  function navigate(nextPath) {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  }

  async function handleLogout() {
    try {
      await logoutRequest();
      setCurrentUser(null);
      setIsAuthenticated(false);
      setSessionError("");
      navigate("/login");
    } catch (error) {
      setSessionError(error.message);
    }
  }

  if (path === "/" || path === "/login") {
    return (
      <Login
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
          setSessionError("");
          navigate("/gallery");
        }}
        onSignup={() => navigate("/signup")}
        onAdminLogin={() => navigate("/admin/login")}
        accountCreated={accountCreated}
        onAccountCreatedAlert={() => setAccountCreated(false)}
        sessionError={sessionError}
      />
    );
  }

  if (path === "/signup") {
    return (
      <Signup
        onLogin={() => navigate("/login")}
        onAccountCreated={() => {
          setAccountCreated(true);
          navigate("/login");
        }}
      />
    );
  }

  if (path === "/gallery") {
    if (isLoading) {
      return <main aria-live="polite">Loading...</main>;
    }
    if (!isAuthenticated) {
      return null;
    }
    return (
      <GalleryPage
        onLogout={handleLogout}
        currentUser={currentUser}
        logoutError={sessionError}
      />
    );
  }

  if (path === "/admin/login") {
    return (
      <AdminLogin
        onLoginSuccess={() => navigate("/admin")}
        onBackToClientLogin={() => navigate("/login")}
      />
    );
  }

  if (path === "/admin") {
    return <Admin onLogout={() => navigate("/admin/login")} />;
  }

  return (
    <Login
      onLoginSuccess={(user) => {
        setCurrentUser(user);
        setIsAuthenticated(true);
        setSessionError("");
        navigate("/gallery");
      }}
      onSignup={() => navigate("/signup")}
      onAdminLogin={() => navigate("/admin/login")}
      accountCreated={accountCreated}
      onAccountCreatedAlert={() => setAccountCreated(false)}
      sessionError={sessionError}
    />
  );
}

export default App;
