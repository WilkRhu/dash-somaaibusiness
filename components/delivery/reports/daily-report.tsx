import { DailyReport } from '@/lib/hooks/use-delivery-reports';
import { formatCurrency } from '@/lib/utils/format';

interface DailyReportProps {
  data: DailyReport | null;
  loading: boolean;
}

export function DailyReportComponent({ data, loading }: DailyReportProps) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!data || data.daily.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Data
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Pedidos
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Entregues
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Receita
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Taxa Sucesso
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Atrasos
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.daily.map((day) => (
              <tr key={day.date} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {new Date(day.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {day.totalOrders}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {day.completedOrders}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {formatCurrency(day.totalRevenue)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {day.successRate.toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    day.delayedOrders > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {day.delayedOrders}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumo */}
      <div className="bg-gray-50 border-t border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryCard
            label="Dias"
            value={data.daily.length.toString()}
          />
          <SummaryCard
            label="Total de Pedidos"
            value={data.daily.reduce((sum, d) => sum + d.totalOrders, 0).toString()}
          />
          <SummaryCard
            label="Taxa Média"
            value={`${(
              data.daily.reduce((sum, d) => sum + d.successRate, 0) / data.daily.length
            ).toFixed(1)}%`}
          />
          <SummaryCard
            label="Receita Total"
            value={formatCurrency(
              data.daily.reduce((sum, d) => sum + d.totalRevenue, 0)
            )}
          />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded h-12 animate-pulse" />
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
