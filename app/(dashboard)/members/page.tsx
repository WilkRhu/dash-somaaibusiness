'use client';

import { useEffect, useState } from 'react';
import { useMembers } from '@/lib/hooks/use-members';
import { MembersTable } from '@/components/members/members-table';
import { AddMemberForm } from '@/components/members/add-member-form';

export default function MembersPage() {
  const { loadMembers, members, loading, error } = useMembers();
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Funcionários</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Adicionar Funcionário
          </button>
        </div>
        <p className="text-gray-600">
          Gerencie os funcionários e suas permissões no estabelecimento
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Criar Novo Funcionário</h2>
          <AddMemberForm
            onSuccess={() => {
              setShowAddForm(false);
              loadMembers();
            }}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Lista de Funcionários ({members.length})
            </h2>
            {loading && (
              <span className="text-sm text-gray-500">Atualizando...</span>
            )}
          </div>
        </div>
        <MembersTable />
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Informações Importantes</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Crie funcionários diretamente informando nome, email e cargo</li>
          <li>• Se o email já existir no sistema, apenas adiciona como membro</li>
          <li>• Se não informar senha, será gerada uma senha temporária de 8 caracteres</li>
          <li>• O proprietário do estabelecimento não pode ser removido ou ter seu cargo alterado</li>
          <li>• Cada cargo possui permissões específicas no sistema</li>
          <li>• Vendedores são automaticamente associados às vendas que registram</li>
        </ul>
      </div>
    </div>
  );
}
