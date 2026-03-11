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
      <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700">Nenhum Certificado Configurado</h3>
          <p className="text-gray-500">
            Você precisa fazer upload de um certificado digital para emitir notas fiscais.
          </p>
          <button
            onClick={onUpload}
            className="px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:shadow-lg transition-all font-semibold"
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
        className={`bg-white rounded-lg shadow-sm border-l-4 p-6 ${
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
              <div className="w-16 h-16 rounded-lg bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            ) : isExpiringSoon ? (
              <div className="w-16 h-16 rounded-lg bg-yellow-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alertas */}
      {isExpired && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-red-800 font-semibold mb-2">Certificado Expirado</p>
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
          </div>
        </div>
      )}

      {isExpiringSoon && !isExpired && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-yellow-800 font-semibold mb-2">Certificado Próximo de Expirar</p>
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
          </div>
        </div>
      )}

      {!isExpired && !isExpiringSoon && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-green-800 font-semibold mb-2">Certificado Válido</p>
              <p className="text-green-700 text-sm">
                Seu certificado está válido e pronto para emitir notas fiscais.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex gap-3">
        <button
          onClick={onValidate}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border-2 border-brand-blue text-brand-blue rounded-lg hover:bg-blue-50 transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {isLoading ? 'Validando...' : 'Validar Certificado'}
        </button>

        <button
          onClick={onUpload}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Atualizar Certificado
        </button>
      </div>
    </div>
  );
}
