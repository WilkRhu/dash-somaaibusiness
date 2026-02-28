# Members API - Gerenciamento de Funcionários

## Visão Geral

O sistema de membros permite gerenciar funcionários/colaboradores de um estabelecimento. Cada membro tem um papel (role) que define suas permissões.

## ⭐ NOVO: Criar Funcionário Diretamente

Agora você pode criar funcionários diretamente sem precisar que eles tenham uma conta prévia!

### Endpoint para Criar Funcionário

```
POST /business/establishments/:id/employees
```

**Autenticação:** JWT + Owner/Admin

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "11999999999",
  "role": "business_sales",
  "password": "senha123" // Opcional - se não fornecido, gera senha temporária
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "name": "João Silva",
      "email": "joao@example.com"
    },
    "member": {
      "id": "member-uuid",
      "role": "business_sales",
      "isActive": true
    }
  },
  "message": "Funcionário criado e adicionado com sucesso"
}
```

**Como funciona:**
1. Se o email já existir no sistema, apenas adiciona como membro
2. Se não existir, cria o usuário e adiciona como membro
3. Se não fornecer senha, gera uma senha temporária de 8 caracteres
4. O funcionário pode fazer login com o email e senha

## Roles Disponíveis

- `business_owner`: Dono do estabelecimento (criador)
- `business_admin`: Administrador (pode gerenciar membros e configurações)
- `business_sales`: Vendedor (pode registrar vendas)
- `business_stock`: Estoquista (pode gerenciar inventário)
- `business_marketing`: Marketing (acesso apenas leitura a relatórios)

## Endpoints

### 1. Listar Membros

```
GET /business/establishments/:id/members
```

**Autenticação:** JWT + Membro do estabelecimento

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "member-uuid",
      "userId": "user-uuid",
      "role": "business_sales",
      "isActive": true,
      "createdAt": "2026-02-28T10:00:00.000Z",
      "user": {
        "id": "user-uuid",
        "name": "João Silva",
        "email": "joao@example.com"
      }
    }
  ]
}
```

### 2. Adicionar Membro

```
POST /business/establishments/:id/members
```

**Autenticação:** JWT + Owner/Admin

**Body:**
```json
{
  "userId": "user-uuid",
  "role": "business_sales"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "member-uuid",
    "userId": "user-uuid",
    "role": "business_sales",
    "isActive": true
  },
  "message": "Membro adicionado com sucesso"
}
```

### 3. Remover Membro

```
DELETE /business/establishments/:id/members/:userId
```

**Autenticação:** JWT + Owner/Admin

**Response:**
```json
{
  "success": true,
  "message": "Membro removido com sucesso"
}
```

### 4. Atualizar Role do Membro

```
PATCH /business/establishments/:id/members/:userId/role
```

**Autenticação:** JWT + Owner/Admin

**Body:**
```json
{
  "role": "business_admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "member-uuid",
    "userId": "user-uuid",
    "role": "business_admin",
    "isActive": true
  },
  "message": "Role atualizado com sucesso"
}
```

## Permissões por Role

### business_owner
- ✅ Todas as permissões
- ✅ Gerenciar membros
- ✅ Deletar estabelecimento
- ✅ Atualizar configurações
- ✅ Ver relatórios completos
- ✅ Registrar vendas
- ✅ Gerenciar estoque

### business_admin
- ✅ Gerenciar membros
- ✅ Atualizar configurações
- ✅ Ver relatórios completos
- ✅ Registrar vendas
- ✅ Gerenciar estoque
- ❌ Deletar estabelecimento

### business_sales
- ✅ Registrar vendas
- ✅ Ver suas próprias vendas
- ❌ Ver relatórios completos
- ❌ Gerenciar estoque
- ❌ Gerenciar membros

### business_stock
- ✅ Gerenciar estoque
- ✅ Ver produtos
- ❌ Registrar vendas
- ❌ Ver relatórios
- ❌ Gerenciar membros

### business_marketing
- ✅ Ver relatórios (somente leitura)
- ❌ Registrar vendas
- ❌ Gerenciar estoque
- ❌ Gerenciar membros

## Fluxo de Uso

### 1. Criar Funcionário (RECOMENDADO)

```typescript
// Criar funcionário diretamente
const response = await axios.post(
  `/business/establishments/${establishmentId}/employees`,
  {
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '11999999999',
    role: 'business_sales',
    password: 'senha123' // Opcional
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

// Se não fornecer senha, o sistema gera uma temporária
// Você pode mostrar a senha gerada para o funcionário
```

### 2. Adicionar Usuário Existente (Alternativa)

