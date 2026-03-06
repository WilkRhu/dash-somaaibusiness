# Teste das Novas Funcionalidades - Relatórios

## 🚀 Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Rodar o frontend
npm run dev

# 3. Acessar
http://localhost:3000/reports
```

---

## ✅ Checklist de Testes

### 1. Gráficos Visuais

#### Gráfico de Evolução (Linha)
- [ ] Gráfico carrega sem erros
- [ ] Linha azul (receita) aparece
- [ ] Linha verde (vendas) aparece
- [ ] Hover mostra tooltip com valores
- [ ] Valores estão formatados (R$)
- [ ] Datas aparecem no eixo X
- [ ] Responsivo em mobile

**Como testar:**
1. Acesse `/reports`
2. Role até "Evolução de Vendas"
3. Passe o mouse sobre os pontos
4. Redimensione a janela

#### Gráfico de Pizza (Distribuição)
- [ ] Gráfico carrega sem erros
- [ ] Cores diferentes para cada método
- [ ] Labels mostram percentuais
- [ ] Hover mostra tooltip
- [ ] Legenda aparece embaixo
- [ ] Valores formatados (R$)

**Como testar:**
1. Acesse `/reports`
2. Veja "Distribuição por Forma de Pagamento"
3. Passe o mouse sobre as fatias
4. Verifique legenda

---

### 2. Filtros Avançados

#### Períodos Rápidos
- [ ] Botão "Hoje" funciona
- [ ] Botão "Últimos 7 dias" funciona
- [ ] Botão "Últimos 30 dias" funciona
- [ ] Botão "Este mês" funciona
- [ ] Datas são preenchidas automaticamente

**Como testar:**
```
1. Clique em "Hoje"
   → Verifica: startDate = endDate = hoje

2. Clique em "Últimos 7 dias"
   → Verifica: startDate = hoje - 7 dias

3. Clique em "Este mês"
   → Verifica: startDate = 1º dia do mês
```

#### Filtros Customizados
- [ ] Seleção de data inicial funciona
- [ ] Seleção de data final funciona
- [ ] Filtro de status funciona
- [ ] Filtro de pagamento funciona
- [ ] Relatório atualiza ao mudar filtros

**Como testar:**
```
1. Selecione data inicial: 01/02/2026
2. Selecione data final: 28/02/2026
3. Escolha status: "Concluídas"
4. Escolha pagamento: "PIX"
5. Verifique se dados filtram
```

---

### 3. Comparação de Períodos

#### Botão Comparar
- [ ] Botão "Comparar Períodos" aparece
- [ ] Clique carrega período anterior
- [ ] Loading aparece durante carregamento
- [ ] Cards mudam para modo comparação
- [ ] Percentuais são calculados corretamente

**Como testar:**
```
1. Defina período: 01/02 a 28/02
2. Clique em "Comparar Períodos"
3. Aguarde carregar
4. Verifique cards de comparação
```

#### Cards de Comparação
- [ ] Receita Total mostra comparação
- [ ] Lucro Estimado mostra comparação
- [ ] Ticket Médio mostra comparação
- [ ] Total de Vendas mostra comparação
- [ ] Setas verde/vermelha corretas
- [ ] Percentuais corretos
- [ ] Valor anterior aparece

**Como testar:**
```
Verifique cada card:
- Valor atual (grande)
- Seta (verde ↑ ou vermelha ↓)
- Percentual de mudança
- Valor do período anterior
```

---

### 4. Tabela de Detalhes

#### Lista de Vendas
- [ ] Tabela carrega com vendas
- [ ] Colunas aparecem corretamente
- [ ] Dados estão formatados
- [ ] Status tem cores corretas
- [ ] Paginação aparece (se > 20 vendas)

**Como testar:**
```
1. Role até "Detalhes das Vendas"
2. Verifique colunas:
   - Número
   - Data/Hora
   - Cliente
   - Pagamento
   - Status
   - Desconto
   - Total
   - Ações
```

#### Paginação
- [ ] Botão "Anterior" funciona
- [ ] Botão "Próxima" funciona
- [ ] Botões desabilitam corretamente
- [ ] Contador de página correto
- [ ] Dados mudam ao trocar página

**Como testar:**
```
Se houver mais de 20 vendas:
1. Clique em "Próxima"
2. Verifique novos dados
3. Clique em "Anterior"
4. Volte para página 1
```

#### Modal de Detalhes
- [ ] Botão "Ver detalhes" abre modal
- [ ] Modal mostra informações completas
- [ ] Itens da venda aparecem
- [ ] Totais calculados corretamente
- [ ] Botão X fecha modal
- [ ] Clicar fora fecha modal

**Como testar:**
```
1. Clique em "Ver detalhes" em qualquer venda
2. Verifique:
   - Número da venda
   - Data/hora
   - Cliente
   - Forma de pagamento
   - Status
   - Vendedor
   - Lista de itens
   - Subtotais
   - Descontos
   - Total
   - Observações (se houver)
   - Motivo cancelamento (se houver)
