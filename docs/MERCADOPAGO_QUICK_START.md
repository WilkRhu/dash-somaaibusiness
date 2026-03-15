# ⚡ Quick Start - Mercado Pago

## 🎯 Resumo Rápido

### Onde Configurar?
- **Página:** `/establishments/mercadopago`
- **Menu:** Estabelecimentos → Integração Mercado Pago

### Onde Usar?
- **Página:** `/sales`
- **Ação:** Clique em "💳 Mercado Pago" em uma venda pendente

---

## 📝 Configuração em 5 Minutos

### 1️⃣ Obter Credenciais
```
Acesse: https://www.mercadopago.com.br/developers
Login → Credenciais → Copie Access Token e Public Key
```

### 2️⃣ Conectar
```
Vá para: /establishments/mercadopago
Clique: "Conectar Mercado Pago"
Cole: Access Token e Public Key
Clique: "Conectar Mercado Pago"
```

### 3️⃣ Usar
```
Vá para: /sales
Clique: "💳 Mercado Pago" em uma venda pendente
Clique: "Pagar com Mercado Pago"
Redireciona para checkout do Mercado Pago
```

---

## 🔑 Credenciais

### Access Token
- Começa com: `APP_USR-`
- Exemplo: `APP_USR-1234567890-XXXXX`
- Onde encontrar: Mercado Pago → Credenciais → Access Token

### Public Key
- Começa com: `APP_USR-`
- Exemplo: `APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- Onde encontrar: Mercado Pago → Credenciais → Public Key

---

## 🧪 Testar com Sandbox

### Cartões de Teste
| Tipo | Número | Status |
|------|--------|--------|
| Aprovado | 4111 1111 1111 1111 | ✓ Aprovado |
| Recusado | 4000 0000 0000 0002 | ✗ Recusado |
| Pendente | 4000 0000 0000 0009 | ⏳ Pendente |

### Data e CVV
- Data: Qualquer data futura (ex: 12/25)
- CVV: Qualquer 3 dígitos (ex: 123)

---

## ✅ Checklist

- [ ] Criei conta no Mercado Pago
- [ ] Copiei Access Token
- [ ] Copiei Public Key
- [ ] Conectei em `/establishments/mercadopago`
- [ ] Testei com Sandbox
- [ ] Mudei para credenciais de produção
- [ ] Testei uma venda real

---

## 🆘 Problemas Comuns

| Problema | Solução |
|----------|---------|
| Credenciais inválidas | Copie novamente do Mercado Pago |
| Integração não encontrada | Conecte primeiro em `/establishments/mercadopago` |
| Pagamento não aparece | Aguarde alguns minutos e atualize |
| Erro de conexão | Verifique sua internet e tente novamente |

---

## 📞 Links Úteis

- 🌐 [Mercado Pago Developer](https://www.mercadopago.com.br/developers)
- 📖 [Documentação](https://www.mercadopago.com.br/developers/pt/docs)
- 💬 [Suporte](https://www.mercadopago.com.br/developers/pt/support)

---

## 🎓 Próximos Passos

1. Configure o Mercado Pago
2. Teste com Sandbox
3. Mude para produção
4. Comece a receber pagamentos online
