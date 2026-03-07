# SomaAI Business - Guia de Frontend (Next.js)

## 🎯 Stack Recomendado

```json
{
  "framework": "Next.js 14+ (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS + shadcn/ui",
  "state": "Zustand",
  "forms": "React Hook Form + Zod",
  "api": "Axios + React Query",
  "auth": "NextAuth.js",
  "charts": "Recharts",
  "tables": "TanStack Table",
  "scanner": "react-qr-barcode-scanner"
}
```

## 📁 Estrutura do Projeto

```
somaai-business-web/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard principal
│   │   ├── establishments/
│   │   │   ├── page.tsx                # Lista estabelecimentos
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx            # Detalhes
│   │   │   │   ├── settings/          # Configurações
│   │   │   │   └── members/           # Gerenciar membros
│   │   │   └── new/                    # Criar estabelecimento
│   │   ├── inventory/
│   │   │   ├── page.tsx                # Lista produtos
│   │   │   ├── [id]/                   # Detalhes produto
│   │   │   ├── new/                    # Adicionar produto
│   │   │   └── alerts/                 # Alertas estoque
│   │   ├── sales/
│   │   │   ├── page.tsx                # Histórico vendas
│   │   │   ├── [id]/                   # Detalhes venda
│   │   │   └── pos/                    # PDV (Ponto de Venda)
│   │   ├── offers/
│   │   │   ├── page.tsx                # Lista ofertas
│   │   │   ├── [id]/                   # Detalhes oferta
│   │   │   └── new/                    # Criar oferta
│   │   ├── customers/
│   │   │   ├── page.tsx                # Lista clientes
│   │   │   ├── [id]/                   # Detalhes cliente
│   │   │   └── loyalty/                # Programa fidelidade
│   │   ├── suppliers/
│   │   │   ├── page.tsx                # Lista fornecedores
│   │   │   ├── [id]/                   # Detalhes fornecedor
│   │   │   └── orders/                 # Pedidos de compra
│   │   ├── reports/
│   │   │   ├── sales/                  # Relatório vendas
│   │   │   ├── inventory/              # Relatório estoque
│   │   │   ├── financial/              # Relatório financeiro
│   │   │   └── customers/              # Relatório clientes
│   │   └── subscription/
│   │       ├── page.tsx                # Plano atual
│   │       └── upgrade/                # Upgrade plano
│   └── api/
│       └── auth/
├── components/
│   ├── ui/                             # shadcn/ui components
│   ├── dashboard/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── stats-card.tsx
│   ├── inventory/
│   │   ├── product-card.tsx
│   │   ├── barcode-scanner.tsx
│   │   └── stock-alert.tsx
│   ├── sales/
│   │   ├── pos-interface.tsx
│   │   ├── cart.tsx
│   │   └── payment-modal.tsx
│   ├── offers/
│   │   ├── offer-card.tsx
│   │   └── offer-form.tsx
│   └── reports/
│       ├── sales-chart.tsx
│       └── export-button.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts                   # Axios instance
│   │   ├── establishments.ts
│   │   ├── inventory.ts
│   │   ├── sales.ts
│   │   ├── offers.ts
│   │   ├── customers.ts
│   │   ├── suppliers.ts
│   │   └── subscriptions.ts
│   ├── hooks/
│   │   ├── use-establishment.ts
│   │   ├── use-inventory.ts
│   │   ├── use-sales.ts
│   │   └── use-subscription.ts
│   ├── stores/
│   │   ├── auth-store.ts
│   │   ├── establishment-store.ts
│   │   └── cart-store.ts
│   ├── utils/
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── permissions.ts
│   └── types/
│       ├── establishment.ts
│       ├── inventory.ts
│       ├── sale.ts
│       └── subscription.ts
├── public/
└── package.json
```

## 🚀 Setup Inicial

### 1. Criar Projeto

```bash
npx create-next-app@latest somaai-business-web --typescript --tailwind --app
cd somaai-business-web
```

### 2. Instalar Dependências

```bash
# UI Components
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label select table dialog dropdown-menu

# State Management
npm install zustand

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# API & Data Fetching
npm install axios @tanstack/react-query

# Auth
npm install next-auth

# Charts
npm install recharts

# Tables
npm install @tanstack/react-table

# Scanner
npm install react-qr-barcode-scanner

# Utils
npm install date-fns clsx tailwind-merge
```

## 📝 Configuração Base

### `lib/api/client.ts`

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirecionar para login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### `lib/types/establishment.ts`

```typescript
export enum BusinessRole {
  OWNER = 'business_owner',
  ADMIN = 'business_admin',
  SALES = 'business_sales',
  STOCK = 'business_stock',
  MARKETING = 'business_marketing',
}

export interface Establishment {
  id: string;
  name: string;
  cnpj: string;
  type: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  logo?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EstablishmentMember {
  id: string;
  userId: string;
  role: BusinessRole;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateEstablishmentDto {
  name: string;
  cnpj: string;
  type: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}
```

### `lib/types/inventory.ts`

```typescript
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
```

### `lib/types/sale.ts`

