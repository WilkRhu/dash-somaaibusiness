'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFiscalNotes } from '@/lib/hooks/use-fiscal-notes';
import { useFiscalCertificate } from '@/lib/hooks/use-fiscal-certificate';
import { EmitNoteForm } from '@/components/fiscal/forms/emit-note-form';
import { FiscalNoteData } from '@/lib/types/fiscal';
import { showToast } from '@/components/ui/toast';

export default function EmitNotePage() {
  const router = useRouter();
  const { emitNote, isLoading } = useFiscalNotes({ autoFetch: false });
  const { certificate } = useFiscalCertificate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: FiscalNoteData) => {
    // Validar certificado
    if (!certificate) {
      showToast('Certificado digital não configurado', 'error');
      router.push('/fiscal/certificate');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await emitNote(data);
      showToast('Nota fiscal emitida com sucesso!', 'success');
      
      // Redirecionar para detalhes da nota
      setTimeout(() => {
        router.push(`/fiscal/notes/${result.id}`);
      }, 1500);
    } catch (error: any) {
      showToast(error.message || 'Erro ao emitir nota fiscal', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Emitir Nota Fiscal</h1>
        <p className="text-gray-600 mt-2">Preencha os dados abaixo para emitir uma nova nota fiscal</p>
      </div>

      {/* Alerta de Certificado */}
      {!certificate && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="font-semibold text-red-900">Certificado não configurado</p>
            <p className="text-sm text-red-800 mt-1">
              Você precisa configurar um certificado digital antes de emitir notas fiscais.
            </p>
            <button
              onClick={() => router.push('/fiscal/certificate')}
              className="text-sm font-semibold text-red-600 hover:text-red-700 mt-2 inline-block"
            >
              Configurar certificado →
            </button>
          </div>
        </div>
      )}

      {/* Formulário */}
      {certificate && (
        <EmitNoteForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting || isLoading}
        />
      )}
    </div>
  );
}
