'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KitchenPage() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para o KDS (Kitchen Display System)
    router.push('/kitchen/display');
  }, [router]);

  return null;
}
