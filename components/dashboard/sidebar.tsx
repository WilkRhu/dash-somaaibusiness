'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/establishments', label: 'Estabelecimentos', icon: '🏪' },
  { href: '/inventory', label: 'Estoque', icon: '📦' },
  { href: '/sales', label: 'Vendas', icon: '💰' },
  { href: '/sales/pos', label: 'PDV', icon: '🛒' },
  { href: '/offers', label: 'Ofertas', icon: '🎁' },
  { href: '/customers', label: 'Clientes', icon: '👥' },
  { href: '/suppliers', label: 'Fornecedores', icon: '🚚' },
  { href: '/reports', label: 'Relatórios', icon: '📈' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-6 bg-gradient-to-r from-brand-blue to-brand-green">
        <h2 className="text-2xl font-bold text-white">SomaAI Business</h2>
      </div>
      
      <nav className="px-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === item.href
                ? 'bg-primary-50 text-primary-600 font-semibold'
                : 'text-brand-navy hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
