import { useAuthStore } from "@/stores/auth.store";
import axios, { AxiosError, AxiosHeaders } from "axios";
import { AUTH_PATH } from "../auth/auth.path";

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

export const privateApi = axios.create({
  baseURL: API_BASE,
  withCredentials: true
});

privateApi.interceptors.request.use((config) => {
  const {accessToken} = useAuthStore.getState();


  if(accessToken && config.headers) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

let isRefreshing = false;
let failQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (err: unknown, token: string | null) => {
  failQueue.forEach(process => {
    if(err) process.reject(err);
    else process.resolve(token);
  });

  failQueue = [];
}

privateApi.interceptors.response.use(
  (res) => res,

  async (err: AxiosError) => {
    const original = err.config as any;

    if(err.response?.status == 401 && !original._retry) {
      const {clearAuth, setAccessToken} = useAuthStore.getState();

      if(isRefreshing) {
        return new Promise((resolve, reject) => {
          failQueue.push({
            resolve: (newToken) => {
              if(newToken) original.headers.Authorization = `Bearer ${newToken}`;
              resolve(privateApi(original));
            },

            reject,
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const {data} = await publicApi.post(AUTH_PATH.REFRESH);

        const newAccessToken = (data as any).data.accessToken;

        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        original.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return privateApi(original);
      } catch(refreshErr) {
        processQueue(refreshErr, null);
        clearAuth();

        return Promise.reject(ReferenceError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);
