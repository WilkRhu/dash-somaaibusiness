# Gerenciamento de Estado - SomaAI Business

Sistema de gerenciamento de estado usando Zustand para o SomaAI Business.

## 📦 Stores Disponíveis

### 1. Auth Store (`auth-store.ts`)
Gerencia autenticação e dados do usuário.

```typescript
import { useAuthStore } from '@/lib/stores';

const { user, token, isAuthenticated, login, logout } = useAuthStore();
```

**Estado:**
- `user`: Dados do usuário logado
- `token`: Token de autenticação
- `isAuthenticated`: Status de autenticação

**Ações:**
- `login(user, token)`: Fazer login
- `logout()`: Fazer logout

### 2. Establishment Store (`establishment-store.ts`)
Gerencia estabelecimentos do usuário.

```typescript
import { useEstablishmentStore } from '@/lib/stores';

const { currentEstablishment, establishments, setCurrentEstablishment } = useEstablishmentStore();
```

**Estado:**
- `currentEstablishment`: Estabelecimento ativo
- `establishments`: Lista de estabelecimentos

**Ações:**
- `setCurrentEstablishment(establishment)`: Selecionar estabelecimento
- `setEstablishments(establishments)`: Atualizar lista

### 3. Cart Store (`cart-store.ts`)
Gerencia carrinho de compras do PDV.

```typescript
import { useCartStore } from '@/lib/stores';

const { items, total, addItem, removeItem, clear } = useCartStore();
```

**Estado:**
- `items`: Itens no carrinho
- `total`: Total do carrinho

**Ações:**
- `addItem(item)`: Adicionar item
- `removeItem(id)`: Remover item
- `updateQuantity(id, quantity)`: Atualizar quantidade
- `clear()`: Limpar carrinho

### 4. Inventory Store (`inventory-store.ts`)
Gerencia produtos do estoque.

```typescript
import { useInventoryStore } from '@/lib/stores';

const { items, selectedItem, isLoading, error } = useInventoryStore();
```

**Estado:**
- `items`: Lista de produtos
- `selectedItem`: Produto selecionado
- `isLoading`: Status de carregamento
- `error`: Mensagem de erro

**Ações:**
- `setItems(items)`: Definir lista
- `addItem(item)`: Adicionar produto
- `updateItem(id, updates)`: Atualizar produto
- `removeItem(id)`: Remover produto
- `setSelectedItem(item)`: Selecionar produto

### 5. Sales Store (`sales-store.ts`)
Gerencia vendas e estatísticas.

```typescript
import { useSalesStore } from '@/lib/stores';

const { sales, todayTotal, todayCount } = useSalesStore();
```

**Estado:**
- `sales`: Lista de vendas
- `selectedSale`: Venda selecionada
- `todayTotal`: Total de vendas hoje
- `todayCount`: Quantidade de vendas hoje

**Ações:**
- `setSales(sales)`: Definir lista
- `addSale(sale)`: Adicionar venda
- `updateStats(total, count)`: Atualizar estatísticas

### 6. Offers Store (`offers-store.ts`)
Gerencia ofertas e promoções.

```typescript
import { useOffersStore } from '@/lib/stores';

const { offers, selectedOffer } = useOffersStore();
```

**Estado:**
- `offers`: Lista de ofertas
- `selectedOffer`: Oferta selecionada

**Ações:**
- `setOffers(offers)`: Definir lista
- `addOffer(offer)`: Adicionar oferta
- `updateOffer(id, updates)`: Atualizar oferta
- `removeOffer(id)`: Remover oferta

### 7. Customers Store (`customers-store.ts`)
Gerencia clientes.

```typescript
import { useCustomersStore } from '@/lib/stores';

const { customers, selectedCustomer } = useCustomersStore();
```

**Estado:**
- `customers`: Lista de clientes
- `selectedCustomer`: Cliente selecionado

**Ações:**
- `setCustomers(customers)`: Definir lista
- `addCustomer(customer)`: Adicionar cliente
- `updateCustomer(id, updates)`: Atualizar cliente
- `removeCustomer(id)`: Remover cliente

### 8. UI Store (`ui-store.ts`)
Gerencia estado da interface.

