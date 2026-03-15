# Integração de Maquineta de Cartão

Guia completo para integrar maquinetas de cartão (POS - Point of Sale) com o sistema.

## Provedores Suportados

- **Stone** ✅ (Implementado)
- **Cielo** 🔄 (Em desenvolvimento)
- **Rede** 🔄 (Em desenvolvimento)
- **Getnet** 🔄 (Em desenvolvimento)
- **Mercado Pago** ✅ (Já integrado)

## Arquitetura

O sistema usa um padrão **Factory + Provider** similar ao módulo fiscal:

```
PaymentTerminalFactory
    ├── StoneTerminalProvider (IPaymentTerminal)
    ├── CieloTerminalProvider (Em breve)
    ├── RedeTerminalProvider (Em breve)
    └── GetnetTerminalProvider (Em breve)
```

## Endpoints

### 1. Configurar Maquineta

**Endpoint:** `POST /api/business/payments/terminal/setup`

**Autenticação:** Bearer Token (JWT)

**Body:**
```json
{
  "provider": "stone",
  "apiKey": "sk_live_xxxxxxxxxxxxx",
  "apiSecret": "secret_xxxxxxxxxxxxx",
  "terminalId": "terminal-123"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "provider": "stone",
  "isActive": true,
  "isVerified": true,
  "terminalInfo": {
    "isOnline": true,
    "lastSync": "2026-03-11T23:00:00Z"
  },
  "createdAt": "2026-03-11T23:00:00Z"
}
```

### 2. Obter Configuração

**Endpoint:** `GET /api/business/payments/terminal/config/:provider`

**Autenticação:** Bearer Token (JWT)

**Response (200):**
```json
{
  "id": "uuid",
  "provider": "stone",
  "isActive": true,
  "isVerified": true,
  "environment": "sandbox",
  "terminalInfo": {
    "isOnline": true,
    "lastSync": "2026-03-11T23:00:00Z"
  }
}
```

### 3. Processar Pagamento

**Endpoint:** `POST /api/business/payments/terminal/process-payment`

**Autenticação:** Bearer Token (JWT)

**Body:**
```json
{
  "amount": 10000,
  "installments": 1,
  "description": "Venda #123",
  "orderId": "order-123",
  "customerEmail": "customer@email.com",
  "customerPhone": "11999999999",
  "provider": "stone"
}
```

**Response (201):**
```json
{
  "success": true,
  "transactionId": "trans-123",
  "authorizationCode": "auth-code",
  "status": "approved",
  "amount": 10000,
  "installments": 1,
  "timestamp": "2026-03-11T23:00:00Z"
}
```

### 4. Consultar Pagamento

**Endpoint:** `GET /api/business/payments/terminal/payment/:transactionId`

**Autenticação:** Bearer Token (JWT)

**Response (200):**
```json
{
  "success": true,
  "transactionId": "trans-123",
  "authorizationCode": "auth-code",
  "status": "approved",
  "amount": 10000,
  "timestamp": "2026-03-11T23:00:00Z"
}
```

### 5. Reembolsar Pagamento

**Endpoint:** `POST /api/business/payments/terminal/refund/:transactionId`

**Autenticação:** Bearer Token (JWT)

**Body (opcional):**
```json
{
  "amount": 5000,
  "provider": "stone"
}
```

**Response (200):**
```json
{
  "success": true,
  "transactionId": "refund-123",
  "status": "approved",
  "amount": 5000,
  "message": "Refund processed",
  "timestamp": "2026-03-11T23:00:00Z"
}
```

### 6. Remover Maquineta

**Endpoint:** `DELETE /api/business/payments/terminal/remove/:provider`

**Autenticação:** Bearer Token (JWT)

**Response (204):** No Content

## Fluxo de Integração - Stone

### Passo 1: Obter Credenciais

