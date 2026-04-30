import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api/auth';
import { SubscriptionPlan } from '@/lib/types/subscription';

// Helper para normalizar o plano do backend para o formato do frontend
function normalizePlan(planType?: string): SubscriptionPlan {
  if (!planType) return SubscriptionPlan.FREE;
  
  const normalized = planType.toUpperCase().replace('BUSINESS-', '');
  
  // Mapear valores do backend para o enum
  switch (normalized) {
    case 'FREE':
      return SubscriptionPlan.FREE;
    case 'TRIAL':
      return SubscriptionPlan.TRIAL;
    case 'BASIC':
      return SubscriptionPlan.BASIC;
    case 'PREMIUM':
      return SubscriptionPlan.PREMIUM;
    case 'ENTERPRISE':
      return SubscriptionPlan.ENTERPRISE;
    default:
      console.warn(`⚠️ Plano desconhecido: ${planType}, usando FREE como padrão`);
      return SubscriptionPlan.FREE;
  }
}

interface BusinessPlan {
  id: string;
  planType: string; // 'free', 'trial', 'basic', 'premium', 'enterprise'
  planExpiresAt: string | null;
  isOnTrial: boolean;
  trialEndsAt: string | null;
  scansUsed: number;
  scansResetAt: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  subscriptionPlan?: SubscriptionPlan;
  trialEndsAt?: string | null;
  trialDaysRemaining?: number;
  planType?: string; // Campo do backend (deprecated)
  planExpiresAt?: string;
  business_plan?: BusinessPlan; // Nova estrutura do backend
  establishments?: Array<{
    id: string;
    name: string;
    logo?: string;
    roles?: string[];
    role?: string;
    [key: string]: any;
  }>;
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
  updateUserPlan: (plan: SubscriptionPlan, trialEndsAt?: string, trialDaysRemaining?: number) => void;
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
          
          // Extrair planType do business_plan se disponível
          const user = response.user as any;
          const planType = user.business_plan?.planType || user.planType;
          const isOnTrial = user.business_plan?.isOnTrial || false;
          const trialEndsAt = user.business_plan?.trialEndsAt || user.trialEndsAt;
          
          console.log('📊 Plano extraído:', { planType, isOnTrial, trialEndsAt });
          
          // Normalizar o plano
          const normalizedUser = {
            ...response.user,
            subscriptionPlan: normalizePlan(planType),
            trialEndsAt,
            business_plan: user.business_plan,
          };
          
          console.log('✅ User normalizado:', normalizedUser);
          
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }
          console.log('💾 Token salvo no localStorage');
          
          set({
            user: normalizedUser,
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
          
          // Extrair planType do business_plan se disponível
          const user = response.user as any;
          const planType = user.business_plan?.planType || user.planType;
          const isOnTrial = user.business_plan?.isOnTrial || false;
          const trialEndsAt = user.business_plan?.trialEndsAt || user.trialEndsAt;
          
          // Normalizar o plano
          const normalizedUser = {
            ...response.user,
            subscriptionPlan: normalizePlan(planType),
            trialEndsAt,
            business_plan: user.business_plan,
          };
          
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }
          
          set({
            user: normalizedUser,
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
          const userData = await authApi.me();
          console.log('👤 Dados do usuário carregados:', userData);
          
          // Extrair planType do business_plan se disponível
          const planType = userData.business_plan?.planType || userData.planType;
          const isOnTrial = userData.business_plan?.isOnTrial || false;
          const trialEndsAt = userData.business_plan?.trialEndsAt || userData.trialEndsAt;
          
          // Normalizar o plano
          const normalizedUser = {
            ...userData,
            subscriptionPlan: normalizePlan(planType),
            trialEndsAt,
            business_plan: userData.business_plan,
          };
          
          console.log('✅ User normalizado no loadUser:', normalizedUser);
          
          set({
            user: normalizedUser,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('❌ Erro ao carregar usuário:', error);
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

      updateUserPlan: (plan, trialEndsAt, trialDaysRemaining) => {
        set((state) => ({
          user: state.user ? {
            ...state.user,
            subscriptionPlan: plan,
            planType: plan.toLowerCase(),
            trialEndsAt,
            trialDaysRemaining,
          } : null,
        }));
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

