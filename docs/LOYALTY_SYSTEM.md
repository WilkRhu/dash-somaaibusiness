# Sistema de Fidelidade Configurável

## Visão Geral

O sistema de pontos de fidelidade é totalmente configurável por estabelecimento. Cada estabelecimento pode:
- Habilitar/desabilitar o programa de fidelidade
- Definir quantos pontos são ganhos por real gasto
- Personalizar a experiência de fidelidade para seus clientes

## Configuração Padrão

Por padrão, todos os estabelecimentos são criados com:
- `loyaltyEnabled`: `true` (programa habilitado)
- `loyaltyPointsPerReal`: `0.1` (1 ponto a cada R$ 10 gastos)

## Interface do Usuário

### Informações Visuais para o Dono

O sistema fornece informações claras e educativas em vários pontos:

#### 1. Na Página de Detalhes do Estabelecimento

Antes mesmo de abrir o modal de configuração, o dono vê:
- **Card informativo azul** explicando o que é o programa de fidelidade
- **Status atual** (Ativo/Inativo) com badge visual
- **Taxa de pontos** configurada
- **Exemplo prático** de acúmulo (R$ 10,00 = X pontos)
- **Botão "Configurar"** para ajustar as configurações

#### 2. No Modal de Configuração

Ao abrir o modal, o dono encontra:

**Seção Informativa (topo):**
- Explicação de como funciona o programa
- Lista de benefícios:
  - Incentiva clientes a voltarem mais vezes
  - Aumenta o ticket médio das compras
  - Acúmulo automático - sem trabalho extra
  - Você controla a taxa de pontos

**Seção "Como funciona na prática" (rodapé):**
1. Cliente cadastrado faz uma compra no PDV
2. Sistema calcula automaticamente os pontos
3. Pontos são adicionados ao perfil do cliente
4. Cliente pode consultar seus pontos a qualquer momento
5. Você decide como os pontos podem ser usados (descontos, brindes, etc.)

### Acessar Configurações

1. Navegue até a página de **Estabelecimentos**
2. Clique no estabelecimento desejado para ver os detalhes
3. Clique no botão **Fidelidade** no topo da página
4. O modal de configuração será aberto

### Configurar Programa

No modal de configuração você pode:

1. **Ativar/Desativar o Programa**
   - Use o toggle no topo para habilitar ou desabilitar
   - Quando desativado, nenhum ponto será acumulado nas vendas

2. **Definir Taxa de Pontos**
   - Digite um valor entre 0 e 10
   - Representa quantos pontos o cliente ganha por real gasto
   - Exemplos são calculados automaticamente

3. **Usar Estratégias Pré-definidas**
   - **Programa Generoso**: 0.5 pontos/real (R$ 100 = 50 pontos)
   - **Programa Moderado**: 0.2 pontos/real (R$ 100 = 20 pontos)
   - **Programa Padrão**: 0.1 pontos/real (R$ 100 = 10 pontos)

### Visualizar Configuração Atual

Na página de detalhes do estabelecimento, você verá:
- Status do programa (Ativo/Inativo)
- Taxa de pontos configurada
- Exemplo de acúmulo (R$ 10,00 = X pontos)

## Endpoints da API

### 1. Obter Configuração Atual

```http
GET /business/establishments/:id/loyalty-settings
Authorization: Bearer {token}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "loyaltyEnabled": true,
    "loyaltyPointsPerReal": 0.1,
    "description": "0.1 pontos por real gasto",
    "example": "R$ 10,00 = 1 pontos"
  }
}
```

### 2. Atualizar Configuração

```http
PATCH /business/establishments/:id/loyalty-settings
Authorization: Bearer {token}
Content-Type: application/json

{
  "loyaltyEnabled": true,
  "loyaltyPointsPerReal": 0.2
}
```

**Parâmetros:**
- `loyaltyEnabled` (boolean, opcional): Habilitar/desabilitar programa
- `loyaltyPointsPerReal` (number, opcional): Pontos por real (0 a 10)

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "loyaltyEnabled": true,
    "loyaltyPointsPerReal": 0.2
  },
  "message": "Configuração de fidelidade atualizada com sucesso"
}
```

## Como Funciona

### 1. Cálculo Automático em Vendas

Quando uma venda é criada com `customerId`:
1. Sistema busca configuração do estabelecimento
2. Verifica se `loyaltyEnabled` está ativo
3. Calcula pontos: `Math.floor(total * loyaltyPointsPerReal)`
4. Adiciona pontos ao cliente automaticamente

**Exemplo:**
```javascript
// Venda de R$ 45,00 com loyaltyPointsPerReal = 0.1
const pontos = Math.floor(45 * 0.1); // 4 pontos
```

### 2. Atualização do Cliente

Os pontos são adicionados automaticamente na tabela `business_customers`:

```sql
UPDATE business_customers 
SET 
  totalSpent = totalSpent + 45.00,
  purchaseCount = purchaseCount + 1,
  loyaltyPoints = loyaltyPoints + 4,
  lastPurchaseDate = NOW()
