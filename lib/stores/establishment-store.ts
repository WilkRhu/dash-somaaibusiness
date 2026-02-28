import { create } from 'zustand';
import { Establishment } from '@/lib/types/establishment';

interface EstablishmentStore {
  currentEstablishment: Establishment | null;
  establishments: Establishment[];
  setCurrentEstablishment: (establishment: Establishment) => void;
  setEstablishments: (establishments: Establishment[]) => void;
}

export const useEstablishmentStore = create<EstablishmentStore>((set) => ({
  currentEstablishment: null,
  establishments: [],
  
  setCurrentEstablishment: (establishment) => {
    localStorage.setItem('currentEstablishmentId', establishment.id);
    set({ currentEstablishment: establishment });
  },
  
  setEstablishments: (establishments) => set({ establishments }),
}));
