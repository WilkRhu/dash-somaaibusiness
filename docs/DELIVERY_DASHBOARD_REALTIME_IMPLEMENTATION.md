# 📊 Dashboard - Implementação de Rastreamento em Tempo Real

Guia completo para implementar rastreamento em tempo real no dashboard de admin/gerente.

---

## 🎯 O que o Dashboard Precisa Fazer

1. ✅ Conectar ao WebSocket
2. ✅ Se inscrever no estabelecimento
3. ✅ Receber novos pedidos
4. ✅ Monitorar pedidos em entrega
5. ✅ Ver localização dos entregadores
6. ✅ Ver ETA de cada pedido
7. ✅ Receber alertas de geofencing
8. ✅ Gerenciar pedidos em tempo real

---

## 🔌 1. Conectar ao WebSocket

### React

```typescript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function DashboardPage({ establishmentId, token }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Conectar ao WebSocket
    const newSocket = io('http://seu-backend.com/delivery', {
      auth: {
        token: `Bearer ${token}`,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Evento de conexão
    newSocket.on('connect', () => {
      console.log('✅ Dashboard conectado ao servidor');
      setIsConnected(true);

      // Se inscrever no estabelecimento
      newSocket.emit('subscribe:establishment', { establishmentId });
    });

    // Evento de desconexão
    newSocket.on('disconnect', () => {
      console.log('❌ Dashboard desconectado');
      setIsConnected(false);
    });

    // Erro de conexão
    newSocket.on('connect_error', (error) => {
      console.error('❌ Erro de conexão:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [establishmentId, token]);

  return (
    <div>
      {isConnected ? (
        <span className="badge badge-success">🟢 Conectado</span>
      ) : (
        <span className="badge badge-danger">🔴 Desconectado</span>
      )}
    </div>
  );
}
```

---

## 📦 2. Receber Novos Pedidos

```typescript
const [orders, setOrders] = useState([]);

useEffect(() => {
  if (!socket) return;

  // Receber novo pedido
  socket.on('order:new', (data) => {
    console.log('🆕 Novo pedido:', data);

    // Adicionar à lista
    setOrders((prev) => [data, ...prev]);

    // Notificação sonora
    playNotificationSound();

    // Notificação visual
    showNotification({
      title: '🆕 Novo Pedido!',
      message: `${data.customerName} - R$ ${data.total.toFixed(2)}`,
      type: 'success',
    });
  });

  return () => {
    socket.off('order:new');
  };
}, [socket]);
```

---

## 📍 3. Monitorar Localização dos Entregadores

```typescript
const [deliveryLocations, setDeliveryLocations] = useState({});

useEffect(() => {
  if (!socket) return;

  // Receber localização de cada pedido
  socket.on('driver:location', (data) => {
    console.log('📍 Localização atualizada:', data);

    setDeliveryLocations((prev) => ({
      ...prev,
      [data.orderId]: {
        latitude: data.latitude,
        longitude: data.longitude,
        driverId: data.driverId,
        timestamp: new Date(data.timestamp),
      },
    }));

    // Atualizar mapa
    updateMapMarker(data.orderId, data.latitude, data.longitude);
  });

  return () => {
    socket.off('driver:location');
  };
}, [socket]);
```

---

## ⏱️ 4. Monitorar ETA de Cada Pedido

```typescript
const [etas, setEtas] = useState({});

useEffect(() => {
  if (!socket) return;

  // Receber ETA
  socket.on('driver:eta', (data) => {
    console.log('⏱️ ETA recebido:', data);

    setEtas((prev) => ({
      ...prev,
      [data.orderId]: {
        minutes: data.etaMinutes,
        estimatedArrivalTime: new Date(data.estimatedArrivalTime),
        driverId: data.driverId,
      },
    }));

    // Atualizar tabela
    updateOrderETA(data.orderId, data.etaMinutes);
  });

  return () => {
    socket.off('driver:eta');
  };
}, [socket]);
```

---

## 🚨 5. Receber Alertas de Geofencing

```typescript
const [geofenceAlerts, setGeofenceAlerts] = useState([]);

useEffect(() => {
  if (!socket) return;

  // Receber alerta de geofencing
  socket.on('driver:geofence', (data) => {
    console.log('🚨 Geofence ativado:', data);

    // Adicionar alerta
    setGeofenceAlerts((prev) => [
      {
        orderId: data.orderId,
        driverId: data.driverId,
        message: data.message,
        distance: data.distance,
        timestamp: new Date(data.timestamp),
      },
      ...prev,
    ]);

    // Notificação visual
    showAlert({
      title: '🚨 Entregador Chegando',
      message: `Pedido ${data.orderId} - ${data.message}`,
      type: 'warning',
    });

    // Limpar alerta após 10 segundos
    setTimeout(() => {
      setGeofenceAlerts((prev) =>
        prev.filter((a) => a.orderId !== data.orderId)
      );
    }, 10000);
  });

  return () => {
    socket.off('driver:geofence');
  };
}, [socket]);
```

---

## 🗺️ 6. Mostrar Mapa com Todos os Entregadores

