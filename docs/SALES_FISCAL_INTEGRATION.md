# Integração: Fluxo de Venda + Emissão de Nota Fiscal

## Visão Geral

O fluxo de venda no PDV deve integrar a emissão de nota fiscal como parte do processo de finalização. Após confirmar o pagamento, o sistema deve emitir a nota fiscal automaticamente ou permitir que o operador escolha.

## Fluxo Completo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CRIAR VENDA (POST /business/establishments/:id/sales)    │
│    - Itens, cliente, forma de pagamento                     │
│    - Retorna: Sale com status PENDING                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. PROCESSAR PAGAMENTO                                      │
│    - Se MercadoPago: POST /business/establishments/:id/     │
│      sales/:saleId/link-payment                             │
│    - Se Dinheiro/Débito: POST /business/establishments/:id/ │
│      sales/:saleId/confirm-payment                          │
│    - Retorna: Sale com status COMPLETED                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. EMITIR NOTA FISCAL (POST /fiscal/notes/emit)             │
│    - Usar dados da venda (items, customer, totals)          │
│    - Retorna: FiscalNote com status PROCESSING              │
│    - Webhook notifica quando autorizada (status AUTHORIZED) │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. ENVIAR COMPROVANTE (POST /business/establishments/:id/   │
│    sales/:saleId/send-receipt)                              │
│    - Email com cupom + nota fiscal                          │
│    - Retorna: { success: true }                             │
└─────────────────────────────────────────────────────────────┘
```

## Endpoints Envolvidos

### 1. Criar Venda
```http
POST /business/establishments/{establishmentId}/sales
Authorization: Bearer {token}
Content-Type: application/json

{
  "customerId": "uuid",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "unitPrice": 50.00,
      "discount": 0
    }
  ],
  "paymentMethod": "CREDIT_CARD" | "DEBIT_CARD" | "CASH" | "PIX",
  "totalAmount": 100.00,
  "discount": 0,
  "notes": "Observações opcionais"
}

Response:
{
  "id": "sale-uuid",
  "establishmentId": "est-uuid",
  "customerId": "customer-uuid",
  "status": "PENDING",
  "totalAmount": 100.00,
  "items": [...],
  "paymentMethod": "CREDIT_CARD",
  "createdAt": "2024-03-23T10:00:00Z"
}
```

### 2. Confirmar Pagamento
```http
POST /business/establishments/{establishmentId}/sales/{saleId}/confirm-payment
Authorization: Bearer {token}

Response:
{
  "id": "sale-uuid",
  "status": "COMPLETED",
  "paymentConfirmedAt": "2024-03-23T10:05:00Z"
}
```

### 3. Emitir Nota Fiscal
```http
POST /fiscal/notes/emit
Authorization: Bearer {token}
Content-Type: application/json

{
  "establishmentId": "est-uuid",
  "saleId": "sale-uuid",  // ← Vincular à venda
  "customerId": "customer-uuid",
  "items": [
    {
      "productId": "uuid",
      "description": "Produto X",
      "quantity": 2,
      "unitPrice": 50.00,
      "totalPrice": 100.00
    }
  ],
  "totalAmount": 100.00,
  "paymentMethod": "CREDIT_CARD",
  "type": "NFCE"  // NFCe para varejo
}

Response:
{
  "id": "note-uuid",
  "saleId": "sale-uuid",
  "status": "PROCESSING",
  "accessKey": null,  // Preenchido quando autorizada
  "createdAt": "2024-03-23T10:05:30Z"
}
```

### 4. Enviar Comprovante
```http
POST /business/establishments/{establishmentId}/sales/{saleId}/send-receipt
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "cliente@example.com"  // Opcional, usa email do cliente se não informado
}

Response:
{
  "success": true,
  "message": "Comprovante enviado para cliente@example.com"
}
```

## Fluxo no Frontend (PDV)

### Passo 1: Tela de Venda
```typescript
// Operador adiciona itens, cliente, forma de pagamento
const sale = await createSale(establishmentId, {
  customerId,
  items,
  paymentMethod,
  totalAmount
});

// sale.id agora disponível para próximas etapas
```

### Passo 2: Processar Pagamento
```typescript
// Após confirmar pagamento (dinheiro, cartão, PIX)
await confirmPayment(establishmentId, sale.id);

// Agora sale.status = "COMPLETED"
```

### Passo 3: Emitir Nota Fiscal (AUTOMÁTICO OU MANUAL)

**Opção A: Automático (Recomendado)**
```typescript
// Após confirmação de pagamento, emitir automaticamente
const fiscalNote = await emitFiscalNote({
  establishmentId,
  saleId: sale.id,
  customerId: sale.customerId,
  items: sale.items,
  totalAmount: sale.totalAmount,
  paymentMethod: sale.paymentMethod,
  type: 'NFCE'
});

// Mostrar: "Nota Fiscal em processamento..."
// Webhook notificará quando autorizada
```

**Opção B: Manual (Operador escolhe)**
```typescript
// Mostrar botão "Emitir Nota Fiscal"
// Operador clica e confirma
const fiscalNote = await emitFiscalNote({...});
```

### Passo 4: Enviar Comprovante
```typescript
// Após nota fiscal autorizada (webhook recebido)
await sendReceipt(establishmentId, sale.id, {
  email: customer.email
});

