function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-7.4-4.4-9.5-9.1C1 8.5 2.8 5 6.5 5c2.1 0 3.5 1.1 4.4 2.4C11.8 6.1 13.2 5 15.3 5 19 5 21 8.5 19.4 11.9 17.4 16.6 12 21 12 21Z" />
    </svg>
  );
}

function FilterBar({
  categories,
  selectedCategory,
  onCategoryChange,
  showFavorites,
  onFavoritesToggle,
  favoriteCount,
}) {
  return (
    <section className="filter-bar" aria-label="Gallery filters">
      <div className="filter-scroll">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`filter-chip ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => onCategoryChange(category)}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={`favorites-chip ${showFavorites ? "active" : ""}`}
        onClick={onFavoritesToggle}
        aria-pressed={showFavorites}
      >
        <HeartIcon />
        <span>Favorites</span>
        <strong>{favoriteCount}</strong>
      </button>
    </section>
  );
}

export default FilterBar;
