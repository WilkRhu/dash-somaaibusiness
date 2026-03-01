# Integração Mercado Pago - Pagamentos PIX e Cartão

## 📋 Visão Geral

Sistema de pagamento integrado com Mercado Pago para processar assinaturas via PIX e Cartão de Crédito.

## 🔧 Configuração

### 1. Variáveis de Ambiente

Adicione no `.env`:

```env
# Mercado Pago Configuration
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=your-public-key-here
MERCADO_PAGO_ACCESS_TOKEN=your-access-token-here
```

**Como obter as credenciais:**
1. Acesse: https://www.mercadopago.com.br/developers
2. Vá em "Suas integrações" → "Credenciais"
3. Copie a Public Key e o Access Token

### 2. Instalação do SDK

O SDK do Mercado Pago é carregado dinamicamente via CDN:
```html
<script src="https://sdk.mercadopago.com/js/v2"></script>
```

## 🎯 Funcionalidades Implementadas

### ✅ Pagamento via PIX

**Componente:** `components/subscription/pix-payment-modal.tsx`

**Fluxo:**
1. Usuário clica em "Pagar com PIX"
2. Backend gera código PIX via API do Mercado Pago
3. Frontend exibe QR Code e código copia e cola
4. Sistema verifica pagamento a cada 5 segundos
5. Ao confirmar pagamento, ativa o plano

**Recursos:**
- QR Code visual
- Código PIX copia e cola
- Verificação automática de pagamento
- Expiração do código
- Feedback visual de status

### ✅ Pagamento via Cartão de Crédito

**Componente:** `components/subscription/card-payment-modal.tsx`

**Fluxo:**
1. Usuário clica em "Pagar com Cartão"
2. Preenche dados do cartão
3. SDK do Mercado Pago tokeniza o cartão
4. Backend processa pagamento
5. Retorna status (aprovado/recusado)

**Recursos:**
- Tokenização segura do cartão
- Parcelamento em até 12x
- Validação de campos
- Formatação automática
- Feedback de processamento

## 📁 Estrutura de Arquivos

```
lib/
├── api/
│   └── mercadopago.ts          # Cliente API Mercado Pago

components/
└── subscription/
    ├── pix-payment-modal.tsx   # Modal de pagamento PIX
    └── card-payment-modal.tsx  # Modal de pagamento Cartão

app/
└── (dashboard)/
    └── subscription/
        └── page.tsx            # Página de planos (integrada)
```

## 🔌 API Backend Necessária

### Endpoint: Criar Pagamento PIX

```typescript
POST /api/business/payments/pix

Request:
{
  "planId": "BASIC",
  "amount": 49.90,
  "description": "Assinatura Básico"
}

Response:
{
  "success": true,
  "data": {
    "id": "payment-id",
    "status": "pending",
    "qrCode": "00020126580014br.gov.bcb.pix...",
    "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
    "expirationDate": "2024-03-01T12:00:00Z"
  }
}
```

### Endpoint: Criar Pagamento Cartão

```typescript
POST /api/business/payments/card

Request:
{
  "planId": "BASIC",
  "amount": 49.90,
  "description": "Assinatura Básico",
  "cardToken": "token-from-sdk",
  "installments": 1,
  "payerEmail": "user@example.com"
}

Response:
{
  "success": true,
  "data": {
    "id": "payment-id",
    "status": "approved",
    "statusDetail": "accredited"
  }
}
```

### Endpoint: Verificar Status

```typescript
GET /api/business/payments/:paymentId/status

Response:
{
  "success": true,
  "data": {
    "status": "approved",
    "approved": true
  }
}
```

## 💻 Implementação Backend (Node.js)

### Instalação

```bash
npm install mercadopago
```

### Exemplo de Código

```typescript
import mercadopago from 'mercadopago';

// Configurar credenciais
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN!
});

// Criar pagamento PIX
export async function createPixPayment(data: any) {
  const payment = await mercadopago.payment.create({
    transaction_amount: data.amount,
    description: data.description,
    payment_method_id: 'pix',
    payer: {
      email: data.payerEmail,
    },
  });

  return {
    id: payment.body.id,
    status: payment.body.status,
    qrCode: payment.body.point_of_interaction.transaction_data.qr_code,
    qrCodeBase64: payment.body.point_of_interaction.transaction_data.qr_code_base64,
    expirationDate: payment.body.date_of_expiration,
  };
}

// Criar pagamento com cartão
export async function createCardPayment(data: any) {
  const payment = await mercadopago.payment.create({
    transaction_amount: data.amount,
    token: data.cardToken,
    description: data.description,
    installments: data.installments,
    payment_method_id: 'visa', // ou detectar automaticamente
    payer: {
      email: data.payerEmail,
    },
  });

  return {
    id: payment.body.id,
    status: payment.body.status,
    statusDetail: payment.body.status_detail,
  };
}

// Verificar status
export async function checkPaymentStatus(paymentId: string) {
  const payment = await mercadopago.payment.get(paymentId);
  
  return {
    status: payment.body.status,
    approved: payment.body.status === 'approved',
  };
}
```

