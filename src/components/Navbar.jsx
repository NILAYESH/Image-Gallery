function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
    </svg>
  );
}

function Navbar({
  onAddClick,
  showFavorites,
  onFavoritesToggle,
  favoriteCount,
}) {
  return (
    <header className="top-navbar">
      <div className="brand-block" aria-label="Photo Gallery home">
        <span className="brand-mark">PG</span>
        <span className="brand-copy">
          <strong>Photo Gallery</strong>
        </span>
      </div>

      <div className="navbar-actions">
        <button
          className="icon-button"
          type="button"
          onClick={onAddClick}
          aria-label="Add photo"
        >
          <PlusIcon />
        </button>

        <button
          className={`favorites-chip navbar-favorites ${
            showFavorites ? "active" : ""
          }`}
          type="button"
          onClick={onFavoritesToggle}
          aria-label="Toggle favorites"
          aria-pressed={showFavorites}
        >
          <span>Favorites</span>
          <strong>{favoriteCount}</strong>
        </button>

        <span className="avatar" aria-label="Student profile">
          NA
        </span>
      </div>
    </header>
  );
}

export default Navbar;
