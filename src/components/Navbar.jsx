function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.8 18.1a7.3 7.3 0 1 1 0-14.6 7.3 7.3 0 0 1 0 14.6Zm0-2a5.3 5.3 0 1 0 0-10.6 5.3 5.3 0 0 0 0 10.6Z" />
      <path d="m16.2 16.1 4.1 4.1-1.4 1.4-4.1-4.1 1.4-1.4Z" />
    </svg>
  );
}

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

function Navbar({
  searchQuery,
  onSearchChange,
  theme,
  onThemeToggle,
  onAddClick,
  visibleCount,
  totalCount,
}) {
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <header className="top-navbar">
      <div className="brand-block" aria-label="Photo Gallery home">
        <span className="brand-mark">PG</span>
        <span className="brand-copy">
          <strong>Photo Gallery</strong>
        </span>
      </div>

      <label className="search-box">
        <SearchIcon />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search photos, dates, categories"
          aria-label="Search gallery"
        />
        {searchQuery && (
          <button
            className="search-clear"
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            <CloseIcon />
          </button>
        )}
      </label>

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
          className={`theme-switch ${theme === "light" ? "is-light" : ""}`}
          type="button"
          onClick={onThemeToggle}
          aria-label={`Switch to ${nextTheme} theme`}
          aria-pressed={theme === "light"}
        >
          <span className="theme-switch-track">
            <span className="theme-switch-knob" />
          </span>
          <span className="theme-switch-label">
            {theme === "dark" ? "Dark" : "Light"}
          </span>
        </button>

        <span className="avatar" aria-label="Student profile">
          NA
        </span>
      </div>
    </header>
  );
}

export default Navbar;