```typescript
import { useUIStore } from '@/lib/stores';

const { sidebarOpen, showToast } = useUIStore();
```

**Estado:**
- `sidebarOpen`: Sidebar aberta/fechada
- `mobileMenuOpen`: Menu mobile aberto/fechado
- `modalOpen`: Modal aberto/fechado
- `toast`: Estado do toast

**Ações:**
- `toggleSidebar()`: Alternar sidebar
- `openModal(content)`: Abrir modal
- `closeModal()`: Fechar modal
- `showToast(message, type)`: Mostrar notificação
- `hideToast()`: Esconder notificação

## 🎣 Custom Hooks

### useInventory
Hook para gerenciar estoque com carregamento automático.

```typescript
import { useInventory } from '@/lib/hooks/use-inventory';

function InventoryPage() {
  const { items, isLoading, error, refetch } = useInventory();
  
  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return <div>{items.map(item => ...)}</div>;
}
```

### useSales
Hook para gerenciar vendas com estatísticas.

```typescript
import { useSales } from '@/lib/hooks/use-sales';

function SalesPage() {
  const { sales, isLoading, error, refetch } = useSales();
  
  return <div>...</div>;
}
```

### useEstablishments
Hook para gerenciar estabelecimentos.

```typescript
import { useEstablishments } from '@/lib/hooks/use-establishments';

function App() {
  const { establishments, currentEstablishment, setCurrentEstablishment } = useEstablishments();
  
  return <div>...</div>;
}
```

## 🎨 Componentes UI

### Toast
Componente de notificação.

```typescript
import { Toast } from '@/components/ui/toast';
import { useUIStore } from '@/lib/stores';

function App() {
  const { showToast } = useUIStore();
  
  const handleSuccess = () => {
    showToast('Operação realizada com sucesso!', 'success');
  };
  
  return (
    <>
      <Toast />
      <button onClick={handleSuccess}>Salvar</button>
    </>
  );
}
```

## 📝 Exemplos de Uso

### Adicionar produto ao carrinho (PDV)
```typescript
import { useCartStore } from '@/lib/stores';

function ProductCard({ product }) {
  const { addItem } = useCartStore();
  
  const handleAdd = () => {
    addItem({
      id: crypto.randomUUID(),
      inventoryItemId: product.id,
      name: product.name,
      quantity: 1,
      unitPrice: product.salePrice,
      subtotal: product.salePrice,
    });
  };
  
  return <button onClick={handleAdd}>Adicionar</button>;
}
```

### Mostrar notificação de sucesso
```typescript
import { useUIStore } from '@/lib/stores';

function SaveButton() {
  const { showToast } = useUIStore();
  
  const handleSave = async () => {
    try {
      await saveData();
      showToast('Dados salvos com sucesso!', 'success');
    } catch (error) {
      showToast('Erro ao salvar dados', 'error');
    }
  };
  
  return <button onClick={handleSave}>Salvar</button>;
}
```

### Trocar estabelecimento
```typescript
import { useEstablishmentStore } from '@/lib/stores';

function EstablishmentSelector() {
  const { establishments, currentEstablishment, setCurrentEstablishment } = useEstablishmentStore();
  
  return (
    <select 
      value={currentEstablishment?.id}
      onChange={(e) => {
        const establishment = establishments.find(est => est.id === e.target.value);
        if (establishment) setCurrentEstablishment(establishment);
      }}
    >
      {establishments.map(est => (
        <option key={est.id} value={est.id}>{est.name}</option>
      ))}
    </select>
  );
}
```

## 🔄 Persistência

Alguns stores persistem dados no localStorage:
- `auth-store`: Token de autenticação
- `establishment-store`: ID do estabelecimento atual

## 🎯 Boas Práticas

1. **Use hooks customizados** para lógica complexa
2. **Separe concerns** - cada store tem responsabilidade única
3. **Mantenha stores pequenos** e focados
4. **Use TypeScript** para type safety
5. **Limpe estados** quando necessário (logout, troca de estabelecimento)
6. **Trate erros** adequadamente em cada store
7. **Use loading states** para melhor UX

## 📚 Recursos

- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Hooks](https://react.dev/reference/react)
