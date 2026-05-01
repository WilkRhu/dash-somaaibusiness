# Kitchen Mobile App - Guia de Implementação

## Visão Geral

Este documento descreve como replicar as funcionalidades do painel de cozinha (Kitchen Display System) em um app mobile, utilizando as mesmas rotas de API do backend.

## Rotas de API Disponíveis

### Base URL
```
/business/establishments/{establishmentId}/kitchen-orders
```

### Endpoints

#### 1. Listar Pedidos
```
GET /business/establishments/{establishmentId}/kitchen-orders
```

**Query Parameters:**
- `status` (opcional): Filtrar por status (pending, confirmed, preparing, ready, picked_up, cancelled)
- `orderType` (opcional): Filtrar por tipo (counter, dine_in, delivery)
- `startDate` (opcional): Data inicial (ISO 8601)
- `endDate` (opcional): Data final (ISO 8601)
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 50)

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "orderNumber": "string",
      "establishmentId": "string",
      "orderType": "counter|dine_in|delivery",
      "customerName": "string",
      "customerPhone": "string",
      "tableNumber": "number",
      "items": [
        {
          "id": "string",
          "inventoryItemId": "string",
          "productName": "string",
          "quantity": "number",
          "unitPrice": "number",
          "notes": "string",
          "preparationTime": "number"
        }
      ],
      "subtotal": "number",
      "discount": "number",
      "total": "number",
      "status": "pending|confirmed|preparing|ready|picked_up|cancelled",
      "estimatedPrepTime": "number",
      "createdAt": "ISO 8601",
      "updatedAt": "ISO 8601",
      "confirmedAt": "ISO 8601",
      "startedAt": "ISO 8601",
      "readyAt": "ISO 8601",
      "pickedUpAt": "ISO 8601",
      "notes": "string",
      "priority": "low|normal|high",
      "isPaid": "boolean",
      "history": [
        {
          "id": "string",
          "status": "string",
          "description": "string",
          "timestamp": "ISO 8601",
          "staffName": "string"
        }
      ]
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

#### 2. Obter Pedido por ID
```
GET /business/establishments/{establishmentId}/kitchen-orders/{orderId}
```

**Response:** Mesmo formato de um pedido individual

#### 3. Criar Pedido
```
POST /business/establishments/{establishmentId}/kitchen-orders
```

**Request Body:**
```json
{
  "orderType": "counter|dine_in|delivery",
  "customerName": "string (opcional)",
  "customerPhone": "string (opcional)",
  "tableNumber": "number (opcional)",
  "items": [
    {
      "inventoryItemId": "string (opcional)",
      "productName": "string",
      "quantity": "number",
      "unitPrice": "number",
      "notes": "string (opcional)",
      "preparationTime": "number (opcional)"
    }
  ],
  "discount": "number (opcional)",
  "notes": "string (opcional)",
  "priority": "low|normal|high (opcional)"
}
```

#### 4. Atualizar Status do Pedido
```
PUT /business/establishments/{establishmentId}/kitchen-orders/{orderId}/status/{status}
```

**Path Parameters:**
- `status`: pending, confirmed, preparing, ready, picked_up, cancelled

**Response:** Pedido atualizado

#### 5. Atualizar Pedido
```
PUT /business/establishments/{establishmentId}/kitchen-orders/{orderId}
```

**Request Body:** Qualquer campo do pedido para atualizar

#### 6. Deletar Pedido
```
DELETE /business/establishments/{establishmentId}/kitchen-orders/{orderId}
```

#### 7. Obter Histórico de Status
```
GET /business/establishments/{establishmentId}/kitchen-orders/{orderId}/history
```

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "previousStatus": "string",
      "newStatus": "string",
      "changedBy": {
        "id": "string",
        "name": "string"
      },
      "createdAt": "ISO 8601"
    }
  ]
}
```

## Fluxo de Dados

### 1. Inicialização
- Obter `establishmentId` do usuário logado
- Fazer requisição GET para listar pedidos ativos
- Filtrar pedidos com status: pending, confirmed, preparing, ready

### 2. Atualização em Tempo Real
- Implementar polling a cada 30 segundos OU
- Implementar WebSocket para atualizações em tempo real
- Atualizar lista local quando novos pedidos chegam

### 3. Mudança de Status
- Usuário toca em um pedido
- Seleciona novo status
- Faz PUT para `/kitchen-orders/{orderId}/status/{status}`
- Atualiza lista local com resposta

### 4. Criação de Pedido
- Usuário preenche formulário
- Faz POST para criar pedido
- Adiciona novo pedido à lista

## Estados de Pedido

```
PENDING (Recebido)
  ↓
CONFIRMED (Confirmado)
  ↓
PREPARING (Preparando)
  ↓
READY (Pronto)
  ↓
PICKED_UP (Retirado)

OU