```typescript
// Se o usuário já tem conta no sistema
const response = await axios.post(
  `/business/establishments/${establishmentId}/members`,
  {
    userId: 'user-uuid-existente',
    role: 'business_sales'
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
```

### 3. Listar Funcionários

```typescript
const response = await axios.get(
  `/business/establishments/${establishmentId}/members`,
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

// Usar para popular dropdown de vendedores
const sellers = response.data.data
  .filter(m => m.role === 'business_sales')
  .map(m => ({
    id: m.userId,
    name: m.user.name
  }));
```

### 3. Registrar Venda com Vendedor

```typescript
// Ao registrar venda, o sellerId vem do token JWT automaticamente
// Mas você pode mostrar o nome do vendedor no frontend

const sale = await axios.post(
  `/business/establishments/${establishmentId}/sales`,
  {
    items: [...],
    paymentMethod: 'pix'
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

// O backend automaticamente pega o userId do token JWT
// e usa como sellerId
```

## Frontend Example

### Componente de Gerenciamento de Funcionários

```tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Member {
  id: string;
  userId: string;
  role: string;
  isActive: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

function MembersManagement({ establishmentId }: { establishmentId: string }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/business/establishments/${establishmentId}/members`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMembers(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar membros:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (userId: string, role: string) => {
    try {
      await axios.post(
        `/business/establishments/${establishmentId}/members`,
        { userId, role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      loadMembers();
      alert('Membro adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      alert('Erro ao adicionar membro');
    }
  };

  const removeMember = async (userId: string) => {
    if (!confirm('Tem certeza que deseja remover este membro?')) return;

    try {
      await axios.delete(
        `/business/establishments/${establishmentId}/members/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      loadMembers();
      alert('Membro removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      alert('Erro ao remover membro');
    }
  };

  const updateRole = async (userId: string, newRole: string) => {
    try {
      await axios.patch(
        `/business/establishments/${establishmentId}/members/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      loadMembers();
      alert('Cargo atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar cargo:', error);
      alert('Erro ao atualizar cargo');
    }
  };

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      business_owner: 'Proprietário',
      business_admin: 'Administrador',
      business_sales: 'Vendedor',
      business_stock: 'Estoquista',
      business_marketing: 'Marketing',
    };
    return roles[role] || role;
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="members-management">
      <h2>Funcionários</h2>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Cargo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.user.name}</td>
              <td>{member.user.email}</td>
              <td>
                <select
                  value={member.role}
                  onChange={(e) => updateRole(member.userId, e.target.value)}
                  disabled={member.role === 'business_owner'}
                >
                  <option value="business_admin">Administrador</option>
                  <option value="business_sales">Vendedor</option>
                  <option value="business_stock">Estoquista</option>
                  <option value="business_marketing">Marketing</option>
                </select>
              </td>
              <td>{member.isActive ? 'Ativo' : 'Inativo'}</td>
              <td>
                {member.role !== 'business_owner' && (
                  <button onClick={() => removeMember(member.userId)}>
                    Remover
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Notas Importantes

1. **Criar funcionário diretamente**: Use o endpoint `/employees` para criar funcionários sem precisar que eles tenham conta prévia

2. **Senha temporária**: Se não fornecer senha, o sistema gera uma senha temporária de 8 caracteres

3. **Email único**: Cada email só pode ser usado uma vez no sistema

4. **Owner não pode ser removido**: O dono do estabelecimento não pode ser removido ou ter seu cargo alterado

5. **Vendas automáticas**: Quando um membro registra uma venda, o `sellerId` é automaticamente preenchido com seu `userId`

6. **Relatórios**: Os relatórios mostram o nome do vendedor de cada venda através da relação `sale.seller`

7. **Permissões**: As permissões são verificadas através dos guards `BusinessRoleGuard` e decorador `@BusinessRoles()`

## Integração com Vendas

Quando você lista vendas nos relatórios, o vendedor já vem preenchido:

```json
{
  "id": "sale-uuid",
  "saleNumber": "20260228-0045",
  "total": 150.00,
  "seller": {
    "id": "user-uuid",
    "name": "João Silva"
  }
}
```

Isso funciona porque:
1. Ao criar uma venda, o `sellerId` é preenchido com o `userId` do token JWT
2. A entidade `Sale` tem uma relação `@ManyToOne` com `User`
3. Os relatórios carregam essa relação automaticamente

## Próximos Passos

Se você quiser melhorar o sistema de membros:

1. **Convites por email**: Enviar convite para usuários que ainda não têm conta
2. **Histórico de atividades**: Registrar ações dos membros
3. **Comissões**: Calcular comissões por vendedor
4. **Metas**: Definir metas de vendas por vendedor
5. **Horários**: Controlar horários de trabalho dos funcionários
