'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { SubscriptionPlan } from '@/lib/types/subscription';
import { canAccessRoute, RouteRestriction } from '@/lib/utils/plan-restrictions';

export function useRouteProtection() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  const restriction = useMemo<RouteRestriction | null>(() => {
    if (!user || !pathname || user.role === 'super_admin') return null;

    const userPlan = user.subscriptionPlan || SubscriptionPlan.FREE;
    const { allowed, restriction: routeRestriction } = canAccessRoute(pathname, userPlan);

    return !allowed ? routeRestriction ?? null : null;
  }, [pathname, user]);

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
