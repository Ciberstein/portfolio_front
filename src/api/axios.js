import axios from "axios";
import auth from "../services/auth.services";
import { notify } from "../utils/notify";

// Surfacing failures here rather than at each call site is deliberate: this runs
// before any caller's catch, so an empty `catch {}` or a missing one cannot
// swallow the message. Pass { quiet: true } on requests whose failure is
// already shown in place, or is expected.
const report = (err) => {
  if (err.config?.quiet) return;

  const message =
    err.response?.data?.message ||
    (err.response
      ? `Request failed (${err.response.status})`
      : "Could not reach the server");

  notify(message, "error");
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        await auth.refresh();
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // A 401 that reached this point already survived the refresh attempt, so
    // it is a real authorisation failure and worth reporting like any other.
    report(err);

    return Promise.reject(err);
  }
);

export default api;
