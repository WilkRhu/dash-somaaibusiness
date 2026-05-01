import apiClient from './client';
import { Offer, CreateOfferDto, UpdateOfferDto, OfferFilters, OfferAnalytics } from '@/lib/types/offers';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export const offersApi = {
  list: async (establishmentId: string, filters?: OfferFilters): Promise<ApiResponse<Offer[]>> => {
    const response = await apiClient.get<Offer[] | ApiResponse<Offer[]>>(
      `/business/establishments/${establishmentId}/offers`,
      { params: filters }
    );
    
    // Se a resposta for um array direto, retorna no formato esperado
    if (Array.isArray(response.data)) {
      return {
        success: true,
        data: response.data,
        total: response.data.length,
        page: 1,
        limit: response.data.length,
        totalPages: 1,
      };
    }
    
    return response.data as ApiResponse<Offer[]>;
  },

  getById: async (establishmentId: string, id: string) => {
    const response = await apiClient.get<ApiResponse<Offer>>(
      `/business/establishments/${establishmentId}/offers/${id}`
    );
    return response.data;
  },

  create: async (establishmentId: string, dto: CreateOfferDto) => {
    const response = await apiClient.post<ApiResponse<Offer>>(
      `/business/establishments/${establishmentId}/offers`,
      dto
    );
    return response.data;
  },

  update: async (establishmentId: string, id: string, dto: UpdateOfferDto) => {
    const response = await apiClient.patch<ApiResponse<Offer>>(
      `/business/establishments/${establishmentId}/offers/${id}`,
      dto
    );
    return response.data;
  },

  delete: async (establishmentId: string, id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/business/establishments/${establishmentId}/offers/${id}`
    );
    return response.data;
  },

  activate: async (establishmentId: string, id: string) => {
    const response = await apiClient.post<ApiResponse<Offer>>(
      `/business/establishments/${establishmentId}/offers/${id}/activate`
    );
    return response.data;
  },

  deactivate: async (establishmentId: string, id: string) => {
    const response = await apiClient.post<ApiResponse<Offer>>(
      `/business/establishments/${establishmentId}/offers/${id}/deactivate`
    );
    return response.data;
  },

  getAnalytics: async (establishmentId: string, id: string) => {
    const response = await apiClient.get<ApiResponse<OfferAnalytics>>(
      `/business/establishments/${establishmentId}/offers/${id}/analytics`
    );
    return response.data;
  },

  checkActiveOffer: async (establishmentId: string, itemId: string) => {
    try {
      const response = await apiClient.get<{
        hasOffer: boolean;
        offer: {
          id: string;
          title: string;
          originalPrice: number;
          offerPrice: number;
          discountPercentage: number;
          endDate?: string;
          whileStockLasts: boolean;
        } | null;
      }>(
        `/business/establishments/${establishmentId}/offers/active-offer/${itemId}`
      );
      
      return response.data;
    } catch (error: any) {
      // Fallback: buscar todas as ofertas ativas e filtrar
      try {
        const allOffersResponse = await apiClient.get<Offer[] | ApiResponse<Offer[]>>(
          `/business/establishments/${establishmentId}/offers`,
          { params: { isActive: true } }
        );
        
        const offers = Array.isArray(allOffersResponse.data) 
          ? allOffersResponse.data 
          : (allOffersResponse.data as ApiResponse<Offer[]>).data;
        
        const matchingOffer = offers.find(offer => offer.itemId === itemId);
        
        if (matchingOffer) {
          return {
            hasOffer: true,
            offer: {
              id: matchingOffer.id,
              title: matchingOffer.title,
              originalPrice: matchingOffer.originalPrice,
              offerPrice: matchingOffer.offerPrice,
              discountPercentage: matchingOffer.discountPercentage,
              endDate: matchingOffer.endDate,
              whileStockLasts: matchingOffer.whileStockLasts || false,
            }
          };
        }
        
        return { hasOffer: false, offer: null };
      } catch (fallbackError: any) {
        return { hasOffer: false, offer: null };
      }
    }
  },

  getMonthlyUsage: async (establishmentId: string) => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/business/establishments/${establishmentId}/offers/usage/monthly`
    );
    return response.data;
  },
};
