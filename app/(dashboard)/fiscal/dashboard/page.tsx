'use client';

import Link from 'next/link';
import { useFiscalCertificate } from '@/lib/hooks/use-fiscal-certificate';
import { useFiscalMetrics } from '@/lib/hooks/use-fiscal-metrics';
import { useFiscalNotes } from '@/lib/hooks/use-fiscal-notes';
import { isCertificateExpired, isCertificateExpiringSoon } from '@/lib/utils/fiscal-formatters';

export default function FiscalDashboard() {
  const { certificate } = useFiscalCertificate();
  const { metrics, isLoading: metricsLoading } = useFiscalMetrics();
  const { notes } = useFiscalNotes({ autoFetch: true });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Dashboard Fiscal</h1>
        <p className="text-gray-600 mt-2">Visão geral do seu sistema fiscal</p>
      </div>

      {/* Alertas */}
      <div className="space-y-3">
        {!certificate && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-red-900">Certificado não configurado</p>
              <p className="text-sm text-red-800 mt-1">
                Você precisa fazer upload de um certificado digital para emitir notas fiscais.
              </p>
              <Link
                href="/fiscal/certificate"
                className="text-sm font-semibold text-red-600 hover:text-red-700 mt-2 inline-block"
              >
                Configurar certificado →
              </Link>
            </div>
          </div>
        )}

        {certificate && isCertificateExpired(certificate.expiresAt) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <span className="text-2xl">❌</span>
            <div className="flex-1">
              <p className="font-semibold text-red-900">Certificado expirado</p>
              <p className="text-sm text-red-800 mt-1">
                Seu certificado digital expirou. Renove-o para continuar emitindo notas.
              </p>
              <Link
                href="/fiscal/certificate"
                className="text-sm font-semibold text-red-600 hover:text-red-700 mt-2 inline-block"
              >
                Renovar certificado →
              </Link>
            </div>
          </div>
        )}

        {certificate && isCertificateExpiringSoon(certificate.expiresAt) && !isCertificateExpired(certificate.expiresAt) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-yellow-900">Certificado próximo de expirar</p>
              <p className="text-sm text-yellow-800 mt-1">
                Seu certificado expira em breve. Recomendamos renovar em breve.
              </p>
              <Link
                href="/fiscal/certificate"
                className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 mt-2 inline-block"
              >
                Renovar certificado →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Cards de Métricas */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total de Notas */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Notas</p>
                <p className="text-3xl font-bold text-brand-navy mt-2">{metrics.totalNotes}</p>
              </div>
              <span className="text-4xl">📄</span>
            </div>
          </div>

          {/* Taxa de Sucesso */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Taxa de Sucesso</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{metrics.successRate.toFixed(1)}%</p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </div>

          {/* Taxa de Rejeição */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Taxa de Rejeição</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{metrics.rejectionRate.toFixed(1)}%</p>
              </div>
              <span className="text-4xl">❌</span>
            </div>
          </div>

          {/* Notas em Contingência */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Em Contingência</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{metrics.contingencyNotes}</p>
              </div>
              <span className="text-4xl">⚠️</span>
            </div>
          </div>
        </div>
      )}

      {/* Status de Notas */}
      {metrics && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Status das Notas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{metrics.statusBreakdown.authorized}</p>
              <p className="text-sm text-gray-600 mt-1">Autorizadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{metrics.statusBreakdown.rejected}</p>
              <p className="text-sm text-gray-600 mt-1">Rejeitadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{metrics.statusBreakdown.cancelled}</p>
              <p className="text-sm text-gray-600 mt-1">Canceladas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{metrics.statusBreakdown.pending}</p>
              <p className="text-sm text-gray-600 mt-1">Pendentes</p>
            </div>
          </div>
        </div>
      )}

      {/* Ações Rápidas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link
            href="/fiscal/certificate"
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-center"
          >
            📋 Gerenciar Certificado
          </Link>
          <Link
            href="/fiscal/notes"
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-center"
          >
            📄 Ver Notas Fiscais
          </Link>
          <Link
            href="/fiscal/reports"
            className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-center"
          >
            📈 Gerar Relatórios
          </Link>
          <Link
            href="/sales/pos"
            className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold text-center"
          >
            🛒 Ir para POS
          </Link>
        </div>
      </div>

      {/* Últimas Notas */}
      {notes.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Últimas Notas Emitidas</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Número</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Tipo</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Status</th>
                  <th className="text-right py-2 px-3 font-semibold text-gray-700">Total</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Data</th>
                </tr>
              </thead>
              <tbody>
                {notes.slice(0, 5).map((note) => (
                  <tr key={note.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium text-brand-navy">{note.number}</td>
                    <td className="py-2 px-3 text-gray-600">{note.type.toUpperCase()}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          note.status === 'authorized'
                            ? 'bg-green-100 text-green-800'
                            : note.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : note.status === 'cancelled'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {note.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-brand-navy">
                      R$ {Number(note.totals.total).toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link
            href="/fiscal/notes"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 mt-4 inline-block"
          >
            Ver todas as notas →
          </Link>
        </div>
      )}
    </div>
  );
}
