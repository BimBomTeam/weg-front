import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: "https://aicademia.xyz/api/",
});

const refreshAuthToken = async () => {
  try {
    const response = await axios.post(
      "https://aicademia.xyz/api/Authentificate/refresh",
      {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      }
    );
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    return response.data.accessToken;
  } catch (err) {
    console.error("Failed to refresh token", err);
    throw err;
  }
};

api.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        accessToken = await refreshAuthToken();
      }
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const accessToken = await refreshAuthToken();
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Failed to refresh token in response interceptor", err);
        // Optionally: Redirect to login page or handle error appropriately
      }
    }
    return Promise.reject(error);
  }
);

export default api;
