'use client';

import Link from 'next/link';

interface DashboardAlertProps {
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  icon: string;
  action?: {
    label: string;
    href: string;
  };
}

export function DashboardAlert({ type, title, message, icon, action }: DashboardAlertProps) {
  const typeClasses = {
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
  };

  const titleClasses = {
    error: 'text-red-900',
    warning: 'text-yellow-900',
    info: 'text-blue-900',
    success: 'text-green-900',
  };

  const messageClasses = {
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
    success: 'text-green-800',
  };

  const linkClasses = {
    error: 'text-red-600 hover:text-red-700',
    warning: 'text-yellow-600 hover:text-yellow-700',
    info: 'text-blue-600 hover:text-blue-700',
    success: 'text-green-600 hover:text-green-700',
  };

  return (
    <div className={`border rounded-lg p-4 flex items-start gap-3 ${typeClasses[type]}`}>
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <div className="flex-1">
        <p className={`font-semibold ${titleClasses[type]}`}>{title}</p>
        <p className={`text-sm mt-1 ${messageClasses[type]}`}>{message}</p>
        {action && (
          <Link href={action.href} className={`text-sm font-semibold mt-2 inline-block ${linkClasses[type]}`}>
            {action.label} →
          </Link>
        )}
      </div>
    </div>
  );
}
