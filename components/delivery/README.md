# Módulo de Delivery

Este módulo implementa o sistema completo de delivery conforme especificado em `docs/DELIVERY_FRONTEND_INTEGRATION.md`.

## Estrutura de Arquivos

```
components/delivery/
├── delivery-order-card.tsx          # Card de pedido na lista
├── delivery-order-details-modal.tsx # Modal com detalhes completos do pedido
├── update-status-modal.tsx          # Modal para atualizar status do pedido
├── delivery-zones-table.tsx         # Tabela de zonas de entrega
├── create-zone-modal.tsx            # Modal para criar zona de entrega
├── live-order-tracking.tsx          # Rastreamento em tempo real (WebSocket)
└── README.md                        # Este arquivo

lib/api/
└── delivery.ts                      # Service layer para API

lib/types/
└── delivery.ts                      # Types e interfaces TypeScript

lib/hooks/
├── use-delivery.ts                  # Hook para pedidos e zonas
└── use-delivery-websocket.ts        # Hook para WebSocket (tempo real)

lib/services/
└── delivery-websocket.ts            # Serviço WebSocket

app/(dashboard)/
└── delivery/
    └── page.tsx                     # Página principal de delivery
```

## Funcionalidades Implementadas

### ✅ Gestão de Pedidos
- Listagem de pedidos com filtros por status
- Visualização detalhada de pedidos
- Atualização de status
- Cards informativos com estatísticas

### ✅ Zonas de Entrega
- Criação de zonas
- Listagem em tabela
- Configuração de taxa de entrega
- Entrega grátis por valor mínimo
- Tempo estimado de entrega

### ✅ Interface
- Design responsivo
- Filtros por status
- Modais para ações
- Feedback visual (toasts)
- Loading states

### 🔄 Tempo Real (WebSocket) - Preparado
- Serviço WebSocket configurado
- Hooks para rastreamento
- Componente de rastreamento ao vivo
- Notificações de novos pedidos
- Atualização de localização do entregador

## Como Usar

### 1. Acessar a Página de Delivery

Navegue para `/delivery` no dashboard. O link já foi adicionado ao sidebar.

### 2. Visualizar Pedidos

A página mostra:
- Total de pedidos ativos
- Total geral de pedidos
- Número de zonas de entrega
- Lista de pedidos em cards

### 3. Filtrar Pedidos

Use o dropdown para filtrar por status:
- Todos
- Pendente
- Confirmado
- Preparando
- Pronto para Entrega
- Saiu para Entrega
- Entregue
- Cancelado

### 4. Atualizar Status

1. Clique em "Atualizar Status" no card do pedido
2. Selecione o novo status
3. Adicione uma descrição
4. Confirme

### 5. Gerenciar Zonas

1. Clique na aba "Zonas de Entrega"
2. Clique em "+ Nova Zona"
3. Preencha:
   - Nome da zona
   - Bairros (separados por vírgula)
   - Taxa de entrega
   - Valor mínimo para entrega grátis (opcional)
   - Tempo estimado em minutos

## Habilitar WebSocket (Opcional)

Para habilitar rastreamento em tempo real:

### 1. Instalar Dependência

```bash
npm install socket.io-client
```

### 2. Descomentar Código

Em `lib/services/delivery-websocket.ts`, descomente o código do método `connect()`.

### 3. Configurar Backend

Certifique-se de que o backend está com WebSocket habilitado na rota `/delivery`.

### 4. Usar Rastreamento ao Vivo

```tsx
import { LiveOrderTracking } from '@/components/delivery/live-order-tracking';

<LiveOrderTracking
  establishmentId={establishmentId}
  orderId={orderId}
  onClose={() => setShowTracking(false)}
/>
```

## Integração com Backend

O módulo está integrado com a API conforme especificado:

### Endpoints Utilizados

- `GET /business/establishments/:id/delivery/orders` - Listar pedidos
- `GET /business/establishments/:id/delivery/orders/:orderId` - Detalhes do pedido
- `PATCH /business/establishments/:id/delivery/orders/:orderId/status` - Atualizar status
- `GET /business/establishments/:id/delivery/zones` - Listar zonas
- `POST /business/establishments/:id/delivery/zones` - Criar zona
- `POST /business/establishments/:id/delivery/calculate-fee` - Calcular taxa

### WebSocket Events (quando habilitado)

- `status:update` - Atualização de status
- `location:update` - Atualização de localização
- `order:new` - Novo pedido
- `order:update` - Pedido atualizado

## Próximos Passos

### Funcionalidades Adicionais

1. **Edição de Zonas**
   - Implementar modal de edição
   - Adicionar validações

2. **Exclusão de Zonas**
   - Adicionar confirmação
   - Verificar pedidos ativos

3. **Criação de Pedidos**
   - Formulário completo
   - Seleção de produtos
   - Cálculo automático de taxa

4. **Atribuição de Motorista**
   - Lista de motoristas disponíveis
   - Atribuição manual
   - Notificação ao motorista

5. **Mapa de Rastreamento**
   - Instalar `react-leaflet`
   - Mostrar rota no mapa
   - Atualização em tempo real

6. **Relatórios**
   - Pedidos por período
   - Desempenho de motoristas
   - Zonas mais ativas

7. **Notificações Push**
   - Integrar com Firebase
   - Notificar novos pedidos
   - Alertas de atraso

## Dependências Opcionais

Para funcionalidades avançadas:

```bash
# WebSocket
npm install socket.io-client

# Mapas
npm install react-leaflet leaflet
npm install -D @types/leaflet

# Notificações
npm install react-hot-toast

# Geolocalização
# Já disponível no navegador via navigator.geolocation
```

## Troubleshooting

### Pedidos não carregam
- Verifique se o estabelecimento está selecionado
- Confirme que o backend está rodando
- Verifique o console para erros de API

### WebSocket não conecta
- Certifique-se de que `socket.io-client` está instalado
- Verifique se o backend tem WebSocket habilitado
- Confirme a URL do servidor

### Zonas não aparecem
- Verifique se há zonas cadastradas no backend
- Confirme as permissões do usuário
- Verifique o console para erros

## Suporte

Para mais informações, consulte:
- `docs/DELIVERY_FRONTEND_INTEGRATION.md` - Documentação completa
- `docs/API_CONTRACT.md` - Contrato da API
- Backend: `business/docs/DELIVERY_SPEC.md`
