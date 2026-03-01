'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  establishmentId: string | null;
  setToken: (token: string) => void;
  setEstablishmentId: (id: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      establishmentId: null,

      setToken: (token: string) => {
        localStorage.setItem('token', token);
        set({ token });
      },

      setEstablishmentId: (id: string) => {
        set({ establishmentId: id });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, establishmentId: null });
      },

      isAuthenticated: () => {
        return !!get().token;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
