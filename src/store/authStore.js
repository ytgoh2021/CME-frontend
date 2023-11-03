import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      email: null,
      setToken: (data) => {
        set((state) => ({
          token: data["bearer_token"],
          email: data["email"],
        }));
      },
      clearStore: () => {
        set(() => ({
          token: null,
          email: null,
        }));
      },
    }),
    {
      name: "authStore",
      getStorage: () => localStorage, // specify localStorage as the storage backend
    }
  )
);