```typescript
export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  BANK_TRANSFER = 'bank_transfer',
}

export enum SaleStatus {
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

export interface Sale {
  id: string;
  establishmentId: string;
  saleNumber: string;
  customerId?: string;
  sellerId: string;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  notes?: string;
  items: SaleItem[];
  createdAt: string;
}

export interface SaleItem {
  id: string;
  inventoryItemId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CreateSaleDto {
  customerId?: string;
  items: {
    inventoryItemId: string;
    quantity: number;
  }[];
  discount?: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}
```

### `lib/types/subscription.ts`

```typescript
export enum BusinessPlanType {
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  TRIAL = 'trial',
}

export interface BusinessSubscription {
  id: string;
  establishmentId: string;
  planType: BusinessPlanType;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  productsUsed: number;
  usersUsed: number;
  offersUsed: number;
}

export interface PlanLimits {
  maxProducts: number; // 0 = unlimited
  maxUsers: number;
  maxOffers: number;
  maxStores: number;
  hasAdvancedReports: boolean;
  hasLoyaltyProgram: boolean;
  hasApiAccess: boolean;
  hasPrioritySupport: boolean;
}
```

## 🔌 API Services

### `lib/api/establishments.ts`

```typescript
import apiClient from './client';
import { Establishment, CreateEstablishmentDto } from '@/lib/types/establishment';

export const establishmentsApi = {
  // Listar estabelecimentos do usuário
  list: async () => {
    const { data } = await apiClient.get<Establishment[]>('/business/establishments');
    return data;
  },

  // Buscar por ID
  getById: async (id: string) => {
    const { data } = await apiClient.get<Establishment>(`/business/establishments/${id}`);
    return data;
  },

  // Criar estabelecimento
  create: async (dto: CreateEstablishmentDto) => {
    const { data } = await apiClient.post<Establishment>('/business/establishments', dto);
    return data;
  },

  // Atualizar estabelecimento
  update: async (id: string, dto: Partial<CreateEstablishmentDto>) => {
    const { data } = await apiClient.patch<Establishment>(`/business/establishments/${id}`, dto);
    return data;
  },

  // Deletar estabelecimento
  delete: async (id: string) => {
    await apiClient.delete(`/business/establishments/${id}`);
  },

  // Gerenciar membros
  addMember: async (establishmentId: string, userId: string, role: string) => {
    const { data } = await apiClient.post(`/business/establishments/${establishmentId}/members`, {
      userId,
      role,
    });
    return data;
  },

  removeMember: async (establishmentId: string, userId: string) => {
    await apiClient.delete(`/business/establishments/${establishmentId}/members/${userId}`);
  },

  updateMemberRole: async (establishmentId: string, userId: string, role: string) => {
    const { data } = await apiClient.patch(
      `/business/establishments/${establishmentId}/members/${userId}/role`,
      { role }
    );
    return data;
  },
};
```

### `lib/api/inventory.ts`

```typescript
import apiClient from './client';
import { InventoryItem, AddProductDto, StockMovement } from '@/lib/types/inventory';

export const inventoryApi = {
  // Listar produtos
  list: async (establishmentId: string, filters?: any) => {
    const { data } = await apiClient.get<InventoryItem[]>('/business/inventory', {
      params: { establishmentId, ...filters },
    });
    return data;
  },

  // Buscar por ID
  getById: async (id: string) => {
    const { data } = await apiClient.get<InventoryItem>(`/business/inventory/${id}`);
    return data;
  },

  // Adicionar produto
  add: async (dto: AddProductDto) => {
    const { data } = await apiClient.post<InventoryItem>('/business/inventory', dto);
    return data;
  },

  // Atualizar produto
  update: async (id: string, dto: Partial<AddProductDto>) => {
    const { data } = await apiClient.patch<InventoryItem>(`/business/inventory/${id}`, dto);
    return data;
  },

  // Atualizar estoque
  updateStock: async (id: string, quantity: number, type: string, reason?: string) => {
    const { data } = await apiClient.post(`/business/inventory/${id}/stock`, {
      quantity,
      type,
      reason,
    });
    return data;
  },

  // Alertas de estoque baixo
  getLowStock: async (establishmentId: string) => {
    const { data } = await apiClient.get<InventoryItem[]>('/business/inventory/alerts/low-stock', {
      params: { establishmentId },
    });
    return data;
  },

  // Produtos próximos ao vencimento
  getExpiring: async (establishmentId: string, days: number = 7) => {
    const { data } = await apiClient.get<InventoryItem[]>('/business/inventory/alerts/expiring', {
      params: { establishmentId, days },
    });
    return data;
  },

  // Histórico de movimentações
  getHistory: async (id: string) => {
    const { data } = await apiClient.get<StockMovement[]>(`/business/inventory/${id}/history`);
    return data;
  },
};
```

### `lib/api/sales.ts`

