# Estrutura de Publicidades - Painel Admin

## 📁 Arquivos Criados

```
projeto/
├── app/
│   └── admin/
│       └── advertisements/
│           └── page.tsx                    # Página principal
│
├── components/
│   └── admin/
│       └── advertisements/
│           ├── advertisement-form.tsx      # Formulário de criar/editar
│           └── advertisements-table.tsx    # Tabela de listagem
│
├── lib/
│   ├── api/
│   │   └── advertisements.ts               # API client
│   ├── hooks/
│   │   └── use-toast.ts                    # Hook de notificações
│   └── utils/
│       └── date-formatters.ts              # Formatadores de data
│
└── docs/
    ├── ADMIN_ADVERTISEMENTS_MANAGEMENT.md  # Documentação de uso
    └── ADMIN_ADVERTISEMENTS_STRUCTURE.md   # Este arquivo
```

---

## 🔗 Integração com Menu

O menu de admin foi atualizado em `components/admin/AdminNavigation.tsx`:

```typescript
const somaAiMenu = [
  {
    label: 'Publicidades',
    href: '/admin/advertisements',
    icon: <svg>...</svg>,
  },
  // ... outros itens
];
```

---

## 🎯 Fluxo de Uso

### 1. Acessar a Página
```
super_admin faz login
    ↓
Redirecionado para /admin
    ↓
Clica em "Publicidades" no menu
    ↓
Acessa /admin/advertisements
```

### 2. Listar Publicidades
```
Página carrega
    ↓
useEffect chama loadAdvertisements()
    ↓
advertisementsApi.list() faz GET /advertisements/admin/list
    ↓
Backend retorna array de publicidades
    ↓
setAdvertisements() atualiza estado
    ↓
AdvertisementsTable renderiza a tabela
```

### 3. Criar Publicidade
```
Clica em "Nova Publicidade"
    ↓
AdvertisementForm abre
    ↓
Preenche formulário
    ↓
Clica em "Salvar Publicidade"
    ↓
handleCreate() valida dados
    ↓
advertisementsApi.create() faz POST /advertisements
    ↓
Backend cria publicidade
    ↓
Publicidade é adicionada à lista
    ↓
Toast de sucesso aparece
```

### 4. Editar Publicidade
```
Clica em "Editar" na tabela
    ↓
handleEdit() abre formulário com dados
    ↓
AdvertisementForm preenche com dados existentes
    ↓
Modifica campos
    ↓
Clica em "Salvar Publicidade"
    ↓
handleUpdate() valida dados
    ↓
advertisementsApi.update() faz PUT /advertisements/:id
    ↓
Backend atualiza publicidade
    ↓
Publicidade é atualizada na lista
    ↓
Toast de sucesso aparece
```

### 5. Deletar Publicidade
```
Clica em "Deletar" na tabela
    ↓
Confirmação aparece
    ↓
Confirma deleção
    ↓
handleDelete() chama advertisementsApi.delete()
    ↓
Backend deleta publicidade
    ↓
Publicidade é removida da lista
    ↓
Toast de sucesso aparece
```

---

## 🔄 Componentes e Props

### AdvertisementForm
```typescript
<AdvertisementForm
  advertisement={selectedAd}           // Publicidade para editar (opcional)
  onSubmit={handleCreate}              // Callback ao salvar
  isLoading={isSubmitting}             // Estado de carregamento
  onCancel={handleCloseForm}           // Callback ao cancelar
/>
```

**Validações:**
- Título obrigatório
- Descrição obrigatória
- URL da imagem obrigatória
- URL de ação obrigatória
- Data de início obrigatória
- Data de término obrigatória
- Data de término > Data de início

### AdvertisementsTable
```typescript
<AdvertisementsTable
  advertisements={advertisements}      // Lista de publicidades
  onEdit={handleEdit}                  // Callback ao editar
  onDelete={handleDelete}              // Callback ao deletar
  isLoading={isLoading}                // Estado de carregamento
/>
```

