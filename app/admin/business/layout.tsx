'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';

export default function AdminBusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isAuthReady, setIsAuthReady] = useState(false);

  type AuthStoreWithPersist = typeof useAuthStore & {
    persist?: {
      hasHydrated?: () => boolean;
      onFinishHydration?: (callback: () => void) => (() => void) | void;
    };
  };

  const authPersist = (useAuthStore as AuthStoreWithPersist).persist;
  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    const hydrated = authPersist?.hasHydrated?.() ?? true;
    setIsAuthReady(hydrated);

    if (!authPersist?.onFinishHydration) {
      return;
    }

    const unsubscribe = authPersist.onFinishHydration(() => {
      setIsAuthReady(true);
    });

    return unsubscribe;
  }, [authPersist]);

  useEffect(() => {
    if (!isAuthReady) return;

    if (!isAuthenticated || !isSuperAdmin) {
      router.replace('/admin');
    }
  }, [isAuthReady, isAuthenticated, isSuperAdmin, router]);

  if (!isAuthReady) {
    return null;
  }

  if (!isAuthenticated || !isSuperAdmin) {
    return null;
  }

  return <>{children}</>;
}
