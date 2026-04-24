# 📦 Integração Atual do Sistema de Delivery

## 🎯 Implementações Recentes

### 1. **Badge de Notificação no Menu** ✅
- **Arquivo**: `components/dashboard/sidebar.tsx`
- **Hook**: `lib/hooks/use-pending-delivery-count.ts`
- Mostra contador de pedidos pendentes no ícone de delivery
- Atualiza a cada 30 segundos
- Exibe "99+" para mais de 99 pedidos

---

### 2. **Dashboard de Rastreamento em Tempo Real** ✅
- **Arquivo**: `app/(dashboard)/delivery/page.tsx`
- **Hook**: `lib/hooks/use-delivery-realtime.ts`
- Nova aba "Dashboard" com rastreamento em tempo real

**Componentes:**
- `components/delivery/delivery-realtime-stats.tsx` - Estatísticas
- `components/delivery/delivery-realtime-map.tsx` - Mapa com Google Maps
- `components/delivery/delivery-realtime-table.tsx` - Tabela de pedidos
- `components/delivery/delivery-geofence-alerts.tsx` - Alertas de proximidade

**Funcionalidades:**
- ✅ Status de conexão WebSocket (🟢 Conectado / 🔴 Desconectado)
- ✅ Estatísticas em tempo real (Total, Pendentes, Em Entrega, Entregues, Falhas)
- ✅ Mapa com marcadores dos entregadores
- ✅ Tabela com ETA de cada pedido
- ✅ Alertas de geofencing (proximidade)
- ✅ Sincronização entre mapa e tabela

---

### 3. **Gerenciamento de Entregadores** ✅
- **Arquivo**: `app/(dashboard)/delivery/drivers/page.tsx`
- **Hook**: `lib/hooks/use-delivery-drivers.ts`

**Funcionalidades:**
- ✅ Listar entregadores
- ✅ Criar novo entregador
- ✅ Editar entregador
- ✅ Deletar entregador
- ✅ Ativar/Desativar
- ✅ Marcar como disponível/ocupado
- ✅ Upload de fotos do veículo (Frente, Trás, Lateral)
- ✅ Foto de perfil

**Fotos do Veículo:**
- GET: `/business/establishments/:id/delivery/drivers/:driverId/vehicle-photos`
- POST: `/business/establishments/:id/delivery/drivers/:driverId/vehicle-photos`
- PATCH: `/business/establishments/:id/delivery/drivers/:driverId/vehicle-photos/:photoType`

---

### 4. **Atualização de Status com Entregador** ✅
- **Arquivo**: `components/delivery/update-status-modal.tsx`
- **API**: `lib/api/delivery.ts`

**Fluxo:**
1. Ao selecionar "Saiu para Entrega", busca entregadores ativos
2. Select obrigatório para escolher entregador
3. Envia PATCH com `driverId` no body
4. Descrição agora é opcional

**Endpoint:**
```
PATCH /business/establishments/:id/delivery/orders/:orderId/status
{
  "status": "out_for_delivery",
  "driverId": "uuid-do-entregador",
  "description": "Saiu para entrega"
}
```

---

### 5. **Eventos WebSocket em Tempo Real** ✅
- **Hook**: `lib/hooks/use-delivery-realtime.ts`

**Eventos Recebidos:**
- `driver:location` - Localização do entregador
- `driver:eta` - ETA (Tempo de Chegada Estimado)
- `driver:geofence` - Alertas de proximidade

**Eventos Enviados:**
- `subscribe:establishment` - Se inscrever no estabelecimento

---

## 📊 Estrutura de Dados

### VehiclePhoto
```typescript
{
  photo: string;           // URL ou base64
  photoType: 'front' | 'back' | 'side';
}
```

### Driver
```typescript
{
  id: string;
  name: string;
  phone: string;
  email?: string;
  vehicleType: 'motorcycle' | 'bicycle' | 'car' | 'van' | 'truck';
  vehiclePlate?: string;
  profilePhoto?: string;
  vehiclePhotos?: VehiclePhoto[];
  isActive: boolean;
  isAvailable: boolean;
  totalDeliveries: number;
  averageRating: number;
}
```

