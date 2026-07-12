import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("assetflow_access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const authRetryBlocked = ["/auth/login", "/auth/signup", "/auth/refresh"].some((path) => original.url.includes(path));
    if (error.response?.status === 401 && !original._retry && !authRetryBlocked) {
      original._retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        localStorage.setItem("assetflow_access", data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch (refreshError) {
        localStorage.removeItem("assetflow_access");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
