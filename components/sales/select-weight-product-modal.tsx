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

  const getUnitIcon = (unit: string) => {
    if (unit === 'kg' || unit === 'g') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    );
  };

  const getUnitLabel = (unit: string) => {
    const labels: Record<string, string> = {
      'kg': 'Quilograma',
      'g': 'Grama',
      'l': 'Litro',
      'ml': 'Mililitro'
    };
    return labels[unit] || unit;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-brand-navy">Selecionar Produto por Peso/Volume</h2>
          <p className="text-sm text-gray-600 mt-1">
            Produtos vendidos por kg, g, l ou ml - você informará a quantidade exata
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {weightProducts.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <p className="text-gray-500 font-medium">Nenhum produto por peso/volume disponível</p>
              <p className="text-sm text-gray-400 mt-2">
                Cadastre produtos com unidade kg, g, l ou ml no inventário
              </p>
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
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-gray-600">
                          {getUnitIcon(product.unit)}
                        </div>
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {getUnitLabel(product.unit)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      {product.brand && (
                        <p className="text-sm text-gray-600">{product.brand}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-brand-blue font-bold text-lg">
                          R$ {salePrice.toFixed(2)}/{product.unit}
                        </span>
                        <span className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
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
