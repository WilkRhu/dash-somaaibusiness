# Guia de Integração Frontend - Delivery

## Visão Geral

Este guia mostra como integrar o módulo de Delivery com aplicações frontend (React, Vue, Angular, React Native).

---

## 1. Configuração da API

### Base URL

```typescript
const API_BASE_URL = 'http://localhost:3000';
const DELIVERY_BASE = '/business/establishments';
```

### Axios Setup

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 2. Types/Interfaces TypeScript

```typescript
// src/types/delivery.ts

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
```

---

## 3. Service Layer

```typescript
// src/services/deliveryService.ts
import api from './api';
import { DeliveryOrder, DeliveryZone, CreateDeliveryOrderDto } from '../types/delivery';

class DeliveryService {
  private getBasePath(establishmentId: string) {
    return `/business/establishments/${establishmentId}/delivery`;
  }

  // ========== PEDIDOS ==========

  async createOrder(
    establishmentId: string,
    data: CreateDeliveryOrderDto
  ): Promise<DeliveryOrder> {
    const response = await api.post(
      `${this.getBasePath(establishmentId)}/orders`,
      data
    );
    return response.data.data;
  }

  async listOrders(
    establishmentId: string,
    filters?: {
      status?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{ data: DeliveryOrder[]; total: number; page: number; limit: number }> {
    const response = await api.get(
      `${this.getBasePath(establishmentId)}/orders`,
      { params: filters }
    );
    return response.data;
  }

  async getOrder(
    establishmentId: string,
    orderId: string
  ): Promise<DeliveryOrder> {
    const response = await api.get(
      `${this.getBasePath(establishmentId)}/orders/${orderId}`
    );
    return response.data.data;
  }

  async updateStatus(
    establishmentId: string,
    orderId: string,
    status: string,
    description: string
  ): Promise<DeliveryOrder> {
    const response = await api.patch(
      `${this.getBasePath(establishmentId)}/orders/${orderId}/status`,
      { status, description }
    );
    return response.data.data;
  }

  async assignDriver(
    establishmentId: string,
    orderId: string,
    driverId: string
  ): Promise<DeliveryOrder> {
    const response = await api.post(
      `${this.getBasePath(establishmentId)}/orders/${orderId}/assign-driver`,
      { driverId }
    );
    return response.data.data;
  }

  // ========== ZONAS ==========

  async createZone(
    establishmentId: string,
    data: Partial<DeliveryZone>
  ): Promise<DeliveryZone> {
    const response = await api.post(
      `${this.getBasePath(establishmentId)}/zones`,
      data
    );
    return response.data.data;
  }

  async listZones(establishmentId: string): Promise<DeliveryZone[]> {
    const response = await api.get(
      `${this.getBasePath(establishmentId)}/zones`
    );
    return response.data.data;
  }

  // ========== CÁLCULO ==========

  async calculateFee(
    establishmentId: string,
    data: {
      neighborhood: string;
      zipCode?: string;
      latitude?: number;
      longitude?: number;
      subtotal: number;
    }
  ): Promise<{
    deliveryFee: number;
    isFreeDelivery: boolean;
    freeDeliveryMinimum: number | null;
    estimatedTime: number;
    zone: DeliveryZone | null;
  }> {
    const response = await api.post(
      `${this.getBasePath(establishmentId)}/calculate-fee`,
      data
    );
    return response.data.data;
  }
}

export default new DeliveryService();
```

---

## 4. React Hooks

```typescript
// src/hooks/useDelivery.ts
import { useState, useEffect } from 'react';
import deliveryService from '../services/deliveryService';
import { DeliveryOrder, DeliveryZone } from '../types/delivery';

export function useDeliveryOrders(establishmentId: string) {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await deliveryService.listOrders(establishmentId);
      setOrders(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [establishmentId]);

  return { orders, loading, error, refetch: fetchOrders };
}

export function useDeliveryZones(establishmentId: string) {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    deliveryService.listZones(establishmentId).then(setZones).finally(() => setLoading(false));
  }, [establishmentId]);

  return { zones, loading };
}
```

---

