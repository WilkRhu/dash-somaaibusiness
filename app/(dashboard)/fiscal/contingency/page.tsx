'use client';

import { useEffect, useState } from 'react';
import { useFiscalNotes } from '@/lib/hooks/use-fiscal-notes';
import { showToast } from '@/components/ui/toast';

interface ContingencyNote {
  id: string;
  documentType: 'nfce' | 'nfe';
  series: string;
  number: string;
  status: 'pending' | 'transmitted' | 'failed';
  contingencyReason: string;
  transmissionAttempts: number;
  lastTransmissionAttempt?: string;
  transmittedAt?: string;
  failureReason?: string;
  createdAt: string;
}

export default function ContingencyPage() {
  const { isLoading } = useFiscalNotes({ autoFetch: false });
  const [notes, setNotes] = useState<ContingencyNote[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [transmittingId, setTransmittingId] = useState<string | null>(null);

  useEffect(() => {
    loadContingencyNotes();
  }, []);

  const loadContingencyNotes = async () => {
    setIsLoadingNotes(true);
    try {
      // TODO: Implement API call to get contingency notes
      // const result = await fiscalApi.getContingencyNotes();
      // setNotes(result.data);

      // Mock data for now
      setNotes([]);
    } catch (error: any) {
      showToast(error.message || 'Erro ao carregar notas em contingência', 'error');
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const handleTransmit = async (id: string) => {
    setTransmittingId(id);
    try {
      // TODO: Implement API call to transmit contingency note
      // const result = await fiscalApi.transmitContingencyNote(id);

      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? {
                ...note,
                status: 'transmitted' as const,
                transmittedAt: new Date().toISOString(),
              }
            : note
        )
      );

      showToast('Nota transmitida com sucesso!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Erro ao transmitir nota', 'error');
    } finally {
      setTransmittingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'transmitted':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'transmitted':
        return 'Transmitida';
      case 'failed':
        return 'Falha';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Contingência</h1>
          <p className="text-gray-600 mt-2">Gerencie notas em modo de contingência</p>
        </div>
        <button
          onClick={loadContingencyNotes}
          disabled={isLoadingNotes}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
        >
          🔄 Atualizar
        </button>
      </div>

      {/* Info Alert */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Modo de Contingência:</strong> Quando a Receita Federal está indisponível, as notas são emitidas em modo de contingência e devem ser transmitidas assim que o serviço for restaurado.
        </p>
      </div>

      {/* Tabela de Notas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoadingNotes ? (
          <div className="p-8 text-center text-gray-500">Carregando notas em contingência...</div>
        ) : notes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-2">Nenhuma nota em contingência</p>
            <p className="text-sm text-gray-400">Todas as notas foram transmitidas com sucesso</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Número</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Motivo</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tentativas</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Criada em</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr key={note.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-brand-navy">
                      {note.series}/{note.number}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{note.documentType.toUpperCase()}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(note.status)}`}>
                        {getStatusLabel(note.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{note.contingencyReason}</td>
                    <td className="py-3 px-4 text-gray-600">{note.transmissionAttempts}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {note.status === 'pending' && (
                        <button
                          onClick={() => handleTransmit(note.id)}
                          disabled={transmittingId === note.id}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                        >
                          {transmittingId === note.id ? 'Transmitindo...' : 'Transmitir'}
                        </button>
                      )}
                      {note.status === 'transmitted' && (
                        <span className="text-green-600 font-medium text-sm">✓ Transmitida</span>
                      )}
                      {note.status === 'failed' && (
                        <button
                          onClick={() => handleTransmit(note.id)}
                          disabled={transmittingId === note.id}
                          className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors disabled:opacity-50 font-medium"
                        >
                          {transmittingId === note.id ? 'Retentando...' : 'Retentar'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detalhes de Falhas */}
      {notes.some((n) => n.status === 'failed') && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-red-900 mb-4">Notas com Falha</h2>
          <div className="space-y-3">
            {notes
              .filter((n) => n.status === 'failed')
              .map((note) => (
                <div key={note.id} className="p-3 bg-white rounded border border-red-200">
                  <p className="font-semibold text-gray-900">
                    {note.series}/{note.number}
                  </p>
                  <p className="text-sm text-red-800 mt-1">
                    <strong>Motivo:</strong> {note.failureReason || 'Desconhecido'}
                  </p>
                  {note.lastTransmissionAttempt && (
                    <p className="text-xs text-gray-600 mt-1">
                      Última tentativa: {new Date(note.lastTransmissionAttempt).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Como Funciona</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <p className="font-semibold text-gray-900 mb-1">1. Emissão em Contingência</p>
            <p>Quando a Receita Federal está indisponível, as notas são emitidas localmente com um número sequencial.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">2. Armazenamento Seguro</p>
            <p>As notas são armazenadas com segurança até que o serviço seja restaurado.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">3. Transmissão Automática</p>
            <p>Assim que o serviço for restaurado, as notas são transmitidas automaticamente ou manualmente.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">4. Validação</p>
            <p>A Receita Federal valida as notas e emite o protocolo de autorização.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
