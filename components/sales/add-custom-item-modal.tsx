'use client';

import { useState } from 'react';
import { showToast } from '@/components/ui/toast';

interface AddCustomItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: { name: string; unitPrice: number; quantity: number }) => void;
}

export default function AddCustomItemModal({ isOpen, onClose, onAdd }: AddCustomItemModalProps) {
  const [name, setName] = useState('');
  const [priceType, setPriceType] = useState<'unit' | 'weight'>('unit');
  const [unitPrice, setUnitPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [weight, setWeight] = useState('');

  if (!isOpen) return null;

  const calculateTotal = (): number => {
    const price = parseFloat(unitPrice);
    
    if (priceType === 'weight') {
      const kg = parseFloat(weight);
      return isNaN(price) || isNaN(kg) ? 0 : price * kg;
    } else {
      const qty = parseInt(quantity);
      return isNaN(price) || isNaN(qty) ? 0 : price * qty;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Informe o nome do item', 'error');
      return;
    }

    const price = parseFloat(unitPrice);

    if (isNaN(price) || price <= 0) {
      showToast('Informe um preço válido', 'error');
      return;
    }

    if (priceType === 'weight') {
      const kg = parseFloat(weight);
      if (isNaN(kg) || kg <= 0) {
        showToast('Informe um peso válido', 'error');
        return;
      }

      // Para itens por peso, a quantidade é o peso e o preço unitário é o preço por kg
      onAdd({
        name: `${name.trim()} (${kg}kg)`,
        unitPrice: price,
        quantity: kg,
      });
    } else {
      const qty = parseInt(quantity);
      if (isNaN(qty) || qty <= 0) {
        showToast('Informe uma quantidade válida', 'error');
        return;
      }

      onAdd({
        name: name.trim(),
        unitPrice: price,
        quantity: qty,
      });
    }

    // Limpar campos
    setName('');
    setUnitPrice('');
    setQuantity('1');
    setWeight('');
    setPriceType('unit');
    onClose();
    showToast('Item avulso adicionado', 'success');
  };

  const handleClose = () => {
    setName('');
    setUnitPrice('');
    setQuantity('1');
    setWeight('');
    setPriceType('unit');
    onClose();
  };

  const total = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-brand-navy">Adicionar Item Avulso</h2>
          <p className="text-sm text-gray-600 mt-1">Item que não está cadastrado no estoque</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Item *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Produto avulso"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              autoFocus
              required
            />
          </div>

          {/* Tipo de Preço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Venda
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setPriceType('unit');
                  setWeight('');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  priceType === 'unit'
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Por Unidade
              </button>
              <button
                type="button"
                onClick={() => {
                  setPriceType('weight');
                  setQuantity('1');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  priceType === 'weight'
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Por Peso (kg)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {priceType === 'unit' ? 'Preço Unitário *' : 'Preço por Kg *'}
            </label>
            <input
              type="text"
              value={unitPrice}
              onChange={(e) => {
                // Remove tudo exceto números
                const value = e.target.value.replace(/\D/g, '');
                setUnitPrice(value);
              }}
              onBlur={(e) => {
                // Formata ao sair do campo
                const value = e.target.value.replace(/\D/g, '');
                if (value) {
                  const formatted = (parseFloat(value) / 100).toFixed(2);
                  setUnitPrice(formatted);
                }
              }}
              placeholder="R$ 0,00"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              required
            />
          </div>

          {priceType === 'unit' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade *
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
                min="1"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.000"
                  step="0.001"
                  min="0.001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  required
                />
                <span className="absolute right-3 top-2 text-gray-500">kg</span>
              </div>
            </div>
          )}

          {/* Preview do Total */}
          {total > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-800 font-medium">Total:</span>
                <span className="text-xl font-bold text-blue-900">
                  R$ {total.toFixed(2)}
                </span>
              </div>
              {priceType === 'weight' && weight && (
                <p className="text-xs text-blue-600 mt-1">
                  R$ {unitPrice}/kg × {weight}kg
                </p>
              )}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Atenção:</strong> Este item não será descontado do estoque.
            </p>
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
