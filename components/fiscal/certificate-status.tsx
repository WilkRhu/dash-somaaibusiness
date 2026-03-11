'use client';

import { FiscalCertificate } from '@/lib/types/fiscal';
import {
  isCertificateExpired,
  isCertificateExpiringSoon,
  daysUntilExpiry,
  formatDate,
  formatCertificateType,
} from '@/lib/utils/fiscal-formatters';

interface CertificateStatusProps {
  certificate: FiscalCertificate | null;
  onUpload: () => void;
  onValidate: () => void;
  isLoading?: boolean;
}

export function CertificateStatus({
  certificate,
  onUpload,
  onValidate,
  isLoading = false,
}: CertificateStatusProps) {
  if (!certificate) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border-2 border-dashed border-gray-300">
        <div className="text-center space-y-4">
          <div className="text-6xl">📋</div>
          <h3 className="text-xl font-semibold text-gray-700">Nenhum Certificado Configurado</h3>
          <p className="text-gray-500">
            Você precisa fazer upload de um certificado digital para emitir notas fiscais.
          </p>
          <button
            onClick={onUpload}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Fazer Upload do Certificado
          </button>
        </div>
      </div>
    );
  }

  const isExpired = isCertificateExpired(certificate.expiresAt);
  const isExpiringSoon = isCertificateExpiringSoon(certificate.expiresAt);
  const daysLeft = daysUntilExpiry(certificate.expiresAt);

  return (
    <div className="space-y-4">
      {/* Card Principal */}
      <div
        className={`bg-white rounded-lg shadow p-6 border-l-4 ${
          isExpired
            ? 'border-l-red-600 bg-red-50'
            : isExpiringSoon
            ? 'border-l-yellow-600 bg-yellow-50'
            : 'border-l-green-600 bg-green-50'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-4">
              {isExpired ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Expirado
                </span>
              ) : isExpiringSoon ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-600 text-white rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Próximo de Expirar
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  Válido
                </span>
              )}
            </div>

            {/* Informações */}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Tipo de Certificado</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCertificateType(certificate.type)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Titular</p>
                <p className="text-lg font-semibold text-gray-900">{certificate.holderName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">CNPJ</p>
                <p className="text-lg font-semibold text-gray-900 font-mono">{certificate.cnpj}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Data de Expiração</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(certificate.expiresAt)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Dias Restantes</p>
                  <p
                    className={`text-lg font-semibold ${
                      isExpired
                        ? 'text-red-600'
                        : isExpiringSoon
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {isExpired ? 'Expirado' : `${daysLeft} dias`}
                  </p>
                </div>
              </div>

              {certificate.lastValidatedAt && (
                <div>
                  <p className="text-sm text-gray-600">Última Validação</p>
                  <p className="text-sm text-gray-500">
                    {new Date(certificate.lastValidatedAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ícone */}
          <div className="ml-6">
            {isExpired ? (
              <div className="text-6xl">❌</div>
            ) : isExpiringSoon ? (
              <div className="text-6xl">⚠️</div>
            ) : (
              <div className="text-6xl">✅</div>
            )}
          </div>
        </div>
      </div>

      {/* Alertas */}
      {isExpired && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold mb-2">⚠️ Certificado Expirado</p>
          <p className="text-red-700 text-sm mb-3">
            Seu certificado digital expirou. Você não conseguirá emitir notas fiscais até renovar.
          </p>
          <button
            onClick={onUpload}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm"
          >
            Renovar Certificado
          </button>
        </div>
      )}

      {isExpiringSoon && !isExpired && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-semibold mb-2">⚠️ Certificado Próximo de Expirar</p>
          <p className="text-yellow-700 text-sm mb-3">
            Seu certificado digital expira em {daysLeft} dias. Recomendamos renovar em breve.
          </p>
          <button
            onClick={onUpload}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-sm"
          >
            Renovar Certificado
          </button>
        </div>
      )}

      {!isExpired && !isExpiringSoon && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-semibold mb-2">✅ Certificado Válido</p>
          <p className="text-green-700 text-sm">
            Seu certificado está válido e pronto para emitir notas fiscais.
          </p>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex gap-3">
        <button
          onClick={onValidate}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Validando...' : 'Validar Certificado'}
        </button>

        <button
          onClick={onUpload}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Atualizar Certificado
        </button>
      </div>
    </div>
  );
}
