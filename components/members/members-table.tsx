'use client';

import { useState } from 'react';
import { useMembers } from '@/lib/hooks/use-members';
import { ROLE_LABELS, ROLE_PERMISSIONS, type Member, type MemberRole } from '@/lib/types/member';
import { showToast } from '@/components/ui/toast';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export function MembersTable() {
  const { members, loading, deleteMember, changeMemberRole } = useMembers();
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const handleRoleChange = async (member: Member, newRole: MemberRole) => {
    if (member.role === newRole) return;

    try {
      await changeMemberRole(member.userId, { role: newRole });
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

  if (loading && members.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Carregando funcionários...
      </div>
    );
  }

  if (members.length === 0) {
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
            {members.map((member) => {
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
                    {member.role === 'business_owner' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {ROLE_LABELS[member.role]}
                      </span>
                    ) : (
                      <select
                        value={member.role}
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Ver Permissões
                      </button>
                      {member.role !== 'business_owner' && (
                        <button
                          onClick={() => setMemberToDelete(member)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
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
          variant="danger"
        />
      )}

      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Permissões - {ROLE_LABELS[selectedMember.role] || selectedMember.role}
            </h3>
            <ul className="space-y-2 mb-6">
              {(ROLE_PERMISSIONS[selectedMember.role] || []).map((permission, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{permission}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedMember(null)}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
