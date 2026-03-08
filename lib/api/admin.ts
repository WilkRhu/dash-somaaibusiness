import apiClient from './client';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const adminApi = {
  // Dashboard
  getStats: async (): Promise<{
    totalUsers: number;
    totalTickets: number;
    openTickets: number;
    totalEstablishments: number;
    activeSubscriptions: number;
    revenue: number;
  }> => {
    const token = getToken();
    const { data } = await apiClient.get('/admin/users/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  // Users
  getUsers: async (page = 1, limit = 10) => {
    const token = getToken();
    const { data } = await apiClient.get(`/admin/users?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // O backend retorna um array direto, precisamos formatar
    const usersArray = Array.isArray(data) ? data : data.users || [];
    
    return {
      users: usersArray.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      })),
      page,
      totalPages: Math.ceil((usersArray.length || 1) / limit),
    };
  },

  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<void> => {
    const token = getToken();
    await apiClient.post('/admin/users', userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  updateUser: async (
    userId: string,
    userData: Partial<{ name: string; email: string; role: string; isActive: boolean }>
  ): Promise<void> => {
    const token = getToken();
    await apiClient.put(`/admin/users/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  deleteUser: async (userId: string): Promise<void> => {
    const token = getToken();
    await apiClient.delete(`/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Tickets
  getTickets: async (filters?: {
    status?: string;
    priority?: string;
    page?: number;
  }): Promise<{
    tickets: Array<{
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
    }>;
    page: number;
    totalPages: number;
  }> => {
    const token = getToken();
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.page) params.append('page', String(filters.page));

    const { data } = await apiClient.get(`/admin/tickets?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  getTicketStats: async (): Promise<{
    open: number;
    pending: number;
    resolved: number;
    closed: number;
  }> => {
    const token = getToken();
    const { data } = await apiClient.get('/admin/tickets/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  updateTicketStatus: async (ticketId: string, status: string): Promise<void> => {
    const token = getToken();
    await apiClient.patch(
      `/admin/tickets/${ticketId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  assignTicket: async (ticketId: string, assignedTo: string): Promise<void> => {
    const token = getToken();
    await apiClient.patch(
      `/admin/tickets/${ticketId}/assign`,
      { assignedTo },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  // Logs
  getLogs: async (filters?: {
    level?: string;
    source?: string;
    page?: number;
  }) => {
    const token = getToken();
    const params = new URLSearchParams();
    if (filters?.level) params.append('level', filters.level);
    if (filters?.source) params.append('source', filters.source);
    if (filters?.page) params.append('page', String(filters.page));

    const { data } = await apiClient.get(`/admin/system/logs?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // O backend pode retornar um array direto
    const logsArray = Array.isArray(data) ? data : data.logs || [];

    return {
      logs: logsArray.map((log: any) => ({
        id: log.id,
        level: log.level,
        message: log.message,
        source: log.source,
        userId: log.userId,
        userName: log.userName,
        metadata: log.metadata,
        timestamp: log.timestamp,
      })),
      page: filters?.page || 1,
      totalPages: Math.ceil((logsArray.length || 1) / 10),
    };
  },

  // System
  getSystemInfo: async (): Promise<{
    version: string;
    uptime: number;
    memory: { total: number; used: number; free: number };
    cpu: number;
    disk: { total: number; used: number; free: number };
  }> => {
    const token = getToken();
    const { data } = await apiClient.get('/admin/system/info', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  clearLogs: async (daysToKeep = 90): Promise<void> => {
    const token = getToken();
    await apiClient.delete(`/admin/system/logs?daysToKeep=${daysToKeep}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  createBackup: async (): Promise<void> => {
    const token = getToken();
    await apiClient.post('/admin/system/backup', undefined, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  restartService: async (serviceName: string): Promise<void> => {
    const token = getToken();
    await apiClient.post(
      `/admin/system/services/${serviceName}/restart`,
      undefined,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  // Reports
  getRecentReports: async (): Promise<
    Array<{
      id: string;
      type: string;
      createdAt: string;
      status: string;
    }>
  > => {
    const token = getToken();
    const { data } = await apiClient.get('/admin/reports', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },

  generateReport: async (type: string, period: string): Promise<void> => {
    const token = getToken();
    await apiClient.post(
      '/admin/reports/generate',
      { type, period },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },
};