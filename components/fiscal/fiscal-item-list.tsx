'use client';

import { FiscalItem } from '@/lib/types/fiscal';
import { formatCurrency } from '@/lib/utils/fiscal-formatters';

interface FiscalItemListProps {
  items: FiscalItem[];
  onAddItem?: () => void;
  onRemoveItem?: (index: number) => void;
  onUpdateItem?: (index: number, item: FiscalItem) => void;
  editable?: boolean;
}

export function FiscalItemList({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  editable = false,
}: FiscalItemListProps) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const totalTaxes = items.reduce(
    (sum, item) => sum + (item.taxes.icms + item.taxes.pis + item.taxes.cofins + (item.taxes.ipi || 0)),
    0
  );

  return (
    <div className="space-y-4">
      {/* Tabela de Itens */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Descrição</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">NCM</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">CFOP</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Qtd</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Unitário</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                {editable && <th className="text-center py-3 px-4 font-semibold text-gray-700">Ação</th>}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={editable ? 7 : 6} className="py-8 px-4 text-center text-gray-500">
                    Nenhum item adicionado
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.description}</p>
                        <p className="text-xs text-gray-500">{item.code}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600 font-mono">{item.ncm}</td>
                    <td className="py-3 px-4 text-center text-gray-600 font-mono">{item.cfop}</td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-brand-navy">
                      {formatCurrency(item.total)}
                    </td>
                    {editable && (
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onRemoveItem?.(index)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm"
                        >
                          ✕
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Resumo */}
        <div className="bg-gray-50 border-t border-gray-200 p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Impostos:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totalTaxes)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="font-bold text-brand-navy">{formatCurrency(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Adicionar */}
      {editable && onAddItem && (
        <button
          onClick={onAddItem}
          className="w-full px-4 py-3 border-2 border-dashed border-blue-400 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
        >
          ➕ Adicionar Item
        </button>
      )}
    </div>
  );
}
