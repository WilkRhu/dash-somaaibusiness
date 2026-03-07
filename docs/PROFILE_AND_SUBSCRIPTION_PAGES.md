# Páginas de Perfil e Assinatura

## Visão Geral

Implementação completa das páginas de gerenciamento de perfil do usuário e visualização/upgrade de planos de assinatura.

## Páginas Criadas

### 1. Página de Planos (`/subscription`)

Exibe todos os planos disponíveis com comparação de recursos e permite upgrade.

#### Funcionalidades:
- ✅ Exibição do plano atual com destaque
- ✅ Status do trial (se aplicável)
- ✅ Aviso quando trial está próximo do fim (≤3 dias)
- ✅ Cards de planos com preços e recursos
- ✅ Destaque para plano recomendado
- ✅ Indicador visual do plano atual
- ✅ Tabela de comparação de recursos
- ✅ Botões de ação (Assinar/Falar com Vendas)
- ✅ Uso atual de estabelecimentos

#### Componentes:
```typescript
// Status do plano atual
<div className="bg-gradient-to-r from-brand-blue to-brand-green">
  <h2>Plano Atual: {status.currentPlan}</h2>
  {status.isOnTrial && (
    <p>{status.trialDaysRemaining} dias restantes</p>
  )}
</div>

// Cards de planos
{plans.map((plan) => (
  <div className={plan.recommended ? 'ring-2 ring-brand-blue' : ''}>
    <h3>{plan.name}</h3>
    <div>R$ {plan.price}/mês</div>
    <ul>{plan.features.map(...)}</ul>
    <button>Assinar Agora</button>
  </div>
))}
```

### 2. Página de Perfil (`/profile`)

Permite ao usuário gerenciar suas informações pessoais e segurança.

#### Funcionalidades:
- ✅ Upload de avatar (JPEG, PNG, WebP até 2MB)
- ✅ Edição de nome e telefone
- ✅ Exibição de email (não editável)
- ✅ Badge do plano atual
- ✅ Data de criação da conta
- ✅ Alteração de senha
- ✅ Validação de senhas
- ✅ Feedback visual durante uploads/salvamentos

#### Seções:
1. **Avatar e Informações Básicas**
   - Avatar circular com botão de upload
   - Nome, email e plano
   - Badge colorido por tipo de plano

2. **Informações Pessoais**
   - Nome completo (editável)
   - Telefone com máscara (editável)
   - Email (somente leitura)
   - Data de criação (somente leitura)

3. **Segurança**
   - Formulário de alteração de senha
   - Validação de senha atual
   - Confirmação de nova senha
   - Mínimo 6 caracteres

## APIs Criadas

### Subscription API (`lib/api/subscription.ts`)

```typescript
export const subscriptionApi = {
  // Buscar status do plano atual
  getStatus: async (): Promise<SubscriptionStatus>
  
  // Listar planos disponíveis
  getPlans: async (): Promise<PlanInfo[]>
}
```

### Profile API (`lib/api/profile.ts`)

```typescript
export const profileApi = {
  // Buscar perfil do usuário
  get: async (): Promise<UserProfile>
  
  // Atualizar perfil
  update: async (dto: UpdateProfileDto): Promise<UserProfile>
  
  // Upload de avatar
  uploadAvatar: async (file: File): Promise<{ avatar: string }>
  
  // Alterar senha
  changePassword: async (currentPassword: string, newPassword: string): Promise<void>
}
```

## Integração com Backend

### Endpoints Utilizados

#### Subscription
- `GET /api/business/subscription/status` - Status do plano
- `GET /api/business/subscription/plans` - Listar planos

#### Profile
- `GET /auth/me` - Dados do usuário
- `PATCH /auth/profile` - Atualizar perfil
- `POST /auth/avatar` - Upload de avatar
- `POST /auth/change-password` - Alterar senha

## Navegação

Os links foram adicionados ao sidebar:

```typescript
{ 
  href: '/subscription', 
  label: 'Planos',
  icon: <StarIcon />
},
{ 
  href: '/profile', 
  label: 'Perfil',
  icon: <UserIcon />
}
```

## Validações

