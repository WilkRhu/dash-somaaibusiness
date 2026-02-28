'use client';

import { useState } from 'react';
import { InventoryItem, UNIT_OPTIONS } from '@/lib/types/inventory';
import { CurrencyInput } from '@/components/ui/currency-input';

interface EditProductFormProps {
  product: InventoryItem;
  onSubmit: (data: Partial<InventoryItem>) => Promise<void>;
  onCancel: () => void;
}

export function EditProductForm({ product, onSubmit, onCancel }: EditProductFormProps) {
  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category || '',
    brand: product.brand || '',
    costPrice: product.costPrice,
    salePrice: product.salePrice,
    minQuantity: product.minQuantity,
    unit: product.unit,
    expirationDate: product.expirationDate || '',
    description: product.description || '',
    image: product.image,
    images: product.images,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Preparar dados para envio
      const dataToSend: any = {};
      
      // Adicionar apenas campos que foram modificados ou que têm valor
      if (formData.name !== product.name) dataToSend.name = formData.name;
      if (formData.category !== (product.category || '')) dataToSend.category = formData.category || undefined;
      if (formData.brand !== (product.brand || '')) dataToSend.brand = formData.brand || undefined;
      if (formData.costPrice !== product.costPrice) dataToSend.costPrice = formData.costPrice;
      if (formData.salePrice !== product.salePrice) dataToSend.salePrice = formData.salePrice;
      if (formData.minQuantity !== product.minQuantity) dataToSend.minQuantity = formData.minQuantity;
      if (formData.unit !== product.unit) dataToSend.unit = formData.unit;
      if (formData.expirationDate !== (product.expirationDate || '')) dataToSend.expirationDate = formData.expirationDate || undefined;
      if (formData.description !== (product.description || '')) dataToSend.description = formData.description || undefined;
      
      // NUNCA enviar image ou images no update - eles são gerenciados separadamente
      // Isso evita sobrescrever as imagens existentes
      
      await onSubmit(dataToSend);
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
            Categoria
          </label>
          <input
            type="text"
            maxLength={100}
            value={formData.category}
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
            value={formData.brand}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estoque Mínimo *
          </label>
          <input
            type="number"
            required
            min="0"
            value={formData.minQuantity}
            onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) })}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Validade
          </label>
          <input
            type="date"
            value={formData.expirationDate}
            onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          rows={3}
          value={formData.description}
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
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  );
}
