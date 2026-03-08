'use client';

import { use, useState, useEffect } from 'react';
import { Sale, SaleStatus, PaymentMethod } from '@/lib/types/sale';

export default function SalesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: establishmentId } = use(params);
  const [sales, setSales] = useState<Sale[]>([]);
  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  useEffect(() => {
    fetchSales();
  }, [establishmentId]);

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/business/establishments/${establishmentId}/sales`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      const data = await response.json();
      console.log('📦 Sales response:', data);

      // Backend retorna { data: [...], total, page, limit }
      if (data.data && Array.isArray(data.data)) {
        setAllSales(data.data);
        setSales(data.data);
      } else if (Array.isArray(data)) {
        setAllSales(data);
        setSales(data);
      } else {
        setError('Erro ao carregar vendas');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros localmente
  useEffect(() => {
    let filtered = allSales;

    if (statusFilter) {
      filtered = filtered.filter(sale => sale.status === statusFilter);
    }

    if (paymentFilter) {
      filtered = filtered.filter(sale => sale.paymentMethod === paymentFilter);
    }

    setSales(filtered);
  }, [statusFilter, paymentFilter, allSales]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusLabel = (status: SaleStatus) => {
    const labels: Record<SaleStatus, string> = {
      completed: 'Concluída',
      cancelled: 'Cancelada',
      pending: 'Pendente',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: SaleStatus) => {
    const colors: Record<SaleStatus, string> = {
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentLabel = (method: PaymentMethod) => {
    const labels: Record<PaymentMethod, string> = {
      cash: 'Dinheiro',
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      pix: 'PIX',
      bank_transfer: 'Transferência Bancária',
    };
    return labels[method] || method;
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Vendas</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Carregando...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Vendas</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
        <span className="text-sm text-gray-500">{sales.length} vendas</span>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="completed">Concluída</option>
          <option value="pending">Pendente</option>
          <option value="cancelled">Cancelada</option>
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os pagamentos</option>
          <option value="cash">Dinheiro</option>
          <option value="credit_card">Cartão de Crédito</option>
          <option value="debit_card">Cartão de Débito</option>
          <option value="pix">PIX</option>
          <option value="bank_transfer">Transferência Bancária</option>
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nº Venda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{sale.saleNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(sale.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.items.length} item{sale.items.length !== 1 ? 'ns' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(sale.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getPaymentLabel(sale.paymentMethod)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sale.status)}`}>
                      {getStatusLabel(sale.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sales.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma venda</h3>
            <p className="mt-1 text-sm text-gray-500">Nenhuma venda encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
}