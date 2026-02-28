export interface InventoryItem {
  id: string;
  establishmentId: string;
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
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  type: 'entry' | 'sale' | 'adjustment' | 'loss' | 'return';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
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
  unit?: string;
  expirationDate?: string;
  image?: string;
  description?: string;
}
