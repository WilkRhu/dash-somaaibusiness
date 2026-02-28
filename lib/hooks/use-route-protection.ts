'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { SubscriptionPlan } from '@/lib/types/subscription';
import { canAccessRoute, RouteRestriction } from '@/lib/utils/plan-restrictions';

export function useRouteProtection() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [restriction, setRestriction] = useState<RouteRestriction | null>(null);

  useEffect(() => {
    if (!user || !pathname) return;

    const userPlan = user.subscriptionPlan || SubscriptionPlan.FREE;
    const { allowed, restriction: routeRestriction } = canAccessRoute(pathname, userPlan);

    if (!allowed && routeRestriction) {
      setRestriction(routeRestriction);
      setShowUpgradeModal(true);
      
      // Redirecionar para home após 2 segundos se não fechar o modal
      const timeout = setTimeout(() => {
        router.push('/home');
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [pathname, user, router]);

  const closeModal = () => {
    setShowUpgradeModal(false);
    router.push('/home');
  };

  return {
    showUpgradeModal,
    closeModal,
    restriction,
    userPlan: user?.subscriptionPlan || SubscriptionPlan.FREE,
  };
}
