'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { canAccess, PERMISSIONS } from '@/lib/utils/permissions';
import { canAccessRoute } from '@/lib/utils/plan-restrictions';
import { BusinessRole } from '@/lib/types/establishment';
import { SubscriptionPlan } from '@/lib/types/subscription';
import { ReactNode, useState, useEffect } from 'react';

interface MenuItem {
  href: string;
  label: string;
  icon: ReactNode;
  requiredPermissions: BusinessRole[];
}

const menuItems: MenuItem[] = [
  { 
    href: '/home', 
    label: 'Dashboard',
    requiredPermissions: PERMISSIONS.VIEW_DASHBOARD,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    href: '/establishments', 
    label: 'Estabelecimentos',
    requiredPermissions: PERMISSIONS.MANAGE_ESTABLISHMENTS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  { 
    href: '/inventory', 
    label: 'Estoque',
    requiredPermissions: PERMISSIONS.VIEW_INVENTORY,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  { 
    href: '/sales', 
    label: 'Vendas',
    requiredPermissions: PERMISSIONS.VIEW_SALES,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    href: '/sales/pos', 
    label: 'PDV',
    requiredPermissions: PERMISSIONS.ACCESS_POS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    href: '/offers', 
    label: 'Ofertas',
    requiredPermissions: PERMISSIONS.MANAGE_OFFERS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    )
  },
  { 
    href: '/customers', 
    label: 'Clientes',
    requiredPermissions: PERMISSIONS.MANAGE_CUSTOMERS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    href: '/members', 
    label: 'Funcionários',
    requiredPermissions: PERMISSIONS.MANAGE_MEMBERS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  { 
    href: '/suppliers', 
    label: 'Fornecedores',
    requiredPermissions: PERMISSIONS.MANAGE_SUPPLIERS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    )
  },
  { 
    href: '/expenses', 
    label: 'Despesas',
    requiredPermissions: PERMISSIONS.VIEW_REPORTS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    href: '/delivery', 
    label: 'Delivery',
    requiredPermissions: PERMISSIONS.VIEW_SALES,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    )
  },
  { 
    href: '/reports', 
    label: 'Relatórios',
    requiredPermissions: PERMISSIONS.VIEW_REPORTS,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  { 
    href: '/subscription', 
    label: 'Planos',
    requiredPermissions: PERMISSIONS.VIEW_DASHBOARD,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    )
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Páginas que funcionam offline
const offlineSupported = ['/sales', '/sales/pos', '/inventory'];

// Páginas que NÃO funcionam offline
const onlineOnlyPages = [
  '/home', '/establishments', '/inventory', '/offers', 
  '/customers', '/members', '/suppliers', '/expenses', 
  '/delivery', '/reports', '/subscription'
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { currentEstablishment } = useEstablishmentStore();
  const { user } = useAuthStore();
  const [isOnline, setIsOnline] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window === 'undefined') return;
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // super_admin vê tudo, independente das permissões do estabelecimento
  const userGlobalRole = user?.role;
  const isSuperAdmin = userGlobalRole === 'super_admin';
  
  // Filtrar itens do menu baseado nas permissões do usuário
  const userRole = currentEstablishment?.role;
  const userPlan = user?.subscriptionPlan || SubscriptionPlan.FREE;
  
  const visibleMenuItems = menuItems.filter(item => {
    // super_admin vê todos os itens
    if (isSuperAdmin) return true;
    
    // Se não tem role definido, mostra todos os itens (owner ou ainda carregando)
    if (!userRole) return true;
    return canAccess(userRole, item.requiredPermissions);
  });

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        -translate-x-full lg:translate-x-0
        ${isOpen ? '!translate-x-0' : ''}
      `}
    >
      <div className="p-6 bg-gradient-to-r from-brand-blue to-brand-green flex items-center gap-3">
        <Image 
          src="https://somaaiuploads.s3.us-east-1.amazonaws.com/logomarca/logobusiness.png" 
          alt="SomaAI Business Logo" 
          width={40} 
          height={40}
          unoptimized
        />
        <h2 className="text-xl font-bold text-white">SomaAI Business</h2>
      </div>
      
      <nav className="px-4 space-y-1 mt-4 overflow-y-auto h-[calc(100vh-100px)]">
        {visibleMenuItems.map((item) => {
          const { allowed } = canAccessRoute(item.href, userPlan);
          const isLocked = !allowed;
          
          // Verificar se a página funciona offline
          const supportsOffline = offlineSupported.some(path => item.href.startsWith(path));
          const isOfflineRestricted = isClient && !isOnline && !supportsOffline;
          
          return (
            <Link
              key={item.href}
              href={isOfflineRestricted ? '#' : item.href}
              onClick={(e) => {
                if (isOfflineRestricted) {
                  e.preventDefault();
                } else {
                  onClose();
                }
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-primary-50 text-primary-600 font-semibold'
                  : isLocked || isOfflineRestricted
                  ? 'text-gray-400 hover:bg-gray-50 cursor-not-allowed'
                  : 'text-brand-navy hover:bg-gray-50'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="font-medium flex-1">{item.label}</span>
              {isLocked && (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
              {isOfflineRestricted && (
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                </svg>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
