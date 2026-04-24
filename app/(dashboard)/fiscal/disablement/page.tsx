'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFiscalNotes } from '@/lib/hooks/use-fiscal-notes';
import { DisablementForm } from '@/components/fiscal/forms/disablement-form';
import { showToast } from '@/components/ui/toast';

export default function DisablementPage() {
  const router = useRouter();
  const { isLoading } = useFiscalNotes({ autoFetch: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (startNumber: number, endNumber: number, justification: string) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to create disablement
      // const result = await fiscalApi.createDisablement({
      //   startNumber,
      //   endNumber,
      //   justification,
      // });
      
      showToast('Inutilização criada com sucesso!', 'success');
      router.push('/fiscal/notes');
    } catch (error: any) {
      showToast(error.message || 'Erro ao criar inutilização', 'error');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Inutilizar Números</h1>
        <p className="text-gray-600 mt-2">
          Inutilize uma sequência de números de notas fiscais que não serão utilizadas
        </p>
      </div>

      {/* Info Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>ℹ️ Informação:</strong> A inutilização de números é uma operação que registra junto à Receita Federal que determinados números de notas fiscais não serão utilizados. Esta ação é irreversível.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <DisablementForm onSubmit={handleSubmit} isLoading={isSubmitting || isLoading} />
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Dúvidas Frequentes</h2>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <p className="font-semibold text-gray-900 mb-1">Quando devo inutilizar números?</p>
            <p>Quando você possui uma sequência de números que não será utilizada, como em caso de perda, roubo ou cancelamento de autorização.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">Posso inutilizar números já utilizados?</p>
            <p>Não. A inutilização é apenas para números que não foram utilizados e não serão utilizados.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">Qual é o prazo para inutilizar?</p>
            <p>A inutilização deve ser feita no mesmo período em que os números foram autorizados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
