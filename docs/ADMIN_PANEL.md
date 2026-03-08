# Painel de Administração - Documentação

## 📋 Visão Geral

O painel de administração permite gerenciar usuários do sistema com funcionalidades completas de CRUD (Create, Read, Update, Delete).

---

## 👥 Gerenciamento de Usuários

### Página: `/app/admin/users/page.tsx`

#### Funcionalidades:
- **Listagem de Usuários** - Tabela com todos os usuários do sistema
- **Criação de Usuários** - Modal para adicionar novos usuários
- **Edição de Usuários** - Modal para editar dados existentes
- **Exclusão de Usuários** - Remoção de usuários do sistema
- **Filtros** - Busca por nome/email, filtro por função e status
- **Ações em Lote** - Ativar, suspender ou excluir múltiplos usuários

---

## 🎨 Interface do Usuário

### Tabela de Usuários

| Coluna | Descrição |
|--------|-----------|
| Checkbox | Seleção para ações em lote |
| Usuário | Nome, email e avatar |
| Função | Tipo de usuário (Usuário, Administrador, Suporte) |
| Plano | Tipo de assinatura (Gratuito, Básico, Premium, etc.) |
| Status | Situação (Ativo, Inativo, Suspenso) |
| Último Login | Data do último acesso |
| Ações | Botões de editar e excluir |

### Tipos de Função (Role)

| Role | Descrição | Cor |
|------|-----------|-----|
| `user` | Usuário padrão | Verde |
| `admin` | Administrador do sistema | Vermelho |
| `support` | Equipe de suporte | Laranja |

### Tipos de Plano (PlanType)

| PlanType | Descrição | Cor |
|----------|-----------|-----|
| `free` | Plano Gratuito | Cinza |
| `basic` | Plano Básico | Azul |
| `basic-annual` | Plano Básico Anual | Azul |
| `premium` | Plano Premium | Roxo |
| `premium-annual` | Plano Premium Anual | Roxo |
| `freemium` | Premium de Graça | Roxo |
| `lifetime` | Vitalício | Dourado |

### Status do Usuário

| Status | Descrição |
|--------|-----------|
| `active` | Usuário ativo e pode acessar o sistema |
| `inactive` | Usuário inativo |
| `suspended` | Usuário suspenso (bloqueado) |

---

## 🔧 Modal de Criação de Usuário

### Campos do Formulário

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| Avatar | File | Não | Foto de perfil (máx. 5MB) |
| Nome | Texto | Sim | Nome completo |
| Email | Email | Sim | Endereço de email |
| Senha | Password | Sim | Mínimo 6 caracteres |
| Confirmar Senha | Password | Sim | Repetir a senha |
| Função | Select | Não | Tipo de usuário (padrão: Usuário) |
| Status | Select | Não | Situação (padrão: Ativo) |

### Layout do Modal

```
┌─────────────────────────────────────────────────────────────┐
│  Criar Novo Usuário                                    [X]  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────────────┐  │
│  │                     │  │  Nome *                     │  │
│  │     [AVATAR]        │  │  [________________________] │  │
│  │      Grande         │  │                             │  │
│  │                     │  │  Email *                    │  │
│  │  [Adicionar Foto]   │  │  [________________________] │  │
│  │  [Remover Foto]     │  │                             │  │
│  └─────────────────────┘  │  Senha *    [______________]│  │
│                           │  Conf.Senha  [______________]│  │
│                           │                             │  │
│                           │  Função      [Usuário    ▼] │  │
│                           │  Status      [Ativo      ▼] │  │
│                           │                             │  │
│                           │  [CRIAR USUÁRIO] [CANCELAR] │  │
│                           └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 Conexão com Backend

### Arquivo de Configuração da API

**Localização:** `src/lib/api.ts`

### Endpoints Utilizados

#### 1. Criar Usuário

```typescript
// Arquivo: src/lib/api.ts (linha 482)
async createUser(token: string, userData: {
  name: string;
  email: string;
  password: string;
  role?: string;
  avatar?: string;
}): Promise<ApiResponse<any>>

// Rota: POST /auth/register
// Autorização: Bearer {token}
```

**Exemplo de Requisição:**
```http
POST /auth/register HTTP/1.1
Host: api.somaai.com.br
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123",
  "role": "user",
  "avatar": "data:image/jpeg;base64,/9j/4AAQ..."
}
```

**Resposta de Sucesso:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "role": "user",
    "planType": "free",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 2. Listar Usuários

```typescript
// Arquivo: src/lib/api.ts (linha 458)
async getUsers(token: string, page = 1, limit = 10): Promise<ApiResponse<any[]>>

// Rota: GET /users?page={page}&limit={limit}
// Autorização: Bearer {token}
```

#### 3. Atualizar Usuário

```typescript
// Arquivo: src/lib/api.ts (linha 447)
async updateUser(token: string, userId: string, userData: {
  name?: string;
  planType?: string;
  planExpiresAt?: string;
  role?: string;
  status?: string;
  avatar?: string;
}): Promise<ApiResponse<any>>

// Rota: PUT /users/{userId}
// Autorização: Bearer {token}
```

**Exemplo de Requisição:**
```http
PUT /users/123 HTTP/1.1
Host: api.somaai.com.br
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Silva Santos",
  "role": "admin",
  "status": "active",
  "planType": "premium"
}
```

#### 4. Excluir Usuário

```typescript
// Arquivo: src/lib/api.ts (linha 466)
async deleteUser(token: string, userId: string): Promise<ApiResponse<any>>

