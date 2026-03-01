'use client';

import { formatCurrency } from '@/lib/utils/format';

interface OfferBadgeProps {
  originalPrice: number;
  offerPrice: number;
  discountPercentage: number;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function OfferBadge({ 
  originalPrice, 
  offerPrice, 
  discountPercentage,
  title,
  size = 'md' 
}: OfferBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="space-y-1">
      {/* Preços */}
      <div className="flex items-center gap-2">
        <span className={`text-gray-500 line-through ${sizeClasses[size]}`}>
          {formatCurrency(originalPrice)}
        </span>
        <span className={`font-bold text-green-600 ${size === 'lg' ? 'text-xl' : size === 'md' ? 'text-lg' : 'text-base'}`}>
          {formatCurrency(offerPrice)}
        </span>
      </div>

      {/* Badge de desconto */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {discountPercentage.toFixed(0)}% OFF
        </span>
        {title && (
          <span className="text-xs text-gray-600 truncate max-w-[150px]">
            {title}
          </span>
        )}
      </div>

      {/* Economia */}
      <p className="text-xs text-green-600 font-medium">
        Economize {formatCurrency(originalPrice - offerPrice)}
      </p>
    </div>
  );
}
