'use client';

import { useState } from 'react';
import { InventoryItem, UNIT_OPTIONS, UpdateProductDto } from '@/lib/types/inventory';
import { CurrencyInput } from '@/components/ui/currency-input';

interface EditProductFormProps {
  product: InventoryItem;
  onSubmit: (data: UpdateProductDto) => Promise<void>;
  onCancel: () => void;
}

export function EditProductForm({ product, onSubmit, onCancel }: EditProductFormProps) {
  const totalQuantity = Number(product.quantity || 0);
  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category || '',
    brand: product.brand || '',
    costPrice: product.costPrice,
    salePrice: product.salePrice,
    quantity: Number(product.quantity || 0),
    shelfQuantity: Number(product.shelfQuantity ?? 0),
    storageQuantity: Math.max(Number(product.quantity || 0) - Number(product.shelfQuantity ?? 0), 0),
    minQuantity: Number(product.minQuantity || 0),
    unit: product.unit,
    expirationDate: product.expirationDate || '',
    description: product.description || '',
    trackStock: product.trackStock ?? true,
    image: product.image,
    images: product.images,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shelfQuantity = Number(formData.shelfQuantity || 0);
  const storageQuantity = Math.max(Number(formData.quantity || 0) - shelfQuantity, 0);
  const calculatedTotalQuantity = Number(formData.quantity || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Preparar dados para envio - enviar TODOS os campos para garantir sincronização
      const dataToSend: UpdateProductDto = {
        name: formData.name,
        category: formData.category || undefined,
        brand: formData.brand || undefined,
        costPrice: formData.costPrice,
        salePrice: formData.salePrice,
        quantity: formData.quantity,
        shelfQuantity: shelfQuantity,
        storageQuantity: storageQuantity,
        minQuantity: formData.minQuantity,
        unit: formData.unit,
        expirationDate: formData.expirationDate || undefined,
        description: formData.description || undefined,
        trackStock: formData.trackStock,
      };
      
      // Remover campos undefined para não sobrescrever dados no backend
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key as keyof UpdateProductDto] === undefined) {
          delete dataToSend[key as keyof UpdateProductDto];
        }
      });
      
      // NUNCA enviar image ou images no update - eles são gerenciados separadamente
      // Isso evita sobrescrever as imagens existentes
      
      await onSubmit(dataToSend);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Controle de Estoque</h3>
          <p className="text-xs text-gray-600 mt-1">
            {formData.trackStock 
              ? 'O estoque será controlado automaticamente nas vendas'
              : 'O estoque não será controlado (produto sem rastreamento)'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, trackStock: !formData.trackStock })}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            formData.trackStock ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              formData.trackStock ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

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

        <div className="md:col-span-2">
          <div className="border-t border-gray-200 pt-4 mt-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Estoque</h3>
            
            {formData.trackStock ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantidade Total *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      value={formData.quantity}
                      onChange={(e) => {
                        const newTotal = parseInt(e.target.value) || 0;
                        const currentShelf = formData.shelfQuantity;
                        const newStorage = Math.max(newTotal - currentShelf, 0);
                        setFormData({ 
                          ...formData, 
                          quantity: newTotal,
                          shelfQuantity: Math.min(currentShelf, newTotal),
                          storageQuantity: newStorage
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Quantidade total em estoque</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prateleira
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={formData.shelfQuantity}
                      onChange={(e) => setFormData({ ...formData, shelfQuantity: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Quantidade exposta na loja</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Depósito
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={storageQuantity}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Calculado automaticamente</p>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800">
                  <p className="font-medium mb-1">Distribuição de estoque:</p>
                  <p>Prateleira: {shelfQuantity} {formData.unit} + Depósito: {storageQuantity} {formData.unit} = Total: {calculatedTotalQuantity} {formData.unit}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-600">
                  <strong>Controle de estoque desativado</strong>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Ative o controle de estoque acima para gerenciar quantidades
                </p>
              </div>
            )}
          </div>
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
