# Backend - Implementação Mercado Pago (Fluxo Correto)

## 📋 Endpoints Necessários

### 1. Gerar PIX
```
POST /payments/pix/generate
```

**Request Body:**
```json
{
  "amount": 99.90,
  "orderId": "order-1234567890",
  "userEmail": "user@email.com",
  "userId": "user-id-123",
  "planId": "premium",
  "description": "Assinatura Premium - SomaAI Business"
}
```

**Response:**
```json
{
  "qrCode": "00020126580014br.gov.bcb.pix...",
  "copyKey": "iVBORw0KGgoAAAANSUhEUgAA...",
  "paymentId": "1234567890",
  "expiresAt": "2024-03-01T12:00:00Z"
}
```

**Implementação Node.js:**
```javascript
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN 
});
const payment = new Payment(client);

app.post('/payments/pix/generate', async (req, res) => {
  try {
    const { amount, orderId, userEmail, userId, planId, description } = req.body;

    const result = await payment.create({
      body: {
        transaction_amount: amount,
        description: description,
        payment_method_id: 'pix',
        payer: {
          email: userEmail,
          identification: {
            type: 'CPF',
            number: '12345678900' // Pode pegar do usuário
          }
        },
        metadata: {
          user_id: userId,
          plan_id: planId,
          order_id: orderId,
        }
      }
    });

    return res.json({
      qrCode: result.point_of_interaction.transaction_data.qr_code,
      copyKey: result.point_of_interaction.transaction_data.qr_code_base64,
      paymentId: result.id,
      expiresAt: result.date_of_expiration
    });
  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    return res.status(500).json({
      message: error.message || 'Erro ao gerar código PIX'
    });
  }
});
```

### 2. Processar Cartão
```
POST /payments/card/process
```

**Request Body:**
```json
{
  "amount": 99.90,
  "orderId": "order-1234567890",
  "userEmail": "user@email.com",
  "userId": "user-id-123",
  "planId": "premium",
  "description": "Assinatura Premium - SomaAI Business",
  "cardToken": "token-from-sdk",
  "installments": 1
}
```

**Response:**
```json
{
  "status": "approved",
  "paymentId": "1234567890",
  "statusDetail": "accredited"
}
```

**Implementação Node.js:**
```javascript
app.post('/payments/card/process', async (req, res) => {
  try {
    const { 
      amount, orderId, userEmail, userId, planId, 
      description, cardToken, installments 
    } = req.body;

    const result = await payment.create({
      body: {
        transaction_amount: amount,
        token: cardToken,
        description: description,
        installments: installments,
        payment_method_id: 'visa', // Detectado automaticamente
        payer: {
          email: userEmail,
        },
        metadata: {
          user_id: userId,
          plan_id: planId,
          order_id: orderId,
        }
      }
    });

    // Se aprovado, atualizar plano do usuário
    if (result.status === 'approved') {
      await updateUserPlan(userId, planId);
    }

    return res.json({
      status: result.status,
      paymentId: result.id,
      statusDetail: result.status_detail
    });
  } catch (error) {
    console.error('Erro ao processar cartão:', error);
    return res.status(500).json({
      message: error.message || 'Erro ao processar pagamento'
    });
  }
});
```

### 3. Verificar Status (Polling)
```
GET /payments/status/:paymentId
```

**Response:**
```json
{
  "status": "approved"
}
```

**Implementação Node.js:**
```javascript
app.get('/payments/status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;

    const result = await payment.get({ id: paymentId });

    // Se aprovado, atualizar plano do usuário
    if (result.status === 'approved') {
      const userId = result.metadata.user_id;
      const planId = result.metadata.plan_id;
      await updateUserPlan(userId, planId);
    }

    return res.json({
      status: result.status
    });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return res.status(500).json({
      message: error.message || 'Erro ao verificar status'
    });
  }
});
```

### 4. Webhook (Notificações do Mercado Pago)
```
POST /webhooks/payment
```

**Implementação Node.js:**
```javascript
app.post('/webhooks/payment', async (req, res) => {
  try {
    const { data, type } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      const result = await payment.get({ id: paymentId });

      if (result.status === 'approved') {
        const userId = result.metadata.user_id;
        const planId = result.metadata.plan_id;
        await updateUserPlan(userId, planId);
        
        console.log(`✅ Pagamento ${paymentId} aprovado para usuário ${userId}`);
      }
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no webhook:', error);
    return res.status(500).send('Error');
  }
});
```

### Função Auxiliar
```javascript
async function updateUserPlan(userId, planId) {
  // Atualizar no banco de dados
  await User.findByIdAndUpdate(userId, {
    subscriptionPlan: planId.toUpperCase(),
    subscriptionStatus: 'active',
    subscriptionStartDate: new Date(),
    subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
  });
  
  console.log(`Plano ${planId} ativado para usuário ${userId}`);
}
```

## 🔧 Configurar Webhook no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Selecione sua aplicação
3. Vá em "Webhooks"
4. Adicione a URL: `https://seu-dominio.com/webhooks/payment`
5. Selecione eventos: `payment`

## 📊 Fluxo Completo

```
Frontend                    Backend                 Mercado Pago
   |                           |                          |
   |--POST /payments/pix/generate (R$ 99.90)------------>|
   |                           |                          |
   |                           |--Create Payment--------->|
   |                           |   (R$ 99.90)             |
   |                           |                          |
   |                           |<--QR Code + ID-----------|
   |<--QR Code + ID------------|                          |
   |                           |                          |
   |--Renderiza QR Code--------|                          |
   |                           |                          |
   |                    [Usuário paga no banco]           |
   |                           |                          |
   |                           |<--Webhook (approved)-----|
   |                           |                          |
   |--GET /payments/status---->|                          |
   |<--status: approved--------|                          |
   |                           |                          |
   |--Sucesso!-----------------|                          |
```

## ✅ Checklist

- [ ] Instalar: `npm install mercadopago`
- [ ] Configurar Access Token no `.env`
- [ ] Implementar POST `/payments/pix/generate`
- [ ] Implementar POST `/payments/card/process`
- [ ] Implementar GET `/payments/status/:paymentId`
- [ ] Implementar POST `/webhooks/payment`
- [ ] Configurar webhook no painel do Mercado Pago
- [ ] Testar PIX em sandbox
- [ ] Testar cartão em sandbox
- [ ] Migrar para produção

Pronto! 🚀
