// ImageCard: renders one gallery item, supporting favorite toggling and video/image display for each card.
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-7.4-4.4-9.5-9.1C1 8.5 2.8 5 6.5 5c2.1 0 3.5 1.1 4.4 2.4C11.8 6.1 13.2 5 15.3 5 19 5 21 8.5 19.4 11.9 17.4 16.6 12 21 12 21Z" />
    </svg>
  );
}

function ImageCard({ item, onToggleFavorite, onDeleteMedia }) {
  return (
    <article className={`photo-card ${item.favorite ? "is-favorite" : ""}`}>
      <div className={`image-frame ${item.size || "landscape"}`}>
        {item.mediaType === "video" ? (
          <video
            src={item.src}
            aria-label={item.title}
            controls
            defaultMuted
            preload="metadata"
            playsInline
          />
        ) : (
          <img src={item.src} alt={item.alt} loading="lazy" />
        )}

        <div className="card-overlay">
          <button
            className="favorite-button"
            type="button"
            onClick={() => onToggleFavorite(item.id)}
            aria-label={
              item.favorite
                ? `Remove ${item.title} from favorites`
                : `Add ${item.title} to favorites`
            }
            aria-pressed={item.favorite}
          >
            <HeartIcon />
          </button>

          <button
            className="delete-media-button"
            type="button"
            onClick={() => onDeleteMedia(item.id, item.title)}
            aria-label={`Delete ${item.title}`}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="card-body">
        <p>Captured {item.time}</p>
        <span className="card-dot" aria-hidden="true" />
      </div>
    </article>
  );
}

export default ImageCard;
