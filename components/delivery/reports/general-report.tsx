import { GeneralReport } from '@/lib/hooks/use-delivery-reports';
import { formatCurrency } from '@/lib/utils/format';
import { ReactNode } from 'react';

interface GeneralReportProps {
  data: GeneralReport | null;
  loading: boolean;
}

export function GeneralReportComponent({ data, loading }: GeneralReportProps) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!data) {
    return <EmptyState />;
  }

  const { summary, byStatus } = data;

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Total de Pedidos"
          value={summary.totalOrders.toString()}
          subtitle="pedidos no período"
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
          color="blue"
        />
        <MetricCard
          title="Entregues"
          value={summary.completedOrders.toString()}
          subtitle={`${summary.successRate.toFixed(1)}% de sucesso`}
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
          color="green"
        />
        <MetricCard
          title="Taxa de Sucesso"
          value={`${summary.successRate.toFixed(1)}%`}
          subtitle="acima da meta"
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          color="purple"
        />
        <MetricCard
          title="Receita Total"
          value={formatCurrency(summary.totalRevenue)}
          subtitle="incluindo taxas"
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          color="emerald"
        />
        <MetricCard
          title="Tempo Médio"
          value={`${summary.averageDeliveryTime} min`}
          subtitle="de entrega"
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          color="orange"
        />
        <MetricCard
          title="Atrasos"
          value={summary.delayedOrders.toString()}
          subtitle={`${summary.averageDelay} min de atraso médio`}
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 5v1m7-13a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          color="red"
        />
      </div>

      {/* Gráfico de Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Status</h3>
        <div className="space-y-3">
          <StatusBar
            label="Entregues"
            value={byStatus.delivered}
            total={summary.totalOrders}
            color="green"
          />
          <StatusBar
            label="Cancelados"
            value={byStatus.cancelled}
            total={summary.totalOrders}
            color="red"
          />
          <StatusBar
            label="Falhas"
            value={byStatus.failed}
            total={summary.totalOrders}
            color="orange"
          />
          <StatusBar
            label="Pendentes"
            value={byStatus.pending}
            total={summary.totalOrders}
            color="yellow"
          />
        </div>
      </div>

      {/* Detalhes Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
          <div className="space-y-3">
            <DetailRow label="Subtotal" value={formatCurrency(summary.totalRevenue - summary.totalDeliveryFees)} />
            <DetailRow label="Taxas de Entrega" value={formatCurrency(summary.totalDeliveryFees)} />
            <DetailRow label="Descontos" value={`-${formatCurrency(summary.totalDiscount)}`} />
            <div className="border-t pt-3">
              <DetailRow
                label="Total"
                value={formatCurrency(summary.totalRevenue)}
                highlight
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo de Pedidos</h3>
          <div className="space-y-3">
            <DetailRow label="Completados" value={summary.completedOrders.toString()} />
            <DetailRow label="Cancelados" value={summary.cancelledOrders.toString()} />
            <DetailRow label="Falhas" value={summary.failedOrders.toString()} />
            <DetailRow label="Pendentes" value={summary.pendingOrders.toString()} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    orange: 'bg-orange-50 border-orange-200',
    purple: 'bg-purple-50 border-purple-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    yellow: 'bg-yellow-50 border-yellow-200',
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} border rounded-lg p-6`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className="text-gray-600">{icon}</div>
      </div>
    </div>
  );
}

function StatusBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const colorClasses = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-900">
          {value} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${colorClasses[color as keyof typeof colorClasses]} h-2 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <span className={`text-sm ${highlight ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
        {label}
      </span>
      <span className={`text-sm ${highlight ? 'font-bold text-gray-900' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <p className="text-gray-500">Nenhum dado disponível para o período selecionado</p>
    </div>
  );
}
