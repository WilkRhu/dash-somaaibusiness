'use client';

import { useState } from 'react';
import { useMembers } from '@/lib/hooks/use-members';
import { useAuthStore } from '@/lib/stores/auth-store';
import { ROLE_LABELS, ROLE_PERMISSIONS, type Member, type MemberRole } from '@/lib/types/member';
import { showToast } from '@/components/ui/toast';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { EditMemberForm } from './edit-member-form';

export function MembersTable() {
  const { members, loading, deleteMember, changeMemberRole, editMember } = useMembers();
  const { user } = useAuthStore();
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const visibleMembers = members.filter(m => m.userId !== user?.id);

  const handleRoleChange = async (member: Member, newRole: MemberRole) => {
    // Verifica se o role já existe
    if (member.roles.includes(newRole)) return;

    try {
      // Substitui todos os roles pelo novo selecionado
      await changeMemberRole(member.userId, { roles: [newRole] });
      showToast('Cargo atualizado com sucesso!', 'success');
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;

    try {
      await deleteMember(memberToDelete.userId);
      showToast('Funcionário removido com sucesso!', 'success');
      setMemberToDelete(null);
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleEditSave = async (data: { name: string; email: string; phone?: string; roles: MemberRole[]; isActive: boolean }) => {
    if (!editingMember) return;

    try {
      await editMember(editingMember.userId, data);
      showToast('Funcionário atualizado com sucesso!', 'success');
      setEditingMember(null);
    } catch (error) {
      // Error already handled in hook
    }
  };

  if (loading && members.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Carregando funcionários...
      </div>
    );
  }

  if (members.length === 0 || visibleMembers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum funcionário cadastrado
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cargo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visibleMembers.map((member) => {
              // Verificação de segurança
              if (!member.user) {
                console.error('Member without user data:', member);
                return null;
              }

              return (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {member.user.name || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {member.user.email || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {member.roles.includes('business_owner') ? (
                      <div className="flex flex-wrap gap-1">
                        {member.roles.map((role) => (
                          <span
                            key={role}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {ROLE_LABELS[role]}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <select
                        value={member.roles[0] || 'business_sales'}
                        onChange={(e) => handleRoleChange(member, e.target.value as MemberRole)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                      >
                        <option value="business_admin">{ROLE_LABELS.business_admin}</option>
                        <option value="business_sales">{ROLE_LABELS.business_sales}</option>
                        <option value="business_stock">{ROLE_LABELS.business_stock}</option>
                        <option value="business_marketing">{ROLE_LABELS.business_marketing}</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {member.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditingMember(member)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        title="Editar funcionário"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                      </button>
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                        title="Ver permissões"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Permissões
                      </button>
                      {member.roles.includes('business_owner') ? null : (
                        <button
                          onClick={() => setMemberToDelete(member)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 flex items-center gap-1"
                          title="Remover funcionário"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remover
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {memberToDelete && memberToDelete.user && (
        <ConfirmModal
          title="Remover Funcionário"
          message={`Tem certeza que deseja remover ${memberToDelete.user.name}? Esta ação não pode ser desfeita.`}
          confirmText="Remover"
          cancelText="Cancelar"
          onConfirm={handleDelete}
          onCancel={() => setMemberToDelete(null)}
          confirmVariant="danger"
        />
      )}

      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Permissões - {selectedMember.roles.map(r => ROLE_LABELS[r]).join(', ')}
            </h3>
            <div className="space-y-4 mb-6">
              {selectedMember.roles.map((role) => (
                <div key={role}>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {ROLE_LABELS[role]}
                  </h4>
                  <ul className="space-y-2">
                    {(ROLE_PERMISSIONS[role] || []).map((permission, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{permission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelectedMember(null)}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {editingMember && (
        <EditMemberForm
          member={editingMember}
          onSave={handleEditSave}
          onCancel={() => setEditingMember(null)}
        />
      )}
    </>
  );
}
