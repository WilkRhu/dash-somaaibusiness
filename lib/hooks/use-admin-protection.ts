import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';

export function useAdminProtection() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'super_admin') {
      // Se super_admin tentar acessar qualquer rota do dashboard normal, redireciona para /admin
      const isDashboardRoute = pathname.startsWith('/home') || 
                               pathname.startsWith('/sales') ||
                               pathname.startsWith('/customers') ||
                               pathname.startsWith('/inventory') ||
                               pathname.startsWith('/offers') ||
                               pathname.startsWith('/members') ||
                               pathname.startsWith('/suppliers') ||
                               pathname.startsWith('/expenses') ||
                               pathname.startsWith('/delivery') ||
                               pathname.startsWith('/reports') ||
                               pathname.startsWith('/subscription') ||
                               pathname.startsWith('/profile');

      // Excluir rotas do admin (/admin/, /admin/business/, etc)
      const isAdminRoute = pathname.startsWith('/admin/');

      if (isDashboardRoute && !isAdminRoute && pathname !== '/admin') {
        router.replace('/admin');
      }
    }
  }, [user, isAuthenticated, pathname, router]);
}