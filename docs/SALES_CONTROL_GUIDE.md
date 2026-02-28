# Guia de Controle de Vendas - SomaAI Business

## Visão Geral

Este documento descreve as funcionalidades implementadas para dar controle total do balanço de vendas aos clientes empresariais.

## ✅ Funcionalidades Implementadas

### 1. Sistema de Vendas (PDV)
- ✅ Criação de vendas com múltiplos itens
- ✅ Suporte a diferentes formas de pagamento (dinheiro, cartão, PIX, etc.)
- ✅ Aplicação de descontos (por item e total)
- ✅ Baixa automática no estoque
- ✅ Vinculação com clientes
- ✅ Cancelamento de vendas com reversão de estoque
- ✅ Numeração sequencial de vendas

### 2. Relatórios de Vendas
- ✅ Filtros por período (data inicial e final)
- ✅ Filtros por status (concluídas, canceladas)
- ✅ Resumo financeiro:
  - Receita total
  - Lucro estimado
  - Ticket médio
  - Total de vendas
- ✅ Análise por forma de pagamento
- ✅ Vendas diárias (evolução temporal)
- ✅ Top 10 produtos mais vendidos
- ✅ Exportação para CSV

### 3. Dashboard Executivo
- ✅ Métricas em tempo real
- ✅ Gráfico de vendas da semana
- ✅ Produtos mais vendidos
- ✅ Vendas recentes
- ✅ Alertas de estoque
- ✅ Ações rápidas

## 📊 Métricas Disponíveis

### Métricas Financeiras
1. **Receita Total**: Soma de todas as vendas concluídas
2. **Lucro Estimado**: Receita - Custo dos produtos (baseado em costPrice)
3. **Ticket Médio**: Receita total / Número de vendas
4. **Margem de Lucro**: (Lucro / Receita) × 100

### Métricas Operacionais
1. **Total de Vendas**: Quantidade de transações
2. **Vendas Canceladas**: Quantidade e valor
3. **Taxa de Cancelamento**: (Canceladas / Total) × 100
4. **Produtos Vendidos**: Quantidade total de itens

### Análises por Segmento
1. **Por Forma de Pagamento**: Distribuição de vendas e valores
2. **Por Período**: Evolução diária, semanal, mensal
3. **Por Produto**: Ranking de mais vendidos
4. **Por Vendedor**: Performance individual (quando implementado)

## 🔄 Fluxo de Dados

```
Venda Criada
    ↓
Validação de Estoque
    ↓
Baixa no Inventário
    ↓
Registro da Venda
    ↓
Atualização de Estatísticas
    ↓
Disponível em Relatórios
```

## 📈 Como Usar os Relatórios

### 1. Acessar Relatórios
- Navegue para `/reports` no menu lateral
- Ou clique em "Ver Relatórios" no dashboard

### 2. Filtrar Dados
```typescript
// Exemplo de filtros
{
  startDate: '2026-02-01',  // Data inicial
  endDate: '2026-02-28',    // Data final
  status: 'completed'       // Status das vendas
}
```

### 3. Exportar Dados
- Clique no botão "Exportar CSV"
- Arquivo será baixado com todos os dados do período
- Use em Excel, Google Sheets, etc.

## 🎯 Casos de Uso

### Análise Diária
```
1. Acesse o Dashboard
2. Visualize "Vendas Hoje"
3. Compare com dias anteriores
4. Identifique tendências
```

### Análise Mensal
```
1. Acesse Relatórios
2. Defina período: 1º dia do mês até hoje
3. Analise receita total e ticket médio
4. Compare com mês anterior
```

### Identificar Produtos Lucrativos
```
1. Acesse Relatórios
2. Visualize "Produtos Mais Vendidos"
3. Analise quantidade × receita
4. Ajuste estoque e preços
```

### Análise de Formas de Pagamento
```
1. Acesse Relatórios
2. Visualize "Vendas por Forma de Pagamento"
3. Identifique preferências dos clientes
4. Otimize taxas e promoções
```

## 🚀 Melhorias Futuras Recomendadas

### Curto Prazo (1-2 semanas)
1. **Gráficos Interativos**
   - Biblioteca: Chart.js ou Recharts
   - Gráficos de linha para evolução temporal
   - Gráficos de pizza para distribuição

2. **Comparação de Períodos**
   - Comparar mês atual vs anterior
   - Comparar semana atual vs anterior
   - Indicadores de crescimento (%)

3. **Filtros Avançados**
   - Por vendedor
   - Por cliente
   - Por categoria de produto
   - Por faixa de valor

### Médio Prazo (1 mês)
1. **Relatórios Agendados**
   - Envio automático por email
   - Frequência configurável (diário, semanal, mensal)
   - Formato PDF

2. **Metas e Objetivos**
   - Definir metas de vendas
   - Acompanhamento de progresso
   - Alertas de performance

3. **Análise de Tendências**
   - Previsão de vendas (ML básico)
   - Sazonalidade
   - Produtos em alta/baixa

### Longo Prazo (2-3 meses)
1. **Dashboard Customizável**
   - Widgets arrastáveis
   - Métricas personalizadas
   - Múltiplos dashboards

2. **Integração com Contabilidade**
   - Exportação para sistemas contábeis
   - Relatórios fiscais
   - DRE automatizado

3. **Business Intelligence**
   - Análise de cohort
   - RFM (Recência, Frequência, Valor Monetário)
   - Segmentação de clientes

## 📱 Exportação de Dados

### Formato CSV
```csv
Relatório de Vendas

Período:,2026-02-01,2026-02-28

Resumo
Receita Total,15000.00
Lucro Estimado,6000.00
Ticket Médio,75.00
Total de Vendas,200

Por Forma de Pagamento
Método,Quantidade,Total
cash,80,6000.00
pix,70,5250.00
credit_card,50,3750.00
```

### Formato JSON (API)
```json
{
  "period": {
    "startDate": "2026-02-01",
    "endDate": "2026-02-28"
  },
  "summary": {
    "totalRevenue": 15000.00,
    "totalProfit": 6000.00,
    "averageTicket": 75.00,
    "salesCount": 200
  }
}
```

## 🔐 Permissões

### Visualizar Relatórios
- OWNER: ✅ Acesso total
- ADMIN: ✅ Acesso total
- SALES: ✅ Apenas suas vendas
- STOCK: ❌ Sem acesso
- MARKETING: ✅ Acesso somente leitura

### Exportar Dados
- OWNER: ✅
- ADMIN: ✅
- SALES: ❌
- STOCK: ❌
- MARKETING: ❌

## 💡 Dicas de Uso

1. **Análise Regular**: Revise relatórios diariamente
2. **Compare Períodos**: Use filtros para comparar performance
3. **Identifique Padrões**: Observe dias/horários de pico
4. **Ajuste Estratégias**: Use dados para tomar decisões
5. **Monitore Cancelamentos**: Alta taxa pode indicar problemas

## 🆘 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação da API: `docs/SALES_API_CONTRACT.md`
2. Verifique o guia de integração: `docs/FRONTEND_GUIDE.md`
3. Entre em contato com o suporte técnico

## 📝 Notas Técnicas

### Performance
- Relatórios são gerados em tempo real
- Para grandes volumes (>10k vendas), considere cache
- Paginação implementada na API

### Precisão
- Lucro é estimado baseado em costPrice
- Para lucro real, considere custos operacionais
- Valores em centavos para evitar erros de arredondamento

### Auditoria
- Todas as vendas são registradas com timestamp
- Cancelamentos mantêm histórico completo
- Movimentações de estoque são rastreáveis
