'use client';

import { useState, useEffect } from 'react';
import { reportsApi, SalesDetailsResponse } from '@/lib/api/reports';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { formatCurrency } from '@/lib/utils/format';
import { Sale } from '@/lib/types/sale';

interface SalesDetailsTableProps {
  filters: {
    startDate: string;
    endDate: string;
    status: 'completed' | 'cancelled' | 'pending' | '';
    paymentMethod?: string;
  };
}

const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Dinheiro',
  pix: 'PIX',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  bank_transfer: 'Transferência',
};

const STATUS_LABELS: Record<string, string> = {
  completed: 'Concluída',
  cancelled: 'Cancelada',
  pending: 'Pendente',
};

export function SalesDetailsTable({ filters }: SalesDetailsTableProps) {
  const [data, setData] = useState<SalesDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const { currentEstablishment } = useEstablishmentStore();

  useEffect(() => {
    if (!currentEstablishment) return;

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await reportsApi.getSalesDetails(currentEstablishment.id, {
          ...filters,
          status: filters.status || undefined,
          page,
          limit: 20,
        });
        setData(response);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar detalhes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [currentEstablishment, filters, page]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-brand-navy">Carregando vendas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-brand-navy">
            Detalhes das Vendas
          </h2>
          <div className="text-sm text-brand-navy/70">
            {data.summary.salesCount} vendas • {formatCurrency(data.summary.totalRevenue)}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-brand-navy font-semibold">Número</th>
                <th className="text-left py-3 px-4 text-brand-navy font-semibold">Data/Hora</th>
                <th className="text-left py-3 px-4 text-brand-navy font-semibold">Cliente</th>
                <th className="text-left py-3 px-4 text-brand-navy font-semibold">Pagamento</th>
                <th className="text-left py-3 px-4 text-brand-navy font-semibold">Status</th>
                <th className="text-right py-3 px-4 text-brand-navy font-semibold">Desconto</th>
                <th className="text-right py-3 px-4 text-brand-navy font-semibold">Total</th>
                <th className="text-center py-3 px-4 text-brand-navy font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((sale) => (
                <tr key={sale.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-brand-navy font-medium">
                    {sale.saleNumber}
                  </td>
                  <td className="py-3 px-4 text-brand-navy text-sm">
                    {new Date(sale.createdAt).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-4 text-brand-navy text-sm">
                    {sale.customerId || '-'}
                  </td>
                  <td className="py-3 px-4 text-brand-navy text-sm">
                    {PAYMENT_LABELS[sale.paymentMethod] || sale.paymentMethod}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sale.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : sale.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {STATUS_LABELS[sale.status] || sale.status}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4 text-brand-navy">
                    {sale.discount > 0 ? formatCurrency(sale.discount) : '-'}
                  </td>
                  <td className="text-right py-3 px-4 text-brand-navy font-semibold">
                    {formatCurrency(sale.total)}
                  </td>
                  <td className="text-center py-3 px-4">
                    <button
                      onClick={() => setSelectedSale(sale)}
                      className="text-brand-blue hover:text-brand-blue/80 text-sm font-medium"
                    >
                      Ver detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data.pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-brand-navy/70">
              Página {data.pagination.page} de {data.pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-brand-navy disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === data.pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-brand-navy disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-brand-navy">
                    Venda {selectedSale.saleNumber}
                  </h3>
                  <p className="text-sm text-brand-navy/70 mt-1">
                    {new Date(selectedSale.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSale(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Informações da Venda */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-brand-navy/70">Cliente</div>
                  <div className="font-medium text-brand-navy">
                    {selectedSale.customerId || 'Não informado'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-brand-navy/70">Forma de Pagamento</div>
                  <div className="font-medium text-brand-navy">
                    {PAYMENT_LABELS[selectedSale.paymentMethod]}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-brand-navy/70">Status</div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedSale.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : selectedSale.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {STATUS_LABELS[selectedSale.status]}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-brand-navy/70">Vendedor</div>
                  <div className="font-medium text-brand-navy">
                    {selectedSale.seller?.name || '-'}
                  </div>
                </div>
              </div>

              {/* Itens */}
              <div>
                <h4 className="font-semibold text-brand-navy mb-2">Itens da Venda</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-3 text-sm text-brand-navy">Produto</th>
                        <th className="text-right py-2 px-3 text-sm text-brand-navy">Qtd</th>
                        <th className="text-right py-2 px-3 text-sm text-brand-navy">Preço Unit.</th>
                        <th className="text-right py-2 px-3 text-sm text-brand-navy">Desconto</th>
                        <th className="text-right py-2 px-3 text-sm text-brand-navy">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSale.items.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="py-2 px-3 text-sm text-brand-navy">{item.productName}</td>
                          <td className="text-right py-2 px-3 text-sm text-brand-navy">{item.quantity}</td>
                          <td className="text-right py-2 px-3 text-sm text-brand-navy">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="text-right py-2 px-3 text-sm text-brand-navy">
                            {item.discount > 0 ? formatCurrency(item.discount) : '-'}
                          </td>
                          <td className="text-right py-2 px-3 text-sm font-medium text-brand-navy">
                            {formatCurrency(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totais */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-brand-navy">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatCurrency(selectedSale.subtotal)}</span>
                </div>
                {selectedSale.discount > 0 && (
                  <div className="flex justify-between text-brand-navy">
                    <span>Desconto:</span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(selectedSale.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-brand-navy border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(selectedSale.total)}</span>
                </div>
              </div>

              {/* Observações */}
              {selectedSale.notes && (
                <div>
                  <div className="text-sm text-brand-navy/70 mb-1">Observações</div>
                  <div className="text-sm text-brand-navy bg-gray-50 p-3 rounded">
                    {selectedSale.notes}
                  </div>
                </div>
              )}

              {/* Motivo de Cancelamento */}
              {selectedSale.cancellationReason && (
                <div>
                  <div className="text-sm text-brand-navy/70 mb-1">Motivo do Cancelamento</div>
                  <div className="text-sm text-red-700 bg-red-50 p-3 rounded">
                    {selectedSale.cancellationReason}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