CANCELLED (Cancelado) - pode ser em qualquer estado
```

## Componentes Principais do App Mobile

### 1. Tela de Listagem de Pedidos
**Funcionalidades:**
- Exibir grid/lista de pedidos ativos
- Ordenar por: status (READY primeiro), tempo decorrido
- Filtrar por status
- Filtrar por tipo de pedido (counter, dine_in, delivery)
- Atualizar manualmente (botão refresh)
- Auto-refresh a cada 30 segundos

**Dados Exibidos por Pedido:**
- Número do pedido (grande e destacado)
- Status (com cor específica)
- Tipo de pedido (ícone + label)
- Número da mesa (se dine_in)
- Nome do cliente
- Tempo decorrido vs tempo estimado
- Lista de itens
- Prioridade (se alta)
- Indicador visual se está atrasado

**Cores por Status:**
- PENDING: Vermelho (#dc2626)
- CONFIRMED: Amarelo (#eab308)
- PREPARING: Azul (#2563eb)
- READY: Verde (#16a34a) - com destaque/animação
- PICKED_UP: Cinza
- CANCELLED: Cinza escuro

### 2. Tela de Detalhes do Pedido
**Funcionalidades:**
- Exibir todos os detalhes do pedido
- Botões para mudar status
- Exibir histórico de mudanças
- Opção para cancelar pedido
- Exibir notas/observações

**Fluxo de Mudança de Status:**
```
PENDING → CONFIRMED → PREPARING → READY → PICKED_UP
```

### 3. Tela de Criação de Pedido
**Funcionalidades:**
- Formulário para criar novo pedido
- Selecionar tipo (counter, dine_in, delivery)
- Adicionar itens (nome, quantidade, preço)
- Adicionar observações
- Definir prioridade
- Salvar pedido

### 4. Filtros e Busca
**Funcionalidades:**
- Filtrar por status
- Filtrar por tipo de pedido
- Buscar por número do pedido
- Buscar por nome do cliente
- Filtrar por data

## Autenticação

Todos os endpoints requerem:
- Header `Authorization: Bearer {token}`
- O token deve ser obtido no login

## Roles e Permissões para Cozinha

### Roles Disponíveis

#### 1. **kitchen_chef** (Chef de Cozinha)
**Permissões:**
- Gerenciar cozinha
- Visualizar pedidos
- Atualizar status de pedidos
- Gerenciar cozinheiros
- Ver relatórios de cozinha

**Acesso no App:**
- ✅ Listar todos os pedidos
- ✅ Atualizar status de qualquer pedido
- ✅ Criar pedidos
- ✅ Cancelar pedidos
- ✅ Ver histórico completo
- ✅ Gerenciar equipe de cozinha
- ✅ Acessar relatórios

#### 2. **kitchen_cook** (Cozinheiro)
**Permissões:**
- Visualizar pedidos
- Atualizar status de pedidos
- Ver cardápio

**Acesso no App:**
- ✅ Listar pedidos ativos
- ✅ Atualizar status do pedido (pending → confirmed → preparing → ready)
- ✅ Ver detalhes do pedido
- ✅ Ver cardápio/itens
- ❌ Criar pedidos
- ❌ Cancelar pedidos
- ❌ Ver histórico completo
- ❌ Gerenciar equipe

#### 3. **kitchen_assistant** (Auxiliar de Cozinha)
**Permissões:**
- Visualizar pedidos
- Auxiliar na preparação

**Acesso no App:**
- ✅ Listar pedidos ativos (somente leitura)
- ✅ Ver detalhes do pedido
- ✅ Ver cardápio/itens
- ❌ Atualizar status
- ❌ Criar pedidos
- ❌ Cancelar pedidos

### Controle de Acesso por Role

```typescript
interface KitchenRolePermissions {
  kitchen_chef: {
    canViewAllOrders: true;
    canCreateOrder: true;
    canUpdateOrderStatus: true;
    canCancelOrder: true;
    canViewHistory: true;
    canManageTeam: true;
    canViewReports: true;
  };
  kitchen_cook: {
    canViewAllOrders: true;
    canCreateOrder: false;
    canUpdateOrderStatus: true;
    canCancelOrder: false;
    canViewHistory: false;
    canManageTeam: false;
    canViewReports: false;
  };
  kitchen_assistant: {
    canViewAllOrders: true;
    canCreateOrder: false;
    canUpdateOrderStatus: false;
    canCancelOrder: false;
    canViewHistory: false;
    canManageTeam: false;
    canViewReports: false;
  };
}
```

### Implementação de Controle de Acesso

**No App Mobile:**

1. **Obter role do usuário** após login
2. **Validar permissões** antes de exibir botões/funcionalidades
3. **Desabilitar ações** não permitidas
4. **Mostrar mensagem** se usuário tentar acessar recurso sem permissão

**Exemplo:**
```
Se role === 'kitchen_cook':
  - Mostrar botão "Confirmar" (pending → confirmed)
  - Mostrar botão "Preparando" (confirmed → preparing)
  - Mostrar botão "Pronto" (preparing → ready)
  - NÃO mostrar botão "Criar Pedido"
  - NÃO mostrar botão "Cancelar"

