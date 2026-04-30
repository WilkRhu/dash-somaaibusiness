# Implementação de Cargos para Restaurantes - Funcionários

## Resumo das Mudanças

Foi adicionada uma lista completa de cargos relacionados a restaurantes, lanchonetes e estabelecimentos similares na seção de **Funcionários**.

## Novos Cargos Adicionados

### 1. **Cozinha**
- **Chef de Cozinha** (`kitchen_chef`)
  - Gerenciar cozinha
  - Visualizar pedidos
  - Atualizar status de pedidos
  - Gerenciar cozinheiros
  - Ver relatórios de cozinha

- **Cozinheiro** (`kitchen_cook`)
  - Visualizar pedidos
  - Atualizar status de pedidos
  - Ver cardápio

- **Auxiliar de Cozinha** (`kitchen_assistant`)
  - Visualizar pedidos
  - Auxiliar na preparação

### 2. **Atendimento**
- **Garçom** (`waiter`)
  - Registrar pedidos
  - Ver mesas
  - Atualizar status de pedidos
  - Registrar vendas

- **Caixa** (`cashier`)
  - Registrar vendas
  - Processar pagamentos
  - Ver relatórios de caixa
  - Emitir recibos

- **Recepcionista** (`host`)
  - Gerenciar reservas
  - Receber clientes
  - Ver disponibilidade de mesas

### 3. **Delivery**
- **Motorista de Delivery** (`delivery_driver`)
  - Ver pedidos de delivery
  - Atualizar status de entrega
  - Ver rotas

### 4. **Administrativo** (Mantidos)
- Administrador
- Vendedor
- Estoquista
- Marketing

## Arquivos Modificados

### 1. `lib/types/member.ts`
- Adicionados 7 novos tipos de `MemberRole`
- Atualizados `ROLE_LABELS` com os novos cargos
- Atualizados `ROLE_PERMISSIONS` com as permissões específicas de cada cargo

### 2. `components/members/add-member-form.tsx`
- Atualizado o dropdown de seleção de cargo
- Cargos agora organizados em grupos (optgroup):
  - Administrativo
  - Cozinha
  - Atendimento
  - Delivery

### 3. `components/members/members-table.tsx`
- Atualizado o dropdown de mudança de cargo na tabela
- Mesma organização em grupos para melhor UX

### 4. `components/members/edit-member-form.tsx`
- Atualizada a lista de cargos disponíveis
- Reorganizados os checkboxes em categorias
- Adicionado scroll para melhor visualização

## Como Usar

1. Acesse **Funcionários** no menu lateral
2. Clique em **Adicionar Funcionário**
3. Preencha os dados (Nome, Email, Telefone, Senha)
4. Selecione o cargo na lista organizada por categoria
5. Clique em **Criar Funcionário**

## Permissões por Cargo

Cada cargo possui um conjunto específico de permissões que controla o que o funcionário pode fazer no sistema:

- **Chef de Cozinha**: Acesso completo à gestão da cozinha
- **Cozinheiro**: Visualização e atualização de pedidos
- **Auxiliar de Cozinha**: Visualização de pedidos
- **Garçom**: Gestão de pedidos e mesas
- **Caixa**: Processamento de vendas e pagamentos
- **Recepcionista**: Gestão de reservas e clientes
- **Motorista de Delivery**: Gestão de entregas

## Próximos Passos (Opcional)

Para implementação completa, considere:

1. Atualizar o backend para validar os novos cargos
2. Implementar permissões específicas por cargo no sistema
3. Criar dashboards personalizados por cargo
4. Adicionar relatórios específicos por departamento (Cozinha, Atendimento, etc.)
5. Integrar com sistema de agendamento de turnos
