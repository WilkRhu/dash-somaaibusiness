import { formatCurrency } from '@/lib/utils/format';

interface ComparisonCardProps {
  title: string;
  currentValue: number;
  previousValue: number;
  format?: 'currency' | 'number';
  description?: string;
}

export function ComparisonCard({ 
  title, 
  currentValue, 
  previousValue, 
  format = 'currency',
  description 
}: ComparisonCardProps) {
  const difference = currentValue - previousValue;
  const percentageChange = previousValue > 0 
    ? ((difference / previousValue) * 100) 
    : 0;
  
  const isPositive = difference >= 0;
  const formattedCurrent = format === 'currency' 
    ? formatCurrency(currentValue) 
    : currentValue.toLocaleString('pt-BR');
  const formattedPrevious = format === 'currency' 
    ? formatCurrency(previousValue) 
    : previousValue.toLocaleString('pt-BR');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-brand-blue">
      <div className="text-sm text-brand-navy/70 mb-1">{title}</div>
      <div className="text-2xl font-bold text-brand-navy mb-2">
        {formattedCurrent}
      </div>
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {isPositive ? '+' : ''}{percentageChange.toFixed(1)}%
        </div>
        <span className="text-sm text-brand-navy/70">
          vs período anterior ({formattedPrevious})
        </span>
      </div>
      {description && (
        <div className="text-xs text-brand-navy/60 mt-2">{description}</div>
      )}
    </div>
  );
}
