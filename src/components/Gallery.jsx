import ImageCard from "./ImageCard";

function Gallery({ groupedGallery, onToggleFavorite, onClearFilters }) {
  if (groupedGallery.length === 0) {
    return (
      <section className="empty-state" aria-live="polite">
        <p className="eyebrow">No Matches</p>
        <h2>No photos found</h2>
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
              photos
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
