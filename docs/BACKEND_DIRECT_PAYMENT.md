# Backend - Rotas para Pagamento Direto (PIX e Cartão)

O frontend agora espera estas rotas:

## 1. Gerar PIX Direto

```
POST /subscriptions/pix/:userId
```

**Body:**
```json
{
  "planId": "premium"
}
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "id": "payment-123456",
    "qrCode": "00020126580014br.gov.bcb.pix...",
    "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
    "expirationDate": "2024-03-01T12:00:00Z"
  }
}
```

**Implementação Node.js:**
```javascript
router.post('/subscriptions/pix/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { planId } = req.body;
    
    // Buscar preço do plano
    const planPrices = {
      'free': 0,
      'basic': 49.90,
      'premium': 149.90,
    };
    
    const amount = planPrices[planId];
    
    // Criar pagamento PIX no Mercado Pago
    const payment = await mercadopago.payment.create({
      transaction_amount: amount,
      description: `Assinatura ${planId}`,
      payment_method_id: 'pix',
      payer: {
        email: req.user.email,
      },
      metadata: {
        user_id: userId,
        plan_id: planId,
      },
    });
    
    return res.json({
      success: true,
      data: {
        id: payment.body.id,
        qrCode: payment.body.point_of_interaction.transaction_data.qr_code,
        qrCodeBase64: payment.body.point_of_interaction.transaction_data.qr_code_base64,
        expirationDate: payment.body.date_of_expiration,
      },
    });
  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
```

## 2. Processar Pagamento com Cartão

```
POST /subscriptions/card/:userId
```

**Body:**
```json
{
  "planId": "premium",
  "cardToken": "token-from-sdk",
  "installments": 1,
  "payerEmail": "user@example.com"
}
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "id": "payment-123456",
    "status": "approved",
    "statusDetail": "accredited"
  }
}
```

**Implementação Node.js:**
```javascript
router.post('/subscriptions/card/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { planId, cardToken, installments, payerEmail } = req.body;
    
    // Buscar preço do plano
    const planPrices = {
      'free': 0,
      'basic': 49.90,
      'premium': 149.90,
    };
    
    const amount = planPrices[planId];
    
    // Criar pagamento com cartão no Mercado Pago
    const payment = await mercadopago.payment.create({
      transaction_amount: amount,
      token: cardToken,
      description: `Assinatura ${planId}`,
      installments: installments,
      payment_method_id: 'visa', // Detectado automaticamente
      payer: {
        email: payerEmail,
      },
      metadata: {
        user_id: userId,
        plan_id: planId,
      },
    });
    
    // Se aprovado, atualizar plano do usuário
    if (payment.body.status === 'approved') {
      await User.findByIdAndUpdate(userId, {
        subscriptionPlan: planId.toUpperCase(),
        subscriptionStatus: 'active',
      });
    }
    
    return res.json({
      success: true,
      data: {
        id: payment.body.id,
        status: payment.body.status,
        statusDetail: payment.body.status_detail,
      },
    });
  } catch (error) {
    console.error('Erro ao processar cartão:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
```

## 3. Verificar Status do Pagamento

```
GET /subscriptions/payment-status/:paymentId
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "status": "approved"
  }
}
```

**Implementação Node.js:**
```javascript
router.get('/subscriptions/payment-status/:paymentId', authMiddleware, async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await mercadopago.payment.get(paymentId);
    
    // Se aprovado, atualizar plano do usuário
    if (payment.body.status === 'approved') {
      const userId = payment.body.metadata.user_id;
      const planId = payment.body.metadata.plan_id;
      
      await User.findByIdAndUpdate(userId, {
        subscriptionPlan: planId.toUpperCase(),
        subscriptionStatus: 'active',
      });
    }
    
    return res.json({
      success: true,
      data: {
        status: payment.body.status,
      },
    });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
```

## Resumo

- **PIX**: Gera QR Code direto no app, verifica status a cada 5s
- **Cartão**: Tokeniza no frontend, processa no backend
- **Ambos**: Atualizam plano do usuário automaticamente quando aprovados
