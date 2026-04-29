'use client';

import { useState } from 'react';
import { type Member, type MemberRole, ROLE_LABELS } from '@/lib/types/member';
import { maskPhone, unmask } from '@/lib/utils/format';

interface EditMemberFormProps {
  member: Member;
  onSave: (data: { name: string; email: string; phone?: string; roles: MemberRole[]; isActive: boolean }) => Promise<void>;
  onCancel: () => void;
}

export function EditMemberForm({ member, onSave, onCancel }: EditMemberFormProps) {
  const [name, setName] = useState(member.user.name);
  const [email, setEmail] = useState(member.user.email);
  const [phone, setPhone] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<MemberRole[]>(member.roles);
  const [isActive, setIsActive] = useState(member.isActive);
  const [loading, setLoading] = useState(false);

  const isOwner = member.roles.includes('business_owner');

  const availableRoles: MemberRole[] = [
    'business_admin',
    'business_sales',
    'business_stock',
    'business_marketing',
    'kitchen_chef',
    'kitchen_cook',
    'kitchen_assistant',
    'waiter',
    'cashier',
    'delivery_driver',
    'host',
  ];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value);
    setPhone(masked);
  };

  const toggleRole = (role: MemberRole) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert('Nome e email são obrigatórios');
      return;
    }

    if (selectedRoles.length === 0) {
      alert('Selecione pelo menos um cargo');
      return;
    }

    try {
      setLoading(true);
      await onSave({
        name: name.trim(),
        email: email.trim(),
        phone: phone ? unmask(phone) : undefined,
        roles: selectedRoles,
        isActive,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">Editar Funcionário</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(11) 99999-9999"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {!isOwner && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargos *
                </label>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">Administrativo</p>
                    <div className="space-y-2 ml-2">
                      {['business_admin', 'business_sales', 'business_stock', 'business_marketing'].map((role) => (
                        <label key={role} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedRoles.includes(role as MemberRole)}
                            onChange={() => toggleRole(role as MemberRole)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            disabled={loading}
                          />
                          <span className="text-sm text-gray-700">{ROLE_LABELS[role as MemberRole]}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">Cozinha</p>
                    <div className="space-y-2 ml-2">
                      {['kitchen_chef', 'kitchen_cook', 'kitchen_assistant'].map((role) => (
                        <label key={role} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedRoles.includes(role as MemberRole)}
                            onChange={() => toggleRole(role as MemberRole)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            disabled={loading}
                          />
                          <span className="text-sm text-gray-700">{ROLE_LABELS[role as MemberRole]}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">Atendimento</p>
                    <div className="space-y-2 ml-2">
                      {['waiter', 'cashier', 'host'].map((role) => (
                        <label key={role} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedRoles.includes(role as MemberRole)}
                            onChange={() => toggleRole(role as MemberRole)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            disabled={loading}
                          />
                          <span className="text-sm text-gray-700">{ROLE_LABELS[role as MemberRole]}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">Delivery</p>
                    <div className="space-y-2 ml-2">
                      {['delivery_driver'].map((role) => (
                        <label key={role} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedRoles.includes(role as MemberRole)}
                            onChange={() => toggleRole(role as MemberRole)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            disabled={loading}
                          />
                          <span className="text-sm text-gray-700">{ROLE_LABELS[role as MemberRole]}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="text-sm font-medium text-gray-700">Funcionário ativo</span>
                </label>
              </div>
            </>
          )}

          {isOwner && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-800">
                Proprietários não podem ter seus cargos alterados.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
