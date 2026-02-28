'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils/format';

interface SalesChartProps {
  data: Array<{
    date: string;
    count: number;
    total: number;
    averageTicket: number;
  }>;
}

export function SalesChart({ data }: SalesChartProps) {
  const formattedData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    vendas: item.count,
    receita: item.total,
    ticket: item.averageTicket,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-brand-navy mb-4">
        Evolução de Vendas
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#1e3a8a"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#1e3a8a"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
            formatter={(value: number | undefined, name: string) => {
              if (!value) return ['', ''];
              if (name === 'receita' || name === 'ticket') {
                return [formatCurrency(value), name === 'receita' ? 'Receita' : 'Ticket Médio'];
              }
              return [value, 'Vendas'];
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              const labels: Record<string, string> = {
                vendas: 'Vendas',
                receita: 'Receita',
                ticket: 'Ticket Médio'
              };
              return labels[value] || value;
            }}
          />
          <Line 
            type="monotone" 
            dataKey="receita" 
            stroke="#0066CC" 
            strokeWidth={2}
            dot={{ fill: '#0066CC', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="vendas" 
            stroke="#00CC66" 
            strokeWidth={2}
            dot={{ fill: '#00CC66', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
