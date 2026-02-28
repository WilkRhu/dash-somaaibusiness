import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
