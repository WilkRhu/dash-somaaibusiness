import { useEffect } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { establishmentsApi } from '@/lib/api/establishments';

export function useEstablishments() {
  const { establishments, currentEstablishment, setEstablishments, setCurrentEstablishment } = useEstablishmentStore();

  const fetchEstablishments = async () => {
    try {
      const data = await establishmentsApi.list();
      
      // Mapear 'roles' (array) para 'role' (string) se necessário
      // Preservar os roles que já existem no currentEstablishment (vindos do login)
      const normalizedData = data.map(est => {
        // Se já temos esse estabelecimento no store com roles, preservar os roles
        const existingEst = establishments.find(e => e.id === est.id) || 
          (currentEstablishment?.id === est.id ? currentEstablishment : null);
        
        const roles = existingEst?.roles?.length ? existingEst.roles : (est.roles || []);
        const role = existingEst?.role || est.role || (roles && roles[0]) || undefined;
        
        return {
          ...est,
          roles,
          role,
        };
      });
      
      setEstablishments(normalizedData);
      
      // Set first establishment as current if none selected
      if (!currentEstablishment && normalizedData.length > 0) {
        const savedId = localStorage.getItem('currentEstablishmentId');
        const establishment = savedId 
          ? normalizedData.find(e => e.id === savedId) || normalizedData[0]
          : normalizedData[0];
        setCurrentEstablishment(establishment);
      } else if (currentEstablishment) {
        // Atualizar o currentEstablishment preservando os roles
        const updatedCurrent = normalizedData.find(e => e.id === currentEstablishment.id);
        if (updatedCurrent) {
          setCurrentEstablishment(updatedCurrent);
        }
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
