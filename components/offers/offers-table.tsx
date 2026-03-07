'use client';

import { useState } from 'react';
import { Offer } from '@/lib/types/offers';
import { useOffers } from '@/lib/hooks/use-offers';
import { showToast } from '@/components/ui/toast';
import { formatCurrency } from '@/lib/utils/format';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface OffersTableProps {
  offers: Offer[];
  onEdit?: (offer: Offer) => void;
  onViewAnalytics?: (offer: Offer) => void;
}

export function OffersTable({ offers, onEdit, onViewAnalytics }: OffersTableProps) {
  const { deleteOffer, activateOffer, deactivateOffer } = useOffers();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingOffer, setDeletingOffer] = useState<Offer | null>(null);

  const handleDelete = async () => {
    if (!deletingOffer) return;
    
    try {
      setLoadingId(deletingOffer.id);
      await deleteOffer(deletingOffer.id);
      showToast('Oferta excluída com sucesso', 'success');
      setDeletingOffer(null);
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleActive = async (offer: Offer) => {
    try {
      setLoadingId(offer.id);
      if (offer.isActive) {
        await deactivateOffer(offer.id);
        showToast('Oferta desativada', 'success');
      } else {
        await activateOffer(offer.id);
        showToast('Oferta ativada', 'success');
      }
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const isExpired = (endDate?: string) => endDate ? new Date(endDate) < new Date() : false;
  const isUpcoming = (startDate: string) => new Date(startDate) > new Date();

  if (offers.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Nenhuma oferta encontrada</p>
      </div>
    );
  }

  return (
    <>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Oferta</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preços</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {offers.filter(offer => offer && offer.id).map((offer) => (
            <tr key={offer.id} className="hover:bg-gray-50">
              <td className="px-4 py-4">
                <div>
                  <p className="font-medium text-gray-900">{offer?.title || 'Sem título'}</p>
                  {offer?.description && (
                    <p className="text-sm text-gray-500 line-clamp-1">{offer.description}</p>
                  )}
                </div>
              </td>
              <td className="px-4 py-4">
                <div>
                  <p className="text-sm text-gray-900">{offer.item?.name || 'N/A'}</p>
                  {offer.item?.quantity !== undefined && (
                    <p className={`text-xs ${offer.item.quantity <= 10 ? 'text-red-600' : 'text-gray-500'}`}>
                      Estoque: {offer.item.quantity}
                    </p>
                  )}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 line-through">
                    {formatCurrency(Number(offer.originalPrice || 0))}
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                    {formatCurrency(Number(offer.offerPrice || 0))}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Number(offer.discountPercentage || 0).toFixed(0)}% OFF
                  </p>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm">
                  <p className="text-gray-900">
                    {new Date(offer.startDate).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-gray-500">até</p>
                  {offer.endDate ? (
                    <p className="text-gray-900">
                      {new Date(offer.endDate).toLocaleDateString('pt-BR')}
                    </p>
                  ) : offer.durationHours ? (
                    <p className="text-gray-900">
                      {offer.durationHours}h de duração
                    </p>
                  ) : (
                    <p className="text-gray-500">-</p>
                  )}
                  {offer.whileStockLasts && (
                    <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Enquanto durar estoque
                    </p>
                  )}
                  {offer.radiusKm && (
                    <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Raio: {offer.radiusKm}km
                    </p>
                  )}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-1 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{offer?.viewCount || 0} visualizações</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span>{offer?.saveCount || 0} salvamentos</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{offer?.conversionCount || 0} conversões</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="space-y-1">
                  {offer.isActive ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ativa
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Inativa
                    </span>
                  )}
                  {isExpired(offer.endDate) && (
                    <span className="block text-xs text-red-600">Expirada</span>
                  )}
                  {isUpcoming(offer.startDate) && (
                    <span className="block text-xs text-blue-600">Agendada</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 text-right">
                <div className="flex justify-end gap-2">
                  {onViewAnalytics && (
                    <button
                      onClick={() => onViewAnalytics(offer)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      title="Ver Analytics"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleActive(offer)}
                    disabled={loadingId === offer.id}
                    className="text-sm px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
                    title={offer.isActive ? 'Desativar' : 'Ativar'}
                  >
                    {offer.isActive ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(offer)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Editar
                    </button>
                  )}
                  <button
                    onClick={() => setDeletingOffer(offer)}
                    disabled={loadingId === offer.id}
                    className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
    {deletingOffer && (
      <ConfirmModal
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a oferta "${deletingOffer.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeletingOffer(null)}
        isLoading={loadingId === deletingOffer.id}
      />
    )}
  </>
  );
}
