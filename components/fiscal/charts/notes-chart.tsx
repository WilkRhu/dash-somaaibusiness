'use client';

interface NotesChartProps {
  authorized: number;
  rejected: number;
  cancelled: number;
  pending: number;
}

export function NotesChart({ authorized, rejected, cancelled, pending }: NotesChartProps) {
  const total = authorized + rejected + cancelled + pending;
  const authorizedPercent = total > 0 ? (authorized / total) * 100 : 0;
  const rejectedPercent = total > 0 ? (rejected / total) * 100 : 0;
  const cancelledPercent = total > 0 ? (cancelled / total) * 100 : 0;
  const pendingPercent = total > 0 ? (pending / total) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Authorized */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Autorizadas</span>
          <span className="text-sm font-semibold text-green-600">{authorized} ({authorizedPercent.toFixed(1)}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{ width: `${authorizedPercent}%` }}
          />
        </div>
      </div>

      {/* Rejected */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Rejeitadas</span>
          <span className="text-sm font-semibold text-red-600">{rejected} ({rejectedPercent.toFixed(1)}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-red-600 h-2 rounded-full transition-all"
            style={{ width: `${rejectedPercent}%` }}
          />
        </div>
      </div>

      {/* Cancelled */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Canceladas</span>
          <span className="text-sm font-semibold text-gray-600">{cancelled} ({cancelledPercent.toFixed(1)}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gray-600 h-2 rounded-full transition-all"
            style={{ width: `${cancelledPercent}%` }}
          />
        </div>
      </div>

      {/* Pending */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Pendentes</span>
          <span className="text-sm font-semibold text-yellow-600">{pending} ({pendingPercent.toFixed(1)}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-600 h-2 rounded-full transition-all"
            style={{ width: `${pendingPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
