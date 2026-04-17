
import type { UserDetailResponse } from "@/types/user/user.dto";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  accessToken: string | null;
  user: UserDetailResponse | null;
  isInitialized: boolean;
  showAlert: boolean;
}

type AuthActions = {
  setAccessToken: (token: string | null) => void;
  setUser: (user: UserDetailResponse | null) => void;
  clearAuth: () => void;

  setShowAlert: (value: boolean) => void;
  hydrateFromStorage: () => void;
}

const AUTH_STORAGE = "auth-storage";

export const useAuthStore = create(
  persist<AuthState & AuthActions> (
    (set, get) => ({
      accessToken: null,
      user: null,
      isInitialized: false,
      showAlert: false,

      setAccessToken: (token) => set({accessToken: token}),
      setUser: (user) => set({user}),
      clearAuth: () => set({accessToken: null, user: null}),

      setShowAlert: (value) => set({showAlert: value}),
      hydrateFromStorage: () => {
        set({isInitialized: true});
      },
    }),
    {
      name: AUTH_STORAGE,

      onRehydrateStorage: () => () => {
        setTimeout(() => {
          useAuthStore.setState({isInitialized: true});
        }, 0)
      }
    }
  )
);