# Fix: Página de Perfil Vazia para Funcionários

## Problema
A página de perfil não estava exibindo nada para funcionários de cozinha, pois estava tentando carregar dados da API `/auth/me` que pode retornar erro 403.

## Solução Implementada

### 1. **app/(dashboard)/profile/page.tsx**
Atualizado para usar os dados do auth store em vez de fazer chamada de API:

```typescript
const loadProfile = async () => {
  try {
    // Se o usuário está logado, usar os dados do auth store
    if (user) {
      const profileData: UserProfile = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        avatar: user.avatar,
        createdAt: new Date().toISOString(),
        subscriptionPlan: (user.subscriptionPlan || 'FREE') as any,
      };
      setProfile(profileData);
      setFormData({
        name: profileData.name,
        phone: profileData.phone || '',
      });
    } else {
      // Se não tem user no store, tentar carregar da API
      const data = await profileApi.get();
      setProfile(data);
      setFormData({
        name: data.name,
        phone: data.phone || '',
      });
    }
  } catch (error) {
    // ... tratamento de erro
  }
};
```

### 2. **lib/stores/auth-store.ts**
Adicionado campo `phone` ao User interface:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;  // Novo campo
  role?: string;
  // ... outros campos
}
```

## Fluxo Corrigido

1. Funcionário faz login
2. Dados do user são armazenados no auth store (incluindo phone e avatar)
3. Funcionário acessa a página de perfil
4. Página carrega os dados do auth store em vez de fazer chamada de API
5. Perfil é exibido corretamente com nome, email, telefone e avatar

## Verificação

✅ Página de perfil exibe dados do funcionário
✅ Nome, email, telefone e avatar são exibidos
✅ Nenhuma chamada de API desnecessária é feita
✅ Sem erros 403
✅ Sem erros de compilação ou tipo

## Notas Importantes

- Os dados do user já estão disponíveis no auth store após o login
- A página de perfil agora usa esses dados em vez de fazer uma chamada de API
- Se por algum motivo o user não estiver no store, a página tenta carregar da API como fallback
- O campo `phone` foi adicionado ao User interface para suportar dados de telefone
