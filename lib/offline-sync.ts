import { offlineDB, PendingSale } from './offline-db';
import { getApiUrl } from './api-config';

const API_URL = getApiUrl();

function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

// Sync automático quando volta online
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    console.log('Back online, syncing...');
    
    // Sync vendas pendentes
    const salesResult = await syncPendingSales();
    if (salesResult.success > 0) {
      console.log(`Synced ${salesResult.success} sales`);
    }
    
    // Sync produtos
    await syncProducts();
  });
}

export async function syncPendingSales(): Promise<{ success: number; failed: number }> {
  const pendingSales = await offlineDB.getPendingSales();
  const unsyncedSales = pendingSales.filter(sale => !sale.synced);

  let success = 0;
  let failed = 0;

  for (const sale of unsyncedSales) {
    try {
      const token = getAuthToken();
      
      // Buscar nomes dos produtos do cache
      const products = await offlineDB.getProducts();
      const productMap = new Map(products.map(p => [p.id, p]));

      const itemsWithNames = sale.items.map(item => {
        const product = productMap.get(item.productId);
        return {
          inventoryItemId: item.productId,
          productName: product?.name || 'Produto',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        };
      });

      const response = await fetch(`${API_URL}/business/establishments/${sale.establishmentId}/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          items: itemsWithNames,
          customerId: sale.customerId,
          paymentMethod: sale.paymentMethod,
        }),
      });

      if (response.ok) {
        await offlineDB.markSaleSynced(sale.id);
        success++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  await offlineDB.clearSyncedSales();
  return { success, failed };
}

export async function syncProducts(establishmentId?: string) {
  if (!establishmentId) return;
  
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/business/establishments/${establishmentId}/inventory`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      const products = data.data || data;
      await offlineDB.saveProducts(products);
      console.log(`Synced ${products.length} products`);
    }
  } catch {
    console.log('Failed to sync products, using cached data');
  }
}

export function setupOnlineSync() {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', async () => {
    console.log('Back online, syncing pending sales...');
    const result = await syncPendingSales();
    console.log(`Sync complete: ${result.success} success, ${result.failed} failed`);
  });
}