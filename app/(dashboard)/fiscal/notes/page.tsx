'use client';

import Link from 'next/link';
import { useFiscalNotes } from '@/lib/hooks/use-fiscal-notes';
import { useState } from 'react';

export default function NotesPage() {
  const { notes, isLoading, pagination, fetchNotes } = useFiscalNotes();
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
  });

  const filteredNotes = notes.filter((note) => {
    if (filters.status !== 'all' && note.status !== filters.status) return false;
    if (filters.type !== 'all' && note.type !== filters.type) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Notas Fiscais</h1>
          <p className="text-gray-600 mt-2">Gerencie suas notas fiscais emitidas</p>
        </div>
        <Link
          href="/fiscal/notes/new"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          ➕ Nova Nota
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
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
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
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
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
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
        ) : filteredNotes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">Nenhuma nota fiscal encontrada</p>
            <Link
              href="/fiscal/notes/new"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Emitir primeira nota →
            </Link>
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
                {filteredNotes.map((note) => (
                  <tr key={note.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-brand-navy">{note.number}</td>
                    <td className="py-3 px-4 text-gray-600">{note.type.toUpperCase()}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          note.status === 'authorized'
                            ? 'bg-green-100 text-green-800'
                            : note.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : note.status === 'cancelled'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {note.status}
                      </span>
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
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={pagination.page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span className="text-gray-600">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
