'use client';

import Link from 'next/link';
import { useFiscalCertificate } from '@/lib/hooks/use-fiscal-certificate';
import { useFiscalMetrics } from '@/lib/hooks/use-fiscal-metrics';
import { useFiscalEmissions } from '@/lib/hooks/use-fiscal-emissions';
import { useFiscalNotes } from '@/lib/hooks/use-fiscal-notes';
import { isCertificateExpired, isCertificateExpiringSoon } from '@/lib/utils/fiscal-formatters';
import { MetricCard } from '@/components/fiscal/metric-card';
import { DashboardAlert } from '@/components/fiscal/dashboard-alert';
import { NotesChart } from '@/components/fiscal/charts/notes-chart';
import { EmissionsChart } from '@/components/fiscal/charts/emissions-chart';
import { ComplianceIndicator } from '@/components/fiscal/compliance-indicator';

export default function FiscalDashboard() {
  const { certificate } = useFiscalCertificate();
  const { metrics } = useFiscalMetrics();
  const { emissions, report, isLoading: emissionsLoading } = useFiscalEmissions(7);
  const { notes } = useFiscalNotes({ autoFetch: true });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Dashboard Fiscal</h1>
          <p className="text-gray-600 mt-2">Visão geral do seu sistema fiscal</p>
        </div>
        <Link
          href="/fiscal/notes/new"
          className="px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Emitir Nota
        </Link>
      </div>

      {/* Alertas */}
      <div className="space-y-3">
        {!certificate && (
          <DashboardAlert
            type="error"
            title="Certificado não configurado"
            message="Você precisa fazer upload de um certificado digital para emitir notas fiscais."
            action={{ label: 'Configurar certificado', href: '/fiscal/certificate' }}
          />
        )}

        {certificate && isCertificateExpired(certificate.expiresAt) && (
          <DashboardAlert
            type="error"
            title="Certificado expirado"
            message="Seu certificado digital expirou. Renove-o para continuar emitindo notas."
            action={{ label: 'Renovar certificado', href: '/fiscal/certificate' }}
          />
        )}

        {certificate && isCertificateExpiringSoon(certificate.expiresAt) && !isCertificateExpired(certificate.expiresAt) && (
          <DashboardAlert
            type="warning"
            title="Certificado próximo de expirar"
            message={`Seu certificado expira em ${certificate.daysUntilExpiration} dias. Recomendamos renovar em breve.`}
            action={{ label: 'Renovar certificado', href: '/fiscal/certificate' }}
          />
        )}

        {metrics && metrics.contingencyNotes > 0 && (
          <DashboardAlert
            type="warning"
            title="Notas em contingência"
            message={`Você tem ${metrics.contingencyNotes} nota(s) aguardando transmissão em modo de contingência.`}
            action={{ label: 'Ir para contingência', href: '/fiscal/contingency' }}
          />
        )}

        {metrics && metrics.rejectionRate > 10 && (
          <DashboardAlert
            type="warning"
            title="Taxa de rejeição elevada"
            message={`Sua taxa de rejeição está em ${metrics.rejectionRate.toFixed(1)}%. Verifique os dados das notas.`}
            action={{ label: 'Ver relatórios', href: '/fiscal/reports' }}
          />
        )}
      </div>

      {/* Cards de Métricas */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total de Notas"
            value={metrics.totalNotes}
            color="blue"
            subtitle="Notas emitidas"
          />
          <MetricCard
            title="Taxa de Sucesso"
            value={`${metrics.successRate.toFixed(1)}%`}
            color="green"
            subtitle="Notas autorizadas"
          />
          <MetricCard
            title="Taxa de Rejeição"
            value={`${metrics.rejectionRate.toFixed(1)}%`}
            color="red"
            subtitle="Notas rejeitadas"
          />
          <MetricCard
            title="Em Contingência"
            value={metrics.contingencyNotes}
            color="yellow"
            subtitle="Aguardando transmissão"
          />
        </div>
      )}

      {/* Gráfico de Status */}
      {metrics && metrics.statusBreakdown && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-brand-navy mb-6">Distribuição de Status</h2>
          <NotesChart
            authorized={metrics.statusBreakdown.authorized || 0}
            rejected={metrics.statusBreakdown.rejected || 0}
            cancelled={metrics.statusBreakdown.cancelled || 0}
            pending={metrics.statusBreakdown.pending || 0}
          />
        </div>
      )}

      {/* Gráfico de Emissões */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-brand-navy">Emissões nos Últimos 7 Dias</h2>
          {report && (
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold text-brand-navy">{report.summary.totalEmissions}</span>
            </div>
          )}
        </div>
        {emissionsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-brand-navy">Carregando dados de emissões...</div>
          </div>
        ) : emissions.length > 0 ? (
          <>
            <EmissionsChart
              data={emissions.map((e) => ({
                date: e.dayOfWeek,
                count: e.count,
              }))}
            />
            {report && (
              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600">Valor Total</p>
                  <p className="text-lg font-bold text-brand-navy mt-1">
                    R$ {report.summary.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Valor Médio</p>
                  <p className="text-lg font-bold text-brand-green mt-1">
                    R$ {report.summary.averageValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Taxa de Sucesso</p>
                  <p className="text-lg font-bold text-green-600 mt-1">
                    {report.summary.successRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Autorizadas</p>
                  <p className="text-lg font-bold text-brand-blue mt-1">
                    {report.byStatus.authorized}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm">Nenhuma emissão nos últimos 7 dias</p>
          </div>
        )}
      </div>

      {/* Indicador de Conformidade */}
      {metrics && certificate && (
        <ComplianceIndicator
          successRate={metrics.successRate}
          rejectionRate={metrics.rejectionRate}
          contingencyNotes={metrics.contingencyNotes}
          certificateDaysUntilExpiration={certificate.daysUntilExpiration}
        />
      )}

      {/* Ações Rápidas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-brand-navy mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link
            href="/fiscal/certificate"
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-blue-50 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-brand-navy text-sm">Gerenciar Certificado</p>
              <p className="text-xs text-gray-500">Configurar certificado digital</p>
            </div>
          </Link>
          <Link
            href="/fiscal/notes"
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-green hover:bg-green-50 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-green to-brand-blue flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-brand-navy text-sm">Ver Notas Fiscais</p>
              <p className="text-xs text-gray-500">Gerenciar todas as notas</p>
            </div>
          </Link>
          <Link
            href="/fiscal/reports"
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-blue hover:bg-blue-50 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-navy to-brand-blue flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-brand-navy text-sm">Gerar Relatórios</p>
              <p className="text-xs text-gray-500">Análises e insights fiscais</p>
            </div>
          </Link>
          <Link
            href="/sales/pos"
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-brand-green hover:bg-green-50 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-brand-navy text-sm">Ir para POS</p>
              <p className="text-xs text-gray-500">Emitir notas nas vendas</p>
            </div>
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
