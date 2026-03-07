'use client';

import { useState, useEffect } from 'react';
import { subscriptionApi, SubscriptionStatus, PlanInfo } from '@/lib/api/subscription';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function SubscriptionPage() {
  const { user } = useAuthStore();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [plans, setPlans] = useState<PlanInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusData, plansData] = await Promise.all([
          subscriptionApi.getStatus(),
          subscriptionApi.getPlans(),
        ]);
        setStatus(statusData);
        setPlans(plansData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const formatLimit = (limit: number) => {
    if (limit === -1) return 'Ilimitado';
    return limit.toString();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Planos e Assinatura</h1>
        <p className="text-gray-600 mt-2">Escolha o plano ideal para o seu negócio</p>
      </div>

      {/* Status Atual */}
      {status && (
        <div className="bg-gradient-to-r from-brand-blue to-brand-green rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Plano Atual: {status.currentPlan}</h2>
              {status.isOnTrial && (
                <div className="space-y-1">
                  <p className="text-white/90">
                    🎉 Você está em período de teste!
                  </p>
                  <p className="text-white/80">
                    {status.trialDaysRemaining} {status.trialDaysRemaining === 1 ? 'dia restante' : 'dias restantes'}
                  </p>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80 mb-1">Uso de Estabelecimentos</div>
              <div className="text-3xl font-bold">
                {status.usage.establishments} / {formatLimit(status.limits.establishments)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trial Warning */}
      {status?.isOnTrial && status.trialDaysRemaining <= 3 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Seu período de teste termina em {status.trialDaysRemaining} {status.trialDaysRemaining === 1 ? 'dia' : 'dias'}. 
                Escolha um plano para continuar usando todos os recursos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all hover:shadow-xl ${
              plan.recommended ? 'ring-2 ring-brand-blue' : ''
            } ${status?.currentPlan === plan.id ? 'ring-2 ring-green-500' : ''}`}
          >
            {plan.recommended && (
              <div className="bg-brand-blue text-white text-center py-2 text-sm font-semibold">
                Recomendado
              </div>
            )}
            {status?.currentPlan === plan.id && (
              <div className="bg-green-500 text-white text-center py-2 text-sm font-semibold">
                Plano Atual
              </div>
            )}

            <div className="p-6">
              <h3 className="text-2xl font-bold text-brand-navy mb-2">{plan.name}</h3>
              
              <div className="mb-6">
                {plan.price === null ? (
                  <div className="text-gray-600">Sob consulta</div>
                ) : plan.price === 0 ? (
                  <div className="text-3xl font-bold text-brand-navy">Grátis</div>
                ) : (
                  <div>
                    <span className="text-3xl font-bold text-brand-navy">
                      R$ {plan.price.toFixed(2)}
                    </span>
                    <span className="text-gray-600">/mês</span>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {status?.currentPlan === plan.id ? (
                <button
                  disabled
                  className="w-full py-3 bg-gray-300 text-gray-600 rounded-lg font-semibold cursor-not-allowed"
                >
                  Plano Atual
                </button>
              ) : plan.contactSales ? (
                <button
                  onClick={() => window.open('mailto:vendas@somaai.com', '_blank')}
                  className="w-full py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Falar com Vendas
                </button>
              ) : (
                <button
                  onClick={() => alert('Integração com pagamento em desenvolvimento')}
                  className="w-full py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  {plan.price === 0 ? 'Usar Grátis' : 'Assinar Agora'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Comparação de Recursos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-brand-navy mb-6">Comparação de Recursos</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-semibold">Recurso</th>
                {plans.map((plan) => (
                  <th key={plan.id} className="text-center py-3 px-4 text-gray-700 font-semibold">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-700">Estabelecimentos</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center py-3 px-4 text-gray-600">
                    {formatLimit(plan.limits.establishments)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-700">Funcionários</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center py-3 px-4 text-gray-600">
                    {formatLimit(plan.limits.employees)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-700">Produtos</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="text-center py-3 px-4 text-gray-600">
                    {formatLimit(plan.limits.products)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
