'use client';

import { AdminNavigation } from '@/components/admin/AdminNavigation';
import { Header } from '@/components/dashboard/header';
import { ToastContainer } from '@/components/ui/toast';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const [isAuthReady, setIsAuthReady] = useState(false);
  const router = useRouter();
  type AuthStoreWithPersist = typeof useAuthStore & {
    persist?: {
      hasHydrated?: () => boolean;
      onFinishHydration?: (callback: () => void) => (() => void) | void;
    };
  };
  const authPersist = (useAuthStore as AuthStoreWithPersist).persist;

  const userRole = user?.role;
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

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

    // Redireciona somente depois que a store terminou de hidratar
    if (!isAuthenticated || !isAdmin) {
      router.replace('/dashboard');
    }
  }, [isAuthReady, isAuthenticated, isAdmin, router]);

  if (!isAuthReady) {
    return null;
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminNavigation />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
