// WebSocket Service para Delivery em Tempo Real
// Para usar este serviço, instale: npm install socket.io-client

// import { io, Socket } from 'socket.io-client';

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
  private socket: any | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(token: string) {
    // Descomente quando socket.io-client estiver instalado
    /*
    if (this.socket?.connected) return;

    this.socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      path: '/delivery',
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

    this.socket.on('connect_error', (error: any) => {
      console.error('Erro de conexão:', error);
    });

    this.setupEventListeners();
    */
    console.warn('⚠️ WebSocket não configurado. Instale socket.io-client para habilitar.');
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Status Update
    this.socket.on('status:update', (data: any) => {
      this.emit('status:update', data);
    });

    // Location Update
    this.socket.on('location:update', (data: any) => {
      this.emit('location:update', data);
    });

    // New Order
    this.socket.on('order:new', (data: any) => {
      this.emit('order:new', data);
    });

    // Order Update
    this.socket.on('order:update', (data: any) => {
      this.emit('order:update', data);
    });
  }

  subscribeToOrder(orderId: string) {
    if (!this.socket) {
      console.warn('⚠️ Socket não conectado. WebSocket desabilitado.');
      return;
    }

    this.socket.emit('subscribe:order', { orderId });
    console.log(`📦 Inscrito no pedido ${orderId}`);
  }

  unsubscribeFromOrder(orderId: string) {
    if (!this.socket) return;

    this.socket.emit('unsubscribe:order', { orderId });
    console.log(`📦 Desinscrito do pedido ${orderId}`);
  }

  subscribeToEstablishment(establishmentId: string) {
    if (!this.socket) {
      console.warn('⚠️ Socket não conectado. WebSocket desabilitado.');
      return;
    }

    this.socket.emit('subscribe:establishment', { establishmentId });
    console.log(`🏪 Inscrito no estabelecimento ${establishmentId}`);
  }

  updateDriverLocation(orderId: string, latitude: number, longitude: number) {
    if (!this.socket) return;

    this.socket.emit('driver:location', { orderId, latitude, longitude });
  }

  on<K extends keyof DeliveryWebSocketEvents>(
    event: K,
    callback: DeliveryWebSocketEvents[K]
  ) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

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

export const deliveryWebSocket = new DeliveryWebSocketService();