3. Clique no X para fechar
```

---

### 5. Métricas Adicionais

#### Cards de Métricas
- [ ] Taxa de Cancelamento calcula corretamente
- [ ] Margem de Lucro calcula corretamente
- [ ] Produtos Diferentes conta corretamente
- [ ] Ícones aparecem
- [ ] Valores formatados

**Como testar:**
```
Verifique cada card:

1. Taxa de Cancelamento
   = (canceladas / total) × 100

2. Margem de Lucro
   = (lucro / receita) × 100

3. Produtos Diferentes
   = quantidade de produtos únicos
```

---

## 🐛 Testes de Erro

### Sem Dados
```
1. Filtre por período sem vendas
2. Verifique:
   - Gráficos vazios ou mensagem
   - Tabela vazia ou mensagem
   - Sem erros no console
```

### Erro de API
```
1. Desligue o backend
2. Tente carregar relatório
3. Verifique:
   - Mensagem de erro aparece
   - Não quebra a página
   - Pode tentar novamente
```

### Filtros Inválidos
```
1. Data final antes da inicial
2. Verifique:
   - Validação ou mensagem
   - Não quebra
```

---

## 📱 Testes Responsivos

### Mobile (< 768px)
- [ ] Gráficos se ajustam
- [ ] Filtros empilham verticalmente
- [ ] Tabela tem scroll horizontal
- [ ] Modal ocupa tela toda
- [ ] Botões acessíveis

### Tablet (768px - 1024px)
- [ ] Layout 2 colunas funciona
- [ ] Gráficos lado a lado
- [ ] Filtros em grid
- [ ] Tabela legível

### Desktop (> 1024px)
- [ ] Layout completo
- [ ] Todos os elementos visíveis
- [ ] Espaçamento adequado

---

## 🎯 Testes de Integração

### Fluxo Completo
```
1. Login no sistema
2. Selecione estabelecimento
3. Acesse /reports
4. Use filtro "Últimos 30 dias"
5. Clique "Comparar Períodos"
6. Veja gráficos
7. Role até tabela
8. Abra detalhes de uma venda
9. Feche modal
10. Mude para página 2
11. Exporte CSV
12. Verifique arquivo baixado
```

---

## 📊 Validação de Dados

### Cálculos
```typescript
// Receita Total
= Soma de todas as vendas concluídas

// Lucro Estimado
= Receita - Custo dos produtos

// Ticket Médio
= Receita Total / Número de Vendas

// Taxa de Cancelamento
= (Canceladas / Total) × 100

// Margem de Lucro
= (Lucro / Receita) × 100
```

### Comparação
```typescript
// Crescimento Percentual
= ((Atual - Anterior) / Anterior) × 100

// Período Anterior
Se período = 30 dias
Então anterior = 30 dias antes do início
```

---

## 🔍 Inspeção Visual

### Cores
- [ ] Azul (#0066CC) para receita
- [ ] Verde (#00CC66) para vendas/lucro
- [ ] Vermelho para canceladas
- [ ] Amarelo para pendentes
- [ ] Cinza para neutro

### Tipografia
- [ ] Títulos em brand-navy
- [ ] Valores grandes e bold
- [ ] Descrições em cinza
- [ ] Legível em todos os tamanhos

### Espaçamento
- [ ] Cards bem espaçados
- [ ] Padding consistente
- [ ] Margens adequadas
- [ ] Não muito apertado

---

## ✅ Resultado Esperado

Após todos os testes, você deve ter:

✅ Gráficos funcionando perfeitamente
✅ Filtros respondendo corretamente
✅ Comparação calculando certo
✅ Tabela paginando bem
✅ Modal abrindo e fechando
✅ Métricas calculadas corretamente
✅ Responsivo em todos os tamanhos
✅ Sem erros no console
✅ Performance adequada

---

## 🆘 Problemas Comuns

### Gráficos não aparecem
```bash
# Verificar se recharts está instalado
npm list recharts

# Reinstalar se necessário
npm install recharts
```

### Dados não carregam
```bash
# Verificar backend
curl http://localhost:3001/health

# Verificar token
# DevTools > Application > Local Storage
```

### Erro de CORS
```typescript
// Backend deve ter CORS habilitado
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

---

## 📝 Relatório de Bugs

Se encontrar bugs, documente:

```markdown
### Bug: [Título]

**Descrição:**
O que aconteceu

**Passos para Reproduzir:**
1. Passo 1
2. Passo 2
3. Passo 3

**Resultado Esperado:**
O que deveria acontecer

**Resultado Atual:**
O que realmente aconteceu

**Screenshots:**
[Anexar se possível]

**Console:**
[Erros do console]

**Ambiente:**
- Browser: Chrome 120
- OS: Windows 11
- Resolução: 1920x1080
```

---

**Bons testes! 🚀**
