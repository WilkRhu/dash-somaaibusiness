'use client';

import { useAuthStore } from '@/lib/stores/auth-store';

export function EstablishmentSelector() {
  const { establishmentId, setEstablishmentId } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEstablishmentId(e.target.value);
  };

  // Mock de estabelecimentos - substituir por API real
  const establishments = [
    { id: 'dev-establishment-123', name: 'Estabelecimento Demo' },
    { id: 'establishment-456', name: 'Loja Principal' },
    { id: 'establishment-789', name: 'Filial Centro' },
  ];

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Estabelecimento:</label>
      <select
        value={establishmentId || ''}
        onChange={handleChange}
        className="px-3 py-1.5 border rounded-md text-sm"
      >
        <option value="">Selecione...</option>
        {establishments.map((est) => (
          <option key={est.id} value={est.id}>
            {est.name}
          </option>
        ))}
      </select>
    </div>
  );
}
