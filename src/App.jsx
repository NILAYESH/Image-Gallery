import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Gallery from "./components/Gallery";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

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

function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState(initialGalleryItems);
  const [showFavorites, setShowFavorites] = useState(false);
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

  function handleOpenFilePicker() {
    fileInputRef.current?.click();
  }

  function handleUploadFiles(fileList) {
    const files = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/"),
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
        const fallbackTitle = toTitleCase(
          cleanFileName(file.name) || "Uploaded photo",
        );

        return {
          id: Date.now() + index + currentItems.length + 1,
          title: fallbackTitle,
          date: dateLabel,
          time: timeLabel,
          section: monthLabel,
          src: URL.createObjectURL(file),
          alt: fallbackTitle,
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
      />

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
              Photos
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
        />
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
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

  useEffect(() => {
    function handlePopState() {
      setPath(window.location.pathname);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(nextPath) {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  }

  if (path === "/" || path === "/login") {
    return (
      <Login
        onLoginSuccess={() => navigate("/gallery")}
        onSignup={() => navigate("/signup")}
        accountCreated={accountCreated}
        onAccountCreatedAlert={() => setAccountCreated(false)}
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
    return <GalleryPage />;
  }

  return (
    <Login
      onLoginSuccess={() => navigate("/gallery")}
      onSignup={() => navigate("/signup")}
      accountCreated={accountCreated}
      onAccountCreatedAlert={() => setAccountCreated(false)}
    />
  );
}

export default App;
