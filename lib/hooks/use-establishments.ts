import { useEffect } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { establishmentsApi } from '@/lib/api/establishments';

export function useEstablishments() {
  const { establishments, currentEstablishment, setEstablishments, setCurrentEstablishment } = useEstablishmentStore();

  const fetchEstablishments = async () => {
    try {
      const data = await establishmentsApi.list();
      
      // Mapear 'roles' (array) para 'role' (string) se necessário
      const normalizedData = data.map(est => ({
        ...est,
        role: est.role || (est.roles && est.roles[0]) || undefined,
      }));
      
      setEstablishments(normalizedData);
      
      // Set first establishment as current if none selected
      if (!currentEstablishment && normalizedData.length > 0) {
        const savedId = localStorage.getItem('currentEstablishmentId');
        const establishment = savedId 
          ? normalizedData.find(e => e.id === savedId) || normalizedData[0]
          : normalizedData[0];
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
