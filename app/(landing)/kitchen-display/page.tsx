'use client';

import { Suspense } from 'react';
import KitchenDisplayContent from './kitchen-display-content';

export default function KitchenDisplayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><p className="text-white">Carregando...</p></div>}>
      <KitchenDisplayContent />
    </Suspense>
  );
}
