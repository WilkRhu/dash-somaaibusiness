'use client';

import { useEffect } from 'react';
import { useEstablishmentSettingsStore } from '@/lib/stores/establishment-settings-store';
import { UpdateEstablishmentSettingsDto } from '@/lib/types/establishment';

export function useEstablishmentSettings(establishmentId: string | undefined) {
  const { settings, isLoading, isSaving, error, fetchSettings, updateSettings } =
    useEstablishmentSettingsStore();

  useEffect(() => {
    if (!establishmentId) return;
    fetchSettings(establishmentId);
  }, [establishmentId]);

  return {
    settings,
    isLoading,
    isSaving,
    error,
    refetch: () => establishmentId && fetchSettings(establishmentId),
    updateSettings: (dto: UpdateEstablishmentSettingsDto) => {
      if (!establishmentId) throw new Error('establishmentId não definido');
      return updateSettings(establishmentId, dto);
    },
  };
}
