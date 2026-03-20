import apiClient from './client';
import type { Member, AddMemberRequest, CreateEmployeeRequest, UpdateMemberRoleRequest } from '@/lib/types/member';

// Re-export types for convenience
export type { Member, AddMemberRequest, CreateEmployeeRequest, UpdateMemberRoleRequest };

export const membersApi = {
  async getMembers(establishmentId: string): Promise<Member[]> {
    const response = await apiClient.get<any>(
      `/business/establishments/${establishmentId}/members`
    );
    const list: Member[] = response.data?.data ?? response.data;
    return list.map(member => ({
      ...member,
      user: member.user || { id: member.userId, name: 'N/A', email: 'N/A' }
    }));
  },

  async createEmployee(establishmentId: string, data: CreateEmployeeRequest): Promise<Member> {
    let payload: any = { ...data };

    if (data.avatar) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(data.avatar!);
      });
      payload.avatar = base64;
    }

    const response = await apiClient.post<any>(
      `/business/establishments/${establishmentId}/employees`,
      payload
    );
    const raw = response.data;
    const memberData = raw?.data?.member ?? raw;
    const userData = raw?.data?.user ?? { id: raw.userId, name: data.name, email: data.email, avatar: raw.avatar };
    
    return {
      ...memberData,
      user: userData,
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
