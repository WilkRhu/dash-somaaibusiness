# Integração Mercado Pago para Estabelecimentos

Este guia descreve como integrar o Mercado Pago com um estabelecimento para aceitar pagamentos.

## Visão Geral

A integração permite que estabelecimentos:
- Conectem suas credenciais do Mercado Pago
- Criem preferências de pagamento para vendas
- Consultem informações de pagamentos
- Gerenciem webhooks de notificação

## Endpoints

### 1. Conectar Mercado Pago

**Endpoint:** `POST /api/business/establishments/mercadopago/connect`

**Autenticação:** Bearer Token (JWT)

**Body:**
```json
{
  "accessToken": "APP_USR-1234567890-XXXXX",
  "publicKey": "APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "establishmentId": "uuid",
  "isActive": true,
  "isVerified": true,
  "createdAt": "2026-03-11T23:00:00Z",
  "updatedAt": "2026-03-11T23:00:00Z"
}
```

### 2. Obter Integração

**Endpoint:** `GET /api/business/establishments/mercadopago/integration`

**Autenticação:** Bearer Token (JWT)

**Response (200):**
```json
{
  "id": "uuid",
  "establishmentId": "uuid",
  "isActive": true,
  "isVerified": true,
  "merchantName": "Minha Loja",
  "merchantEmail": "loja@email.com",
  "createdAt": "2026-03-11T23:00:00Z",
  "updatedAt": "2026-03-11T23:00:00Z"
}
```

### 3. Criar Preferência de Pagamento

**Endpoint:** `POST /api/business/establishments/mercadopago/payment-preference`

**Autenticação:** Bearer Token (JWT)

**Body:**
```json
{
  "saleId": "sale-uuid",
  "items": [
    {
      "id": "item-1",
      "title": "Produto A",
      "description": "Descrição do produto",
      "quantity": 2,
      "unitPrice": 50.00
    }
  ],
  "totalAmount": 100.00,
  "customerEmail": "customer@email.com",
  "customerName": "João Silva",
  "externalReference": "external-ref-123"
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

### 4. Obter Informações de Pagamento

**Endpoint:** `GET /api/business/establishments/mercadopago/payment/:paymentId`

**Autenticação:** Bearer Token (JWT)

**Response (200):**
```json
{
  "id": "payment-id",
  "status": "approved",
  "status_detail": "accredited",
  "transaction_amount": 100.00,
  "currency_id": "BRL",
  "payer": {
    "email": "customer@email.com"
  },
  "external_reference": "sale-uuid"
}
```

### 5. Desconectar Mercado Pago

**Endpoint:** `DELETE /api/business/establishments/mercadopago/disconnect`

**Autenticação:** Bearer Token (JWT)

**Response (204):** No Content

## Fluxo de Integração

### Passo 1: Obter Credenciais do Mercado Pago

1. Acesse [Mercado Pago Developer](https://www.mercadopago.com.br/developers)
2. Faça login com sua conta
3. Vá para "Credenciais" ou "Aplicações"
4. Copie o **Access Token** e a **Public Key**

### Passo 2: Conectar ao Sistema

```bash
curl -X POST http://localhost:8080/api/business/establishments/mercadopago/connect \
  -H "Authorization: Bearer seu-token-jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "APP_USR-...",
    "publicKey": "APP_USR-..."
  }'
```

### Passo 3: Criar Preferência de Pagamento

Quando uma venda é finalizada, crie uma preferência de pagamento:

```bash
curl -X POST http://localhost:8080/api/business/establishments/mercadopago/payment-preference \
  -H "Authorization: Bearer seu-token-jwt" \
  -H "Content-Type: application/json" \
  -d '{
    "saleId": "sale-uuid",
    "items": [
      {
        "id": "item-1",
        "title": "Produto",
        "quantity": 1,
        "unitPrice": 100.00
      }
    ],
    "totalAmount": 100.00,
    "customerEmail": "customer@email.com"
  }'
```

### Passo 4: Redirecionar para Checkout

Use o `initPoint` retornado para redirecionar o cliente:

```javascript
// Frontend
const response = await fetch('/api/business/establishments/mercadopago/payment-preference', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({...})
});

const { initPoint } = await response.json();
window.location.href = initPoint; // Redireciona para Mercado Pago
```

## Webhook de Notificação

O sistema está configurado para receber notificações do Mercado Pago em:

```
POST /api/business/establishments/mercadopago/webhook
```

As notificações incluem:
- `payment.created` - Pagamento criado
- `payment.updated` - Pagamento atualizado
- `payment.approved` - Pagamento aprovado
- `payment.rejected` - Pagamento rejeitado

## Tratamento de Erros

### Credenciais Inválidas
```json
{
  "statusCode": 400,
  "message": "Invalid Mercado Pago credentials",
  "error": "Bad Request"
}
```

### Integração Não Encontrada
```json
{
  "statusCode": 404,
  "message": "Mercado Pago integration not found for this establishment",
  "error": "Not Found"
}
```

### Integração Não Ativa
```json
{
  "statusCode": 404,
  "message": "Active Mercado Pago integration not found for this establishment",
  "error": "Not Found"
}
```

## Ambiente de Teste

Para testar em sandbox:

1. Use credenciais de teste do Mercado Pago
2. Use o `sandboxInitPoint` em vez de `initPoint`
3. Use cartões de teste fornecidos pelo Mercado Pago

Cartões de teste:
- **Aprovado:** 4111 1111 1111 1111
- **Recusado:** 4000 0000 0000 0002
- **Pendente:** 4000 0000 0000 0009

## Segurança

- **Access Token:** Armazenado criptografado no banco de dados
- **Public Key:** Usada apenas no frontend para validações
- **Webhook:** Validar assinatura do Mercado Pago
- **HTTPS:** Sempre usar HTTPS em produção

## Troubleshooting

### Erro: "Invalid Mercado Pago credentials"
- Verifique se o Access Token está correto
- Verifique se a Public Key está correta
- Certifique-se de que as credenciais não expiraram

### Erro: "Mercado Pago integration not found"
- Conecte o Mercado Pago primeiro usando o endpoint `/connect`
- Verifique se está usando o token JWT correto

### Pagamento não aparece
- Verifique se o webhook está configurado corretamente
- Verifique os logs do servidor
- Consulte o painel do Mercado Pago para ver o status do pagamento

## Referências

- [Documentação Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs)
- [SDK JavaScript Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/integrate-checkout-pro)
- [Webhooks Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/webhooks)
