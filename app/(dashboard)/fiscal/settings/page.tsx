'use client';

import { useState, useEffect } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { showToast } from '@/components/ui/toast';

interface EstablishmentFiscalSettings {
  establishmentId: string;
  cnpj: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  nfceEnabled: boolean;
  nfeEnabled: boolean;
  defaultNoteType: 'nfce' | 'nfe';
  defaultSeries: string;
  autoEmitNotes: boolean;
  contingencyMode: boolean;
}

export default function FiscalSettingsPage() {
  const { currentEstablishment } = useEstablishmentStore();
  const [settings, setSettings] = useState<EstablishmentFiscalSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [currentEstablishment?.id]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      if (!currentEstablishment) {
        showToast('Nenhum estabelecimento selecionado', 'error');
        return;
      }

      // TODO: Implementar chamada à API para carregar configurações
      // const result = await fiscalApi.getEstablishmentSettings(currentEstablishment.id)

      // Mock data por enquanto
      setSettings({
        establishmentId: currentEstablishment.id,
        cnpj: currentEstablishment.cnpj || '',
        name: currentEstablishment.name || '',
        email: currentEstablishment.email || '',
        phone: currentEstablishment.phone || '',
        address: currentEstablishment.address || '',
        city: currentEstablishment.city || '',
        state: currentEstablishment.state || '',
        zipCode: currentEstablishment.zipCode || '',
        nfceEnabled: true,
        nfeEnabled: false,
        defaultNoteType: 'nfce',
        defaultSeries: '1',
        autoEmitNotes: false,
        contingencyMode: false,
      });
    } catch (error: any) {
      showToast(error.message || 'Erro ao carregar configurações', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      // TODO: Implementar chamada à API para salvar configurações
      // await fiscalApi.updateEstablishmentSettings(settings)

      showToast('Configurações salvas com sucesso!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Erro ao salvar configurações', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof EstablishmentFiscalSettings, value: any) => {
    if (settings) {
      setSettings({
        ...settings,
        [field]: value,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Carregando configurações...</p>
      </div>
    );
  }

  if (!settings || !currentEstablishment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Nenhum estabelecimento selecionado</p>
        <p className="text-sm text-gray-400">Selecione um estabelecimento no menu para configurar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Configurações Fiscais</h1>
        <p className="text-gray-600 mt-2">Estabelecimento: {currentEstablishment.name}</p>
      </div>

      {/* Informações do Estabelecimento */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Informações do Estabelecimento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
            <input
              type="text"
              value={settings.cnpj}
              onChange={(e) => handleChange('cnpj', e.target.value)}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
            <input
              type="text"
              value={settings.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <input
              type="text"
              value={settings.state}
              onChange={(e) => handleChange('state', e.target.value)}
              maxLength={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
            <input
              type="text"
              value={settings.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Configurações de Emissão */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Configurações de Emissão</h2>
        <div className="space-y-4">
          {/* Tipos de Nota Habilitados */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Tipos de Nota Habilitados</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.nfceEnabled}
                  onChange={(e) => handleChange('nfceEnabled', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">NFC-e (Consumidor Final)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.nfeEnabled}
                  onChange={(e) => handleChange('nfeEnabled', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">NF-e (Empresa)</span>
              </label>
            </div>
          </div>

          {/* Tipo de Nota Padrão */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Nota Padrão</label>
            <select
              value={settings.defaultNoteType}
              onChange={(e) => handleChange('defaultNoteType', e.target.value as 'nfce' | 'nfe')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            >
              <option value="nfce">NFC-e</option>
              <option value="nfe">NF-e</option>
            </select>
          </div>

          {/* Série Padrão */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Série Padrão</label>
            <input
              type="text"
              value={settings.defaultSeries}
              onChange={(e) => handleChange('defaultSeries', e.target.value)}
              placeholder="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Configurações Avançadas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Configurações Avançadas</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={settings.autoEmitNotes}
              onChange={(e) => handleChange('autoEmitNotes', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Emissão Automática de Notas</p>
              <p className="text-sm text-gray-600">Emitir notas automaticamente ao finalizar vendas</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              checked={settings.contingencyMode}
              onChange={(e) => handleChange('contingencyMode', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
              disabled
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Modo de Contingência</p>
              <p className="text-sm text-gray-600">Ativado automaticamente quando Receita Federal está indisponível</p>
            </div>
          </label>
        </div>
      </div>

      {/* Status de Integração */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-blue-900 mb-4">Status de Integração</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">Certificado Digital</span>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
              ✓ Configurado
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">Dados do Estabelecimento</span>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
              ✓ Completo
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">Tipos de Nota</span>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
              ✓ Habilitado
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">Integração com Vendas</span>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
              ✓ Ativo
            </span>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-3">
        <button
          onClick={loadSettings}
          disabled={isSaving}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
        >
          🔄 Descartar Alterações
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
        >
          {isSaving ? 'Salvando...' : '✓ Salvar Configurações'}
        </button>
      </div>

      {/* Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>ℹ️ Informação:</strong> As configurações fiscais do estabelecimento são usadas automaticamente ao emitir notas fiscais. Certifique-se de que todos os dados estão corretos antes de emitir notas.
        </p>
      </div>
    </div>
  );
}
