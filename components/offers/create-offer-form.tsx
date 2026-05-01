'use client';

import { useState } from 'react';
import { useOffers } from '@/lib/hooks/use-offers';
import { useInventory } from '@/lib/hooks/use-inventory';
import { CreateOfferDto } from '@/lib/types/offers';
import { showToast } from '@/components/ui/toast';

interface CreateOfferFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateOfferForm({ onSuccess, onCancel }: CreateOfferFormProps) {
  const { createOffer, isLoading, monthlyUsage } = useOffers();
  const { items } = useInventory();
  
  const [formData, setFormData] = useState<CreateOfferDto>({
    itemId: '',
    title: '',
    description: '',
    offerPrice: 0,
    startDate: '',
    endDate: '',
    durationHours: undefined,
    whileStockLasts: false,
    radiusKm: 5, // Padrão: 5km
  });

  const [durationType, setDurationType] = useState<'endDate' | 'duration'>('endDate');
  const [limitError, setLimitError] = useState<any>(null);

  const selectedItem = items.find(item => item.id === formData.itemId);
  const canCreateOffer = !monthlyUsage || monthlyUsage.canCreateOffer;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canCreateOffer) {
      showToast('Você atingiu o limite de ofertas do seu plano', 'error');
      return;
    }
    
    if (!selectedItem) {
      showToast('Selecione um produto', 'error');
      return;
    }

    if (formData.offerPrice >= Number(selectedItem.salePrice || 0)) {
      showToast('Preço da oferta deve ser menor que o preço original', 'error');
      return;
    }

    if (durationType === 'endDate') {
      if (!formData.endDate) {
        showToast('Data de término é obrigatória', 'error');
        return;
      }
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        showToast('Data de início deve ser anterior à data de término', 'error');
        return;
      }
      // Remove durationHours se usando endDate
      delete formData.durationHours;
    } else {
      if (!formData.durationHours || formData.durationHours <= 0) {
        showToast('Duração deve ser maior que zero', 'error');
        return;
      }
      // Remove endDate se usando durationHours
      delete formData.endDate;
    }

    try {
      await createOffer(formData);
      showToast('Oferta criada com sucesso!', 'success');
      onSuccess?.();
    } catch (error: any) {
      // Verificar se é erro de limite
      if (error.response?.data?.code === 'OFFERS_LIMIT_EXCEEDED') {
        setLimitError(error.response.data.details);
        showToast(error.response.data.message, 'error');
      } else {
        showToast(error.message, 'error');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Alerta de limite de ofertas */}
      {monthlyUsage && (
        <div className={`p-4 rounded-lg border ${
          monthlyUsage.canCreateOffer 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              monthlyUsage.canCreateOffer ? 'text-blue-600' : 'text-red-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {monthlyUsage.canCreateOffer ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              )}
            </svg>
            <div className="flex-1">
              <p className={`font-semibold ${
                monthlyUsage.canCreateOffer ? 'text-blue-900' : 'text-red-900'
              }`}>
                {monthlyUsage.isUnlimited ? (
                  'Ofertas Ilimitadas'
                ) : monthlyUsage.canCreateOffer ? (
                  `Ofertas: ${monthlyUsage.offersUsed}/${monthlyUsage.offersLimit}`
                ) : (
                  'Limite de Ofertas Atingido'
                )}
              </p>
              <p className={`text-sm mt-1 ${
                monthlyUsage.canCreateOffer ? 'text-blue-700' : 'text-red-700'
              }`}>
                {monthlyUsage.isUnlimited ? (
                  'Você tem ofertas ilimitadas neste plano'
                ) : monthlyUsage.canCreateOffer ? (
                  `Você pode criar ${monthlyUsage.offersRemaining} oferta(s) ainda este mês`
                ) : (
                  `Você atingiu o limite de ${monthlyUsage.offersLimit} ofertas para o plano ${monthlyUsage.currentPlan}`
                )}
              </p>
              {!monthlyUsage.canCreateOffer && (
                <div className="mt-2 flex gap-2">
                  <p className="text-xs text-red-600">
                    Próximo reset: {new Date(monthlyUsage.resetDate).toLocaleDateString('pt-BR')}
                  </p>
                  <a
                    href="/plans"
                    className="text-xs font-semibold text-red-600 hover:text-red-800 underline"
                  >
                    Upgrade do plano
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {limitError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="font-semibold text-red-900">Limite de Ofertas Atingido</p>
              <p className="text-sm text-red-700 mt-1">
                Você atingiu o limite de {limitError.offersLimit} ofertas por mês no plano {limitError.currentPlan}
              </p>
              <p className="text-xs text-red-600 mt-2">
                Próximo reset: {new Date(limitError.resetDate).toLocaleDateString('pt-BR')}
              </p>
              <a
                href={limitError.upgradeUrl}
                className="inline-block mt-2 text-sm font-semibold text-red-600 hover:text-red-800 underline"
              >
                Fazer upgrade do plano
              </a>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Produto *
        </label>
        <select
          value={formData.itemId}
          onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Selecione um produto</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} - R$ {Number(item.salePrice || 0).toFixed(2)} (Estoque: {item.quantity})
            </option>
          ))}
        </select>
      </div>

      {selectedItem && (
        <div className="p-3 bg-gray-50 rounded-lg space-y-1">
          <p className="text-sm text-gray-600">
            Preço original: <span className="font-semibold">R$ {Number(selectedItem.salePrice || 0).toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Estoque disponível: <span className={`font-semibold ${selectedItem.quantity <= 10 ? 'text-red-600' : 'text-green-600'}`}>
              {selectedItem.quantity} {selectedItem.unit || 'un'}
            </span>
          </p>
          {selectedItem.quantity <= 10 && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Estoque baixo! Considere ativar "Enquanto durar o estoque"
            </p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título da Oferta *
        </label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Promoção de Verão"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Descrição da oferta"
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
          value={formData.offerPrice || ''}
          onChange={(e) => setFormData({ ...formData, offerPrice: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="0.00"
          required
        />
        {selectedItem && formData.offerPrice > 0 && selectedItem.salePrice && (
          <p className="text-sm text-green-600 mt-1">
            Desconto: {(((Number(selectedItem.salePrice) - formData.offerPrice) / Number(selectedItem.salePrice)) * 100).toFixed(0)}%
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
            Tipo de Duração *
          </label>
          <select
            value={durationType}
            onChange={(e) => setDurationType(e.target.value as 'endDate' | 'duration')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="endDate">Data de Término</option>
            <option value="duration">Duração em Horas</option>
          </select>
        </div>
      </div>

      {durationType === 'endDate' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Término *
          </label>
          <input
            type="datetime-local"
            value={formData.endDate || ''}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duração (em horas) *
          </label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            value={formData.durationHours || ''}
            onChange={(e) => setFormData({ ...formData, durationHours: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 1, 6, 24, 168"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Exemplos: 1h, 6h, 24h (1 dia), 168h (1 semana)
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
        <input
          type="checkbox"
          id="whileStockLasts"
          checked={formData.whileStockLasts}
          onChange={(e) => setFormData({ ...formData, whileStockLasts: e.target.checked })}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="whileStockLasts" className="text-sm text-gray-700 cursor-pointer">
          Válido enquanto durar o estoque (desativa automaticamente quando estoque = 0)
        </label>
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
          placeholder="5"
          required
        />
        <div className="mt-2 space-y-1">
          <p className="text-xs text-gray-500">
            Define até que distância do estabelecimento a oferta será visível no app Consumer
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, radiusKm: 2 })}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              2km (Local)
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, radiusKm: 5 })}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              5km (Bairro)
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, radiusKm: 10 })}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              10km (Regional)
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, radiusKm: 20 })}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
            >
              20km (Amplo)
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading || !canCreateOffer}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Criando...' : !canCreateOffer ? 'Limite de Ofertas Atingido' : 'Criar Oferta'}
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
