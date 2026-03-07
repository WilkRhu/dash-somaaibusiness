'use client';

import { CartItem } from '@/lib/stores/cart-store';

interface SalePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  isLoading?: boolean;
}

export default function SalePreviewModal({
  isOpen,
  onClose,
  onConfirm,
  items,
  subtotal,
  discount,
  total,
  isLoading = false,
}: SalePreviewModalProps) {
  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-brand-blue to-brand-green text-white">
          <h2 className="text-2xl font-bold">Prévia da Venda</h2>
          <p className="text-sm opacity-90 mt-1">{currentDate}</p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Items Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Item</th>
                  <th className="text-center py-3 px-2 font-semibold text-gray-700 text-sm">Qtd</th>
                  <th className="text-right py-3 px-3 font-semibold text-gray-700 text-sm">Unit.</th>
                  {items.some(item => item.discount > 0) && (
                    <th className="text-right py-3 px-3 font-semibold text-gray-700 text-sm">Desc.</th>
                  )}
                  <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                    </td>
                    <td className="py-3 px-2 text-center text-gray-700 text-sm">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-right text-gray-700 text-sm">
                      R$ {item.unitPrice.toFixed(2)}
                    </td>
                    {items.some(i => i.discount > 0) && (
                      <td className="py-3 px-3 text-right text-red-600 text-sm">
                        {item.discount > 0 ? `- R$ ${item.discount.toFixed(2)}` : '-'}
                      </td>
                    )}
                    <td className="py-3 px-4 text-right font-semibold text-gray-900 text-sm">
                      R$ {item.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Subtotal:</span>
              <span className="font-semibold">R$ {subtotal.toFixed(2)}</span>
            </div>
            
            {discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span className="font-medium">Desconto:</span>
                <span className="font-semibold">- R$ {discount.toFixed(2)}</span>
              </div>
            )}
            
            <div className="pt-2 border-t-2 border-gray-300">
              <div className="flex justify-between text-brand-navy text-xl">
                <span className="font-bold">TOTAL:</span>
                <span className="font-bold">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-gray-500 text-center">
              {items.reduce((sum, item) => sum + item.quantity, 0)} item(s) • 
              {items.length} produto(s)
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Confira os itens antes de prosseguir para o pagamento
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold disabled:opacity-50"
          >
            Voltar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-bold disabled:opacity-50"
          >
            {isLoading ? 'Processando...' : 'Continuar para Pagamento'}
          </button>
        </div>
      </div>
    </div>
  );
}
