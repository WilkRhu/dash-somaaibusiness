import apiClient from './client';
import {
  FiscalCertificate,
  FiscalNote,
  FiscalNoteFilters,
  FiscalNoteData,
  FiscalMetrics,
  FiscalCorrection,
  FiscalContingencyNote,
  FiscalDisablement,
  CorrectionData,
} from '@/lib/types/fiscal';

export interface UploadCertificateDto {
  certificateBase64: string;
  password: string;
}

export interface EmitFiscalNoteDto {
  establishmentId: string;
  saleId: string;
  customerId?: string;
  items: Array<{
    productId: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  paymentMethod: string;
  type: 'NFCE' | 'NFE';
}

const BASE = '/api/business/fiscal';

export const fiscalApi = {
  // Certificados
  uploadCertificate: async (dto: UploadCertificateDto): Promise<FiscalCertificate> => {
    const { data } = await apiClient.post<FiscalCertificate>(`${BASE}/certificate/upload`, dto);
    return data;
  },

  getCertificate: async (): Promise<FiscalCertificate> => {
    const { data } = await apiClient.get<FiscalCertificate>(`${BASE}/certificate`);
    return data;
  },

  validateCertificate: async (): Promise<{ valid: boolean; message?: string }> => {
    const { data } = await apiClient.post<{ valid: boolean; message?: string }>(`${BASE}/certificate/validate`);
    return data;
  },

  // Notas fiscais
  emit: async (dto: EmitFiscalNoteDto): Promise<FiscalNote> => {
    const { data } = await apiClient.post<FiscalNote>(`${BASE}/notes/emit`, dto);
    return data;
  },

  emitNote: async (noteData: FiscalNoteData): Promise<FiscalNote> => {
    const { data } = await apiClient.post<FiscalNote>(`${BASE}/notes`, noteData);
    return data;
  },

  getNotes: async (filters?: FiscalNoteFilters): Promise<{ data: FiscalNote[]; total: number; page: number; limit: number }> => {
    const { data } = await apiClient.get(`${BASE}/notes`, { params: filters });
    return data;
  },

  getNote: async (id: string): Promise<FiscalNote> => {
    const { data } = await apiClient.get<FiscalNote>(`${BASE}/notes/${id}`);
    return data;
  },

  getById: async (noteId: string): Promise<FiscalNote> => {
    const { data } = await apiClient.get<FiscalNote>(`${BASE}/notes/${noteId}`);
    return data;
  },

  cancelNote: async (id: string, reason: string): Promise<FiscalNote> => {
    const { data } = await apiClient.post<FiscalNote>(`${BASE}/notes/${id}/cancel`, { reason });
    return data;
  },

  cancel: async (noteId: string, reason: string): Promise<FiscalNote> => {
    const { data } = await apiClient.post<FiscalNote>(`${BASE}/notes/${noteId}/cancel`, { reason });
    return data;
  },

  sendEmail: async (id: string): Promise<{ sent: boolean }> => {
    const { data } = await apiClient.post<{ sent: boolean }>(`${BASE}/notes/${id}/send-email`);
    return data;
  },

  resendEmail: async (id: string): Promise<{ sent: boolean }> => {
    const { data } = await apiClient.post<{ sent: boolean }>(`${BASE}/notes/${id}/resend-email`);
    return data;
  },

  downloadDanfe: async (id: string): Promise<Blob> => {
    const { data } = await apiClient.get(`${BASE}/notes/${id}/danfe`, { responseType: 'blob' });
    return data;
  },

  // Correções
  createCorrection: async (noteId: string, correctionData: CorrectionData): Promise<FiscalCorrection> => {
    const { data } = await apiClient.post<FiscalCorrection>(`${BASE}/notes/${noteId}/corrections`, correctionData);
    return data;
  },

  getCorrections: async (noteId: string): Promise<FiscalCorrection[]> => {
    const { data } = await apiClient.get<FiscalCorrection[]>(`${BASE}/notes/${noteId}/corrections`);
    return data;
  },

  // Métricas
  getMetrics: async (): Promise<FiscalMetrics> => {
    const { data } = await apiClient.get<FiscalMetrics>(`${BASE}/metrics`);
    return data;
  },

  // Relatórios
  getNotesReport: async (params: { startDate?: string; endDate?: string; status?: string }): Promise<Blob> => {
    const { data } = await apiClient.get(`${BASE}/reports/notes`, { params, responseType: 'blob' });
    return data;
  },

  getSalesNotesReport: async (params: { startDate?: string; endDate?: string }): Promise<any> => {
    const { data } = await apiClient.get(`${BASE}/reports/sales-notes`, { params });
    return data;
  },

  getEmissionsLastDays: async (days: number): Promise<any> => {
    const { data } = await apiClient.get(`${BASE}/metrics/emissions`, { params: { days } });
    return data;
  },

  // Contingência
  getContingencyNotes: async (params?: any): Promise<FiscalContingencyNote[]> => {
    const { data } = await apiClient.get<FiscalContingencyNote[]>(`${BASE}/contingency`, { params });
    return data;
  },

  transmitContingencyNote: async (id: string): Promise<FiscalContingencyNote> => {
    const { data } = await apiClient.post<FiscalContingencyNote>(`${BASE}/contingency/${id}/transmit`);
    return data;
  },

  // Inutilizações
  getDisablements: async (params?: any): Promise<FiscalDisablement[]> => {
    const { data } = await apiClient.get<FiscalDisablement[]>(`${BASE}/disablements`, { params });
    return data;
  },
};
