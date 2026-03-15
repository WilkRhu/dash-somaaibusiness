# 📊 Guia Visual - Integração Mercado Pago

## 🗺️ Mapa de Navegação

```
┌─────────────────────────────────────────────────────────────┐
│                    SISTEMA PRINCIPAL                         │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
        ┌───────▼────────┐        ┌────────▼──────────┐
        │  VENDAS        │        │  ESTABELECIMENTOS │
        │  /sales        │        │  /establishments  │
        └────────────────┘        └────────┬──────────┘
                │                          │
                │                    ┌─────▼──────────┐
                │                    │ MERCADO PAGO   │
                │                    │ /mercadopago   │
                │                    └────────────────┘
                │
        ┌───────▼──────────────┐
        │ VENDA PENDENTE       │
        │ Status: Pendente     │
        └───────┬──────────────┘
                │
        ┌───────▼──────────────────────┐
        │ OPÇÕES DE PAGAMENTO          │
        ├──────────────────────────────┤
        │ ✓ Confirmar (Manual)         │
        │ 💳 Mercado Pago (Online)     │
        └───────┬──────────────────────┘
                │
        ┌───────▼──────────────────────┐
        │ MODAL MERCADO PAGO           │
        ├──────────────────────────────┤
        │ Resumo do Pagamento          │
        │ - Itens                      │
        │ - Total                      │
        │ - Cliente                    │
        └───────┬──────────────────────┘
                │
        ┌───────▼──────────────────────┐
        │ CHECKOUT MERCADO PAGO        │
        ├──────────────────────────────┤
        │ Cliente preenche dados       │
        │ Cliente escolhe forma pag.   │
        │ Cliente confirma pagamento   │
        └───────┬──────────────────────┘
                │
        ┌───────▼──────────────────────┐
        │ PAGAMENTO PROCESSADO         │
        ├──────────────────────────────┤
        │ ✓ Aprovado                   │
        │ ✗ Recusado                   │
        │ ⏳ Pendente                   │
        └──────────────────────────────┘
```

---

## 🔧 Fluxo de Configuração

```
┌─────────────────────────────────────────────────────────────┐
│ PASSO 1: OBTER CREDENCIAIS                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Acesse: https://www.mercadopago.com.br/developers       │
│  2. Faça login                                              │
│  3. Vá para: Credenciais                                    │
│  4. Copie: Access Token (APP_USR-...)                       │
│  5. Copie: Public Key (APP_USR-...)                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ PASSO 2: CONECTAR NO SISTEMA                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Acesse: /establishments/mercadopago                     │
│  2. Clique: "Conectar Mercado Pago"                         │
│  3. Cole: Access Token                                      │
│  4. Cole: Public Key                                        │
│  5. Clique: "Conectar Mercado Pago"                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ PASSO 3: USAR EM VENDAS                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Acesse: /sales                                          │
│  2. Procure: Venda pendente                                 │
│  3. Clique: "💳 Mercado Pago"                               │
│  4. Clique: "Pagar com Mercado Pago"                        │
│  5. Cliente: Completa pagamento                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Interface de Configuração

```
╔═══════════════════════════════════════════════════════════════╗
║  INTEGRAÇÃO MERCADO PAGO                                      ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  ✓ Mercado Pago Conectado                                    ║
║  ├─ Status: Ativo                                            ║
║  ├─ Loja: Minha Loja                                         ║
║  ├─ Email: loja@email.com                                    ║
║  └─ Conectado em: 11/03/2026                                 ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ AÇÕES                                                   │ ║
║  ├─────────────────────────────────────────────────────────┤ ║
║  │ [🔄 Atualizar Credenciais]                              │ ║
║  │ [🔌 Desconectar Mercado Pago]                           │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ FORMULÁRIO DE CONEXÃO                                   │ ║
║  ├─────────────────────────────────────────────────────────┤ ║
║  │ Access Token: [_____________________]                   │ ║
║  │ Public Key:   [_____________________]                   │ ║
║  │                                                         │ ║
║  │ [Cancelar]  [Conectar Mercado Pago]                    │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 💳 Interface de Pagamento

```
╔═══════════════════════════════════════════════════════════════╗
║  PAGAMENTO MERCADO PAGO                                       ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ RESUMO DO PAGAMENTO                                     │ ║
║  ├─────────────────────────────────────────────────────────┤ ║
║  │ Itens: 3                                                │ ║
║  │ Cliente: João Silva                                     │ ║
║  │ Total: R$ 150,00                                        │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │ ITENS                                                   │ ║
║  ├─────────────────────────────────────────────────────────┤ ║
║  │ • Produto A x2 ........................... R$ 100,00    │ ║
║  │ • Produto B x1 ........................... R$ 50,00     │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ℹ️ Você será redirecionado para o Mercado Pago              ║
║                                                               ║
║  [Cancelar]  [Pagar com Mercado Pago]                        ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 📊 Fluxo de Dados

```
┌──────────────────┐
│  CLIENTE         │
│  (Navegador)     │
└────────┬─────────┘
         │
         │ 1. Clica em "💳 Mercado Pago"
         ▼
