import { useState, useEffect } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { offersApi } from '@/lib/api/offers';
import { ActiveOfferCheck } from '@/lib/types/offers';

export function useActiveOffer(itemId: string | null) {
  const { currentEstablishment } = useEstablishmentStore();
  const [offerCheck, setOfferCheck] = useState<ActiveOfferCheck | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!itemId || !currentEstablishment) {
      setOfferCheck(null);
      return;
    }

    const checkOffer = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await offersApi.checkActiveOffer(currentEstablishment.id, itemId);
        setOfferCheck(result);
      } catch (err: any) {
        console.error('Erro ao verificar oferta:', err);
        setError(err.response?.data?.message || 'Erro ao verificar oferta');
        setOfferCheck({ hasOffer: false, offer: null });
      } finally {
        setIsLoading(false);
      }
    };

    checkOffer();
  }, [itemId, currentEstablishment?.id]);

  return {
    hasOffer: offerCheck?.hasOffer || false,
    offer: offerCheck?.offer,
    isLoading,
    error,
  };
}
