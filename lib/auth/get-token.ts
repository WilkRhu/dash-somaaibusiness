import { useAuthStore } from '@/lib/stores/auth-store';

export async function getAuthToken(): Promise<string | null> {
  try {
    // Se estiver no cliente, usar o store
    if (typeof window !== 'undefined') {
      const store = useAuthStore.getState();
      return store.token || null;
    }
    
    // Se estiver no servidor, retornar null (será tratado no middleware)
    return null;
  } catch (error) {
    console.error('Erro ao obter token:', error);
    return null;
  }
}
