import axios, { type InternalAxiosRequestConfig } from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export const publicApi = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  withCredentials: true,
});

export const privateApi = axios.create({});

privateApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (e) => Promise.reject(e)
);

privateApi.interceptors.response.use(
  (response) => response,
  async (e) => {
    return Promise.reject(e);
  }
);
