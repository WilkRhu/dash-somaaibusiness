import { useEffect, useRef } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { useEstablishments } from './use-establishments';

export function useEstablishmentInit() {
  const { currentEstablishment, setCurrentEstablishment } = useEstablishmentStore();
  const { establishments } = useEstablishments();
  const initializationAttempted = useRef(false);

  useEffect(() => {
    // Se já tem um estabelecimento atual, não faz nada
    if (currentEstablishment) {
      initializationAttempted.current = true;
      return;
    }

    // Se não tem estabelecimentos, não faz nada
    if (establishments.length === 0) return;

    // Evita múltiplas tentativas de inicialização
    if (initializationAttempted.current) return;
    initializationAttempted.current = true;

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
    if (establishments.length > 0) {
      setCurrentEstablishment(establishments[0]);
    }
  }, [establishments, currentEstablishment, setCurrentEstablishment]);

  return { currentEstablishment, establishments };
}
