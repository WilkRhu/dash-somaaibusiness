'use client';

import { useState, useEffect } from 'react';
import { profileApi, UserProfile } from '@/lib/api/profile';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { maskPhoneInternational } from '@/lib/utils/format';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { addToast } = useUIStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Se o usuário está logado, usar os dados do auth store
      if (user) {
        const profileData: UserProfile = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          avatar: user.avatar,
          createdAt: new Date().toISOString(),
          subscriptionPlan: (user.subscriptionPlan || 'FREE') as any,
        };
        setProfile(profileData);
        setFormData({
          name: profileData.name,
          phone: profileData.phone || '',
        });
      } else {
        // Se não tem user no store, tentar carregar da API
        const data = await profileApi.get();
        setProfile(data);
        setFormData({
          name: data.name,
          phone: data.phone || '',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      addToast({
        type: 'error',
        message: 'Erro ao carregar perfil',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      addToast({
        type: 'error',
        message: 'Tipo de arquivo inválido. Apenas JPEG, PNG e WebP são permitidos',
      });
      return;
    }

    // Validar tamanho (2MB)
    if (file.size > 2 * 1024 * 1024) {
      addToast({
        type: 'error',
        message: 'Arquivo muito grande. Tamanho máximo: 2MB',
      });
      return;
    }

    setUploadingAvatar(true);
    try {
      const result = await profileApi.uploadAvatar(file);
      setProfile((prev) => prev ? { ...prev, avatar: result.avatar } : null);
      addToast({
        type: 'success',
        message: 'Avatar atualizado com sucesso!',
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Erro ao fazer upload do avatar',
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updated = await profileApi.update({
        name: formData.name,
        phone: formData.phone || undefined,
      });
      
      setProfile(updated);
      
      // Atualizar user no store de autenticação
      if (user) {
        setUser({ ...user, name: updated.name }, localStorage.getItem('token') || '');
      }

      addToast({
        type: 'success',
        message: 'Perfil atualizado com sucesso!',
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Erro ao atualizar perfil',
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast({
        type: 'error',
        message: 'As senhas não coincidem',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      addToast({
        type: 'error',
        message: 'A nova senha deve ter no mínimo 6 caracteres',
      });
      return;
    }

    setChangingPassword(true);
    try {
      await profileApi.changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);

      addToast({
        type: 'success',
        message: 'Senha alterada com sucesso!',
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Erro ao alterar senha',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'ENTERPRISE':
        return 'bg-purple-100 text-purple-800';
      case 'PREMIUM':
        return 'bg-blue-100 text-blue-800';
      case 'BASIC':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Meu Perfil</h1>
        <p className="text-gray-600 mt-2">Gerencie suas informações pessoais</p>
      </div>

      {/* Avatar e Informações Básicas */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center border-4 border-gray-200">
                <span className="text-4xl font-bold text-white">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            <label className="absolute bottom-0 right-0 bg-brand-blue text-white p-2 rounded-full cursor-pointer hover:bg-opacity-90 transition-opacity shadow-lg">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
                className="hidden"
              />
              {uploadingAvatar ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </label>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-brand-navy mb-2">{profile.name}</h2>
            <p className="text-gray-600 mb-3">{profile.email}</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPlanBadgeColor(profile.subscriptionPlan)}`}>
              Plano {profile.subscriptionPlan}
            </span>
          </div>
        </div>
      </div>

      {/* Formulário de Edição */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-brand-navy mb-6">Informações Pessoais</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: maskPhoneInternational(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                placeholder="+55 11 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membro desde
              </label>
              <input
                type="text"
                value={new Date(profile.createdAt).toLocaleDateString('pt-BR')}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>

      {/* Alterar Senha */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-brand-navy">Segurança</h3>
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="px-4 py-2 border border-brand-blue text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-colors font-semibold"
            >
              Alterar Senha
            </button>
          )}
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha Atual *
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha *
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nova Senha *
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  });
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={changingPassword}
                className="px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {changingPassword ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
