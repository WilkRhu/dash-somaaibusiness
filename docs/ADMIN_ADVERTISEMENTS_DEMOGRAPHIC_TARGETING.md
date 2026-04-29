# Segmentação Demográfica - Publicidades

## 📊 Novos Campos Adicionados

O sistema de publicidades agora suporta segmentação demográfica para direcionar anúncios a públicos específicos, com suporte a **múltiplos gêneros**.

---

## 🎯 Campos de Segmentação

### 1. Idade Mínima (`minAge`)
- **Tipo:** Número (0-120)
- **Obrigatório:** Não
- **Descrição:** Idade mínima do público-alvo
- **Exemplo:** 18

### 2. Idade Máxima (`maxAge`)
- **Tipo:** Número (0-120)
- **Obrigatório:** Não
- **Descrição:** Idade máxima do público-alvo
- **Exemplo:** 65

### 3. Gêneros Alvo (`targetGenders`)
- **Tipo:** Array de strings
- **Obrigatório:** Não
- **Descrição:** Lista de gêneros do público-alvo (deixe vazio para todos)
- **Valores possíveis:**
  - `woman_cisgender` - Mulher (Cisgênero)
  - `man_cisgender` - Homem (Cisgênero)
  - `woman_trans` - Mulher Trans / Travesti
  - `man_trans` - Homem Trans
  - `non_binary` - Não-binário / Gênero Não-Conformista
  - `agender` - Agênero (sem gênero)
  - `gender_fluid` - Gênero-fluido
  - `other` - Outro / Prefiro não informar
  - `prefer_not_to_say` - Prefiro não informar
- **Exemplo:** `["woman_cisgender", "man_cisgender"]`

---

## 📋 Estrutura de Dados

### Advertisement (Atualizado)
```typescript
interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  backgroundColor: string;
  gradientColors: string[];
  actionUrl: string;
  actionLabel: string;
  startDate: string;
  endDate: string;
  priority: number;
  platform: 'mobile' | 'web' | 'all';
  isActive: boolean;
  impressions: number;
  clicks: number;
  ctr: number;
  minAge?: number;                    // ✨ NOVO
  maxAge?: number;                    // ✨ NOVO
  targetGenders?: string[];           // ✨ NOVO - Array de gêneros
  createdAt: string;
  updatedAt: string;
}
```

### CreateAdvertisementDto (Atualizado)
```typescript
interface CreateAdvertisementDto {
  title: string;
  description: string;
  imageUrl: string;
  backgroundColor: string;
  gradientColors: string[];
  actionUrl: string;
  actionLabel: string;
  startDate: string;
  endDate: string;
  priority: number;
  platform: 'mobile' | 'web' | 'all';
  isActive: boolean;
  minAge?: number;                    // ✨ NOVO
  maxAge?: number;                    // ✨ NOVO
  targetGenders?: string[];           // ✨ NOVO - Array de gêneros
}
```

---

## 🔄 Exemplo de Requisição

### Criar Publicidade com Segmentação
```bash
POST /api/v1/advertisements
Content-Type: application/json

{
  "title": "Promoção Especial",
  "description": "Aproveite nossa promoção",
  "imageUrl": "https://cdn.example.com/image.jpg",
  "backgroundColor": "#1E90FF",
  "gradientColors": ["#1E90FF", "#0047AB"],
  "actionUrl": "https://example.com/promo",
  "actionLabel": "Ver Promoção",
  "startDate": "2024-04-25T00:00:00Z",
  "endDate": "2024-05-25T23:59:59Z",
  "priority": 5,
  "platform": "mobile",
  "isActive": true,
  "minAge": 25,
  "maxAge": 60,
  "targetGenders": ["woman_cisgender", "man_cisgender"]
}
```

---

## 🎨 Interface do Formulário

