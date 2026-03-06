# Quick Start - Sistema de Relatórios

## 🚀 Início Rápido

### 1. Verificar Configuração

```bash
# Verificar .env
cat .env

# Deve conter:
# NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Instalar Dependências (se necessário)

```bash
npm install
```

### 3. Rodar o Frontend

```bash
npm run dev
```

### 4. Acessar as Páginas

```
Dashboard:   http://localhost:3000/home
Relatórios:  http://localhost:3000/reports
```

---

## 🧪 Testes Rápidos

### Teste 1: Dashboard
1. Acesse `http://localhost:3000/home`
2. Verifique se os cards carregam
3. Veja se as vendas recentes aparecem
4. Confirme que os alertas funcionam

### Teste 2: Relatórios
1. Acesse `http://localhost:3000/reports`
2. Ajuste as datas
3. Veja o resumo financeiro
4. Clique em "Exportar CSV"

### Teste 3: API Direta

```bash
# Substitua {establishmentId} e {token}

# Dashboard Stats
curl http://localhost:3001/business/establishments/{establishmentId}/reports/dashboard \
  -H "Authorization: Bearer {token}"

# Sales Report
curl "http://localhost:3001/business/establishments/{establishmentId}/reports/sales?startDate=2026-02-01&endDate=2026-02-28" \
  -H "Authorization: Bearer {token}"
```

---

## 📊 O Que Você Verá

### Dashboard (`/home`)
- ✅ Vendas de hoje
- ✅ Ticket médio
- ✅ Alertas de estoque
- ✅ Vendas recentes (últimas 5)
- ✅ Top produtos do dia

### Relatórios (`/reports`)
- ✅ Resumo financeiro (receita, lucro, ticket médio)
- ✅ Vendas por forma de pagamento
- ✅ Vendas diárias
- ✅ Top 10 produtos
- ✅ Botão de exportar CSV

---

## 🐛 Problemas Comuns

### "Erro ao carregar estatísticas"
```bash
# Verificar se backend está rodando
curl http://localhost:3001/health

# Verificar token
# Abra DevTools > Application > Local Storage
# Procure por "auth-token" ou similar
```

### "Erro ao gerar relatório"
```bash
# Verificar formato das datas
# Deve ser: YYYY-MM-DD
# Exemplo: 2026-02-01

# Verificar se há vendas no período
# Criar venda de teste se necessário
```

### Exportação não funciona
```bash
# Verificar console do browser (F12)
# Procurar por erros de CORS ou Blob

# Verificar se backend retorna Content-Type correto
# Deve ser: text/csv
```

---

## 📁 Arquivos Importantes

### Frontend
```
app/(dashboard)/reports/page.tsx    # Página de relatórios
app/(dashboard)/home/page.tsx       # Dashboard
lib/api/reports.ts                  # Cliente API
lib/hooks/use-reports.ts            # Hook de relatórios
lib/hooks/use-dashboard-stats.ts    # Hook de dashboard
lib/types/reports.ts                # Tipos TypeScript
```

### Documentação
```
docs/REPORTS_API_CONTRACT.md        # Contrato da API
docs/SALES_CONTROL_GUIDE.md         # Guia de uso
docs/INTEGRATION_TEST_GUIDE.md      # Guia de testes
docs/IMPLEMENTATION_SUMMARY.md      # Resumo completo
```

---

## ✅ Checklist de Verificação

- [ ] Backend rodando em `localhost:3001`
- [ ] Frontend rodando em `localhost:3000`
- [ ] `.env` configurado corretamente
- [ ] Usuário autenticado
- [ ] Estabelecimento selecionado
- [ ] Há vendas no banco de dados
- [ ] Dashboard carrega sem erros
- [ ] Relatórios carregam sem erros
- [ ] Exportação CSV funciona

---

## 🎯 Próximos Passos

1. **Testar com dados reais**
   - Criar algumas vendas
   - Verificar se aparecem nos relatórios
   - Testar diferentes períodos

2. **Validar cálculos**
   - Conferir receita total
   - Verificar ticket médio
   - Validar lucro estimado

3. **Testar exportação**
   - Exportar CSV
   - Abrir no Excel
   - Verificar formatação

4. **Feedback do cliente**
   - Mostrar dashboard
   - Demonstrar relatórios
   - Coletar sugestões

---

## 📞 Ajuda

Se precisar de ajuda:
1. Verifique os logs do console (F12)
2. Consulte `docs/INTEGRATION_TEST_GUIDE.md`
3. Revise `docs/REPORTS_API_CONTRACT.md`

---

**Tudo pronto! Basta testar e usar! 🚀**
