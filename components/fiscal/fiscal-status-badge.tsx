'use client';

import { FiscalNoteStatus } from '@/lib/types/fiscal';

interface FiscalStatusBadgeProps {
  status: FiscalNoteStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function FiscalStatusBadge({ status, size = 'md' }: FiscalStatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const statusConfig = {
    processing: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Processando',
      icon: '⏳',
    },
    authorized: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Autorizada',
      icon: '✅',
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Rejeitada',
      icon: '❌',
    },
    cancelled: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: 'Cancelada',
      icon: '⊘',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeClasses[size]} ${config.bg} ${config.text}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
