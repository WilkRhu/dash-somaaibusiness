'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';

/**
 * Hook que inicializa os establishments a partir dos dados do login
 * Isso garante que os dados dos establishments estejam disponíveis imediatamente após o login
 */
export function useAuthEstablishmentInit() {
  const { user } = useAuthStore();
  const { establishments, setEstablishments, setCurrentEstablishment } = useEstablishmentStore();

  useEffect(() => {
    if (!user || !user.establishments || user.establishments.length === 0) {
      return;
    }

    // Se já tem establishments no store, não faz nada
    if (establishments.length > 0) {
      return;
    }

    // Normalizar os dados dos establishments
    const normalizedEstablishments = user.establishments.map((est: any) => ({
      id: est.id,
      name: est.name,
      logo: est.logo,
      roles: est.roles || [],
      role: est.role || (est.roles && est.roles[0]) || undefined,
      ...est,
    }));

    // Salvar os establishments no store
    setEstablishments(normalizedEstablishments);

    // Tentar recuperar o último estabelecimento usado
    const savedEstablishmentId = localStorage.getItem('currentEstablishmentId');
    
    if (savedEstablishmentId) {
      const savedEstablishment = normalizedEstablishments.find((e: any) => e.id === savedEstablishmentId);
      if (savedEstablishment) {
        setCurrentEstablishment(savedEstablishment);
        return;
      }
    }

    setCurrentEstablishment(normalizedEstablishments[0]);
  }, [user, establishments, setEstablishments, setCurrentEstablishment]);
}
