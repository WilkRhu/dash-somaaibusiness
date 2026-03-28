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