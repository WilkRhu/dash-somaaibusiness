'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/auth-store';
import { adminApi } from '@/lib/api/admin';
import Image from 'next/image';
import apiClient from '@/lib/api/client';
import { SubscriptionPlan } from '@/lib/types/subscription';

interface UpdateUserDto {
  name: string;
  phone: string;
  birthDate?: string;
  netIncome?: number | null;
  profession?: string;
  avatar?: string;
}

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  phone?: string;
  birthDate?: string;
  netIncome?: number | null;
  profession?: string;
  subscriptionPlan?: SubscriptionPlan;
}

type DashboardStats = {
  totalUsers: number;
  totalTickets: number;
  openTickets: number;
  totalEstablishments: number;
  activeSubscriptions: number;
  revenue: number;
};

type SystemInfo = {
  version: string;
  uptime: number;
  memory: { total: number; used: number; free: number };
  cpu: number;
  disk: { total: number; used: number; free: number };
};

const quickActions = [
  { href: '/admin/users', label: 'Usuários', description: 'Gerenciar contas da plataforma' },
  { href: '/admin/tickets', label: 'Tickets', description: 'Acompanhar suporte' },
  { href: '/admin/reports', label: 'Relatórios', description: 'Visualizar indicadores' },
  { href: '/admin/system', label: 'Logs', description: 'Auditar eventos do sistema' },
  { href: '/admin/notifications', label: 'Notificações', description: 'Disparos e alertas' },
  { href: '/admin/business/establishments', label: 'Estabelecimentos', description: 'Navegar entre lojas' },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatUptime = (hours: number) => {
  if (!hours || hours < 1) return 'menos de 1h';
  if (hours < 24) return `${Math.round(hours)}h`;

  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);
  return `${days}d${remainingHours ? ` ${remainingHours}h` : ''}`;
};

