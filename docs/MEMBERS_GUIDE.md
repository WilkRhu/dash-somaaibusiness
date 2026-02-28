# Guia de Gerenciamento de Funcionários

## Visão Geral

O sistema de gerenciamento de funcionários permite adicionar, remover e gerenciar permissões de colaboradores no estabelecimento. Cada funcionário possui um cargo (role) que define suas permissões no sistema.

## Acessando a Área de Funcionários

1. Faça login no sistema
2. No menu lateral, clique em "Funcionários"
3. Você verá a lista de todos os funcionários cadastrados

## Cargos e Permissões

### 👑 Proprietário (business_owner)
- Todas as permissões do sistema
- Gerenciar membros
- Deletar estabelecimento
- Atualizar configurações
- Ver relatórios completos
- Registrar vendas
- Gerenciar estoque
- **Não pode ser removido ou ter cargo alterado**

### 🔧 Administrador (business_admin)
- Gerenciar membros
- Atualizar configurações
- Ver relatórios completos
- Registrar vendas
- Gerenciar estoque

### 💰 Vendedor (business_sales)
- Registrar vendas
- Ver suas próprias vendas
- Acesso ao PDV (Ponto de Venda)

### 📦 Estoquista (business_stock)
- Gerenciar estoque
- Ver produtos
- Adicionar/editar produtos
- Atualizar quantidades

### 📊 Marketing (business_marketing)
- Ver relatórios (somente leitura)
- Visualizar estatísticas de vendas

## Como Adicionar um Funcionário

### Passo 1: Usuário precisa estar cadastrado
O funcionário precisa primeiro criar uma conta no sistema:
1. Acesse a página de registro
2. Preencha nome, email e senha
3. Confirme o cadastro

### Passo 2: Adicionar como membro
1. Na página de Funcionários, clique em "+ Adicionar Funcionário"
2. Informe o **ID do usuário** (UUID)
3. Selecione o **cargo** desejado
4. Clique em "Adicionar Funcionário"

> **Nota:** Para obter o ID do usuário, você pode:
> - Pedir ao usuário para verificar em seu perfil
> - Consultar o banco de dados (apenas administradores)
> - Usar a API de busca de usuários (se disponível)

## Como Alterar o Cargo de um Funcionário

1. Na lista de funcionários, localize o funcionário desejado
2. No campo "Cargo", selecione o novo cargo no dropdown
3. A alteração é salva automaticamente
4. Uma mensagem de confirmação será exibida

> **Importante:** O proprietário não pode ter seu cargo alterado

## Como Remover um Funcionário

1. Na lista de funcionários, localize o funcionário desejado
2. Clique no botão "Remover"
3. Confirme a ação no modal de confirmação
4. O funcionário será removido imediatamente

> **Importante:** O proprietário não pode ser removido

## Ver Permissões de um Cargo

1. Na lista de funcionários, clique em "Ver Permissões"
2. Um modal será exibido com todas as permissões do cargo
3. Clique em "Fechar" para voltar

## Integração com Vendas

Quando um funcionário com cargo de **Vendedor** registra uma venda:
- O sistema automaticamente associa a venda ao vendedor
- O nome do vendedor aparece nos relatórios
- É possível filtrar vendas por vendedor
- Útil para calcular comissões e metas

### Exemplo no PDV:
```
Venda #20260228-0045
Total: R$ 150,00
Vendedor: João Silva (automaticamente preenchido)
```

## Estrutura de Dados

### Member (Funcionário)
```typescript
{
  id: string;              // ID único do membro
  userId: string;          // ID do usuário
  role: MemberRole;        // Cargo
  isActive: boolean;       // Status ativo/inativo
  createdAt: string;       // Data de criação
  user: {
    id: string;
    name: string;
    email: string;
  }
}
```

### Roles Disponíveis
```typescript
type MemberRole = 
  | 'business_owner'
  | 'business_admin'
  | 'business_sales'
  | 'business_stock'
  | 'business_marketing';
```

## API Endpoints

### Listar Funcionários
```
GET /business/establishments/:id/members
```

### Adicionar Funcionário
```
POST /business/establishments/:id/members
Body: { userId: string, role: MemberRole }
```

### Remover Funcionário
```
DELETE /business/establishments/:id/members/:userId
```

### Atualizar Cargo
```
PATCH /business/establishments/:id/members/:userId/role
Body: { role: MemberRole }
```

## Casos de Uso Comuns

### 1. Adicionar um Vendedor
```
1. Vendedor cria conta no sistema
2. Administrador adiciona como membro com cargo "Vendedor"
3. Vendedor pode acessar o PDV e registrar vendas
4. Vendas ficam associadas ao vendedor automaticamente
```

### 2. Promover Vendedor a Administrador
```
1. Na lista de funcionários, localize o vendedor
2. Altere o cargo de "Vendedor" para "Administrador"
3. O funcionário agora tem acesso a todas as funcionalidades administrativas
```

### 3. Adicionar Estoquista
```
1. Estoquista cria conta no sistema
2. Administrador adiciona como membro com cargo "Estoquista"
3. Estoquista pode gerenciar produtos e estoque
4. Não tem acesso a vendas ou relatórios
```

### 4. Remover Funcionário que Saiu
```
1. Localize o funcionário na lista
2. Clique em "Remover"
3. Confirme a ação
4. O funcionário não terá mais acesso ao estabelecimento
```

## Dicas e Boas Práticas

1. **Princípio do Menor Privilégio**: Dê apenas as permissões necessárias para cada funcionário

2. **Revise Periodicamente**: Verifique regularmente a lista de funcionários e remova quem não trabalha mais

3. **Documente IDs**: Mantenha uma planilha com os IDs dos usuários para facilitar a adição

4. **Treine os Funcionários**: Certifique-se de que cada funcionário sabe usar as funcionalidades do seu cargo

5. **Use Cargos Apropriados**: 
   - Vendedores → business_sales
   - Gerentes → business_admin
   - Estoquistas → business_stock
   - Analistas → business_marketing

## Solução de Problemas

### Erro: "Usuário não encontrado"
- Verifique se o ID do usuário está correto
- Confirme que o usuário criou uma conta no sistema

### Erro: "Permissão negada"
- Apenas proprietários e administradores podem gerenciar membros
- Verifique se você está logado com a conta correta

### Funcionário não aparece na lista
- Atualize a página
- Verifique se o funcionário foi adicionado ao estabelecimento correto

### Não consigo alterar cargo do proprietário
- Isso é intencional por segurança
- O proprietário sempre mantém todas as permissões

## Próximas Funcionalidades

Funcionalidades planejadas para o futuro:

- 📧 Convites por email (sem precisar do ID)
- 📊 Relatório de desempenho por vendedor
- 💰 Sistema de comissões
- 🎯 Metas de vendas por funcionário
- ⏰ Controle de horários e turnos
- 📝 Histórico de atividades dos funcionários

## Suporte

Para mais informações, consulte:
- [API Contract](./MEMBERS_API.md) - Documentação técnica da API
- [Frontend Guide](./FRONTEND_GUIDE.md) - Guia de desenvolvimento frontend
- [State Management](./STATE_MANAGEMENT.md) - Gerenciamento de estado
