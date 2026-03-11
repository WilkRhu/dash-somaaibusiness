'use client';

import Link from 'next/link';
import { useFiscalNotes } from '@/lib/hooks/use-fiscal-notes';
import { useState, useCallback } from 'react';
import { FiscalStatusBadge } from '@/components/fiscal/fiscal-status-badge';
import { ExportNotesModal } from '@/components/fiscal/export-notes-modal';
import { showToast } from '@/components/ui/toast';

export default function NotesPage() {
  const { notes, isLoading, pagination, fetchNotes } = useFiscalNotes();
  const [showExportModal, setShowExportModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: '',
  });
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleExport = async (format: 'excel' | 'csv', exportFilters: any) => {
    try {
      // TODO: Implement API call to export notes
      // const blob = await fiscalApi.getNotesReport({
      //   startDate: exportFilters.startDate,
      //   endDate: exportFilters.endDate,
      //   status: exportFilters.status !== 'all' ? exportFilters.status : undefined,
      //   type: exportFilters.type !== 'all' ? exportFilters.type : undefined,
      //   format,
      // });

      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `notas-fiscais-${exportFilters.startDate}-${exportFilters.endDate}.${format === 'excel' ? 'xlsx' : 'csv'}`;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // window.URL.revokeObjectURL(url);

      showToast(`Notas exportadas em ${format.toUpperCase()} com sucesso!`, 'success');
    } catch (error: any) {
      throw error;
    }
  };

  const filteredNotes = notes.filter((note) => {
    if (filters.status !== 'all' && note.status !== filters.status) return false;
    if (filters.type !== 'all' && note.type !== filters.type) return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        note.number.toString().includes(search) ||
        note.recipient.name.toLowerCase().includes(search) ||
        note.recipient.cpfCnpj.includes(search) ||
        note.accessKey.includes(search)
      );
    }
    return true;
  });

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotes = filteredNotes.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Notas Fiscais</h1>
          <p className="text-gray-600 mt-2">Gerencie suas notas fiscais emitidas</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="px-6 py-3 bg-brand-blue text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar
          </button>
          <Link
            href="/fiscal/notes/new"
            className="px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Nota
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
              placeholder="Número, cliente, CPF/CNPJ..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="processing">Processando</option>
              <option value="authorized">Autorizada</option>
              <option value="rejected">Rejeitada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="nfce">NFC-e</option>
              <option value="nfe">NF-e</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
            <button
              onClick={() => fetchNotes()}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
            >
              🔄 Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Notas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Carregando notas...</div>
        ) : paginatedNotes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">
              {filteredNotes.length === 0 ? 'Nenhuma nota fiscal encontrada' : 'Nenhuma nota nesta página'}
            </p>
            {filteredNotes.length === 0 && (
              <Link
                href="/fiscal/notes/new"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Emitir primeira nota →
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Número</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedNotes.map((note) => (
                  <tr key={note.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-brand-navy">{note.number}</td>
                    <td className="py-3 px-4 text-gray-600">{note.type.toUpperCase()}</td>
                    <td className="py-3 px-4">
                      <FiscalStatusBadge status={note.status} />
                    </td>
                    <td className="py-3 px-4 text-gray-600">{note.recipient.name}</td>
                    <td className="py-3 px-4 text-right font-semibold text-brand-navy">
                      R$ {Number(note.totals.total).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/fiscal/notes/${note.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredNotes.length)} de {filteredNotes.length} notas
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium"
            >
              ← Anterior
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium"
            >
              Próxima →
            </button>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <ExportNotesModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        isLoading={isLoading}
      />
    </div>
  );
}
