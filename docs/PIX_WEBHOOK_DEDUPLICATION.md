# Deduplicação de Eventos PIX - Webhook MercadoPago

## Problema Identificado

O webhook do MercadoPago está sendo processado múltiplas vezes, causando:
- Múltiplos eventos `pix-payment-confirmed` sendo emitidos via WebSocket
- Duplicação de confirmações de pagamento no frontend
- Logs repetidos: "Sale já está COMPLETED, mas emitindo evento WS mesmo assim"

### Logs do Problema
```
[Webhook] Sale encontrada: id=0d65d395-2287-4db5-85f7-3141cd5eae9e status=completed
[Webhook] Sale 0d65d395-2287-4db5-85f7-3141cd5eae9e já está COMPLETED, mas emitindo evento WS mesmo assim.
[Webhook MP] Pagamento 151664677688 processado com sucesso
```

## Causa Raiz

1. **Backend**: O webhook está sendo chamado múltiplas vezes pelo MercadoPago (retry automático)
2. **Backend**: Mesmo quando a venda já está em status `COMPLETED`, o evento WebSocket é emitido novamente
3. **Frontend**: Embora haja proteção com `approvedRef`, múltiplos eventos podem chegar antes do socket desconectar

## Solução Implementada

### Frontend (Já Corrigido)

#### 1. `components/sales/checkout-modal.tsx`
- Adicionado `socket.off('pix-payment-confirmed')` para remover o listener imediatamente após processar
- Adicionado `socket.disconnect()` para desconectar o socket após o primeiro evento
- Mantida proteção com `approvedRef.current` para evitar múltiplas execuções

```typescript
socket.on('pix-payment-confirmed', (data) => {
  if (data.saleId === saleId && !approvedRef.current) {
    approvedRef.current = true;
    socket.off('pix-payment-confirmed');  // Remove listener
    socket.disconnect();                   // Desconecta socket
    // ... resto do código
  }
});
```

#### 2. `components/sales/mercadopago-payment-modal.tsx`
- Adicionado `approvedRef` para rastrear se o pagamento já foi processado
- Proteção no polling para evitar múltiplas chamadas de `onApproved()`
- Reset do flag quando o modal fecha

```typescript
const approvedRef = useRef(false);

const startPolling = () => {
  approvedRef.current = false;
  pollRef.current = setInterval(async () => {
    // ...
    if (status === 'completed' || status === 'COMPLETED') {
      if (approvedRef.current) return;  // Proteção
      approvedRef.current = true;
      // ... resto do código
    }
  }, POLL_INTERVAL);
};
```

### Backend (Recomendações)

Para evitar que o webhook emita múltiplos eventos:

#### 1. Adicionar Idempotência no Webhook
```typescript
// Verificar se o evento já foi processado
const eventKey = `webhook_${paymentId}_${status}`;
const alreadyProcessed = await cache.get(eventKey);
if (alreadyProcessed) {
  return { success: true, message: 'Evento já processado' };
}
await cache.set(eventKey, true, 3600); // Cache por 1 hora
```

#### 2. Não Emitir Evento se Status Já é COMPLETED
```typescript
// Antes de emitir o evento WebSocket
if (sale.status === 'COMPLETED') {
  console.log(`Sale ${saleId} já está COMPLETED, não emitindo evento`);
  return;
}

// Atualizar status
await updateSaleStatus(saleId, 'COMPLETED');

// Emitir evento
io.to(`sale:${saleId}`).emit('pix-payment-confirmed', {
  saleId,
  mercadoPagoPaymentId: paymentId,
  status: 'completed',
  timestamp: new Date().toISOString(),
});
```

#### 3. Usar Webhook Signature Validation
```typescript
// Validar assinatura do webhook para garantir que é do MercadoPago
const signature = request.headers['x-signature'];
const requestId = request.headers['x-request-id'];

if (!validateMercadoPagoSignature(signature, requestId, body)) {
  return { success: false, error: 'Assinatura inválida' };
}
```

#### 4. Implementar Deduplicação com Request ID
```typescript
// MercadoPago envia x-request-id em cada webhook
const requestId = request.headers['x-request-id'];
const processed = await db.webhookLog.findOne({ requestId });

if (processed) {
  console.log(`Webhook ${requestId} já foi processado`);
  return { success: true, message: 'Duplicado' };
}

// Processar webhook
// ...

// Registrar como processado
await db.webhookLog.create({ requestId, paymentId, status, processedAt: new Date() });
```

## Fluxo Correto

```
MercadoPago Webhook
    ↓
Validar Assinatura
    ↓
Verificar se já foi processado (Request ID)
    ↓
Buscar Venda
    ↓
Verificar Status Atual
    ├─ Se COMPLETED → Retornar sucesso (não emitir evento)
    └─ Se PENDING → Atualizar para COMPLETED
    ↓
Emitir Evento WebSocket (apenas uma vez)
    ↓
Registrar como Processado
    ↓
Retornar 200 OK
```

## Testes Recomendados

1. **Simular Webhook Duplicado**
   - Enviar o mesmo webhook 2-3 vezes
   - Verificar que o evento é emitido apenas uma vez

2. **Verificar Logs**
   - Confirmar que não há "já está COMPLETED, mas emitindo evento"
   - Verificar que há apenas uma confirmação por pagamento

3. **Testar Frontend**
   - Confirmar que o toast "Pagamento aprovado!" aparece apenas uma vez
   - Verificar que o modal fecha corretamente

## Monitoramento

Adicionar logs estruturados:
```typescript
logger.info('Webhook recebido', {
  paymentId,
  requestId,
  saleId,
  status,
  timestamp: new Date().toISOString(),
});

logger.warn('Webhook duplicado detectado', {
  paymentId,
  requestId,
  previousProcessedAt,
});

logger.error('Webhook falhou', {
  paymentId,
  requestId,
  error: err.message,
});
```
