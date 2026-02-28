# Correção de Permissões - Estabelecimentos

## Problema Identificado
O sistema estava permitindo que usuários com role `business_admin` gerenciassem estabelecimentos, mas a regra de negócio correta é que apenas `business_owner` pode fazer isso.

## Alterações Realizadas no Frontend

### 1. Permissões (`lib/utils/permissions.ts`)
```typescript
// ANTES
MANAGE_ESTABLISHMENTS: [BusinessRole.OWNER, BusinessRole.ADMIN],

// DEPOIS
MANAGE_ESTABLISHMENTS: [BusinessRole.OWNER],
```

### 2. Documentação Atualizada

#### `docs/API_CONTRACT.md`
- **PATCH** `/business/establishments/:id` - Permissões: Apenas OWNER
- **POST** `/business/establishments/:id/logo` - Permissões: Apenas OWNER

#### `docs/LOGO_UPLOAD_GUIDE.md`
- Atualizado para indicar que apenas `business_owner` pode fazer upload

#### `docs/FRONTEND_GUIDE.md`
- Exemplo de código atualizado com `MANAGE_ESTABLISHMENT: [BusinessRole.OWNER]`

## Alterações Necessárias no Backend

O backend precisa ser atualizado para validar que apenas `business_owner` pode:

### Rotas que precisam ser ajustadas:
1. **PATCH** `/business/establishments/:id` - Atualizar estabelecimento
2. **POST** `/business/establishments/:id/logo` - Upload de logo
3. **DELETE** `/business/establishments/:id` - Deletar estabelecimento (já está correto)

### Validação Atual (Incorreta)
```
Você precisa ter um dos seguintes roles: business_owner, business_admin
```

### Validação Esperada (Correta)
```
Você precisa ter o seguinte role: business_owner
```

## Rotas que Devem Manter OWNER ou ADMIN

As seguintes operações devem continuar permitindo tanto `business_owner` quanto `business_admin`:

- **POST** `/business/establishments/:id/members` - Adicionar membro
- **DELETE** `/business/establishments/:id/members/:userId` - Remover membro
- **PATCH** `/business/establishments/:id/members/:userId/role` - Atualizar role do membro

## Impacto

Com essa mudança:
- ✅ Apenas proprietários podem editar dados do estabelecimento
- ✅ Apenas proprietários podem fazer upload do logo
- ✅ Apenas proprietários podem deletar o estabelecimento
- ✅ Proprietários e administradores podem gerenciar membros
- ✅ A interface já está validando corretamente (sidebar oculta menu para não-owners)

## Status

- ✅ Frontend: Corrigido
- ⏳ Backend: Aguardando correção nas rotas de atualização e upload de logo
