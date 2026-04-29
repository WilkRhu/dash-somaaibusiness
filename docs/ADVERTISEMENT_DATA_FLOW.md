# Fluxo de Dados - Sistema de Publicidades

## 📊 Como as Propagandas Aparecem

Sim! O app **precisa receber dados da API** para exibir as propagandas. Aqui está o fluxo completo:

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────┐
│ 1. App Inicia                                           │
│    └─ AdvertisementProvider é carregado (_layout.tsx)  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. useEffect no AdvertisementContext                    │
│    └─ Chama loadAdvertisements()                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. advertisementApi.getAdvertisements()                 │
│    └─ Faz requisição GET /advertisements                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Backend API Responde                                 │
│    └─ Retorna array de anúncios                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. setAdvertisements(ads)                               │
│    └─ Atualiza estado no contexto                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 6. useAdvertisements() Hook                             │
│    └─ Componentes recebem os anúncios                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 7. AdvertisementBanner Renderiza                        │
│    └─ Exibe os banners rotativos                        │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Código do Fluxo

### 1. Inicialização (AdvertisementContext.tsx)

```typescript
export function AdvertisementProvider({ children }: { children: React.ReactNode }) {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar anúncios ao inicializar
  useEffect(() => {
    loadAdvertisements();  // ← Chamado automaticamente
  }, []);

  const loadAdvertisements = async () => {
    setLoading(true);
    try {
      // Requisição à API
      const ads = await advertisementApi.getAdvertisements(10, 0);
      setAdvertisements(ads);  // ← Atualiza estado
    } catch (error) {
      console.error('Erro ao carregar anúncios:', error);
      setAdvertisements([]);
    } finally {
      setLoading(false);
    }
  };
}
```

### 2. Requisição à API (advertisementApi.ts)

```typescript
async getAdvertisements(limit: number = 10, offset: number = 0) {
  try {
    // Faz GET para /advertisements
    const response = await somaAIAPI.get('/advertisements', {
      params: { limit, offset }
    });
    return response.data.data || [];  // ← Retorna array de anúncios
  } catch (error) {
    console.error('Erro ao buscar publicidades:', error);
    return [];
  }
}
```

### 3. Uso no Componente (home.tsx)

```typescript
export default function HomeScreen() {
  // Recebe os anúncios do contexto
  const { advertisements } = useAdvertisements();

  return (
    <ScrollView>
      {/* ... conteúdo ... */}
      
      {/* Passa os anúncios para o banner */}
      <AdvertisementBanner 
        advertisements={advertisements}
        height={140}
        autoScroll={true}
        scrollInterval={5000}
      />
      
      {/* ... mais conteúdo ... */}
    </ScrollView>
  );
}
```

---

## 🌐 Requisição à API

### Endpoint
```
GET /api/v1/advertisements?limit=10&offset=0
```

