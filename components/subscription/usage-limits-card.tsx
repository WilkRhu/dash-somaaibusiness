'use client';

import { SubscriptionPlan } from '@/lib/types/subscription';
import { formatLimit, getLimitPercentage, getLimitWarningLevel } from '@/lib/utils/subscription';

interface UsageLimitsCardProps {
  plan: SubscriptionPlan;
  usage: {
    establishments: number;
    employees: number;
    products: number;
  };
  limits: {
    establishments: number | null;
    employees: number | null;
    products: number | null;
  };
  onUpgrade?: () => void;
}

export function UsageLimitsCard({ plan, usage, limits, onUpgrade }: UsageLimitsCardProps) {
  const getProgressColor = (level: 'safe' | 'warning' | 'danger') => {
    switch (level) {
      case 'danger':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-brand-blue';
    }
  };

  const items = [
    {
      label: 'Estabelecimentos',
      current: usage.establishments,
      limit: limits.establishments,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: 'Funcionários',
      current: usage.employees,
      limit: limits.employees,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      label: 'Produtos',
      current: usage.products,
      limit: limits.products,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-brand-navy">Uso do Plano</h3>
          <p className="text-sm text-gray-500">Plano {plan}</p>
        </div>
        {onUpgrade && plan !== SubscriptionPlan.ENTERPRISE && (
          <button
            onClick={onUpgrade}
            className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-semibold"
          >
            Fazer Upgrade
          </button>
        )}
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const percentage = getLimitPercentage(item.current, item.limit);
          const level = getLimitWarningLevel(percentage);
          const progressColor = getProgressColor(level);

          return (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-brand-blue">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className="text-gray-600">
                  {item.current} / {formatLimit(item.limit)}
                </span>
              </div>
              
              {item.limit !== null && (
                <div className="relative">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${progressColor} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {percentage >= 75 && (
                    <p className="text-xs mt-1 text-yellow-600">
                      {percentage >= 90 ? '⚠️ Limite quase atingido!' : '⚠️ Atenção ao limite'}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
