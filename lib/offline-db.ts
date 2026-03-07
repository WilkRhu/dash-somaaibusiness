const DB_NAME = 'somaai-offline';
const DB_VERSION = 1;

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  stock?: number;
}

export interface PendingSale {
  id: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  customerId?: string;
  paymentMethod: string;
  total: number;
  establishmentId: string;
  createdAt: string;
  synced: boolean;
}

class OfflineDB {
  private db: IDBDatabase | null = null;

  async init() {
    if (this.db) return;

    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('products')) {
          db.createObjectStore('products', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('pendingSales')) {
          const store = db.createObjectStore('pendingSales', { keyPath: 'id' });
          store.createIndex('synced', 'synced', { unique: false });
        }
      };
    });
  }

  async saveProducts(products: Product[]) {
    await this.init();
    if (!this.db) throw new Error('DB not initialized');

    const transaction = this.db.transaction('products', 'readwrite');
    const store = transaction.objectStore('products');

    for (const product of products) {
      store.put(product);
    }
  }

  async getProducts(): Promise<Product[]> {
    await this.init();
    if (!this.db) throw new Error('DB not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('products', 'readonly');
      const store = transaction.objectStore('products');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async addPendingSale(sale: PendingSale) {
    await this.init();
    if (!this.db) throw new Error('DB not initialized');

    const transaction = this.db.transaction('pendingSales', 'readwrite');
    const store = transaction.objectStore('pendingSales');
    store.put(sale);
  }

  async getPendingSales(): Promise<PendingSale[]> {
    await this.init();
    if (!this.db) throw new Error('DB not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('pendingSales', 'readonly');
      const store = transaction.objectStore('pendingSales');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async markSaleSynced(id: string) {
    await this.init();
    if (!this.db) throw new Error('DB not initialized');

    const transaction = this.db.transaction('pendingSales', 'readwrite');
    const store = transaction.objectStore('pendingSales');
    const request = store.get(id);

    request.onsuccess = () => {
      const sale = request.result;
      if (sale) {
        sale.synced = true;
        store.put(sale);
      }
    };
  }

  async removePendingSale(id: string) {
    await this.init();
    if (!this.db) throw new Error('DB not initialized');

    const transaction = this.db.transaction('pendingSales', 'readwrite');
    const store = transaction.objectStore('pendingSales');
    store.delete(id);
  }

  async clearSyncedSales() {
    await this.init();
    if (!this.db) throw new Error('DB not initialized');

    const sales = await this.getPendingSales();
    for (const sale of sales) {
      if (sale.synced) {
        await this.removePendingSale(sale.id);
      }
    }
  }
}

export const offlineDB = new OfflineDB();