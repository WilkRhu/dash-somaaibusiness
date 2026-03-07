import { create } from 'zustand';
import { Offer } from '@/lib/types/offers';

interface OffersStore {
  offers: Offer[];
  isLoading: boolean;
  error: string | null;
  
  setOffers: (offers: Offer[]) => void;
  addOffer: (offer: Offer) => void;
  updateOffer: (id: string, offer: Offer) => void;
  removeOffer: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useOffersStore = create<OffersStore>((set) => ({
  offers: [],
  isLoading: false,
  error: null,

  setOffers: (offers) => set({ offers }),
  
  addOffer: (offer) => set((state) => ({
    offers: [offer, ...state.offers],
  })),
  
  updateOffer: (id, offer) => set((state) => ({
    offers: state.offers.map((o) => (o.id === id ? offer : o)),
  })),
  
  removeOffer: (id) => set((state) => ({
    offers: state.offers.filter((o) => o.id !== id),
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
}));
