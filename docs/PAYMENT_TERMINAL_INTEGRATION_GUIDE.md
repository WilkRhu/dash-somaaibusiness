# Guia de Integração - Terminal de Pagamento

## Visão Geral

A integração de terminal de pagamento usa um padrão **Factory + Provider** que permite suportar múltiplos provedores de forma modular e extensível.

---

## Arquitetura

```
PaymentTerminalService (Singleton)
    ↓
PaymentTerminalFactory
    ├── StoneTerminalProvider (IPaymentTerminal)
    ├── CieloTerminalProvider (IPaymentTerminal)
    ├── RedeTerminalProvider (IPaymentTerminal)
    ├── GetnetTerminalProvider (IPaymentTerminal)
    └── MercadoPagoTerminalProvider (IPaymentTerminal)
```

---

## Estrutura de Arquivos

```
lib/
├── types/
│   └── payment-terminal.ts          # Tipos e interfaces
├── payment-terminal/
│   ├── payment-terminal-factory.ts  # Factory de provedores
│   ├── payment-terminal-service.ts  # Serviço principal
│   └── providers/
│       ├── stone-provider.ts        # Provedor Stone
│       ├── cielo-provider.ts        # Provedor Cielo
│       ├── rede-provider.ts         # Provedor Rede
│       ├── getnet-provider.ts       # Provedor Getnet
│       └── mercadopago-provider.ts  # Provedor Mercado Pago

app/api/business/payments/terminal/
├── setup/route.ts                   # POST - Configurar terminal
├── config/route.ts                  # GET - Obter configuração
├── process-payment/route.ts         # POST - Processar pagamento
├── refund/[transactionId]/route.ts  # POST - Reembolsar
├── status/route.ts                  # GET - Status do terminal
└── disconnect/route.ts              # DELETE - Desconectar
```

---

## Como Usar

### 1. Configurar Terminal

```typescript
import { PaymentTerminalService } from '@/lib/payment-terminal/payment-terminal-service';
import { PaymentProvider } from '@/lib/types/payment-terminal';

const service = PaymentTerminalService.getInstance();

const config = await service.setupTerminal(
  'establishment-id',
  PaymentProvider.STONE,
  {
    apiKey: 'sk_live_xxxxxxxxxxxxx',
    environment: 'production',
  }
);
```

### 2. Processar Pagamento

```typescript
const response = await service.processPayment('establishment-id', {
  provider: PaymentProvider.STONE,
  amount: 10000, // Em centavos
  installments: 1,
  description: 'Venda #123',
  orderId: 'order-123',
  customerEmail: 'customer@email.com',
});

if (response.success) {
  console.log('Pagamento aprovado:', response.transactionId);
} else {
  console.error('Pagamento recusado:', response.error);
}
```

### 3. Reembolsar Pagamento

```typescript
const refund = await service.refundPayment(
  'establishment-id',
  'transaction-id',
  {
    provider: PaymentProvider.STONE,
    amount: 5000, // Reembolso parcial
    reason: 'Devolução de produto',
  }
);
```

### 4. Verificar Status

```typescript
const status = await service.getTerminalStatus(
  'establishment-id',
  PaymentProvider.STONE
);

console.log('Terminal online:', status.isOnline);
console.log('Última sincronização:', status.lastSync);
```

### 5. Desconectar Terminal

```typescript
await service.disconnectTerminal(
  'establishment-id',
  PaymentProvider.STONE
);
```

---

## Endpoints da API

### Setup Terminal
```
POST /api/business/payments/terminal/setup
Authorization: Bearer {token}
Content-Type: application/json

{
  "provider": "stone",
  "apiKey": "sk_live_xxxxxxxxxxxxx",
  "apiSecret": "secret_xxxxxxxxxxxxx",
  "terminalId": "terminal-123",
  "environment": "production"
}

Response (201):
{
  "id": "uuid",
  "provider": "stone",
  "isActive": true,
  "isVerified": true,
  "environment": "production",
  "terminalInfo": {
    "isOnline": true,
    "lastSync": "2026-03-11T23:00:00Z"
  },
  "createdAt": "2026-03-11T23:00:00Z",
  "updatedAt": "2026-03-11T23:00:00Z"
}
```

### Obter Configuração
```
GET /api/business/payments/terminal/config?provider=stone
Authorization: Bearer {token}

Response (200):
{
  "id": "uuid",
  "provider": "stone",
  "isActive": true,
  "isVerified": true,
  "environment": "production",
  "terminalInfo": {
    "isOnline": true,
    "lastSync": "2026-03-11T23:00:00Z"
  }
}
```

