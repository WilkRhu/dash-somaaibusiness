'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils/format';

interface PaymentMethodChartProps {
  data: Array<{
    method: string;
    count: number;
    total: number;
    percentage: number;
  }>;
}

const COLORS = ['#0066CC', '#00CC66', '#FF9900', '#CC0066', '#6600CC'];

const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Dinheiro',
  pix: 'PIX',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  bank_transfer: 'Transferência',
};

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
  const chartData = data.map(item => ({
    name: PAYMENT_LABELS[item.method] || item.method,
    value: item.total,
    count: item.count,
    percentage: item.percentage,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-brand-navy mb-4">
        Distribuição por Forma de Pagamento
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(1)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
            formatter={(value, name, props) => [
              `${formatCurrency(value as number || 0)} (${props.payload.count} vendas)`,
              name as string || ''
            ]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry: any) => 
              `${value}: ${formatCurrency(entry.payload.value)}`
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
