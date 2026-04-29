// Types para o módulo de Pedidos Internos (Cozinha)

export enum KitchenOrderStatus {
  PENDING = 'pending',           // Recebido, aguardando confirmação
  CONFIRMED = 'confirmed',       // Confirmado, pode começar a preparar
  PREPARING = 'preparing',       // Preparando
  READY = 'ready',               // Pronto para retirada
  PICKED_UP = 'picked_up',       // Retirado pelo cliente
  CANCELLED = 'cancelled',       // Cancelado
}

export enum OrderType {
  COUNTER = 'counter',           // Balcão (retirada no local)
  DINE_IN = 'dine_in',           // Comer no local (mesa)
  DELIVERY = 'delivery',         // Entrega
}

export interface KitchenOrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  notes?: string;                // Acompanhamentos, observações
  preparationTime?: number;      // Tempo estimado em minutos
}

export interface KitchenOrder {
  id: string;
  orderNumber: string;           // Número sequencial (senha)
  establishmentId: string;
  
  // Tipo de pedido
  orderType: OrderType;
  
  // Cliente
  customerName?: string;
  customerPhone?: string;
  
  // Localização (se dine_in)
  tableNumber?: number;
  
  // Itens
  items: KitchenOrderItem[];
  
  // Valores
  subtotal: number;
  discount: number;
  total: number;
  
  // Status
  status: KitchenOrderStatus;
  
  // Tempos
  estimatedPrepTime: number;     // Tempo total estimado em minutos
  createdAt: string;
  updatedAt?: string;
  confirmedAt?: string;
  startedAt?: string;
  readyAt?: string;
  pickedUpAt?: string;
  
  // Notas gerais
  notes?: string;
  
  // Prioridade
  priority: 'low' | 'normal' | 'high';
  
  // Rastreamento
  history: KitchenOrderHistory[];
}

export interface KitchenOrderHistory {
  id: string;
  status: KitchenOrderStatus;
  description: string;
  timestamp: string;
  staffName?: string;
}

export interface CreateKitchenOrderDto {
  orderType: OrderType;
  customerName?: string;
  customerPhone?: string;
  tableNumber?: number;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    notes?: string;
    preparationTime?: number;
  }[];
  discount?: number;
  notes?: string;
  priority?: 'low' | 'normal' | 'high';
}

export interface UpdateKitchenOrderStatusDto {
  status: KitchenOrderStatus;
  description?: string;
  staffName?: string;
}

export interface KitchenOrdersFilters {
  status?: KitchenOrderStatus;
  orderType?: OrderType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
