import { useState } from 'react';
import { useOffersStore } from '@/lib/stores/offers-store';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { offersApi } from '@/lib/api/offers';
import { CreateOfferDto, UpdateOfferDto, OfferFilters, OfferAnalytics } from '@/lib/types/offers';

export function useOffers() {
  const { offers, isLoading, error, setOffers, addOffer, updateOffer, removeOffer, setLoading, setError } = useOffersStore();
  const { currentEstablishment } = useEstablishmentStore();
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [monthlyUsage, setMonthlyUsage] = useState<any>(null);

  const fetchOffers = async (filters?: OfferFilters) => {
    if (!currentEstablishment) return;
    
    console.log('📡 Buscando ofertas...', {
      establishmentId: currentEstablishment.id,
      filters
    });
    
    try {
      setLoading(true);
      setError(null);
      const response = await offersApi.list(currentEstablishment.id, filters);
      console.log('✅ Resposta recebida:', response);
      setOffers(response.data);
      setPagination({
        total: response.total || 0,
        page: response.page || 1,
        limit: response.limit || 20,
        totalPages: response.totalPages || 0,
      });
      
      // Buscar uso mensal
      await fetchMonthlyUsage();
    } catch (err: any) {
      console.error('❌ Erro ao buscar ofertas:', err);
      setError(err.response?.data?.message || 'Erro ao carregar ofertas');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyUsage = async () => {
    if (!currentEstablishment) return;
    
    try {
      const response = await offersApi.getMonthlyUsage(currentEstablishment.id);
      setMonthlyUsage(response.data);
    } catch (err: any) {
      console.error('❌ Erro ao buscar uso mensal:', err);
    }
  };

  const createOffer = async (dto: CreateOfferDto) => {
    if (!currentEstablishment) throw new Error('Nenhum estabelecimento selecionado');
    
    try {
      setLoading(true);
      const response = await offersApi.create(currentEstablishment.id, dto);
      addOffer(response.data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao criar oferta';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateOfferData = async (id: string, dto: UpdateOfferDto) => {
    if (!currentEstablishment) throw new Error('Nenhum estabelecimento selecionado');
    
    try {
      setLoading(true);
      const response = await offersApi.update(currentEstablishment.id, id, dto);
      updateOffer(id, response.data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao atualizar oferta';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteOffer = async (id: string) => {
    if (!currentEstablishment) throw new Error('Nenhum estabelecimento selecionado');
    
    try {
      setLoading(true);
      await offersApi.delete(currentEstablishment.id, id);
      removeOffer(id);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao deletar oferta';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const activateOffer = async (id: string) => {
    if (!currentEstablishment) throw new Error('Nenhum estabelecimento selecionado');
    
    try {
      setLoading(true);
      const response = await offersApi.activate(currentEstablishment.id, id);
      updateOffer(id, response.data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao ativar oferta';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deactivateOffer = async (id: string) => {
    if (!currentEstablishment) throw new Error('Nenhum estabelecimento selecionado');
    
    try {
      setLoading(true);
      const response = await offersApi.deactivate(currentEstablishment.id, id);
      updateOffer(id, response.data);
      return response.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao desativar oferta';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getAnalytics = async (id: string): Promise<OfferAnalytics | null> => {
    if (!currentEstablishment) return null;
    
    try {
      const response = await offersApi.getAnalytics(currentEstablishment.id, id);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar analytics');
      return null;
    }
  };

  return {
    offers,
    isLoading,
    error,
    pagination,
    monthlyUsage,
    fetchOffers,
    fetchMonthlyUsage,
    createOffer,
    updateOffer: updateOfferData,
    deleteOffer,
    activateOffer,
    deactivateOffer,
    getAnalytics,
  };
}
