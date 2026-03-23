// Types para o módulo de Delivery

export enum DeliveryStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_DELIVERY = 'ready_for_delivery',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export enum PaymentMethod {
  CASH = 'cash',
  DEBIT_CARD = 'debit_card',
  CREDIT_CARD = 'credit_card',
  PIX = 'pix',
  BANK_TRANSFER = 'bank_transfer',
}

export interface DeliveryZone {
  id: string;
  name: string;
  neighborhoods: string[];
  deliveryFee: number;
  freeDeliveryMinimum: number | null;
  estimatedTime: number;
  radiusKm?: number;
  centerLatitude?: number;
  centerLongitude?: number;
}

export interface DeliveryOrder {
  id: string;
  orderNumber: string;
  establishmentId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  
  deliveryAddress: string;
  deliveryNeighborhood: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  deliveryComplement?: string;
  deliveryReference?: string;
  
  latitude?: number;
  longitude?: number;
  
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  
  status: DeliveryStatus;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  
  estimatedDeliveryTime: number;
  scheduledFor?: string;
  
  notes?: string;
  
  confirmedAt?: string;
  preparingAt?: string;
  readyAt?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  
  createdAt: string;
  updatedAt: string;
  
  driver?: {
    id: string;
    name: string;
    phone: string;
    vehicleType: string;
  };

  sale?: {
    items?: Array<{
      productName?: string;
      name?: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }>;
  };

  tracking?: DeliveryTracking[];
}

export interface DeliveryTracking {
  id: string;
  status: string;
  description: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

export interface CreateDeliveryOrderDto {
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryNeighborhood: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  deliveryComplement?: string;
  deliveryReference?: string;
  latitude?: number;
  longitude?: number;
  items: {
    itemId?: string;
    productName?: string;
    unitPrice: number;
    quantity: number;
    discount?: number;
    applyOffer?: boolean;
  }[];
  paymentMethod: PaymentMethod;
  discount?: number;
  notes?: string;
  scheduledFor?: string;
}
