'use client';

import { useState } from 'react';
import { showToast } from '@/components/ui/toast';

interface PaymentItem {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

interface MercadoPagoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleId: string;
  items: PaymentItem[];
  totalAmount: number;
  customerEmail: string;
  customerName?: string;
}

export function MercadoPagoPaymentModal({
  isOpen,
  onClose,
  saleId,
  items,
  totalAmount,
  customerEmail,
  customerName,
}: MercadoPagoPaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/business/establishments/mercadopago/payment-preference', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          saleId,
          items,
          totalAmount,
          customerEmail,
          customerName,
          externalReference: saleId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao criar preferência de pagamento');
      }

      const { initPoint, sandboxInitPoint } = await response.json();

      // Redirecionar para Mercado Pago
      const paymentUrl = process.env.NEXT_PUBLIC_MERCADOPAGO_SANDBOX === 'true' 
        ? sandboxInitPoint 
        : initPoint;

      window.location.href = paymentUrl;
    } catch (error: any) {
      showToast(error.message || 'Erro ao processar pagamento', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-900">Pagamento Mercado Pago</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Resumo */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Resumo do Pagamento</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Itens:</span>
                <span className="font-medium">{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cliente:</span>
                <span className="font-medium">{customerName || customerEmail}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-lg text-green-600">
                  R$ {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Itens */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Itens</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span>
                    {item.title} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    R$ {(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>ℹ️ Informação:</strong> Você será redirecionado para o Mercado Pago para completar o pagamento.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreatePayment}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
          >
            {isLoading ? 'Processando...' : 'Pagar com Mercado Pago'}
          </button>
        </div>
      </div>
    </div>
  );
}