## 🎨 Interface do Usuário

### Página de Planos

Cada plano agora possui dois botões:
- **Pagar com PIX** (botão azul com ícone)
- **Pagar com Cartão** (botão branco com borda)

### Modal PIX

- Valor destacado
- QR Code centralizado
- Código copia e cola
- Botão de copiar
- Indicador de verificação automática
- Data de expiração

### Modal Cartão

- Campos formatados automaticamente
- Validação em tempo real
- Seletor de parcelas
- Indicador de segurança
- Botão de processar

## 🔒 Segurança

### Tokenização de Cartão

O número do cartão **nunca** é enviado ao backend. O SDK do Mercado Pago:
1. Captura os dados do cartão no frontend
2. Cria um token seguro
3. Apenas o token é enviado ao backend

### Boas Práticas

- ✅ Access Token apenas no backend
- ✅ Public Key no frontend
- ✅ Validação de valores no backend
- ✅ Verificação de autenticação
- ✅ Logs de transações

## 📊 Fluxo Completo

```
1. Usuário escolhe plano
   ↓
2. Seleciona método de pagamento (PIX ou Cartão)
   ↓
3. Modal de pagamento abre
   ↓
4. [PIX] Gera QR Code → Usuário paga → Sistema verifica
   [CARTÃO] Preenche dados → Tokeniza → Processa
   ↓
5. Pagamento aprovado
   ↓
6. Backend atualiza plano do usuário
   ↓
7. Frontend recarrega e mostra novo plano ativo
```

## 🧪 Testes

### Cartões de Teste (Mercado Pago)

**Aprovado:**
- Número: `5031 4332 1540 6351`
- CVV: `123`
- Validade: Qualquer data futura

**Recusado:**
- Número: `5031 7557 3453 0604`
- CVV: `123`
- Validade: Qualquer data futura

### PIX de Teste

No ambiente de testes, o PIX é aprovado automaticamente após alguns segundos.

## 🚀 Próximos Passos

### Melhorias Sugeridas

1. **Webhooks do Mercado Pago**
   - Receber notificações automáticas de pagamento
   - Não depender de polling

2. **Histórico de Pagamentos**
   - Página com todas as transações
   - Download de recibos

3. **Renovação Automática**
   - Salvar cartão para cobranças recorrentes
   - Notificações antes da cobrança

4. **Cupons de Desconto**
   - Sistema de cupons promocionais
   - Descontos por tempo limitado

5. **Boleto Bancário**
   - Adicionar opção de boleto
   - Prazo de vencimento

## 📞 Suporte

**Documentação Mercado Pago:**
- https://www.mercadopago.com.br/developers/pt/docs

**Sandbox (Testes):**
- https://www.mercadopago.com.br/developers/pt/docs/checkout-api/testing

## ✅ Checklist de Implementação

### Frontend
- [x] Variáveis de ambiente configuradas
- [x] Modal de pagamento PIX
- [x] Modal de pagamento Cartão
- [x] Integração na página de planos
- [x] Verificação automática de pagamento PIX
- [x] Tokenização de cartão

### Backend (Pendente)
- [ ] Endpoint de criação de pagamento PIX
- [ ] Endpoint de criação de pagamento Cartão
- [ ] Endpoint de verificação de status
- [ ] Webhook para notificações
- [ ] Atualização de plano após pagamento
- [ ] Logs de transações
- [ ] Tratamento de erros

### Testes
- [ ] Testar pagamento PIX em sandbox
- [ ] Testar pagamento Cartão em sandbox
- [ ] Testar expiração de PIX
- [ ] Testar cartão recusado
- [ ] Testar parcelamento
- [ ] Testar webhook

## 🎯 Resumo

Sistema completo de pagamentos implementado no frontend, pronto para integração com backend. Suporta:
- ✅ Pagamento via PIX com QR Code
- ✅ Pagamento via Cartão de Crédito
- ✅ Parcelamento em até 12x
- ✅ Verificação automática de status
- ✅ Interface intuitiva e responsiva
