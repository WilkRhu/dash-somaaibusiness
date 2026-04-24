'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useDeliveryReports } from '@/lib/hooks/use-delivery-reports';
import { GeneralReportComponent } from '@/components/delivery/reports/general-report';
import { DriversReportComponent } from '@/components/delivery/reports/drivers-report';
import { DailyReportComponent } from '@/components/delivery/reports/daily-report';
import { DelaysReportComponent } from '@/components/delivery/reports/delays-report';
import { RevenueReportComponent } from '@/components/delivery/reports/revenue-report';

type ReportTab = 'general' | 'drivers' | 'daily' | 'delays' | 'revenue';

export default function DeliveryReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('general');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [establishmentId, setEstablishmentId] = useState<string>('');

  const {
    generalReport,
    driversReport,
    dailyReport,
    delaysReport,
    revenueReport,
    loading,
    error,
    fetchGeneralReport,
    fetchDriversReport,
    fetchDailyReport,
    fetchDelaysReport,
    fetchRevenueReport,
  } = useDeliveryReports();

  // Get establishment ID from localStorage or context
  useEffect(() => {
    const estId = localStorage.getItem('establishmentId') || '';
    setEstablishmentId(estId);
  }, []);

  // Fetch reports when tab changes or dates change
  useEffect(() => {
    if (!establishmentId) return;

    const fetchReport = async () => {
      switch (activeTab) {
        case 'general':
          await fetchGeneralReport(establishmentId, dateRange.startDate, dateRange.endDate);
          break;
        case 'drivers':
          await fetchDriversReport(establishmentId, dateRange.startDate, dateRange.endDate);
          break;
        case 'daily':
          await fetchDailyReport(establishmentId, dateRange.startDate, dateRange.endDate);
          break;
        case 'delays':
          await fetchDelaysReport(establishmentId, dateRange.startDate, dateRange.endDate);
          break;
        case 'revenue':
          await fetchRevenueReport(establishmentId, dateRange.startDate, dateRange.endDate);
          break;
      }
    };

    fetchReport();
  }, [activeTab, dateRange, establishmentId]);

  const tabs: { id: ReportTab; label: string; icon: ReactNode }[] = [
    { 
      id: 'general', 
      label: 'Geral', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
    { 
      id: 'drivers', 
      label: 'Entregadores', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    { 
      id: 'daily', 
      label: 'Diário', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    { 
      id: 'delays', 
      label: 'Atrasos', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    { 
      id: 'revenue', 
      label: 'Receita', 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Relatórios de Delivery</h1>
          <p className="text-gray-600 mt-2">Análise completa de entregas e performance</p>
        </div>

        {/* Filtros de Data */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Carregando...' : 'Filtrar'}
            </button>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-center font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo das Abas */}
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}
          {activeTab === 'general' && <GeneralReportComponent data={generalReport} loading={loading} />}
          {activeTab === 'drivers' && <DriversReportComponent data={driversReport} loading={loading} />}
          {activeTab === 'daily' && <DailyReportComponent data={dailyReport} loading={loading} />}
          {activeTab === 'delays' && <DelaysReportComponent data={delaysReport} loading={loading} />}
          {activeTab === 'revenue' && <RevenueReportComponent data={revenueReport} loading={loading} />}
        </div>
      </div>
    </div>
  );
}
