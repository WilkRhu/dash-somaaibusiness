# Gerenciamento de Publicidades - Painel Admin

## 📍 Localização

**URL:** `/admin/advertisements`

Acesso exclusivo para usuários com role `super_admin`.

---

## 🎯 Funcionalidades

### 1. Listar Publicidades
- Visualizar todas as publicidades cadastradas
- Ver informações resumidas de cada publicidade
- Filtrar por status (ativo/inativo)
- Visualizar estatísticas (impressões, cliques, CTR)

### 2. Criar Nova Publicidade
- Formulário completo com validações
- Suporte a cores personalizadas
- Preview de imagem em tempo real
- Configuração de datas de início e término
- Seleção de plataforma (Mobile, Web, Todas)

### 3. Editar Publicidade
- Modificar qualquer campo da publicidade
- Atualizar imagem e cores
- Alterar datas e status
- Validações em tempo real

### 4. Deletar Publicidade
- Remover publicidades com confirmação
- Ação irreversível

---

## 📋 Campos do Formulário

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| Título | Texto | ✅ | Nome da publicidade (ex: "Promoção Especial") |
| Descrição | Texto longo | ✅ | Descrição detalhada da publicidade |
| URL da Imagem | URL | ✅ | Link para a imagem (HTTPS) |
| Cor de Fundo | Cor | ❌ | Cor de fundo do banner |
| Cores do Gradiente | Cores | ❌ | Até 2 cores para gradiente |
| URL de Ação | URL | ✅ | Link para onde o usuário será redirecionado |
| Texto do Botão | Texto | ❌ | Texto do botão de ação (padrão: "Aproveitar") |
| Data de Início | Data | ✅ | Quando a publicidade começa a aparecer |
| Data de Término | Data | ✅ | Quando a publicidade para de aparecer |
| Prioridade | Número | ❌ | Ordem de exibição (1-100, padrão: 1) |
| Plataforma | Select | ❌ | Onde exibir (Mobile, Web, Todas) |
| Ativo | Checkbox | ❌ | Se a publicidade está ativa |

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────┐
│ Página de Publicidades (/admin/ads)     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ advertisementsApi (lib/api/ads.ts)      │
│ - list()                                │
│ - create()                              │
│ - update()                              │
│ - delete()                              │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Backend API                             │
│ POST   /advertisements                  │
│ PUT    /advertisements/:id              │
│ DELETE /advertisements/:id              │
│ GET    /advertisements/admin/list       │
└─────────────────────────────────────────┘
```

---

## 🛠️ Componentes

### `AdvertisementForm`
Formulário para criar/editar publicidades.

**Props:**
```typescript
interface AdvertisementFormProps {
  advertisement?: Advertisement;        // Publicidade para editar (opcional)
  onSubmit: (data) => Promise<void>;   // Callback ao salvar
  isLoading?: boolean;                  // Estado de carregamento
  onCancel?: () => void;                // Callback ao cancelar
}
```

### `AdvertisementsTable`
Tabela com lista de publicidades.

**Props:**
```typescript
interface AdvertisementsTableProps {
  advertisements: Advertisement[];       // Lista de publicidades
  onEdit: (ad) => void;                 // Callback ao editar
  onDelete: (id) => void;               // Callback ao deletar
  isLoading?: boolean;                  // Estado de carregamento
}
```

---

## 📊 Estrutura de Dados

### Advertisement
```typescript
interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  backgroundColor: string;              // Ex: "#10b981"
  gradientColors: string[];              // Ex: ["#10b981", "#059669"]
  actionUrl: string;
  actionLabel: string;
  startDate: string;                     // ISO 8601
  endDate: string;                       // ISO 8601
  priority: number;
  platform: 'mobile' | 'web' | 'all';
  isActive: boolean;
  impressions: number;
  clicks: number;
  ctr: number;                           // Click-through rate
  createdAt: string;
  updatedAt: string;
}
```

---

## 🔐 Permissões

- ✅ **super_admin**: Acesso total
- ❌ **admin**: Sem acesso
- ❌ **user**: Sem acesso

---

## 📱 Endpoints da API

### Listar Publicidades
```bash
GET /api/v1/advertisements/admin/list?limit=10&offset=0
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ad_123",
      "title": "Promoção",
      "description": "Ganhe 20% de desconto",
      "imageUrl": "https://...",
      "backgroundColor": "#10b981",
      "gradientColors": ["#10b981", "#059669"],
      "actionUrl": "https://somaai.com/promo",
      "actionLabel": "Aproveitar",
      "startDate": "2024-04-22T00:00:00Z",
      "endDate": "2024-05-22T23:59:59Z",
      "priority": 1,
      "platform": "mobile",
      "isActive": true,
      "impressions": 1250,
      "clicks": 45,
      "ctr": 3.6,
      "createdAt": "2024-04-20T10:30:00Z",
      "updatedAt": "2024-04-22T15:45:00Z"
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

