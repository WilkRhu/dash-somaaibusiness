// Hook para gerenciar notas fiscais

'use client';

import { useState, useCallback } from 'react';
import { fiscalApi } from '@/lib/api/fiscal';
import {
  FiscalNote,
  FiscalNoteFilters,
  FiscalNoteData,
  CorrectionData,
} from '@/lib/types/fiscal';

interface UseFiscalNotesOptions {
  filters?: FiscalNoteFilters;
  autoFetch?: boolean;
}

export function useFiscalNotes(options: UseFiscalNotesOptions = {}) {
  const { filters, autoFetch = true } = options;

  const [notes, setNotes] = useState<FiscalNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Buscar notas
  const fetchNotes = useCallback(
    async (customFilters?: FiscalNoteFilters) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fiscalApi.getNotes(customFilters || filters);
        setNotes(result.data);
        setPagination({
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        });
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'Erro ao buscar notas';
        setError(message);
        console.error('Erro ao buscar notas:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  // Emitir nota
  const emitNote = useCallback(async (data: FiscalNoteData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fiscalApi.emitNote(data);
      setNotes((prev) => [result, ...prev]);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao emitir nota';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Consultar nota específica
  const getNote = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fiscalApi.getNote(id);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao consultar nota';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cancelar nota
  const cancelNote = useCallback(async (id: string, reason: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fiscalApi.cancelNote(id, reason);
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? {
                ...note,
                status: 'cancelled' as const,
                cancellationReason: reason,
                cancelledAt: new Date(),
              }
            : note
        )
      );
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao cancelar nota';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Enviar por email
  const sendEmail = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fiscalApi.sendEmail(id);
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id ? { ...note, emailSent: true } : note
        )
      );
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao enviar email';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reenviar por email
  const resendEmail = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fiscalApi.resendEmail(id);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao reenviar email';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Baixar DANFE
  const downloadDanfe = useCallback(async (id: string, filename?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const blob = await fiscalApi.downloadDanfe(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `danfe-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao baixar DANFE';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Criar correção
  const createCorrection = useCallback(async (noteId: string, data: CorrectionData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fiscalApi.createCorrection(noteId, data);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao criar correção';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listar correções
  const getCorrections = useCallback(async (noteId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fiscalApi.getCorrections(noteId);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao buscar correções';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch
  const refetch = useCallback(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Auto-fetch ao montar
  React.useEffect(() => {
    if (autoFetch) {
      fetchNotes();
    }
  }, [autoFetch, fetchNotes]);

  return {
    notes,
    isLoading,
    error,
    pagination,
    fetchNotes,
    emitNote,
    getNote,
    cancelNote,
    sendEmail,
    resendEmail,
    downloadDanfe,
    createCorrection,
    getCorrections,
    refetch,
  };
}
