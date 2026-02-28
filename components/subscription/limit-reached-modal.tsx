'use client';

import { SubscriptionPlan, PLAN_FEATURES } from '@/lib/types/subscription';
import { getNextPlan, getPlanName } from '@/lib/utils/subscription';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: SubscriptionPlan;
  limitType: 'establishments' | 'employees' | 'products';
  currentLimit: number;
  onUpgrade?: () => void;
}

export function LimitReachedModal({
  isOpen,
  onClose,
  currentPlan,
  limitType,
  currentLimit,
  onUpgrade,
}: LimitReachedModalProps) {
  if (!isOpen) return null;

  const nextPlan = getNextPlan(currentPlan);
  const nextPlanFeatures = nextPlan ? PLAN_FEATURES[nextPlan] : null;

  const limitLabels = {
    establishments: 'estabelecimentos',
    employees: 'funcionários',
    products: 'produtos',
  };

  const limitIcons = {
    establishments: (
      <svg className="w-16 h-16 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    employees: (
      <svg className="w-16 h-16 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    products: (
      <svg className="w-16 h-16 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {limitIcons[limitType]}
          
          <div>
            <h3 className="text-2xl font-bold text-brand-navy mb-2">
              Limite Atingido
            </h3>
            <p className="text-gray-600">
              Você atingiu o limite de <span className="font-semibold">{currentLimit} {limitLabels[limitType]}</span> do plano {getPlanName(currentPlan)}.
            </p>
          </div>
        </div>

        {nextPlanFeatures && (
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-brand-navy">
                Plano {nextPlanFeatures.name}
              </h4>
              {nextPlanFeatures.price > 0 && (
                <span className="text-2xl font-bold text-brand-blue">
                  R$ {nextPlanFeatures.price.toFixed(2)}
                  <span className="text-sm text-gray-600">/mês</span>
                </span>
              )}
            </div>
            
            <ul className="space-y-2">
              {nextPlanFeatures.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          {onUpgrade && nextPlan && (
            <button
              onClick={() => {
                onUpgrade();
                onClose();
              }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Fazer Upgrade
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            {onUpgrade ? 'Agora Não' : 'Fechar'}
          </button>
        </div>
      </div>
    </div>
  );
}
