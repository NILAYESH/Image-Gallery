// Navbar: shared top navigation for the gallery and admin views, with profile/logout access and action buttons.
import { useEffect, useRef, useState } from "react";

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
  onLogout,
  adminMode = false,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!profileRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="top-navbar">
      <div className="brand-block" aria-label="Photo Gallery home">
        <img
          className="brand-mark"
          src="/Icon-gallery.svg"
          alt=""
          aria-hidden="true"
        />
        <span className="brand-copy">
          <strong>Photo Gallery</strong>
        </span>
      </div>

      <div className="navbar-actions">
        {!adminMode && (
          <>
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
          </>
        )}

        <div className="profile-menu" ref={profileRef}>
          <button
            className="avatar"
            type="button"
            aria-label={`Open ${adminMode ? "admin" : "profile"} menu`}
            aria-expanded={profileOpen}
            aria-controls="profile-dropdown"
            onClick={() => setProfileOpen((current) => !current)}
          >
            {adminMode ? "AD" : "NA"}
          </button>
          {profileOpen && (
            <div className="profile-dropdown" id="profile-dropdown">
              <p className="profile-greeting">
                {adminMode ? "Admin" : "Hello, CYRUS"}
              </p>
              <button
                className="profile-logout"
                type="button"
                onClick={onLogout}
              >
                {adminMode ? "Log out" : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
