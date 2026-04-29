# 🎨 Guia Visual - Sistema de Pedidos Internos

## 📺 Tela KDS (Kitchen Display System)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  🍳 Cozinha                                    🔊 Som  ⏸️ Auto  🔄 Atualizar │
│  Kitchen Display System                                                     │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ 🆕 Novo     │  │ ✓ Confirmado │  │ 👨‍🍳 Preparando│  │ ✅ Pronto    │   │
│  │ [3]         │  │ [1]         │  │ [2]         │  │ [1]         │   │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤  ├──────────────┤   │
│  │              │  │              │  │              │  │              │   │
│  │ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │   │
│  │ │ #042     │ │  │ │ #041     │ │  │ │ #040     │ │  │ │ #039     │ │   │
│  │ │ 🏪 Balcão│ │  │ │ 🍽️ Mesa 5 │ │  │ │ 🚚 Entrega│ │  │ │ 🏪 Balcão│ │   │
│  │ │ ⬆️ Alta  │ │  │ │ ➡️ Normal │ │  │ │ ➡️ Normal │ │  │ │ ⬇️ Baixa │ │   │
│  │ │ ⏱️ 5/15  │ │  │ │ ⏱️ 8/20  │ │  │ │ ⏱️ 12/15 │ │  │ │ ⏱️ 18/20 │ │   │
│  │ │ 2x Burger│ │  │ │ 1x Prato │ │  │ │ 3x Pastel│ │  │ │ 1x Pizza │ │   │
│  │ │ 1x Refri │ │  │ │ 1x Sobre │ │  │ │ 2x Refri │ │  │ │ 1x Refri │ │   │
│  │ │ Sem cebo │ │  │ │          │ │  │ │ Sem sal  │ │  │ │          │ │   │
│  │ │          │ │  │ │          │ │  │ │          │ │  │ │          │ │   │
│  │ │ Clique   │ │  │ │ Clique   │ │  │ │ Clique   │ │  │ │ Clique   │ │   │
│  │ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │   │
│  │              │  │              │  │              │  │              │   │
│  │ ┌──────────┐ │  │              │  │              │  │              │   │
│  │ │ #043     │ │  │              │  │              │  │              │   │
│  │ │ 🍽️ Mesa 3 │ │  │              │  │              │  │              │   │
│  │ │ ➡️ Normal │ │  │              │  │              │  │              │   │
│  │ │ ⏱️ 2/15  │ │  │              │  │              │  │              │   │
│  │ │ 2x Prato │ │  │              │  │              │  │              │   │
│  │ │ 1x Refri │ │  │              │  │              │  │              │   │
│  │ │          │ │  │              │  │              │  │              │   │
│  │ │ Clique   │ │  │              │  │              │  │              │   │
│  │ └──────────┘ │  │              │  │              │  │              │   │
│  │              │  │              │  │              │  │              │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 📱 Tela de Senhas

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  Acompanhamento de Pedidos                              ⏸️ Auto  ▶️ Manual  │
│  Verifique o status da sua senha                                           │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │              │  │              │  │              │  │              │   │
│  │     042      │  │     041      │  │     040      │  │     039      │   │
│  │              │  │              │  │              │  │              │   │
│  │   🆕 Novo    │  │  ✓ Confirmado│  │ 👨‍🍳 Preparando│  │   ✅ Pronto   │   │
│  │              │  │              │  │              │  │              │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │              │  │              │  │              │  │              │   │
│  │     043      │  │     044      │  │     045      │  │     046      │   │
│  │              │  │              │  │              │  │              │   │
│  │ ✓ Confirmado │  │ 👨‍🍳 Preparando│  │   ✅ Pronto   │  │   ✅ Pronto   │   │
│  │              │  │              │  │              │  │              │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Clique em uma senha para ver detalhes
```

## 🔍 Modal de Detalhes (Tela de Senhas)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                                                                        ×    │
│                                                                             │
│                                                                             │
│                              ┌──────────────┐                              │
│                              │              │                              │
│                              │     042      │                              │
│                              │              │                              │
│                              └──────────────┘                              │
│                                                                             │
│                          ┌──────────────────┐                              │
│                          │ 👨‍🍳 Preparando    │                              │
│                          └──────────────────┘                              │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Seu Pedido:                                                         │   │
│  │ 2x Hambúrguer                                                       │   │
│  │ 1x Refrigerante                                                     │   │
│  │ (Sem cebola)                                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Tempo de preparo                                                    │   │
│  │ 5 / 15 min                                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 👨‍🍳 Preparando seu pedido...                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                              ┌──────────────┐                              │
│                              │   Fechar     │                              │
│                              └──────────────┘                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 📋 Modal de Atualização de Status

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  Atualizar Status                                                      ×   │
│  Pedido #042                                                               │
│  Status atual: Novo Pedido                                                 │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Itens do Pedido                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 2x Hambúrguer                                                       │   │
│  │ 1x Refrigerante                                                     │   │
│  │ (Sem cebola)                                                        │   │
│  │                                                                     │   │
│  │ 📝 Nota: Cliente com pressa                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Novo Status *                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐                       │
│  │ ✓ Confirmado         │  │ 👨‍🍳 Preparando       │                       │
│  └──────────────────────┘  └──────────────────────┘                       │
│                                                                             │
│  Observação (opcional)                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Ex: Faltava um ingrediente, pedido pronto mais cedo, etc.          │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ⏱️ Tempo decorrido: 5 minutos                                              │
│  ⏳ Tempo estimado: 15 minutos                                              │
│                                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐                       │
│  │ Cancelar             │  │ Atualizar Status     │                       │
│  └──────────────────────┘  └──────────────────────┘                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Pedido

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  PDV (Venda Finalizada)                                                     │
│  ├─ Tipo: 🏪 Balcão                                                         │
│  ├─ Itens: 2x Burger, 1x Refri                                              │
│  ├─ Notas: Sem cebola                                                       │
│  └─ Prioridade: Normal                                                      │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│  Criar Pedido Interno (PENDING)                                             │
│  ├─ Número: #042                                                            │
│  ├─ Status: 🆕 Novo                                                         │
│  └─ Tempo: 0/15 min                                                         │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│  KDS Atualiza (Auto-refresh)                                                │
│  ├─ Som toca 🔊                                                             │
│  ├─ Card aparece em "Novo"                                                  │
│  └─ Tela de senhas atualiza                                                 │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│  Cozinha Confirma (CONFIRMED)                                               │
│  ├─ Status: ✓ Confirmado                                                    │
│  └─ Card move para "Confirmado"                                             │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│  Cozinha Começa Preparo (PREPARING)                                         │
│  ├─ Status: 👨‍🍳 Preparando                                                  │
│  └─ Card move para "Preparando"                                             │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│  Cozinha Marca Pronto (READY)                                               │
│  ├─ Status: ✅ Pronto                                                       │
│  ├─ Som toca 🔊                                                             │
│  └─ Card move para "Pronto"                                                 │
│                                                                             │
│                              ↓                                              │
│                                                                             │
│  Cliente Retira (PICKED_UP)                                                 │
│  ├─ Status: 📦 Retirado                                                     │
│  └─ Pedido finalizado                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🎨 Paleta de Cores

```
Status          Cor         Hex      RGB
─────────────────────────────────────────
PENDING         Vermelho    #EF4444  (239, 68, 68)
CONFIRMED       Amarelo     #EAB308  (234, 179, 8)
PREPARING       Azul        #3B82F6  (59, 130, 246)
READY           Verde       #22C55E  (34, 197, 94)
PICKED_UP       Cinza       #6B7280  (107, 114, 128)
CANCELLED       Cinza       #6B7280  (107, 114, 128)
```

## 📊 Estrutura de Dados

```
KitchenOrder
├── id: string
├── orderNumber: string (senha)
├── orderType: 'counter' | 'dine_in' | 'delivery'
├── status: KitchenOrderStatus
├── priority: 'low' | 'normal' | 'high'
├── items: KitchenOrderItem[]
│   ├── productName: string
│   ├── quantity: number
│   ├── unitPrice: number
│   ├── notes: string
│   └── preparationTime: number
├── customerName: string
├── customerPhone: string
├── tableNumber: number (se dine_in)
├── estimatedPrepTime: number
├── total: number
├── discount: number
├── notes: string
├── createdAt: string
├── confirmedAt: string
├── startedAt: string
├── readyAt: string
├── pickedUpAt: string
└── history: KitchenOrderHistory[]
    ├── status: KitchenOrderStatus
    ├── description: string
    ├── timestamp: string
    └── staffName: string
```

## 🔌 Integração com PDV

```
PDV Page
├── Estado
│   ├── orderType: 'counter' | 'dine_in' | 'delivery'
│   ├── tableNumber: number (se dine_in)
│   ├── orderNotes: string
│   └── items: CartItem[]
│
├── UI
│   ├── Botões de tipo (Balcão, Mesa, Entrega)
│   ├── Campo de número de mesa (se dine_in)
│   ├── Campo de notas
│   └── Botão de finalizar
│
└── Ação
    └── handleCheckout()
        ├── Criar venda
        ├── Criar pedido interno
        ├── Limpar carrinho
        └── Mostrar sucesso
```

## 📱 Responsividade

```
Desktop (1920px)
├── KDS: 4 colunas lado a lado
└── Senhas: Grid 4x4

Tablet (768px)
├── KDS: 2 colunas
└── Senhas: Grid 2x2

Mobile (375px)
├── KDS: 1 coluna (scroll horizontal)
└── Senhas: Grid 1x1 (scroll vertical)
```

---

**Versão**: 1.0.0
**Status**: ✅ Completo
