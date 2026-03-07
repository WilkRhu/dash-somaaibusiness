// Tipos para o módulo de fornecedores

export interface Supplier {
  id: string;
  name: string;
  cpf?: string;
  cnpj?: string;
  email: string;
  phone: string;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  notes?: string;
  rating: number;
  isActive: boolean;
  image?: string;
  createdAt: string;
}

export interface CreateSupplierDto {
  name: string;
  cpf?: string;
  cnpj?: string;
  email: string;
  phone: string;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  notes?: string;
  rating?: number;
  image?: string;
}

export interface UpdateSupplierDto {
  name?: string;
  cpf?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  notes?: string;
  rating?: number;
  isActive?: boolean;
  image?: string;
}

export interface PurchaseOrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  items: PurchaseOrderItem[];
  total: number;
  status: 'pending' | 'approved' | 'delivered' | 'cancelled';
  expectedDeliveryDate: string;
  deliveredDate?: string;
  notes?: string;
  createdAt: string;
  supplier?: {
    id: string;
    name: string;
    phone?: string;
  };
  createdBy?: {
    id: string;
    name: string;
  };
}

export interface CreatePurchaseOrderDto {
  supplierId: string;
  items: PurchaseOrderItem[];
  expectedDeliveryDate: string;
  notes?: string;
}

export interface UpdatePurchaseOrderStatusDto {
  status: 'pending' | 'approved' | 'delivered' | 'cancelled';
  deliveredDate?: string;
  notes?: string;
}

export interface SupplierWithOrders extends Supplier {
  purchaseOrders?: PurchaseOrder[];
}