1. Acesse [Stone Dashboard](https://dashboard.stone.com.br)
2. Faça login com sua conta
3. Vá para "Configurações" → "Chaves de API"
4. Copie a **API Key** (começa com `sk_live_` ou `sk_test_`)

### Passo 2: Configurar no Sistema

```bash
curl -X POST http://localhost:8080/api/business/payments/terminal/setup \
  -H "Authorization: Bearer seu-token-jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "stone",
    "apiKey": "sk_live_xxxxxxxxxxxxx"
  }'
```

### Passo 3: Processar Pagamento

```bash
curl -X POST http://localhost:8080/api/business/payments/terminal/process-payment \
  -H "Authorization: Bearer seu-token-jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10000,
    "installments": 1,
    "description": "Venda #123",
    "orderId": "order-123",
    "provider": "stone"
  }'
```

## Fluxo de Integração - Frontend

### Exemplo com React

```javascript
// 1. Configurar maquineta
async function setupTerminal() {
  const response = await fetch('/api/business/payments/terminal/setup', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      provider: 'stone',
      apiKey: 'sk_live_xxxxxxxxxxxxx'
    })
  });
  
  const config = await response.json();
  console.log('Terminal configurado:', config);
}

// 2. Processar pagamento
async function processPayment(amount, installments = 1) {
  const response = await fetch('/api/business/payments/terminal/process-payment', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amount * 100, // Converter para centavos
      installments,
      description: 'Venda no PDV',
      orderId: generateOrderId(),
      provider: 'stone'
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('Pagamento aprovado:', result.transactionId);
    // Emitir nota fiscal
    // Atualizar venda
  } else {
    console.error('Pagamento recusado:', result.error);
  }
}

// 3. Reembolsar pagamento
async function refundPayment(transactionId, amount) {
  const response = await fetch(
    `/api/business/payments/terminal/refund/${transactionId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount * 100, // Centavos
        provider: 'stone'
      })
    }
  );
  
  const result = await response.json();
  console.log('Reembolso:', result);
}
```

## Tratamento de Erros

### Credenciais Inválidas
```json
{
  "statusCode": 400,
  "message": "Invalid payment terminal credentials",
  "error": "Bad Request"
}
```

### Maquineta Não Configurada
```json
{
  "statusCode": 404,
  "message": "Payment terminal configuration not found",
  "error": "Not Found"
}
```

### Maquineta Inativa
```json
{
  "statusCode": 400,
  "message": "Payment terminal is not active",
  "error": "Bad Request"
}
```

### Pagamento Recusado
```json
{
  "success": false,
  "transactionId": "",
  "status": "declined",
  "amount": 10000,
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Saldo insuficiente"
  },
  "timestamp": "2026-03-11T23:00:00Z"
}
```

## Ambiente de Teste

### Stone Sandbox

Use as credenciais de teste:
- **API Key:** `sk_test_xxxxxxxxxxxxx`
- **Cartões de teste:**
  - Aprovado: `4111 1111 1111 1111`
  - Recusado: `4000 0000 0000 0002`
  - Pendente: `4000 0000 0000 0009`

## Segurança

- **API Keys:** Armazenadas criptografadas no banco
- **HTTPS:** Sempre usar em produção
- **Validação:** Todas as requisições validadas
- **Logs:** Todas as transações registradas
- **Soft Delete:** Configurações removidas mantêm histórico

## Próximos Passos

1. **Implementar Cielo** - Adicionar suporte para maquinetas Cielo
2. **Implementar Rede** - Adicionar suporte para maquinetas Rede
3. **Implementar Getnet** - Adicionar suporte para maquinetas Getnet
4. **Webhooks** - Receber notificações de transações
5. **Reconciliação** - Sincronizar transações com banco
6. **Relatórios** - Gerar relatórios de vendas por maquineta

## Referências

- [Stone API Docs](https://docs.stone.com.br)
- [Cielo API Docs](https://www.cielo.com.br/desenvolvedores)
- [Rede API Docs](https://www.userede.com.br/desenvolvedores)
- [Getnet API Docs](https://developers.getnet.com.br)
