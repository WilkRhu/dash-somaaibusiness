'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { SubscriptionPlan } from '@/lib/types/subscription';

const TRIAL_MODAL_STORAGE_KEY = 'trial_modal_dismissed';

export function useTrialModal() {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [daysRemaining] = useState(10); // Trial sempre tem 10 dias

  useEffect(() => {
    console.log('🔍 useTrialModal - Verificando condições:', {
      user,
      subscriptionPlan: user?.subscriptionPlan,
      expectedPlan: SubscriptionPlan.FREE,
      isMatch: user?.subscriptionPlan === SubscriptionPlan.FREE
    });

    // Só mostrar para usuários FREE
    if (!user || user.subscriptionPlan !== SubscriptionPlan.FREE) {
      console.log('❌ Modal não será exibido - usuário não é FREE');
      return;
    }

    // Verificar se o usuário já dispensou o modal
    const dismissed = localStorage.getItem(TRIAL_MODAL_STORAGE_KEY);
    console.log('📦 localStorage dismissed:', dismissed);
    
    if (dismissed === 'true') {
      console.log('❌ Modal não será exibido - já foi dispensado');
      return;
    }

    console.log('✅ Modal será exibido em 2 segundos');
    
    // Mostrar modal após 2 segundos
    const timeout = setTimeout(() => {
      console.log('🎉 Exibindo modal de trial');
      setShowModal(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [user]);

  const closeModal = () => {
    setShowModal(false);
    // Marcar como dispensado para não mostrar novamente
    localStorage.setItem(TRIAL_MODAL_STORAGE_KEY, 'true');
  };

  return {
    showModal,
    closeModal,
    daysRemaining,
    isOnTrial: user?.subscriptionPlan === SubscriptionPlan.TRIAL,
  };
}