## 5. Componentes React

### 5.1 Criar Pedido

```tsx
// src/components/CreateDeliveryOrder.tsx
import React, { useState } from 'react';
import deliveryService from '../services/deliveryService';
import { CreateDeliveryOrderDto, PaymentMethod } from '../types/delivery';

interface Props {
  establishmentId: string;
  onSuccess: () => void;
}

export function CreateDeliveryOrder({ establishmentId, onSuccess }: Props) {
  const [formData, setFormData] = useState<Partial<CreateDeliveryOrderDto>>({
    paymentMethod: PaymentMethod.PIX,
    items: [],
  });
  const [loading, setLoading] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);

  const calculateFee = async () => {
    if (!formData.deliveryNeighborhood || !formData.items?.length) return;

    const subtotal = formData.items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    const result = await deliveryService.calculateFee(establishmentId, {
      neighborhood: formData.deliveryNeighborhood,
      zipCode: formData.deliveryZipCode,
      subtotal,
    });

    setDeliveryFee(result.deliveryFee);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await deliveryService.createOrder(
        establishmentId,
        formData as CreateDeliveryOrderDto
      );
      alert('Pedido criado com sucesso!');
      onSuccess();
    } catch (error: any) {
      alert(`Erro: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold">Novo Pedido de Delivery</h2>

      {/* Cliente */}
      <div>
        <label>Nome do Cliente</label>
        <input
          type="text"
          value={formData.customerName || ''}
          onChange={(e) =>
            setFormData({ ...formData, customerName: e.target.value })
          }
          required
        />
      </div>

      <div>
        <label>Telefone</label>
        <input
          type="tel"
          value={formData.customerPhone || ''}
          onChange={(e) =>
            setFormData({ ...formData, customerPhone: e.target.value })
          }
          required
        />
      </div>

      {/* Endereço */}
      <div>
        <label>Endereço</label>
        <input
          type="text"
          value={formData.deliveryAddress || ''}
          onChange={(e) =>
            setFormData({ ...formData, deliveryAddress: e.target.value })
          }
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Bairro</label>
          <input
            type="text"
            value={formData.deliveryNeighborhood || ''}
            onChange={(e) =>
              setFormData({ ...formData, deliveryNeighborhood: e.target.value })
            }
            onBlur={calculateFee}
            required
          />
        </div>

        <div>
          <label>CEP</label>
          <input
            type="text"
            value={formData.deliveryZipCode || ''}
            onChange={(e) =>
              setFormData({ ...formData, deliveryZipCode: e.target.value })
            }
            required
          />
        </div>
      </div>

      {/* Taxa de Entrega */}
      {deliveryFee !== null && (
        <div className="bg-blue-50 p-4 rounded">
          <p className="font-semibold">
            Taxa de Entrega: R$ {deliveryFee.toFixed(2)}
          </p>
        </div>
      )}

      {/* Método de Pagamento */}
      <div>
        <label>Forma de Pagamento</label>
        <select
          value={formData.paymentMethod}
          onChange={(e) =>
            setFormData({
              ...formData,
              paymentMethod: e.target.value as PaymentMethod,
            })
          }
          required
        >
          <option value={PaymentMethod.CASH}>Dinheiro</option>
          <option value={PaymentMethod.PIX}>PIX</option>
          <option value={PaymentMethod.CREDIT_CARD}>Cartão de Crédito</option>
          <option value={PaymentMethod.DEBIT_CARD}>Cartão de Débito</option>
        </select>
      </div>

      {/* Observações */}
      <div>
        <label>Observações</label>
        <textarea
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {loading ? 'Criando...' : 'Criar Pedido'}
      </button>
    </form>
  );
}
```

### 5.2 Lista de Pedidos

```tsx
// src/components/DeliveryOrdersList.tsx
import React from 'react';
import { useDeliveryOrders } from '../hooks/useDelivery';
import { DeliveryStatus } from '../types/delivery';

interface Props {
  establishmentId: string;
}

