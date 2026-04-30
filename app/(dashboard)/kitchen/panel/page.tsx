'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { isKitchenEstablishment } from '@/lib/constants/establishment-types';

export default function KitchenPanelPage() {
  const router = useRouter();
  const { currentEstablishment } = useEstablishmentStore();

  // Validar se o estabelecimento é do tipo que possui cozinha
  const isKitchenTypeEstablishment = isKitchenEstablishment(currentEstablishment?.type);

  useEffect(() => {
    if (!isKitchenTypeEstablishment) {
      router.push('/home');
    }
  }, [isKitchenTypeEstablishment, router]);

  return (
    <div className="p-4">
      <h1>Kitchen Panel</h1>
    </div>
  );
}
