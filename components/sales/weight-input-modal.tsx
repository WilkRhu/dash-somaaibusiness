'use client';

import { useState, useEffect } from 'react';
import { showToast } from '@/components/ui/toast';

interface WeightInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (weight: number) => void;
  productName: string;
  unit: string;
  pricePerUnit: number;
}

export default function WeightInputModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  productName,
  unit,
  pricePerUnit
}: WeightInputModalProps) {
  const [weight, setWeight] = useState('');

  useEffect(() => {
    if (isOpen) {
      setWeight('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getUnitLabel = () => {
    switch (unit) {
      case 'kg': return 'Quilogramas';
      case 'g': return 'Gramas';
      case 'l': return 'Litros';
      case 'ml': return 'Mililitros';
      default: return unit;
    }
  };

  const getUnitSymbol = () => {
    return unit;
  };

  const calculateTotal = (): number => {
    const value = parseFloat(weight);
    if (isNaN(value) || value <= 0) return 0;
    
    // Converter para kg/l se necessário
    let normalizedWeight = value;
    if (unit === 'g') {
      normalizedWeight = value / 1000; // gramas para kg
    } else if (unit === 'ml') {
      normalizedWeight = value / 1000; // ml para litros
    }
    
    return pricePerUnit * normalizedWeight;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const value = parseFloat(weight);

    if (isNaN(value) || value <= 0) {
      showToast('Informe um valor válido', 'error');
      return;
    }

    // Converter para unidade base (kg ou l)
    let normalizedWeight = value;
    if (unit === 'g') {
      normalizedWeight = value / 1000;
    } else if (unit === 'ml') {
      normalizedWeight = value / 1000;
    }

    onConfirm(normalizedWeight);
    onClose();
  };

  const handleClose = () => {
    setWeight('');
    onClose();
  };

  const total = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-brand-navy">Informar {getUnitLabel()}</h2>
          <p className="text-sm text-gray-600 mt-1">{productName}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade em {getUnitLabel()}
            </label>
            <div className="relative">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={unit === 'g' || unit === 'ml' ? '0' : '0.000'}
                step={unit === 'g' || unit === 'ml' ? '1' : '0.001'}
                min="0.001"
                className="w-full px-3 py-3 pr-12 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                autoFocus
              />
              <span className="absolute right-3 top-3 text-gray-500 text-lg font-medium">
                {getUnitSymbol()}
              </span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-blue-800">Preço por {getUnitSymbol()}:</span>
              <span className="text-sm font-semibold text-blue-900">
                R$ {pricePerUnit.toFixed(2)}
              </span>
            </div>
            {weight && parseFloat(weight) > 0 && (
              <>
                <div className="flex justify-between items-center pt-2 border-t border-blue-200 mt-2">
                  <span className="text-sm text-blue-800 font-medium">Total:</span>
                  <span className="text-xl font-bold text-blue-900">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  {weight} {getUnitSymbol()} × R$ {pricePerUnit.toFixed(2)}
                </p>
              </>
            )}
          </div>
        </form>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
