'use client';

import { Offer } from '@/lib/types/offers';
import { formatCurrency } from '@/lib/utils/format';
import Image from 'next/image';

interface OfferCardProps {
  offer: Offer;
  onEdit?: () => void;
  onViewAnalytics?: () => void;
  onToggleActive?: () => void;
}

export function OfferCard({ offer, onEdit, onViewAnalytics, onToggleActive }: OfferCardProps) {
  const isExpired = offer.endDate ? new Date(offer.endDate) < new Date() : false;
  const isUpcoming = new Date(offer.startDate) > new Date();
  const daysRemaining = offer.endDate ? Math.ceil((new Date(offer.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-100">
        {offer.item?.images?.[0] ? (
          <Image
            src={offer.item.images[0]}
            alt={offer.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          {offer.isActive ? (
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
              Ativa
            </span>
          ) : (
            <span className="px-2 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full">
              Inativa
            </span>
          )}
        </div>

        {/* Discount Badge */}
        <div className="absolute top-2 left-2">
          <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
            {offer.discountPercentage.toFixed(0)}% OFF
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
          {offer.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {offer.description || offer.item?.name}
        </p>

        {/* Prices */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-green-600">
            {formatCurrency(offer.offerPrice)}
          </span>
          <span className="text-sm text-gray-500 line-through">
            {formatCurrency(offer.originalPrice)}
          </span>
        </div>

        {/* Period */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>
            {isExpired ? (
              <span className="text-red-600 font-medium">Expirada</span>
            ) : isUpcoming ? (
              <span className="text-blue-600 font-medium">Inicia em {new Date(offer.startDate).toLocaleDateString('pt-BR')}</span>
            ) : daysRemaining !== null ? (
              <span>
                {daysRemaining > 0 ? `${daysRemaining} dias restantes` : 'Último dia'}
              </span>
            ) : (
              <span>Sem data de término</span>
            )}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-gray-50 rounded">
          <div className="text-center">
            <p className="text-xs text-gray-500">Views</p>
            <p className="font-semibold text-gray-900">{offer.viewCount}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Salvos</p>
            <p className="font-semibold text-gray-900">{offer.saveCount}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Vendas</p>
            <p className="font-semibold text-gray-900">{offer.conversionCount}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {onToggleActive && (
            <button
              onClick={onToggleActive}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {offer.isActive ? '⏸️ Pausar' : '▶️ Ativar'}
            </button>
          )}
          {onViewAnalytics && (
            <button
              onClick={onViewAnalytics}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              title="Ver Analytics"
            >
              📊
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Editar"
            >
              ✏️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
