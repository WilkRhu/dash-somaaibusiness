# Solução: Webhook Não Emite Evento para Frontend

## 🔴 Problema Exato

```
[PIX] Socket conectado, aguardando pix-payment-confirmed para saleId: 240d271f-f57f-4b3d-9484-409f51e6aa48
[Webhook] Sale 240d271f-f57f-4b3d-9484-409f51e6aa48 já está COMPLETED, ignorando.
```

**O backend está ignorando o evento porque a venda já está COMPLETED, mas o frontend está esperando pelo evento!**

## ✅ Solução

No seu backend Node.js, encontre o handler do webhook do MercadoPago e **sempre emita o evento**, mesmo que a venda já esteja COMPLETED:

### Código Atual (ERRADO)
```typescript
// ❌ ERRADO - Ignora se já está COMPLETED
if (sale.status === 'COMPLETED') {
  console.log(`[Webhook] Sale ${saleId} já está COMPLETED, ignorando.`);
  return; // ← PROBLEMA: Não emite o evento!
}

// Emitir evento
io.to(`sale:${saleId}`).emit('pix-payment-confirmed', {
  saleId,
  mercadoPagoPaymentId: paymentId,
  status: 'completed',
});
```

### Código Corrigido (CERTO)
```typescript
// ✅ CERTO - Sempre emite o evento
if (sale.status === 'COMPLETED') {
  console.log(`[Webhook] Sale ${saleId} já está COMPLETED, mas emitindo evento mesmo assim.`);
} else {
  // Atualizar status se ainda não está COMPLETED
  await updateSaleStatus(saleId, 'COMPLETED');
  console.log(`[Webhook] Sale ${saleId} atualizada para COMPLETED.`);
}

// ✅ SEMPRE emitir o evento
io.to(`sale:${saleId}`).emit('pix-payment-confirmed', {
  saleId,
  mercadoPagoPaymentId: paymentId,
  status: 'completed',
  timestamp: new Date().toISOString(),
});

console.log(`[Webhook] Evento pix-payment-confirmed emitido para sale:${saleId}`);
```

## 📋 Fluxo Correto

```
Webhook recebido
    ↓
Buscar venda
    ↓
Verificar status
    ├─ Se COMPLETED → Apenas emitir evento
    └─ Se PENDING → Atualizar para COMPLETED + emitir evento
    ↓
✅ SEMPRE emitir evento WebSocket
    ↓
Frontend recebe evento
    ↓
Modal fecha
    ↓
Toast aparece
```

## 🔧 Implementação Completa

```typescript
// Backend - webhook handler
async function handleMercadoPagoWebhook(request, io) {
  const paymentId = request.body.data.id;
  const requestId = request.headers['x-request-id'];
  
  console.log(`[Webhook][handleMercadoPagoWebhook] Recebido paymentId=${paymentId} requestId=${requestId}`);
  
  try {
    // 1. Buscar venda
    const sale = await getSaleByMercadoPagoPaymentId(paymentId);
    
    if (!sale) {
      console.error(`[Webhook] Venda não encontrada para paymentId=${paymentId}`);
      return { success: false, error: 'Venda não encontrada' };
    }
    
    console.log(`[Webhook] Sale encontrada: id=${sale.id} status=${sale.status} mercadoPagoPaymentId=${paymentId}`);
    
    // 2. Obter dados do pagamento
    const payment = await mercadopago.getPayment(paymentId);
    
    // 3. Verificar se pagamento foi aprovado
    if (payment.status === 'approved') {
      // 4. Atualizar status se necessário
      if (sale.status !== 'COMPLETED') {
        await updateSaleStatus(sale.id, 'COMPLETED');
        console.log(`[Webhook] Sale ${sale.id} atualizada para COMPLETED.`);
      } else {
        console.log(`[Webhook] Sale ${sale.id} já está COMPLETED, mas emitindo evento mesmo assim.`);
      }
      
      // 5. ✅ SEMPRE emitir o evento
      io.to(`sale:${sale.id}`).emit('pix-payment-confirmed', {
        saleId: sale.id,
        mercadoPagoPaymentId: paymentId,
        status: 'completed',
        timestamp: new Date().toISOString(),
      });
      
      console.log(`[Webhook] Evento pix-payment-confirmed emitido para sale:${sale.id}`);
    }
    
    // 6. Registrar webhook como processado
    await logWebhookProcessed(requestId, paymentId, 'success');
    
    return { success: true, message: 'Webhook processado com sucesso' };
    
  } catch (error) {
    console.error(`[Webhook] Erro ao processar webhook:`, error);
    await logWebhookProcessed(requestId, paymentId, 'error', error.message);
    return { success: false, error: error.message };
  }
}
```

## 🧪 Como Testar

1. **Fazer um pagamento de teste**
   - Usar cartão de teste do MercadoPago
   - Observar os logs

2. **Verificar logs esperados**
   ```
   [Webhook][handleMercadoPagoWebhook] Recebido paymentId=151637671109
   [Webhook] Sale encontrada: id=240d271f-f57f-4b3d-9484-409f51e6aa48 status=completed
   [Webhook] Sale 240d271f-f57f-4b3d-9484-409f51e6aa48 já está COMPLETED, mas emitindo evento mesmo assim.
   [Webhook] Evento pix-payment-confirmed emitido para sale:240d271f-f57f-4b3d-9484-409f51e6aa48
   ```

3. **Verificar frontend**
   ```
   [PIX] Socket conectado, aguardando pix-payment-confirmed para saleId: 240d271f-f57f-4b3d-9484-409f51e6aa48
   [PIX] Evento recebido! Pagamento confirmado
   ```

## 🎯 Resumo da Mudança

**Antes:**
```typescript
if (sale.status === 'COMPLETED') {
  return; // ❌ Não emite evento
}
io.emit('pix-payment-confirmed', ...);
```

**Depois:**
```typescript
if (sale.status !== 'COMPLETED') {
  await updateSaleStatus(sale.id, 'COMPLETED');
}
// ✅ SEMPRE emite evento
io.emit('pix-payment-confirmed', ...);
```

## 📝 Notas Importantes

1. **O evento deve ser emitido SEMPRE**, independente do status anterior
2. **O frontend está esperando** pelo evento para fechar o modal
3. **Sem o evento**, o frontend fica preso esperando indefinidamente
4. **A deduplicação** deve ser feita no nível de Request ID, não de status

## 🚀 Próximos Passos

1. Localizar o arquivo de webhook no backend
2. Aplicar a correção (sempre emitir evento)
3. Testar com pagamento de teste
4. Fazer deploy
5. Monitorar logs por 24 horas
