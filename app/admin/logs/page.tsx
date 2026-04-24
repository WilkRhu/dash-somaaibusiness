'use client';

import { useEffect, useState } from 'react';
import { useAdminStore } from '@/lib/stores/admin-store';

const logLevels = [
  { value: '', label: 'Todos' },
  { value: 'info', label: 'Info' },
  { value: 'warn', label: 'Aviso' },
  { value: 'error', label: 'Erro' },
  { value: 'debug', label: 'Debug' },
];

const logSources = [
  { value: '', label: 'Todas' },
  { value: 'login', label: 'Login' },
  { value: 'purchase', label: 'Compra Criada' },
  { value: 'ocr_processed', label: 'OCR Processado' },
  { value: 'ocr_error', label: 'Erro OCR' },
  { value: 'profile_updated', label: 'Perfil Atualizado' },
  { value: 'plan_updated', label: 'Plano Atualizado' },
  { value: 'payment_approved', label: 'Pagamento Aprovado' },
  { value: 'payment_failed', label: 'Pagamento Falhou' },
  { value: 'system_error', label: 'Erro do Sistema' },
];

export default function LogsPage() {
  const { logs, fetchLogs, isLoadingLogs, logsPage, logsTotalPages } = useAdminStore();
  const [levelFilter, setLevelFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedLog, setSelectedLog] = useState<typeof logs[0] | null>(null);

  useEffect(() => {
    fetchLogs({ 
      level: levelFilter || undefined, 
      source: sourceFilter || undefined,
    });
  }, [fetchLogs, levelFilter, sourceFilter]);

  const handleFilter = () => {
    fetchLogs({ 
      level: levelFilter || undefined, 
      source: sourceFilter || undefined,
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-500 bg-red-50';
      case 'warn': return 'text-yellow-500 bg-yellow-50';
      case 'debug': return 'text-blue-500 bg-blue-50';
      default: return 'text-green-500 bg-green-50';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Logs do Sistema</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nível</label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {logLevels.map((level) => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ação</label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {logSources.map((source) => (
                <option key={source.value} value={source.value}>{source.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Filtrar
          </button>
        </div>
      </div>

      {isLoadingLogs ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nível</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ação</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensagem</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {logSources.find(s => s.value === log.source)?.label || log.source}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">{log.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.userName || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <span className="text-sm text-gray-500">
              Página {logsPage} de {logsTotalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => fetchLogs({ level: levelFilter || undefined, source: sourceFilter || undefined, page: logsPage - 1 })}
                disabled={logsPage === 1}
                className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                onClick={() => fetchLogs({ level: levelFilter || undefined, source: sourceFilter || undefined, page: logsPage + 1 })}
                disabled={logsPage === logsTotalPages}
                className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">Detalhes do Log</h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-mono text-sm">{selectedLog.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nível</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(selectedLog.level)}`}>
                    {selectedLog.level}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ação</p>
                  <p className="text-sm">{logSources.find(s => s.value === selectedLog.source)?.label || selectedLog.source}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data</p>
                  <p className="text-sm">{new Date(selectedLog.timestamp).toLocaleString('pt-BR')}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Mensagem</p>
                  <p className="text-sm mt-1">{selectedLog.message}</p>
                </div>
                {selectedLog.metadata && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Metadata</p>
                    <pre className="bg-gray-100 rounded-lg p-3 mt-1 text-xs overflow-x-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}