'use client';

import { useState } from 'react';
import { UpdateStockDto, STOCK_MOVEMENT_LABELS, StockMovementType } from '@/lib/types/inventory';

interface UpdateStockFormProps {
  currentQuantity: number;
  unit: string;
  onSubmit: (data: UpdateStockDto) => Promise<void>;
  onCancel: () => void;
}

export function UpdateStockForm({ currentQuantity, unit, onSubmit, onCancel }: UpdateStockFormProps) {
  const [formData, setFormData] = useState<UpdateStockDto>({
    type: 'entry',
    quantity: 0,
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeChange = (newType: StockMovementType) => {
    setFormData({
      ...formData,
      type: newType,
      // Se for ajuste, preenche com a quantidade atual
      quantity: newType === 'adjustment' ? Math.floor(currentQuantity) : 0,
    });
  };

  const getNewQuantity = () => {
    const { type, quantity } = formData;
    const qty = parseInt(quantity.toString()) || 0;
    const current = Math.floor(currentQuantity);
    
    if (type === 'adjustment') return qty;
    if (type === 'entry' || type === 'return') return current + qty;
    return Math.max(0, current - qty);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          Estoque atual: <span className="font-semibold">{Math.floor(currentQuantity)} {unit}</span>
        </p>
        <p className="text-sm text-gray-700 mt-1">
          Novo estoque: <span className="font-semibold">{getNewQuantity()} {unit}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Movimentação *
        </label>
        <select
          required
          value={formData.type}
          onChange={(e) => handleTypeChange(e.target.value as StockMovementType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        >
          {Object.entries(STOCK_MOVEMENT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantidade *
        </label>
        <input
          type="number"
          required
          min="0"
          step="1"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          placeholder="Digite a quantidade"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.type === 'adjustment' 
            ? 'Defina a quantidade absoluta do estoque'
            : 'Quantidade a ser adicionada ou removida'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Motivo
        </label>
        <textarea
          rows={3}
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="Descreva o motivo da movimentação..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50"
        >
          {isSubmitting ? 'Atualizando...' : 'Atualizar Estoque'}
        </button>
      </div>
    </form>
  );
}
