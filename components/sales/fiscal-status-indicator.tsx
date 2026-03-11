'use client';

import Link from 'next/link';

interface FiscalStatusIndicatorProps {
  totalSales: number;
  salesWithoutNote: number;
  complianceRate: number;
}

export function FiscalStatusIndicator({
  totalSales,
  salesWithoutNote,
  complianceRate,
}: FiscalStatusIndicatorProps) {
  const getStatusColor = () => {
    if (complianceRate >= 95) return 'bg-green-50 border-green-200';
    if (complianceRate >= 80) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getStatusText = () => {
    if (complianceRate >= 95) return 'text-green-800';
    if (complianceRate >= 80) return 'text-yellow-800';
    return 'text-red-800';
  };

  const getStatusIcon = () => {
    if (complianceRate >= 95) return '✅';
    if (complianceRate >= 80) return '⚠️';
    return '❌';
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getStatusIcon()}</span>
            <h3 className={`font-bold ${getStatusText()}`}>Status Fiscal</h3>
          </div>
          <p className={`text-sm ${getStatusText()}`}>
            {complianceRate.toFixed(1)}% de conformidade
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {salesWithoutNote} de {totalSales} vendas sem nota fiscal
          </p>
        </div>

        {salesWithoutNote > 0 && (
          <Link
            href="/sales/fiscal-compliance"
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
          >
            Resolver
          </Link>
        )}
      </div>
    </div>
  );
}