┌──────────────────────────────────────┐
│  SISTEMA (Frontend)                  │
│  - Exibe modal de pagamento          │
│  - Mostra resumo                     │
└────────┬─────────────────────────────┘
         │
         │ 2. Clica em "Pagar com Mercado Pago"
         ▼
┌──────────────────────────────────────┐
│  API DO SISTEMA (Backend)            │
│  - Cria preferência de pagamento     │
│  - Retorna link de checkout          │
└────────┬─────────────────────────────┘
         │
         │ 3. Redireciona para Mercado Pago
         ▼
┌──────────────────────────────────────┐
│  MERCADO PAGO (Checkout)             │
│  - Cliente preenche dados            │
│  - Cliente escolhe forma de pag.     │
│  - Cliente confirma                  │
└────────┬─────────────────────────────┘
         │
         │ 4. Processa pagamento
         ▼
┌──────────────────────────────────────┐
│  MERCADO PAGO (Processamento)        │
│  - Valida cartão                     │
│  - Processa transação                │
│  - Retorna resultado                 │
└────────┬─────────────────────────────┘
         │
         │ 5. Redireciona de volta
         ▼
┌──────────────────────────────────────┐
│  SISTEMA (Frontend)                  │
│  - Exibe resultado                   │
│  - Atualiza status da venda          │
└──────────────────────────────────────┘
```

---

## 🔐 Segurança

```
┌─────────────────────────────────────────────────────────────┐
│ CREDENCIAIS DO MERCADO PAGO                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Access Token: APP_USR-1234567890-XXXXX                     │
│  Public Key:   APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ CRIPTOGRAFIA                                         │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Credenciais são criptografadas antes de armazenar   │   │
│  │ Apenas o servidor pode descriptografar              │   │
│  │ Nunca são expostas no frontend                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ AUTENTICAÇÃO                                         │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ Todos os endpoints requerem JWT Token               │   │
│  │ Apenas usuários autenticados podem usar             │   │
│  │ Cada usuário só acessa seus próprios dados          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Ambiente de Teste

```
┌─────────────────────────────────────────────────────────────┐
│ SANDBOX (Ambiente de Teste)                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Credenciais de Teste:                                      │
│  - Access Token: APP_USR-... (teste)                        │
│  - Public Key: APP_USR-... (teste)                          │
│                                                              │
│  Cartões de Teste:                                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Tipo      │ Número              │ Status             │   │
│  ├───────────┼─────────────────────┼────────────────────┤   │
│  │ Aprovado  │ 4111 1111 1111 1111 │ ✓ Aprovado         │   │
│  │ Recusado  │ 4000 0000 0000 0002 │ ✗ Recusado         │   │
│  │ Pendente  │ 4000 0000 0000 0009 │ ⏳ Pendente        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Data: Qualquer data futura (ex: 12/25)                     │
│  CVV: Qualquer 3 dígitos (ex: 123)                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📍 Locais de Acesso

```
┌─────────────────────────────────────────────────────────────┐
│ MENU PRINCIPAL                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📊 Dashboard                                               │
│  📦 Inventário                                              │
│  💰 Vendas                                                  │
│  ├─ 📋 Listagem de Vendas                                   │
│  ├─ 🏪 Estabelecimentos                                     │
│  │  └─ 💳 Integração Mercado Pago ◄─── AQUI               │
│  └─ 🛒 POS                                                  │
│  👥 Clientes                                                │
│  📄 Fiscal                                                  │
│  ⚙️ Configurações                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist Visual

```
┌─────────────────────────────────────────────────────────────┐
│ CONFIGURAÇÃO DO MERCADO PAGO                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ ☐ Criar conta no Mercado Pago                               │
│   └─ https://www.mercadopago.com.br                         │
│                                                              │
│ ☐ Obter credenciais                                         │
│   └─ https://www.mercadopago.com.br/developers              │
│                                                              │
│ ☐ Copiar Access Token                                       │
│   └─ APP_USR-...                                            │
│                                                              │
│ ☐ Copiar Public Key                                         │
│   └─ APP_USR-...                                            │
│                                                              │
│ ☐ Acessar /establishments/mercadopago                       │
│   └─ Clique em "Conectar Mercado Pago"                      │
│                                                              │
│ ☐ Preencher formulário                                      │
│   ├─ Access Token: [_____________________]                  │
│   └─ Public Key: [_____________________]                    │
│                                                              │
│ ☐ Conectar                                                  │
│   └─ Clique em "Conectar Mercado Pago"                      │
│                                                              │
│ ☐ Testar com Sandbox                                        │
│   └─ Use credenciais de teste                               │
│                                                              │
│ ☐ Mudar para Produção                                       │
│   └─ Use credenciais reais                                  │
│                                                              │
│ ☐ Testar uma venda real                                     │
│   └─ Acesse /sales e clique em "💳 Mercado Pago"            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
