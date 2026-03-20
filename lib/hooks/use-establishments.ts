import { useEffect, useRef } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { Establishment } from '@/lib/types/establishment';
import { getApiBaseUrl } from '@/lib/config/api';

export function useEstablishments() {
  const { establishments, currentEstablishment, setEstablishments, setCurrentEstablishment } = useEstablishmentStore();
  const fetchAttempted = useRef(false);

  const fetchEstablishments = async () => {
    try {
      // Chamar diretamente o microserviço
      const apiBaseUrl = getApiBaseUrl();
      const token = localStorage.getItem('token');
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${apiBaseUrl}/business/establishments/all`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const data: Establishment[] = result.data || result;

      if (Array.isArray(data)) {
        setEstablishments(data);

        if (!currentEstablishment && data.length > 0) {
          const savedId = localStorage.getItem('currentEstablishmentId');
          const establishment = savedId
            ? data.find(e => e.id === savedId) || data[0]
            : data[0];
          setCurrentEstablishment(establishment);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar estabelecimentos:', err);
    }
  };

  useEffect(() => {
    // Evita múltiplas chamadas à API
    if (fetchAttempted.current) return;
    fetchAttempted.current = true;

    fetchEstablishments();
  }, []);

  return {
    establishments,
    currentEstablishment,
    setCurrentEstablishment,
    refetch: fetchEstablishments,
  };
}
