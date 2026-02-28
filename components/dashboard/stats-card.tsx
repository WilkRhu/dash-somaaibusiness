interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  trend?: 'up' | 'down';
}

export function StatsCard({ title, value, description, trend }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-brand-blue">
      <h3 className="text-sm font-medium text-brand-navy/70 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-brand-navy mb-1">{value}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm text-brand-navy/60">{description}</p>
        {trend && (
          <span className={`flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </span>
        )}
      </div>
    </div>
  );
}
