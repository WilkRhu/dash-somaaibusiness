'use client';

import { useState } from 'react';
import { PaymentMethod } from '@/lib/types/sale';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: PaymentMethod, cashRegisterId?: number, notes?: string) => void;
  total: number;
  maxCashRegisters?: number;
  isLoading?: boolean;
}

const paymentMethods = [
  { 
    value: PaymentMethod.CASH, 
    label: 'Dinheiro', 
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    value: PaymentMethod.PIX, 
    label: 'PIX', 
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    value: PaymentMethod.DEBIT_CARD, 
    label: 'Cartão de Débito', 
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  { 
    value: PaymentMethod.CREDIT_CARD, 
    label: 'Cartão de Crédito', 
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  { 
    value: PaymentMethod.BANK_TRANSFER, 
    label: 'Transferência', 
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )
  },
];

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  total,
  maxCashRegisters = 99,
  isLoading = false 
}: CheckoutModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [cashRegisterId, setCashRegisterId] = useState<number>(1);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (cashRegisterId < 1 || cashRegisterId > maxCashRegisters) {
      alert(`Número do caixa deve estar entre 1 e ${maxCashRegisters}`);
      return;
    }
    onConfirm(selectedMethod, cashRegisterId, notes || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-brand-navy">Finalizar Venda</h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-r from-brand-blue/10 to-brand-green/10 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total a pagar</p>
            <p className="text-3xl font-bold text-brand-navy">
              R$ {total.toFixed(2)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Forma de Pagamento
            </label>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.value}
                  onClick={() => setSelectedMethod(method.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedMethod === method.value
                      ? 'border-brand-blue bg-brand-blue/5'
                      : 'border-gray-200 hover:border-brand-blue/30'
                  }`}
                >
                  <div className="flex justify-center mb-2 text-brand-blue">
                    {method.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {method.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número do Caixa *
            </label>
            <input
              type="number"
              min="1"
              max={maxCashRegisters}
              value={cashRegisterId}
              onChange={(e) => setCashRegisterId(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              placeholder="Ex: 1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Caixas disponíveis: 1 a {maxCashRegisters}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações sobre a venda..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              rows={3}
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50"
          >
            {isLoading ? 'Processando...' : 'Confirmar Venda'}
          </button>
        </div>
      </div>
    </div>
  );
}
