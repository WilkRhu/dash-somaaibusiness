import { useState, useEffect, useCallback } from 'react';
import { offlineDB, PendingSale, Product } from '@/lib/offline-db';
import { syncPendingSales, setupOnlineSync } from '@/lib/offline-sync';

export function useOfflineSales(establishmentId: string) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);
    setupOnlineSync();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const updatePendingCount = async () => {
      const sales = await offlineDB.getPendingSales();
      setPendingCount(sales.filter(s => !s.synced).length);
    };
    updatePendingCount();
  }, []);

  const saveSaleOffline = useCallback(async (
    items: PendingSale['items'],
    customerId: string | undefined,
    paymentMethod: string,
    total: number
  ) => {
    const sale: PendingSale = {
      id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      items,
      customerId,
      paymentMethod,
      total,
      establishmentId,
      createdAt: new Date().toISOString(),
      synced: false,
    };

    await offlineDB.addPendingSale(sale);
    setPendingCount(prev => prev + 1);

    return sale;
  }, [establishmentId]);

  const syncSales = useCallback(async () => {
    if (isSyncing || isOnline) return;

    setIsSyncing(true);
    try {
      const result = await syncPendingSales();
      setPendingCount(0);
      return result;
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing]);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    saveSaleOffline,
    syncSales,
  };
}

export function useOfflineProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const cached = await offlineDB.getProducts();
      setProducts(cached);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  return { products, isLoading };
}