# Verificação do Fluxo de Integração Mercado Pago

## 📊 Análise das Rotas

### Rotas Criadas ✓

```
POST   /api/business/establishments/mercadopago/connect
GET    /api/business/establishments/mercadopago/integration
DELETE /api/business/establishments/mercadopago/disconnect
POST   /api/business/establishments/mercadopago/payment-preference
GET    /api/business/establishments/mercadopago/payment/[paymentId]
```

---

## 🔄 Fluxo de Integração

### 1. Carregar Integração (GET)
```
Frontend: loadIntegration()
    ↓
apiClient.get('/business/establishments/mercadopago/integration')
    ↓
Backend: verifyAuth() → Buscar integração do BD
    ↓
Response: MercadoPagoIntegration | 404
```

**Status:** ✓ Correto

---

### 2. Conectar Mercado Pago (POST)
```
Frontend: handleConnect()
    ↓
apiClient.post('/business/establishments/mercadopago/connect', {
  accessToken,
  publicKey
})
    ↓
Backend: verifyAuth() → Validar campos → Salvar no BD
    ↓
Response: MercadoPagoIntegration (201)
```

**Status:** ✓ Correto

---

### 3. Desconectar Mercado Pago (DELETE)
```
Frontend: handleDisconnect()
    ↓
apiClient.delete('/business/establishments/mercadopago/disconnect')
    ↓
Backend: verifyAuth() → Deletar do BD
    ↓
Response: 204 No Content
```

**Status:** ✓ Correto

---

### 4. Criar Preferência de Pagamento (POST)
```
Frontend: MercadoPagoPaymentModal
    ↓
apiClient.post('/business/establishments/mercadopago/payment-preference', {
  saleId,
  items,
  totalAmount,
  customerEmail,
  customerName
})
    ↓
Backend: verifyAuth() → Buscar integração → Criar preferência
    ↓
Response: {
  preferenceId,
  initPoint,
  sandboxInitPoint
}
```

**Status:** ✓ Correto

---

### 5. Obter Informações de Pagamento (GET)
```
Frontend: Consultar status
    ↓
apiClient.get('/business/establishments/mercadopago/payment/[paymentId]')
    ↓
Backend: verifyAuth() → Buscar integração → Consultar pagamento
    ↓
Response: Payment {
  id,
  status,
  transaction_amount,
  ...
}
```

**Status:** ✓ Correto

---

## ✅ Verificação de Autenticação

Todas as rotas verificam autenticação:
```typescript
const auth = await verifyAuth(request);
if (!auth) {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
```

**Status:** ✓ Correto

---

## ⚠️ Itens Pendentes (TODO)

### 1. Banco de Dados
- [ ] Criar tabela `mercadopago_integrations`
- [ ] Campos: id, establishmentId, accessToken, publicKey, isActive, isVerified, createdAt, updatedAt

### 2. Criptografia
- [ ] Implementar `encryptToken()` para armazenar credenciais
- [ ] Implementar `decryptToken()` para recuperar credenciais

### 3. Validação de Credenciais
- [ ] Implementar `validateMercadoPagoCredentials()`
- [ ] Chamar API do Mercado Pago para validar

### 4. SDK do Mercado Pago
- [ ] Instalar SDK: `npm install @mercadopago/sdk-nodejs`
- [ ] Implementar criação de preferências
- [ ] Implementar consulta de pagamentos

### 5. Webhook
- [ ] Criar rota: `POST /api/business/establishments/mercadopago/webhook`
- [ ] Validar assinatura do Mercado Pago
- [ ] Atualizar status de pagamentos

### 6. Integração com Vendas
- [ ] Adicionar botão de pagamento na página de vendas
- [ ] Integrar modal de pagamento
- [ ] Atualizar status de venda após pagamento

---

## 🔍 Verificação de Chamadas da API

### Frontend (página)
```typescript
// Carrega integração
apiClient.get('/business/establishments/mercadopago/integration')

// Conecta
apiClient.post('/business/establishments/mercadopago/connect', {...})

// Desconecta
apiClient.delete('/business/establishments/mercadopago/disconnect')
```

**Status:** ✓ Correto

### Frontend (modal de pagamento)
```typescript
// Cria preferência
apiClient.post('/business/establishments/mercadopago/payment-preference', {...})
```

**Status:** ✓ Correto

---

## 📋 Checklist de Implementação

- [x] Rotas criadas
- [x] Autenticação verificada
- [x] Frontend chamando rotas corretas
- [ ] Banco de dados implementado
- [ ] Criptografia implementada
- [ ] Validação de credenciais implementada
- [ ] SDK do Mercado Pago integrado
- [ ] Webhook implementado
- [ ] Integração com vendas completa

---

## 🎯 Próximos Passos

1. **Implementar Banco de Dados**
   - Criar tabela mercadopago_integrations
   - Adicionar migrations

2. **Implementar Criptografia**
   - Usar crypto do Node.js
   - Armazenar chave de criptografia em variável de ambiente

3. **Integrar SDK do Mercado Pago**
   - Instalar pacote
   - Implementar criação de preferências
   - Implementar consulta de pagamentos

4. **Implementar Webhook**
   - Receber notificações do Mercado Pago
   - Atualizar status de pagamentos

5. **Testar Fluxo Completo**
   - Testar conexão
   - Testar criação de preferência
   - Testar pagamento
   - Testar webhook

---

## 📝 Conclusão

O fluxo de integração está **estruturalmente correto**. As rotas estão bem definidas e o frontend está chamando corretamente. Faltam apenas as implementações de banco de dados, criptografia e integração com o SDK do Mercado Pago.

**Status Geral:** ✓ Pronto para implementação
