# Painel Admin - Itens e Rotas de Integração

## Visão Geral

O painel administrativo do SomaAI oferece funcionalidades completas para gestão de usuários, tickets, logs, relatórios e administração do sistema.

---

## Rotas do Painel Admin

| Rota | Descrição | Componente |
|------|-----------|------------|
| `/admin` | Dashboard principal | `AdminPage` |
| `/admin/users` | Gestão de usuários | `UsersPage` |
| `/admin/tickets` | Gestão de tickets de suporte | `TicketsPage` |
| `/admin/logs` | Visualização de logs | `LogsPage` |
| `/admin/reports` | Relatórios e analytics | `ReportsPage` |
| `/admin/system` | Administração do sistema | `SystemPage` |

---

## Integração com API

### Autenticação

Todas as requisições requerem o token de autenticação no header:
```
Authorization: Bearer <token>
```

### Dashboard Admin

```typescript
// Estatísticas gerais do admin
api.getAdminStats(token)

// Dados do dashboard
api.getDashboardData(token)
api.getDashboardSummary(token, userId)
api.getDashboardTrends(token, userId, period)
api.getDashboardTypeStats(token, userId, period)
api.getDashboardRecentPurchases(token, userId, limit)
```

### Gestão de Usuários

```typescript
// Listar usuários com paginação
api.getUsers(token, page = 1, limit = 10)

// Criar novo usuário
api.createUser(token, userData: {
  name: string
  email: string
  password: string
  role?: string
})

// Atualizar usuário
api.updateUser(token, userId, userData: {
  name?: string
  email?: string
  role?: string
  isActive?: boolean
})

// Deletar usuário
api.deleteUser(token, userId)
```

### Tickets de Suporte

```typescript
// Listar tickets (admin)
api.getAdminTickets(token, filters?: {
  status?: string
  priority?: string
  assignedTo?: string
  dateFrom?: string
  dateTo?: string
})

// Estatísticas de tickets
api.getAdminTicketStats(token)

// Atualizar status do ticket
api.updateTicketStatus(token, ticketId, status: string)

// Atribuir ticket
api.assignTicket(token, ticketId, assignedTo: string)

// Adicionar mensagem como admin
api.addAdminTicketMessage(token, ticketId, message: string)

// Marcar como resolvido
api.markTicketResolved(token, ticketId)
```

### Relatórios

```typescript
// Gerar relatório
api.generateReport(token, reportType: string, period: string)

// Obter dados do relatório
api.getReportData(token, reportType: string, period: string)

// Relatórios recentes
api.getRecentReports(token, limit = 10)
```

### Logs

```typescript
// Todos os logs (admin)
api.getAllLogs(token, filters?: {
  level?: string
  source?: string
  dateFrom?: string
  dateTo?: string
  search?: string
})

// Logs de usuário específico
api.getUserLogs(token, userId, filters?: object)

// Meus logs
api.getMyLogs(token, filters?: object)
```

### Sistema

```typescript
// Informações do sistema
api.getSystemInfo(token)

// Status dos serviços
api.getSystemServices(token)

// Testar serviços
api.testSystemServices(token)

// Logs do sistema
api.getSystemLogs(token, filters?: object)

// Limpar logs antigos
api.clearSystemLogs(token, daysToKeep = 90)

// Criar backup
api.createSystemBackup(token)

// Reiniciar serviço
api.restartService(token, serviceName: string)
```

### Utilitários

```typescript
// Health check
api.healthCheck()

// OCR
api.extractOcrBase64(token, base64Image, options)
api.extractOcrReceiptBase64(token, base64Image)
```

---

## Estrutura de Componentes

```
src/app/admin/
├── page.tsx          # Dashboard principal
├── users/            # Gestão de usuários
├── tickets/          # Gestão de tickets
├── logs/             # Visualização de logs
├── reports/          # Relatórios
└── system/           # Administração do sistema

src/components/
├── AdminNavigation.tsx  # Navegação do painel
└── ...
```

---

## Modelos de Dados

### User
```typescript
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

### Ticket
```typescript
interface Ticket {
  id: string
  subject: string
  description: string
  status: 'open' | 'pending' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  userId: string
  assignedTo?: string
  messages: TicketMessage[]
  createdAt: string
  updatedAt: string
}
```

### Log
```typescript
interface Log {
  id: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  source: string
  userId?: string
  metadata?: Record<string, any>
  timestamp: string
}
```

### SystemInfo
```typescript
interface SystemInfo {
  version: string
  uptime: number
  memory: {
    total: number
    used: number
    free: number
  }
  cpu: number
  disk: {
    total: number
    used: number
    free: number
  }
}
```