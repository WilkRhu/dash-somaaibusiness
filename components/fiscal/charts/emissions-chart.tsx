'use client';

interface EmissionsChartProps {
  data: Array<{
    date: string;
    count: number;
  }>;
}

export function EmissionsChart({ data }: EmissionsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Sem dados para exibir
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const chartHeight = 200;

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="flex items-end gap-2 h-64 bg-gray-50 p-4 rounded-lg">
        {data.map((item, index) => {
          const height = (item.count / maxCount) * chartHeight;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-blue-600 rounded-t transition-all hover:bg-blue-700"
                style={{ height: `${height}px` }}
                title={`${item.date}: ${item.count} notas`}
              />
              <span className="text-xs text-gray-600 text-center">{item.date}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-between text-xs text-gray-600">
        <span>Mínimo: {Math.min(...data.map((d) => d.count))} notas</span>
        <span>Máximo: {maxCount} notas</span>
        <span>Total: {data.reduce((sum, d) => sum + d.count, 0)} notas</span>
      </div>
    </div>
  );
}