### Google Maps

```typescript
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

export function DeliveryMap({ deliveryLocations, orders }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Calcular centro do mapa (média das localizações)
  const mapCenter = calculateMapCenter(deliveryLocations);

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '600px' }}
      center={mapCenter}
      zoom={13}
    >
      {/* Marcadores dos entregadores */}
      {Object.entries(deliveryLocations).map(([orderId, location]) => {
        const order = orders.find((o) => o.id === orderId);

        return (
          <Marker
            key={orderId}
            position={{
              lat: location.latitude,
              lng: location.longitude,
            }}
            title={`Pedido ${order?.orderNumber}`}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
            }}
            onClick={() => setSelectedOrder(orderId)}
          />
        );
      })}

      {/* Info Window */}
      {selectedOrder && deliveryLocations[selectedOrder] && (
        <InfoWindow
          position={{
            lat: deliveryLocations[selectedOrder].latitude,
            lng: deliveryLocations[selectedOrder].longitude,
          }}
          onCloseClick={() => setSelectedOrder(null)}
        >
          <div>
            <h4>Pedido {orders.find((o) => o.id === selectedOrder)?.orderNumber}</h4>
            <p>Entregador: {deliveryLocations[selectedOrder].driverId}</p>
            <p>
              Atualizado em:{' '}
              {deliveryLocations[selectedOrder].timestamp.toLocaleTimeString()}
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

function calculateMapCenter(locations) {
  const entries = Object.values(locations);
  if (entries.length === 0) return { lat: -23.5505, lng: -46.6333 };

  const avgLat =
    entries.reduce((sum, loc) => sum + loc.latitude, 0) / entries.length;
  const avgLng =
    entries.reduce((sum, loc) => sum + loc.longitude, 0) / entries.length;

  return { lat: avgLat, lng: avgLng };
}
```

---

## 📊 7. Tabela de Pedidos em Tempo Real

