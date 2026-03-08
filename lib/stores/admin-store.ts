import { create } from 'zustand';
import { adminApi } from '@/lib/api/admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Ticket {
  id: string;
  ticketId: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  userId: string;
  userName?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface Log {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source: string;
  userId?: string;
  userName?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

interface SystemInfo {
  version: string;
  uptime: number;
  memory: {
    total: number;
    used: number;
    free: number;
  };
  cpu: number;
  disk: {
    total: number;
    used: number;
    free: number;
  };
}

interface AdminStats {
  totalUsers: number;
  totalTickets: number;
  openTickets: number;
  totalEstablishments: number;
  activeSubscriptions: number;
  revenue: number;
}

interface AdminStore {
  // Dashboard
  stats: AdminStats | null;
  isLoadingStats: boolean;
  fetchStats: () => Promise<void>;

  // Users
  users: User[];
  isLoadingUsers: boolean;
  usersPage: number;
  usersTotalPages: number;
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  createUser: (data: { name: string; email: string; password: string; role?: string }) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // Tickets
  tickets: Ticket[];
  isLoadingTickets: boolean;
  ticketsPage: number;
  ticketsTotalPages: number;
  ticketStats: { open: number; pending: number; resolved: number; closed: number } | null;
  fetchTickets: (filters?: { status?: string; priority?: string; page?: number }) => Promise<void>;
  fetchTicketStats: () => Promise<void>;
  updateTicketStatus: (id: string, status: string) => Promise<void>;
  assignTicket: (id: string, assignedTo: string) => Promise<void>;

  // Logs
  logs: Log[];
  isLoadingLogs: boolean;
  logsPage: number;
  logsTotalPages: number;
  fetchLogs: (filters?: { level?: string; source?: string; page?: number }) => Promise<void>;

  // System
  systemInfo: SystemInfo | null;
  isLoadingSystem: boolean;
  fetchSystemInfo: () => Promise<void>;
  clearLogs: (daysToKeep?: number) => Promise<void>;
  createBackup: () => Promise<void>;
  restartService: (serviceName: string) => Promise<void>;

  // Reports
  reports: Array<{ id: string; type: string; createdAt: string; status: string }>;
  isLoadingReports: boolean;
  fetchReports: () => Promise<void>;
  generateReport: (type: string, period: string) => Promise<void>;

  // Common
  error: string | null;
  clearError: () => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  // Dashboard
  stats: null,
  isLoadingStats: false,
  fetchStats: async () => {
    set({ isLoadingStats: true, error: null });
    try {
      const data = await adminApi.getStats();
      set({ stats: data, isLoadingStats: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar estatísticas';
      set({ error: message, isLoadingStats: false });
    }
  },

  // Users
  users: [],
  isLoadingUsers: false,
  usersPage: 1,
  usersTotalPages: 1,
  fetchUsers: async (page = 1, limit = 10) => {
    set({ isLoadingUsers: true, error: null });
    try {
      const result = await adminApi.getUsers(page, limit);
      set({ 
        users: result.users, 
        usersPage: result.page, 
        usersTotalPages: result.totalPages,
        isLoadingUsers: false 
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar usuários';
      set({ error: message, isLoadingUsers: false });
    }
  },
  createUser: async (data) => {
    set({ error: null });
    try {
      await adminApi.createUser(data);
      get().fetchUsers();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao criar usuário';
      set({ error: message });
      throw error;
    }
  },
  updateUser: async (id, data) => {
    set({ error: null });
    try {
      await adminApi.updateUser(id, data);
      get().fetchUsers();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar usuário';
      set({ error: message });
      throw error;
    }
  },
  deleteUser: async (id) => {
    set({ error: null });
    try {
      await adminApi.deleteUser(id);
      get().fetchUsers();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao deletar usuário';
      set({ error: message });
      throw error;
    }
  },

  // Tickets
  tickets: [],
  isLoadingTickets: false,
  ticketsPage: 1,
  ticketsTotalPages: 1,
  ticketStats: null,
  fetchTickets: async (filters) => {
    set({ isLoadingTickets: true, error: null });
    try {
      const data = await adminApi.getTickets(filters);
      set({ 
        tickets: data.tickets, 
        ticketsPage: data.page, 
        ticketsTotalPages: data.totalPages,
        isLoadingTickets: false 
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar tickets';
      set({ error: message, isLoadingTickets: false });
    }
  },
  fetchTicketStats: async () => {
    try {
      const data = await adminApi.getTicketStats();
      set({ ticketStats: data });
    } catch (error) {
      console.error('Erro ao carregar estatísticas de tickets:', error);
    }
  },
  updateTicketStatus: async (id, status) => {
    set({ error: null });
    try {
      await adminApi.updateTicketStatus(id, status);
      get().fetchTickets();
      get().fetchTicketStats();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar ticket';
      set({ error: message });
      throw error;
    }
  },
  assignTicket: async (id, assignedTo) => {
    set({ error: null });
    try {
      await adminApi.assignTicket(id, assignedTo);
      get().fetchTickets();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao atribuir ticket';
      set({ error: message });
      throw error;
    }
  },

  // Logs
  logs: [],
  isLoadingLogs: false,
  logsPage: 1,
  logsTotalPages: 1,
  fetchLogs: async (filters) => {
    set({ isLoadingLogs: true, error: null });
    try {
      const data = await adminApi.getLogs(filters);
      set({ 
        logs: data.logs, 
        logsPage: data.page, 
        logsTotalPages: data.totalPages,
        isLoadingLogs: false 
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar logs';
      set({ error: message, isLoadingLogs: false });
    }
  },

  // System
  systemInfo: null,
  isLoadingSystem: false,
  fetchSystemInfo: async () => {
    set({ isLoadingSystem: true, error: null });
    try {
      const data = await adminApi.getSystemInfo();
      set({ systemInfo: data, isLoadingSystem: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar informações do sistema';
      set({ error: message, isLoadingSystem: false });
    }
  },
  clearLogs: async (daysToKeep = 90) => {
    set({ error: null });
    try {
      await adminApi.clearLogs(daysToKeep);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao limpar logs';
      set({ error: message });
      throw error;
    }
  },
  createBackup: async () => {
    set({ error: null });
    try {
      await adminApi.createBackup();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao criar backup';
      set({ error: message });
      throw error;
    }
  },
  restartService: async (serviceName) => {
    set({ error: null });
    try {
      await adminApi.restartService(serviceName);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao reiniciar serviço';
      set({ error: message });
      throw error;
    }
  },

  // Reports
  reports: [],
  isLoadingReports: false,
  fetchReports: async () => {
    set({ isLoadingReports: true, error: null });
    try {
      const data = await adminApi.getRecentReports();
      set({ reports: data, isLoadingReports: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar relatórios';
      set({ error: message, isLoadingReports: false });
    }
  },
  generateReport: async (type, period) => {
    set({ error: null });
    try {
      await adminApi.generateReport(type, period);
      get().fetchReports();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao gerar relatório';
      set({ error: message });
      throw error;
    }
  },

  // Common
  error: null,
  clearError: () => set({ error: null }),
}));