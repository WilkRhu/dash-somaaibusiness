'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { authApi } from '@/lib/api/auth';
import Image from 'next/image';
import apiClient from '@/lib/api/client';

interface UpdateUserDto {
  name: string;
  phone: string;
  birthDate?: string;
  netIncome?: number | null;
  profession?: string;
  avatar?: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, loadUser, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editForm, setEditForm] = useState<UpdateUserDto>({
    name: '',
    phone: '',
    birthDate: '',
    netIncome: null,
    profession: '',
    avatar: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        phone: (user as any).phone || '',
        birthDate: (user as any).birthDate || '',
        netIncome: (user as any).netIncome ?? null,
        profession: (user as any).profession || '',
        avatar: user.avatar || '',
      });
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Por favor, selecione uma imagem válida.' });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'A imagem deve ter no máximo 5MB.' });
        return;
      }

      const base64 = await fileToBase64(file);
      setAvatarBase64(base64);
      setAvatarPreview(base64);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const data: UpdateUserDto = {
        name: editForm.name,
        phone: editForm.phone,
        birthDate: editForm.birthDate || undefined,
        netIncome: editForm.netIncome || null,
        profession: editForm.profession || undefined,
      };

      if (avatarBase64) {
        data.avatar = avatarBase64;
      }

      const response = await apiClient.patch(`/users/${user?.id}`, data);
      
      // Atualizar o store com os novos dados
      if (response.data.data) {
        setUser(response.data.data, localStorage.getItem('token') || '');
      }

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setIsEditing(false);
      setAvatarBase64(null);
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erro ao atualizar perfil' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Você precisa estar logado para ver esta página.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Perfil do Usuário</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div 
            className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center text-white text-2xl font-bold overflow-hidden cursor-pointer"
            onClick={() => isEditing && fileInputRef.current?.click()}
            title={isEditing ? 'Clique para alterar a foto' : ''}
          >
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Avatar"
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              user.name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <span className={`inline-block mt-2 px-2 py-1 rounded-full text-sm font-medium ${
              user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
              user.role === 'admin' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Administrador' : user.role}
            </span>
          </div>
        </div>

        {isEditing && (
          <>
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Dica:</strong> Clique na foto acima para alterar seu avatar.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length > 11) value = value.slice(0, 11);
                  if (value.length > 10) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
                  } else if (value.length > 6) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
                  } else if (value.length > 2) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                  }
                  setEditForm({ ...editForm, phone: value });
                }}
                placeholder="(00) 0000-0000"
                maxLength={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
              <input
                type="date"
                value={editForm.birthDate}
                onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setAvatarPreview(user.avatar || null);
                  setAvatarBase64(null);
                  setEditForm({
                    name: user.name || '',
                    phone: (user as any).phone || '',
                    birthDate: (user as any).birthDate || '',
                    netIncome: (user as any).netIncome ?? null,
                    profession: (user as any).profession || '',
                    avatar: user.avatar || '',
                  });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Nome</label>
              <p className="text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Telefone</label>
              <p className="text-gray-900">{(user as any).phone || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Data de Nascimento</label>
              <p className="text-gray-900">{(user as any).birthDate ? new Date((user as any).birthDate).toLocaleDateString('pt-BR') : '-'}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Editar Perfil
            </button>
          </div>
        )}
      </div>

      {/* Subscription Info */}
      {user.role !== 'super_admin' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assinatura</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Plano Atual</p>
              <p className="text-xl font-bold text-gray-900">
                {(user as any).subscriptionPlan === 'FREE' ? 'Gratuito' :
                 (user as any).subscriptionPlan === 'BASIC' ? 'Básico' :
                 (user as any).subscriptionPlan === 'PREMIUM' ? 'Premium' :
                 (user as any).subscriptionPlan === 'ENTERPRISE' ? 'Empresarial' : 'Gratuito'}
              </p>
            </div>
            <a
              href="/subscription"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Gerenciar Assinatura
            </a>
          </div>
        </div>
      )}
    </div>
  );
}