```typescript
export function OrdersTable({ orders, etas, deliveryLocations }) {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Pedido</th>
          <th>Cliente</th>
          <th>Status</th>
          <th>Entregador</th>
          <th>ETA</th>
          <th>Localização</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          const eta = etas[order.id];
          const location = deliveryLocations[order.id];

          return (
            <tr key={order.id}>
              <td>
                <strong>{order.orderNumber}</strong>
              </td>
              <td>{order.customerName}</td>
              <td>
                <span className={`badge badge-${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td>{order.driver?.name || '-'}</td>
              <td>
                {eta ? (
                  <span className="badge badge-info">
                    ⏱️ {eta.minutes} min
                  </span>
                ) : (
                  '-'
                )}
              </td>
              <td>
                {location ? (
                  <span className="badge badge-success">
                    📍 Rastreando
                  </span>
                ) : (
                  '-'
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => viewOrderDetails(order.id)}
                >
                  Ver
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function getStatusColor(status) {
  const colors = {
    PENDING: 'secondary',
    CONFIRMED: 'info',
    PREPARING: 'warning',
    READY_FOR_DELIVERY: 'warning',
    OUT_FOR_DELIVERY: 'primary',
    DELIVERED: 'success',
    CANCELLED: 'danger',
    FAILED: 'danger',
  };
  return colors[status] || 'secondary';
}
```

---

## 📈 8. Dashboard Completo

```typescript
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Toast } from 'react-toastify';

export function DeliveryDashboard({ establishmentId, token }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [orders, setOrders] = useState([]);
  const [deliveryLocations, setDeliveryLocations] = useState({});
  const [etas, setEtas] = useState({});
  const [geofenceAlerts, setGeofenceAlerts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    inDelivery: 0,
    delivered: 0,
    failed: 0,
  });

  // Conectar WebSocket
  useEffect(() => {
    const newSocket = io('http://seu-backend.com/delivery', {
      auth: { token: `Bearer ${token}` },
      reconnection: true,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('subscribe:establishment', { establishmentId });
    });

    newSocket.on('disconnect', () => setIsConnected(false));

    // Novo pedido
    newSocket.on('order:new', (data) => {
      setOrders((prev) => [data, ...prev]);
      Toast.success(`🆕 Novo pedido: ${data.orderNumber}`);
      updateStats();
    });

    // Localização
    newSocket.on('driver:location', (data) => {
      setDeliveryLocations((prev) => ({
        ...prev,
        [data.orderId]: {
          latitude: data.latitude,
          longitude: data.longitude,
          driverId: data.driverId,
          timestamp: new Date(data.timestamp),
        },
      }));
    });

    // ETA
    newSocket.on('driver:eta', (data) => {
      setEtas((prev) => ({
        ...prev,
        [data.orderId]: {
          minutes: data.etaMinutes,
          estimatedArrivalTime: new Date(data.estimatedArrivalTime),
        },
      }));
    });

    // Geofencing
    newSocket.on('driver:geofence', (data) => {
      setGeofenceAlerts((prev) => [
        {
          orderId: data.orderId,
          message: data.message,
          distance: data.distance,
          timestamp: new Date(data.timestamp),
        },
        ...prev,
      ]);

      Toast.warning(`🚨 ${data.message}`);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [establishmentId, token]);

  // Buscar pedidos iniciais
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(
        `/business/establishments/${establishmentId}/delivery/orders?status=OUT_FOR_DELIVERY`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setOrders(data.data);
      updateStats();
    };

    fetchOrders();
  }, [establishmentId, token]);

  const updateStats = () => {
    setStats({
      total: orders.length,
      inDelivery: orders.filter((o) => o.status === 'OUT_FOR_DELIVERY').length,
      delivered: orders.filter((o) => o.status === 'DELIVERED').length,
      failed: orders.filter((o) => o.status === 'FAILED').length,
    });
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>📊 Dashboard de Entregas</h1>
        <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
        </span>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Em Entrega</h3>
          <p className="stat-value">{stats.inDelivery}</p>
        </div>
        <div className="stat-card">
          <h3>Entregues</h3>
          <p className="stat-value">{stats.delivered}</p>
        </div>
        <div className="stat-card">
          <h3>Falhas</h3>
          <p className="stat-value">{stats.failed}</p>
        </div>
      </div>

      {/* Alertas de Geofencing */}
      {geofenceAlerts.length > 0 && (
        <div className="geofence-alerts">
          <h3>🚨 Alertas de Proximidade</h3>
          {geofenceAlerts.map((alert, idx) => (
            <div key={idx} className="alert alert-warning">
              <strong>Pedido {alert.orderId}</strong>
              <p>{alert.message} ({alert.distance}km)</p>
              <small>{alert.timestamp.toLocaleTimeString()}</small>
            </div>
          ))}
        </div>
      )}

      {/* Mapa */}
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '500px' }}
          center={{ lat: -23.5505, lng: -46.6333 }}
          zoom={13}
        >
          {Object.entries(deliveryLocations).map(([orderId, location]) => (
            <Marker
              key={orderId}
              position={{
                lat: location.latitude,
                lng: location.longitude,
              }}
              title={`Pedido ${orderId}`}
            />
          ))}
        </GoogleMap>
      </div>

      {/* Tabela de Pedidos */}
      <div className="orders-table">
        <h3>Pedidos em Entrega</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Entregador</th>
              <th>ETA</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .filter((o) => o.status === 'OUT_FOR_DELIVERY')
              .map((order) => {
                const eta = etas[order.id];
                return (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td>{order.driver?.name || '-'}</td>
                    <td>
                      {eta ? `⏱️ ${eta.minutes} min` : '-'}
                    </td>
                    <td>
                      <span className="badge badge-primary">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 🎯 Fluxo de Uso

### 1. Admin abre o dashboard
```
GET /business/establishments/{id}/delivery/orders
```

### 2. Dashboard conecta ao WebSocket
```javascript
socket = io('http://backend.com/delivery', { auth: { token } })
socket.emit('subscribe:establishment', { establishmentId })
```

### 3. Dashboard recebe eventos em tempo real
```
order:new → Novo pedido chega
driver:location → Atualizar mapa
driver:eta → Atualizar ETA
driver:geofence → Mostrar alerta
```

### 4. Admin vê tudo em tempo real
- 📊 Estatísticas atualizadas
- 🗺️ Mapa com todos os entregadores
- 📦 Tabela de pedidos
- 🚨 Alertas de proximidade

---

## 📱 Recursos Adicionais

### Filtros de Pedidos

```typescript
const [filter, setFilter] = useState('OUT_FOR_DELIVERY');

const filteredOrders = orders.filter((order) => {
  if (filter === 'ALL') return true;
  return order.status === filter;
});
```

### Busca de Pedidos

```typescript
const [searchTerm, setSearchTerm] = useState('');

const searchedOrders = orders.filter((order) =>
  order.orderNumber.includes(searchTerm) ||
  order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### Exportar Relatório

```typescript
const exportReport = () => {
  const data = orders.map((order) => ({
    'Pedido': order.orderNumber,
    'Cliente': order.customerName,
    'Entregador': order.driver?.name,
    'Status': order.status,
    'Total': order.total,
  }));

  // Usar biblioteca como xlsx
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Entregas');
  XLSX.writeFile(wb, 'entregas.xlsx');
};
```

---

## ✅ Checklist

- [ ] Conectar ao WebSocket
- [ ] Se inscrever no estabelecimento
- [ ] Receber novos pedidos
- [ ] Monitorar localização
- [ ] Monitorar ETA
- [ ] Receber alertas de geofencing
- [ ] Mostrar mapa
- [ ] Mostrar tabela
- [ ] Mostrar estatísticas
- [ ] Testar reconexão
- [ ] Testar com múltiplos pedidos

---

## 🚀 Próximos Passos

1. ✅ Implementar rastreamento básico
2. ✅ Implementar ETA
3. ✅ Implementar geofencing
4. ⏳ Adicionar filtros avançados
5. ⏳ Adicionar exportação de relatórios
6. ⏳ Adicionar notificações por email
7. ⏳ Adicionar integração com SMS

