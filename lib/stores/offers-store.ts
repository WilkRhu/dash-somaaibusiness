import { create } from 'zustand';

interface Offer {
  id: string;
  establishmentId: string;
  title: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  inventoryItemIds?: string[];
  createdAt: string;
}

interface OffersStore {
  offers: Offer[];
  selectedOffer: Offer | null;
  isLoading: boolean;
  error: string | null;
  
  setOffers: (offers: Offer[]) => void;
  addOffer: (offer: Offer) => void;
  updateOffer: (id: string, updates: Partial<Offer>) => void;
  removeOffer: (id: string) => void;
  setSelectedOffer: (offer: Offer | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useOffersStore = create<OffersStore>((set) => ({
  offers: [],
  selectedOffer: null,
  isLoading: false,
  error: null,
  
  setOffers: (offers) => set({ offers }),
  
  addOffer: (offer) => set((state) => ({
    offers: [...state.offers, offer]
  })),
  
  updateOffer: (id, updates) => set((state) => ({
    offers: state.offers.map((offer) =>
      offer.id === id ? { ...offer, ...updates } : offer
    )
  })),
  
  removeOffer: (id) => set((state) => ({
    offers: state.offers.filter((offer) => offer.id !== id)
  })),
  
  setSelectedOffer: (offer) => set({ selectedOffer: offer }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
}));
