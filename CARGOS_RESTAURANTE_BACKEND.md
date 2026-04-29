# Lista de Cargos para Restaurantes - Backend

## Cargos a Adicionar no Backend

Adicione estes cargos ao seu enum/tipo de `MemberRole` no backend:

### Cargos Novos (7 total)

```
kitchen_chef          - Chef de Cozinha
kitchen_cook          - Cozinheiro
kitchen_assistant     - Auxiliar de Cozinha
waiter                - Garçom
cashier               - Caixa
delivery_driver       - Motorista de Delivery
host                  - Recepcionista
```

### Cargos Existentes (Manter)

```
business_owner        - Proprietário
business_admin        - Administrador
business_sales        - Vendedor
business_stock        - Estoquista
business_marketing    - Marketing
```

---

## Permissões por Cargo

### Cozinha

**kitchen_chef (Chef de Cozinha)**
- Gerenciar cozinha
- Visualizar pedidos
- Atualizar status de pedidos
- Gerenciar cozinheiros
- Ver relatórios de cozinha

**kitchen_cook (Cozinheiro)**
- Visualizar pedidos
- Atualizar status de pedidos
- Ver cardápio

**kitchen_assistant (Auxiliar de Cozinha)**
- Visualizar pedidos
- Auxiliar na preparação

### Atendimento

**waiter (Garçom)**
- Registrar pedidos
- Ver mesas
- Atualizar status de pedidos
- Registrar vendas

**cashier (Caixa)**
- Registrar vendas
- Processar pagamentos
- Ver relatórios de caixa
- Emitir recibos

**host (Recepcionista)**
- Gerenciar reservas
- Receber clientes
- Ver disponibilidade de mesas

### Delivery

**delivery_driver (Motorista de Delivery)**
- Ver pedidos de delivery
- Atualizar status de entrega
- Ver rotas

---

## Estrutura Sugerida para Validação

```typescript
// Enum de cargos
enum MemberRole {
  // Administrativo
  BUSINESS_OWNER = 'business_owner',
  BUSINESS_ADMIN = 'business_admin',
  BUSINESS_SALES = 'business_sales',
  BUSINESS_STOCK = 'business_stock',
  BUSINESS_MARKETING = 'business_marketing',
  
  // Cozinha
  KITCHEN_CHEF = 'kitchen_chef',
  KITCHEN_COOK = 'kitchen_cook',
  KITCHEN_ASSISTANT = 'kitchen_assistant',
  
  // Atendimento
  WAITER = 'waiter',
  CASHIER = 'cashier',
  HOST = 'host',
  
  // Delivery
  DELIVERY_DRIVER = 'delivery_driver',
}
```

---

## Validação de Entrada

Ao receber um novo cargo, valide se está na lista acima:

```typescript
const VALID_ROLES = [
  'business_owner',
  'business_admin',
  'business_sales',
  'business_stock',
  'business_marketing',
  'kitchen_chef',
  'kitchen_cook',
  'kitchen_assistant',
  'waiter',
  'cashier',
  'delivery_driver',
  'host',
];

// Validar
if (!VALID_ROLES.includes(role)) {
  throw new Error('Cargo inválido');
}
```

---

## Próximos Passos

1. Adicione os 7 novos cargos ao seu enum/tipo no backend
2. Atualize a validação para aceitar estes cargos
3. Configure as permissões específicas para cada cargo
4. Teste a criação de funcionários com os novos cargos
5. Após confirmar que funciona, eu reaplicarei as mudanças no frontend
