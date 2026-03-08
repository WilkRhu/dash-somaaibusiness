'use client';

import { redirect } from 'next/navigation';
import { AdminNavigation } from '@/components/admin/AdminNavigation';
import { Header } from '@/components/dashboard/header';
import { ToastContainer } from '@/components/ui/toast';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useState, useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  const userRole = user?.role;
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  useEffect(() => {
    // Esperar o Zustand hidratar
    const checkAuth = () => {
      setIsLoading(false);
    };
    
    // Pequeno delay para garantir hidratação
    const timer = setTimeout(checkAuth, 50);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return null; // ou um spinner de loading
  }

  // Redirecionar se não estiver logado ou não for admin
  if (!isAuthenticated || !isAdmin) {
    redirect('/dashboard');
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