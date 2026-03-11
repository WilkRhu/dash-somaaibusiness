'use client';

interface ComplianceIndicatorProps {
  successRate: number;
  rejectionRate: number;
  contingencyNotes: number;
  certificateDaysUntilExpiration: number;
}

export function ComplianceIndicator({
  successRate,
  rejectionRate,
  contingencyNotes,
  certificateDaysUntilExpiration,
}: ComplianceIndicatorProps) {
  // Calculate compliance score (0-100)
  let score = 100;

  // Deduct for low success rate
  if (successRate < 95) {
    score -= (95 - successRate) * 0.5;
  }

  // Deduct for high rejection rate
  if (rejectionRate > 5) {
    score -= rejectionRate * 0.5;
  }

  // Deduct for contingency notes
  if (contingencyNotes > 0) {
    score -= Math.min(contingencyNotes * 2, 20);
  }

  // Deduct for certificate expiration
  if (certificateDaysUntilExpiration < 30) {
    score -= (30 - certificateDaysUntilExpiration) * 0.5;
  }

  score = Math.max(0, Math.min(100, score));

  const getStatus = () => {
    if (score >= 90) return { label: 'Excelente', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 75) return { label: 'Bom', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 60) return { label: 'Aceitável', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { label: 'Crítico', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const status = getStatus();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-brand-navy mb-6">Indicador de Conformidade</h2>

      <div className="space-y-6">
        {/* Score */}
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${(score / 100) * 282.7} 282.7`}
                  className={status.color}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${status.color}`}>{score.toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <p className={`text-lg font-bold ${status.color}`}>{status.label}</p>
            <p className="text-sm text-gray-600 mt-2">
              Seu sistema fiscal está operando com conformidade {status.label.toLowerCase()}.
            </p>

            {/* Issues */}
            <div className="mt-4 space-y-2 text-sm">
              {successRate < 95 && (
                <div className="flex items-center gap-2 text-yellow-700">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Taxa de sucesso abaixo de 95% ({successRate.toFixed(1)}%)
                </div>
              )}
              {rejectionRate > 5 && (
                <div className="flex items-center gap-2 text-yellow-700">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Taxa de rejeição acima de 5% ({rejectionRate.toFixed(1)}%)
                </div>
              )}
              {contingencyNotes > 0 && (
                <div className="flex items-center gap-2 text-yellow-700">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {contingencyNotes} nota(s) em contingência
                </div>
              )}
              {certificateDaysUntilExpiration < 30 && (
                <div className="flex items-center gap-2 text-yellow-700">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Certificado expira em {certificateDaysUntilExpiration} dias
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detalhes */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs text-gray-600">Taxa de Sucesso</p>
            <p className="text-lg font-bold text-green-600 mt-1">{successRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Taxa de Rejeição</p>
            <p className="text-lg font-bold text-red-600 mt-1">{rejectionRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Contingência</p>
            <p className="text-lg font-bold text-yellow-600 mt-1">{contingencyNotes}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Certificado</p>
            <p className="text-lg font-bold text-brand-blue mt-1">{certificateDaysUntilExpiration}d</p>
          </div>
        </div>
      </div>
    </div>
  );
}