Se role === 'kitchen_assistant':
  - Mostrar apenas lista de pedidos
  - NÃO mostrar botões de ação
  - Mostrar modo "somente leitura"

Se role === 'kitchen_chef':
  - Mostrar todos os botões
  - Mostrar opções de gerenciamento
  - Mostrar relatórios
```

### Fluxo de Autorização

1. **Login** → Obter token e role
2. **Inicializar App** → Validar role
3. **Renderizar Telas** → Mostrar/ocultar funcionalidades conforme role
4. **Executar Ação** → Validar permissão antes de fazer requisição
5. **Tratamento de Erro 403** → Mostrar mensagem "Sem permissão"

### Estados Visuais por Role

**kitchen_chef:**
- Tela completa com todos os controles
- Botões de ação habilitados
- Acesso a relatórios e gerenciamento

**kitchen_cook:**
- Tela com controles de status
- Botões de ação habilitados (apenas status)
- Sem acesso a criação/cancelamento

**kitchen_assistant:**
- Tela em modo "somente leitura"
- Sem botões de ação
- Apenas visualização de pedidos

## Tratamento de Erros

**Códigos HTTP esperados:**
- 200: Sucesso
- 201: Criado com sucesso
- 400: Requisição inválida
- 401: Não autenticado
- 403: Não autorizado
- 404: Não encontrado
- 500: Erro do servidor

**Tratamento:**
- Exibir mensagem de erro ao usuário
- Fazer retry automático para erros de rede
- Manter dados em cache local para offline

## Performance e Otimizações

### Caching
- Cachear lista de pedidos localmente
- Atualizar cache a cada 30 segundos
- Permitir refresh manual

### Paginação
- Usar `limit=50` por padrão
- Implementar lazy loading se necessário
- Carregar mais pedidos ao scroll

### Filtros
- Aplicar filtros localmente quando possível
- Usar query parameters para filtros complexos

## Notificações

**Eventos para notificar:**
- Novo pedido recebido
- Pedido pronto para retirada
- Pedido cancelado
- Erro ao atualizar status

## Exemplo de Fluxo Completo

### 1. Inicializar App
```
GET /business/establishments/{establishmentId}/kitchen-orders?status=pending,confirmed,preparing,ready
```

### 2. Exibir Pedidos
- Renderizar lista com pedidos recebidos
- Ordenar por status e tempo

### 3. Usuário Toca em Pedido
- Exibir detalhes
- Mostrar opções de status

### 4. Usuário Muda Status para "PREPARING"
```
PUT /business/establishments/{establishmentId}/kitchen-orders/{orderId}/status/preparing
```

### 5. Atualizar Lista
- Remover pedido da lista anterior
- Adicionar à nova posição conforme novo status

### 6. Auto-refresh a Cada 30s
```
GET /business/establishments/{establishmentId}/kitchen-orders?status=pending,confirmed,preparing,ready
```

## Dados Necessários do Usuário

- `establishmentId`: ID do estabelecimento
- `token`: Token de autenticação
- `userId`: ID do usuário (para auditoria)

## Notas Importantes

1. **Sincronização**: Sempre sincronizar com o backend antes de fazer mudanças
2. **Validação**: Validar dados localmente antes de enviar
3. **Feedback**: Mostrar loading/spinner durante requisições
4. **Offline**: Implementar fila de sincronização para modo offline
5. **Segurança**: Nunca armazenar token em localStorage (usar secure storage)
6. **Performance**: Limitar requisições simultâneas
7. **UX**: Mostrar confirmação antes de ações destrutivas (cancelar pedido)

## Estrutura de Dados Recomendada

```typescript
interface KitchenOrder {
  id: string;
  orderNumber: string;
  establishmentId: string;
  orderType: 'counter' | 'dine_in' | 'delivery';
  customerName?: string;
  customerPhone?: string;
  tableNumber?: number;
  items: KitchenOrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'cancelled';
  estimatedPrepTime: number;
  createdAt: string;
  updatedAt?: string;
  confirmedAt?: string;
  startedAt?: string;
  readyAt?: string;
  pickedUpAt?: string;
  notes?: string;
  priority: 'low' | 'normal' | 'high';
  isPaid: boolean;
  history: KitchenOrderHistory[];
}

interface KitchenOrderItem {
  id: string;
  inventoryItemId?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
  preparationTime?: number;
}

