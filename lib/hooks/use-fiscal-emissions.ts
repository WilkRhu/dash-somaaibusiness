// Hook para obter emissões dos últimos dias

'use client';

import { useState, useCallback, useEffect } from 'react';
import { fiscalApi } from '@/lib/api/fiscal';
import { useFiscalNotes } from './use-fiscal-notes';

interface EmissionData {
  date: string;
  dayOfWeek: string;
  count: number;
}

interface EmissionsReport {
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
}

export function useFiscalEmissions(days: number = 7) {
  const [emissions, setEmissions] = useState<EmissionData[]>([]);
  const [report, setReport] = useState<EmissionsReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notes } = useFiscalNotes({ autoFetch: false });

  // Calcular emissões a partir das notas
  const calculateEmissionsFromNotes = useCallback(() => {
    const emissionMap = new Map<string, number>();

    // Inicializar últimos N dias
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      emissionMap.set(dateStr, 0);
    }

    // Contar notas por dia
    notes.forEach((note) => {
      const noteDate = new Date(note.createdAt).toISOString().split('T')[0];
      if (emissionMap.has(noteDate)) {
        emissionMap.set(noteDate, (emissionMap.get(noteDate) || 0) + 1);
      }
    });

    // Converter para array
    const result: EmissionData[] = [];
    emissionMap.forEach((count, dateStr) => {
      const date = new Date(dateStr + 'T00:00:00');
      const dayOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][date.getDay()];
      result.push({
        date: dateStr,
        dayOfWeek,
        count,
      });
    });

    return result;
  }, [days, notes]);

  // Buscar emissões
  const fetchEmissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fiscalApi.getEmissionsLastDays(days);
      setReport(result);
      setEmissions(
        result.dailyBreakdown.map((d) => ({
          date: d.date,
          dayOfWeek: d.dayOfWeek,
          count: d.count,
        }))
      );
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Erro ao buscar emissões';
      setError(message);
      console.error('Erro ao buscar emissões:', err);
      
      // Fallback: usar dados calculados das notas
      const calculatedEmissions = calculateEmissionsFromNotes();
      setEmissions(calculatedEmissions);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [days, calculateEmissionsFromNotes]);

  // Refetch
  const refetch = useCallback(() => {
    fetchEmissions();
  }, [fetchEmissions]);

  // Auto-fetch ao montar
  useEffect(() => {
    fetchEmissions();
  }, [fetchEmissions]);

  return {
    emissions,
    report,
    isLoading,
    error,
    fetchEmissions,
    refetch,
  };
}
