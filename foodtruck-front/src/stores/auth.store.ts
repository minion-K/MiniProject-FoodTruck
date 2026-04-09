
import type { UserDetailResponse } from "@/types/user/user.dto";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  accessToken: string | null;
  user: UserDetailResponse | null;
  isInitialized: boolean;
}

type AuthActions = {
  setAccessToken: (token: string | null) => void;
  setUser: (user: UserDetailResponse | null) => void;
  clearAuth: () => void;

  hydrateFromStorage: () => void;
}

const AUTH_STORAGE = "auth-storage";

const sessionStorageWrapper = {
  getItem: (name: string) => {
    const value = sessionStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: any) => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    sessionStorage.removeItem(name);
  }
}

export const useAuthStore = create(
  persist<AuthState & AuthActions> (
    (set, get) => ({
      accessToken: null,
      user: null,
      isInitialized: false,

      setAccessToken: (token) => set({accessToken: token}),
      setUser: (user) => set({user}),
      clearAuth: () => set({accessToken: null, user: null}),

      hydrateFromStorage: () => {
        set({isInitialized: true});
      },
    }),
    {
      name: AUTH_STORAGE,
      storage: sessionStorageWrapper,
      onRehydrateStorage: () => () => {
        setTimeout(() => {
          useAuthStore.setState({isInitialized: true});
        }, 0)
      }
    }
  )
);