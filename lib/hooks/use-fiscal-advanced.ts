// Hook para funcionalidades avançadas do sistema fiscal

'use client';

import { useState, useCallback } from 'react';
import { fiscalApi } from '@/lib/api/fiscal';

export function useFiscalAdvanced() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Exportar notas
  const exportNotes = useCallback(
    async (params: {
      startDate: string;
      endDate: string;
      status?: string;
      type?: string;
      format: 'excel' | 'csv';
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fiscalApi.getNotesReport({
          startDate: params.startDate,
          endDate: params.endDate,
          status: params.status,
        });

        // Criar blob e download
        const blob = new Blob([response], {
          type: params.format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv',
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `notas-fiscais-${params.startDate}-${params.endDate}.${params.format === 'excel' ? 'xlsx' : 'csv'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return true;
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'Erro ao exportar notas';
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Obter relatório de vendas vs notas
  const getSalesNotesReport = useCallback(
    async (params: { startDate: string; endDate: string }) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fiscalApi.getSalesNotesReport(params);
        return result;
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'Erro ao obter relatório';
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Obter notas em contingência
  const getContingencyNotes = useCallback(async (params?: { page?: number; limit?: number }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fiscalApi.getContingencyNotes(params);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao obter notas em contingência';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Transmitir nota em contingência
  const transmitContingencyNote = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fiscalApi.transmitContingencyNote(id);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao transmitir nota';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obter inutilizações
  const getDisablements = useCallback(async (params?: { page?: number; limit?: number }) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fiscalApi.getDisablements(params);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao obter inutilizações';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    exportNotes,
    getSalesNotesReport,
    getContingencyNotes,
    transmitContingencyNote,
    getDisablements,
  };
}