```typescript
import apiClient from './client';
import { Sale, CreateSaleDto } from '@/lib/types/sale';

export const salesApi = {
  // Listar vendas
  list: async (establishmentId: string, filters?: any) => {
    const { data } = await apiClient.get<Sale[]>('/business/sales', {
      params: { establishmentId, ...filters },
    });
    return data;
  },

  // Buscar por ID
  getById: async (id: string) => {
    const { data } = await apiClient.get<Sale>(`/business/sales/${id}`);
    return data;
  },

  // Criar venda
  create: async (dto: CreateSaleDto) => {
    const { data } = await apiClient.post<Sale>('/business/sales', dto);
    return data;
  },

  // Cancelar venda
  cancel: async (id: string) => {
    const { data } = await apiClient.post(`/business/sales/${id}/cancel`);
    return data;
  },

  // Estatísticas
  getStats: async (establishmentId: string, startDate: string, endDate: string) => {
    const { data } = await apiClient.get('/business/sales/stats', {
      params: { establishmentId, startDate, endDate },
    });
    return data;
  },

  // Resumo diário
  getDailySummary: async (establishmentId: string, date: string) => {
    const { data } = await apiClient.get('/business/sales/daily-summary', {
      params: { establishmentId, date },
    });
    return data;
  },

  // Produtos mais vendidos
  getTopProducts: async (establishmentId: string, limit: number = 10) => {
    const { data } = await apiClient.get('/business/sales/top-products', {
      params: { establishmentId, limit },
    });
    return data;
  },
};
```

## 🎨 Componentes Principais

### `components/sales/pos-interface.tsx` (PDV)

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { BarcodeScanner } from './barcode-scanner';
import { useCartStore } from '@/lib/stores/cart-store';

export function POSInterface() {
  const [barcode, setBarcode] = useState('');
  const { items, addItem, removeItem, clear, total } = useCartStore();

  const handleScan = async (code: string) => {
    // Buscar produto pelo código de barras
    // Adicionar ao carrinho
  };

  const handleCheckout = async () => {
    // Processar venda
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-screen p-4">
      {/* Lado esquerdo - Scanner e busca */}
      <div className="space-y-4">
        <BarcodeScanner onScan={handleScan} />
        <Input
          placeholder="Digite o código de barras"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />
      </div>

      {/* Lado direito - Carrinho */}
      <Card className="p-4">
        <h2 className="text-2xl font-bold mb-4">Carrinho</h2>
        {/* Lista de itens */}
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>{item.name}</span>
              <span>R$ {item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        {/* Total */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-2xl font-bold">
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Botões */}
        <div className="mt-4 space-y-2">
          <Button className="w-full" size="lg" onClick={handleCheckout}>
            Finalizar Venda
          </Button>
          <Button variant="outline" className="w-full" onClick={clear}>
            Limpar
          </Button>
        </div>
      </Card>
    </div>
  );
}
```

### `lib/stores/cart-store.ts` (Zustand)

```typescript
import { create } from 'zustand';

interface CartItem {
  id: string;
  inventoryItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  total: 0,
  
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.inventoryItemId === item.inventoryItemId);
      
      if (existingItem) {
        const updatedItems = state.items.map((i) =>
          i.inventoryItemId === item.inventoryItemId
            ? { ...i, quantity: i.quantity + item.quantity, subtotal: (i.quantity + item.quantity) * i.unitPrice }
            : i
        );
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, i) => sum + i.subtotal, 0),
        };
      }
      
      const newItems = [...state.items, item];
      return {
        items: newItems,
        total: newItems.reduce((sum, i) => sum + i.subtotal, 0),
      };
    }),
  
  removeItem: (id) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      return {
        items: newItems,
        total: newItems.reduce((sum, i) => sum + i.subtotal, 0),
      };
    }),
  
  updateQuantity: (id, quantity) =>
    set((state) => {
      const updatedItems = state.items.map((i) =>
        i.id === id ? { ...i, quantity, subtotal: quantity * i.unitPrice } : i
      );
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, i) => sum + i.subtotal, 0),
      };
    }),
  
  clear: () => set({ items: [], total: 0 }),
}));
```

## 🎯 Próximos Passos

1. **Setup do projeto Next.js**
2. **Implementar autenticação (NextAuth.js)**
3. **Criar layout do dashboard**
4. **Implementar páginas principais:**
   - Dashboard (visão geral)
   - Gestão de estabelecimentos
   - Inventário (com scanner)
   - PDV (ponto de venda)
   - Ofertas
   - Relatórios

## 📚 Recursos Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Query](https://tanstack.com/query/latest)
- [Recharts](https://recharts.org/)

## 🔐 Permissões por Role

```typescript
// lib/utils/permissions.ts
export const canAccess = (userRole: BusinessRole, requiredRoles: BusinessRole[]) => {
  return requiredRoles.includes(userRole);
};

export const PERMISSIONS = {
  MANAGE_ESTABLISHMENT: [BusinessRole.OWNER],
  MANAGE_INVENTORY: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.STOCK],
  MAKE_SALES: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.SALES],
  MANAGE_OFFERS: [BusinessRole.OWNER, BusinessRole.ADMIN, BusinessRole.MARKETING],
  VIEW_REPORTS: [BusinessRole.OWNER, BusinessRole.ADMIN],
  MANAGE_SUBSCRIPTION: [BusinessRole.OWNER],
};
```

---

**Pronto para começar o desenvolvimento do frontend!** 🚀
