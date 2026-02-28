'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';

export function Header() {
  const { user } = useAuthStore();
  const { currentEstablishment } = useEstablishmentStore();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          {currentEstablishment && (
            <h2 className="text-lg font-semibold text-brand-navy">
              {currentEstablishment.name}
            </h2>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-brand-navy/70">
            {user?.name || 'Usuário'}
          </span>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-blue to-brand-green flex items-center justify-center text-white font-semibold">
            {(user?.name || 'U').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
