'use client';

import { use, useState, useEffect } from 'react';
import { membersApi, Member } from '@/lib/api/members';

export default function MembersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: establishmentId } = use(params);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMembers();
  }, [establishmentId]);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const data = await membersApi.getMembers(establishmentId);
      setMembers(data);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao carregar membros:', err);
      setError(err.message || 'Erro ao carregar membros');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      business_owner: 'Proprietário',
      business_admin: 'Administrador',
      business_manager: 'Gerente',
      business_employee: 'Funcionário',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      business_owner: 'bg-purple-100 text-purple-800',
      business_admin: 'bg-red-100 text-red-800',
      business_manager: 'bg-blue-100 text-blue-800',
      business_employee: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'Ativo' : 'Inativo';
  };

  const roles = [...new Set(members.map(m => m.roles?.[0] || 'business_employee'))];

  const filteredMembers = members.filter(member => {
    const memberRole = member.roles?.[0] || 'business_employee';
    if (roleFilter && memberRole !== roleFilter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      const name = member.user?.name || '';
      const email = member.user?.email || '';
      if (!name.toLowerCase().includes(searchLower) && !email.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    return true;
  });

  const activeMembers = members.filter(m => m.isActive).length;
  const ownerCount = members.filter(m => m.roles?.[0] === 'business_owner').length;
  const adminCount = members.filter(m => m.roles?.[0] === 'business_admin').length;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <a
          href="/admin/business/establishments"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para Estabelecimentos
        </a>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Membros</h1>
        <span className="text-sm text-gray-500">{filteredMembers.length} membros</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{members.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600">Ativos</p>
          <p className="text-2xl font-bold text-green-900">{activeMembers}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600">Proprietários</p>
          <p className="text-2xl font-bold text-purple-900">{ownerCount}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600">Administradores</p>
          <p className="text-2xl font-bold text-red-900">{adminCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os cargos</option>
          <option value="business_owner">Proprietário</option>
          <option value="business_admin">Administrador</option>
          <option value="business_manager">Gerente</option>
          <option value="business_employee">Funcionário</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum membro encontrado</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Cargo</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {member.user?.name || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {member.user?.email || 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getRoleColor(member.roles?.[0] || 'business_employee')}`}>
                      {getRoleLabel(member.roles?.[0] || 'business_employee')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(member.isActive)}`}>
                      {getStatusLabel(member.isActive)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {member.createdAt ? formatDate(member.createdAt) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}