export default function ProfilePage() {
  const { user, isAuthenticated, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileUser = user as ProfileUser;
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
        name: profileUser.name || '',
        phone: profileUser.phone || '',
        birthDate: profileUser.birthDate || '',
        netIncome: profileUser.netIncome ?? null,
        profession: profileUser.profession || '',
        avatar: profileUser.avatar || '',
      });
      if (profileUser.avatar) {
        setAvatarPreview(profileUser.avatar);
      }
    }
  }, [profileUser, user]);

  useEffect(() => {
    const fetchOverview = async () => {
      if (!user || user.role !== 'super_admin') return;

      setLoadingOverview(true);
      try {
        const [statsResponse, systemResponse] = await Promise.allSettled([
          adminApi.getStats(),
          adminApi.getSystemInfo(),
        ]);

        if (statsResponse.status === 'fulfilled') {
          setStats(statsResponse.value);
        }

        if (systemResponse.status === 'fulfilled') {
          setSystemInfo(systemResponse.value);
        }
      } finally {
        setLoadingOverview(false);
      }
    };

    fetchOverview();
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

      const response = await apiClient.patch<{ data?: ProfileUser }>(`/users/${profileUser.id}`, data);
      
      // Atualizar o store com os novos dados
      if (response.data.data) {
        setUser(response.data.data, localStorage.getItem('token') || '');
      }

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setIsEditing(false);
      setAvatarBase64(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error('Erro ao atualizar perfil:', err);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao atualizar perfil' });
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
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white text-2xl font-bold overflow-hidden cursor-pointer"
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
                profileUser.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl font-bold">Perfil do Super Admin</h1>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-500/20 text-purple-100 border border-purple-400/30">
                  {user.role === 'super_admin' ? 'Global' : 'Admin'}
                </span>
              </div>
              <p className="text-white/70 mt-1 max-w-2xl">
                {profileUser.role === 'super_admin'
                  ? 'Conta com acesso total à plataforma, visão operacional e atalhos para os principais módulos.'
                  : 'Perfil administrativo para gestão da plataforma.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="px-4 py-2 rounded-lg bg-white text-slate-900 font-medium hover:bg-white/90 transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={() => setIsEditing((current) => !current)}
              className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
            >
              {isEditing ? 'Fechar edição' : 'Editar perfil'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Usuários</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {loadingOverview ? '...' : stats?.totalUsers ?? '-'}
          </p>
          <p className="mt-1 text-sm text-gray-500">Contas na plataforma</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Estabelecimentos</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {loadingOverview ? '...' : stats?.totalEstablishments ?? '-'}
          </p>
          <p className="mt-1 text-sm text-gray-500">Operação ativa</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Tickets abertos</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {loadingOverview ? '...' : stats?.openTickets ?? '-'}
          </p>
          <p className="mt-1 text-sm text-gray-500">Fila de suporte</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Receita</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {loadingOverview ? '...' : stats ? formatCurrency(stats.revenue) : '-'}
          </p>
          <p className="mt-1 text-sm text-gray-500">Visão consolidada</p>
        </div>
      </div>

      {profileUser.role === 'super_admin' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Ações rápidas</h2>
                <p className="text-sm text-gray-500">
                  Atalhos para os módulos mais usados pelo super admin.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-700">
                        {action.label}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">{action.description}</p>
                    </div>
                    <span className="text-gray-400 group-hover:text-blue-600">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">Status da plataforma</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-gray-600">Conta</span>
                <span className="font-medium text-green-600">Ativa</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-gray-600">Última sincronização</span>
                <span className="font-medium text-gray-900">Agora</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-gray-600">Uptime</span>
                <span className="font-medium text-gray-900">
                  {systemInfo ? formatUptime(systemInfo.uptime) : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-gray-600">CPU</span>
                <span className="font-medium text-gray-900">
                  {systemInfo ? `${Math.round(systemInfo.cpu)}%` : '-'}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">Atenção operacional</p>
              <p className="mt-1 text-sm text-amber-800">
                Use este perfil como central de acompanhamento. Se quiser evoluir mais, o próximo passo natural é adicionar auditoria de ações e histórico de login.
              </p>
            </div>
          </div>
        </div>
      )}

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
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{profileUser.name}</h2>
            <p className="text-gray-600">{profileUser.email}</p>
            <span className={`inline-block mt-2 px-2 py-1 rounded-full text-sm font-medium ${
              profileUser.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
              profileUser.role === 'admin' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {profileUser.role === 'super_admin' ? 'Super Admin' : profileUser.role === 'admin' ? 'Administrador' : profileUser.role}
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
                  setAvatarPreview(profileUser.avatar || null);
                  setAvatarBase64(null);
                  setEditForm({
                    name: profileUser.name || '',
                    phone: profileUser.phone || '',
                    birthDate: profileUser.birthDate || '',
                    netIncome: profileUser.netIncome ?? null,
                    profession: profileUser.profession || '',
                    avatar: profileUser.avatar || '',
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
              <p className="text-gray-900">{profileUser.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-gray-900">{profileUser.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Telefone</label>
              <p className="text-gray-900">{profileUser.phone || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Data de Nascimento</label>
              <p className="text-gray-900">{profileUser.birthDate ? new Date(profileUser.birthDate).toLocaleDateString('pt-BR') : '-'}</p>
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
      {profileUser.role !== 'super_admin' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assinatura</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Plano Atual</p>
              <p className="text-xl font-bold text-gray-900">
                {profileUser.subscriptionPlan === 'FREE' ? 'Gratuito' :
                 profileUser.subscriptionPlan === 'BASIC' ? 'Básico' :
                 profileUser.subscriptionPlan === 'PREMIUM' ? 'Premium' :
                 profileUser.subscriptionPlan === 'ENTERPRISE' ? 'Empresarial' : 'Gratuito'}
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

      {profileUser.role === 'super_admin' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Controle da plataforma</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Módulo principal</p>
              <p className="mt-1 font-semibold text-gray-900">Administração global</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Plano da conta</p>
              <p className="mt-1 font-semibold text-gray-900">Acesso total</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Memória usada</p>
              <p className="mt-1 font-semibold text-gray-900">
                {systemInfo?.memory?.used != null && systemInfo?.memory?.total
                  ? `${Math.round((systemInfo.memory.used / systemInfo.memory.total) * 100)}%`
                  : '-'}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Disco usado</p>
              <p className="mt-1 font-semibold text-gray-900">
                {systemInfo?.disk?.used != null && systemInfo?.disk?.total
                  ? `${Math.round((systemInfo.disk.used / systemInfo.disk.total) * 100)}%`
                  : '-'}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/admin/users"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Ir para usuários
            </Link>
            <Link
              href="/admin/system"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Ver logs do sistema
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