**Colunas:**
- Título (com imagem)
- Plataforma
- Período (data início - data fim)
- Prioridade
- Estatísticas (impressões, cliques, CTR)
- Status (ativo/inativo)
- Ações (editar, deletar)

---

## 📊 Estados da Página

### Carregando
```
┌─────────────────────────────────┐
│  Spinner de carregamento        │
└─────────────────────────────────┘
```

### Sem Publicidades
```
┌─────────────────────────────────┐
│  Ícone de documento vazio       │
│  "Nenhuma publicidade encontrada"│
└─────────────────────────────────┘
```

### Com Publicidades
```
┌─────────────────────────────────┐
│  Tabela com publicidades        │
│  - Título                       │
│  - Plataforma                   │
│  - Período                      │
│  - Prioridade                   │
│  - Estatísticas                 │
│  - Status                       │
│  - Ações (Editar, Deletar)      │
└─────────────────────────────────┘
```

### Formulário Aberto
```
┌─────────────────────────────────┐
│  Formulário de Publicidade      │
│  - Título                       │
│  - Descrição                    │
│  - URL da Imagem (com preview)  │
│  - Cores                        │
│  - URLs de Ação                 │
│  - Datas                        │
│  - Plataforma                   │
│  - Status                       │
│  - Botões (Salvar, Cancelar)    │
└─────────────────────────────────┘
```

---

## 🔐 Proteção de Rota

O layout do admin (`app/admin/layout.tsx`) verifica:

```typescript
const isAdmin = userRole === 'admin' || userRole === 'super_admin';

if (!isAuthenticated || !isAdmin) {
  router.replace('/dashboard');
}
```

**Resultado:**
- ✅ super_admin: Acesso total
- ✅ admin: Acesso total
- ❌ user: Redirecionado para /dashboard

---

## 🚀 Como Usar

### 1. Acessar a Página
```
https://seu-app.com/admin/advertisements
```

### 2. Criar Publicidade
1. Clique em "Nova Publicidade"
2. Preencha o formulário
3. Clique em "Salvar Publicidade"

### 3. Editar Publicidade
1. Clique em "Editar" na tabela
2. Modifique os campos
3. Clique em "Salvar Publicidade"

### 4. Deletar Publicidade
1. Clique em "Deletar" na tabela
2. Confirme a deleção

---

## 📱 Responsividade

- ✅ Desktop: Layout completo com tabela
- ✅ Tablet: Tabela com scroll horizontal
- ✅ Mobile: Tabela com scroll horizontal

---

## 🎨 Cores e Estilos

### Botões
- **Primário (Azul):** `bg-blue-600 hover:bg-blue-700`
- **Secundário (Cinza):** `bg-gray-200 hover:bg-gray-300`
- **Perigo (Vermelho):** `bg-red-100 text-red-700 hover:bg-red-200`

### Status
- **Ativo:** `bg-green-100 text-green-800`
- **Inativo:** `bg-gray-100 text-gray-800`

### Plataforma
- **Mobile/Web/Todas:** `bg-blue-100 text-blue-800`

---

## 🔗 Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/advertisements/admin/list` | Listar publicidades |
| POST | `/advertisements` | Criar publicidade |
| PUT | `/advertisements/:id` | Atualizar publicidade |
| DELETE | `/advertisements/:id` | Deletar publicidade |

---

## ✅ Checklist de Implementação

- [x] Criar API client (`lib/api/advertisements.ts`)
- [x] Criar componente de formulário (`AdvertisementForm`)
- [x] Criar componente de tabela (`AdvertisementsTable`)
- [x] Criar página principal (`app/admin/advertisements/page.tsx`)
- [x] Adicionar rota no menu (`AdminNavigation.tsx`)
- [x] Criar hook de toast (`use-toast.ts`)
- [x] Criar formatadores de data (`date-formatters.ts`)
- [x] Criar documentação de uso
- [x] Criar documentação de estrutura

---

**Implementação completa! 🎉**
