'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { SubscriptionPlan } from '@/lib/types/subscription';
import { canAccessRoute, RouteRestriction } from '@/lib/utils/plan-restrictions';

export function useRouteProtection() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentEstablishment } = useEstablishmentStore();

  const restriction = useMemo<RouteRestriction | null>(() => {
    if (!user || !pathname || user.role === 'super_admin') return null;

    // Funcionários de cozinha podem acessar rotas de cozinha sem restrição de plano
    const establishmentRoles = currentEstablishment?.roles || [];
    const isKitchenEmployee = establishmentRoles.some((role: any) => 
      role === 'kitchen_cook' || 
      role === 'kitchen_manager' ||
      role === 'kitchen_chef' ||
      role === 'kitchen_assistant'
    );
    
    // Funcionários de cozinha têm acesso total ao dashboard
    if (isKitchenEmployee) {
      return null;
    }

    const userPlan = user.subscriptionPlan || SubscriptionPlan.FREE;
    const { allowed, restriction: routeRestriction } = canAccessRoute(pathname, userPlan);

    return !allowed ? routeRestriction ?? null : null;
  }, [pathname, user, currentEstablishment]);

  const showUpgradeModal = Boolean(restriction);

  useEffect(() => {
    if (!showUpgradeModal) return;

    const timeout = setTimeout(() => {
      router.push('/home');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [showUpgradeModal, router]);

  const closeModal = () => {
    router.push('/home');
  };

  return {
    showUpgradeModal,
    closeModal,
    restriction,
    userPlan: user?.subscriptionPlan || SubscriptionPlan.FREE,
  };
}