// Mostrar: "Comprovante enviado!"
```

## Webhook de Autorização de Nota Fiscal

Quando a nota fiscal é autorizada pela SEFAZ, o backend notifica via webhook:

```typescript
// Frontend deve escutar eventos WebSocket ou polling
// Exemplo com WebSocket:

socket.on('fiscal:note:authorized', (data) => {
  const { saleId, fiscalNoteId, accessKey } = data;
  
  // Atualizar UI: mostrar nota fiscal autorizada
  // Habilitar botão de enviar comprovante
  // Mostrar QR code da nota fiscal
});

socket.on('fiscal:note:rejected', (data) => {
  const { saleId, fiscalNoteId, reason } = data;
  
  // Mostrar erro ao operador
  // Permitir reemissão ou contingência
});
```

## Estados da Venda

| Status | Descrição | Próximo Passo |
|--------|-----------|---------------|
| PENDING | Venda criada, aguardando pagamento | Confirmar pagamento |
| COMPLETED | Pagamento confirmado | Emitir nota fiscal |
| CANCELLED | Venda cancelada | Nenhum |

## Estados da Nota Fiscal

| Status | Descrição | Próximo Passo |
|--------|-----------|---------------|
| PENDING | Aguardando envio | Emitir |
| PROCESSING | Enviada para SEFAZ | Aguardar autorização |
| AUTHORIZED | Autorizada pela SEFAZ | Enviar comprovante |
| REJECTED | Rejeitada pela SEFAZ | Corrigir e reemitir |
| CANCELLED | Cancelada | Emitir carta de correção |
| CONTINGENCY | Emitida em contingência | Transmitir quando online |

## Tratamento de Erros

### Erro ao Emitir Nota Fiscal
```typescript
try {
  const fiscalNote = await emitFiscalNote({...});
} catch (error) {
  if (error.code === 'CERTIFICATE_EXPIRED') {
    // Mostrar: "Certificado digital expirado"
    // Redirecionar para upload de novo certificado
  } else if (error.code === 'INVALID_DATA') {
    // Mostrar: "Dados inválidos na nota fiscal"
    // Permitir correção manual
  } else if (error.code === 'OFFLINE') {
    // Mostrar: "Sistema offline"
    // Oferecer emissão em contingência
  }
}
```

### Nota Fiscal Rejeitada
```typescript
socket.on('fiscal:note:rejected', (data) => {
  // Mostrar motivo da rejeição
  // Opções:
  // 1. Corrigir e reemitir
  // 2. Emitir carta de correção
  // 3. Cancelar e emitir nova
});
```

## Fluxo de Contingência

Se o sistema estiver offline ou a SEFAZ indisponível:

```typescript
// Emitir em contingência
const contingencyNote = await createContingencyNote({
  establishmentId,
  saleId,
  items,
  totalAmount
});

// Mostrar: "Nota Fiscal em Contingência"
// Quando online, transmitir:
await transmitContingencyNote(establishmentId, contingencyNote.id);
```

## Integração com MercadoPago

Se pagamento via PIX/MercadoPago:

```typescript
// 1. Criar venda
const sale = await createSale(establishmentId, {
  paymentMethod: 'PIX',
  ...
});

// 2. Gerar PIX no MercadoPago
const payment = await createMercadoPagoPayment({
  amount: sale.totalAmount,
  description: `Venda ${sale.id}`
});

// 3. Mostrar QR code do PIX ao cliente

// 4. Webhook do MP confirma pagamento
// Backend atualiza sale.status = "COMPLETED"

// 5. Emitir nota fiscal automaticamente
```

## Checklist para Frontend

- [ ] Criar venda com itens e cliente
- [ ] Confirmar pagamento (ou aguardar webhook do MP)
- [ ] Emitir nota fiscal automaticamente
- [ ] Escutar webhook de autorização
- [ ] Mostrar status da nota fiscal em tempo real
- [ ] Enviar comprovante por email
- [ ] Tratar erros de certificado expirado
- [ ] Suportar emissão em contingência
- [ ] Mostrar QR code da nota fiscal
- [ ] Permitir reemissão se rejeitada

## Exemplo Completo (React)

```typescript
const handleCompleteSale = async () => {
  try {
    // 1. Criar venda
    const sale = await api.post(`/business/establishments/${estId}/sales`, {
      customerId,
      items,
      paymentMethod,
      totalAmount
    });

    // 2. Confirmar pagamento
    await api.post(
      `/business/establishments/${estId}/sales/${sale.id}/confirm-payment`
    );

    // 3. Emitir nota fiscal
    const fiscalNote = await api.post('/fiscal/notes/emit', {
      establishmentId: estId,
      saleId: sale.id,
      customerId,
      items,
      totalAmount,
      paymentMethod,
      type: 'NFCE'
    });

    // 4. Escutar autorização
    socket.on('fiscal:note:authorized', async (data) => {
      if (data.fiscalNoteId === fiscalNote.id) {
        // 5. Enviar comprovante
        await api.post(
          `/business/establishments/${estId}/sales/${sale.id}/send-receipt`,
          { email: customer.email }
        );
        
        showSuccess('Venda finalizada e comprovante enviado!');
      }
    });

  } catch (error) {
    handleError(error);
  }
};
```