const statusLabels = {
  [DeliveryStatus.PENDING]: 'Pendente',
  [DeliveryStatus.CONFIRMED]: 'Confirmado',
  [DeliveryStatus.PREPARING]: 'Em Preparo',
  [DeliveryStatus.READY_FOR_DELIVERY]: 'Pronto',
  [DeliveryStatus.OUT_FOR_DELIVERY]: 'Saiu para Entrega',
  [DeliveryStatus.DELIVERED]: 'Entregue',
  [DeliveryStatus.CANCELLED]: 'Cancelado',
  [DeliveryStatus.FAILED]: 'Falhou',
};

const statusColors = {
  [DeliveryStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [DeliveryStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
  [DeliveryStatus.PREPARING]: 'bg-purple-100 text-purple-800',
  [DeliveryStatus.READY_FOR_DELIVERY]: 'bg-orange-100 text-orange-800',
  [DeliveryStatus.OUT_FOR_DELIVERY]: 'bg-indigo-100 text-indigo-800',
  [DeliveryStatus.DELIVERED]: 'bg-green-100 text-green-800',
  [DeliveryStatus.CANCELLED]: 'bg-red-100 text-red-800',
  [DeliveryStatus.FAILED]: 'bg-red-100 text-red-800',
};

export function DeliveryOrdersList({ establishmentId }: Props) {
  const { orders, loading, error, refetch } = useDeliveryOrders(establishmentId);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pedidos de Delivery</h2>
        <button onClick={refetch} className="px-4 py-2 bg-blue-600 text-white rounded">
          Atualizar
        </button>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{order.orderNumber}</h3>
                <p className="text-gray-600">{order.customerName}</p>
                <p className="text-sm text-gray-500">{order.deliveryAddress}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  statusColors[order.status]
                }`}
              >
                {statusLabels[order.status]}
              </span>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  Total: <span className="font-bold">R$ {order.total.toFixed(2)}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Tempo estimado: {order.estimatedDeliveryTime} min
                </p>
              </div>

              {order.driver && (
                <div className="text-sm">
                  <p className="font-semibold">{order.driver.name}</p>
                  <p className="text-gray-600">{order.driver.phone}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5.3 Rastreamento de Pedido

```tsx
// src/components/OrderTracking.tsx
import React, { useState, useEffect } from 'react';
import deliveryService from '../services/deliveryService';
import { DeliveryOrder } from '../types/delivery';

interface Props {
  establishmentId: string;
  orderId: string;
}

export function OrderTracking({ establishmentId, orderId }: Props) {
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const data = await deliveryService.getOrder(establishmentId, orderId);
      setOrder(data);
      setLoading(false);
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 30000); // Atualiza a cada 30s

    return () => clearInterval(interval);
  }, [establishmentId, orderId]);

  if (loading || !order) return <div>Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Pedido {order.orderNumber}</h2>

      {/* Informações do Pedido */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="font-bold mb-4">Informações</h3>
        <div className="space-y-2">
          <p><strong>Cliente:</strong> {order.customerName}</p>
          <p><strong>Telefone:</strong> {order.customerPhone}</p>
          <p><strong>Endereço:</strong> {order.deliveryAddress}</p>
          <p><strong>Total:</strong> R$ {order.total.toFixed(2)}</p>
        </div>
      </div>

      {/* Timeline de Rastreamento */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-bold mb-4">Rastreamento</h3>
        <div className="space-y-4">
          {order.tracking?.map((track, index) => (
            <div key={track.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
                {index < order.tracking!.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-300 my-1" />
                )}
              </div>

              <div className="flex-1 pb-4">
                <p className="font-semibold">{track.description}</p>
                <p className="text-sm text-gray-600">
                  {new Date(track.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 6. Exemplo Completo de Fluxo

```tsx
// src/pages/DeliveryPage.tsx
import React, { useState } from 'react';
import { CreateDeliveryOrder } from '../components/CreateDeliveryOrder';
import { DeliveryOrdersList } from '../components/DeliveryOrdersList';

export function DeliveryPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const establishmentId = 'seu-establishment-id'; // Pegar do contexto/auth

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Delivery</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {showCreateForm ? 'Ver Pedidos' : 'Novo Pedido'}
        </button>
      </div>

      {showCreateForm ? (
        <CreateDeliveryOrder
          establishmentId={establishmentId}
          onSuccess={() => setShowCreateForm(false)}
        />
      ) : (
        <DeliveryOrdersList establishmentId={establishmentId} />
      )}
    </div>
  );
}
```

---

## 7. Tratamento de Erros

```typescript
// src/utils/errorHandler.ts
export function handleApiError(error: any): string {
  if (error.response) {
    // Erro da API
    const message = error.response.data?.message;
    
    if (Array.isArray(message)) {
      return message.join(', ');
    }
    
    return message || 'Erro ao processar requisição';
  }
  
  if (error.request) {
    return 'Sem resposta do servidor. Verifique sua conexão.';
  }
  
  return error.message || 'Erro desconhecido';
}

// Uso
try {
  await deliveryService.createOrder(establishmentId, data);
} catch (error) {
  const errorMessage = handleApiError(error);
  toast.error(errorMessage);
}
```

---

## 8. Context API (Opcional)

```tsx
// src/contexts/DeliveryContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import deliveryService from '../services/deliveryService';
import { DeliveryOrder, DeliveryZone } from '../types/delivery';

interface DeliveryContextData {
  orders: DeliveryOrder[];
  zones: DeliveryZone[];
  loading: boolean;
  refreshOrders: () => Promise<void>;
  refreshZones: () => Promise<void>;
}

const DeliveryContext = createContext<DeliveryContextData>({} as DeliveryContextData);

export function DeliveryProvider({ children, establishmentId }: any) {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshOrders = async () => {
    const result = await deliveryService.listOrders(establishmentId);
    setOrders(result.data);
  };

  const refreshZones = async () => {
    const data = await deliveryService.listZones(establishmentId);
    setZones(data);
  };

  useEffect(() => {
    Promise.all([refreshOrders(), refreshZones()]).finally(() => setLoading(false));
  }, [establishmentId]);

  return (
    <DeliveryContext.Provider
      value={{ orders, zones, loading, refreshOrders, refreshZones }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}

export const useDelivery = () => useContext(DeliveryContext);
```

---

## 9. Testes

```typescript
// src/services/__tests__/deliveryService.test.ts
import deliveryService from '../deliveryService';
import api from '../api';

jest.mock('../api');

describe('DeliveryService', () => {
  const establishmentId = 'test-id';

  it('should create order', async () => {
    const mockOrder = { id: '1', orderNumber: 'DEL-001' };
    (api.post as jest.Mock).mockResolvedValue({ data: { data: mockOrder } });

    const result = await deliveryService.createOrder(establishmentId, {} as any);

    expect(result).toEqual(mockOrder);
    expect(api.post).toHaveBeenCalledWith(
      `/business/establishments/${establishmentId}/delivery/orders`,
      {}
    );
  });

  it('should calculate fee', async () => {
    const mockFee = { deliveryFee: 8.0, isFreeDelivery: false };
    (api.post as jest.Mock).mockResolvedValue({ data: { data: mockFee } });

    const result = await deliveryService.calculateFee(establishmentId, {
      neighborhood: 'Centro',
      subtotal: 50,
    });

    expect(result.deliveryFee).toBe(8.0);
  });
});
```

---

## 10. Checklist de Integração

- [ ] Configurar axios com interceptors
- [ ] Criar types/interfaces TypeScript
- [ ] Implementar service layer
- [ ] Criar hooks customizados
- [ ] Desenvolver componentes de UI
- [ ] Adicionar tratamento de erros
- [ ] Implementar loading states
- [ ] Adicionar validação de formulários
- [ ] Testar fluxo completo
- [ ] Adicionar testes unitários

---

## Recursos Adicionais

- Documentação da API: `business/docs/DELIVERY_SPEC.md`
- WebSocket: `business/docs/DELIVERY_REALTIME_GUIDE.md`
- Exemplos Backend: `business/docs/DELIVERY_IMPLEMENTATION_EXAMPLE.md`


---

## 11. WebSocket para Tempo Real

### 11.1 Instalação

```bash
npm install socket.io-client
```

### 11.2 WebSocket Service

```typescript
// src/services/deliveryWebSocket.ts
import { io, Socket } from 'socket.io-client';

interface DeliveryWebSocketEvents {
  'status:update': (data: {
    orderId: string;
    status: string;
    description: string;
    timestamp: string;
  }) => void;
  
  'location:update': (data: {
    orderId: string;
    latitude: number;
    longitude: number;
    timestamp: string;
  }) => void;
  
  'order:new': (data: {
    orderId: string;
    orderNumber: string;
    customerName: string;
    total: number;
    timestamp: string;
  }) => void;
  
  'order:update': (data: any) => void;
}

class DeliveryWebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io('http://localhost:3000/delivery', {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Conectado ao servidor de delivery');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado do servidor');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Erro de conexão:', error);
    });

    // Registrar listeners de eventos
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Status Update
    this.socket.on('status:update', (data) => {
      this.emit('status:update', data);
    });

    // Location Update
    this.socket.on('location:update', (data) => {
      this.emit('location:update', data);
    });

    // New Order
    this.socket.on('order:new', (data) => {
      this.emit('order:new', data);
    });

    // Order Update
    this.socket.on('order:update', (data) => {
      this.emit('order:update', data);
    });
  }

  // Inscrever em um pedido específico
  subscribeToOrder(orderId: string) {
    if (!this.socket) {
      console.error('Socket não conectado');
      return;
    }

    this.socket.emit('subscribe:order', { orderId });
    console.log(`📦 Inscrito no pedido ${orderId}`);
  }

  // Desinscrever de um pedido
  unsubscribeFromOrder(orderId: string) {
    if (!this.socket) return;

    this.socket.emit('unsubscribe:order', { orderId });
    console.log(`📦 Desinscrito do pedido ${orderId}`);
  }

  // Inscrever em estabelecimento (para receber novos pedidos)
  subscribeToEstablishment(establishmentId: string) {
    if (!this.socket) {
      console.error('Socket não conectado');
      return;
    }

    this.socket.emit('subscribe:establishment', { establishmentId });
    console.log(`🏪 Inscrito no estabelecimento ${establishmentId}`);
  }

  // Atualizar localização do entregador
  updateDriverLocation(orderId: string, latitude: number, longitude: number) {
    if (!this.socket) return;

    this.socket.emit('driver:location', { orderId, latitude, longitude });
  }

  // Sistema de eventos customizado
  on<K extends keyof DeliveryWebSocketEvents>(
    event: K,
    callback: DeliveryWebSocketEvents[K]
  ) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Retorna função para remover listener
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      console.log('🔌 Desconectado do WebSocket');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new DeliveryWebSocketService();
```

### 11.3 Hook para WebSocket

```typescript
// src/hooks/useDeliveryWebSocket.ts
import { useEffect, useRef } from 'react';
import deliveryWS from '../services/deliveryWebSocket';

export function useDeliveryWebSocket(token: string) {
  const isConnected = useRef(false);

  useEffect(() => {
    if (!isConnected.current && token) {
      deliveryWS.connect(token);
      isConnected.current = true;
    }

    return () => {
      if (isConnected.current) {
        deliveryWS.disconnect();
        isConnected.current = false;
      }
    };
  }, [token]);

  return deliveryWS;
}

// Hook específico para rastreamento de pedido
export function useOrderTracking(orderId: string) {
  const [status, setStatus] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    // Inscrever no pedido
    deliveryWS.subscribeToOrder(orderId);

    // Ouvir atualizações de status
    const unsubStatus = deliveryWS.on('status:update', (data) => {
      if (data.orderId === orderId) {
        setStatus(data);
      }
    });

    // Ouvir atualizações de localização
    const unsubLocation = deliveryWS.on('location:update', (data) => {
      if (data.orderId === orderId) {
        setLocation(data);
      }
    });

    return () => {
      deliveryWS.unsubscribeFromOrder(orderId);
      unsubStatus();
      unsubLocation();
    };
  }, [orderId]);

  return { status, location };
}

// Hook para estabelecimento receber novos pedidos
export function useNewOrders(establishmentId: string, onNewOrder: (order: any) => void) {
  useEffect(() => {
    deliveryWS.subscribeToEstablishment(establishmentId);

    const unsubscribe = deliveryWS.on('order:new', (data) => {
      onNewOrder(data);
      // Tocar som de notificação
      new Audio('/notification.mp3').play();
    });

    return () => {
      unsubscribe();
    };
  }, [establishmentId, onNewOrder]);
}
```

### 11.4 Componente com Rastreamento em Tempo Real

```tsx
// src/components/LiveOrderTracking.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useOrderTracking } from '../hooks/useDeliveryWebSocket';
import deliveryService from '../services/deliveryService';
import { DeliveryOrder } from '../types/delivery';

interface Props {
  establishmentId: string;
  orderId: string;
}

export function LiveOrderTracking({ establishmentId, orderId }: Props) {
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const { status, location } = useOrderTracking(orderId);

  useEffect(() => {
    // Carregar dados iniciais
    deliveryService.getOrder(establishmentId, orderId).then(setOrder);
  }, [establishmentId, orderId]);

  // Atualizar status em tempo real
  useEffect(() => {
    if (status) {
      console.log('📦 Status atualizado:', status);
      // Atualizar UI
      if (order) {
        setOrder({ ...order, status: status.status });
      }
    }
  }, [status]);

  // Atualizar localização em tempo real
  useEffect(() => {
    if (location) {
      console.log('📍 Localização atualizada:', location);
    }
  }, [location]);

  if (!order) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-bold mb-4">Pedido {order.orderNumber}</h3>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600">Status Atual</p>
            <p className="text-lg font-semibold">{status?.description || order.status}</p>
          </div>
          
          {status && (
            <div className="text-sm text-gray-500">
              Atualizado há {Math.floor((Date.now() - new Date(status.timestamp).getTime()) / 1000)}s
            </div>
          )}
        </div>

        {/* Barra de Progresso */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                Em andamento
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div
              style={{ width: `${getProgressPercentage(order.status)}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Mapa com Localização do Entregador */}
      {location && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Localização do Entregador</h3>
          <div className="h-96 rounded-lg overflow-hidden">
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={[location.latitude, location.longitude]}>
                <Popup>
                  {order.driver?.name || 'Entregador'}
                  <br />
                  Atualizado: {new Date(location.timestamp).toLocaleTimeString()}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Histórico</h3>
        <div className="space-y-4">
          {order.tracking?.map((track, index) => (
            <div key={track.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    index === 0 ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'
                  }`}
                />
                {index < order.tracking!.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-300 my-1" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <p className="font-semibold">{track.description}</p>
                <p className="text-sm text-gray-600">
                  {new Date(track.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getProgressPercentage(status: string): number {
  const statusMap: Record<string, number> = {
    pending: 10,
    confirmed: 25,
    preparing: 50,
    ready_for_delivery: 65,
    out_for_delivery: 85,
    delivered: 100,
  };
  return statusMap[status] || 0;
}
```

### 11.5 Dashboard com Notificações em Tempo Real

```tsx
// src/components/DeliveryDashboard.tsx
import React, { useState, useCallback } from 'react';
import { useNewOrders } from '../hooks/useDeliveryWebSocket';
import { DeliveryOrdersList } from './DeliveryOrdersList';
import { toast } from 'react-hot-toast';

interface Props {
  establishmentId: string;
}

export function DeliveryDashboard({ establishmentId }: Props) {
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  const handleNewOrder = useCallback((order: any) => {
    console.log('🆕 Novo pedido recebido:', order);
    
    // Incrementar contador
    setNewOrdersCount((prev) => prev + 1);
    
    // Mostrar notificação
    toast.success(
      `Novo pedido ${order.orderNumber} de ${order.customerName}!`,
      {
        duration: 5000,
        icon: '🛵',
      }
    );
    
    // Vibrar (mobile)
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  }, []);

  useNewOrders(establishmentId, handleNewOrder);

  return (
    <div className="space-y-6">
      {/* Header com Badge de Novos Pedidos */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard de Delivery</h1>
        
        {newOrdersCount > 0 && (
          <div className="relative">
            <button
              onClick={() => setNewOrdersCount(0)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg animate-bounce"
            >
              {newOrdersCount} Novo{newOrdersCount > 1 ? 's' : ''} Pedido{newOrdersCount > 1 ? 's' : ''}!
            </button>
          </div>
        )}
      </div>

      {/* Lista de Pedidos */}
      <DeliveryOrdersList establishmentId={establishmentId} />
    </div>
  );
}
```

### 11.6 App de Entregador com Atualização de Localização

```tsx
// src/components/DriverApp.tsx
import React, { useEffect, useState } from 'react';
import deliveryWS from '../services/deliveryWebSocket';

interface Props {
  orderId: string;
}

export function DriverApp({ orderId }: Props) {
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Enviar localização via WebSocket
        deliveryWS.updateDriverLocation(orderId, latitude, longitude);
        
        console.log('📍 Localização enviada:', { latitude, longitude });
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
    setIsTracking(true);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
    }
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">App do Entregador</h2>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="mb-4">Pedido: {orderId}</p>
        
        <button
          onClick={isTracking ? stopTracking : startTracking}
          className={`w-full py-3 rounded-lg font-semibold ${
            isTracking
              ? 'bg-red-600 text-white'
              : 'bg-green-600 text-white'
          }`}
        >
          {isTracking ? '⏸️ Parar Rastreamento' : '▶️ Iniciar Rastreamento'}
        </button>
        
        {isTracking && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 font-semibold">
              ✅ Rastreamento ativo
            </p>
            <p className="text-sm text-green-600">
              Sua localização está sendo enviada em tempo real
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 11.7 Provider Global

```tsx
// src/App.tsx
import React, { useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useDeliveryWebSocket } from './hooks/useDeliveryWebSocket';
import { Toaster } from 'react-hot-toast';

function App() {
  const { token } = useAuth();
  const deliveryWS = useDeliveryWebSocket(token);

  return (
    <>
      <Toaster position="top-right" />
      {/* Resto da aplicação */}
    </>
  );
}
```

---

## 12. Comparação: HTTP vs WebSocket

| Recurso | HTTP (Polling) | WebSocket |
|---------|----------------|-----------|
| Criar pedido | ✅ Melhor | ❌ Não usar |
| Listar pedidos | ✅ Melhor | ❌ Não usar |
| Rastreamento | ⚠️ Funciona | ✅ Melhor |
| Notificações | ❌ Ruim | ✅ Melhor |
| Localização live | ❌ Ruim | ✅ Melhor |
| Novos pedidos | ⚠️ Funciona | ✅ Melhor |
| Latência | ~30s | <1s |
| Uso de banda | Alto | Baixo |

### Recomendação

Use **HTTP** para:
- Criar/editar/deletar pedidos
- Listar pedidos
- Buscar detalhes
- Relatórios

Use **WebSocket** para:
- Rastreamento em tempo real
- Notificações de novos pedidos
- Atualização de status
- Localização do entregador

---

## 13. Instalação Completa

```bash
# Dependências principais
npm install axios socket.io-client

# UI (opcional)
npm install react-hot-toast
npm install react-leaflet leaflet

# Types
npm install -D @types/leaflet
```

---

## 14. Exemplo Completo Integrado

```tsx
// src/pages/DeliveryPage.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDeliveryWebSocket } from '../hooks/useDeliveryWebSocket';
import { DeliveryDashboard } from '../components/DeliveryDashboard';
import { LiveOrderTracking } from '../components/LiveOrderTracking';

export function DeliveryPage() {
  const { token, user } = useAuth();
  const establishmentId = user.establishmentId;
  
  // Conectar WebSocket
  useDeliveryWebSocket(token);

  return (
    <div className="container mx-auto p-6">
      <DeliveryDashboard establishmentId={establishmentId} />
    </div>
  );
}
```

Agora sim! O guia está completo com **WebSocket** para rastreamento em tempo real! 🚀
