import { DriversReport } from '@/lib/hooks/use-delivery-reports';
import { formatCurrency } from '@/lib/utils/format';

interface DriversReportProps {
  data: DriversReport | null;
  loading: boolean;
}

export function DriversReportComponent({ data, loading }: DriversReportProps) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!data || data.drivers.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Entregador
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Pedidos
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Taxa Sucesso
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Receita
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Tempo Médio
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Atrasos
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.drivers.map((driver) => (
              <tr key={driver.driverId} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {driver.driverName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {driver.completedOrders}/{driver.totalOrders}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {driver.successRate.toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {formatCurrency(driver.totalRevenue)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {driver.averageDeliveryTime} min
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      driver.delayedOrders > 5
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {driver.delayedOrders}
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
            label="Total de Entregadores"
            value={data.drivers.length.toString()}
          />
          <SummaryCard
            label="Pedidos Totais"
            value={data.drivers.reduce((sum, d) => sum + d.totalOrders, 0).toString()}
          />
          <SummaryCard
            label="Taxa Média"
            value={`${(
              data.drivers.reduce((sum, d) => sum + d.successRate, 0) / data.drivers.length
            ).toFixed(1)}%`}
          />
          <SummaryCard
            label="Receita Total"
            value={formatCurrency(
              data.drivers.reduce((sum, d) => sum + d.totalRevenue, 0)
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
      <p className="text-gray-500">Nenhum entregador encontrado para o período selecionado</p>
    </div>
  );
}
