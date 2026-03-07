'use client';

import { useRouter } from 'next/navigation';

interface TrialBannerProps {
  daysRemaining: number;
}

export function TrialBanner({ daysRemaining }: TrialBannerProps) {
  const router = useRouter();
  const isLastDays = daysRemaining <= 3;

  return (
    <div
      className={`px-4 py-2 flex items-center justify-between gap-3 text-sm ${
        isLastDays
          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
      }`}
    >
      <div className="flex items-center gap-2">
        {isLastDays ? (
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        )}
        <span className="font-medium">
          {isLastDays ? (
            <>
              ⏰ Últimos {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'} de trial!
            </>
          ) : (
            <>
              🎉 Trial ativo: {daysRemaining} {daysRemaining === 1 ? 'dia restante' : 'dias restantes'}
            </>
          )}
        </span>
      </div>

      <button
        onClick={() => router.push('/subscription')}
        className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md font-medium transition-colors whitespace-nowrap"
      >
        {isLastDays ? 'Fazer Upgrade' : 'Ver Planos'}
      </button>
    </div>
  );
}
