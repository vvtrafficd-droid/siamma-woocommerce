"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  email?: string;
  customerId?: number;
  customer?: any;
  login: (data: { email: string; customerId?: number; customer?: any }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      email: undefined,
      customerId: undefined,
      customer: undefined,
      login: ({ email, customerId, customer }) =>
        set({ email, customerId, customer }),
      logout: () => set({ email: undefined, customerId: undefined, customer: undefined }),
    }),
    { name: "auth-storage", skipHydration: false }
  )
);