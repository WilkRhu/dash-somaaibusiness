'use client';

import { useState, useEffect } from 'react';
import { mercadoPagoApi, PixPaymentResponse } from '@/lib/api/mercadopago';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  amount: number;
  onSuccess: () => void;
}

export function PixPaymentModal({
  isOpen,
  onClose,
  planId,
  planName,
  amount,
  onSuccess,
}: PixPaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<PixPaymentResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (isOpen && !pixData) {
      generatePix();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!pixData) return;

    const interval = setInterval(async () => {
      try {
        setChecking(true);
        const status = await mercadoPagoApi.checkPaymentStatus(pixData.id);
        if (status.approved) {
          clearInterval(interval);
          onSuccess();
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
      } finally {
        setChecking(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [pixData]);

  const generatePix = async () => {
    setLoading(true);
    try {
      const response = await mercadoPagoApi.createPixPayment({
        planId,
        amount,
        description: `Assinatura ${planName}`,
      });
      setPixData(response);
    } catch (error: any) {
      console.error('Erro ao gerar PIX:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao gerar código PIX';
      alert(`Erro: ${errorMessage}\n\nVerifique se o backend está rodando e configurado corretamente.`);
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-brand-navy">Pagamento via PIX</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Gerando código PIX...</p>
          </div>
        ) : pixData ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-2">Valor a pagar</p>
              <p className="text-3xl font-bold text-brand-navy">
                R$ {amount.toFixed(2)}
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
              <img
                src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                alt="QR Code PIX"
                className="w-full max-w-xs mx-auto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código PIX Copia e Cola
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pixData.qrCode}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={copyPixCode}
                  className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  {copied ? '✓' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {checking ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-blue"></div>
                  ) : (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Aguardando pagamento...</p>
                  <p>Abra o app do seu banco, escaneie o QR Code ou cole o código PIX para pagar.</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center">
              O código expira em {new Date(pixData.expirationDate).toLocaleString('pt-BR')}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