---

## 🔌 Configuração WebSocket

**Variáveis de Ambiente:**
```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

**Conexão:**
```typescript
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  auth: {
    token: `Bearer ${token}`,
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

socket.emit('subscribe:establishment', { establishmentId });
```

---

## 📁 Arquivos Principais

| Arquivo | Descrição |
|---------|-----------|
| `app/(dashboard)/delivery/page.tsx` | Dashboard principal com abas |
| `app/(dashboard)/delivery/drivers/page.tsx` | Gerenciamento de entregadores |
| `components/delivery/update-status-modal.tsx` | Modal de atualizar status |
| `components/delivery/delivery-realtime-*.tsx` | Componentes do dashboard em tempo real |
| `lib/hooks/use-delivery-realtime.ts` | Hook para WebSocket |
| `lib/hooks/use-delivery-drivers.ts` | Hook para gerenciar drivers |
| `lib/hooks/use-pending-delivery-count.ts` | Hook para contar pedidos pendentes |
| `lib/api/delivery.ts` | API de delivery |
| `components/dashboard/sidebar.tsx` | Menu com badge de notificação |

---

## 🎯 Fluxo de Uso

### 1. Dashboard de Delivery
```
/dashboard/delivery
├── Aba: Dashboard (Rastreamento em Tempo Real)
│   ├── Estatísticas
│   ├── Mapa com entregadores
│   ├── Tabela de pedidos
│   └── Alertas de proximidade
├── Aba: Pedidos
│   ├── Listar pedidos
│   ├── Filtrar por status
│   └── Atualizar status (com seleção de entregador)
└── Aba: Zonas de Entrega
    ├── Listar zonas
    ├── Criar zona
    └── Editar/Deletar zona
```

### 2. Gerenciamento de Entregadores
```
/dashboard/delivery/drivers
├── Listar entregadores
├── Criar novo
├── Editar (com upload de fotos)
├── Deletar
├── Ativar/Desativar
└── Marcar como disponível/ocupado
```

### 3. Atualizar Status
```
Modal de Atualização
├── Selecionar novo status
├── Se "Saiu para Entrega":
│   └── Selecionar entregador (obrigatório)
├── Descrição (opcional)
└── Confirmar
```

---

## 🔄 Fluxo de Fotos do Veículo

### Criação:
1. Usuário seleciona foto
2. Converte para base64
3. Envia no array `vehiclePhotos` junto com dados do driver
4. Backend salva e retorna URL

### Edição:
1. Ao abrir form, busca fotos via GET
2. Usuário seleciona nova foto
3. Tenta PATCH (se não existir, faz POST)
4. Backend salva e retorna URL
5. Frontend mapeia `photoUrl` → `photo`

---

## 📝 Checklist de Funcionalidades

### Dashboard
- [x] Badge de notificação no menu
- [x] Aba de rastreamento em tempo real
- [x] Estatísticas em tempo real
- [x] Mapa com entregadores
- [x] Tabela de pedidos com ETA
- [x] Alertas de geofencing
- [x] Atualizar status com entregador
- [x] Descrição opcional

### Entregadores
- [x] Listar entregadores
- [x] Criar entregador
- [x] Editar entregador
- [x] Deletar entregador
- [x] Ativar/Desativar
- [x] Disponível/Ocupado
- [x] Upload de fotos do veículo
- [x] Foto de perfil

### WebSocket
- [x] Conexão com autenticação
- [x] Reconexão automática
- [x] Receber localização
- [x] Receber ETA
- [x] Receber alertas de geofencing

---

## 🚀 Próximas Melhorias

- [ ] Histórico de entregas
- [ ] Avaliação de entregadores
- [ ] Agendamento de entregas
- [ ] Integração com SMS/WhatsApp
- [ ] Relatórios avançados
- [ ] Exportação de dados

---

## 📞 Suporte

Para dúvidas sobre integração, consulte:
- `DELIVERY_REALTIME_IMPLEMENTATION_MAP.md` - Mapa de implementação
- `docs/DELIVERY_DASHBOARD_REALTIME_IMPLEMENTATION.md` - Documentação técnica
