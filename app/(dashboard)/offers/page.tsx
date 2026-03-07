'use client';

import { useState, useEffect } from 'react';
import { useOffers } from '@/lib/hooks/use-offers';
import { OffersTable } from '@/components/offers/offers-table';
import { CreateOfferForm } from '@/components/offers/create-offer-form';
import { EditOfferForm } from '@/components/offers/edit-offer-form';
import { OfferAnalyticsModal } from '@/components/offers/offer-analytics-modal';
import { Offer, OfferFilters } from '@/lib/types/offers';

export default function OffersPage() {
  const { offers, isLoading, fetchOffers } = useOffers();
  const [currentFilters, setCurrentFilters] = useState<OfferFilters>({});
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [analyticsOffer, setAnalyticsOffer] = useState<Offer | null>(null);

  // Fetch inicial
  useEffect(() => {
    console.log('🔄 useEffect disparado - fetchOffers');
    fetchOffers(currentFilters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (newFilters: OfferFilters) => {
    setCurrentFilters(newFilters);
    fetchOffers(newFilters);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchOffers(currentFilters);
  };

  const handleEditSuccess = () => {
    setEditingOffer(null);
    fetchOffers(currentFilters);
  };

  const activeOffers = offers?.filter(o => o && o.isActive) || [];
  const inactiveOffers = offers?.filter(o => o && !o.isActive) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Ofertas</h1>
        <p className="text-gray-600 mt-1">Gerencie promoções e acompanhe performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total de Ofertas</p>
          <p className="text-2xl font-bold text-gray-900">{offers?.length || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600">Ofertas Ativas</p>
          <p className="text-2xl font-bold text-green-900">{activeOffers.length}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600">Total de Visualizações</p>
          <p className="text-2xl font-bold text-blue-900">
            {offers?.reduce((sum, o) => sum + (o?.viewCount || 0), 0) || 0}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600">Total de Conversões</p>
          <p className="text-2xl font-bold text-purple-900">
            {offers?.reduce((sum, o) => sum + (o?.conversionCount || 0), 0) || 0}
          </p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
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

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Nova Oferta
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando ofertas...</p>
          </div>
        ) : (
          <OffersTable
            offers={offers || []}
            onEdit={setEditingOffer}
            onViewAnalytics={setAnalyticsOffer}
          />
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nova Oferta</h2>
            <CreateOfferForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Oferta</h2>
            <EditOfferForm
              offer={editingOffer}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingOffer(null)}
            />
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {analyticsOffer && (
        <OfferAnalyticsModal
          offer={analyticsOffer}
          isOpen={!!analyticsOffer}
          onClose={() => setAnalyticsOffer(null)}
        />
      )}
    </div>
  );
}
