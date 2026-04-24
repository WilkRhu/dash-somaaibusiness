# Mercado Pago — Guia de Integração Frontend

---

## Fluxo resumido

O dono do estabelecimento acessa as configurações de pagamento, informa as credenciais da conta Mercado Pago dele, e a plataforma passa a processar pagamentos usando essas credenciais.

---

## 1. Tela de configuração de pagamentos

Exibir o status atual da integração e o formulário de conexão.

### Buscar integração atual

```ts
GET /api/business/establishments/mercadopago/integration
Authorization: Bearer <token>
```

Resposta quando conectado:
```json
{
  "id": "uuid",
  "isActive": true,
  "isVerified": true,
  "merchantName": "Nome da Loja",
  "merchantEmail": "loja@email.com",
  "createdAt": "2026-01-01T00:00:00Z"
}
```

Resposta quando não conectado: `404`

---

## 2. Conectar Mercado Pago

O dono precisa obter as credenciais em:
**mercadopago.com.br/developers/panel/app** → selecionar a aplicação → copiar `Access Token` e `Public Key`.

### Formulário

```
[ Access Token  ] → campo: accessToken  (ex: APP_USR-123...)
[ Public Key    ] → campo: publicKey    (ex: APP_USR-abc...)
[ Salvar ]
```

### Chamada

```ts
POST /api/business/establishments/mercadopago/connect
Authorization: Bearer <token>
Content-Type: application/json

{
  "accessToken": "APP_USR-...",
  "publicKey": "APP_USR-..."
}
```

Resposta de sucesso `200`:
```json
{
  "id": "uuid",
  "isActive": true,
  "isVerified": true,
  "merchantName": "Nome da Loja",
  "merchantEmail": "loja@email.com"
}
```

Erro `400` — credenciais inválidas:
```json
{ "message": "Access token inválido — verifique suas credenciais do Mercado Pago" }
```

---

## 3. Desconectar

```ts
DELETE /api/business/establishments/mercadopago/disconnect
Authorization: Bearer <token>
```

Resposta: `204 No Content`

---

## 4. Formas de pagamento disponíveis (público)

Quando o estabelecimento tem integração ativa, PIX e cartões ficam disponíveis automaticamente.

```ts
GET /public/establishments/:id/payment-methods
```

```json
[
  { "method": "cash",        "label": "Dinheiro" },
  { "method": "pix",         "label": "PIX",               "provider": "mercadopago" },
  { "method": "credit_card", "label": "Cartão de Crédito", "provider": "mercadopago" },
  { "method": "debit_card",  "label": "Cartão de Débito",  "provider": "mercadopago" }
]
```

---

## 5. Criar preferência de pagamento (checkout)

Usado para gerar o link de pagamento de uma venda.

```ts
POST /api/business/establishments/mercadopago/payment-preference
Authorization: Bearer <token>
Content-Type: application/json

{
  "saleId": "uuid-da-venda",
  "items": [
    {
      "id": "item-1",
      "title": "Produto A",
      "quantity": 2,
      "unitPrice": 50.00
    }
  ],
  "totalAmount": 100.00,
  "customerEmail": "cliente@email.com",
  "customerName": "João Silva"
}
```

Resposta `201`:
```json
{
  "preferenceId": "...",
  "initPoint": "https://www.mercadopago.com.br/checkout/v1/...",
  "sandboxInitPoint": "https://sandbox.mercadopago.com.br/checkout/v1/..."
}
```

Use `initPoint` em produção e `sandboxInitPoint` para testes.

---

## 6. Estados da UI

| Estado | O que mostrar |
|---|---|
| Não conectado | Formulário de conexão + link para o painel do MP |
| Conectado | Nome/email da conta, botão "Desconectar" |
| Erro de credencial | Mensagem orientando a verificar o token no painel do MP |

---

## Onde o dono encontra as credenciais

Orientar o usuário com este passo a passo na tela:

1. Acesse [mercadopago.com.br/developers/panel/app](https://www.mercadopago.com.br/developers/panel/app)
2. Selecione sua aplicação (ou crie uma nova)
3. Vá em **Credenciais de produção**
4. Copie o **Access Token** e a **Public Key**
5. Cole nos campos acima e clique em Salvar
