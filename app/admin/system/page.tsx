'use client';

import { useEffect, useState } from 'react';
import { useAdminStore } from '@/lib/stores/admin-store';

export default function SystemPage() {
  const { systemInfo, fetchSystemInfo, clearLogs, createBackup, restartService, isLoadingSystem } = useAdminStore();
  const [activeTab, setActiveTab] = useState('info');
  const [clearDays, setClearDays] = useState('90');
  const [serviceName, setServiceName] = useState('');

  useEffect(() => {
    fetchSystemInfo();
  }, [fetchSystemInfo]);

  const handleClearLogs = async () => {
    if (confirm(`Tem certeza que deseja limpar logs anteriores a ${clearDays} dias?`)) {
      await clearLogs(parseInt(clearDays));
    }
  };

  const handleCreateBackup = async () => {
    await createBackup();
  };

  const handleRestartService = async () => {
    if (serviceName && confirm(`Tem certeza que deseja reiniciar o serviço ${serviceName}?`)) {
      await restartService(serviceName);
      setServiceName('');
    }
  };

  const formatUptime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return 'N/A';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const formatBytes = (bytes: number) => {
    if (!bytes || isNaN(bytes)) return '0 GB';
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Administração do Sistema</h1>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-4">
          {['info', 'actions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 border-b-2 font-medium capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'info' ? 'Informações' : 'Ações'}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'info' && (
        <>
          {isLoadingSystem ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : systemInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Versão</p>
                    <p className="text-xl font-bold text-gray-800">{systemInfo.version}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Uptime</p>
                    <p className="text-xl font-bold text-gray-800">{formatUptime(systemInfo.uptime)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">CPU</p>
                    <p className="text-xl font-bold text-gray-800">{systemInfo.cpu != null && !isNaN(systemInfo.cpu) ? `${systemInfo.cpu.toFixed(1)}%` : 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Memória</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Usado</span>
                    <span className="font-medium">{formatBytes(systemInfo.memory.used)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total</span>
                    <span className="font-medium">{formatBytes(systemInfo.memory.total)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${systemInfo.memory.total ? (systemInfo.memory.used / systemInfo.memory.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Disco</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Usado</span>
                    <span className="font-medium">{formatBytes(systemInfo.disk?.used)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total</span>
                    <span className="font-medium">{formatBytes(systemInfo.disk?.total)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${systemInfo.disk?.total ? (systemInfo.disk.used / systemInfo.disk.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Não foi possível carregar as informações do sistema.
            </div>
          )}
        </>
      )}

      {activeTab === 'actions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Limpar Logs</h3>
            <p className="text-gray-500 text-sm mb-4">
              Remove logs anteriores ao período especificado para liberar espaço em disco.
            </p>
            <div className="flex gap-3">
              <select
                value={clearDays}
                onChange={(e) => setClearDays(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">7 dias</option>
                <option value="30">30 dias</option>
                <option value="60">60 dias</option>
                <option value="90">90 dias</option>
              </select>
              <button
                onClick={handleClearLogs}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Limpar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Criar Backup</h3>
            <p className="text-gray-500 text-sm mb-4">
              Cria um backup completo do banco de dados e configurações.
            </p>
            <button
              onClick={handleCreateBackup}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Criar Backup
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Reiniciar Serviço</h3>
            <p className="text-gray-500 text-sm mb-4">
              Reinicia um serviço específico do sistema. Use com cautela.
            </p>
            <div className="flex gap-3">
              <select
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um serviço</option>
                <option value="api">API</option>
                <option value="database">Banco de Dados</option>
                <option value="email">Serviço de Email</option>
                <option value="scheduler">Scheduler</option>
              </select>
              <button
                onClick={handleRestartService}
                disabled={!serviceName}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}