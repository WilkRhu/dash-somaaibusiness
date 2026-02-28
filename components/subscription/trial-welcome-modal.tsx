'use client';

import { useState } from 'react';
import { subscriptionApi } from '@/lib/api/subscription';
import { useAuthStore } from '@/lib/stores/auth-store';
import { SubscriptionPlan } from '@/lib/types/subscription';
import { TrialSuccessModal } from './trial-success-modal';

interface TrialWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysRemaining: number;
}

export function TrialWelcomeModal({ isOpen, onClose, daysRemaining }: TrialWelcomeModalProps) {
  const [isActivating, setIsActivating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { updateUserPlan } = useAuthStore();

  if (!isOpen && !showSuccessModal) return null;

  const handleActivateTrial = async () => {
    try {
      setIsActivating(true);
      const response = await subscriptionApi.activateTrial();
      
      if (response.success) {
        console.log('✅ Trial ativado com sucesso');
        
        // Atualizar o plano do usuário localmente para TRIAL
        const trialEndsAt = new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000).toISOString();
        updateUserPlan(SubscriptionPlan.TRIAL, trialEndsAt, daysRemaining);
        
        console.log('✅ Plano atualizado localmente para TRIAL');
        
        // Fechar modal de boas-vindas
        onClose();
        
        // Mostrar modal de sucesso
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      console.error('❌ Erro ao ativar trial:', error);
      alert(error.response?.data?.message || 'Erro ao ativar trial. Tente novamente.');
    } finally {
      setIsActivating(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <h2 className="text-2xl font-bold">Experimente Grátis!</h2>
          </div>
          <p className="text-blue-100">
            Ative seu trial de {daysRemaining} dias e desbloqueie recursos premium
          </p>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">3 Estabelecimentos</p>
                <p className="text-sm text-gray-600">vs 1 no plano gratuito</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">20 Funcionários</p>
                <p className="text-sm text-gray-600">vs 2 no plano gratuito</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">1.000 Produtos</p>
                <p className="text-sm text-gray-600">vs 50 no plano gratuito</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Relatórios Avançados</p>
                <p className="text-sm text-gray-600">Análises detalhadas de vendas</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Sistema de Ofertas</p>
                <p className="text-sm text-gray-600">Crie promoções e descontos</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">100% Grátis</span> por {daysRemaining} dias. Sem cartão de crédito. Cancele quando quiser.
            </p>
          </div>

          {/* Botões */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleActivateTrial}
              disabled={isActivating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isActivating ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Ativando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Ativar Trial Grátis
                </>
              )}
            </button>

            <button
              onClick={onClose}
              disabled={isActivating}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Agora Não
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Sucesso */}
      <TrialSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccess}
        daysRemaining={daysRemaining}
      />
    </div>
  );
}
