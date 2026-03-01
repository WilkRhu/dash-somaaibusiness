# Configuração de Desenvolvimento - Módulo de Clientes

## ✅ Problema Resolvido

A mensagem "Selecione um estabelecimento para gerenciar clientes" foi resolvida!

## 🔧 Como Funciona

O sistema agora usa o **establishment-store** que é inicializado automaticamente pelo hook `useEstablishmentInit()` no layout do dashboard.

### Fluxo Automático

1. **Layout do Dashboard** (`app/(dashboard)/layout.tsx`) chama `useEstablishmentInit()`
2. O hook busca os estabelecimentos do usuário
3. Seleciona automaticamente:
   - O último estabelecimento usado (salvo no localStorage)
   - OU o primeiro estabelecimento disponível
4. Todas as páginas usam `currentEstablishment` do store

### Código da Página de Clientes

```typescript
const { currentEstablishment } = useEstablishmentStore();

useEffect(() => {
  if (currentEstablishment?.id) {
    fetchCustomers(currentEstablishment.id);
  }
}, [currentEstablishment?.id, fetchCustomers]);
```

## 🚀 Para Desenvolvimento

### Opção 1: Usar API Mock (Recomendado)

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_MOCK_MODE=true
```

### Opção 2: Configurar Estabelecimento Manualmente

No console do navegador:

```javascript
// Definir estabelecimento mock
localStorage.setItem('currentEstablishmentId', 'dev-establishment-123');

// Recarregar a página
window.location.reload();
```

### Opção 3: Criar Estabelecimento via API

```bash
# 1. Fazer login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","password":"senha"}'

# 2. Criar estabelecimento
curl -X POST http://localhost:3000/api/business/establishments \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Minha Loja",
    "cnpj": "12345678000190",
    "phone": "11999999999"
  }'
```

## 📁 Arquivos Importantes

- `lib/stores/establishment-store.ts` - Store de estabelecimentos
- `lib/hooks/use-establishment-init.ts` - Hook de inicialização
- `app/(dashboard)/layout.tsx` - Layout que inicializa o estabelecimento
- `components/dashboard/header.tsx` - Exibe estabelecimento atual

## 🔍 Verificar Estabelecimento Atual

No console do navegador:

```javascript
// Ver estabelecimento atual
console.log(localStorage.getItem('currentEstablishmentId'));

// Ver todos os dados do store
console.log(useEstablishmentStore.getState());
```

## 🐛 Troubleshooting

### Problema: Ainda aparece a mensagem de seleção

**Solução:**
1. Verifique se o backend está rodando
2. Verifique se você está autenticado (tem token válido)
3. Verifique se você tem estabelecimentos cadastrados
4. Limpe o localStorage e faça login novamente

```javascript
localStorage.clear();
window.location.href = '/login';
```

### Problema: Erro 401 nas requisições

**Solução:**
1. Faça login novamente
2. Verifique se o token está sendo enviado:

```javascript
console.log(localStorage.getItem('token'));
```

## 📚 Próximos Passos

- [ ] Adicionar seletor de estabelecimento no header (para usuários com múltiplos estabelecimentos)
- [ ] Implementar cache de estabelecimentos
- [ ] Adicionar loading state durante inicialização
- [ ] Criar página de onboarding para primeiro estabelecimento
