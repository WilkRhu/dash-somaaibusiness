# Integração Mercado Pago — Estabelecimentos

Modelo **credenciais diretas**: o estabelecimento cadastra o `access_token` e `public_key` da conta dele no painel. A plataforma processa os pagamentos usando essas credenciais e o dinheiro cai direto na conta do estabelecimento.

---

## Como funciona

```
Dono do estabelecimento
        │
        ▼
  Acessa o painel → Configurações → Pagamentos
        │
        ▼
  Informa access_token e public_key da conta Mercado Pago dele
  (obtidos em mercadopago.com.br/developers/panel/app)
        │
        ▼
  POST /api/business/establishments/mercadopago/connect
        │
        ▼
  Plataforma valida as credenciais chamando /users/me no MP
  e salva criptografadas (AES-256-CBC) na base
        │
        ▼
  Pagamentos processados com o token do estabelecimento
  → dinheiro cai na conta dele
```

---

## Endpoints

### Conectar
```
POST /api/business/establishments/mercadopago/connect
Authorization: Bearer <jwt do dono>

{
  "accessToken": "APP_USR-...",
  "publicKey": "APP_USR-..."
}
```
- Valida as credenciais chamando a API do MP
- Salva `accessToken` e `publicKey` criptografados
- Retorna dados da conta (nome, email) sem expor os tokens

---

### Ver integração
```
GET /api/business/establishments/mercadopago/integration
Authorization: Bearer <jwt>
```
```json
{
  "id": "uuid",
  "isActive": true,
  "isVerified": true,
  "merchantName": "Nome da Loja",
  "merchantEmail": "loja@email.com"
}
```

---

### Desconectar
```
DELETE /api/business/establishments/mercadopago/disconnect
Authorization: Bearer <jwt>
```

---

### Criar preferência de pagamento
```
POST /api/business/establishments/mercadopago/payment-preference
Authorization: Bearer <jwt>

{
  "saleId": "uuid-da-venda",
  "items": [
    { "id": "item-1", "title": "Produto A", "quantity": 2, "unitPrice": 50.00 }
  ],
  "totalAmount": 100.00,
  "customerEmail": "cliente@email.com",
  "customerName": "João Silva"
}
```

---

## Segurança

- `accessToken` e `publicKey` criptografados com AES-256-CBC antes de salvar
- Tokens nunca retornados em respostas HTTP
- Descriptografia feita apenas internamente para processar pagamentos

---

## Tabela

`establishment_mercadopago_integrations`

| Campo | Descrição |
|---|---|
| `establishmentId` | ID do estabelecimento |
| `accessToken` | Token criptografado |
| `publicKey` | Chave pública criptografada |
| `merchantAccountId` | ID da conta MP |
| `merchantName` | Nome do titular |
| `merchantEmail` | Email da conta MP |
| `isActive` | Se a integração está ativa |
| `isVerified` | Se as credenciais foram validadas |

---

## Arquivos

| Arquivo | Responsabilidade |
|---|---|
| `services/establishment-mercadopago.service.ts` | Conectar, validar, processar pagamentos |
| `controllers/establishment-mercadopago.controller.ts` | Endpoints HTTP |
| `repositories/establishment-mercadopago.repository.ts` | Acesso ao banco |
| `entities/establishment-mercadopago.entity.ts` | Entidade / tabela |
