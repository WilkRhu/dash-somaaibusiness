'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFiscalNotes } from '@/lib/hooks/use-fiscal-notes';
import { FiscalNote, FiscalCorrection } from '@/lib/types/fiscal';
import { formatDateTime, canMakeCorrection } from '@/lib/utils/fiscal-formatters';
import { CorrectionForm } from '@/components/fiscal/forms/correction-form';
import { showToast } from '@/components/ui/toast';

export default function CorrectionPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;

  const { getNote, createCorrection, getCorrections, isLoading } = useFiscalNotes({ autoFetch: false });
  const [note, setNote] = useState<FiscalNote | null>(null);
  const [corrections, setCorrections] = useState<FiscalCorrection[]>([]);
  const [isLoadingNote, setIsLoadingNote] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const noteData = await getNote(noteId);
        setNote(noteData);

        const correctionsData = await getCorrections(noteId);
        setCorrections(correctionsData || []);
      } catch (error: any) {
        showToast(error.message || 'Erro ao carregar dados', 'error');
        router.push(`/fiscal/notes/${noteId}`);
      } finally {
        setIsLoadingNote(false);
      }
    };

    loadData();
  }, [noteId, getNote, getCorrections, router]);

  const handleSubmit = async (correctionText: string) => {
    setIsSubmitting(true);
    try {
      const result = await createCorrection(noteId, {
        correctionType: 1,
        correctionText,
      });

      setCorrections((prev) => [result, ...prev]);
      showToast('Carta de correção criada com sucesso!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Erro ao criar correção', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingNote) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Carregando...</p>
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

  const canMakeNewCorrection = canMakeCorrection(note.status) && corrections.length < 20;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Carta de Correção</h1>
        <p className="text-gray-600 mt-2">Nota Fiscal #{note.number}</p>
      </div>

      {/* Alertas */}
      {note.status !== 'authorized' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            <strong>⚠️ Atenção:</strong> Apenas notas autorizadas podem ter cartas de correção.
          </p>
        </div>
      )}

      {!canMakeNewCorrection && note.status === 'authorized' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            <strong>❌ Não é possível criar correção:</strong> Prazo expirado ou limite de correções atingido.
          </p>
        </div>
      )}

      {/* Formulário */}
      {note.status === 'authorized' && canMakeNewCorrection && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Nova Correção</h2>
          <CorrectionForm onSubmit={handleSubmit} isLoading={isSubmitting || isLoading} />
        </div>
      )}

      {/* Informações */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Informações:</strong> Cartas de correção podem ser criadas até 30 dias após a emissão da nota.
          Máximo de 20 correções por nota.
        </p>
      </div>

      {/* Lista de Correções */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Correções ({corrections.length})
        </h2>

        {corrections.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhuma correção criada</p>
        ) : (
          <div className="space-y-4">
            {corrections.map((correction) => (
              <div key={correction.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">Correção #{correction.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">{formatDateTime(correction.createdAt)}</p>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      correction.status === 'authorized'
                        ? 'bg-green-100 text-green-800'
                        : correction.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {correction.status}
                  </span>
                </div>

                <p className="text-gray-700 mb-2">{correction.correctionText}</p>

                {correction.protocol && (
                  <p className="text-sm text-gray-600">
                    <strong>Protocolo:</strong> {correction.protocol}
                  </p>
                )}

                {correction.rejectionReason && (
                  <div className="mt-2 p-2 bg-red-50 rounded">
                    <p className="text-sm text-red-800">
                      <strong>Motivo da rejeição:</strong> {correction.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botão Voltar */}
      <button
        onClick={() => router.push(`/fiscal/notes/${noteId}`)}
        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
      >
        ← Voltar para Nota
      </button>
    </div>
  );
}
