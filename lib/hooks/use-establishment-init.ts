import { useEffect } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { useEstablishments } from './use-establishments';

export function useEstablishmentInit() {
  const { currentEstablishment, setCurrentEstablishment } = useEstablishmentStore();
  const { establishments } = useEstablishments();

  useEffect(() => {
    // Se já tem um estabelecimento atual, não faz nada
    if (currentEstablishment) return;

    // Se não tem estabelecimentos, não faz nada
    if (establishments.length === 0) return;

    // Tenta recuperar o último estabelecimento usado do localStorage
    const savedEstablishmentId = localStorage.getItem('currentEstablishmentId');
    
    if (savedEstablishmentId) {
      const savedEstablishment = establishments.find(e => e.id === savedEstablishmentId);
      if (savedEstablishment) {
        setCurrentEstablishment(savedEstablishment);
        return;
      }
    }

    // Se não encontrou, usa o primeiro estabelecimento
    setCurrentEstablishment(establishments[0]);
  }, [currentEstablishment, establishments, setCurrentEstablishment]);

  return { currentEstablishment, establishments };
}
