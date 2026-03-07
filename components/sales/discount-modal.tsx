'use client';

import { useState, useEffect } from 'react';
import { showToast } from '@/components/ui/toast';

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (discount: number) => void;
  title: string;
  currentDiscount?: number;
  maxDiscount?: number;
}

export default function DiscountModal({ 
  isOpen, 
  onClose, 
  onApply, 
  title,
  currentDiscount = 0,
  maxDiscount
}: DiscountModalProps) {
  const [discountType, setDiscountType] = useState<'value' | 'percentage'>('value');
  const [discount, setDiscount] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDiscount(currentDiscount > 0 ? currentDiscount.toFixed(2) : '');
      setDiscountType('value');
    }
  }, [isOpen, currentDiscount]);

  if (!isOpen) return null;

  const calculateDiscountValue = (): number => {
    const value = parseFloat(discount);
    
    if (isNaN(value) || value < 0) return 0;

    if (discountType === 'percentage') {
      if (value > 100) return 0;
      return maxDiscount ? (maxDiscount * value) / 100 : 0;
    }

    return value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const value = parseFloat(discount);

    if (isNaN(value) || value < 0) {
      showToast('Informe um valor válido', 'error');
      return;
    }

    if (discountType === 'percentage' && value > 100) {
      showToast('Porcentagem não pode ser maior que 100%', 'error');
      return;
    }

    const discountValue = calculateDiscountValue();

    if (maxDiscount !== undefined && discountValue > maxDiscount) {
      showToast(`Desconto não pode ser maior que R$ ${maxDiscount.toFixed(2)}`, 'error');
      return;
    }

    onApply(discountValue);
    onClose();
  };

  const handleClose = () => {
    setDiscount('');
    setDiscountType('value');
    onClose();
  };

  const handleRemoveDiscount = () => {
    onApply(0);
    onClose();
  };

  const discountValue = calculateDiscountValue();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-brand-navy">{title}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tipo de Desconto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Desconto
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setDiscountType('value');
                  setDiscount('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  discountType === 'value'
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Valor (R$)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDiscountType('percentage');
                  setDiscount('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  discountType === 'percentage'
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Porcentagem (%)
              </button>
            </div>
          </div>

          {/* Campo de Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {discountType === 'value' ? 'Valor do Desconto' : 'Porcentagem do Desconto'}
            </label>
            <input
              type="text"
              value={discount}
              onChange={(e) => {
                if (discountType === 'value') {
                  // Remove tudo exceto números para valor em reais
                  const value = e.target.value.replace(/\D/g, '');
                  setDiscount(value);
                } else {
                  // Para porcentagem, permite apenas números
                  const value = e.target.value.replace(/\D/g, '');
                  if (value === '' || parseInt(value) <= 100) {
                    setDiscount(value);
                  }
                }
              }}
              onBlur={(e) => {
                if (discountType === 'value') {
                  // Formata ao sair do campo
                  const value = e.target.value.replace(/\D/g, '');
                  if (value) {
                    const formatted = (parseFloat(value) / 100).toFixed(2);
                    setDiscount(formatted);
                  }
                }
              }}
              placeholder={discountType === 'value' ? 'R$ 0,00' : '0%'}
              className="w-full px-3 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              autoFocus
            />
            {discountType === 'value' && maxDiscount !== undefined && (
              <p className="text-sm text-gray-500 mt-2">
                Máximo: R$ {maxDiscount.toFixed(2)}
              </p>
            )}
          </div>

          {/* Preview do Desconto */}
          {discount && parseFloat(discount) > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-800">Desconto a aplicar:</span>
                <span className="text-lg font-bold text-blue-900">
                  R$ {discountValue.toFixed(2)}
                </span>
              </div>
              {discountType === 'percentage' && maxDiscount && (
                <p className="text-xs text-blue-600 mt-1">
                  {discount}% de R$ {maxDiscount.toFixed(2)}
                </p>
              )}
            </div>
          )}

          {currentDiscount > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Desconto atual: <strong>R$ {currentDiscount.toFixed(2)}</strong>
              </p>
            </div>
          )}
        </form>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          {currentDiscount > 0 && (
            <button
              type="button"
              onClick={handleRemoveDiscount}
              className="flex-1 px-4 py-2 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              Remover
            </button>
          )}
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
