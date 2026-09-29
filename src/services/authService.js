const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api/auth${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Authentication request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}

const signup = (data) =>
  request("/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });

const login = (data) =>
  request("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

const getCurrentUser = async () => {
  try {
    const data = await request("/me");
    return data.user;
  } catch (error) {
    if (error.status === 401) {
      return null;
    }
    throw error;
  }
};

const logout = () =>
  request("/logout", {
    method: "POST",
  });

export { signup, login, getCurrentUser, logout };
