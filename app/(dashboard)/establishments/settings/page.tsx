'use client';

import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { useEstablishmentSettings } from '@/lib/hooks/use-establishment-settings';
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
    <div className="flex items-center justify-between py-5 border-b last:border-0">
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
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export default function EstablishmentSettingsPage() {
  const { currentEstablishment } = useEstablishmentStore();
  const { settings, isLoading, isSaving, error, updateSettings } = useEstablishmentSettings(
    currentEstablishment?.id
  );

  const handleToggle = async (key: 'kitchenEnabled' | 'deliveryEnabled', value: boolean) => {
    try {
      await updateSettings({ [key]: value });
      showToast('Configuração salva com sucesso!', 'success');
    } catch {
      showToast('Erro ao salvar configuração.', 'error');
    }
  };

  if (!currentEstablishment) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Nenhum estabelecimento selecionado.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Configurações</h1>
        <p className="text-gray-500 mt-1">Ative ou desative funcionalidades do estabelecimento.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-brand-navy mb-1">Funcionalidades</h2>
        <p className="text-sm text-gray-500 mb-4">
          Controle quais módulos estão disponíveis para {currentEstablishment.name}.
        </p>

        {isLoading ? (
          <div className="space-y-5">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between py-5 border-b last:border-0 animate-pulse">
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
            <ToggleRow
              label="Cozinha (Kitchen)"
              description="Habilita o painel de pedidos da cozinha e o display KDS."
              checked={settings?.kitchenEnabled ?? true}
              onChange={(val) => handleToggle('kitchenEnabled', val)}
              disabled={isSaving}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              }
            />
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
          </>
        )}

        {isSaving && (
          <p className="text-sm text-gray-400 mt-4 text-right">Salvando...</p>
        )}
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
