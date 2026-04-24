import apiClient from './client';
import type { Member, AddMemberRequest, CreateEmployeeRequest, UpdateMemberRoleRequest } from '@/lib/types/member';

// Re-export types for convenience
export type { Member, AddMemberRequest, CreateEmployeeRequest, UpdateMemberRoleRequest };

export const membersApi = {
  async getMembers(establishmentId: string): Promise<Member[]> {
    const response = await apiClient.get<{ data: Member[] }>(
      `/business/establishments/${establishmentId}/members`
    );
    // Garantir que cada membro tenha dados do usuário
    return response.data.data.map(member => ({
      ...member,
      user: member.user || { id: member.userId, name: 'N/A', email: 'N/A' }
    }));
  },

  async createEmployee(establishmentId: string, data: CreateEmployeeRequest): Promise<Member> {
    const response = await apiClient.post<{ data: { user: any; member: Member } }>(
      `/business/establishments/${establishmentId}/employees`,
      data
    );
    const memberData = response.data.data.member;
    const userData = response.data.data.user;
    
    // Garantir que o membro retornado tenha dados do usuário
    return {
      ...memberData,
      user: userData || { id: memberData.userId, name: data.name, email: data.email }
    };
  },

  async addMember(establishmentId: string, data: AddMemberRequest): Promise<Member> {
    const response = await apiClient.post<{ data: Member }>(
      `/business/establishments/${establishmentId}/members`,
      data
    );
    return response.data.data;
  },

  async removeMember(establishmentId: string, userId: string): Promise<void> {
    await apiClient.delete(
      `/business/establishments/${establishmentId}/members/${userId}`
    );
  },

  async updateMemberRole(
    establishmentId: string,
    userId: string,
    data: UpdateMemberRoleRequest
  ): Promise<Member> {
    const response = await apiClient.patch<{ data: Member }>(
      `/business/establishments/${establishmentId}/members/${userId}/role`,
      data
    );
    return response.data.data;
  },

  async updateMember(
    establishmentId: string,
    userId: string,
    data: { name: string; email: string; phone?: string; roles: string[]; isActive: boolean }
  ): Promise<Member> {
    const response = await apiClient.patch<{ data: Member }>(
      `/business/establishments/${establishmentId}/members/${userId}`,
      data
    );
    return response.data.data;
  },
};
