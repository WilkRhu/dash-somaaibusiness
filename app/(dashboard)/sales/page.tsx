'use client';

import { useState } from 'react';
import { useSales } from '@/lib/hooks/use-sales';
import { SaleStatus, PaymentMethod } from '@/lib/types/sale';
import { showToast } from '@/components/ui/toast';
import { salesApi } from '@/lib/api/sales';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import Link from 'next/link';

const statusLabels = {
  [SaleStatus.COMPLETED]: { label: 'Concluída', color: 'bg-green-100 text-green-800' },
  [SaleStatus.CANCELLED]: { label: 'Cancelada', color: 'bg-red-100 text-red-800' },
  [SaleStatus.PENDING]: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
};

const paymentLabels = {
  [PaymentMethod.CASH]: 'Dinheiro',
  [PaymentMethod.PIX]: 'PIX',
  [PaymentMethod.DEBIT_CARD]: 'Débito',
  [PaymentMethod.CREDIT_CARD]: 'Crédito',
  [PaymentMethod.BANK_TRANSFER]: 'Transferência',
};

export default function SalesPage() {
  const [statusFilter, setStatusFilter] = useState<SaleStatus | 'all'>('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [selectedCancellationReason, setSelectedCancellationReason] = useState<string>('');
  const [cancelReason, setCancelReason] = useState('');
  
  const { sales, isLoading, cancelSale, refetch } = useSales(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );
  const { currentEstablishment } = useEstablishmentStore();

  const handleCancelSale = async () => {
    if (!selectedSaleId || !cancelReason.trim()) {
      showToast('Informe o motivo do cancelamento', 'error');
      return;
    }

    try {
      await cancelSale(selectedSaleId, cancelReason);
      showToast('Venda cancelada com sucesso', 'success');
      setShowCancelModal(false);
      setSelectedSaleId(null);
      setCancelReason('');
      refetch();
    } catch (error: any) {
      showToast(error.message || 'Erro ao cancelar venda', 'error');
    }
  };

  const handleViewReason = (reason: string) => {
    setSelectedCancellationReason(reason);
    setShowReasonModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedSaleId || !currentEstablishment) return;

    try {
      await salesApi.confirmPayment(currentEstablishment.id, selectedSaleId);
      showToast('Pagamento confirmado com sucesso', 'success');
      setShowConfirmPaymentModal(false);
      setSelectedSaleId(null);
      refetch();
    } catch (error: any) {
      showToast(error.message || 'Erro ao confirmar pagamento', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-navy">Vendas</h1>
        <Link
          href="/sales/pos"
          className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
        >
          Nova Venda
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-brand-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          {Object.entries(statusLabels).map(([status, { label }]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as SaleStatus)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Carregando vendas...</div>
        ) : sales.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Nenhuma venda encontrada</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Número</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Itens</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Pagamento</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-brand-navy">{sale.saleNumber}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(sale.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{sale.items.length} item(s)</td>
                    <td className="py-3 px-4 text-gray-600">{paymentLabels[sale.paymentMethod]}</td>
                    <td className="py-3 px-4 text-right font-semibold text-brand-navy">
                      R$ {Number(sale.total || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusLabels[sale.status].color}`}>
                        {statusLabels[sale.status].label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {sale.status === SaleStatus.PENDING && (
                        <div className="flex flex-wrap items-center justify-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedSaleId(sale.id);
                              setShowConfirmPaymentModal(true);
                            }}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            Confirmar Pagamento
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSaleId(sale.id);
                              setShowCancelModal(true);
                            }}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                      {sale.status === SaleStatus.COMPLETED && (
                        <button
                          onClick={() => {
                            setSelectedSaleId(sale.id);
                            setShowCancelModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Cancelar
                        </button>
                      )}
                      {sale.status === SaleStatus.CANCELLED && sale.cancellationReason && (
                        <button
                          onClick={() => handleViewReason(sale.cancellationReason || '')}
                          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                        >
                          Ver motivo
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-brand-navy">Cancelar Venda</h2>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo do cancelamento
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Informe o motivo do cancelamento..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                rows={4}
                required
              />
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedSaleId(null);
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Voltar
              </button>
              <button
                onClick={handleCancelSale}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-brand-navy">Confirmar Pagamento</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Tem certeza que deseja confirmar o pagamento desta venda?
              </p>
              <p className="text-sm text-gray-500">
                O status será alterado de "Pendente" para "Concluída".
              </p>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmPaymentModal(false);
                  setSelectedSaleId(null);
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showReasonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-brand-navy">Motivo do Cancelamento</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedCancellationReason || 'Nenhum motivo informado.'}
              </p>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowReasonModal(false);
                  setSelectedCancellationReason('');
                }}
                className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
