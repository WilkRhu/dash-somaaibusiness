'use client';

import { useState, useEffect } from 'react';
import { showToast } from '@/components/ui/toast';

interface Product {
  productName: string;
  quantity: number;
  unitPrice: number;
  notes: string;
  category?: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
  categories: string[];
  onCreateCategory?: (categoryName: string) => void;
}

const DEFAULT_CATEGORIES = [
  'Bebidas',
  'Alimentos',
  'Lanches',
  'Sobremesas',
  'Café',
  'Sucos',
  'Refrigerantes',
  'Cerveja',
  'Vinho',
  'Destilados',
  'Higiene Pessoal',
  'Limpeza',
  'Eletrônicos',
  'Roupas',
  'Calçados',
  'Acessórios',
  'Livros',
  'Brinquedos',
  'Esportes',
  'Beleza',
  'Medicamentos',
  'Vitaminas',
  'Suplementos',
  'Artigos de Festa',
  'Decoração',
  'Móveis',
  'Utensílios de Cozinha',
  'Louças',
  'Vidros',
  'Papel e Papelão',
  'Embalagens',
];

export default function AddProductModal({
  isOpen,
  onClose,
  onAdd,
  categories,
  onCreateCategory,
}: AddProductModalProps) {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [notes, setNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Merge default categories with existing categories
  const mergedCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...categories])).sort();

  useEffect(() => {
    if (isOpen) {
      setProductName('');
      setQuantity(1);
      setUnitPrice(0);
      setNotes('');
      setSelectedCategory('');
      setShowCreateCategory(false);
      setNewCategoryName('');
    }
  }, [isOpen]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      showToast('Informe o nome da categoria', 'error');
      return;
    }

    try {
      setIsLoading(true);
      if (onCreateCategory) {
        await onCreateCategory(newCategoryName);
        setSelectedCategory(newCategoryName);
        setNewCategoryName('');
        setShowCreateCategory(false);
        showToast('Categoria criada com sucesso!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Erro ao criar categoria', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim()) {
      showToast('Informe o nome do produto', 'error');
      return;
    }

    if (quantity <= 0) {
      showToast('Quantidade deve ser maior que 0', 'error');
      return;
    }

    if (unitPrice <= 0) {
      showToast('Preço deve ser maior que 0', 'error');
      return;
    }

    onAdd({
      productName: productName.trim(),
      quantity,
      unitPrice,
      notes,
      category: selectedCategory || undefined,
    });

    setProductName('');
    setQuantity(1);
    setUnitPrice(0);
    setNotes('');
    setSelectedCategory('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b px-6 py-4 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Adicionar Produto</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Categoria */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Categoria
            </label>
            {!showCreateCategory ? (
              <div className="space-y-2">
                {mergedCategories.length > 0 && (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione uma categoria</option>
                    {mergedCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  type="button"
                  onClick={() => setShowCreateCategory(true)}
                  className="w-full px-4 py-2 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                >
                  + Criar Nova Categoria
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nome da categoria"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateCategory(false);
                      setNewCategoryName('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    {isLoading ? 'Criando...' : 'Criar'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Nome do Produto */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Produto *
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ex: Hambúrguer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Quantidade */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantidade *
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Preço */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preço Unitário *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={unitPrice}
              onChange={(e) => setUnitPrice(parseFloat(e.target.value))}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Subtotal */}
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm text-gray-600">Subtotal</div>
            <div className="text-2xl font-bold text-blue-600">
              R$ {(quantity * unitPrice).toFixed(2)}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Sem cebola, bem passado"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
