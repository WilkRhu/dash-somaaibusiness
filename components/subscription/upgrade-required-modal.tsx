'use client';

import { useRouter } from 'next/navigation';
import { SubscriptionPlan } from '@/lib/types/subscription';
import { getPlanDisplayName } from '@/lib/utils/plan-restrictions';

interface UpgradeRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  featureDescription: string;
  requiredPlan: SubscriptionPlan;
  currentPlan: SubscriptionPlan;
}

export function UpgradeRequiredModal({
  isOpen,
  onClose,
  featureName,
  featureDescription,
  requiredPlan,
  currentPlan,
}: UpgradeRequiredModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    router.push('/subscription');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-8 bg-gradient-to-br from-purple-600 to-blue-600">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">
              🔒 Recurso Premium
            </h2>
          </div>

          <p className="text-white/90 text-sm">
            Este recurso não está disponível no plano {getPlanDisplayName(currentPlan)}
          </p>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-lg">
              {featureName}
            </h3>
            <p className="text-sm text-gray-600">
              {featureDescription}
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💎 Disponível no plano {getPlanDisplayName(requiredPlan)}+</strong>
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Faça upgrade para desbloquear este e outros recursos avançados
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleUpgrade}
              className="flex-1 px-4 py-2.5 text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-medium transition-colors"
            >
              Ver Planos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
