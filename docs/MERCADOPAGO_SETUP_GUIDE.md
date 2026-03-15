# Guia de Configuração - Integração Mercado Pago

## 📍 Onde Configurar

### 1. Página de Configuração do Mercado Pago
**Caminho:** `/establishments/mercadopago`

Esta é a página principal onde você configura a integração do Mercado Pago para seu estabelecimento.

### 2. Página de Vendas
**Caminho:** `/sales`

Aqui você pode usar o Mercado Pago para gerar links de pagamento para vendas pendentes.

---

## 🔧 Passo a Passo: Como Configurar

### Passo 1: Acessar a Página de Configuração

1. No menu lateral, procure por **"Estabelecimentos"** ou **"Configurações"**
2. Clique em **"Integração Mercado Pago"** ou acesse diretamente: `/establishments/mercadopago`

### Passo 2: Obter Suas Credenciais do Mercado Pago

#### Opção A: Se você já tem uma conta Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers
2. Faça login com sua conta
3. No menu lateral, procure por:
   - **"Credenciais"** ou
   - **"Aplicações"** ou
   - **"Integração"**

#### Opção B: Se você não tem uma conta Mercado Pago

1. Acesse: https://www.mercadopago.com.br
2. Clique em **"Criar Conta"**
3. Preencha seus dados (CPF/CNPJ, email, senha)
4. Confirme seu email
5. Depois siga a Opção A

### Passo 3: Copiar as Credenciais

Na página de credenciais do Mercado Pago, você encontrará:

#### Access Token
- Começa com: `APP_USR-`
- Exemplo: `APP_USR-1234567890-XXXXX`
- **Copie este código**

#### Public Key
- Também começa com: `APP_USR-`
- Exemplo: `APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Copie este código**

### Passo 4: Preencher o Formulário

Na página `/establishments/mercadopago`:

1. Clique em **"Conectar Mercado Pago"**
2. Cole o **Access Token** no primeiro campo
3. Cole a **Public Key** no segundo campo
4. Clique em **"Conectar Mercado Pago"**

### Passo 5: Confirmar a Conexão

Se tudo correr bem, você verá:
- ✓ Status: **Ativo**
- ✓ Loja: Nome da sua loja
- ✓ Email: Email da sua conta

---

## 💳 Como Usar para Receber Pagamentos

### Na Página de Vendas

1. Acesse: `/sales`
2. Procure pela venda que deseja receber pagamento
3. Se o status for **"Pendente"**, você verá dois botões:
   - **✓ Confirmar** - Confirmar pagamento manual
   - **💳 Mercado Pago** - Gerar link de pagamento

### Gerar Link de Pagamento

1. Clique em **"💳 Mercado Pago"**
2. Um modal aparecerá com:
   - Resumo do pagamento
   - Itens da venda
   - Total a pagar
3. Clique em **"Pagar com Mercado Pago"**
4. Você será redirecionado para o Mercado Pago
5. O cliente completa o pagamento
6. Você recebe uma notificação

---

## 🔐 Segurança

### Suas Credenciais São Seguras

- ✓ Armazenadas criptografadas no banco de dados
- ✓ Nunca são compartilhadas com terceiros
- ✓ Apenas você pode acessá-las

### Boas Práticas

1. **Não compartilhe suas credenciais** com ninguém
2. **Use credenciais de sandbox** para testes
3. **Use credenciais de produção** apenas em produção
4. **Regenere suas credenciais** se suspeitar de vazamento

---

## 🧪 Testando com Sandbox

### O que é Sandbox?

Sandbox é um ambiente de teste do Mercado Pago onde você pode:
- Testar pagamentos sem usar dinheiro real
- Usar cartões de teste
- Simular diferentes cenários

### Como Usar Sandbox

1. Na página de credenciais do Mercado Pago, procure por:
   - **"Ambiente de Teste"** ou
   - **"Sandbox"** ou
   - **"Modo de Teste"**

2. Copie as credenciais de teste (também começam com `APP_USR-`)

3. Na página `/establishments/mercadopago`, preencha com as credenciais de teste

4. Use os cartões de teste:
   - **Aprovado:** 4111 1111 1111 1111
   - **Recusado:** 4000 0000 0000 0002
   - **Pendente:** 4000 0000 0000 0009

5. Data de validade: Qualquer data futura (ex: 12/25)

6. CVV: Qualquer número com 3 dígitos (ex: 123)

---

## ❌ Solução de Problemas

### Erro: "Credenciais Inválidas"

**Possíveis causas:**
- Access Token ou Public Key incorretos
- Credenciais copiadas incompletas
- Credenciais expiradas

**Solução:**
1. Volte à página de credenciais do Mercado Pago
2. Copie novamente com cuidado
3. Cole na página de configuração
4. Tente conectar novamente

### Erro: "Integração Não Encontrada"

**Possíveis causas:**
- Você não conectou o Mercado Pago ainda
- A integração foi desconectada

**Solução:**
1. Acesse `/establishments/mercadopago`
2. Clique em "Conectar Mercado Pago"
3. Preencha com suas credenciais
4. Clique em "Conectar"

### Erro: "Integração Não Ativa"

**Possíveis causas:**
- A integração foi desativada
- Houve um problema na conexão

**Solução:**
1. Desconecte o Mercado Pago
2. Conecte novamente com as credenciais corretas

### Pagamento Não Aparece

**Possíveis causas:**
- Webhook não configurado
- Problema de conexão
- Pagamento ainda em processamento

**Solução:**
1. Aguarde alguns minutos
2. Atualize a página
3. Verifique no painel do Mercado Pago
4. Confirme manualmente se necessário

---

## 📞 Suporte

### Precisa de Ajuda?

- **Mercado Pago:** https://www.mercadopago.com.br/developers/pt/support
- **Documentação:** https://www.mercadopago.com.br/developers/pt/docs
- **Chat de Suporte:** Disponível no painel do Mercado Pago

---

## 📋 Checklist de Configuração

- [ ] Criei uma conta no Mercado Pago
- [ ] Acessei a página de credenciais
- [ ] Copiei o Access Token
- [ ] Copiei a Public Key
- [ ] Acessei `/establishments/mercadopago`
- [ ] Cliquei em "Conectar Mercado Pago"
- [ ] Colei as credenciais
- [ ] Cliquei em "Conectar"
- [ ] Vi a mensagem de sucesso
- [ ] Testei com uma venda pendente
- [ ] Cliquei em "💳 Mercado Pago"
- [ ] Completei um pagamento de teste

---

## 🎯 Próximos Passos

Após configurar o Mercado Pago:

1. **Teste com Sandbox** - Use credenciais de teste
2. **Faça um Pagamento de Teste** - Teste o fluxo completo
3. **Mude para Produção** - Use credenciais reais
4. **Comece a Receber Pagamentos** - Seus clientes podem pagar online

---

## 📚 Referências

- [Documentação Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs)
- [Como Obter Credenciais](https://www.mercadopago.com.br/developers/pt/docs/getting-started/requirements)
- [Checkout Pro](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/integrate-checkout-pro)
- [Webhooks](https://www.mercadopago.com.br/developers/pt/docs/webhooks)
