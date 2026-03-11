'use client';

import { useState } from 'react';
import { showToast } from '@/components/ui/toast';

interface ExportNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'excel' | 'csv', filters: any) => Promise<void>;
  isLoading?: boolean;
}

export function ExportNotesModal({ isOpen, onClose, onExport, isLoading = false }: ExportNotesModalProps) {
  const [format, setFormat] = useState<'excel' | 'csv'>('excel');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    startDate: '',
    endDate: '',
  });

  const handleExport = async () => {
    if (!filters.startDate || !filters.endDate) {
      showToast('Selecione o período', 'error');
      return;
    }

    if (new Date(filters.startDate) > new Date(filters.endDate)) {
      showToast('Data inicial não pode ser maior que data final', 'error');
      return;
    }

    try {
      await onExport(format, filters);
      showToast(`Notas exportadas em ${format.toUpperCase()} com sucesso!`, 'success');
      onClose();
    } catch (error: any) {
      showToast(error.message || 'Erro ao exportar notas', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-brand-navy">Exportar Notas Fiscais</h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Formato */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="excel"
                  checked={format === 'excel'}
                  onChange={(e) => setFormat(e.target.value as 'excel' | 'csv')}
                  disabled={isLoading}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Excel (.xlsx)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="csv"
                  checked={format === 'csv'}
                  onChange={(e) => setFormat(e.target.value as 'excel' | 'csv')}
                  disabled={isLoading}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">CSV</span>
              </label>
            </div>
          </div>

          {/* Período */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50"
            >
              <option value="all">Todos</option>
              <option value="authorized">Autorizada</option>
              <option value="rejected">Rejeitada</option>
              <option value="cancelled">Cancelada</option>
              <option value="processing">Processando</option>
            </select>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50"
            >
              <option value="all">Todos</option>
              <option value="nfce">NFC-e</option>
              <option value="nfe">NF-e</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            disabled={isLoading || !filters.startDate || !filters.endDate}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
          >
            {isLoading ? 'Exportando...' : '📥 Exportar'}
          </button>
        </div>
      </div>
    </div>
  );
}
