
import type { MeReponse } from "@/types/user/user.dto";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  accessToken: string | null;
  user: MeReponse | null;
  isInitialized: boolean;
}

type AuthActions = {
  setAccessToken: (token: string | null) => void;
  setUser: (user: MeReponse | null) => void;
  clearAuth: () => void;

  hydrateFromStorage: () => void;
}

const AUTH_STORAGE = "auth-storage";

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
      onRehydrateStorage: () => () => {
        setTimeout(() => {
          useAuthStore.setState({isInitialized: true});
        }, 0)
      }
    }
  )
);