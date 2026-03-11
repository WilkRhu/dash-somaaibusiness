'use client';

import Link from 'next/link';
import { useFiscalCertificate } from '@/lib/hooks/use-fiscal-certificate';
import { useFiscalMetrics } from '@/lib/hooks/use-fiscal-metrics';
import { useFiscalNotes } from '@/lib/hooks/use-fiscal-notes';
import { isCertificateExpired, isCertificateExpiringSoon } from '@/lib/utils/fiscal-formatters';
import { MetricCard } from '@/components/fiscal/metric-card';
import { DashboardAlert } from '@/components/fiscal/dashboard-alert';
import { NotesChart } from '@/components/fiscal/charts/notes-chart';
import { EmissionsChart } from '@/components/fiscal/charts/emissions-chart';
import { ComplianceIndicator } from '@/components/fiscal/compliance-indicator';

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
          <DashboardAlert
            type="error"
            icon="⚠️"
            title="Certificado não configurado"
            message="Você precisa fazer upload de um certificado digital para emitir notas fiscais."
            action={{ label: 'Configurar certificado', href: '/fiscal/certificate' }}
          />
        )}

        {certificate && isCertificateExpired(certificate.expiresAt) && (
          <DashboardAlert
            type="error"
            icon="❌"
            title="Certificado expirado"
            message="Seu certificado digital expirou. Renove-o para continuar emitindo notas."
            action={{ label: 'Renovar certificado', href: '/fiscal/certificate' }}
          />
        )}

        {certificate && isCertificateExpiringSoon(certificate.expiresAt) && !isCertificateExpired(certificate.expiresAt) && (
          <DashboardAlert
            type="warning"
            icon="⚠️"
            title="Certificado próximo de expirar"
            message={`Seu certificado expira em ${certificate.daysUntilExpiration} dias. Recomendamos renovar em breve.`}
            action={{ label: 'Renovar certificado', href: '/fiscal/certificate' }}
          />
        )}

        {metrics && metrics.contingencyNotes > 0 && (
          <DashboardAlert
            type="warning"
            icon="⚠️"
            title="Notas em contingência"
            message={`Você tem ${metrics.contingencyNotes} nota(s) aguardando transmissão em modo de contingência.`}
            action={{ label: 'Ir para contingência', href: '/fiscal/contingency' }}
          />
        )}

        {metrics && metrics.rejectionRate > 10 && (
          <DashboardAlert
            type="warning"
            icon="📊"
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
            icon="📄"
            color="blue"
            subtitle="Notas emitidas"
          />
          <MetricCard
            title="Taxa de Sucesso"
            value={`${metrics.successRate.toFixed(1)}%`}
            icon="✅"
            color="green"
            subtitle="Notas autorizadas"
          />
          <MetricCard
            title="Taxa de Rejeição"
            value={`${metrics.rejectionRate.toFixed(1)}%`}
            icon="❌"
            color="red"
            subtitle="Notas rejeitadas"
          />
          <MetricCard
            title="Em Contingência"
            value={metrics.contingencyNotes}
            icon="⚠️"
            color="yellow"
            subtitle="Aguardando transmissão"
          />
        </div>
      )}

      {/* Gráfico de Status */}
      {metrics && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Distribuição de Status</h2>
          <NotesChart
            authorized={metrics.statusBreakdown.authorized}
            rejected={metrics.statusBreakdown.rejected}
            cancelled={metrics.statusBreakdown.cancelled}
            pending={metrics.statusBreakdown.pending}
          />
        </div>
      )}

      {/* Gráfico de Emissões */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Emissões nos Últimos 7 Dias</h2>
        <EmissionsChart
          data={[
            { date: 'Seg', count: Math.floor(Math.random() * 20) },
            { date: 'Ter', count: Math.floor(Math.random() * 20) },
            { date: 'Qua', count: Math.floor(Math.random() * 20) },
            { date: 'Qui', count: Math.floor(Math.random() * 20) },
            { date: 'Sex', count: Math.floor(Math.random() * 20) },
            { date: 'Sab', count: Math.floor(Math.random() * 20) },
            { date: 'Dom', count: Math.floor(Math.random() * 20) },
          ]}
        />
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