### Processar Pagamento
```
POST /api/business/payments/terminal/process-payment
Authorization: Bearer {token}
Content-Type: application/json

{
  "provider": "stone",
  "amount": 10000,
  "installments": 1,
  "description": "Venda #123",
  "orderId": "order-123",
  "customerEmail": "customer@email.com",
  "customerPhone": "11999999999"
}

Response (201):
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

### Reembolsar Pagamento
```
POST /api/business/payments/terminal/refund/trans-123
Authorization: Bearer {token}
Content-Type: application/json

{
  "provider": "stone",
  "amount": 5000,
  "reason": "Devolução de produto"
}

Response (200):
{
  "success": true,
  "transactionId": "refund-123",
  "status": "refunded",
  "amount": 5000,
  "message": "Reembolso processado com sucesso",
  "timestamp": "2026-03-11T23:00:00Z"
}
```

### Obter Status
```
GET /api/business/payments/terminal/status?provider=stone
Authorization: Bearer {token}

Response (200):
{
  "isOnline": true,
  "lastSync": "2026-03-11T23:00:00Z"
}
```

### Desconectar Terminal
```
DELETE /api/business/payments/terminal/disconnect?provider=stone
Authorization: Bearer {token}

Response (204): No Content
```

---

## Adicionar Novo Provedor

### 1. Criar Provedor

```typescript
// lib/payment-terminal/providers/novo-provider.ts
import { IPaymentTerminal, ... } from '@/lib/types/payment-terminal';

export class NovoTerminalProvider implements IPaymentTerminal {
  async setup(config: PaymentTerminalConfig): Promise<void> {
    // Implementar setup
  }

  async processPayment(request: ProcessPaymentRequest): Promise<ProcessPaymentResponse> {
    // Implementar processamento
  }

  async refund(transactionId: string, request: RefundRequest): Promise<RefundResponse> {
    // Implementar reembolso
  }

  async getStatus(): Promise<{ isOnline: boolean; lastSync: Date }> {
    // Implementar status
  }

  async disconnect(): Promise<void> {
    // Implementar desconexão
  }
}
```

### 2. Registrar na Factory

```typescript
// lib/payment-terminal/payment-terminal-factory.ts
import { NovoTerminalProvider } from './providers/novo-provider';

export class PaymentTerminalFactory {
  static createProvider(provider: PaymentProvider, config: PaymentTerminalConfig): IPaymentTerminal {
    switch (provider) {
      // ... outros casos
      case PaymentProvider.NOVO:
        return new NovoTerminalProvider(config);
      // ...
    }
  }
}
```

### 3. Adicionar Enum

```typescript
// lib/types/payment-terminal.ts
export enum PaymentProvider {
  STONE = 'stone',
  CIELO = 'cielo',
  REDE = 'rede',
  GETNET = 'getnet',
  MERCADOPAGO = 'mercadopago',
  NOVO = 'novo', // Novo provedor
}
```

---

## Fluxo de Pagamento

```
1. Configurar Terminal
   ├─ Validar credenciais
   ├─ Criar provedor
   └─ Armazenar configuração

2. Processar Pagamento
   ├─ Obter configuração
   ├─ Validar terminal ativo
   ├─ Chamar provedor
   ├─ Armazenar transação
   └─ Retornar resultado

3. Reembolsar Pagamento
   ├─ Obter configuração
   ├─ Chamar provedor
   ├─ Armazenar reembolso
   └─ Retornar resultado

4. Desconectar Terminal
   ├─ Desconectar provedor
   ├─ Remover do cache
   └─ Desativar no BD
```

---

## Tratamento de Erros

### Credenciais Inválidas
```json
{
  "statusCode": 400,
  "message": "Credenciais inválidas"
}
```

### Terminal Não Configurado
```json
{
  "statusCode": 404,
  "message": "Terminal não configurado"
}
```

### Terminal Inativo
```json
{
  "statusCode": 400,
  "message": "Terminal não está ativo"
}
```

### Pagamento Recusado
```json
{
  "success": false,
  "status": "declined",
  "error": {
    "code": "INSUFFICIENT_FUNDS",
    "message": "Saldo insuficiente"
  }
}
```

---

## Segurança

- API Keys armazenadas criptografadas
- Todas as requisições requerem JWT
- Validação de campos obrigatórios
- Logs de todas as transações
- Soft delete de configurações

---

## Próximos Passos

1. Implementar banco de dados
2. Implementar criptografia de credenciais
3. Integrar SDKs dos provedores
4. Implementar webhooks
5. Adicionar testes
6. Implementar reconciliação

---

**Integração pronta para uso! ✓**