interface KitchenOrderHistory {
  id: string;
  status: string;
  description: string;
  timestamp: string;
  staffName?: string;
}
```

## Replicando o /kitchen/display no App Mobile

Esta seção descreve exatamente como replicar a tela de `https://www.somaaibusiness.com.br/kitchen/display` em um app mobile.

### O que a tela faz

- Fundo preto, fullscreen
- Exibe um grid de cards de pedidos ativos (excluindo `picked_up` e `cancelled`)
- Cada card tem cor baseada no status
- Pedidos ordenados por: READY → PREPARING → CONFIRMED → PENDING
- Contador de tempo decorrido atualizado a cada 30 segundos
- Destaque visual (scale + ring) para pedidos com status READY
- Alerta vermelho para pedidos com alta prioridade
- Botão para pausar/retomar auto-refresh
- Botão para forçar atualização manual
- Atualização em tempo real via WebSocket

### Inicialização

1. Obter `establishmentId` (via parâmetro de rota ou login)
2. Fazer GET para listar pedidos com `limit=100`
3. Conectar ao WebSocket no namespace `/kitchen` passando `establishmentId` como query param
4. Iniciar timer de 30 segundos para atualizar o tempo decorrido dos cards

### WebSocket

**URL de conexão:**
```
{SOCKET_URL}/kitchen?establishmentId={establishmentId}
```

**Eventos que o app deve escutar:**

| Evento | Ação |
|---|---|
| `order:created` | Adicionar novo pedido à lista |
| `order:status-changed` | Atualizar pedido existente na lista |
| `order:updated` | Atualizar pedido existente na lista |
| `order:paid` | Remover pedido da lista |

**Configuração recomendada:**
```
reconnection: true
reconnectionDelay: 1000ms
reconnectionDelayMax: 5000ms
reconnectionAttempts: 10
transports: ['websocket', 'polling']
```

### Filtro e Ordenação dos Pedidos

**Filtrar (excluir da lista):**
- status === `picked_up`
- status === `cancelled`

**Ordenar por prioridade de status:**
```
READY      → posição 0 (primeiro)
PREPARING  → posição 1
CONFIRMED  → posição 2
PENDING    → posição 3
```

### Layout do Card de Pedido

Cada card exibe, de cima para baixo:

1. **Badge de status** (cor de fundo clara, texto colorido)
2. **Número do pedido** (fonte gigante, branca)
3. **Tipo de pedido** com ícone:
   - `dine_in` → 🍽️ Mesa + número da mesa
   - `delivery` → 🚗 Entrega
   - `counter` → 🛍️ Balcão
4. **Nome do cliente** (se existir)
5. **Tempo decorrido vs tempo estimado** (lado a lado)
   - Tempo em vermelho se ultrapassou o estimado (`elapsed > estimatedPrepTime`)
6. **Lista de itens** com quantidade e observações
7. **Banner de alta prioridade** (se `priority === 'high'`)
8. **Banner "PRONTO PARA RETIRADA"** animado (se status === `ready`)

### Cores por Status

| Status | Cor do Card | Label |
|---|---|---|
| `pending` | Vermelho `#dc2626` | RECEBIDO |
| `confirmed` | Amarelo `#eab308` | CONFIRMADO |
| `preparing` | Azul `#2563eb` | PREPARANDO |
| `ready` | Verde `#16a34a` | PRONTO |

**Destaque extra para READY:**
- Borda/ring verde ao redor do card
- Card levemente maior (scale 1.05)

### Lógica de Tempo

```
elapsedMinutes = floor((now - createdAt) / 60000)
isOvertime = estimatedPrepTime > 0 && elapsedMinutes > estimatedPrepTime
```

- Atualizar `now` a cada 30 segundos (quando autoRefresh ativo)
- Exibir `elapsedMinutes` em vermelho se `isOvertime === true`

### Estado Vazio

Quando não há pedidos ativos, exibir tela centralizada com:
- Emoji ✨
- Texto "Nenhum pedido no momento"
- Subtexto "Aguardando novos pedidos..."

### Controles da Tela

**Botão Pausar/Retomar:**
- Pausa o timer de 30 segundos
- Verde quando ativo, cinza quando pausado

**Botão Atualizar:**
- Força novo GET para a API
- Azul

### Normalização dos Dados da API

O backend pode retornar `dailyNumber` em vez de `orderNumber`. Normalizar assim:
```
orderNumber = raw.dailyNumber ?? raw.orderNumber ?? raw.orderId ?? raw.id
```

Campos numéricos como `unitPrice`, `subtotal`, `total`, `discount` devem ser convertidos com `parseFloat`.

## Próximos Passos

1. Escolher framework mobile (React Native, Flutter, etc)
2. Implementar cliente HTTP com autenticação
3. Criar estrutura de estado (Redux, Zustand, Provider, etc)
4. Implementar telas principais
5. Adicionar WebSocket para tempo real
6. Testar fluxos completos
7. Implementar offline support
