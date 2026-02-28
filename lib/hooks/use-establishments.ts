import { useEffect } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { establishmentsApi } from '@/lib/api/establishments';

export function useEstablishments() {
  const { establishments, currentEstablishment, setEstablishments, setCurrentEstablishment } = useEstablishmentStore();

  const fetchEstablishments = async () => {
    try {
      const data = await establishmentsApi.list();
      console.log('📍 Estabelecimentos carregados:', data);
      setEstablishments(data);
      
      // Set first establishment as current if none selected
      if (!currentEstablishment && data.length > 0) {
        const savedId = localStorage.getItem('currentEstablishmentId');
        const establishment = savedId 
          ? data.find(e => e.id === savedId) || data[0]
          : data[0];
        console.log('📍 Estabelecimento selecionado:', establishment);
        console.log('📍 Role do usuário:', establishment.role);
        setCurrentEstablishment(establishment);
      }
    } catch (err) {
      console.error('Erro ao carregar estabelecimentos:', err);
    }
  };

  useEffect(() => {
    fetchEstablishments();
  }, []);

  return {
    establishments,
    currentEstablishment,
    setCurrentEstablishment,
    refetch: fetchEstablishments,
  };
}
