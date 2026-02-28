import { useCallback } from 'react';
import { useMembersStore } from '@/lib/stores/members-store';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { membersApi } from '@/lib/api/members';
import type { AddMemberRequest, CreateEmployeeRequest, UpdateMemberRoleRequest } from '@/lib/types/member';

export function useMembers() {
  const { members, loading, error, setMembers, addMember, updateMember, removeMember, setLoading, setError } = useMembersStore();
  const { currentEstablishment } = useEstablishmentStore();

  const loadMembers = useCallback(async () => {
    if (!currentEstablishment?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await membersApi.getMembers(currentEstablishment.id);
      setMembers(data);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao carregar funcionários';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentEstablishment?.id, setMembers, setLoading, setError]);

  const createEmployee = useCallback(async (data: CreateEmployeeRequest) => {
    if (!currentEstablishment?.id) throw new Error('Nenhum estabelecimento selecionado');

    try {
      setLoading(true);
      setError(null);
      const newMember = await membersApi.createEmployee(currentEstablishment.id, data);
      addMember(newMember);
      return newMember;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao criar funcionário';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentEstablishment?.id, addMember, setLoading, setError]);

  const createMember = useCallback(async (data: AddMemberRequest) => {
    if (!currentEstablishment?.id) throw new Error('Nenhum estabelecimento selecionado');

    try {
      setLoading(true);
      setError(null);
      const newMember = await membersApi.addMember(currentEstablishment.id, data);
      addMember(newMember);
      return newMember;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao adicionar funcionário';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentEstablishment?.id, addMember, setLoading, setError]);

  const deleteMember = useCallback(async (userId: string) => {
    if (!currentEstablishment?.id) throw new Error('Nenhum estabelecimento selecionado');

    try {
      setLoading(true);
      setError(null);
      await membersApi.removeMember(currentEstablishment.id, userId);
      removeMember(userId);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao remover funcionário';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentEstablishment?.id, removeMember, setLoading, setError]);

  const changeMemberRole = useCallback(async (userId: string, data: UpdateMemberRoleRequest) => {
    if (!currentEstablishment?.id) throw new Error('Nenhum estabelecimento selecionado');

    try {
      setLoading(true);
      setError(null);
      const updatedMember = await membersApi.updateMemberRole(currentEstablishment.id, userId, data);
      updateMember(userId, updatedMember);
      return updatedMember;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao atualizar cargo';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentEstablishment?.id, updateMember, setLoading, setError]);

  return {
    members,
    loading,
    error,
    loadMembers,
    createEmployee,
    createMember,
    deleteMember,
    changeMemberRole,
  };
}
