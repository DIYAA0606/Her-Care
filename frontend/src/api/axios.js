import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

// This function must be called once, after AuthContext exists
export function setupInterceptors(getAccessToken) {
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

export default api;