WHERE id = 'customer-id'
```

## Exemplos de Configuração

### Exemplo 1: Programa Generoso
```json
{
  "loyaltyEnabled": true,
  "loyaltyPointsPerReal": 0.5
}
```
- Cliente ganha 5 pontos a cada R$ 10 gastos
- R$ 100 = 50 pontos

### Exemplo 2: Programa Moderado
```json
{
  "loyaltyEnabled": true,
  "loyaltyPointsPerReal": 0.2
}
```
- Cliente ganha 2 pontos a cada R$ 10 gastos
- R$ 100 = 20 pontos

### Exemplo 3: Programa Padrão
```json
{
  "loyaltyEnabled": true,
  "loyaltyPointsPerReal": 0.1
}
```
- Cliente ganha 1 ponto a cada R$ 10 gastos
- R$ 100 = 10 pontos

### Exemplo 4: Desabilitar Programa
```json
{
  "loyaltyEnabled": false
}
```
- Nenhum ponto será acumulado nas vendas

## Permissões

Apenas o **OWNER** do estabelecimento pode:
- Visualizar configuração de fidelidade
- Atualizar configuração de fidelidade

## Validações

- `loyaltyPointsPerReal` deve estar entre 0 e 10
- Valores negativos não são permitidos
- Apenas números decimais com até 3 casas decimais

## Considerações Importantes

1. **Mudanças não são retroativas**: Alterar a configuração afeta apenas vendas futuras
2. **Pontos são arredondados para baixo**: `Math.floor()` garante números inteiros
3. **Programa desabilitado**: Se `loyaltyEnabled = false`, nenhum ponto é adicionado
4. **Flexibilidade**: Cada estabelecimento pode ter sua própria estratégia de fidelidade

## Integração com Frontend

### Componentes Criados

1. **LoyaltySettingsModal** (`components/establishments/loyalty-settings-modal.tsx`)
   - Modal completo de configuração
   - Validações em tempo real
   - Exemplos de cálculo dinâmicos
   - Estratégias pré-definidas

### Tipos TypeScript

```typescript
interface LoyaltySettings {
  loyaltyEnabled: boolean;
  loyaltyPointsPerReal: number;
  description?: string;
  example?: string;
}

interface UpdateLoyaltySettingsDto {
  loyaltyEnabled?: boolean;
  loyaltyPointsPerReal?: number;
}
```

### Funções da API

```typescript
// Obter configuração
const settings = await establishmentsApi.getLoyaltySettings(establishmentId);

// Atualizar configuração
await establishmentsApi.updateLoyaltySettings(establishmentId, {
  loyaltyEnabled: true,
  loyaltyPointsPerReal: 0.15
});
```

## Fluxo de Uso

1. Usuário acessa página de Estabelecimentos
2. Clica no estabelecimento desejado
3. Visualiza configuração atual de fidelidade nos detalhes
4. Clica no botão "Fidelidade" para editar
5. Modal abre com configurações atuais
6. Usuário ajusta status e/ou taxa de pontos
7. Pode usar estratégias pré-definidas ou valor customizado
8. Salva as alterações
9. Sistema atualiza e mostra mensagem de sucesso
10. Detalhes do estabelecimento são atualizados automaticamente

## Troubleshooting

### Erro: "Pontos por real deve estar entre 0 e 10"
- Verifique se o valor está no intervalo permitido
- Use valores decimais como 0.1, 0.5, etc.

### Erro: "Erro ao carregar configurações de fidelidade"
- Verifique se você tem permissão de OWNER
- Confirme que o estabelecimento existe
- Verifique a conexão com a API

### Pontos não estão sendo acumulados
- Verifique se `loyaltyEnabled` está `true`
- Confirme que a venda tem um `customerId` associado
- Verifique se a taxa de pontos está configurada corretamente
