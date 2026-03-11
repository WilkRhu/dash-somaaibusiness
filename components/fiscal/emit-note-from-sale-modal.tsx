'use client';

import { useState } from 'react';
import { showToast } from '@/components/ui/toast';

interface SaleItem {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

interface EmitNoteFromSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmit: (data: any) => Promise<void>;
  saleData: {
    saleNumber: string;
    total: number;
    items: SaleItem[];
    customerName?: string;
    customerCpfCnpj?: string;
    customerEmail?: string;
  };
  isLoading?: boolean;
}

export function EmitNoteFromSaleModal({
  isOpen,
  onClose,
  onEmit,
  saleData,
  isLoading = false,
}: EmitNoteFromSaleModalProps) {
  const [noteType, setNoteType] = useState<'nfce' | 'nfe'>('nfce');
  const [series, setSeries] = useState('1');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isEmitting, setIsEmitting] = useState(false);

  const handleEmit = async () => {
    if (!series.trim()) {
      showToast('Informe a série', 'error');
      return;
    }

    setIsEmitting(true);
    try {
      await onEmit({
        type: noteType,
        series,
        additionalInfo,
        saleId: saleData.saleNumber,
        items: saleData.items.map((item) => ({
          code: item.itemId,
          description: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice - item.discount,
        })),
        recipient: {
          name: saleData.customerName || 'Consumidor Final',
          cpfCnpj: saleData.customerCpfCnpj || '',
          email: saleData.customerEmail,
        },
        totals: {
          products: saleData.total,
          discount: saleData.items.reduce((sum, item) => sum + item.discount, 0),
          total: saleData.total,
          taxes: {
            icms: 0,
            pis: 0,
            cofins: 0,
          },
        },
      });

      showToast('Nota fiscal emitida com sucesso!', 'success');
      onClose();
    } catch (error: any) {
      showToast(error.message || 'Erro ao emitir nota fiscal', 'error');
    } finally {
      setIsEmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-brand-navy">Emitir Nota Fiscal</h2>
          <p className="text-sm text-gray-600 mt-1">Venda #{saleData.saleNumber}</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Tipo de Nota */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Nota</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="nfce"
                  checked={noteType === 'nfce'}
                  onChange={(e) => setNoteType(e.target.value as 'nfce' | 'nfe')}
                  disabled={isEmitting || isLoading}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">NFC-e (Consumidor)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="nfe"
                  checked={noteType === 'nfe'}
                  onChange={(e) => setNoteType(e.target.value as 'nfce' | 'nfe')}
                  disabled={isEmitting || isLoading}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">NF-e (Empresa)</span>
              </label>
            </div>
          </div>

          {/* Série */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Série</label>
            <input
              type="text"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              disabled={isEmitting || isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50"
            />
          </div>

          {/* Informações Adicionais */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Informações adicionais (opcional)"
              disabled={isEmitting || isLoading}
              maxLength={500}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">{additionalInfo.length}/500</p>
          </div>

          {/* Resumo */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Itens:</span>
              <span className="font-semibold">{saleData.items.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold">R$ {saleData.total.toFixed(2)}</span>
            </div>
            {saleData.customerName && (
              <div className="flex justify-between">
                <span className="text-gray-600">Cliente:</span>
                <span className="font-semibold">{saleData.customerName}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={isEmitting || isLoading}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleEmit}
            disabled={isEmitting || isLoading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
          >
            {isEmitting || isLoading ? 'Emitindo...' : '✓ Emitir Nota'}
          </button>
        </div>
      </div>
    </div>
  );
}
