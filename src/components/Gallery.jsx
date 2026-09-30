// Gallery: groups and renders the collection of media cards by date/section for the main library view.
import ImageCard from "./ImageCard";

function Gallery({
  groupedGallery,
  onToggleFavorite,
  pendingFavoriteIds,
  onClearFilters,
  onDeleteMedia,
  isLoading,
  error,
  hasMedia,
  onRetry,
  onAddMedia,
}) {
  if (isLoading) {
    return (
      <section className="empty-state" aria-live="polite">
        <p>Loading your gallery...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="empty-state" aria-live="polite">
        <p className="eyebrow">Something went wrong</p>
        <h2>Could not load your media</h2>
        <p>{error}</p>
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      </section>
    );
  }

  if (groupedGallery.length === 0) {
    if (!hasMedia) {
      return (
        <section className="empty-state" aria-live="polite">
          <p className="eyebrow">Your Personal Library</p>
          <h2>Your gallery is empty</h2>
          <p>Upload a photo or video to start your collection.</p>
          <button type="button" onClick={onAddMedia}>
            Add media
          </button>
        </section>
      );
    }

    return (
      <section className="empty-state" aria-live="polite">
        <p className="eyebrow">No Matches</p>
        <h2>No media found</h2>
        <p>No saved moments match the current view.</p>
        <button type="button" onClick={onClearFilters}>
          Clear filters
        </button>
      </section>
    );
  }

  return (
    <section className="gallery-sections" aria-label="Grouped photo gallery">
      {groupedGallery.map((sectionGroup) => (
        <section className="month-section" key={sectionGroup.section}>
          <div className="month-heading">
            <h2>{sectionGroup.section}</h2>
            <span>
              {sectionGroup.dates.reduce(
                (total, dateGroup) => total + dateGroup.items.length,
                0,
              )}{" "}
              items
            </span>
          </div>

          {sectionGroup.dates.map((dateGroup) => (
            <section className="date-section" key={dateGroup.date}>
              <div className="date-heading">
                <h3>{dateGroup.date}</h3>
                <span>{dateGroup.items.length} items</span>
              </div>

              <div className="photo-grid">
                {dateGroup.items.map((item) => (
                  <ImageCard
                    key={item.id}
                    item={item}
                    onToggleFavorite={onToggleFavorite}
                    onDeleteMedia={onDeleteMedia}
                    isFavoriteUpdating={pendingFavoriteIds.has(item.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </section>
      ))}
    </section>
  );
}

export default Gallery;
