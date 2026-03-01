'use client';

import { useState } from 'react';
import { Offer, UpdateOfferDto } from '@/lib/types/offers';
import { useOffers } from '@/lib/hooks/use-offers';
import { showToast } from '@/components/ui/toast';

interface EditOfferFormProps {
  offer: Offer;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditOfferForm({ offer, onSuccess, onCancel }: EditOfferFormProps) {
  const { updateOffer, isLoading } = useOffers();
  
  const [formData, setFormData] = useState<UpdateOfferDto>({
    title: offer.title,
    description: offer.description || '',
    offerPrice: offer.offerPrice,
    startDate: offer.startDate.slice(0, 16),
    endDate: offer.endDate?.slice(0, 16) || '',
    radiusKm: offer.radiusKm || 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.offerPrice && formData.offerPrice >= Number(offer.originalPrice || 0)) {
      showToast('Preço da oferta deve ser menor que o preço original', 'error');
      return;
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      showToast('Data de início deve ser anterior à data de término', 'error');
      return;
    }

    try {
      await updateOffer(offer.id, formData);
      showToast('Oferta atualizada com sucesso!', 'success');
      onSuccess?.();
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Produto: <span className="font-semibold">{offer.item?.name}</span>
        </p>
        <p className="text-sm text-gray-600">
          Preço original: <span className="font-semibold">R$ {Number(offer.originalPrice || 0).toFixed(2)}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título da Oferta *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preço da Oferta *
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={formData.offerPrice}
          onChange={(e) => setFormData({ ...formData, offerPrice: parseFloat(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
        {formData.offerPrice && formData.offerPrice > 0 && (
          <p className="text-sm text-green-600 mt-1">
            Desconto: {(((Number(offer.originalPrice) - formData.offerPrice) / Number(offer.originalPrice)) * 100).toFixed(0)}%
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Início *
          </label>
          <input
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Término *
          </label>
          <input
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Raio de Alcance (km) *
        </label>
        <input
          type="number"
          min="0.5"
          max="20"
          step="0.5"
          value={formData.radiusKm || ''}
          onChange={(e) => setFormData({ ...formData, radiusKm: parseFloat(e.target.value) || undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
        <div className="mt-2 space-y-1">
          <p className="text-xs text-gray-500">
            Define até que distância do estabelecimento a oferta será visível
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, radiusKm: 2 })}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              2km
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, radiusKm: 5 })}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              5km
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, radiusKm: 10 })}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              10km
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, radiusKm: 20 })}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              20km
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
