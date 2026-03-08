'use client';

import { use, useState, useEffect } from 'react';
import { reportsApi, DashboardStats } from '@/lib/api/reports';

export default function ReportsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: establishmentId } = use(params);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('today');

  useEffect(() => {
    fetchStats();
  }, [establishmentId, dateRange]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await reportsApi.getDashboardStats(establishmentId);
      setStats(data);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar relatórios:', err);
      setError(err.message || 'Erro ao carregar relatórios');
    } finally {
      setIsLoading(false);
    }
  };

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

  const getTrendIcon = (value: number) => {
    if (value > 0) return '↑';
    if (value < 0) return '↓';
    return '→';
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="today">Hoje</option>
          <option value="week">Esta Semana</option>
          <option value="month">Este Mês</option>
          <option value="year">Este Ano</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      ) : stats ? (
        <>
          {/* Today's Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Vendas Hoje</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.today.revenue)}</p>
              <p className={`text-sm ${getTrendColor(stats.today.comparisonYesterday.revenue)}`}>
                {getTrendIcon(stats.today.comparisonYesterday.revenue)} {Math.abs(stats.today.comparisonYesterday.revenue).toFixed(1)}% vs ontem
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Quantidade</p>
              <p className="text-2xl font-bold text-gray-900">{stats.today.salesCount}</p>
              <p className={`text-sm ${getTrendColor(stats.today.comparisonYesterday.salesCount)}`}>
                {getTrendIcon(stats.today.comparisonYesterday.salesCount)} {Math.abs(stats.today.comparisonYesterday.salesCount).toFixed(1)}% vs ontem
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.today.averageTicket)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Vendas Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.alerts.pendingSalesCount}</p>
            </div>
          </div>

          {/* Month Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600">Este Mês</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(stats.thisMonth.revenue)}</p>
              <p className={`text-sm ${getTrendColor(stats.thisMonth.comparisonLastMonth.revenue)}`}>
                {getTrendIcon(stats.thisMonth.comparisonLastMonth.revenue)} {Math.abs(stats.thisMonth.comparisonLastMonth.revenue).toFixed(1)}% vs mês anterior
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600">Vendas no Mês</p>
              <p className="text-2xl font-bold text-blue-900">{stats.thisMonth.salesCount}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(stats.thisMonth.averageTicket)}</p>
            </div>
          </div>

          {/* Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm text-red-600">Estoque Baixo</p>
              <p className="text-2xl font-bold text-red-900">{stats.alerts.lowStockCount}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-600">Produtos Vencendo</p>
              <p className="text-2xl font-bold text-orange-900">{stats.alerts.expiringCount}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">Plano</p>
              <p className="text-2xl font-bold text-gray-900">{stats.userPlan || 'FREE'}</p>
            </div>
          </div>

          {/* Recent Sales */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Vendas Recentes</h2>
            </div>
            {stats.recentSales.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhuma venda recente</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nº Venda</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Pagamento</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSales.map((sale) => (
                    <tr key={sale.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{sale.saleNumber}</td>
                      <td className="py-3 px-4 text-gray-600">{sale.customer?.name || 'Cliente não informado'}</td>
                      <td className="py-3 px-4 font-medium text-gray-900">{formatCurrency(sale.total)}</td>
                      <td className="py-3 px-4 text-gray-600">{sale.paymentMethod}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          sale.status === 'completed' ? 'bg-green-100 text-green-800' :
                          sale.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {sale.status === 'completed' ? 'Concluída' : sale.status === 'pending' ? 'Pendente' : 'Cancelada'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{formatDate(sale.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Produtos Mais Vendidos Hoje</h2>
            </div>
            {stats.topProductsToday.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum produto vendido hoje</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Produto</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Quantidade</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topProductsToday.map((product, index) => (
                    <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{product.productName}</td>
                      <td className="py-3 px-4 text-gray-600">{product.quantity}</td>
                      <td className="py-3 px-4 font-medium text-green-600">{formatCurrency(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum dado disponível</p>
        </div>
      )}
    </div>
  );
}