# 🚀 Guia de Início Rápido - Sistema de Pedidos Internos

## 5 Minutos para Começar

### 1️⃣ Acessar a Tela da Cozinha

Abra no navegador:
```
http://localhost:3000/kitchen/display
```

Você verá 4 colunas:
- 🆕 **Novo** (Vermelho) - Pedidos recém-chegados
- ✓ **Confirmado** (Amarelo) - Pedidos confirmados
- 👨‍🍳 **Preparando** (Azul) - Pedidos em preparo
- ✅ **Pronto** (Verde) - Pedidos prontos

### 2️⃣ Acessar a Tela de Senhas

Abra em outra aba:
```
http://localhost:3000/kitchen/tickets
```

Você verá um grid com as senhas dos pedidos.

### 3️⃣ Criar um Pedido (Teste)

Para testar, você precisa integrar com o PDV. Veja a seção "Integração com PDV" abaixo.

## 🔌 Integração com PDV (15 minutos)

### Passo 1: Importar o Hook

No arquivo `app/(dashboard)/sales/pos/page.tsx`, adicione:

```typescript
import { useKitchenOrders } from '@/lib/hooks/use-kitchen-orders';
```

### Passo 2: Usar o Hook

Dentro do componente:

```typescript
const { createOrder } = useKitchenOrders();
```

### Passo 3: Criar Pedido ao Finalizar Venda

Na função `handleCheckout`, após criar a venda, adicione:

```typescript
// Criar pedido interno
await createOrder({
  orderType: 'counter',  // ou 'dine_in' ou 'delivery'
  items: items.map(item => ({
    productName: item.name,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    notes: item.notes,
    preparationTime: 15,  // minutos
  })),
  discount: discount,
  notes: 'Observações gerais',
  priority: 'normal',  // ou 'low' ou 'high'
});
```

### Passo 4: Testar

1. Abra o PDV: `http://localhost:3000/sales/pos`
2. Adicione alguns produtos
3. Finalize a venda
4. Vá para a tela KDS: `http://localhost:3000/kitchen/display`
5. Você deve ver o pedido na coluna "Novo"

## 🎮 Como Usar a Tela KDS

### Atualizar Status

1. Clique no card do pedido
2. Selecione o novo status
3. Clique em "Atualizar Status"

### Fluxo Típico

```
1. Pedido chega (PENDING)
   ↓
2. Cozinha clica e confirma (CONFIRMED)
   ↓
3. Cozinha começa a preparar (PREPARING)
   ↓
4. Cozinha marca pronto (READY)
   ↓
5. Cliente retira (PICKED_UP)
```

### Controles

- 🔊 **Som**: Ativa/desativa som de alerta
- ⏸️ **Auto**: Ativa/desativa auto-refresh
- 🔄 **Atualizar**: Recarrega manualmente

## 📱 Como Usar a Tela de Senhas

### Para o Cliente

1. Abra: `http://localhost:3000/kitchen/tickets`
2. Veja as senhas em grid
3. Clique em uma senha para ver detalhes
4. Acompanhe o status em tempo real

### Cores

- 🔴 **Vermelho**: Novo
- 🟡 **Amarelo**: Confirmado
- 🔵 **Azul**: Preparando
- 🟢 **Verde**: Pronto

## 💡 Exemplos Práticos

### Exemplo 1: Lanchonete com Balcão

```
1. Atendente faz pedido no PDV
2. Seleciona "🏪 Balcão"
3. Adiciona: 2x Hambúrguer, 1x Refrigerante
4. Finaliza venda
5. Pedido #042 aparece na cozinha
6. Cozinha confirma e começa a preparar
7. Cliente vê "Senha 042 - Preparando" na tela
8. Quando pronto, cliente retira no balcão
```

### Exemplo 2: Restaurante com Mesas

```
1. Garçom faz pedido no PDV
2. Seleciona "🍽️ Mesa"
3. Seleciona "Mesa 5"
4. Adiciona: 2x Prato Principal, 1x Sobremesa
5. Finaliza venda
6. Pedido "Mesa 5" aparece na cozinha
7. Cozinha confirma e começa a preparar
8. Garçom vê "Mesa 5 - Pronto" na tela
9. Garçom retira na cozinha e leva para a mesa
```

## 🔊 Som de Alerta

O som toca automaticamente quando:
- Novo pedido chega
- Pedido fica pronto

Para desabilitar, clique em "🔇 Mudo" na tela KDS.

## ⏱️ Tempo de Preparo

- **Padrão**: 15 minutos
- **Customizável**: Por item ou por pedido
- **Indicador**: Vermelho se passou do tempo

## 🎯 Tipos de Pedido

| Tipo | Emoji | Uso |
|------|-------|-----|
| Balcão | 🏪 | Retirada no local |
| Mesa | 🍽️ | Comer no local |
| Entrega | 🚚 | Entrega em domicílio |

## 🔧 Troubleshooting

### Pedido não aparece

1. Verificar se o backend está rodando
2. Verificar console do navegador (F12)
3. Verificar se o estabelecimento está selecionado

### Som não toca

1. Verificar se som está habilitado no navegador
2. Clicar na página primeiro (alguns navegadores exigem interação)
3. Verificar volume do computador

### Tela não atualiza

1. Verificar conexão de internet
2. Clicar em "🔄 Atualizar" manualmente
3. Recarregar a página (F5)

## 📚 Documentação Completa

Para mais detalhes, consulte:
- `docs/KITCHEN_ORDERS_README.md` - Guia completo
- `docs/KITCHEN_ORDERS_INTEGRATION.md` - Documentação técnica
- `docs/KITCHEN_ORDERS_PDV_INTEGRATION_EXAMPLE.md` - Exemplo de integração

## ✅ Checklist

- [ ] Acessei a tela KDS
- [ ] Acessei a tela de senhas
- [ ] Integrei com o PDV
- [ ] Criei um pedido de teste
- [ ] Atualizei o status
- [ ] Testei o som
- [ ] Testei a responsividade

## 🚀 Próximos Passos

1. **Integração Completa**: Seguir `docs/KITCHEN_ORDERS_PDV_INTEGRATION_EXAMPLE.md`
2. **Testes**: Criar vários pedidos e testar fluxo
3. **Treinamento**: Treinar equipe
4. **Deploy**: Colocar em produção

## 💬 Dúvidas?

Consulte a documentação ou abra uma issue no GitHub.

---

**Pronto para começar?** 🎉

1. Abra: `http://localhost:3000/kitchen/display`
2. Abra: `http://localhost:3000/kitchen/tickets`
3. Siga os passos de integração com PDV
4. Teste!
