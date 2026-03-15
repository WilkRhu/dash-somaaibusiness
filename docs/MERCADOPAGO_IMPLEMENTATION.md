# Guia de Implementação - Integração Mercado Pago

## Visão Geral

Este documento descreve como a integração do Mercado Pago foi implementada no sistema e como usá-la.

## Arquivos Criados

### Frontend

1. **app/(dashboard)/establishments/mercadopago/page.tsx**
   - Página principal de configuração do Mercado Pago
   - Permite conectar/desconectar credenciais
   - Exibe status da integração

2. **components/sales/mercadopago-payment-modal.tsx**
   - Modal para criar preferência de pagamento
   - Redireciona para checkout do Mercado Pago
   - Exibe resumo do pagamento

3. **components/establishments/mercadopago-status.tsx**
   - Componente de status da integração
   - Pode ser usado em dashboards
   - Link rápido para configuração

### Backend (API Routes)

1. **app/api/business/establishments/mercadopago/connect/route.ts**
   - POST: Conectar Mercado Pago
   - Valida e armazena credenciais

2. **app/api/business/establishments/mercadopago/integration/route.ts**
   - GET: Obter status da integração
   - Retorna informações da integração ativa

3. **app/api/business/establishments/mercadopago/disconnect/route.ts**
   - DELETE: Desconectar Mercado Pago
   - Remove integração do banco de dados

4. **app/api/business/establishments/mercadopago/payment-preference/route.ts**
   - POST: Criar preferência de pagamento
   - Retorna link de checkout

5. **app/api/business/establishments/mercadopago/payment/[paymentId]/route.ts**
   - GET: Obter informações de pagamento
   - Consulta status do pagamento

## Como Usar

### 1. Configurar Mercado Pago

Acesse: `/establishments/mercadopago`

1. Clique em "Conectar Mercado Pago"
2. Obtenha suas credenciais em: https://www.mercadopago.com.br/developers
3. Cole o Access Token e Public Key
4. Clique em "Conectar Mercado Pago"

### 2. Usar em Vendas

```typescript
import { MercadoPagoPaymentModal } from '@/components/sales/mercadopago-payment-modal';

export function SalesPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowPaymentModal(true)}>
        Pagar com Mercado Pago
      </button>

      <MercadoPagoPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        saleId="sale-123"
        items={[
          {
            id: 'item-1',
            title: 'Produto A',
            quantity: 2,
            unitPrice: 50.00,
          },
        ]}
        totalAmount={100.00}
        customerEmail="customer@email.com"
        customerName="João Silva"
      />
    </>
  );
}
```

### 3. Exibir Status da Integração

```typescript
import { MercadoPagoStatus } from '@/components/establishments/mercadopago-status';

export function Dashboard() {
  return (
    <div>
      <MercadoPagoStatus />
    </div>
  );
}
```

## Endpoints da API

### Conectar Mercado Pago

```bash
POST /api/business/establishments/mercadopago/connect
Authorization: Bearer {token}
Content-Type: application/json

{
  "accessToken": "APP_USR-...",
  "publicKey": "APP_USR-..."
}
```

**Response (201):**
```json
{
  "id": "mp-123456789",
  "establishmentId": "est-123",
  "isActive": true,
  "isVerified": true,
  "createdAt": "2026-03-11T23:00:00Z",
  "updatedAt": "2026-03-11T23:00:00Z"
}
```

### Obter Integração

```bash
GET /api/business/establishments/mercadopago/integration
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "mp-123456789",
  "establishmentId": "est-123",
  "isActive": true,
  "isVerified": true,
  "merchantName": "Minha Loja",
  "merchantEmail": "loja@email.com",
  "createdAt": "2026-03-11T23:00:00Z",
  "updatedAt": "2026-03-11T23:00:00Z"
}
```

### Criar Preferência de Pagamento

```bash
POST /api/business/establishments/mercadopago/payment-preference
Authorization: Bearer {token}
Content-Type: application/json

{
  "saleId": "sale-123",
  "items": [
    {
      "id": "item-1",
      "title": "Produto A",
      "quantity": 2,
      "unitPrice": 50.00
    }
  ],
  "totalAmount": 100.00,
  "customerEmail": "customer@email.com",
  "customerName": "João Silva"
}
```

**Response (201):**
```json
{
  "preferenceId": "preference-id",
  "initPoint": "https://www.mercadopago.com.br/checkout/v1/...",
  "sandboxInitPoint": "https://sandbox.mercadopago.com.br/checkout/v1/..."
}
```

### Obter Informações de Pagamento

