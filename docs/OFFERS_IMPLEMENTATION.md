# Implementação do Módulo de Ofertas - Frontend

## Visão Geral

O módulo de Ofertas permite que estabelecimentos criem e gerenciem promoções de produtos com tracking automático de performance e integração com o app Consumer.

## Arquitetura

### Estrutura de Arquivos

```
lib/
├── api/
│   └── offers.ts              # Cliente API
├── hooks/
│   └── use-offers.ts          # Hook customizado
├── stores/
│   └── offers-store.ts        # Estado global (Zustand)
└── types/
    └── offers.ts              # Tipos TypeScript

components/
└── offers/
    ├── create-offer-form.tsx       # Formulário de criação
    ├── edit-offer-form.tsx         # Formulário de edição
    ├── offers-table.tsx            # Tabela de ofertas
    └── offer-analytics-modal.tsx   # Modal de analytics

app/
└── (dashboard)/
    └── offers/
        └── page.tsx           # Página principal
```

## Tipos TypeScript

### Offer
```typescript
interface Offer {
  id: string;
  establishmentId: string;
  itemId: string;
  title: string;
  description?: string;
  originalPrice: number;
  offerPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  viewCount: number;
  saveCount: number;
  conversionCount: number;
  createdAt: string;
  updatedAt: string;
  
  item?: {
    id: string;
    name: string;
    images?: string[];
    category?: string;
  };
}
```

### CreateOfferDto
```typescript
interface CreateOfferDto {
  itemId: string;
  title: string;
  description?: string;
  offerPrice: number;
  startDate: string;
  endDate: string;
}
```

### OfferAnalytics
```typescript
interface OfferAnalytics {
  offerId: string;
  title: string;
  viewCount: number;
  saveCount: number;
  conversionCount: number;
  conversionRate: number;
  saveRate: number;
  totalRevenue: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}
```

## API Client

### Endpoints Disponíveis

```typescript
offersApi.list(establishmentId, filters?)
offersApi.getById(establishmentId, id)
offersApi.create(establishmentId, dto)
offersApi.update(establishmentId, id, dto)
offersApi.delete(establishmentId, id)
offersApi.activate(establishmentId, id)
offersApi.deactivate(establishmentId, id)
offersApi.getAnalytics(establishmentId, id)
```

## Hook Customizado

### useOffers

```typescript
const {
  offers,           // Lista de ofertas
  isLoading,        // Estado de carregamento
  error,            // Mensagem de erro
  pagination,       // Dados de paginação
  refetch,          // Recarregar dados
  createOffer,      // Criar oferta
  updateOffer,      // Atualizar oferta
  deleteOffer,      // Deletar oferta
  activateOffer,    // Ativar oferta
  deactivateOffer,  // Desativar oferta
  getAnalytics,     // Buscar analytics
} = useOffers(filters);
```

### Exemplo de Uso

```typescript
'use client';

import { useOffers } from '@/lib/hooks/use-offers';

export default function OffersPage() {
  const { offers, isLoading, createOffer } = useOffers();

  const handleCreate = async (data) => {
    try {
      await createOffer(data);
      // Sucesso
    } catch (error) {
      // Erro
    }
  };

  return (
    <div>
      {offers.map(offer => (
        <div key={offer.id}>{offer.title}</div>
      ))}
    </div>
  );
}
```

## Componentes

### CreateOfferForm

Formulário para criar novas ofertas com validações:
- Preço da oferta deve ser menor que o preço original
- Data de início deve ser anterior à data de término
- Cálculo automático de desconto percentual

```typescript
<CreateOfferForm
  onSuccess={() => console.log('Criado!')}
  onCancel={() => console.log('Cancelado')}
/>
```

### EditOfferForm

Formulário para editar ofertas existentes:

```typescript
<EditOfferForm
  offer={selectedOffer}
  onSuccess={() => console.log('Atualizado!')}
  onCancel={() => console.log('Cancelado')}
/>
```

### OffersTable

Tabela com todas as ofertas e ações:

```typescript
<OffersTable
  offers={offers}
  onEdit={(offer) => setEditingOffer(offer)}
  onViewAnalytics={(offer) => setAnalyticsOffer(offer)}
/>
```

### OfferAnalyticsModal

Modal com métricas de performance:
- Visualizações, salvamentos, conversões
- Taxas de conversão e salvamento
- Receita total gerada
- Insights automáticos

