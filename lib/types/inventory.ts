export interface InventoryItem {
  id: string;
  establishmentId: string;
  barcode?: string | null;
  name: string;
  category?: string | null;
  brand?: string | null;
  costPrice: number;
  salePrice: number;
  quantity: number;
  minQuantity: number;
  unit: string;
  expirationDate?: string | null;
  image?: string | null;
  images?: string[];
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  type: 'entry' | 'sale' | 'adjustment' | 'loss' | 'return';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string | null;
  saleId?: string | null;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface AddProductDto {
  barcode?: string;
  name: string;
  category?: string;
  brand?: string;
  costPrice: number;
  salePrice: number;
  quantity: number;
  minQuantity: number;
  unit: string;
  expirationDate?: string;
  image?: string;
  images?: string[]; // Array de base64
  description?: string;
}

export interface UpdateStockDto {
  type: 'entry' | 'sale' | 'adjustment' | 'loss' | 'return';
  quantity: number;
  reason?: string;
}

export interface InventoryFilters {
  search?: string;
  category?: string;
  brand?: string;
  sortBy?: 'name' | 'quantity' | 'salePrice' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export type StockMovementType = 'entry' | 'sale' | 'adjustment' | 'loss' | 'return';

export const STOCK_MOVEMENT_LABELS: Record<StockMovementType, string> = {
  entry: 'Entrada',
  sale: 'Venda',
  adjustment: 'Ajuste',
  loss: 'Perda',
  return: 'Devolução',
};

export const UNIT_OPTIONS = [
  { value: 'un', label: 'Unidade' },
  { value: 'kg', label: 'Quilograma' },
  { value: 'g', label: 'Grama' },
  { value: 'l', label: 'Litro' },
  { value: 'ml', label: 'Mililitro' },
  { value: 'cx', label: 'Caixa' },
  { value: 'pct', label: 'Pacote' },
  { value: 'm', label: 'Metro' },
];
