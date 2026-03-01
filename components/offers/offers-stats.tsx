'use client';

import { Offer } from '@/lib/types/offers';
import { formatCurrency } from '@/lib/utils/format';

interface OffersStatsProps {
  offers: Offer[];
}

export function OffersStats({ offers }: OffersStatsProps) {
  const activeOffers = offers.filter(o => o.isActive);
  const totalViews = offers.reduce((sum, o) => sum + o.viewCount, 0);
  const totalSaves = offers.reduce((sum, o) => sum + o.saveCount, 0);
  const totalConversions = offers.reduce((sum, o) => sum + o.conversionCount, 0);
  const totalRevenue = offers.reduce((sum, o) => sum + (o.conversionCount * o.offerPrice), 0);
  
  const avgConversionRate = totalViews > 0 
    ? (totalConversions / totalViews) * 100 
    : 0;

  const stats = [
    {
      label: 'Total de Ofertas',
      value: offers.length,
      icon: '🏷️',
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Ofertas Ativas',
      value: activeOffers.length,
      icon: '✅',
      color: 'bg-green-50 text-green-600',
      borderColor: 'border-green-200',
    },
    {
      label: 'Total de Visualizações',
      value: totalViews.toLocaleString('pt-BR'),
      icon: '👁️',
      color: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      label: 'Total de Conversões',
      value: totalConversions,
      icon: '🎯',
      color: 'bg-orange-50 text-orange-600',
      borderColor: 'border-orange-200',
    },
    {
      label: 'Taxa de Conversão Média',
      value: `${avgConversionRate.toFixed(1)}%`,
      icon: '📈',
      color: 'bg-indigo-50 text-indigo-600',
      borderColor: 'border-indigo-200',
    },
    {
      label: 'Receita Total',
      value: formatCurrency(totalRevenue),
      icon: '💰',
      color: 'bg-yellow-50 text-yellow-600',
      borderColor: 'border-yellow-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg border ${stat.borderColor} ${stat.color}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{stat.icon}</span>
            <span className="text-xs font-medium opacity-75">{stat.label}</span>
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
