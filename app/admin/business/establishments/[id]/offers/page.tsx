'use client';

import { useState, useEffect, use } from 'react';
import { offersApi } from '@/lib/api/offers';
import { Offer, OfferFilters } from '@/lib/types/offers';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function AdminEstablishmentOffersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: establishmentId } = use(params);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<OfferFilters>({});

  const fetchOffers = async (filters?: OfferFilters) => {
    try {
      setIsLoading(true);
      const response = await offersApi.list(establishmentId, filters);
      const offersData = response.data || [];
      setOffers(offersData);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar ofertas:', err);
      setError(err.message || 'Erro ao carregar ofertas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers(currentFilters);
  }, [establishmentId]);

  const handleFilterChange = (newFilters: OfferFilters) => {
    setCurrentFilters(newFilters);
    fetchOffers(newFilters);
  };

  const handleToggleActive = async (offer: Offer) => {
    try {
      if (offer.isActive) {
        await offersApi.deactivate(establishmentId, offer.id);
      } else {
        await offersApi.activate(establishmentId, offer.id);
      }
      fetchOffers(currentFilters);
    } catch (err: any) {
      console.error('Erro ao alternar oferta:', err);
      alert(err.message || 'Erro ao alternar oferta');
    }
  };

  const handleDelete = async (offerId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta oferta?')) return;
    
    try {
      await offersApi.delete(establishmentId, offerId);
      fetchOffers(currentFilters);
    } catch (err: any) {
      console.error('Erro ao excluir oferta:', err);
      alert(err.message || 'Erro ao excluir oferta');
    }
  };

  const activeOffers = offers.filter(o => o.isActive);
  const inactiveOffers = offers.filter(o => !o.isActive);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <a
          href="/admin/business/establishments"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para Estabelecimentos
        </a>
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Ofertas</h1>
        <p className="text-gray-600 mt-1">Gerencie promoções do estabelecimento</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total de Ofertas</p>
          <p className="text-2xl font-bold text-gray-900">{offers.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600">Ofertas Ativas</p>
          <p className="text-2xl font-bold text-green-900">{activeOffers.length}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600">Total de Visualizações</p>
          <p className="text-2xl font-bold text-blue-900">
            {offers.reduce((sum, o) => sum + (o.viewCount || 0), 0)}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600">Total de Conversões</p>
          <p className="text-2xl font-bold text-purple-900">
            {offers.reduce((sum, o) => sum + (o.conversionCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => handleFilterChange({})}
            className={`px-4 py-2 rounded-lg ${
              currentFilters.isActive === undefined ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => handleFilterChange({ isActive: true })}
            className={`px-4 py-2 rounded-lg ${
              currentFilters.isActive === true ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Ativas
          </button>
          <button
            onClick={() => handleFilterChange({ isActive: false })}
            className={`px-4 py-2 rounded-lg ${
              currentFilters.isActive === false ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Inativas
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando ofertas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma oferta encontrada</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Título</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Preço Original</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Preço Oferta</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Desconto</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{offer.title}</p>
                    {offer.description && (
                      <p className="text-sm text-gray-500 truncate max-w-xs">{offer.description}</p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    R$ {Number(offer.originalPrice).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-medium text-green-600">
                    R$ {Number(offer.offerPrice).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-medium">
                      {offer.discountPercentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                      offer.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {offer.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(offer)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          offer.isActive
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {offer.isActive ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => handleDelete(offer.id)}
                        className="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}