'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { isKitchenEstablishment } from '@/lib/constants/establishment-types';

export default function KitchenPage() {
  const router = useRouter();
  const { currentEstablishment } = useEstablishmentStore();

  useEffect(() => {
    if (isKitchenEstablishment(currentEstablishment?.type)) {
      // Redireciona para o KDS (Kitchen Display System)
      router.push('/kitchen/display');
    } else {
      // Redireciona para o dashboard se não for tipo permitido
      router.push('/dashboard');
    }
  }, [router, currentEstablishment]);

  return null;
}
