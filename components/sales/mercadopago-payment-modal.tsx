'use client';

import { useEffect, useRef, useState } from 'react';
import { mercadoPagoApi } from '@/lib/api/mercadopago';
import { salesApi } from '@/lib/api/sales';
import { showToast } from '@/components/ui/toast';

interface MercadoPagoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApproved: () => void;
  // Venda já criada pelo PDV
  saleId: string;
  establishmentId: string;
  totalAmount: number;
  customerEmail?: string;
  customerName?: string;
}

const POLL_INTERVAL = 3000;
const MAX_POLLS = 60; // 3 min

export default function MercadoPagoPaymentModal({
  isOpen,
  onClose,
  onApproved,
  saleId,
  establishmentId,
  totalAmount,
  customerEmail,
  customerName,
}: MercadoPagoPaymentModalProps) {
  const [step, setStep] = useState<'loading' | 'qrcode' | 'approved' | 'rejected'>('loading');
  const [pixData, setPixData] = useState<{ qrCodeBase64: string; qrCode: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCount = useRef(0);
  const approvedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      approvedRef.current = false;
      return;
    }
    initPix();
    return () => stopPolling();
  }, [isOpen]);

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
  };

  const startPolling = () => {
    pollCount.current = 0;
    approvedRef.current = false;
    pollRef.current = setInterval(async () => {
      pollCount.current++;
      if (pollCount.current > MAX_POLLS) {
        stopPolling();
        return;
      }
      try {
        const sale = await salesApi.getById(establishmentId, saleId);
        const status = (sale as any).status ?? (sale as any).data?.status;
        if (status === 'completed' || status === 'COMPLETED') {
          // Proteção contra múltiplas chamadas
          if (approvedRef.current) return;
          approvedRef.current = true;
          
          stopPolling();
          setStep('approved');
          showToast('Pagamento aprovado!', 'success');
          setTimeout(() => onApproved(), 1500);
        } else if (status === 'cancelled' || status === 'CANCELLED') {
          stopPolling();
          setStep('rejected');
        }
      } catch {
        // ignora erros de polling
      }
    }, POLL_INTERVAL);
  };

  const initPix = async () => {
    setStep('loading');
    setPixData(null);
    try {
      // 1. Gera o PIX
      const pix = await mercadoPagoApi.generatePix({ saleId, totalAmount, customerEmail, customerName });

      // 2. Vincula o pagamento MP à venda (venda fica PENDING)
      await salesApi.linkMercadoPagoPayment(establishmentId, saleId, pix.paymentId);

      setPixData({ qrCodeBase64: pix.qrCodeBase64, qrCode: pix.qrCode });
      setStep('qrcode');

      // 3. Polling no status da venda — webhook do MP vai atualizar para COMPLETED
      startPolling();
    } catch (err: any) {
      showToast(err.message || 'Erro ao gerar PIX', 'error');
      onClose();
    }
  };

  const handleCopy = () => {
    if (!pixData?.qrCode) return;
    navigator.clipboard.writeText(pixData.qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#009EE3] flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
                <path d="M6 16c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="16" cy="20" r="3" fill="#fff" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">Pagamento via PIX</span>
          </div>
          {step !== 'approved' && (
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="p-6 space-y-5">
          {/* Valor */}
          <div className="text-center">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-3xl font-bold text-gray-900">R$ {totalAmount.toFixed(2)}</p>
          </div>

          {step === 'loading' && (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="w-8 h-8 border-2 border-[#009EE3] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Gerando PIX...</p>
            </div>
          )}

          {step === 'approved' && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-green-700">Pagamento aprovado!</p>
            </div>
          )}

          {step === 'rejected' && (
            <div className="flex flex-col items-center gap-3 py-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="font-semibold text-red-700">Pagamento cancelado</p>
              <button onClick={initPix} className="text-sm text-[#009EE3] hover:underline">Gerar novo PIX</button>
            </div>
          )}

          {step === 'qrcode' && pixData && (
            <div className="space-y-4">
              {/* QR Code */}
              <div className="flex justify-center">
                <img
                  src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                  alt="QR Code PIX"
                  className="w-48 h-48 border border-gray-200 rounded-xl"
                />
              </div>

              {/* Copia e cola */}
              <div>
                <p className="text-xs text-gray-500 mb-1 text-center">ou use o código copia e cola</p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={pixData.qrCode}
                    className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 truncate"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-3 py-2 bg-[#009EE3] text-white rounded-lg text-xs font-medium hover:bg-[#0088cc] transition-colors whitespace-nowrap"
                  >
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-3 h-3 border-2 border-[#009EE3] border-t-transparent rounded-full animate-spin" />
                Aguardando pagamento...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
