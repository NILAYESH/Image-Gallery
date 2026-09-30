// App route shell: decides which page to render for the current URL and preserves the client/gallery flow.
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";
import {
  getCurrentUser,
  logout as logoutRequest,
} from "./services/authService";
import {
  deleteMedia,
  getMedia,
  toggleFavorite,
} from "./services/mediaService";
import Navbar from "./components/Navbar";
import Gallery from "./components/Gallery";
import UploadModal from "./components/UploadModal";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
});

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function mapMedia(media) {
  const createdAt = new Date(media.createdAt);
  const title = media.title || media.fileName;

  return {
    id: media.id,
    title,
    category: media.category,
    date: dateFormatter.format(createdAt),
    time: timeFormatter.format(createdAt),
    section: monthFormatter.format(createdAt),
    src: media.fileUrl,
    alt: title,
    mediaType: media.type,
    favorite: media.favorite,
    size: "landscape",
    displaySize: formatFileSize(media.fileSize),
  };
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

function GalleryPage({ onLogout, currentUser, logoutError, onSessionExpired }) {
  const [galleryItems, setGalleryItems] = useState([]);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [galleryError, setGalleryError] = useState("");
  const [mediaNotice, setMediaNotice] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingFavoriteIds, setPendingFavoriteIds] = useState(() => new Set());
  const cancelDeleteRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    async function loadMedia() {
      setIsMediaLoading(true);
      setGalleryError("");
      try {
        const media = await getMedia();
        if (isActive) {
          setGalleryItems(media.map(mapMedia));
        }
      } catch (error) {
        if (error.status === 401) {
          onSessionExpired();
          return;
        }
        if (isActive) {
          setGalleryError(error.message);
        }
      } finally {
        if (isActive) {
          setIsMediaLoading(false);
        }
      }
    }

    loadMedia();
    return () => {
      isActive = false;
    };
  }, [onSessionExpired, reloadKey]);

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

  async function handleToggleFavorite(photoId) {
    if (pendingFavoriteIds.has(photoId)) return;

    setPendingFavoriteIds((current) => new Set(current).add(photoId));
    setMediaNotice("");
    try {
      const result = await toggleFavorite(photoId);
      const updatedItem = mapMedia(result.media);
      setGalleryItems((currentItems) =>
        currentItems.map((item) => (item.id === photoId ? updatedItem : item)),
      );
    } catch (error) {
      if (error.status === 401) {
        onSessionExpired();
      } else {
        setMediaNotice(error.message);
      }
    } finally {
      setPendingFavoriteIds((current) => {
        const next = new Set(current);
        next.delete(photoId);
        return next;
      });
    }
  }

  function handleClearFilters() {
    setShowFavorites(false);
  }

  async function confirmDeleteMedia() {
    if (!mediaToDelete) return;

    setIsDeleting(true);
    setDeleteError("");
    try {
      await deleteMedia(mediaToDelete.id);
      setGalleryItems((currentItems) =>
        currentItems.filter((item) => item.id !== mediaToDelete.id),
      );
      setMediaToDelete(null);
    } catch (error) {
      if (error.status === 401) {
        onSessionExpired();
      } else {
        setDeleteError(error.message);
      }
    } finally {
      setIsDeleting(false);
    }
  }

  function handleDeleteMedia(mediaId, mediaTitle) {
    setMediaToDelete({ id: mediaId, title: mediaTitle });
    setDeleteError("");
  }

  function handleUploadSuccess(media) {
    setGalleryItems((currentItems) => [mapMedia(media), ...currentItems]);
    setIsUploadOpen(false);
  }

  return (
    <div className="app-shell">
      <Navbar
        onAddClick={() => setIsUploadOpen(true)}
        showFavorites={showFavorites}
        onFavoritesToggle={() => setShowFavorites((current) => !current)}
        favoriteCount={favoriteCount}
        onLogout={onLogout}
        currentUser={currentUser}
      />

      {(logoutError || mediaNotice) && (
        <p className="login-error" role="alert">
          {logoutError || mediaNotice}
        </p>
      )}

      <main className="gallery-dashboard">
        <section className="library-header" aria-labelledby="gallery-title">
          <div>
            <p className="eyebrow">Personal Library</p>
            <h1 id="gallery-title">Photo Gallery</h1>
            <p className="library-summary">
              Your photos and videos, all in one place.
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
          pendingFavoriteIds={pendingFavoriteIds}
          onClearFilters={handleClearFilters}
          onDeleteMedia={handleDeleteMedia}
          isLoading={isMediaLoading}
          error={galleryError}
          hasMedia={galleryItems.length > 0}
          onRetry={() => setReloadKey((current) => current + 1)}
          onAddMedia={() => setIsUploadOpen(true)}
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
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="admin-confirm-delete-button"
                type="button"
                onClick={confirmDeleteMedia}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
            {deleteError && (
              <p className="upload-modal-error" role="alert">
                {deleteError}
              </p>
            )}
          </section>
        </div>
      )}

      {isUploadOpen && (
        <UploadModal
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={handleUploadSuccess}
          onSessionExpired={onSessionExpired}
        />
      )}

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

  const navigate = useCallback((nextPath) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  }, []);

  const handleSessionExpired = useCallback(() => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    window.history.replaceState({}, "", "/login");
    setPath("/login");
  }, []);

  useEffect(() => {
    let isActive = true;
    let hasRestoredSession = false;

    async function restoreSession() {
      try {
        const user = await getCurrentUser();
        if (isActive && user) {
          hasRestoredSession = true;
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
          if (
            !hasRestoredSession &&
            window.location.pathname === "/gallery"
          ) {
            navigate("/login");
          }
        }
      }
    }

    restoreSession();
    return () => {
      isActive = false;
    };
  }, [navigate]);

  useEffect(() => {
    function handlePopState() {
      const nextPath = window.location.pathname;
      if (nextPath === "/gallery" && !isLoading && !isAuthenticated) {
        window.history.replaceState({}, "", "/login");
        setPath("/login");
        return;
      }
      setPath(nextPath);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isAuthenticated, isLoading]);

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
        onSessionExpired={handleSessionExpired}
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
