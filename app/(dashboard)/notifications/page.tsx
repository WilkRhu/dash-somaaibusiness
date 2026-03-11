'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notificationsApi, Notification } from '@/lib/api/notifications';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationsApi.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      // Fallback para mock data se a API falhar
      const mockNotifications: Notification[] = [
        {
          id: '1',
          userId: 'user-1',
          title: '⏰ Seu plano expira em 7 dias',
          message: 'Olá! Renove sua assinatura para continuar usando todos os recursos.',
          type: 'plan_expiring',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          data: {
            planId: 'plan-uuid',
            expiresAt: '2026-03-20',
            daysRemaining: 7
          },
        },
        {
          id: '2',
          userId: 'user-1',
          title: '❌ Seu plano expirou',
          message: 'Sua assinatura foi cancelada. Reative para continuar.',
          type: 'plan_expired',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          data: {
            planId: 'plan-uuid',
            expiredAt: '2026-03-13'
          },
        },
        {
          id: '3',
          userId: 'user-1',
          title: '✅ Plano renovado com sucesso!',
          message: 'Obrigado por renovar. Seu plano está ativo.',
          type: 'plan_renewed',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          data: {
            planId: 'plan-uuid',
            renewedAt: '2026-03-13',
            expiresAt: '2027-03-13'
          },
        },
        {
          id: '4',
          userId: 'user-1',
          title: '💳 Falha no pagamento',
          message: 'Não conseguimos processar seu pagamento. Atualize os dados.',
          type: 'payment_failed',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          data: {
            subscriptionId: 'sub-uuid',
            reason: 'card_declined',
            retryDate: '2026-03-15'
          },
        },
        {
          id: '5',
          userId: 'user-1',
          title: '💡 Descubra o poder do Premium!',
          message: 'Desbloqueie recursos exclusivos com upgrade para Premium.',
          type: 'upgrade_offer',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          data: {
            currentPlan: 'free',
            targetPlan: 'premium',
            discount: 20
          },
        },
        {
          id: '6',
          userId: 'user-1',
          title: '🎉 Promoção especial!',
          message: 'Aproveite 50% de desconto em planos anuais.',
          type: 'campaign',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
          data: {
            campaignId: 'campaign-uuid',
            discount: 50,
            validUntil: '2026-03-31'
          },
        },
      ];
      setNotifications(mockNotifications);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
    // Chamar API em background
    notificationsApi.markAsRead(id).catch(error => 
      console.error('Erro ao marcar como lida:', error)
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    // Chamar API em background
    notificationsApi.markAllAsRead().catch(error => 
      console.error('Erro ao marcar todas como lidas:', error)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    // Chamar API em background
    notificationsApi.deleteNotification(id).catch(error => 
      console.error('Erro ao deletar notificação:', error)
    );
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'plan_expiring':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'plan_expired':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'plan_renewed':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'payment_failed':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        );
      case 'upgrade_offer':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM2 8a2 2 0 11-4 0 2 2 0 014 0zM18 15v2h-2v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2H3v-2a6 6 0 0112 0z" />
          </svg>
        );
      case 'campaign':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zM8 8a1 1 0 000 2h6a1 1 0 100-2H8zm0 3a1 1 0 000 2h3a1 1 0 100-2H8z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getActionUrl = (notification: Notification) => {
    switch (notification.type) {
      case 'plan_expiring':
      case 'plan_expired':
      case 'plan_renewed':
      case 'upgrade_offer':
        return '/subscription';
      case 'payment_failed':
        return '/subscription';
      case 'campaign':
        return notification.data?.link || '/';
      default:
        return '/';
    }
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return notifDate.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Notificações</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} notificação${unreadCount !== 1 ? 's' : ''} não lida${unreadCount !== 1 ? 's' : ''}` : 'Todas as notificações lidas'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 text-sm font-medium text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-brand-blue text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'unread'
              ? 'bg-brand-blue text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Não lidas ({unreadCount})
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="text-gray-500 text-lg">
            {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow p-4 transition-all hover:shadow-md ${
                !notification.read ? 'border-l-4 border-brand-blue bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0 w-2 h-2 bg-brand-blue rounded-full mt-2"></div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      {formatTime(notification.createdAt)}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        href={getActionUrl(notification)}
                        className="text-xs font-medium text-brand-blue hover:underline"
                      >
                        Ver detalhes
                      </Link>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs font-medium text-gray-500 hover:text-gray-700"
                        >
                          Marcar como lida
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs font-medium text-red-500 hover:text-red-700"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
