'use client';

import { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/lib/stores/auth-store';

interface ScannedProduct {
  normalizedName: string;
  originalName: string;
  brand?: string;
  category?: string;
  unit?: string;
  averagePrice: string;
}

interface ScanResult {
  success: boolean;
  barcode: string;
  timestamp: string;
  product?: ScannedProduct;
}

function ScannerContent() {
  const searchParams = useSearchParams();
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const socketRef = useRef<Socket | null>(null);

  // Conectar ao WebSocket
  useEffect(() => {
    const { user } = useAuthStore.getState();
    const userId = user?.id || 'anonymous';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    console.log(`[WS] Conectando como dashboard, User ID: ${userId}`);
    
    const socket = io(`${apiUrl}/scanner`, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      query: {
        type: 'dashboard',
        userId,
      },
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
    });

    socket.on('scan-result', (result: ScanResult) => {
      setLastScan(result);
      setScanHistory((prev) => [result, ...prev.slice(0, 9)]);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  // Busca manual via HTTP
  const fetchProduct = useCallback(async (barcode: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/scanner/product?barcode=${barcode}`);
      const data = await res.json();
      const result: ScanResult = {
        success: true,
        barcode,
        timestamp: new Date().toISOString(),
        product: data.product,
      };
      setLastScan(result);
      setScanHistory((prev) => [result, ...prev.slice(0, 9)]);
    } catch {
      const result: ScanResult = {
        success: false,
        barcode,
        timestamp: new Date().toISOString(),
      };
      setLastScan(result);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Deep link params
  useEffect(() => {
    const barcode = searchParams.get('barcode');
    if (barcode) fetchProduct(barcode);
  }, [searchParams, fetchProduct]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      fetchProduct(manualBarcode.trim());
      setManualBarcode('');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Leitor de Códigos de Barras</h1>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
      </div>

      {/* Busca manual */}
      <form onSubmit={handleManualSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            placeholder="Digite o código de barras..."
            className="flex-1 p-3 border rounded-lg"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>

      {/* Resultado atual */}
      {lastScan && (
        <div className={`p-4 rounded-lg mb-6 ${lastScan.product ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h2 className="font-semibold mb-2">Último Scan</h2>
          <p><strong>Código:</strong> {lastScan.barcode}</p>
          <p><strong>Data:</strong> {new Date(lastScan.timestamp).toLocaleString()}</p>
          
          {lastScan.product ? (
            <div className="mt-3 p-3 bg-white rounded">
              <p className="font-medium text-lg">{lastScan.product.originalName}</p>
              {lastScan.product.brand && <p className="text-sm text-gray-600">Marca: {lastScan.product.brand}</p>}
              {lastScan.product.category && <p className="text-sm text-gray-600">Categoria: {lastScan.product.category}</p>}
              <p className="text-xl font-bold text-green-600 mt-2">Média: R$ {lastScan.product.averagePrice}</p>
            </div>
          ) : (
            <p className="text-red-600 mt-2">Produto não encontrado no histórico</p>
          )}
        </div>
      )}

      {/* Histórico de scans */}
      {scanHistory.length > 1 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Histórico</h3>
          <div className="space-y-2">
            {scanHistory.slice(1).map((scan, index) => (
              <div
                key={`${scan.barcode}-${scan.timestamp}-${index}`}
                className={`p-3 rounded-lg flex justify-between items-center ${
                  scan.product ? 'bg-gray-50' : 'bg-red-50'
                }`}
              >
                <div>
                  <p className="font-medium">{scan.barcode}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(scan.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                {scan.product && (
                  <p className="text-green-600 font-semibold">R$ {scan.product.averagePrice}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status */}
      <div className="mt-6 text-sm text-gray-500">
        <p>Escaneie um código com o app mobile para ver em tempo real</p>
        <p>Configure o deep link: <code>dash-somaaibusiness://scanner?barcode=[CODIGO]</code></p>
      </div>
    </div>
  );
}

function Loading() {
  return <div className="p-6">Carregando...</div>;
}

export default function ScannerPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ScannerContent />
    </Suspense>
  );
}