```typescript
<OfferAnalyticsModal
  offer={selectedOffer}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

## Validações

### Frontend

1. **Preço da Oferta**
   - Deve ser menor que o preço original do produto
   - Validado antes do envio

2. **Período**
   - Data de início deve ser anterior à data de término
   - Validado no formulário

3. **Campos Obrigatórios**
   - itemId, title, offerPrice, startDate, endDate

### Backend

O backend realiza validações adicionais:
- Item deve pertencer ao estabelecimento
- Oferta só pode ser ativada se estiver no período válido
- Verificação de limites por plano

## Permissões

### Roles Permitidas

- **OWNER**: Acesso total
- **ADMIN**: Acesso total
- **MARKETING**: Acesso total
- **SALES**: Apenas visualização

### Verificação

```typescript
import { canAccess, PERMISSIONS } from '@/lib/utils/permissions';

const canManage = canAccess(userRole, PERMISSIONS.MANAGE_OFFERS);
```

## Integração com Planos

### Limites por Plano

- **FREE**: 2 ofertas ativas
- **TRIAL**: 10 ofertas ativas
- **BASIC**: 5 ofertas ativas
- **PREMIUM**: 20 ofertas ativas
- **ENTERPRISE**: Ilimitado

## Analytics e Métricas

### Métricas Disponíveis

1. **Visualizações**: Quantas vezes a oferta foi vista
2. **Salvamentos**: Quantos usuários salvaram a oferta
3. **Conversões**: Quantas vendas foram realizadas
4. **Taxa de Salvamento**: (salvamentos / visualizações) × 100
5. **Taxa de Conversão**: (conversões / visualizações) × 100
6. **Receita Total**: conversões × preço da oferta

### Insights Automáticos

O modal de analytics fornece insights baseados nas métricas:
- Alta taxa de conversão (>10%)
- Alta taxa de salvamento (>20%)
- Muitas visualizações mas poucas conversões (<5%)
- Receita total gerada

## Estados da Oferta

### Status

- **Ativa**: `isActive = true` e dentro do período
- **Inativa**: `isActive = false`
- **Expirada**: Data de término passou
- **Agendada**: Data de início ainda não chegou

### Indicadores Visuais

```typescript
{offer.isActive ? (
  <span className="bg-green-100 text-green-800">Ativa</span>
) : (
  <span className="bg-gray-100 text-gray-800">Inativa</span>
)}

{isExpired(offer.endDate) && (
  <span className="text-red-600">Expirada</span>
)}

{isUpcoming(offer.startDate) && (
  <span className="text-blue-600">Agendada</span>
)}
```

## Filtros

### Filtros Disponíveis

```typescript
interface OfferFilters {
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
```

### Uso

```typescript
const [filters, setFilters] = useState<OfferFilters>({});

// Filtrar apenas ativas
setFilters({ isActive: true });

// Filtrar por período
setFilters({ 
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});
```

## Integração com Inventory

As ofertas são criadas a partir de produtos do inventário:

```typescript
const { items } = useInventory();

// Selecionar produto
<select>
  {items.map(item => (
    <option value={item.id}>
      {item.name} - R$ {item.salePrice.toFixed(2)}
    </option>
  ))}
</select>
```

## Tratamento de Erros

### Padrão de Erro

```typescript
try {
  await createOffer(data);
  showToast('Oferta criada com sucesso!', 'success');
} catch (error: any) {
  showToast(error.message, 'error');
}
```

### Mensagens Comuns

- "Preço da oferta deve ser menor que o preço original"
- "Data de início deve ser anterior à data de término"
- "Limite de ofertas ativas atingido"
- "Oferta só pode ser ativada durante o período válido"

## Próximos Passos

- [ ] Implementar notificações push para usuários próximos
- [ ] Adicionar sincronização com módulo Prices do Consumer
- [ ] Implementar guard de limite de ofertas por plano
- [ ] Adicionar job cron para desativar ofertas expiradas
- [ ] Implementar cache Redis para ofertas ativas
- [ ] Adicionar filtros avançados (categoria, desconto mínimo)
- [ ] Implementar duplicação de ofertas
- [ ] Adicionar preview de como a oferta aparecerá no app Consumer

## Testes

### Checklist de Testes

- [ ] Criar oferta com dados válidos
- [ ] Validar preço da oferta menor que original
- [ ] Validar período de datas
- [ ] Ativar/desativar oferta
- [ ] Editar oferta existente
- [ ] Deletar oferta
- [ ] Visualizar analytics
- [ ] Filtrar ofertas por status
- [ ] Verificar permissões por role
- [ ] Testar limites por plano
