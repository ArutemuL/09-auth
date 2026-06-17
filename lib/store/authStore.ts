//lib>stote>useAuthStore.ts
import { create, type StoreApi } from "zustand";
import type { User } from "@/types/user";

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearIsAuthenticated: () => void;
};

type SetState = StoreApi<AuthState>["setState"];

export const useAuthStore = create<AuthState>()((set: SetState) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user: User | null) =>
    set({
      user,
      isAuthenticated: Boolean(user),
    }),
  clearIsAuthenticated: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
