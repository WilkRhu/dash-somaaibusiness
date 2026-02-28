'use client';

import { useState } from 'react';
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

  // Calcula a margem de lucro percentual
  const getProfitMargin = () => {
    if (formData.costPrice <= 0) return 0;
    return ((formData.salePrice - formData.costPrice) / formData.costPrice) * 100;
  };

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

        <CurrencyInput
          label="Preço de Custo"
          required
          value={formData.costPrice}
          onChange={(value) => setFormData({ ...formData, costPrice: value })}
        />

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