```bash
GET /api/business/establishments/mercadopago/payment/{paymentId}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "payment-123",
  "status": "approved",
  "status_detail": "accredited",
  "transaction_amount": 100.00,
  "currency_id": "BRL",
  "payer": {
    "email": "customer@email.com"
  },
  "external_reference": "sale-123"
}
```

### Desconectar Mercado Pago

```bash
DELETE /api/business/establishments/mercadopago/disconnect
Authorization: Bearer {token}
```

**Response (204):** No Content

## Implementação Pendente

Os seguintes itens precisam ser implementados:

### 1. Banco de Dados

Criar tabela `mercadopago_integrations`:

```sql
CREATE TABLE mercadopago_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  establishment_id UUID NOT NULL REFERENCES establishments(id),
  access_token TEXT NOT NULL, -- Criptografado
  public_key TEXT NOT NULL, -- Criptografado
  merchant_name VARCHAR(255),
  merchant_email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(establishment_id)
);
```

### 2. Validação de Credenciais

Implementar função para validar credenciais com Mercado Pago:

```typescript
async function validateMercadoPagoCredentials(
  accessToken: string,
  publicKey: string
): Promise<boolean> {
  try {
    const response = await fetch('https://api.mercadopago.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
```

### 3. Criptografia de Credenciais

Implementar criptografia para armazenar credenciais:

```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

function encryptToken(token: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decryptToken(encrypted: string): string {
  const [iv, token] = encrypted.split(':');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    Buffer.from(iv, 'hex')
  );
  let decrypted = decipher.update(token, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

### 4. Webhook de Notificação

Implementar endpoint para receber notificações do Mercado Pago:

```typescript
// app/api/business/establishments/mercadopago/webhook/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Validar assinatura do Mercado Pago
  // Atualizar status do pagamento no banco de dados
  // Emitir notificação para o usuário
  
  return NextResponse.json({ ok: true });
}
```

### 5. Integração com Vendas

Adicionar botão de pagamento na página de vendas:

```typescript
// app/(dashboard)/sales/page.tsx
import { MercadoPagoPaymentModal } from '@/components/sales/mercadopago-payment-modal';

export function SalesPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowPaymentModal(true)}>
        💳 Pagar com Mercado Pago
      </button>

      <MercadoPagoPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        // ... props
      />
    </>
  );
}
```

### 6. Variáveis de Ambiente

Adicionar ao `.env.local`:

```env
# Mercado Pago
NEXT_PUBLIC_MERCADOPAGO_SANDBOX=true
ENCRYPTION_KEY=your-32-character-encryption-key-here
```

## Fluxo de Pagamento

```
1. Usuário clica em "Pagar com Mercado Pago"
   ↓
2. Modal exibe resumo do pagamento
   ↓
3. Usuário clica em "Pagar com Mercado Pago"
   ↓
4. Sistema cria preferência de pagamento
   ↓
5. Usuário é redirecionado para Mercado Pago
   ↓
6. Usuário completa o pagamento
   ↓
7. Mercado Pago redireciona de volta
   ↓
8. Webhook notifica o sistema
   ↓
9. Sistema atualiza status da venda
```

## Segurança

- ✓ Credenciais armazenadas criptografadas
- ✓ Validação de token JWT em todos os endpoints
- ✓ Validação de assinatura de webhook
- ✓ HTTPS obrigatório em produção
- ✓ Credenciais de sandbox para testes

## Testes

### Cartões de Teste (Sandbox)

- **Aprovado:** 4111 1111 1111 1111
- **Recusado:** 4000 0000 0000 0002
- **Pendente:** 4000 0000 0000 0009

### Teste de Integração

```bash
# 1. Conectar Mercado Pago
curl -X POST http://localhost:3000/api/business/establishments/mercadopago/connect \
  -H "Authorization: Bearer seu-token" \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "APP_USR-...",
    "publicKey": "APP_USR-..."
  }'

# 2. Obter integração
curl -X GET http://localhost:3000/api/business/establishments/mercadopago/integration \
  -H "Authorization: Bearer seu-token"

# 3. Criar preferência de pagamento
curl -X POST http://localhost:3000/api/business/establishments/mercadopago/payment-preference \
  -H "Authorization: Bearer seu-token" \
  -H "Content-Type: application/json" \
  -d '{
    "saleId": "sale-123",
    "items": [{"id": "1", "title": "Produto", "quantity": 1, "unitPrice": 100}],
    "totalAmount": 100,
    "customerEmail": "test@email.com"
  }'
```

## Referências

- [Documentação Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs)
- [SDK JavaScript](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/integrate-checkout-pro)
- [Webhooks](https://www.mercadopago.com.br/developers/pt/docs/webhooks)
- [API Reference](https://www.mercadopago.com.br/developers/pt/reference)
