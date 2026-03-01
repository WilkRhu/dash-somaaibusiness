'use client';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
  onSelectPix: () => void;
  onSelectCard: () => void;
}

export function PaymentMethodModal({
  isOpen,
  onClose,
  planName,
  amount,
  onSelectPix,
  onSelectCard,
}: PaymentMethodModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-navy">Escolha o Método de Pagamento</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-gradient-to-r from-brand-blue to-brand-green rounded-lg p-4 text-white text-center mb-6">
          <p className="text-sm opacity-90 mb-1">Plano {planName}</p>
          <p className="text-3xl font-bold">R$ {amount.toFixed(2)}</p>
          <p className="text-sm opacity-90 mt-1">/mês</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onSelectPix}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-brand-blue hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-gray-900 text-lg">PIX</h3>
                <p className="text-sm text-gray-600">Aprovação instantânea</p>
              </div>
              <svg className="w-6 h-6 text-gray-400 group-hover:text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={onSelectCard}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-brand-blue hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="text-left flex-1">
                <h3 className="font-bold text-gray-900 text-lg">Cartão de Crédito</h3>
                <p className="text-sm text-gray-600">Parcele em até 12x</p>
              </div>
              <svg className="w-6 h-6 text-gray-400 group-hover:text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Pagamento 100% seguro via Mercado Pago</span>
        </div>
      </div>
    </div>
  );
}
