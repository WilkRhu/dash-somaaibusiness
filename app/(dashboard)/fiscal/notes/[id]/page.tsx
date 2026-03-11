'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFiscalNotes } from '@/lib/hooks/use-fiscal-notes';
import { FiscalNote } from '@/lib/types/fiscal';
import { formatCurrency, formatDateTime, formatNoteStatus, formatNoteType } from '@/lib/utils/fiscal-formatters';
import { FiscalItemList } from '@/components/fiscal/fiscal-item-list';
import { showToast } from '@/components/ui/toast';

export default function NoteDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;
  
  const { getNote, cancelNote, sendEmail, downloadDanfe, isLoading } = useFiscalNotes({ autoFetch: false });
  const [note, setNote] = useState<FiscalNote | null>(null);
  const [isLoadingNote, setIsLoadingNote] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const result = await getNote(noteId);
        setNote(result);
      } catch (error: any) {
        showToast(error.message || 'Erro ao carregar nota', 'error');
        router.push('/fiscal/notes');
      } finally {
        setIsLoadingNote(false);
      }
    };

    loadNote();
  }, [noteId, getNote, router]);

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      showToast('Informe o motivo do cancelamento', 'error');
      return;
    }

    setIsCancelling(true);
    try {
      await cancelNote(noteId, cancelReason);
      showToast('Nota cancelada com sucesso', 'success');
      setShowCancelModal(false);
      setCancelReason('');
      
      // Recarregar nota
      const result = await getNote(noteId);
      setNote(result);
    } catch (error: any) {
      showToast(error.message || 'Erro ao cancelar nota', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      await sendEmail(noteId);
      showToast('Email enviado com sucesso', 'success');
    } catch (error: any) {
      showToast(error.message || 'Erro ao enviar email', 'error');
    }
  };

  const handleDownloadDanfe = async () => {
    try {
      await downloadDanfe(noteId, `danfe-${note?.number}.pdf`);
      showToast('DANFE baixado com sucesso', 'success');
    } catch (error: any) {
      showToast(error.message || 'Erro ao baixar DANFE', 'error');
    }
  };

  if (isLoadingNote) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Carregando nota...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Nota não encontrada</p>
        <button
          onClick={() => router.push('/fiscal/notes')}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Voltar para notas →
        </button>
      </div>
    );
  }

  const canCancel = note.status === 'authorized' && 
    (new Date().getTime() - new Date(note.authorizedAt!).getTime()) < 
    (note.type === 'nfce' ? 30 * 60 * 1000 : 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Nota Fiscal #{note.number}</h1>
          <p className="text-gray-600 mt-2">{formatNoteType(note.type)}</p>
        </div>
        <span
          className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
            note.status === 'authorized'
              ? 'bg-green-100 text-green-800'
              : note.status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : note.status === 'cancelled'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {formatNoteStatus(note.status)}
        </span>
      </div>

      {/* Informações Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Informações da Nota</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Número:</span>
              <span className="font-semibold text-gray-900">{note.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Série:</span>
              <span className="font-semibold text-gray-900">{note.series}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo:</span>
              <span className="font-semibold text-gray-900">{formatNoteType(note.type)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-semibold text-gray-900">{formatNoteStatus(note.status)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Emitida em:</span>
              <span className="font-semibold text-gray-900">{formatDateTime(note.createdAt)}</span>
            </div>
            {note.authorizedAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Autorizada em:</span>
                <span className="font-semibold text-gray-900">{formatDateTime(note.authorizedAt)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Chave de Acesso</h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Chave de Acesso:</p>
            <p className="font-mono text-sm font-semibold text-gray-900 break-all">{note.accessKey}</p>
            {note.authorizationProtocol && (
              <>
                <p className="text-sm text-gray-600 pt-2">Protocolo de Autorização:</p>
                <p className="font-mono text-sm font-semibold text-gray-900">{note.authorizationProtocol}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Destinatário */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Destinatário</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Nome:</p>
            <p className="font-semibold text-gray-900">{note.recipient.name}</p>
          </div>
          <div>
            <p className="text-gray-600">CPF/CNPJ:</p>
            <p className="font-semibold text-gray-900 font-mono">{note.recipient.cpfCnpj}</p>
          </div>
          {note.recipient.email && (
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="font-semibold text-gray-900">{note.recipient.email}</p>
            </div>
          )}
          {note.recipient.phone && (
            <div>
              <p className="text-gray-600">Telefone:</p>
              <p className="font-semibold text-gray-900">{note.recipient.phone}</p>
            </div>
          )}
        </div>
      </div>

      {/* Itens */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Itens</h2>
        <FiscalItemList items={note.items} />
      </div>

      {/* Observações */}
      {note.additionalInfo && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Observações</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{note.additionalInfo}</p>
        </div>
      )}

      {/* Motivo de Rejeição */}
      {note.status === 'rejected' && note.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-red-900 mb-2">Motivo da Rejeição</h2>
          <p className="text-red-800">{note.rejectionReason}</p>
        </div>
      )}

      {/* Motivo de Cancelamento */}
      {note.status === 'cancelled' && note.cancellationReason && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Motivo do Cancelamento</h2>
          <p className="text-gray-700">{note.cancellationReason}</p>
          {note.cancelledAt && (
            <p className="text-sm text-gray-600 mt-2">Cancelada em: {formatDateTime(note.cancelledAt)}</p>
          )}
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => router.push('/fiscal/notes')}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
        >
          ← Voltar
        </button>

        {note.status === 'authorized' && (
          <>
            <button
              onClick={handleDownloadDanfe}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
            >
              📄 Baixar DANFE
            </button>

            <button
              onClick={handleSendEmail}
              disabled={isLoading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50"
            >
              📧 Enviar Email
            </button>

            <button
              onClick={() => router.push(`/fiscal/notes/${noteId}/correction`)}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold"
            >
              ✏️ Carta de Correção
            </button>

            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                ✕ Cancelar Nota
              </button>
            )}
          </>
        )}
      </div>

      {/* Modal de Cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-brand-navy">Cancelar Nota Fiscal</h2>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo do cancelamento (mínimo 15 caracteres)
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Informe o motivo do cancelamento..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">{cancelReason.length}/255</p>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                disabled={isCancelling}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                onClick={handleCancel}
                disabled={isCancelling || cancelReason.length < 15}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
              >
                {isCancelling ? 'Cancelando...' : 'Confirmar Cancelamento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
