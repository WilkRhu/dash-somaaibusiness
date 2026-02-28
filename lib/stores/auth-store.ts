import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  setUser: (user: User, token: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          console.log('🔐 Iniciando login...');
          const response = await authApi.login({ email, password });
          console.log('✅ Response do authApi.login:', response);
          console.log('🔑 Token recebido:', response.token);
          console.log('👤 User recebido:', response.user);
          
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          console.log('💾 Token salvo no localStorage');
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          console.log('✅ State atualizado no Zustand');
        } catch (error) {
          console.error('❌ Erro no login:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name, email, password, phone) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register({ 
            name, 
            email, 
            password, 
            phone,
            userType: 'business' 
          });
          
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        authApi.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      loadUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        try {
          const user = await authApi.me();
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          authApi.logout();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      setUser: (user, token) => {
        localStorage.setItem('token', token);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

