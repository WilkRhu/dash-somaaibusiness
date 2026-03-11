'use client';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'green' | 'red' | 'blue' | 'yellow' | 'purple' | 'gray';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  subtitle?: string;
}

export function MetricCard({ title, value, icon, color, trend, subtitle }: MetricCardProps) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    blue: 'bg-blue-50 border-blue-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    purple: 'bg-purple-50 border-purple-200',
    gray: 'bg-gray-50 border-gray-200',
  };

  const textColorClasses = {
    green: 'text-green-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    gray: 'text-gray-600',
  };

  return (
    <div className={`border rounded-lg p-6 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${textColorClasses[color]}`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <span className="text-4xl">{icon}</span>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1">
          <span className={trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}>
            {trend.direction === 'up' ? '↑' : '↓'}
          </span>
          <span className={`text-sm font-semibold ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend.value}% vs período anterior
          </span>
        </div>
      )}
    </div>
  );
}
