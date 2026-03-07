export interface Offer {
  id: string;
  establishmentId: string;
  itemId: string;
  title: string;
  description?: string;
  originalPrice: number;
  offerPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate?: string;
  durationHours?: number;
  whileStockLasts?: boolean;
  radiusKm?: number;
  isActive: boolean;
  viewCount: number;
  saveCount: number;
  conversionCount: number;
  createdAt: string;
  updatedAt: string;
  
  // Dados do item relacionado (populated)
  item?: {
    id: string;
    name: string;
    images?: string[];
    category?: string;
    quantity?: number;
  };
}

export interface CreateOfferDto {
  itemId: string;
  title: string;
  description?: string;
  offerPrice: number;
  startDate: string;
  endDate?: string;
  durationHours?: number;
  whileStockLasts?: boolean;
  radiusKm?: number;
}

export interface UpdateOfferDto {
  title?: string;
  description?: string;
  offerPrice?: number;
  startDate?: string;
  endDate?: string;
  durationHours?: number;
  whileStockLasts?: boolean;
  radiusKm?: number;
}

export interface OfferFilters {
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface OfferAnalytics {
  offerId: string;
  title: string;
  viewCount: number;
  saveCount: number;
  conversionCount: number;
  conversionRate: number;
  saveRate: number;
  totalRevenue: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface ActiveOfferCheck {
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
}
