'use client';

import { FiscalNoteStatus, FiscalNoteType } from '@/lib/types/fiscal';

interface FiscalNoteFiltersProps {
  onFilter: (filters: FilterValues) => void;
  isLoading?: boolean;
}

export interface FilterValues {
  status: FiscalNoteStatus | 'all';
  type: FiscalNoteType | 'all';
  startDate: string;
  endDate: string;
}

export function FiscalNoteFilters({ onFilter, isLoading = false }: FiscalNoteFiltersProps) {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    onFilter({
      status: (formData.get('status') as FiscalNoteStatus | 'all') || 'all',
      type: (formData.get('type') as FiscalNoteType | 'all') || 'all',
      startDate: (formData.get('startDate') as string) || thirtyDaysAgo,
      endDate: (formData.get('endDate') as string) || today,
    });
  };

  return (
    <form onSubmit={handleFilter} className="bg-white rounded-lg shadow p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            defaultValue="all"
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50"
          >
            <option value="all">Todos</option>
            <option value="processing">Processando</option>
            <option value="authorized">Autorizada</option>
            <option value="rejected">Rejeitada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            name="type"
            defaultValue="all"
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50"
          >
            <option value="all">Todos</option>
            <option value="nfce">NFC-e</option>
            <option value="nfe">NF-e</option>
          </select>
        </div>

        {/* Data Inicial */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
          <input
            type="date"
            name="startDate"
            defaultValue={thirtyDaysAgo}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* Data Final */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
          <input
            type="date"
            name="endDate"
            defaultValue={today}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50"
          />
        </div>

        {/* Botão */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
          >
            {isLoading ? '🔄 Filtrando...' : '🔍 Filtrar'}
          </button>
        </div>
      </div>
    </form>
  );
}
