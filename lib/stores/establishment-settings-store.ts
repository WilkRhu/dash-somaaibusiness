import { create } from 'zustand';
import { EstablishmentSettings, UpdateEstablishmentSettingsDto } from '@/lib/types/establishment';
import { establishmentsApi } from '@/lib/api/establishments';

interface EstablishmentSettingsStore {
  settings: EstablishmentSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchSettings: (establishmentId: string) => Promise<void>;
  updateSettings: (establishmentId: string, dto: UpdateEstablishmentSettingsDto) => Promise<EstablishmentSettings>;
}

export const useEstablishmentSettingsStore = create<EstablishmentSettingsStore>((set) => ({
  settings: null,
  isLoading: false,
  isSaving: false,
  error: null,

  fetchSettings: async (establishmentId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await establishmentsApi.getSettings(establishmentId);
      set({ settings: data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Erro ao carregar configurações' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSettings: async (establishmentId: string, dto: UpdateEstablishmentSettingsDto) => {
    set({ isSaving: true, error: null });
    try {
      const updated = await establishmentsApi.updateSettings(establishmentId, dto);
      set({ settings: updated });
      return updated;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Erro ao salvar configurações' });
      throw err;
    } finally {
      set({ isSaving: false });
    }
  },
}));