### Resposta Esperada
```json
{
  "success": true,
  "data": [
    {
      "id": "ad_123456",
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
      "isActive": true,
      "impressions": 1250,
      "clicks": 45,
      "ctr": 3.6,
      "createdAt": "2024-04-20T10:30:00Z",
      "updatedAt": "2024-04-22T15:45:00Z"
    },
    {
      "id": "ad_789012",
      "title": "Novo Restaurante",
      "description": "Conheça nossos novos parceiros",
      "imageUrl": "https://cdn.somaai.com/ads/restaurant.jpg",
      "backgroundColor": "#f59e0b",
      "gradientColors": ["#f59e0b", "#d97706"],
      "actionUrl": "https://somaai.com/restaurants",
      "actionLabel": "Explorar",
      "startDate": "2024-04-25T00:00:00Z",
      "endDate": "2024-05-25T23:59:59Z",
      "priority": 2,
      "platform": "mobile",
      "isActive": true,
      "impressions": 890,
      "clicks": 32,
      "ctr": 3.6,
      "createdAt": "2024-04-22T16:00:00Z",
      "updatedAt": "2024-04-22T16:00:00Z"
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

---

## ⚙️ Configuração Necessária

### 1. Variável de Ambiente
```bash
# .env
EXPO_PUBLIC_API_URL=https://api.somaai.com
```

### 2. Backend Deve Ter
- ✅ Endpoint GET `/api/v1/advertisements`
- ✅ Retornar array de anúncios ativos
- ✅ Filtrar por data (startDate <= hoje <= endDate)
- ✅ Filtrar por plataforma (mobile, web, all)
- ✅ Ordenar por prioridade

---

## 🔍 Verificar se Está Funcionando

### 1. Verificar Console
```typescript
// Adicionar log no AdvertisementContext
const loadAdvertisements = async () => {
  setLoading(true);
  try {
    const ads = await advertisementApi.getAdvertisements(10, 0);
    console.log('✅ Anúncios carregados:', ads);  // ← Ver aqui
    setAdvertisements(ads);
  } catch (error) {
    console.error('❌ Erro ao carregar anúncios:', error);
    setAdvertisements([]);
  } finally {
    setLoading(false);
  }
};
```

### 2. Verificar Network Tab
1. Abrir DevTools
2. Ir para Network tab
3. Procurar por requisição para `/advertisements`
4. Verificar se retorna status 200
5. Ver o JSON da resposta

### 3. Verificar se Anúncios Aparecem
1. Abrir Home
2. Procurar por banner rotativo
3. Verificar se rotaciona a cada 5 segundos
4. Clicar em um anúncio

---

## 🚨 Possíveis Problemas

### Problema: Anúncios não aparecem
**Causas possíveis:**
1. API não está retornando dados
2. `EXPO_PUBLIC_API_URL` não está configurada
3. Endpoint `/advertisements` não existe
4. Anúncios não estão ativos (isActive = false)
5. Anúncios estão fora da data (startDate > hoje ou endDate < hoje)

**Solução:**
```typescript
// Adicionar logs para debug
const loadAdvertisements = async () => {
  console.log('🔄 Carregando anúncios...');
  try {
    const ads = await advertisementApi.getAdvertisements(10, 0);
    console.log('✅ Resposta da API:', ads);
    console.log('📊 Total de anúncios:', ads.length);
    setAdvertisements(ads);
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};
```

### Problema: Requisição falha
**Verificar:**
1. URL da API está correta?
2. API está online?
3. Token de autenticação está válido?
4. CORS está configurado?

---

## 📱 Rastreamento de Dados

Além de receber os anúncios, o app também **envia dados** para a API:

### Impressão (quando vê o anúncio)
```typescript
POST /api/v1/advertisements/{id}/impression
{
  "userId": "user_123",
  "platform": "mobile",
  "timestamp": "2024-04-22T16:30:00Z"
}
```

### Clique (quando clica no anúncio)
```typescript
POST /api/v1/advertisements/{id}/click
{
  "userId": "user_123",
  "platform": "mobile",
  "timestamp": "2024-04-22T16:31:00Z"
}
```

---

## 🎯 Resumo

| Etapa | O que acontece |
|-------|----------------|
| 1 | App inicia e carrega AdvertisementProvider |
| 2 | useEffect chama loadAdvertisements() |
| 3 | API é chamada: GET /advertisements |
| 4 | Backend retorna array de anúncios |
| 5 | Estado é atualizado com os anúncios |
| 6 | Componentes recebem os dados via hook |
| 7 | AdvertisementBanner renderiza os banners |
| 8 | Usuário vê os banners rotativos |
| 9 | Cliques e impressões são rastreados |

---

## ✅ Checklist

- [ ] API está retornando dados?
- [ ] `EXPO_PUBLIC_API_URL` está configurada?
- [ ] Anúncios estão ativos (isActive = true)?
- [ ] Datas dos anúncios estão corretas?
- [ ] Banners aparecem na Home?
- [ ] Banners aparecem no Delivery?
- [ ] Rastreamento de impressões funciona?
- [ ] Rastreamento de cliques funciona?

---

**Tudo pronto! 🚀**
