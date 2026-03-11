// Serviço de API para o sistema fiscal

import axios from 'axios';
import {
  FiscalNote,
  FiscalCertificate,
  FiscalCorrection,
  FiscalDisablement,
  FiscalContingencyNote,
  FiscalMetrics,
  FiscalNoteFilters,
  FiscalNoteData,
  CorrectionData,
  DisablementData,
  CnpjLookupResult,
  CnpjValidationResult,
} from '@/lib/types/fiscal';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api`,
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fiscalApi = {
  // ==================== CERTIFICADOS ====================

  /**
   * Upload de certificado digital
   */
  uploadCertificate: async (data: {
    certificateBase64: string;
    password: string;
  }): Promise<FiscalCertificate> => {
    const response = await api.post('/business/fiscal/certificate/upload', data);
    return response.data;
  },

  /**
   * Consultar certificado atual
   */
  getCertificate: async (): Promise<FiscalCertificate> => {
    const response = await api.get('/business/fiscal/certificate');
    return response.data;
  },

  /**
   * Validar certificado
   */
  validateCertificate: async (): Promise<{
    valid: boolean;
    cnpj: string;
    holderName: string;
    expiresAt: string;
    daysUntilExpiration: number;
    isExpired: boolean;
    needsRenewal: boolean;
  }> => {
    const response = await api.get('/business/fiscal/certificate/validate');
    return response.data;
  },

  // ==================== NOTAS FISCAIS ====================

  /**
   * Emitir nota fiscal
   */
  emitNote: async (data: FiscalNoteData): Promise<FiscalNote> => {
    const response = await api.post('/business/fiscal/notes', data);
    return response.data;
  },

  /**
   * Listar notas fiscais
   */
  getNotes: async (filters?: FiscalNoteFilters): Promise<{
    data: FiscalNote[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const response = await api.get('/business/fiscal/notes', { params: filters });
    return response.data;
  },

  /**
   * Consultar nota fiscal específica
   */
  getNote: async (id: string): Promise<FiscalNote> => {
    const response = await api.get(`/business/fiscal/notes/${id}`);
    return response.data;
  },

  /**
   * Cancelar nota fiscal
   */
  cancelNote: async (id: string, reason: string): Promise<{
    id: string;
    status: string;
    cancellationReason: string;
    cancelledAt: string;
    message: string;
  }> => {
    const response = await api.delete(`/business/fiscal/notes/${id}`, {
      data: { reason },
    });
    return response.data;
  },

  /**
   * Enviar nota por email
   */
  sendEmail: async (id: string): Promise<{
    success: boolean;
    message: string;
    sentAt: string;
  }> => {
    const response = await api.post(`/business/fiscal/notes/${id}/send-email`);
    return response.data;
  },

  /**
   * Reenviar nota por email
   */
  resendEmail: async (id: string): Promise<{
    success: boolean;
    message: string;
    sentAt: string;
  }> => {
    const response = await api.post(`/business/fiscal/notes/${id}/resend-email`);
    return response.data;
  },

  /**
   * Baixar DANFE (PDF)
   */
  downloadDanfe: async (id: string): Promise<Blob> => {
    const response = await api.get(`/business/fiscal/notes/${id}/danfe`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // ==================== CARTAS DE CORREÇÃO ====================

  /**
   * Criar carta de correção
   */
  createCorrection: async (noteId: string, data: CorrectionData): Promise<FiscalCorrection> => {
    const response = await api.post(`/business/fiscal/notes/${noteId}/correction`, data);
    return response.data;
  },

  /**
   * Listar correções de uma nota
   */
  getCorrections: async (noteId: string): Promise<{
    data: FiscalCorrection[];
    total: number;
  }> => {
    const response = await api.get(`/business/fiscal/notes/${noteId}/corrections`);
    return response.data;
  },

  // ==================== INUTILIZAÇÃO ====================

  /**
   * Criar inutilização de numeração
   */
  createDisablement: async (data: DisablementData): Promise<FiscalDisablement> => {
    const response = await api.post('/business/fiscal/disablement', data);
    return response.data;
  },

  /**
   * Listar inutilizações
   */
  getDisablements: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    data: FiscalDisablement[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await api.get('/business/fiscal/disablement', { params });
    return response.data;
  },

  // ==================== RELATÓRIOS ====================

  /**
   * Relatório de notas
   */
  getNotesReport: async (params: {
    startDate: string;
    endDate: string;
    status?: string;
    type?: string;
    format?: 'json' | 'excel' | 'csv';
  }): Promise<any> => {
    const response = await api.get('/business/fiscal/reports/notes', { params });
    return response.data;
  },

  /**
   * Relatório de vendas vs notas
   */
  getSalesNotesReport: async (params: {
    startDate: string;
    endDate: string;
  }): Promise<{
    summary: {
      totalSales: number;
      salesWithNotes: number;
      salesWithoutNotes: number;
      complianceRate: number;
    };
    salesWithoutNotes: any[];
  }> => {
    const response = await api.get('/business/fiscal/reports/sales-notes', { params });
    return response.data;
  },

  // ==================== CONTINGÊNCIA ====================

  /**
   * Listar notas em contingência
   */
  getContingencyNotes: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    data: FiscalContingencyNote[];
    total: number;
    page: number;
    limit: number;
  }> => {
    const response = await api.get('/business/fiscal/contingency', { params });
    return response.data;
  },

  /**
   * Transmitir nota em contingência
   */
  transmitContingencyNote: async (id: string): Promise<{
    id: string;
    status: string;
    transmittedAt: string;
    fiscalNoteId: string;
    message: string;
  }> => {
    const response = await api.post(`/business/fiscal/contingency/${id}/transmit`);
    return response.data;
  },

  // ==================== MÉTRICAS ====================

  /**
   * Obter métricas fiscais
   */
  getMetrics: async (): Promise<FiscalMetrics> => {
    const response = await api.get('/business/fiscal/metrics');
    return response.data;
  },

  /**
   * Obter emissões dos últimos 7 dias
   */
  getEmissionsLastDays: async (days: number = 7): Promise<{
    period: {
      startDate: string;
      endDate: string;
      days: number;
    };
    summary: {
      totalEmissions: number;
      totalValue: number;
      averageValue: number;
      successRate: number;
    };
    byStatus: {
      authorized: number;
      rejected: number;
      cancelled: number;
      pending: number;
    };
    byType: {
      nfe: number;
      nfce: number;
      nfse: number;
    };
    dailyBreakdown: Array<{
      date: string;
      dayOfWeek: string;
      count: number;
      value: number;
      status: {
        authorized: number;
        rejected: number;
        cancelled: number;
        pending: number;
      };
    }>;
  }> => {
    try {
      const response = await api.get('/business/fiscal/reports/emissions', {
        params: { days },
      });
      return response.data;
    } catch (error: any) {
      // Fallback: retornar dados vazios se a rota não existir
      console.warn('Rota /business/fiscal/reports/emissions não disponível, usando fallback');
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - (days - 1));
      
      return {
        period: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: today.toISOString().split('T')[0],
          days,
        },
        summary: {
          totalEmissions: 0,
          totalValue: 0,
          averageValue: 0,
          successRate: 0,
        },
        byStatus: {
          authorized: 0,
          rejected: 0,
          cancelled: 0,
          pending: 0,
        },
        byType: {
          nfe: 0,
          nfce: 0,
          nfse: 0,
        },
        dailyBreakdown: Array.from({ length: days }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (days - 1 - i));
          const dayOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][date.getDay()];
          return {
            date: date.toISOString().split('T')[0],
            dayOfWeek,
            count: 0,
            value: 0,
            status: {
              authorized: 0,
              rejected: 0,
              cancelled: 0,
              pending: 0,
            },
          };
        }),
      };
    }
  },

  // ==================== CNPJ ====================

  /**
   * Consultar CNPJ
   */
  lookupCnpj: async (cnpj: string): Promise<CnpjLookupResult> => {
    const response = await api.get(`/business/fiscal/cnpj/${cnpj}`);
    return response.data;
  },

  /**
   * Validar CNPJ
   */
  validateCnpj: async (cnpj: string): Promise<CnpjValidationResult> => {
    const response = await api.get(`/business/fiscal/cnpj/${cnpj}/validate`);
    return response.data;
  },
};

export default fiscalApi;
