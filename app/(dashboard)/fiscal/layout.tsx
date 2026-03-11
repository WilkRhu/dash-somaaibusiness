'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const fiscalMenuItems = [
  { href: '/fiscal/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/fiscal/certificate', label: 'Certificado', icon: '📋' },
  { href: '/fiscal/notes', label: 'Notas Fiscais', icon: '📄' },
  { href: '/fiscal/reports', label: 'Relatórios', icon: '📈' },
];

export default function FiscalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white rounded-lg shadow p-4 sticky top-24">
          <h2 className="font-bold text-gray-900 mb-4">Sistema Fiscal</h2>
          <nav className="space-y-2">
            {fiscalMenuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-brand-blue text-white font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
