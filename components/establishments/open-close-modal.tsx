'use client';

import { useState } from 'react';
import { establishmentsApi } from '@/lib/api/establishments';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { showToast } from '@/components/ui/toast';

interface OpenCloseModalProps {
  onClose: () => void;
  onStatusChange: (isOpen: boolean) => void;
}

export default function OpenCloseModal({ onClose, onStatusChange }: OpenCloseModalProps) {
  const { currentEstablishment, setCurrentEstablishment } = useEstablishmentStore();
  const [isLoading, setIsLoading] = useState(false);
  const isOpen = currentEstablishment?.isOpen ?? false;

  const handleToggle = async () => {
    if (!currentEstablishment?.id) return;

    try {
      setIsLoading(true);
      const updated = isOpen
        ? await establishmentsApi.close(currentEstablishment.id)
        : await establishmentsApi.open(currentEstablishment.id);

      setCurrentEstablishment({ ...currentEstablishment, isOpen: !isOpen });
      onStatusChange(!isOpen);
      showToast(
        isOpen ? 'Estabelecimento fechado' : 'Estabelecimento aberto',
        'success'
      );
      onClose();
    } catch (error: any) {
      showToast(error.message || 'Erro ao alterar status', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-5 ${isOpen ? 'bg-green-50' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${isOpen ? 'bg-green-100' : 'bg-gray-200'}`}>
                {isOpen ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {currentEstablishment?.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className={`text-sm font-medium ${isOpen ? 'text-green-700' : 'text-gray-500'}`}>
                    {isOpen ? 'Aberto' : 'Fechado'}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-gray-600 mb-5">
            {isOpen
              ? 'Ao fechar o estabelecimento, novos pedidos e vendas serão bloqueados até reabrir.'
              : 'Ao abrir o estabelecimento, pedidos e vendas poderão ser realizados normalmente.'}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              onClick={handleToggle}
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 ${
                isOpen
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isLoading
                ? 'Processando...'
                : isOpen
                  ? 'Fechar Estabelecimento'
                  : 'Abrir Estabelecimento'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
