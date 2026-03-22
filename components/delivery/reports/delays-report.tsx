import { DelaysReport } from '@/lib/hooks/use-delivery-reports';

interface DelaysReportProps {
  data: DelaysReport | null;
  loading: boolean;
}

export function DelaysReportComponent({ data, loading }: DelaysReportProps) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!data) {
    return <EmptyState />;
  }

  const { summary, delayedOrders } = data;

  return (
    <div className="space-y-6">
      {/* Resumo de Atrasos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Atrasado"
          value={summary.totalDelayed.toString()}
          subtitle="entregas"
          icon="⏱️"
          color="red"
        />
        <MetricCard
          title="Atraso Médio"
          value={`${summary.averageDelay} min`}
          subtitle="por entrega"
          icon="⏳"
          color="orange"
        />
        <MetricCard
          title="Percentual"
          value={`${((summary.totalDelayed / (summary.totalDelayed + 100)) * 100).toFixed(1)}%`}
          subtitle="do total"
          icon="📊"
          color="yellow"
        />
      </div>

      {/* Distribuição de Atrasos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Faixa</h3>
        <div className="space-y-3">
          <DelayRange
            label="0-5 minutos"
            value={summary.delayRanges['0-5min']}
            total={summary.totalDelayed}
            color="yellow"
          />
          <DelayRange
            label="5-15 minutos"
            value={summary.delayRanges['5-15min']}
            total={summary.totalDelayed}
            color="orange"
          />
          <DelayRange
            label="15-30 minutos"
            value={summary.delayRanges['15-30min']}
            total={summary.totalDelayed}
            color="red"
          />
          <DelayRange
            label="30-60 minutos"
            value={summary.delayRanges['30-60min']}
            total={summary.totalDelayed}
            color="red"
          />
          <DelayRange
            label="60+ minutos"
            value={summary.delayRanges['60+min']}
            total={summary.totalDelayed}
            color="red"
          />
        </div>
      </div>

      {/* Lista de Entregas Atrasadas */}
      {delayedOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Entregas Atrasadas ({delayedOrders.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Entregador
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Atraso
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {delayedOrders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.driverName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        {order.delayMinutes} min
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {delayedOrders.length > 10 && (
            <div className="bg-gray-50 border-t border-gray-200 p-4 text-center text-sm text-gray-600">
              Mostrando 10 de {delayedOrders.length} entregas atrasadas
            </div>
          )}
        </div>
      )}
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
  icon: string;
  color: string;
}) {
  const colorClasses = {
    red: 'bg-red-50 border-red-200',
    orange: 'bg-orange-50 border-orange-200',
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
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

function DelayRange({
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
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-900">{value} pedidos</span>
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

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <p className="text-gray-500">Nenhum atraso registrado para o período selecionado</p>
    </div>
  );
}
