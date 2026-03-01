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
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <div>
                  <p className="text-xs text-blue-800 font-medium">Produto vendido por peso/volume</p>
                  <p className="text-xs text-gray-700 mt-1">
                    No PDV você poderá vender quantidades variáveis deste produto (ex: 2.5kg, 350ml, etc)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seção de Preço de Custo */}
        <div className="md:col-span-2">
          <div className="border-t border-gray-200 pt-4 mt-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-900">Preços</h3>
            </div>
          </div>
        </div>

        {/* Opção de cálculo em lote/fardo - ANTES do campo de custo */}
        {['kg', 'g', 'l', 'ml'].includes(formData.unit) && (
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3 p-3 bg-gray-50 rounded-lg">
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
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <label htmlFor="useBulkCalculation" className="text-sm font-medium text-gray-700 cursor-pointer">
                Comprei em lote/fardo? Calcular custo por {formData.unit}
              </label>
            </div>
            
            {useBulkCalculation && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg mb-4">
                <div className="col-span-2">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm text-blue-900 font-medium">
                      Exemplo: Comprei um fardo de 10kg por R$ 120,00
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quanto paguei no total? *
                  </label>
                  <input
                    type="text"
                    value={bulkCost ? `R$ ${bulkCost}` : ''}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^\d.,]/g, '');
                      value = value.replace(',', '.');
                      setBulkCost(value);
                    }}
                    placeholder="R$ 120.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                  <p className="text-xs text-gray-600 mt-1">Preço total do lote/fardo</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantos {formData.unit} tem no total? *
                  </label>
                  <input
                    type="text"
                    value={bulkQuantity}
                    onChange={(e) => {
                      let value = e.target.value.replace(/[^\d.,]/g, '');
                      value = value.replace(',', '.');
                      setBulkQuantity(value);
                    }}
                    placeholder="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  />
                  <p className="text-xs text-gray-600 mt-1">Peso/volume total do lote</p>
                </div>
                {calculateUnitCost() > 0 && (
                  <div className="col-span-2 p-4 bg-white border-2 border-green-400 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Custo calculado: <span className="text-green-600 text-lg">R$ {calculateUnitCost().toFixed(2)}</span> por {formData.unit}
                        </p>
                        <p className="text-xs text-gray-600">
                          R$ {bulkCost} ÷ {bulkQuantity} {formData.unit} = R$ {calculateUnitCost().toFixed(2)}/{formData.unit}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <div>
                          <p className="text-xs text-gray-700 font-medium">
                            Estoque inicial: {bulkQuantity} {formData.unit}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            O sistema controlará o estoque em {formData.unit}. Quando vender 2.5{formData.unit}, o estoque diminuirá 2.5{formData.unit}.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <CurrencyInput
          label={useBulkCalculation ? "Preço de Custo (calculado automaticamente)" : "Preço de Custo *"}
          required
          value={formData.costPrice}
          onChange={(value) => setFormData({ ...formData, costPrice: value })}
          disabled={useBulkCalculation}
        />
        <CurrencyInput
          label="Preço de Venda *"
          required
          value={formData.salePrice}
          onChange={(value) => setFormData({ ...formData, salePrice: value })}
        />

        {formData.costPrice > 0 && formData.salePrice > 0 && (
          <div className="md:col-span-2">
            <div className={`border-2 rounded-lg p-4 ${
              getProfitMargin() >= 0 
                ? 'bg-green-50 border-green-300' 
                : 'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Margem de Lucro</p>
                  <p className={`text-2xl font-bold ${
                    getProfitMargin() >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {getProfitMargin() >= 0 ? '+' : ''}{getProfitMargin().toFixed(2)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-1">Lucro por {formData.unit}</p>
                  <p className={`text-xl font-bold ${
                    (formData.salePrice - formData.costPrice) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(formData.salePrice - formData.costPrice)}
                  </p>
                </div>
              </div>
              {getProfitMargin() < 0 && (
                <div className="mt-3 pt-3 border-t border-red-200">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-sm text-red-700 font-medium">
                        Atenção: Você está vendendo com prejuízo!
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        O preço de venda está menor que o custo. Revise os valores.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {getProfitMargin() >= 0 && getProfitMargin() < 20 && (
                <div className="mt-3 pt-3 border-t border-yellow-200 bg-yellow-50 -mx-4 -mb-4 px-4 pb-4 rounded-b-lg">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-yellow-700">
                      Margem baixa. Considere aumentar o preço de venda para ter mais lucro.
                    </p>
                  </div>
                </div>
              )}
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
