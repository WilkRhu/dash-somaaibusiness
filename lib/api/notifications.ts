import { getAuthToken } from '@/lib/auth/get-token';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 
    | 'plan_expiring'
    | 'plan_expired'
    | 'plan_renewed'
    | 'payment_failed'
    | 'upgrade_offer'
    | 'campaign';
  read: boolean;
  createdAt: string;
  data?: any;
}

const API_BASE = '/api/notifications';

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  
  // Se a resposta tem formato { success, data }, retorna apenas data
  if (data.success && data.data) {
    return data.data;
  }
  
  return data;
}

export const notificationsApi = {
  async getNotifications(limit: number = 50, offset: number = 0): Promise<Notification[]> {
    return fetchWithAuth(`${API_BASE}?limit=${limit}&offset=${offset}`);
  },

  async getUnreadCount(): Promise<number> {
    const response = await fetchWithAuth(`${API_BASE}/unread-count`);
    return response.count || 0;
  },

  async markAsRead(notificationId: string): Promise<void> {
    return fetchWithAuth(`${API_BASE}/${notificationId}/read`, {
      method: 'PATCH',
    });
  },

  async markAllAsRead(): Promise<void> {
    return fetchWithAuth(`${API_BASE}/mark-all-read`, {
      method: 'PATCH',
    });
  },

  async deleteNotification(notificationId: string): Promise<void> {
    return fetchWithAuth(`${API_BASE}/${notificationId}`, {
      method: 'DELETE',
    });
  },

  async deleteAllNotifications(): Promise<void> {
    return fetchWithAuth(`${API_BASE}`, {
      method: 'DELETE',
    });
  },
};
