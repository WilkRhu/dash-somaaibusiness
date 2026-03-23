'use client';

import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { ToastContainer } from '@/components/ui/toast';
import { OfflineBanner } from '@/components/ui/offline-banner';
import { TrialWelcomeModal } from '@/components/subscription/trial-welcome-modal';
import { TrialBanner } from '@/components/subscription/trial-banner';
import { UpgradeRequiredModal } from '@/components/subscription/upgrade-required-modal';
import { OrderToastProvider } from '@/components/providers/order-toast-provider';
import { OrderToastListener } from '@/components/providers/order-toast-listener';
import { useEstablishmentInit } from '@/lib/hooks/use-establishment-init';
import { useTrialModal } from '@/lib/hooks/use-trial-modal';
import { useRouteProtection } from '@/lib/hooks/use-route-protection';
import { useAdminProtection } from '@/lib/hooks/use-admin-protection';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isFullscreenMode } = useUIStore();
  const { user } = useAuthStore();
  const { currentEstablishment } = useEstablishmentStore();
  const router = useRouter();
  
  // Inicializa o estabelecimento automaticamente
  useEstablishmentInit();

  // Hook do modal de trial
  const { showModal, closeModal, daysRemaining, isOnTrial } = useTrialModal();

  // Hook de proteção de rotas
  const { 
    showUpgradeModal, 
    closeModal: closeUpgradeModal, 
    restriction,
    userPlan 
  } = useRouteProtection();

  // Proteger rotas do super_admin
  useAdminProtection();

  // Se estiver em modo fullscreen, renderiza apenas o conteúdo
  if (isFullscreenMode) {
    return (
      <OrderToastProvider establishmentId={currentEstablishment?.id}>
        <div className="h-screen overflow-hidden bg-gray-50">
          <main className="h-full overflow-y-auto">
            {children}
          </main>
          <ToastContainer />
          {currentEstablishment && (
            <OrderToastListener establishmentId={currentEstablishment.id} />
          )}
        </div>
      </OrderToastProvider>
    );
  }

  return (
    <OrderToastProvider establishmentId={currentEstablishment?.id}>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <OfflineBanner />
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Banner de Trial */}
          {isOnTrial && daysRemaining > 0 && (
            <TrialBanner daysRemaining={daysRemaining} />
          )}
          
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>

        {/* Modal de Trial */}
        <TrialWelcomeModal
          isOpen={showModal}
          onClose={closeModal}
          daysRemaining={daysRemaining}
        />

        {/* Modal de Upgrade Necessário */}
        {restriction && (
          <UpgradeRequiredModal
            isOpen={showUpgradeModal}
            onClose={closeUpgradeModal}
            featureName={restriction.label}
            featureDescription={restriction.description}
            requiredPlan={restriction.minPlan}
            currentPlan={userPlan}
          />
        )}

        {/* Toast Container */}
        <ToastContainer />

        {/* Order Toast Listener */}
        {currentEstablishment && (
          <OrderToastListener establishmentId={currentEstablishment.id} />
        )}
      </div>
    </OrderToastProvider>
  );
}
