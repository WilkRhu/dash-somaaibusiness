import apiClient from './client';

export interface CreateTicketDto {
  subject: string;
  description: string;
  category?: 'sales' | 'technical' | 'billing' | 'general';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  contactPhone?: string;
  contactEmail?: string;
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  createdAt: string;
}

export const ticketsApi = {
  create: async (dto: CreateTicketDto): Promise<{ success: boolean; data: TicketResponse }> => {
    const response = await apiClient.post('/public/tickets', dto);
    return response.data;
  },
};