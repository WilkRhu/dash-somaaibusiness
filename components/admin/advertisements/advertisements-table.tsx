'use client';

import { Advertisement } from '@/lib/api/advertisements';

function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface AdvertisementsTableProps {
  advertisements: Advertisement[];
  onEdit: (ad: Advertisement) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function AdvertisementsTable({
  advertisements,
  onEdit,
  onDelete,
  isLoading = false,
}: AdvertisementsTableProps) {
  if (advertisements.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="mt-4 text-gray-500">Nenhuma publicidade encontrada</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Título
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Plataforma
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Período
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Segmentação
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Prioridade
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Estatísticas
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {advertisements.map((ad) => (
            <tr
              key={ad.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-10 h-10 rounded object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect fill="%23ddd" width="40" height="40"/%3E%3C/svg%3E';
                    }}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{ad.title}</p>
                    <p className="text-sm text-gray-500">{ad.description.substring(0, 40)}...</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {ad.platform === 'all' ? 'Todas' : ad.platform === 'mobile' ? 'Mobile' : 'Web'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <div>
                  <p>{formatDate(ad.startDate)}</p>
                  <p className="text-gray-500">até {formatDate(ad.endDate)}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="space-y-1">
                  {ad.minAge || ad.maxAge ? (
                    <p className="text-gray-600">
                      {ad.minAge && <span>{ad.minAge}</span>}
                      {ad.minAge && ad.maxAge && <span> - </span>}
                      {ad.maxAge && <span>{ad.maxAge}</span>} anos
                    </p>
                  ) : (
                    <p className="text-gray-500">Sem restrição</p>
                  )}
                  {ad.targetGenders && ad.targetGenders.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {ad.targetGenders.map((gender) => (
                        <span key={gender} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          {(gender as string) === 'woman_cisgender' && 'Mulher'}
                          {(gender as string) === 'man_cisgender' && 'Homem'}
                          {(gender as string) === 'woman_trans' && 'M. Trans'}
                          {(gender as string) === 'man_trans' && 'H. Trans'}
                          {(gender as string) === 'non_binary' && 'Não-bin.'}
                          {(gender as string) === 'agender' && 'Agênero'}
                          {(gender as string) === 'gender_fluid' && 'Fluido'}
                          {(gender as string) === 'other' && 'Outro'}
                          {(gender as string) === 'prefer_not_to_say' && 'Não inf.'}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-xs">Todos os gêneros</p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                  {ad.priority}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-600">
                    <span className="font-medium">{ad.impressions}</span> impressões
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">{ad.clicks}</span> cliques ({typeof ad.ctr === 'number' ? ad.ctr.toFixed(1) : ad.ctr}%)
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                {ad.isActive ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Ativo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                    Inativo
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(ad)}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja deletar esta publicidade?')) {
                        onDelete(ad.id);
                      }
                    }}
                    disabled={isLoading}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 transition-colors"
                  >
                    Deletar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
