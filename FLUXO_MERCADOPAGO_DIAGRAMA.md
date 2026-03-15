# Diagrama do Fluxo Mercado Pago

## 🔄 Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INTEGRAÇÃO MERCADO PAGO                             │
└─────────────────────────────────────────────────────────────────────────────┘

1. CARREGAR INTEGRAÇÃO
═══════════════════════════════════════════════════════════════════════════════

    Frontend (Page)
        ↓
    useEffect(() => loadIntegration())
        ↓
    apiClient.get('/business/establishments/mercadopago/integration')
        ↓
    Backend (Route)
        ├─ verifyAuth()
        ├─ Buscar integração do BD
        └─ Retornar dados ou 404
        ↓
    Frontend
        ├─ Se 404: Mostrar formulário
        └─ Se 200: Mostrar status


2. CONECTAR MERCADO PAGO
═══════════════════════════════════════════════════════════════════════════════

    Frontend (Form)
        ↓
    handleConnect(accessToken, publicKey)
        ↓
    apiClient.post('/business/establishments/mercadopago/connect', {
      accessToken,
      publicKey
    })
        ↓
    Backend (Route)
        ├─ verifyAuth()
        ├─ Validar campos
        ├─ Validar credenciais (TODO)
        ├─ Criptografar tokens (TODO)
        ├─ Salvar no BD (TODO)
        └─ Retornar integração (201)
        ↓
    Frontend
        ├─ Limpar formulário
        ├─ Mostrar status
        └─ Toast de sucesso


3. DESCONECTAR MERCADO PAGO
═══════════════════════════════════════════════════════════════════════════════

    Frontend (Button)
        ↓
    handleDisconnect()
        ↓
    Confirmar ação
        ↓
    apiClient.delete('/business/establishments/mercadopago/disconnect')
        ↓
    Backend (Route)
        ├─ verifyAuth()
        ├─ Deletar do BD (TODO)
        └─ Retornar 204
        ↓
    Frontend
        ├─ Mostrar formulário
        └─ Toast de sucesso


4. CRIAR PREFERÊNCIA DE PAGAMENTO
═══════════════════════════════════════════════════════════════════════════════

    Frontend (Sales Page)
        ↓
    Clique em "Mercado Pago"
        ↓
    MercadoPagoPaymentModal abre
        ↓
    handleCreatePayment()
        ↓
    apiClient.post('/business/establishments/mercadopago/payment-preference', {
      saleId,
      items,
      totalAmount,
      customerEmail,
      customerName
    })
        ↓
    Backend (Route)
        ├─ verifyAuth()
        ├─ Validar campos
        ├─ Buscar integração do BD (TODO)
        ├─ Criar preferência com SDK (TODO)
        └─ Retornar initPoint (201)
        ↓
    Frontend
        ├─ Redirecionar para Mercado Pago
        └─ window.location.href = initPoint


5. WEBHOOK DE NOTIFICAÇÃO
═══════════════════════════════════════════════════════════════════════════════

    Mercado Pago
        ↓
    Pagamento processado
        ↓
    POST /api/business/establishments/mercadopago/webhook (TODO)
        ↓
    Backend (Route)
        ├─ Validar assinatura
        ├─ Atualizar status de pagamento
        ├─ Atualizar status de venda
        └─ Retornar 200
        ↓
    Sistema
        ├─ Notificar usuário
        └─ Atualizar dashboard


6. CONSULTAR PAGAMENTO
═══════════════════════════════════════════════════════════════════════════════

    Frontend
        ↓
    apiClient.get('/business/establishments/mercadopago/payment/[paymentId]')
        ↓
    Backend (Route)
        ├─ verifyAuth()
        ├─ Buscar integração do BD (TODO)
        ├─ Consultar pagamento com SDK (TODO)
        └─ Retornar dados (200)
        ↓
    Frontend
        └─ Exibir status do pagamento
```

---

## 📊 Estrutura de Dados

### MercadoPagoIntegration
```typescript
{
  id: string;                    // UUID
  establishmentId: string;       // UUID do estabelecimento
  accessToken: string;           // Criptografado
  publicKey: string;             // Criptografado
  isActive: boolean;             // Ativo/Inativo
  isVerified: boolean;           // Validado com Mercado Pago
  merchantName?: string;         // Nome da loja
  merchantEmail?: string;        // Email da loja
  createdAt: Date;               // Data de criação
  updatedAt: Date;               // Data de atualização
}
```

### PaymentPreference
```typescript
{
  preferenceId: string;          // ID da preferência
  initPoint: string;             // URL de checkout
  sandboxInitPoint: string;      // URL de sandbox
}
```

### Payment
```typescript
{
  id: string;                    // ID do pagamento
  status: string;                // approved, rejected, pending
  transaction_amount: number;    // Valor
  currency_id: string;           // BRL
  payer: {
    email: string;
  };
  external_reference: string;    // ID da venda
  created_at: Date;              // Data de criação
}
```

---

## 🔐 Fluxo de Segurança

```
Credenciais do Usuário
    ↓
Frontend (HTTPS)
    ↓
Backend (JWT Auth)
    ↓
Validar Token
    ↓
Criptografar Credenciais
    ↓
Armazenar no BD
    ↓
Descriptografar quando necessário
    ↓
Usar com SDK do Mercado Pago
```

---

## ✅ Status de Implementação

| Componente | Status | Notas |
|-----------|--------|-------|
| Rotas | ✓ Criadas | Estrutura pronta |
| Autenticação | ✓ Implementada | JWT verificado |
| Frontend | ✓ Implementado | Chamadas corretas |
| Banco de Dados | ⏳ Pendente | Criar tabela |
| Criptografia | ⏳ Pendente | Implementar |
| Validação | ⏳ Pendente | Chamar API MP |
| SDK Mercado Pago | ⏳ Pendente | Instalar e integrar |
| Webhook | ⏳ Pendente | Criar rota |
| Testes | ⏳ Pendente | Testar fluxo |

---

## 🎯 Próximas Ações

1. **Implementar Banco de Dados**
   - Criar tabela mercadopago_integrations
   - Adicionar índices

2. **Implementar Criptografia**
   - Usar crypto do Node.js
   - Armazenar chave em .env

3. **Integrar SDK**
   - npm install @mercadopago/sdk-nodejs
   - Implementar preferências
   - Implementar consultas

4. **Implementar Webhook**
   - Receber notificações
   - Atualizar status

5. **Testar**
   - Teste de conexão
   - Teste de pagamento
   - Teste de webhook

---

**Fluxo estruturalmente correto e pronto para implementação! ✓**