// Rota: DELETE /users/{userId}
// Autorização: Bearer {token}
```

---

## 🪝 Hooks Utilizados

### useUsersData

**Localização:** `src/hooks/useUsersData.ts`

```typescript
interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin' | 'support'
  planType: string
  planExpiresAt: string
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastLogin?: string
  avatar?: string
}

export function useUsersData() {
  const {
    users,           // User[]
    isLoading,       // boolean
    error,           // string | null
    fetchUsers,      // () => Promise<void>
    updateUser,      // (id: string, data: Partial<User>) => Promise<void>
    deleteUser,      // (id: string) => Promise<void>
    createUser       // (data: UserData) => Promise<void>
  } = useUsersData()
}
```

---

## 🔐 Autenticação

### useAuth

**Localização:** `src/hooks/useAuth.ts`

```typescript
export interface User {
  id: string
  name: string
  email: string
  plan?: string
  role: 'user' | 'admin' | 'support'
  avatar?: string
}

export function useAuth() {
  const { user, token, isAuthenticated, isLoading, error } = useAuth()
  const { login, logout, register, updateUser, validateToken } = useAuth()
}
```

---

## 🎯 Fluxo de Criação de Usuário

```
1. Admin clica em "Novo Usuário"
   ↓
2. Modal de criação é exibido
   ↓
3. Admin preenche os dados e clica em "Criar Usuário"
   ↓
4. handleSubmit() é chamado
   ↓
5. Validação dos campos (nome, email, senha)
   ↓
6. onSave() é chamado com os dados
   ↓
7. createUser() do hook é executado
   ↓
8. api.admin.createUser() é chamado
   ↓
9. POST /auth/register é enviado para a API
   ↓
10. Toast de sucesso é exibido
   ↓
11. Modal é fechado e lista é atualizada
```

---

## 📊 Estados e Feedback

### Toasts de Sucesso

| Ação | Título | Mensagem |
|------|--------|----------|
| Criar Usuário | "Usuário criado!" | "O usuário foi criado com sucesso." |
| Atualizar Usuário | "Usuário atualizado!" | "As informações do usuário foram atualizadas com sucesso." |
| Excluir Usuário | "Usuário excluído!" | "O usuário foi excluído com sucesso." |

### Toasts de Erro

| Ação | Título | Mensagem |
|------|--------|----------|
| Criar Usuário | "Erro ao criar usuário" | "Ocorreu um erro ao tentar criar o usuário. Tente novamente." |
| Atualizar Usuário | "Erro ao atualizar usuário" | "Ocorreu um erro ao tentar atualizar o usuário." |
| Excluir Usuário | "Erro ao excluir usuário" | "Ocorreu um erro ao tentar excluir o usuário." |

---

## 🛠️ Componentes Relacionados

### AdminNavigation
**Localização:** `src/components/AdminNavigation.tsx`
- Menu de navegação do painel admin

### Avatar
**Localização:** `src/components/Avatar.tsx`
- Componente de avatar com suporte a role
- Cores diferentes por função:
  - Admin: Vermelho → Rosa
  - Support: Laranja → Amarelo
  - User: Verde → Azul

### Button
**Localização:** `src/components/ui/Button.tsx`
- Botões estilizados com variantes

### Toast
**Localização:** `src/components/ui/Toast.tsx`
- Sistema de notificações

---

## 📁 Estrutura de Arquivos

```
website-next/
├── app/
│   └── admin/
│       └── users/
│           └── page.tsx          # Página principal de usuários
├── src/
│   ├── components/
│   │   ├── AdminNavigation.tsx   # Navegação do admin
│   │   ├── Avatar.tsx            # Componente de avatar
│   │   └── ui/
│   │       ├── Button.tsx        # Botões
│   │       └── Toast.tsx         # Notificações
│   ├── hooks/
│   │   ├── useAuth.ts            # Hook de autenticação
│   │   └── useUsersData.ts       # Hook de dados de usuários
│   ├── lib/
│   │   ├── api.ts                # Configuração da API
│   │   └── config.ts             # Configurações gerais
│   └── stores/
│       └── authStore.ts          # Store de autenticação
└── docs/
    └── ADMIN_PANEL.md            # Esta documentação
```

---

## 🔧 Variáveis de Ambiente

```env
# URL da API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Em produção:
# NEXT_PUBLIC_API_URL=https://somaaibackend.fly.dev
```

---

## 📝 Notas de Implementação

1. **Validação de Formulário**
   - Nome é obrigatório
   - Email deve ser válido
   - Senha mínimo 6 caracteres
   - Senhas devem coincidir

2. **Upload de Avatar**
   - Máximo 5MB
   - Formatos: JPG, PNG, GIF
   - Convertido para base64

3. **Filtros na Listagem**
   - Busca por nome ou email
   - Filtro por função (role)
   - Filtro por status

4. **Ações em Lote**
   - Seleção múltipla de usuários
   - Ativar, suspender ou excluir selecionados

---

## 🚀 Próximos Passos

- [ ] Implementar paginação completa
- [ ] Adicionar exportação de usuários (CSV/Excel)
- [ ] Implementar busca avançada
- [ ] Adicionar logs de auditoria
- [ ] Implementar recuperação de usuários excluídosver