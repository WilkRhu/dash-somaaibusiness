'use client';

import { useRouter } from 'next/navigation';

interface TrialSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysRemaining?: number;
}

export function TrialSuccessModal({ isOpen, onClose, daysRemaining = 10 }: TrialSuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleExplore = () => {
    // Apenas fechar o modal, sem navegação
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header com animação de sucesso */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
          {/* Ícone de check animado */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {/* Círculos de celebração */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-bounce delay-100" />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-2">🎉 Trial Ativado!</h2>
          <p className="text-green-50 text-lg">
            Você agora tem acesso aos recursos do plano BASIC
          </p>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold text-gray-900">
                {daysRemaining} dias de acesso completo
              </p>
            </div>
            <p className="text-sm text-gray-600 ml-9">
              Aproveite todos os recursos premium até {new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recursos Desbloqueados:
            </h3>

            <div className="space-y-2 ml-7">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>3 estabelecimentos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>20 funcionários</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>1.000 produtos no inventário</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>Relatórios avançados</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>Sistema de ofertas e promoções</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>Gestão completa de clientes</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-900 mb-1">
                  Lembrete Importante
                </p>
                <p className="text-sm text-amber-800">
                  Após {daysRemaining} dias, sua conta voltará ao plano gratuito. Faça upgrade a qualquer momento para manter o acesso.
                </p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleExplore}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Começar a Explorar
            </button>

            <button
              onClick={() => router.push('/subscription')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Ver Planos e Preços
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
