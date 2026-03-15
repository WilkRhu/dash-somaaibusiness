'use client';

import { useEffect, useState } from 'react';
import { showToast } from '@/components/ui/toast';
import apiClient from '@/lib/api/client';

interface FiscalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  accessKey?: string;
  danfeUrl?: string;
  consultUrl?: string;
  issuedAt?: string;
  total: number;
  customerName?: string;
  customerCpf?: string;
  customerEmail?: string;
  saleId?: string;
}

export function FiscalReceiptModal({
  isOpen,
  onClose,
  accessKey,
  danfeUrl,
  consultUrl,
  issuedAt,
  total,
  customerName,
  customerCpf,
  customerEmail,
  saleId,
}: FiscalReceiptModalProps) {
  const [autoClose, setAutoClose] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(customerEmail || '');

  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  const handleSendEmail = async () => {
    if (!emailInput.trim()) {
      showToast('Digite um email válido', 'error');
      return;
    }

    setIsSendingEmail(true);
    try {
      const response = await apiClient.post('/business/fiscal/notes/send-email', {
        saleId,
        accessKey,
        email: emailInput,
      });

      if (response.data?.success) {
        showToast('Nota fiscal enviada por email!', 'success');
        setEmailInput('');
      } else {
        showToast('Erro ao enviar email', 'error');
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao enviar email', 'error');
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-center gap-3 mb-2">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h2 className="text-2xl font-bold">Nota Fiscal Emitida!</h2>
          </div>
          <p className="text-sm text-white/90">Sua venda foi registrada com sucesso</p>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-4">
          {/* Informações da Venda */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Total</span>
              <span className="font-bold text-lg text-brand-blue">R$ {total.toFixed(2)}</span>
            </div>
            
            {customerName && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Cliente</span>
                <span className="font-medium text-gray-900">{customerName}</span>
              </div>
            )}
            
            {customerCpf && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">CPF</span>
                <span className="font-mono text-sm text-gray-900">{customerCpf}</span>
              </div>
            )}
            
            {issuedAt && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Emitida em</span>
                <span className="text-sm text-gray-900">
                  {new Date(issuedAt).toLocaleString('pt-BR')}
                </span>
              </div>
            )}
          </div>

          {/* Chave de Acesso */}
          {accessKey && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-2">Chave de Acesso</p>
              <p className="font-mono text-sm font-bold text-blue-900 break-all">{accessKey}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(accessKey);
                  alert('Chave copiada!');
                }}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Copiar chave
              </button>
            </div>
          )}

          {/* Links */}
          <div className="space-y-2">
            {danfeUrl && (
              <a
                href={danfeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
              >
                📄 Visualizar DANFE
              </a>
            )}
            
            {consultUrl && (
              <a
                href={consultUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center text-sm font-medium"
              >
                🔍 Consultar Nota
              </a>
            )}
          </div>

          {/* Enviar por Email */}
          <div className="bg-purple-50 rounded-lg p-4 space-y-3 border border-purple-200">
            <p className="text-sm font-medium text-gray-700">📧 Enviar por Email</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Digite o email do cliente..."
                disabled={isSendingEmail}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm disabled:opacity-50"
              />
              <button
                onClick={handleSendEmail}
                disabled={isSendingEmail || !emailInput.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50 whitespace-nowrap"
              >
                {isSendingEmail ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  '✉️ Enviar'
                )}
              </button>
            </div>
          </div>

          {/* Checkbox Auto-fechar */}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={autoClose}
              onChange={(e) => setAutoClose(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            Fechar automaticamente em 5 segundos
          </label>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            ✓ Próxima Venda
          </button>
        </div>
      </div>
    </div>
  );
}
