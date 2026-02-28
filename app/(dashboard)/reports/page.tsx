'use client';

import { useState } from 'react';
import { useReports } from '@/lib/hooks/use-reports';
import { reportsApi } from '@/lib/api/reports';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { formatCurrency } from '@/lib/utils/format';
import { AdvancedFilters } from '@/components/reports/advanced-filters';
import { SalesChart } from '@/components/reports/sales-chart';
import { PaymentMethodChart } from '@/components/reports/payment-method-chart';
import { ComparisonCard } from '@/components/reports/comparison-card';
import { SalesDetailsTable } from '@/components/reports/sales-details-table';

export default function ReportsPage() {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [filters, setFilters] = useState({
    startDate: thirtyDaysAgo,
    endDate: today,
    status: 'completed' as const,
    paymentMethod: '',
  });

  const { report, isLoading, error } = useReports(filters);

  // Calcular período anterior para comparação
  const getPreviousPeriod = () => {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const prevEnd = new Date(start);
    prevEnd.setDate(prevEnd.getDate() - 1);
    
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - diffDays);
    
    return {
      startDate: prevStart.toISOString().split('T')[0],
      endDate: prevEnd.toISOString().split('T')[0],
    };
  };

  const [previousReport, setPreviousReport] = useState<any>(null);
  const [loadingComparison, setLoadingComparison] = useState(false);

  const loadComparison = async () => {
    const { currentEstablishment } = useEstablishmentStore.getState();
    if (!currentEstablishment) return;

    setLoadingComparison(true);
    try {
      const prevPeriod = getPreviousPeriod();
      const data = await reportsApi.getSalesReport(currentEstablishment.id, {
        ...filters,
        ...prevPeriod,
      });
      setPreviousReport(data);
    } catch (err) {
      console.error('Erro ao carregar comparação:', err);
    } finally {
      setLoadingComparison(false);
    }
  };

  const handleExport = async () => {
    if (!report) return;
    
    try {
      const { currentEstablishment } = useEstablishmentStore.getState();
      if (!currentEstablishment) return;

      const blob = await reportsApi.exportSalesReport(
        currentEstablishment.id,
        filters,
        'csv'
      );
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `relatorio-vendas-${filters.startDate}-${filters.endDate}.csv`;
      link.click();
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      alert('Erro ao exportar relatório. Tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-brand-navy">Carregando relatório...</div>
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-navy">Relatório de Vendas</h1>
        <div className="flex gap-2">
          {!previousReport && (
            <button
              onClick={loadComparison}
              disabled={loadingComparison}
              className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green/90 disabled:opacity-50"
            >
              {loadingComparison ? 'Carregando...' : 'Comparar Períodos'}
            </button>
          )}
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Filtros Avançados */}
      <AdvancedFilters filters={filters} onFilterChange={setFilters} />

      {report && (
        <>
          {/* Resumo com Comparação */}
          {previousReport ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ComparisonCard
                title="Receita Total"
                currentValue={report.summary.totalRevenue}
                previousValue={previousReport.summary.totalRevenue}
                format="currency"
              />
              <ComparisonCard
                title="Lucro Estimado"
                currentValue={report.summary.totalProfit}
                previousValue={previousReport.summary.totalProfit}
                format="currency"
              />
              <ComparisonCard
                title="Ticket Médio"
                currentValue={report.summary.averageTicket}
                previousValue={previousReport.summary.averageTicket}
                format="currency"
              />
              <ComparisonCard
                title="Total de Vendas"
                currentValue={report.summary.salesCount}
                previousValue={previousReport.summary.salesCount}
                format="number"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-brand-blue">
                <div className="text-sm text-brand-navy/70 mb-1">Receita Total</div>
                <div className="text-2xl font-bold text-brand-navy">
                  {formatCurrency(report.summary.totalRevenue)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-brand-green">
                <div className="text-sm text-brand-navy/70 mb-1">Lucro Estimado</div>
                <div className="text-2xl font-bold text-brand-navy">
                  {formatCurrency(report.summary.totalProfit)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-brand-blue">
                <div className="text-sm text-brand-navy/70 mb-1">Ticket Médio</div>
                <div className="text-2xl font-bold text-brand-navy">
                  {formatCurrency(report.summary.averageTicket)}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-brand-green">
                <div className="text-sm text-brand-navy/70 mb-1">Total de Vendas</div>
                <div className="text-2xl font-bold text-brand-navy">
                  {report.summary.salesCount}
                </div>
              </div>
            </div>
          )}

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesChart data={report.byDay} />
            <PaymentMethodChart data={report.byPaymentMethod} />
          </div>

          {/* Top Produtos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-brand-navy mb-4">
              Produtos Mais Vendidos
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-brand-navy font-semibold">#</th>
                    <th className="text-left py-3 px-4 text-brand-navy font-semibold">Produto</th>
                    <th className="text-right py-3 px-4 text-brand-navy font-semibold">Quantidade</th>
                    <th className="text-right py-3 px-4 text-brand-navy font-semibold">Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {report.topProducts.map((product, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-brand-navy">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-brand-navy font-medium">{product.productName}</td>
                      <td className="text-right py-3 px-4 text-brand-navy">{product.quantity}</td>
                      <td className="text-right py-3 px-4 text-brand-navy font-semibold">
                        {formatCurrency(product.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Métricas Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-brand-navy/70">Taxa de Cancelamento</h3>
                <svg className="w-5 h-5 text-brand-navy/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-brand-navy">
                {((report.summary.cancelledCount / (report.summary.salesCount + report.summary.cancelledCount)) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-brand-navy/60 mt-1">
                {report.summary.cancelledCount} vendas canceladas
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-brand-navy/70">Margem de Lucro</h3>
                <svg className="w-5 h-5 text-brand-navy/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-brand-navy">
                {((report.summary.totalProfit / report.summary.totalRevenue) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-brand-navy/60 mt-1">
                Lucro sobre receita
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-brand-navy/70">Produtos Diferentes</h3>
                <svg className="w-5 h-5 text-brand-navy/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-brand-navy">
                {report.topProducts.length}
              </div>
              <div className="text-xs text-brand-navy/60 mt-1">
                Variedade vendida
              </div>
            </div>
          </div>

          {/* Tabela de Detalhes das Vendas */}
          <SalesDetailsTable filters={filters} />
        </>
      )}
    </div>
  );
}


