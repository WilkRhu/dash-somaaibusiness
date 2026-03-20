'use client';

import { StatsCard } from '@/components/dashboard/stats-card';
import { useDashboardStats } from '@/lib/hooks/use-dashboard-stats';
import { useWeeklySales } from '@/lib/hooks/use-weekly-sales';
import { formatCurrency } from '@/lib/utils/format';
import Link from 'next/link';

export default function DashboardHomePage() {
  const { stats, isLoading, error } = useDashboardStats();
  const { report: weeklyReport, isLoading: loadingWeekly } = useWeeklySales();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-brand-navy">Carregando dashboard...</div>
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

  // Preparar dados do gráfico semanal
  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
  };

  const salesData = weeklyReport?.byDay?.map(day => ({
    day: getDayLabel(day.date),
    value: day.total,
    date: day.date,
  })) || [];

  const maxValue = salesData.length > 0 ? Math.max(...salesData.map(d => d.value)) : 1;

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: 'Concluída',
      pending: 'Pendente',
      cancelled: 'Cancelada',
    };
    return labels[status] || status;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: 'Dinheiro',
      pix: 'PIX',
      credit_card: 'Cartão de Crédito',
      debit_card: 'Cartão de Débito',
      bank_transfer: 'Transferência',
    };
    return labels[method] || method;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bem-vindo de volta! Aqui está o resumo do seu negócio.</p>
        </div>
        <Link
          href="/sales/pos"
          className="px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Nova Venda
        </Link>
      </div>

      {/* Stats Cards */}
      {stats?.today && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Vendas Hoje"
            value={formatCurrency(stats.today.revenue ?? 0)}
            description={`${(stats.today.comparisonYesterday?.revenue ?? 0) > 0 ? '+' : ''}${(stats.today.comparisonYesterday?.revenue ?? 0).toFixed(1)}% vs ontem`}
            trend={(stats.today.comparisonYesterday?.revenue ?? 0) > 0 ? 'up' : 'down'}
          />
          <StatsCard
            title="Ticket Médio Hoje"
            value={formatCurrency(stats.today.averageTicket ?? 0)}
            description={`${stats.today.salesCount ?? 0} vendas`}
          />
          <StatsCard
            title="Alertas"
            value={(stats.alerts?.lowStockCount ?? 0).toString()}
            description="Produtos com estoque baixo"
            trend={(stats.alerts?.lowStockCount ?? 0) > 0 ? 'down' : undefined}
          />
          <StatsCard
            title="Vendas Pendentes"
            value={(stats.alerts?.pendingSalesCount ?? 0).toString()}
            description="Aguardando confirmação"
          />
        </div>
      )}

      {/* Alerts */}
      {stats?.alerts && (stats.alerts.lowStockCount > 0 || stats.alerts.expiringCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.alerts.lowStockCount > 0 && (
            <div className="p-4 rounded-lg border-l-4 bg-yellow-50 border-yellow-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-800">
                    {stats.alerts.lowStockCount} produtos com estoque baixo
                  </span>
                </div>
                <Link href="/inventory" className="text-sm font-semibold text-brand-blue hover:underline">
                  Ver produtos
                </Link>
              </div>
            </div>
          )}
          
          {stats.alerts.expiringCount > 0 && (
            <div className="p-4 rounded-lg border-l-4 bg-blue-50 border-blue-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-800">
                    {stats.alerts.expiringCount} produtos vencendo em breve
                  </span>
                </div>
                <Link href="/inventory" className="text-sm font-semibold text-brand-blue hover:underline">
                  Ver produtos
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-brand-navy">Vendas da Semana</h2>
            <div className="text-sm text-gray-500">Últimos 7 dias</div>
          </div>
          
          {/* Loading State */}
          {loadingWeekly && (
            <div className="flex items-center justify-center h-64">
              <div className="text-brand-navy">Carregando vendas...</div>
            </div>
          )}

          {/* Empty State */}
          {!loadingWeekly && salesData.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm">Nenhuma venda registrada nos últimos 7 dias</p>
            </div>
          )}
          
          {/* Gráfico */}
          {!loadingWeekly && salesData.length > 0 && (
            <div className={`flex items-end justify-between h-64 gap-4 ${
              stats && (stats.userPlan === 'FREE') ? 'blur-sm' : ''
            }`}>
              {salesData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full bg-gray-100 rounded-t-lg overflow-hidden" style={{ height: '200px' }}>
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-brand-blue to-brand-green rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer group"
                      style={{ height: `${(data.value / maxValue) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-brand-navy text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {formatCurrency(data.value)}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{data.day}</span>
                </div>
              ))}
            </div>
          )}

          {/* Overlay Premium para plano FREE */}
          {stats && (stats.userPlan === 'FREE') && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
              <div className="text-center p-6 max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  📊 Gráficos Avançados
                </h3>
                <p className="text-gray-600 mb-4">
                  Visualize suas vendas com gráficos detalhados e análises avançadas
                </p>
                <Link
                  href="/subscription"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Fazer Upgrade
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-brand-navy mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <Link
              href="/sales/pos"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-blue-50 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-brand-navy text-sm">Nova Venda</p>
                <p className="text-xs text-gray-500">Abrir PDV</p>
              </div>
            </Link>

            <Link
              href="/inventory"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-green hover:bg-green-50 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-brand-navy text-sm">Adicionar Produto</p>
                <p className="text-xs text-gray-500">Gerenciar estoque</p>
              </div>
            </Link>

            <Link
              href="/customers"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-blue-50 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-navy to-brand-blue flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-brand-navy text-sm">Novo Cliente</p>
                <p className="text-xs text-gray-500">Cadastrar cliente</p>
              </div>
            </Link>

            <Link
              href="/reports"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-green hover:bg-green-50 transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-brand-navy text-sm">Ver Relatórios</p>
                <p className="text-xs text-gray-500">Análises e insights</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        {stats && (stats.topProductsToday?.length ?? 0) > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-brand-navy mb-4">Produtos Mais Vendidos Hoje</h2>
            <div className="space-y-3">
              {stats.topProductsToday.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-navy text-sm">{product.productName}</p>
                      <p className="text-xs text-gray-500">{product.quantity} vendas</p>
                    </div>
                  </div>
                  <span className="font-bold text-brand-green">{formatCurrency(product.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Sales */}
        {stats && (stats.recentSales?.length ?? 0) > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-brand-navy">Vendas Recentes</h2>
              <Link href="/sales" className="text-sm font-semibold text-brand-blue hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentSales.map((sale, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-brand-navy text-sm">{sale.saleNumber}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        sale.status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : sale.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {getStatusLabel(sale.status)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {sale.customer?.name || 'Cliente não informado'} • {getPaymentMethodLabel(sale.paymentMethod)}
                    </p>
                  </div>
                  <span className="font-bold text-brand-navy">{formatCurrency(sale.total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