### Upload de Avatar
- Tipos permitidos: JPEG, JPG, PNG, WebP
- Tamanho máximo: 2MB
- Preview antes do upload
- Feedback visual durante upload

### Alteração de Senha
- Senha atual obrigatória
- Nova senha mínimo 6 caracteres
- Confirmação deve coincidir
- Feedback de sucesso/erro

### Edição de Perfil
- Nome obrigatório
- Telefone com máscara automática
- Email não editável
- Sincronização com store de autenticação

## Fluxo de Trial

### Banner de Trial Ativo
```typescript
if (status.isOnTrial && status.trialDaysRemaining > 0) {
  // Mostrar banner informativo
  "🎉 Você está em período de teste!"
  "{trialDaysRemaining} dias restantes"
}
```

### Aviso de Expiração
```typescript
if (status.isOnTrial && status.trialDaysRemaining <= 3) {
  // Mostrar aviso amarelo
  "⚠️ Seu período de teste termina em X dias"
  "Escolha um plano para continuar"
}
```

### Trial Expirado
```typescript
if (!status.isOnTrial && status.currentPlan === 'FREE') {
  // Usuário voltou para FREE
  // Limites reduzidos aplicados
}
```

## Badges de Plano

Cores por tipo de plano:

```typescript
const getPlanBadgeColor = (plan: string) => {
  switch (plan) {
    case 'ENTERPRISE': return 'bg-purple-100 text-purple-800';
    case 'PREMIUM': return 'bg-blue-100 text-blue-800';
    case 'BASIC': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800'; // FREE
  }
};
```

## Responsividade

Ambas as páginas são totalmente responsivas:

- **Desktop**: Grid de 4 colunas para planos, 2 colunas para formulários
- **Tablet**: Grid de 2 colunas para planos, 2 colunas para formulários
- **Mobile**: 1 coluna para tudo, stack vertical

## Estados de Loading

### Página de Planos
```typescript
if (loading) {
  return <LoadingSpinner message="Carregando..." />;
}
```

### Ações Assíncronas
- `saving` - Salvando perfil
- `uploadingAvatar` - Upload de avatar
- `changingPassword` - Alterando senha

## Mensagens de Feedback

Todas as ações fornecem feedback via toast:

```typescript
// Sucesso
addToast({ type: 'success', message: 'Perfil atualizado!' });

// Erro
addToast({ type: 'error', message: 'Erro ao atualizar' });
```

## Próximos Passos

### Integração de Pagamento
- [ ] Integrar Stripe/PagSeguro
- [ ] Implementar checkout de planos
- [ ] Webhook para confirmação de pagamento
- [ ] Atualização automática do plano

### Funcionalidades Adicionais
- [ ] Histórico de faturas
- [ ] Cancelamento de assinatura
- [ ] Downgrade de plano
- [ ] Cupons de desconto
- [ ] Período de teste estendido

### Perfil
- [ ] Autenticação de dois fatores (2FA)
- [ ] Histórico de atividades
- [ ] Preferências de notificação
- [ ] Exportar dados (LGPD)

## Exemplo de Uso

### Acessar Página de Planos
```
/subscription
```

### Acessar Perfil
```
/profile
```

### Verificar Status do Trial
```typescript
const status = await subscriptionApi.getStatus();

if (status.isOnTrial) {
  console.log(`Trial expira em ${status.trialDaysRemaining} dias`);
}
```

### Atualizar Perfil
```typescript
await profileApi.update({
  name: 'João Silva',
  phone: '(11) 98765-4321'
});
```

### Upload de Avatar
```typescript
const file = event.target.files[0];
const result = await profileApi.uploadAvatar(file);
console.log('Novo avatar:', result.avatar);
```

## Testes Recomendados

1. ✅ Visualizar planos sem trial
2. ✅ Visualizar planos com trial ativo
3. ✅ Visualizar planos com trial expirando (≤3 dias)
4. ✅ Upload de avatar válido
5. ✅ Upload de arquivo inválido (tipo/tamanho)
6. ✅ Editar nome e telefone
7. ✅ Alterar senha com sucesso
8. ✅ Alterar senha com senha atual incorreta
9. ✅ Alterar senha com confirmação diferente
10. ✅ Navegação entre páginas via sidebar
