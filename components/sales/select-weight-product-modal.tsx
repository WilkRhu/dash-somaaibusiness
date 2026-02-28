'use client';

import { InventoryItem } from '@/lib/types/inventory';

interface SelectWeightProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: InventoryItem) => void;
  products: InventoryItem[];
}

export default function SelectWeightProductModal({ 
  isOpen, 
  onClose, 
  onSelect,
  products
}: SelectWeightProductModalProps) {
  if (!isOpen) return null;

  const weightProducts = products.filter(p => 
    ['kg', 'g', 'l', 'ml'].includes(p.unit) && Number(p.quantity ?? 0) > 0
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-brand-navy">Selecionar Produto por Peso/Volume</h2>
          <p className="text-sm text-gray-600 mt-1">Escolha o produto para informar o peso/volume</p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {weightProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum produto por peso/volume disponível
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {weightProducts.map((product) => {
                const salePrice = Number(product.salePrice ?? 0);
                const imageUrl = (product.images && product.images.length > 0) ? product.images[0] : product.image;
                
                return (
                  <button
                    key={product.id}
                    onClick={() => {
                      onSelect(product);
                      onClose();
                    }}
                    className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-brand-blue hover:bg-blue-50 transition-all text-left"
                  >
                    {/* Imagem */}
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200">
                      {imageUrl ? (
                        <img 
                          src={imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400 text-2xl">📦</span>
                        </div>
                      )}
                    </div>

                    {/* Informações */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      {product.brand && (
                        <p className="text-sm text-gray-600">{product.brand}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-brand-blue font-bold">
                          R$ {salePrice.toFixed(2)}/{product.unit}
                        </span>
                        <span className="text-xs text-gray-500">
                          Estoque: {product.quantity} {product.unit}
                        </span>
                      </div>
                    </div>

                    {/* Ícone */}
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
