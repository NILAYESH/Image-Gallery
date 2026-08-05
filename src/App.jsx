import { useMemo, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import AnimatedBackground from "./components/AnimatedBackground";
import FilterBar from "./components/FilterBar";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";
import UploadModal from "./components/UploadModal";

const categories = [
  "All",
  "Nature",
  "Travel",
  "Food",
  "Animals",
  "People",
  "Documents",
  "Screenshots",
];

const initialGalleryItems = [
  {
    id: 1,
    title: "Mountain Morning",
    category: "Nature",
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
    category: "Nature",
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
    category: "Travel",
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
    category: "Travel",
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
    category: "Food",
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
    category: "Food",
    date: "Sun, Jul 19",
    time: "9:36 AM",
    section: "July",
    src: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80",
    alt: "Cup of coffee beside handwritten notes",
    favorite: true,
    size: "square",
  },
  {
    id: 7,
    title: "Golden Hour Pup",
    category: "Animals",
    date: "Fri, Jul 17",
    time: "6:44 PM",
    section: "July",
    src: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",
    alt: "Golden retriever sitting in a grassy field",
    favorite: false,
    size: "portrait",
  },
  {
    id: 8,
    title: "Window Cat",
    category: "Animals",
    date: "Fri, Jul 17",
    time: "4:09 PM",
    section: "July",
    src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80",
    alt: "Cat resting near a bright window",
    favorite: true,
    size: "square",
  },
  {
    id: 9,
    title: "Studio Portrait",
    category: "People",
    date: "Mon, Jul 13",
    time: "2:31 PM",
    section: "July",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    alt: "Portrait of a smiling person in soft light",
    favorite: false,
    size: "portrait",
  },
  {
    id: 10,
    title: "Friends Downtown",
    category: "People",
    date: "Mon, Jul 13",
    time: "7:05 PM",
    section: "July",
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    alt: "Friends laughing together outdoors",
    favorite: false,
    size: "landscape",
  },
  {
    id: 11,
    title: "Research Notes",
    category: "Documents",
    date: "Fri, Jul 10",
    time: "10:14 AM",
    section: "July",
    src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80",
    alt: "Paperwork and notes spread across a desk",
    favorite: true,
    size: "landscape",
  },
  {
    id: 12,
    title: "Project Brief",
    category: "Documents",
    date: "Fri, Jul 10",
    time: "3:22 PM",
    section: "July",
    src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
    alt: "Documents and charts organized on a desk",
    favorite: false,
    size: "square",
  },
  {
    id: 13,
    title: "Analytics Capture",
    category: "Screenshots",
    date: "Wed, Jul 8",
    time: "1:48 PM",
    section: "July",
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
    alt: "Laptop screen showing analytics charts",
    favorite: false,
    size: "wide",
  },
  {
    id: 14,
    title: "Interface Draft",
    category: "Screenshots",
    date: "Wed, Jul 8",
    time: "4:57 PM",
    section: "July",
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    alt: "Laptop displaying a clean interface layout",
    favorite: true,
    size: "landscape",
  },
  {
    id: 15,
    title: "Desert Vista",
    category: "Nature",
    date: "Sat, Jun 27",
    time: "6:29 AM",
    section: "June",
    src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80",
    alt: "Desert landscape under a clear sky",
    favorite: false,
    size: "wide",
  },
  {
    id: 16,
    title: "Station Platform",
    category: "Travel",
    date: "Thu, Jun 18",
    time: "8:16 PM",
    section: "June",
    src: "https://i.pinimg.com/736x/98/aa/c5/98aac5ee632470b5184955350e90d12b.jpg",
    alt: "Train platform prepared for evening travel",
    favorite: false,
    size: "portrait",
  },
];

const uploadCategories = categories.filter((category) => category !== "All");

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

function App() {
  const [galleryItems, setGalleryItems] = useState(initialGalleryItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [theme, setTheme] = useState("dark");
  const [showFavorites, setShowFavorites] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const favoriteCount = useMemo(
    () => galleryItems.filter((item) => item.favorite).length,
    [galleryItems],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return galleryItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesFavorites = !showFavorites || item.favorite;
      const searchableText = `${item.title} ${item.category} ${item.date} ${item.section}`;
      const matchesSearch = searchableText
        .toLowerCase()
        .includes(normalizedQuery);

      return matchesCategory && matchesFavorites && matchesSearch;
    });
  }, [galleryItems, searchQuery, selectedCategory, showFavorites]);

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

  function handleThemeToggle() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  function handleClearFilters() {
    setSearchQuery("");
    setSelectedCategory("All");
    setShowFavorites(false);
  }

  function handleOpenUploadModal() {
    setIsUploadModalOpen(true);
  }

  function handleCloseUploadModal() {
    setIsUploadModalOpen(false);
  }

  function handleUploadFiles({ files, name, category, date }) {
    const now = new Date();
    const selectedDate = date ? new Date(`${date}T12:00:00`) : now;
    const normalizedDate = Number.isNaN(selectedDate.getTime()) ? now : selectedDate;
    const titleBase = cleanFileName(name?.trim() || "");
    const resolvedCategory = category || "Screenshots";
    const dateLabel = dateFormatter.format(normalizedDate);
    const monthLabel = monthFormatter.format(normalizedDate);
    const timeLabel = timeFormatter.format(normalizedDate);

    setGalleryItems((currentItems) => {
      const newItems = files.map((file, index) => {
        const fallbackTitle = toTitleCase(
          cleanFileName(file.name) || "Uploaded photo",
        );
        const itemTitle = titleBase || fallbackTitle;

        return {
          id: Date.now() + index + currentItems.length + 1,
          title: itemTitle,
          category: resolvedCategory,
          date: dateLabel,
          time: timeLabel,
          section: monthLabel,
          src: URL.createObjectURL(file),
          alt: itemTitle,
          favorite: false,
          size: "landscape",
        };
      });

      return [...newItems, ...currentItems];
    });
    setIsUploadModalOpen(false);
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <AnimatedBackground theme={theme} />

      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onAddClick={handleOpenUploadModal}
        visibleCount={filteredItems.length}
        totalCount={galleryItems.length}
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

        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showFavorites={showFavorites}
          onFavoritesToggle={() => setShowFavorites((current) => !current)}
          favoriteCount={favoriteCount}
        />

        <Gallery
          groupedGallery={groupedGallery}
          onToggleFavorite={handleToggleFavorite}
          onClearFilters={handleClearFilters}
        />
      </main>

      <UploadModal
        open={isUploadModalOpen}
        theme={theme}
        categories={uploadCategories}
        onClose={handleCloseUploadModal}
        onUpload={handleUploadFiles}
      />

      <Footer />
    </div>
  );
}

export default App;
