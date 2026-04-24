'use client';

import { useState } from 'react';
import { salesApi } from '@/lib/api/sales';
import { showToast } from '@/components/ui/toast';

interface ReceiptOptionsModalProps {
  isOpen: boolean;
  saleId: string;
  establishmentId: string;
  customerEmail?: string;
  onClose: () => void;
  onProceed: () => void;
}

export function ReceiptOptionsModal({
  isOpen,
  saleId,
  establishmentId,
  customerEmail,
  onClose,
  onProceed,
}: ReceiptOptionsModalProps) {
  const [email, setEmail] = useState(customerEmail || '');
  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      showToast('Digite um email válido', 'warning');
      return;
    }

    setIsSending(true);
    try {
      await salesApi.sendReceipt(establishmentId, saleId, email);
      showToast('Comprovante enviado com sucesso!', 'success');
      onProceed();
    } catch (err: any) {
      showToast(err.message || 'Erro ao enviar comprovante', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handlePrint = () => {
    window.print();
    onProceed();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-blue to-brand-green p-6 text-white">
          <h2 className="text-2xl font-bold">Comprovante da Venda</h2>
          <p className="text-sm text-white/80 mt-2">Como deseja receber o comprovante?</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Email Option */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-900">
              Enviar por Email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <button
                onClick={handleSendEmail}
                disabled={isSending}
                className="px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90 disabled:opacity-50 font-semibold transition-colors"
              >
                {isSending ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">ou</span>
            </div>
          </div>

          {/* Print Option */}
          <button
            onClick={handlePrint}
            className="w-full px-4 py-3 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H9a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2h-2m-4-4V9m0 4v6m0-6H9m4 0h4" />
            </svg>
            Imprimir Comprovante
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}