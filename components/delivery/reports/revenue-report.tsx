import { RevenueReport } from '@/lib/hooks/use-delivery-reports';
import { formatCurrency } from '@/lib/utils/format';

interface RevenueReportProps {
  data: RevenueReport | null;
  loading: boolean;
}

export function RevenueReportComponent({ data, loading }: RevenueReportProps) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!data) {
    return <EmptyState />;
  }

  const { summary, byPaymentMethod } = data;

  return (
    <div className="space-y-6">
      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Subtotal"
          value={formatCurrency(summary.totalSubtotal)}
          subtitle="itens"
          icon="🛒"
          color="blue"
        />
        <MetricCard
          title="Taxas"
          value={formatCurrency(summary.totalDeliveryFees)}
          subtitle="de entrega"
          icon="🚚"
          color="purple"
        />
        <MetricCard
          title="Descontos"
          value={formatCurrency(summary.totalDiscount)}
          subtitle="aplicados"
          icon="🏷️"
          color="orange"
        />
        <MetricCard
          title="Receita Total"
          value={formatCurrency(summary.totalRevenue)}
          subtitle="líquida"
          icon="💰"
          color="green"
        />
      </div>

      {/* Detalhes Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo</h3>
          <div className="space-y-3">
            <DetailRow label="Total de Pedidos" value={summary.totalOrders.toString()} />
            <DetailRow label="Valor Médio" value={formatCurrency(summary.averageOrderValue)} />
            <div className="border-t pt-3">
              <DetailRow
                label="Receita Total"
                value={formatCurrency(summary.totalRevenue)}
                highlight
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Composição</h3>
          <div className="space-y-3">
            <DetailRow label="Subtotal" value={formatCurrency(summary.totalSubtotal)} />
            <DetailRow label="Taxas" value={`+${formatCurrency(summary.totalDeliveryFees)}`} />
            <DetailRow label="Descontos" value={`-${formatCurrency(summary.totalDiscount)}`} />
          </div>
        </div>
      </div>

      {/* Receita por Forma de Pagamento */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita por Forma de Pagamento</h3>
        <div className="space-y-4">
          {byPaymentMethod.map((method) => (
            <PaymentMethodRow
              key={method.method}
              method={getPaymentMethodLabel(method.method)}
              count={method.count}
              total={method.total}
              percentage={(method.total / summary.totalRevenue) * 100}
            />
          ))}
        </div>
      </div>

      {/* Gráfico de Distribuição */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Receita</h3>
        <div className="space-y-3">
          {byPaymentMethod.map((method) => {
            const percentage = (method.total / summary.totalRevenue) * 100;
            return (
              <div key={method.method}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {getPaymentMethodLabel(method.method)}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    pix: 'PIX',
    credit_card: 'Cartão de Crédito',
    debit_card: 'Cartão de Débito',
    cash: 'Dinheiro',
    bank_transfer: 'Transferência Bancária',
  };
  return labels[method] || method;
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
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
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

function PaymentMethodRow({
  method,
  count,
  total,
  percentage,
}: {
  method: string;
  count: number;
  total: number;
  percentage: number;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{method}</p>
        <p className="text-sm text-gray-600">{count} transações</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">{formatCurrency(total)}</p>
        <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-32 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-lg shadow-md p-12 text-center">
      <p className="text-gray-500">Nenhum dado de receita disponível para o período selecionado</p>
    </div>
  );
}
