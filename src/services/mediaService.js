const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api/media${path}`, {
    ...options,
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Media request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}

const getMedia = async () => {
  const data = await request("");
  return data.media;
};

const uploadMedia = async (formData) =>
  request("/upload", {
    method: "POST",
    body: formData,
  });

const toggleFavorite = async (mediaId) =>
  request(`/${encodeURIComponent(mediaId)}/favorite`, {
    method: "PATCH",
  });

const deleteMedia = async (mediaId) =>
  request(`/${encodeURIComponent(mediaId)}`, {
    method: "DELETE",
  });

export { getMedia, uploadMedia, toggleFavorite, deleteMedia };
