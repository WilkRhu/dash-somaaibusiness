'use client';

import { useEffect, useState } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { useEstablishmentSettings } from '@/lib/hooks/use-establishment-settings';
import { isKitchenEstablishment } from '@/lib/constants/establishment-types';
import { showToast } from '@/components/ui/toast';

function ToggleRow({
  label,
  description,
  icon,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-brand-blue flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-brand-navy">{label}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          checked ? 'bg-brand-blue' : 'bg-gray-300'
        }`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

function InputRow({
  label,
  description,
  icon,
  value,
  onChange,
  onBlur,
  disabled,
  prefix,
  suffix,
  type,
  placeholder,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  value: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  disabled: boolean;
  prefix?: string;
  suffix?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-0 gap-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-brand-blue flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-brand-navy">{label}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
        <input
          type={type || 'number'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder || '0'}
          className="w-24 text-right border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:opacity-50 disabled:bg-gray-50"
        />
        {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
      </div>
    </div>
  );
}

export default function EstablishmentSettingsPage() {
  const { currentEstablishment } = useEstablishmentStore();
  const { settings, isLoading, isSaving, error, updateSettings } = useEstablishmentSettings(
    currentEstablishment?.id
  );
  const hasKitchen = isKitchenEstablishment(currentEstablishment?.type);

  const [minOrderValue, setMinOrderValue] = useState('');
  const [maxDeliveryRadius, setMaxDeliveryRadius] = useState('');

  // Sincroniza inputs com settings carregadas
  useEffect(() => {
    if (settings) {
      setMinOrderValue(settings.minOrderValue ?? '0');
      setMaxDeliveryRadius(settings.maxDeliveryRadiusKm != null ? String(settings.maxDeliveryRadiusKm) : '');
    }
  }, [settings?.minOrderValue, settings?.maxDeliveryRadiusKm]);

  // Corrige kitchenEnabled se o tipo não tem cozinha
  useEffect(() => {
    if (!hasKitchen && settings?.kitchenEnabled === true && currentEstablishment?.id) {
      updateSettings({ kitchenEnabled: false });
    }
  }, [hasKitchen, settings?.kitchenEnabled]);

  const handleToggle = async (key: 'kitchenEnabled' | 'deliveryEnabled' | 'kitchenNotificationsEnabled' | 'autoAcceptOrders', value: boolean) => {
    try {
      await updateSettings({ [key]: value });
      showToast('Configuração salva!', 'success');
    } catch {
      showToast('Erro ao salvar configuração.', 'error');
    }
  };

  const handleInputSave = async (key: 'minOrderValue' | 'maxDeliveryRadiusKm', raw: string) => {
    try {
      const parsed = raw === '' ? null : parseFloat(raw);
      await updateSettings({ [key]: key === 'minOrderValue' ? String(parsed ?? '0') : parsed });
      showToast('Configuração salva!', 'success');
    } catch {
      showToast('Erro ao salvar.', 'error');
    }
  };

  if (!currentEstablishment) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Nenhum estabelecimento selecionado.</p>
      </div>
    );
  }

  const skeletonRows = hasKitchen ? 4 : 3;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Configurações</h1>
        <p className="text-gray-500 mt-1">Gerencie as funcionalidades de {currentEstablishment.name}.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Cards lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Funcionalidades */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-brand-navy mb-1">Funcionalidades</h2>
          <p className="text-sm text-gray-500 mb-4">Ative ou desative módulos do sistema.</p>

        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b last:border-0 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-48 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="h-7 w-12 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {hasKitchen && (
              <ToggleRow
                label="Cozinha (Kitchen)"
                description="Habilita o painel de pedidos da cozinha e o display KDS."
                checked={settings?.kitchenEnabled ?? false}
                onChange={(val) => handleToggle('kitchenEnabled', val)}
                disabled={isSaving}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                }
              />
            )}
            {hasKitchen && (
              <ToggleRow
                label="Notificações da Cozinha"
                description="Envia alertas sonoros e visuais quando novos pedidos chegam."
                checked={settings?.kitchenNotificationsEnabled ?? true}
                onChange={(val) => handleToggle('kitchenNotificationsEnabled', val)}
                disabled={isSaving || !settings?.kitchenEnabled}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                }
              />
            )}
            <ToggleRow
              label="Delivery"
              description="Habilita o módulo de entregas e rastreamento de pedidos."
              checked={settings?.deliveryEnabled ?? true}
              onChange={(val) => handleToggle('deliveryEnabled', val)}
              disabled={isSaving}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              }
            />
            <ToggleRow
              label="Aceitar Pedidos Automaticamente"
              description="Confirma novos pedidos sem precisar de aprovação manual."
              checked={settings?.autoAcceptOrders ?? false}
              onChange={(val) => handleToggle('autoAcceptOrders', val)}
              disabled={isSaving}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </>
        )}

        {isSaving && <p className="text-sm text-gray-400 mt-3 text-right">Salvando...</p>}
        </div>

        {/* Delivery */}
        <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-brand-navy mb-1">Configurações de Delivery</h2>
        <p className="text-sm text-gray-500 mb-4">Defina limites e regras para entregas.</p>

        {isLoading ? (
          <div className="space-y-1">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b last:border-0 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                    <div className="h-3 w-52 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="h-8 w-24 bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <InputRow
              label="Pedido Mínimo"
              description="Valor mínimo para aceitar um pedido de delivery."
              prefix="R$"
              value={minOrderValue}
              onChange={setMinOrderValue}
              onBlur={() => handleInputSave('minOrderValue', minOrderValue)}
              disabled={isSaving || !settings?.deliveryEnabled}
              placeholder="0.00"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <InputRow
              label="Raio Máximo de Entrega"
              description="Distância máxima em km para aceitar pedidos de delivery."
              suffix="km"
              value={maxDeliveryRadius}
              onChange={setMaxDeliveryRadius}
              onBlur={() => handleInputSave('maxDeliveryRadiusKm', maxDeliveryRadius)}
              disabled={isSaving || !settings?.deliveryEnabled}
              placeholder="Sem limite"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
          </>
        )}
        </div>

      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-600">
        <p className="font-medium text-brand-navy mb-1">Como funciona?</p>
        <p>
          Ao desativar uma funcionalidade, ela fica indisponível para todos os usuários deste estabelecimento.
          Você pode reativar a qualquer momento sem perda de dados.
        </p>
      </div>
    </div>
  );
}
