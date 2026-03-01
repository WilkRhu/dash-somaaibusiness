# Backend - Implementação Mercado Pago

## 📦 Instalação

```bash
npm install mercadopago
```

## 🔧 Configuração

### 1. Variáveis de Ambiente (Backend)

```env
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-4f50326e-7eaf-4289-8bd3-cad45ae90d30
```

## 💻 Código Backend (Node.js/Express)

### Arquivo: `src/controllers/paymentController.ts`

```typescript
import mercadopago from 'mercadopago';

// Configurar Mercado Pago
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN!
});

// Criar pagamento PIX
export async function createPixPayment(req: any, res: any) {
  try {
    const { planId, amount, description } = req.body;
    const userId = req.user.id; // Do middleware de autenticação

    // Criar pagamento no Mercado Pago
    const payment = await mercadopago.payment.create({
      transaction_amount: amount,
      description: description,
      payment_method_id: 'pix',
      payer: {
        email: req.user.email,
        first_name: req.user.name,
      },
      metadata: {
        user_id: userId,
        plan_id: planId,
      },
    });

    // Retornar dados do PIX
    return res.json({
      success: true,
      data: {
        id: payment.body.id,
        status: payment.body.status,
        qrCode: payment.body.point_of_interaction.transaction_data.qr_code,
        qrCodeBase64: payment.body.point_of_interaction.transaction_data.qr_code_base64,
        expirationDate: payment.body.date_of_expiration,
      },
    });
  } catch (error: any) {
    console.error('Erro ao criar pagamento PIX:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro ao criar pagamento PIX',
    });
  }
}

// Criar pagamento com Cartão
export async function createCardPayment(req: any, res: any) {
  try {
    const { planId, amount, description, cardToken, installments, payerEmail } = req.body;
    const userId = req.user.id;

    // Criar pagamento no Mercado Pago
    const payment = await mercadopago.payment.create({
      transaction_amount: amount,
      token: cardToken,
      description: description,
      installments: installments,
      payment_method_id: 'visa', // Será detectado automaticamente pelo token
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
      await updateUserPlan(userId, planId);
    }

    return res.json({
      success: true,
      data: {
        id: payment.body.id,
        status: payment.body.status,
        statusDetail: payment.body.status_detail,
      },
    });
  } catch (error: any) {
    console.error('Erro ao criar pagamento com cartão:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro ao processar pagamento',
    });
  }
}

// Verificar status do pagamento
export async function checkPaymentStatus(req: any, res: any) {
  try {
    const { paymentId } = req.params;

    const payment = await mercadopago.payment.get(paymentId);

    // Se aprovado e ainda não processado, atualizar plano
    if (payment.body.status === 'approved') {
      const userId = payment.body.metadata.user_id;
      const planId = payment.body.metadata.plan_id;
      await updateUserPlan(userId, planId);
    }

    return res.json({
      success: true,
      data: {
        status: payment.body.status,
        approved: payment.body.status === 'approved',
      },
    });
  } catch (error: any) {
    console.error('Erro ao verificar status:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Erro ao verificar status',
    });
  }
}

// Webhook do Mercado Pago (notificações automáticas)
export async function mercadoPagoWebhook(req: any, res: any) {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      const payment = await mercadopago.payment.get(paymentId);

      if (payment.body.status === 'approved') {
        const userId = payment.body.metadata.user_id;
        const planId = payment.body.metadata.plan_id;
        await updateUserPlan(userId, planId);
      }
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no webhook:', error);
    return res.status(500).send('Error');
  }
}

// Função auxiliar para atualizar plano do usuário
async function updateUserPlan(userId: string, planId: string) {
  // Implementar lógica de atualização no banco de dados
  // Exemplo:
  // await User.findByIdAndUpdate(userId, {
  //   subscriptionPlan: planId,
  //   subscriptionStatus: 'active',
  //   subscriptionStartDate: new Date(),
  //   subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
  // });
  
  console.log(`Atualizando plano do usuário ${userId} para ${planId}`);
}
```

### Arquivo: `src/routes/paymentRoutes.ts`

```typescript
import express from 'express';
import { 
  createPixPayment, 
  createCardPayment, 
  checkPaymentStatus,
  mercadoPagoWebhook 
} from '../controllers/paymentController';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// Rotas protegidas (requerem autenticação)
router.post('/business/payments/pix', authMiddleware, createPixPayment);
router.post('/business/payments/card', authMiddleware, createCardPayment);
router.get('/business/payments/:paymentId/status', authMiddleware, checkPaymentStatus);

// Webhook (não requer autenticação, mas deve validar assinatura)
router.post('/webhooks/mercadopago', mercadoPagoWebhook);

export default router;
```

### Arquivo: `src/app.ts` (adicionar rotas)

```typescript
import paymentRoutes from './routes/paymentRoutes';

// ... outras configurações

app.use('/api', paymentRoutes);
```

## 🔒 Configurar Webhook no Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Selecione sua aplicação
3. Vá em "Webhooks"
4. Adicione a URL: `https://seu-dominio.com/api/webhooks/mercadopago`
5. Selecione eventos: `payment`

## 🧪 Testar Localmente

### Usar ngrok para expor localhost:

```bash
ngrok http 3001
```

Copie a URL gerada e configure no webhook do Mercado Pago.

## 📊 Status de Pagamento

### PIX
- `pending` - Aguardando pagamento
- `approved` - Pagamento aprovado
- `cancelled` - Cancelado
- `expired` - Expirado

### Cartão
- `approved` - Aprovado
- `rejected` - Recusado
- `pending` - Pendente (análise)
- `in_process` - Em processamento

## ⚠️ Importante

1. **Nunca exponha o Access Token no frontend**
2. **Valide sempre no backend antes de atualizar o plano**
3. **Use webhook para notificações em tempo real**
4. **Implemente logs de todas as transações**
5. **Teste em ambiente sandbox antes de produção**

## 🔑 Credenciais de Teste

Para testar, use as credenciais de teste do Mercado Pago:
- Acesse: https://www.mercadopago.com.br/developers/panel/credentials
- Use "Credenciais de teste" durante desenvolvimento
- Troque para "Credenciais de produção" ao publicar

## 📝 Exemplo de Resposta do Mercado Pago (PIX)

```json
{
  "id": 1234567890,
  "status": "pending",
  "point_of_interaction": {
    "transaction_data": {
      "qr_code": "00020126580014br.gov.bcb.pix...",
      "qr_code_base64": "iVBORw0KGgoAAAANSUhEUgAA..."
    }
  },
  "date_of_expiration": "2024-03-01T12:00:00.000Z"
}
```

## 🚀 Próximos Passos

1. Implementar os endpoints no backend
2. Testar com credenciais de teste
3. Configurar webhook
4. Implementar logs de transações
5. Adicionar tratamento de erros robusto
6. Testar fluxo completo
7. Migrar para produção
```

Salve este arquivo como referência para implementar o backend!
