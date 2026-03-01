'use client';

import { useEffect, useState } from 'react';
import { Offer, OfferAnalytics } from '@/lib/types/offers';
import { useOffers } from '@/lib/hooks/use-offers';
import { formatCurrency } from '@/lib/utils/format';

interface OfferAnalyticsModalProps {
  offer: Offer;
  isOpen: boolean;
  onClose: () => void;
}

export function OfferAnalyticsModal({ offer, isOpen, onClose }: OfferAnalyticsModalProps) {
  const { getAnalytics } = useOffers();
  const [analytics, setAnalytics] = useState<OfferAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAnalytics();
    }
  }, [isOpen, offer.id]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    const data = await getAnalytics(offer.id);
    setAnalytics(data);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analytics da Oferta</h2>
              <p className="text-gray-600 mt-1">{offer.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando analytics...</p>
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  analytics.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {analytics.isActive ? 'Ativa' : 'Inativa'}
                </span>
                <span className="text-sm text-gray-600">
                  {new Date(analytics.startDate).toLocaleDateString('pt-BR')} - {new Date(analytics.endDate).toLocaleDateString('pt-BR')}
                </span>
              </div>

              {/* Métricas principais */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Visualizações</p>
                  <p className="text-2xl font-bold text-blue-900">{analytics.viewCount}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 mb-1">Salvamentos</p>
                  <p className="text-2xl font-bold text-purple-900">{analytics.saveCount}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 mb-1">Conversões</p>
                  <p className="text-2xl font-bold text-green-900">{analytics.conversionCount}</p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600 mb-1">Receita Total</p>
                  <p className="text-2xl font-bold text-yellow-900">{formatCurrency(analytics.totalRevenue)}</p>
                </div>
              </div>

              {/* Taxas de conversão */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Taxa de Salvamento</p>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-gray-900">{analytics.saveRate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-500 mb-1">
                      {analytics.saveCount} de {analytics.viewCount}
                    </p>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${Math.min(analytics.saveRate, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Taxa de Conversão</p>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-gray-900">{analytics.conversionRate.toFixed(1)}%</p>
                    <p className="text-sm text-gray-500 mb-1">
                      {analytics.conversionCount} de {analytics.viewCount}
                    </p>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${Math.min(analytics.conversionRate, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Insights</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  {analytics.conversionRate > 10 && (
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Excelente taxa de conversão! Esta oferta está performando muito bem.</span>
                    </li>
                  )}
                  {analytics.saveRate > 20 && (
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">ℹ</span>
                      <span>Alta taxa de salvamento indica interesse dos consumidores.</span>
                    </li>
                  )}
                  {analytics.viewCount > 100 && analytics.conversionRate < 5 && (
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600">⚠</span>
                      <span>Muitas visualizações mas poucas conversões. Considere ajustar o preço ou descrição.</span>
                    </li>
                  )}
                  {analytics.totalRevenue > 0 && (
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">💰</span>
                      <span>Receita gerada: {formatCurrency(analytics.totalRevenue)}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Não foi possível carregar os dados</p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