### Criar Publicidade
```bash
POST /api/v1/advertisements
Content-Type: application/json

{
  "title": "Promoção Especial",
  "description": "Ganhe 20% de desconto",
  "imageUrl": "https://cdn.somaai.com/ads/promo.jpg",
  "backgroundColor": "#10b981",
  "gradientColors": ["#10b981", "#059669"],
  "actionUrl": "https://somaai.com/promo",
  "actionLabel": "Aproveitar",
  "startDate": "2024-04-22T00:00:00Z",
  "endDate": "2024-05-22T23:59:59Z",
  "priority": 1,
  "platform": "mobile",
  "isActive": true
}
```

### Atualizar Publicidade
```bash
PUT /api/v1/advertisements/:id
Content-Type: application/json

{
  "title": "Promoção Atualizada",
  "isActive": false
}
```

### Deletar Publicidade
```bash
DELETE /api/v1/advertisements/:id
```

---

## ✅ Checklist de Uso

- [ ] Acessar `/admin/advertisements` como super_admin
- [ ] Visualizar lista de publicidades
- [ ] Criar nova publicidade com todos os campos
- [ ] Editar publicidade existente
- [ ] Deletar publicidade com confirmação
- [ ] Verificar se as publicidades aparecem no app
- [ ] Monitorar estatísticas (impressões e cliques)

---

## 🚨 Possíveis Erros

### "Erro ao carregar publicidades"
- Verificar se o backend está online
- Verificar se o token de autenticação é válido
- Verificar se o usuário tem role `super_admin`

### "Erro ao criar publicidade"
- Verificar se todos os campos obrigatórios foram preenchidos
- Verificar se a URL da imagem é válida
- Verificar se a data de término é após a data de início

### "Imagem não carrega"
- Verificar se a URL é HTTPS
- Verificar se o servidor de imagens está online
- Verificar se a imagem existe

---

## 📝 Exemplo de Uso

### 1. Criar Publicidade
```typescript
const handleCreate = async (data: CreateAdvertisementDto) => {
  try {
    const newAd = await advertisementsApi.create(data);
    console.log('✅ Publicidade criada:', newAd);
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};
```

### 2. Listar Publicidades
```typescript
const loadAdvertisements = async () => {
  try {
    const ads = await advertisementsApi.list(10, 0);
    console.log('✅ Publicidades carregadas:', ads);
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};
```

### 3. Atualizar Publicidade
```typescript
const handleUpdate = async (id: string, data: UpdateAdvertisementDto) => {
  try {
    const updatedAd = await advertisementsApi.update(id, data);
    console.log('✅ Publicidade atualizada:', updatedAd);
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};
```

---

## 🎨 Dicas de Design

### Cores Recomendadas
- Verde: `#10b981` → `#059669`
- Azul: `#3b82f6` → `#1d4ed8`
- Laranja: `#f59e0b` → `#d97706`
- Vermelho: `#ef4444` → `#dc2626`

### Tamanho de Imagem
- Recomendado: 1200x400px
- Formato: JPG ou PNG
- Tamanho máximo: 5MB

### Texto do Botão
- Máximo 20 caracteres
- Ação clara e direta
- Exemplos: "Aproveitar", "Explorar", "Saiba Mais"

---

**Tudo pronto! 🚀**
