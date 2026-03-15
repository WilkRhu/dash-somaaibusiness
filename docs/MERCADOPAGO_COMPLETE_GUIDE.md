# 📚 Guia Completo - Integração Mercado Pago

## 📖 Índice

1. [Visão Geral](#visão-geral)
2. [Onde Configurar](#onde-configurar)
3. [Passo a Passo](#passo-a-passo)
4. [Como Usar](#como-usar)
5. [Segurança](#segurança)
6. [Testes](#testes)
7. [Troubleshooting](#troubleshooting)
8. [Referências](#referências)

---

## 🎯 Visão Geral

A integração do Mercado Pago permite que você:

- ✓ Receba pagamentos online de seus clientes
- ✓ Gere links de pagamento para vendas pendentes
- ✓ Acompanhe o status dos pagamentos
- ✓ Receba notificações de pagamentos
- ✓ Teste em ambiente seguro (Sandbox)

---

## 📍 Onde Configurar

### Página Principal de Configuração
**URL:** `/establishments/mercadopago`

Esta é a página onde você:
- Conecta suas credenciais do Mercado Pago
- Visualiza o status da integração
- Atualiza ou desconecta a integração

### Página de Vendas
**URL:** `/sales`

Aqui você:
- Visualiza todas as suas vendas
- Gera links de pagamento para vendas pendentes
- Acompanha o status dos pagamentos

---

## 🔧 Passo a Passo

### Passo 1: Criar Conta no Mercado Pago

Se você ainda não tem uma conta:

1. Acesse: https://www.mercadopago.com.br
2. Clique em "Criar Conta"
3. Escolha: Pessoa Física ou Jurídica
4. Preencha seus dados (CPF/CNPJ, email, senha)
5. Confirme seu email
6. Pronto! Sua conta está criada

### Passo 2: Obter Credenciais

1. Acesse: https://www.mercadopago.com.br/developers
2. Faça login com sua conta
3. No menu lateral, procure por:
   - "Credenciais" ou
   - "Aplicações" ou
   - "Integração"
4. Você verá dois campos:
   - **Access Token** (começa com `APP_USR-`)
   - **Public Key** (também começa com `APP_USR-`)
5. Copie ambos os valores

### Passo 3: Conectar no Sistema

1. Acesse: `/establishments/mercadopago`
2. Se não estiver conectado, clique em "Conectar Mercado Pago"
3. Preencha o formulário:
   - **Access Token:** Cole o valor copiado
   - **Public Key:** Cole o valor copiado
4. Clique em "Conectar Mercado Pago"
5. Se tudo correr bem, você verá:
   - ✓ Status: Ativo
   - ✓ Loja: Nome da sua loja
   - ✓ Email: Email da sua conta

### Passo 4: Testar com Sandbox

Antes de usar em produção, teste com credenciais de sandbox:

1. Na página de credenciais do Mercado Pago, procure por "Ambiente de Teste"
2. Copie as credenciais de teste
3. Volte para `/establishments/mercadopago`
4. Clique em "Atualizar Credenciais"
5. Cole as credenciais de teste
6. Clique em "Conectar Mercado Pago"
7. Agora você está em modo de teste

### Passo 5: Usar em Vendas

1. Acesse: `/sales`
2. Procure por uma venda com status "Pendente"
3. Clique em "💳 Mercado Pago"
4. Um modal aparecerá com o resumo do pagamento
5. Clique em "Pagar com Mercado Pago"
6. Você será redirecionado para o Mercado Pago
7. Complete o pagamento (use cartões de teste se estiver em sandbox)
8. Você será redirecionado de volta
9. O status da venda será atualizado

---

## 💳 Como Usar

### Gerar Link de Pagamento

1. Acesse `/sales`
2. Procure pela venda que deseja receber pagamento
3. Se o status for "Pendente", você verá dois botões:
   - **✓ Confirmar** - Confirmar pagamento manual
   - **💳 Mercado Pago** - Gerar link de pagamento
4. Clique em "💳 Mercado Pago"
5. Um modal aparecerá com:
   - Resumo do pagamento
   - Itens da venda
   - Total a pagar
   - Dados do cliente
6. Clique em "Pagar com Mercado Pago"
7. Você será redirecionado para o Mercado Pago
8. O cliente completa o pagamento
9. Você recebe uma notificação

### Compartilhar Link com Cliente

Você pode compartilhar o link de pagamento com seu cliente:

1. Após gerar o link, copie a URL
2. Envie por:
   - Email
   - WhatsApp
   - SMS
   - Qualquer outro meio
3. O cliente clica no link
4. O cliente completa o pagamento
5. Você recebe uma notificação

### Acompanhar Pagamentos

1. Acesse `/sales`
2. Procure pela venda
3. O status será atualizado automaticamente:
   - **Pendente** - Aguardando pagamento
   - **Concluída** - Pagamento recebido
   - **Cancelada** - Pagamento recusado ou cancelado

---

## 🔐 Segurança

### Suas Credenciais São Seguras

- ✓ Armazenadas criptografadas no banco de dados
- ✓ Nunca são compartilhadas com terceiros
- ✓ Apenas você pode acessá-las
- ✓ Todos os endpoints requerem autenticação JWT

### Boas Práticas

1. **Não compartilhe suas credenciais** com ninguém
2. **Use credenciais de sandbox** para testes
3. **Use credenciais de produção** apenas em produção
4. **Regenere suas credenciais** se suspeitar de vazamento
5. **Mantenha seu email seguro** - é a chave para sua conta
6. **Use senhas fortes** no Mercado Pago

### Proteção de Dados

- Todos os dados são transmitidos via HTTPS
- Credenciais são criptografadas com AES-256
- Cada usuário só acessa seus próprios dados
- Logs de acesso são mantidos para auditoria

---

## 🧪 Testes

### Ambiente de Sandbox

Sandbox é um ambiente de teste seguro onde você pode:
- Testar pagamentos sem usar dinheiro real
- Usar cartões de teste
- Simular diferentes cenários
- Validar seu fluxo de pagamento

### Cartões de Teste

| Tipo | Número | Status | Descrição |
|------|--------|--------|-----------|
| Aprovado | 4111 1111 1111 1111 | ✓ Aprovado | Pagamento aprovado |
| Recusado | 4000 0000 0000 0002 | ✗ Recusado | Pagamento recusado |
| Pendente | 4000 0000 0000 0009 | ⏳ Pendente | Pagamento pendente |

### Dados de Teste

- **Data de Validade:** Qualquer data futura (ex: 12/25)
- **CVV:** Qualquer número com 3 dígitos (ex: 123)
- **Nome do Titular:** Qualquer nome
- **CPF:** Qualquer CPF válido (ex: 123.456.789-00)

### Teste Completo

1. Configure com credenciais de sandbox
2. Acesse `/sales`
3. Procure por uma venda pendente
4. Clique em "💳 Mercado Pago"
5. Clique em "Pagar com Mercado Pago"
6. Use um cartão de teste
7. Complete o pagamento
8. Verifique se o status foi atualizado

---

## ❌ Troubleshooting

### Erro: "Credenciais Inválidas"

**Possíveis causas:**
- Access Token ou Public Key incorretos
- Credenciais copiadas incompletas
- Credenciais expiradas
- Espaços em branco extras

**Solução:**
1. Volte à página de credenciais do Mercado Pago
2. Copie novamente com cuidado (sem espaços)
3. Cole na página de configuração
4. Tente conectar novamente

### Erro: "Integração Não Encontrada"

**Possíveis causas:**
- Você não conectou o Mercado Pago ainda
- A integração foi desconectada
- Você está em outro estabelecimento

**Solução:**
1. Acesse `/establishments/mercadopago`
2. Clique em "Conectar Mercado Pago"
3. Preencha com suas credenciais
4. Clique em "Conectar"

### Erro: "Integração Não Ativa"

**Possíveis causas:**
- A integração foi desativada
- Houve um problema na conexão
- Credenciais expiradas

**Solução:**
1. Desconecte o Mercado Pago
2. Conecte novamente com as credenciais corretas
3. Se persistir, regenere as credenciais no Mercado Pago

### Pagamento Não Aparece

**Possíveis causas:**
- Webhook não configurado
- Problema de conexão
- Pagamento ainda em processamento
- Erro na sincronização

**Solução:**
1. Aguarde alguns minutos
2. Atualize a página (F5)
3. Verifique no painel do Mercado Pago
4. Confirme manualmente se necessário
5. Verifique sua conexão de internet

### Erro de Conexão

**Possíveis causas:**
- Sem conexão de internet
- Servidor do Mercado Pago indisponível
- Firewall bloqueando conexão
- Proxy interferindo

**Solução:**
1. Verifique sua conexão de internet
2. Tente novamente em alguns minutos
3. Verifique se o Mercado Pago está funcionando
4. Verifique configurações de firewall/proxy

### Cartão Recusado

**Possíveis causas:**
- Cartão expirado
- Saldo insuficiente
- Cartão bloqueado
- Dados incorretos

**Solução:**
1. Verifique os dados do cartão
2. Use um cartão diferente
3. Verifique se o cartão está ativo
4. Contate seu banco

---

## 📞 Suporte

### Precisa de Ajuda?

- **Mercado Pago Developer:** https://www.mercadopago.com.br/developers
- **Documentação:** https://www.mercadopago.com.br/developers/pt/docs
- **Suporte:** https://www.mercadopago.com.br/developers/pt/support
- **Chat:** Disponível no painel do Mercado Pago

### Documentação Oficial

- [Getting Started](https://www.mercadopago.com.br/developers/pt/docs/getting-started)
- [Checkout Pro](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro)
- [Webhooks](https://www.mercadopago.com.br/developers/pt/docs/webhooks)
- [API Reference](https://www.mercadopago.com.br/developers/pt/reference)

---

## 📋 Referências

### Links Úteis

- 🌐 [Mercado Pago](https://www.mercadopago.com.br)
- 👨‍💻 [Mercado Pago Developer](https://www.mercadopago.com.br/developers)
- 📖 [Documentação](https://www.mercadopago.com.br/developers/pt/docs)
- 💬 [Suporte](https://www.mercadopago.com.br/developers/pt/support)
- 🔐 [Segurança](https://www.mercadopago.com.br/developers/pt/docs/security)

### Documentos Relacionados

- [MERCADOPAGO_INTEGRATION.md](./MERCADOPAGO_INTEGRATION.md) - Documentação técnica
- [MERCADOPAGO_IMPLEMENTATION.md](./MERCADOPAGO_IMPLEMENTATION.md) - Guia de implementação
- [MERCADOPAGO_SETUP_GUIDE.md](./MERCADOPAGO_SETUP_GUIDE.md) - Guia de configuração
- [MERCADOPAGO_QUICK_START.md](./MERCADOPAGO_QUICK_START.md) - Quick start
- [MERCADOPAGO_VISUAL_GUIDE.md](./MERCADOPAGO_VISUAL_GUIDE.md) - Guia visual

---

## ✅ Checklist Final

- [ ] Criei conta no Mercado Pago
- [ ] Obtive credenciais de teste
- [ ] Conectei em `/establishments/mercadopago`
- [ ] Testei com Sandbox
- [ ] Obtive credenciais de produção
- [ ] Atualizei para credenciais de produção
- [ ] Testei uma venda real
- [ ] Recebi o pagamento
- [ ] Compartilhei link com cliente
- [ ] Acompanhei o pagamento

---

## 🎓 Próximos Passos

1. **Configure o Mercado Pago** - Siga o passo a passo
2. **Teste com Sandbox** - Use credenciais de teste
3. **Mude para Produção** - Use credenciais reais
4. **Comece a Receber Pagamentos** - Seus clientes podem pagar online
5. **Acompanhe os Pagamentos** - Monitore suas vendas
6. **Otimize seu Fluxo** - Melhore a experiência do cliente

---

## 📞 Contato

Se tiver dúvidas ou problemas:

1. Consulte este guia
2. Verifique a documentação do Mercado Pago
3. Contate o suporte do Mercado Pago
4. Abra um ticket de suporte conosco

---

**Última atualização:** 11 de março de 2026

**Versão:** 1.0.0
