import { create } from 'zustand';
import type { Member } from '@/lib/types/member';

interface MembersState {
  members: Member[];
  loading: boolean;
  error: string | null;
  setMembers: (members: Member[]) => void;
  addMember: (member: Member) => void;
  updateMember: (userId: string, updates: Partial<Member>) => void;
  removeMember: (userId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  members: [],
  loading: false,
  error: null,
};

export const useMembersStore = create<MembersState>((set) => ({
  ...initialState,

  setMembers: (members) => set({ members, error: null }),

  addMember: (member) =>
    set((state) => ({
      members: [...state.members, member],
      error: null,
    })),

  updateMember: (userId, updates) =>
    set((state) => ({
      members: state.members.map((m) =>
        m.userId === userId ? { ...m, ...updates } : m
      ),
      error: null,
    })),

  removeMember: (userId) =>
    set((state) => ({
      members: state.members.filter((m) => m.userId !== userId),
      error: null,
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
