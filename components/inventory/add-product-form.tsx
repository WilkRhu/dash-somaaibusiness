'use client';

import { useState, useEffect } from 'react';
import { AddProductDto, UNIT_OPTIONS } from '@/lib/types/inventory';
import { ImageUpload } from './image-upload';
import { CurrencyInput } from '@/components/ui/currency-input';
import { formatCurrency } from '@/lib/utils/format';

interface AddProductFormProps {
  onSubmit: (data: AddProductDto, imageFiles: File[]) => Promise<void>;
  onCancel: () => void;
}

export function AddProductForm({ onSubmit, onCancel }: AddProductFormProps) {
  const [formData, setFormData] = useState<AddProductDto>({
    name: '',
    costPrice: 0,
    salePrice: 0,
    quantity: 1,
    minQuantity: 1,
    unit: 'un',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para cálculo de preço por peso
  const [useBulkCalculation, setUseBulkCalculation] = useState(false);
  const [bulkCost, setBulkCost] = useState('');
  const [bulkQuantity, setBulkQuantity] = useState('');

  // Calcula a margem de lucro percentual
  const getProfitMargin = () => {
    if (formData.costPrice <= 0) return 0;
    return ((formData.salePrice - formData.costPrice) / formData.costPrice) * 100;
  };

  // Calcula o preço de custo por unidade quando usa cálculo em lote
  const calculateUnitCost = () => {
    const cost = parseFloat(bulkCost);
    const qty = parseFloat(bulkQuantity);
    if (!isNaN(cost) && !isNaN(qty) && qty > 0) {
      return cost / qty;
    }
    return 0;
  };

  // Atualiza o preço de custo quando muda os valores do lote
  useEffect(() => {
    if (useBulkCalculation) {
      const unitCost = calculateUnitCost();
      if (unitCost > 0) {
        setFormData(prev => ({ ...prev, costPrice: unitCost }));
      }
      
      // Atualiza a quantidade inicial com o peso total do lote
      const qty = parseFloat(bulkQuantity);
      if (!isNaN(qty) && qty > 0) {
        setFormData(prev => ({ ...prev, quantity: qty }));
      }
    }
  }, [bulkCost, bulkQuantity, useBulkCalculation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData, imageFiles);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto *
          </label>
          <input
            type="text"
            required
            minLength={3}
            maxLength={255}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código de Barras
          </label>
          <input
            type="text"
            maxLength={50}
            value={formData.barcode || ''}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <input
            type="text"
            maxLength={100}
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca
          </label>
          <input
            type="text"
            maxLength={100}
            value={formData.brand || ''}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unidade *
          </label>
          <select
            required
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          >
            {UNIT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {['kg', 'g', 'l', 'ml'].includes(formData.unit) && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-800">
                <strong>💡 Dica:</strong> No PDV, você poderá vender este produto informando o peso/volume exato (ex: 2.5kg, 350ml)
              </p>
            </div>
          )}
        </div>

        <CurrencyInput
          label="Preço de Custo"
          required
          value={formData.costPrice}
          onChange={(value) => setFormData({ ...formData, costPrice: value })}
        />

        {/* Opção de cálculo em lote/fardo */}
        {['kg', 'g', 'l', 'ml'].includes(formData.unit) && (
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="useBulkCalculation"
                checked={useBulkCalculation}
                onChange={(e) => {
                  setUseBulkCalculation(e.target.checked);
                  if (!e.target.checked) {
                    setBulkCost('');
                    setBulkQuantity('');
                  }
                }}
                className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue"
              />
              <label htmlFor="useBulkCalculation" className="text-sm font-medium text-gray-700 cursor-pointer">
                ✅ Calcular preço por {formData.unit} (compra em lote/fardo)
              </label>
            </div>
            
            {useBulkCalculation && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Total do Lote/Fardo
                  </label>
                  <input
                    type="text"
                    value={bulkCost ? `R$ ${bulkCost}` : ''}
                    onChange={(e) => {
                      // Remove R$ e espaços, mantém apenas números e ponto/vírgula
                      let value = e.target.value.replace(/[^\d.,]/g, '');
                      // Substitui vírgula por ponto
                      value = value.replace(',', '.');
                      setBulkCost(value);
                    }}
                    placeholder="R$ 100.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade Total ({formData.unit})
                  </label>
                  <input
                    type="text"
                    value={bulkQuantity}
                    onChange={(e) => {
                      // Mantém apenas números e ponto/vírgula
                      let value = e.target.value.replace(/[^\d.,]/g, '');
                      // Substitui vírgula por ponto
                      value = value.replace(',', '.');
                      setBulkQuantity(value);
                    }}
                    placeholder="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                </div>
                {calculateUnitCost() > 0 && (
                  <div className="col-span-2 p-3 bg-white border border-blue-300 rounded">
                    <p className="text-sm text-gray-700">
                      <strong>Custo por {formData.unit}:</strong>{' '}
                      <span className="text-brand-blue font-bold">
                        R$ {calculateUnitCost().toFixed(2)}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      R$ {bulkCost} ÷ {bulkQuantity} {formData.unit}
                    </p>
                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <p className="text-xs text-green-700">
                        ✓ Quantidade inicial será: <strong>{bulkQuantity} {formData.unit}</strong>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        O estoque será controlado em {formData.unit}, não em fardos/lotes
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <CurrencyInput
          label="Preço de Venda"
          required
          value={formData.salePrice}
          onChange={(value) => setFormData({ ...formData, salePrice: value })}
        />

        {formData.costPrice > 0 && formData.salePrice > 0 && (
          <div className="md:col-span-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Margem de Lucro:</span>{' '}
                <span className={`font-bold ${getProfitMargin() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {getProfitMargin().toFixed(2)}%
                </span>
                {' '}
                <span className="text-gray-600">
                  (Lucro: {formatCurrency(formData.salePrice - formData.costPrice)})
                </span>
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantidade Inicial *
          </label>
          <input
            type="number"
            required
            min="0"
            step="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            placeholder="Ex: 100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Quantidade em estoque ao cadastrar o produto
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estoque Mínimo *
          </label>
          <input
            type="number"
            required
            min="0"
            step="1"
            value={formData.minQuantity}
            onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            placeholder="Ex: 10"
          />
          <p className="text-xs text-gray-500 mt-1">
            Alerta quando o estoque atingir este valor
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Validade
          </label>
          <input
            type="date"
            value={formData.expirationDate || ''}
            onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>
      </div>

      <ImageUpload
        images={imageFiles}
        onImagesChange={setImageFiles}
        maxImages={4}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          rows={3}
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
          {isSubmitting ? 'Salvando...' : 'Adicionar Produto'}
        </button>
      </div>
    </form>
  );
}