### Seção de Segmentação Demográfica
```
┌─────────────────────────────────────────────────────┐
│ Segmentação Demográfica (Opcional)                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Idade Mínima    │ Idade Máxima                      │
│ [18          ]  │ [65          ]                    │
│                                                     │
│ Gêneros Alvo (Deixe em branco para todos)          │
│ ☑ Mulher (Cisgênero)    ☐ Homem (Cisgênero)       │
│ ☐ Mulher Trans / Travesti  ☐ Homem Trans          │
│ ☐ Não-binário           ☐ Agênero                 │
│ ☐ Gênero-fluido         ☐ Outro                   │
│ ☐ Prefiro não informar                             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Seleção de Múltiplos Gêneros
- Checkboxes para cada gênero
- Deixe em branco para atingir todos os gêneros
- Selecione múltiplos gêneros para segmentação específica

---

## 📊 Visualização na Tabela

A coluna "Segmentação" mostra:
- **Faixa etária:** "25 - 60 anos" ou "Sem restrição"
- **Gêneros:** Tags com abreviações dos gêneros selecionados

Exemplo:
```
┌──────────────────────────────────────────┐
│ Segmentação                              │
├──────────────────────────────────────────┤
│ 25 - 60 anos                             │
│ [Mulher] [Homem] [M. Trans]              │
└──────────────────────────────────────────┘
```

### Abreviações na Tabela
- `Mulher` - Mulher (Cisgênero)
- `Homem` - Homem (Cisgênero)
- `M. Trans` - Mulher Trans / Travesti
- `H. Trans` - Homem Trans
- `Não-bin.` - Não-binário
- `Agênero` - Agênero
- `Fluido` - Gênero-fluido
- `Outro` - Outro
- `Não inf.` - Prefiro não informar

---

## ✅ Validações

### Idade
- ✅ Idade mínima não pode ser maior que idade máxima
- ✅ Valores entre 0 e 120
- ✅ Ambos os campos são opcionais

### Gêneros
- ✅ Array de strings com valores válidos
- ✅ Campo opcional (array vazio = todos os gêneros)
- ✅ Suporta múltiplas seleções

---

## 🔍 Casos de Uso

### 1. Publicidade para Homens e Mulheres Cisgênero 25-60 anos
```json
{
  "minAge": 25,
  "maxAge": 60,
  "targetGenders": ["woman_cisgender", "man_cisgender"]
}
```

### 2. Publicidade para Mulheres (todas as identidades) 18-35 anos
```json
{
  "minAge": 18,
  "maxAge": 35,
  "targetGenders": ["woman_cisgender", "woman_trans"]
}
```

### 3. Publicidade para Comunidade LGBTQ+ (qualquer idade)
```json
{
  "targetGenders": ["woman_trans", "man_trans", "non_binary", "gender_fluid", "agender"]
}
```

### 4. Publicidade para Maiores de 50 anos (qualquer gênero)
```json
{
  "minAge": 50,
  "targetGenders": []
}
```

### 5. Publicidade para Todos (sem segmentação)
```json
{
  "minAge": undefined,
  "maxAge": undefined,
  "targetGenders": []
}
```

---

## 🚀 Como Usar

### 1. Criar Publicidade com Segmentação
1. Acesse `/admin/advertisements`
2. Clique em "Nova Publicidade"
3. Preencha os campos básicos
4. Desça até "Segmentação Demográfica"
5. Preencha os campos desejados:
   - Idade Mínima (opcional)
   - Idade Máxima (opcional)
   - Gêneros Alvo (selecione múltiplos com checkboxes)
6. Clique em "Salvar Publicidade"

### 2. Editar Segmentação
1. Clique em "Editar" na tabela
2. Modifique os campos de segmentação
3. Clique em "Salvar Publicidade"

### 3. Remover Segmentação
1. Clique em "Editar" na tabela
2. Desmarque todos os gêneros
3. Clique em "Salvar Publicidade"

---

## 📱 Impacto no App

Quando o app carrega publicidades, ele filtra baseado em:
- Data de início/término
- Plataforma (mobile/web)
- Status (ativo/inativo)
- **Idade do usuário** ✨
- **Gênero do usuário** ✨

Exemplo de filtro no app:
```typescript
const filteredAds = advertisements.filter(ad => {
  // Verificar idade
  if (ad.minAge && userAge < ad.minAge) return false;
  if (ad.maxAge && userAge > ad.maxAge) return false;
  
  // Verificar gênero
  if (ad.targetGenders && ad.targetGenders.length > 0) {
    if (!ad.targetGenders.includes(userGender)) {
      return false;
    }
  }
  
  return true;
});
```

---

## 🔐 Permissões

- ✅ **super_admin:** Pode criar/editar/deletar com segmentação
- ❌ **admin:** Sem acesso
- ❌ **user:** Sem acesso

---

## ✅ Checklist

- [x] Campos adicionados à interface
- [x] Validações implementadas
- [x] Formulário atualizado com checkboxes
- [x] Tabela atualizada com tags de gêneros
- [x] API client atualizado
- [x] Documentação criada
- [x] Sem erros de compilação
- [x] Suporte a múltiplos gêneros

---

**Segmentação demográfica com múltiplos gêneros implementada! 🎉**
