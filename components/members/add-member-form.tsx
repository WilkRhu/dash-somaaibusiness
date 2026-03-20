'use client';

import { useState, useRef } from 'react';
import { useMembers } from '@/lib/hooks/use-members';
import { ROLE_LABELS, type MemberRole } from '@/lib/types/member';
import { showToast } from '@/components/ui/toast';
import { maskPhone, unmask } from '@/lib/utils/format';

interface AddMemberFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AddMemberForm({ onSuccess, onCancel }: AddMemberFormProps) {
  const { createEmployee, loading } = useMembers();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<MemberRole>('business_sales');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Imagem muito grande (máx. 5MB)', 'error');
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      showToast('Por favor, preencha nome e email', 'error');
      return;
    }

    try {
      await createEmployee({
        name: name.trim(),
        email: email.trim(),
        phone: unmask(phone) || undefined,
        password: password.trim() || undefined,
        roles: [role],
        avatar: avatarFile || undefined,
      });
      showToast('Funcionário criado com sucesso!', 'success');
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setRole('business_sales');
      setAvatarFile(null);
      setAvatarPreview(null);
      onSuccess?.();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Erro ao criar funcionário', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500 overflow-hidden bg-gray-50"
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          {avatarPreview && (
            <button
              type="button"
              onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 text-xs"
            >
              ×
            </button>
          )}
        </div>
        <span className="text-xs text-gray-500 cursor-pointer hover:text-blue-500" onClick={() => fileInputRef.current?.click()}>
          {avatarPreview ? 'Trocar foto' : 'Adicionar foto'}
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleAvatarChange}
          className="hidden"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome Completo *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="João Silva"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
          required
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
          placeholder="joao@example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Se o email já existir, apenas adiciona como membro
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telefone
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(maskPhone(e.target.value))}
          placeholder="(11) 99999-9999"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
          maxLength={15}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Senha
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Deixe vazio para gerar senha automática"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Se não informar, será gerada uma senha temporária de 8 caracteres
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cargo *
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as MemberRole)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        >
          <option value="business_admin">{ROLE_LABELS.business_admin}</option>
          <option value="business_sales">{ROLE_LABELS.business_sales}</option>
          <option value="business_stock">{ROLE_LABELS.business_stock}</option>
          <option value="business_marketing">{ROLE_LABELS.business_marketing}</option>
        </select>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Criando...' : 'Criar Funcionário'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
