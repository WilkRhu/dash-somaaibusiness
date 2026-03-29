# Correção: Webhook de Pagamento Não Dispara

## 🔴 Problema Identificado

O webhook do MercadoPago está sendo processado pelo backend, mas está sendo **ignorado por deduplicação**:

```
[Webhook MP] Pagamento 151638656141 processado com sucesso
[Webhook] Webhook mp-webhook-151638656141 já foi processado nos últimos 5 minutos. Ignorando.
```

Isso significa que:
1. ✅ O webhook chega ao backend
2. ✅ O backend reconhece o pagamento
3. ❌ Mas ignora porque acha que já foi processado
4. ❌ O evento WebSocket não é emitido
5. ❌ O frontend não recebe a confirmação

## 🎯 Causa Raiz

A deduplicação de webhook está muito agressiva. O sistema está usando um cache de 5 minutos que impede que o mesmo webhook seja processado novamente, mesmo que seja uma tentativa legítima de confirmar o pagamento.

## ✅ Solução

### Opção 1: Ajustar Tempo de Deduplicação (Rápido)

Se o backend está usando um cache de 5 minutos, reduza para 30-60 segundos:

```typescript
// Backend - webhook handler
const DEDUP_CACHE_TTL = 60; // 1 minuto ao invés de 5

const webhookKey = `mp-webhook-${paymentId}`;
const alreadyProcessed = await cache.get(webhookKey);

if (alreadyProcessed) {
  console.log(`Webhook ${webhookKey} já foi processado recentemente`);
  return { success: true, message: 'Duplicado' };
}

// Processar webhook...
await cache.set(webhookKey, true, DEDUP_CACHE_TTL);
```

### Opção 2: Usar Request ID do MercadoPago (Recomendado)

MercadoPago envia um `x-request-id` único para cada webhook. Use isso ao invés de apenas o `paymentId`:

```typescript
// Backend - webhook handler
const requestId = request.headers['x-request-id'];
const paymentId = request.body.data.id;

// Chave única por request
const webhookKey = `mp-webhook-${requestId}`;
const alreadyProcessed = await cache.get(webhookKey);

if (alreadyProcessed) {
  console.log(`Webhook ${webhookKey} já foi processado`);
  return { success: true, message: 'Duplicado' };
}

// Processar webhook
const payment = await mercadopago.getPayment(paymentId);

if (payment.status === 'approved') {
  // Atualizar venda
  await updateSaleStatus(saleId, 'COMPLETED');
  
  // Emitir evento WebSocket
  io.to(`sale:${saleId}`).emit('pix-payment-confirmed', {
    saleId,
    mercadoPagoPaymentId: paymentId,
    status: 'completed',
  });
}

// Registrar como processado
await cache.set(webhookKey, true, 3600); // 1 hora
```

### Opção 3: Verificar Status Antes de Ignorar (Mais Seguro)

Ao invés de ignorar completamente, verifique se o pagamento já foi confirmado:

```typescript
// Backend - webhook handler
const webhookKey = `mp-webhook-${paymentId}`;
const alreadyProcessed = await cache.get(webhookKey);

if (alreadyProcessed) {
  // Ao invés de ignorar, verificar status atual
  const sale = await getSaleByMercadoPagoPaymentId(paymentId);
  
  if (sale && sale.status === 'COMPLETED') {
    console.log(`Pagamento ${paymentId} já confirmado, emitindo evento novamente`);
    
    // Emitir evento mesmo assim (para garantir que o frontend receba)
    io.to(`sale:${sale.id}`).emit('pix-payment-confirmed', {
      saleId: sale.id,
      mercadoPagoPaymentId: paymentId,
      status: 'completed',
    });
    
    return { success: true, message: 'Evento reenviado' };
  }
}

// Processar webhook normalmente...
```

## 🔧 Implementação Recomendada

Combine as 3 abordagens:

```typescript
// Backend - webhook handler completo
async function handleMercadoPagoWebhook(request) {
  const requestId = request.headers['x-request-id'];
  const paymentId = request.body.data.id;
  const webhookKey = `mp-webhook-${requestId}`;
  
  console.log(`[Webhook MP] Recebido: paymentId=${paymentId} requestId=${requestId}`);
  
  // 1. Verificar deduplicação por Request ID
  const alreadyProcessed = await cache.get(webhookKey);
  if (alreadyProcessed) {
    console.log(`[Webhook] Webhook ${webhookKey} já foi processado`);
    
    // 2. Verificar se pagamento já está confirmado
    const sale = await getSaleByMercadoPagoPaymentId(paymentId);
    if (sale && sale.status === 'COMPLETED') {
      console.log(`[Webhook] Pagamento ${paymentId} já confirmado, reenviando evento`);
      
      // Emitir evento novamente
      io.to(`sale:${sale.id}`).emit('pix-payment-confirmed', {
        saleId: sale.id,
        mercadoPagoPaymentId: paymentId,
        status: 'completed',
      });
    }
    
    return { success: true, message: 'Processado anteriormente' };
  }
  
  // 3. Processar webhook
  try {
    const payment = await mercadopago.getPayment(paymentId);
    
    if (payment.status === 'approved') {
      const sale = await getSaleByMercadoPagoPaymentId(paymentId);
      
      if (sale) {
        // Atualizar status
        await updateSaleStatus(sale.id, 'COMPLETED');
        
        // Emitir evento
        io.to(`sale:${sale.id}`).emit('pix-payment-confirmed', {
          saleId: sale.id,
          mercadoPagoPaymentId: paymentId,
          status: 'completed',
        });
        
        console.log(`[Webhook MP] Pagamento ${paymentId} confirmado com sucesso`);
      }
    }
    
    // Registrar como processado
    await cache.set(webhookKey, true, 3600);
    
    return { success: true, message: 'Webhook processado' };
  } catch (error) {
    console.error(`[Webhook MP] Erro ao processar pagamento ${paymentId}:`, error);
    return { success: false, error: error.message };
  }
}
```

## 📋 Checklist de Verificação

- [ ] Webhook está chegando ao backend (verificar logs)
- [ ] Pagamento está sendo reconhecido (status = 'approved')
- [ ] Deduplicação não está bloqueando o evento
- [ ] Evento WebSocket está sendo emitido
- [ ] Frontend está recebendo o evento
- [ ] Modal está fechando corretamente
- [ ] Toast de sucesso está aparecendo

## 🧪 Como Testar

1. **Fazer um pagamento de teste**
   - Usar cartão de teste do MercadoPago
   - Observar os logs do backend

2. **Verificar logs**
   ```
   [Webhook MP] Recebido: paymentId=151638656141 requestId=...
   [Webhook MP] Pagamento 151638656141 confirmado com sucesso
   [Webhook] Evento emitido para sale:...
   ```

3. **Verificar frontend**
   - Modal deve fechar
   - Toast "Pagamento aprovado!" deve aparecer
   - Página deve atualizar com a venda confirmada

## 🚨 Se Ainda Não Funcionar

1. Verificar se o `x-request-id` está sendo enviado pelo MercadoPago
2. Verificar se o cache está funcionando corretamente
3. Verificar se o WebSocket está conectado
4. Verificar se há erro de CORS ou autenticação
5. Verificar logs do MercadoPago no painel de controle

## 📞 Próximos Passos

1. Implementar a solução recomendada no backend
2. Testar com pagamento de teste
3. Monitorar logs por 24 horas
4. Se funcionar, fazer deploy em produção
