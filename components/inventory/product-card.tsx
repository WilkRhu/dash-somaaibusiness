'use client';

import { useState, useEffect } from 'react';
import { InventoryItem } from '@/lib/types/inventory';
import { formatCurrency } from '@/lib/utils/format';
import { offersApi } from '@/lib/api/offers';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';

interface ProductCardProps {
  product: InventoryItem;
  onEdit: (product: InventoryItem) => void;
  onUpdateStock: (product: InventoryItem) => void;
  onDelete: (product: InventoryItem) => void;
  onManageImages: (product: InventoryItem) => void;
}

export function ProductCard({ product, onEdit, onUpdateStock, onDelete, onManageImages }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeOffer, setActiveOffer] = useState<any>(null);
  const { currentEstablishment } = useEstablishmentStore();
  
  const isLowStock = product.quantity <= product.minQuantity;
  const isExpiringSoon = product.expirationDate && 
    new Date(product.expirationDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
    ? [product.image] 
    : [];

  // Verificar se há oferta ativa para este produto
  useEffect(() => {
    const checkOffer = async () => {
      if (!currentEstablishment?.id) return;
      
      try {
        const offerCheck = await offersApi.checkActiveOffer(currentEstablishment.id, product.id);
        if (offerCheck.hasOffer && offerCheck.offer) {
          setActiveOffer(offerCheck.offer);
        }
      } catch (error) {
        // Ignora erros silenciosamente
      }
    };
    
    checkOffer();
  }, [product.id, currentEstablishment]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 p-4 hover:shadow-md transition-shadow relative ${
      activeOffer ? 'border-orange-400 bg-orange-50/30' : 'border-gray-200'
    }`}>
      {/* Badge de Oferta */}
      {activeOffer && (
        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {Number(activeOffer.discountPercentage || 0).toFixed(0)}% OFF
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          {product.brand && (
            <p className="text-sm text-gray-500">{product.brand}</p>
          )}
          {product.category && (
            <span className="inline-block mt-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
              {product.category}
            </span>
          )}
        </div>
        {productImages.length > 0 && (
          <div className="relative ml-3">
            <img 
              src={productImages[currentImageIndex]} 
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            {productImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
                  {productImages.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1 h-1 rounded-full ${
                        idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Estoque:</span>
          <span className={`font-semibold flex items-center gap-1 ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
            {Math.floor(product.quantity)} {product.unit}
            {isLowStock && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Preço de Venda:</span>
          <div className="flex flex-col items-end">
            {activeOffer ? (
              <>
                <span className="text-gray-400 line-through text-xs">
                  {formatCurrency(Number(activeOffer.originalPrice || 0))}
                </span>
                <span className="font-bold text-orange-600">
                  {formatCurrency(Number(activeOffer.offerPrice || 0))}
                </span>
              </>
            ) : (
              <span className="font-semibold text-green-600">
                {formatCurrency(product.salePrice)}
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Preço de Custo:</span>
          <span className="text-gray-900">
            {formatCurrency(product.costPrice)}
          </span>
        </div>
        {product.barcode && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Código:</span>
            <span className="text-gray-900 font-mono text-xs">{product.barcode}</span>
          </div>
        )}
        {product.expirationDate && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Validade:</span>
            <span className={`flex items-center gap-1 ${isExpiringSoon ? 'text-orange-600 font-semibold' : 'text-gray-900'}`}>
              {new Date(product.expirationDate).toLocaleDateString('pt-BR')}
              {isExpiringSoon && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-3 border-t border-gray-200">
        <button
          onClick={() => onUpdateStock(product)}
          className="flex-1 px-3 py-2 text-sm bg-brand-blue text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Estoque
        </button>
        <button
          onClick={() => onManageImages(product)}
          className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          title="Gerenciar Imagens"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={() => onEdit(product)}
          className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          title="Editar"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(product)}
          className="px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          title="Excluir"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
