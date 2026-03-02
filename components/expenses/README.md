# Sistema de Despesas e Balanço Financeiro

## Visão Geral

Sistema completo de gestão de despesas e balanço financeiro implementado conforme a especificação da API em `docs/EXPENSES_API.md`.

## Arquivos Criados

### API e Tipos
- `lib/api/expenses.ts` - Cliente da API com todos os endpoints
- `lib/types/expenses.ts` - Tipos TypeScript (incluídos no arquivo da API)

### Estado e Hooks
- `lib/stores/expenses-store.ts` - Store Zustand para gerenciamento de estado
- `lib/hooks/use-expenses.ts` - Hooks customizados para facilitar o uso

### Utilitários
- `lib/utils/expense-labels.ts` - Labels e cores para categorias, status e métodos de pagamento

### Componentes
- `components/expenses/create-expense-form.tsx` - Formulário de criação
- `components/expenses/edit-expense-form.tsx` - Formulário de edição
- `components/expenses/expenses-table.tsx` - Tabela de listagem
- `components/expenses/mark-as-paid-modal.tsx` - Modal para marcar como paga
- `components/expenses/financial-balance-card.tsx` - Card com balanço financeiro

### Páginas
- `app/(dashboard)/expenses/page.tsx` - Página principal de despesas

## Funcionalidades Implementadas

### ✅ Gestão de Despesas
- Criar despesa manual
- Listar despesas com filtros (data, categoria, status)
- Editar despesa
- Marcar despesa como paga
- Excluir despesa
- Suporte a despesas recorrentes

### ✅ Balanço Financeiro
- Resumo de receitas vs despesas
- Cálculo de lucro líquido e margem
- Despesas por categoria (com gráfico de barras)
- Receitas por forma de pagamento
- Despesas por status
- Fluxo de caixa diário (preparado para visualização)

### ✅ Filtros e Busca
- Filtro por período (data inicial e final)
- Filtro por categoria
- Filtro por status
- Filtro por fornecedor (preparado)

### ✅ Categorias Suportadas
- Compra de Mercadorias
- Aluguel
- Água, Luz e Gás
- Internet e Telefone
- Salários
- Impostos
- Manutenção
- Marketing
- Combustível
- Material de Limpeza
- Material de Escritório
- Despesas com Delivery
- Equipamentos
- Software e Sistemas
- Seguros
- Taxas Bancárias
- Outras Despesas

### ✅ Status de Despesas
- Pendente (amarelo)
- Pago (verde)
- Vencido (vermelho)
- Cancelado (cinza)

### ✅ Métodos de Pagamento
- Dinheiro
- Cartão de Débito
- Cartão de Crédito
- PIX
- Transferência Bancária
- Boleto
- Cheque
- Outro

## Como Usar

### Criar uma Despesa

```typescript
import { useExpensesStore } from '@/lib/stores/expenses-store';

const { createExpense } = useExpensesStore();

await createExpense(establishmentId, {
  description: 'Aluguel de Março',
  category: 'rent',
  amount: 2500.00,
  status: 'pending',
  expenseDate: '2026-03-01',
  dueDate: '2026-03-10',
  isRecurring: true,
  recurrenceInterval: 'monthly'
});
```

### Listar Despesas com Filtros

```typescript
import { useExpenses } from '@/lib/hooks/use-expenses';

const { expenses, isLoading } = useExpenses(establishmentId, {
  startDate: '2026-03-01',
  endDate: '2026-03-31',
  category: 'rent',
  status: 'pending'
});
```

### Obter Balanço Financeiro

```typescript
import { useFinancialBalance } from '@/lib/hooks/use-expenses';

const { financialBalance, isLoading } = useFinancialBalance(
  establishmentId,
  '2026-03-01',
  '2026-03-31'
);
```

### Marcar Despesa como Paga

```typescript
const { markAsPaid } = useExpensesStore();

await markAsPaid(establishmentId, expenseId, {
  paymentDate: '2026-03-08',
  paymentMethod: 'pix'
});
```

## Integração com Estoque

Para criar despesas automaticamente ao adicionar produtos no estoque, você pode:

1. Após adicionar estoque, criar uma despesa correspondente
2. Usar a categoria `inventory_purchase`
3. Vincular ao fornecedor se disponível

```typescript
// Após adicionar estoque
await createExpense(establishmentId, {
  description: `Compra de ${quantity} un de ${productName}`,
  category: 'inventory_purchase',
  amount: costPrice * quantity,
  status: 'paid',
  expenseDate: new Date().toISOString().split('T')[0],
  supplierId: supplierId
});
```

## Permissões

O sistema usa `PERMISSIONS.VIEW_REPORTS` para controlar o acesso à página de despesas.

## Próximos Passos

### Melhorias Sugeridas
1. Gráfico de fluxo de caixa diário (linha do tempo)
2. Exportação de relatórios (PDF/Excel)
3. Notificações de despesas vencidas
4. Dashboard com métricas principais
5. Comparação entre períodos
6. Previsão de despesas recorrentes
7. Anexos de comprovantes
8. Integração automática com estoque

### Integrações Futuras
- Criar despesa automaticamente ao adicionar estoque
- Vincular despesas a ordens de compra
- Sincronização com sistema contábil
- Importação de extratos bancários

## Testes

Para testar o sistema:

1. Acesse `/expenses` no dashboard
2. Crie algumas despesas de diferentes categorias
3. Marque algumas como pagas
4. Visualize o balanço financeiro
5. Teste os filtros por data, categoria e status

## Notas Técnicas

- Todas as datas são armazenadas no formato ISO (YYYY-MM-DD)
- Valores monetários são tratados como números com 2 casas decimais
- O sistema usa soft delete (despesas excluídas são mantidas no banco)
- Despesas recorrentes precisam ser gerenciadas pelo backend
- O balanço financeiro calcula automaticamente receitas das vendas
