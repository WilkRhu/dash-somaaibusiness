'use client';

import { DeliveryZone } from '@/lib/types/delivery';
import { formatCurrency } from '@/lib/utils/format';

interface DeliveryZonesTableProps {
  zones: DeliveryZone[];
  onEdit: (zone: DeliveryZone) => void;
  onDelete: (zone: DeliveryZone) => void;
}

export function DeliveryZonesTable({ zones, onEdit, onDelete }: DeliveryZonesTableProps) {
  if (zones.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Nenhuma zona de entrega cadastrada</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bairros
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Taxa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Entrega Grátis
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tempo
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {zones.map((zone) => (
            <tr key={zone.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-gray-900">{zone.name}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {zone.neighborhoods && zone.neighborhoods.length > 0
                    ? `${zone.neighborhoods.slice(0, 3).join(', ')}${zone.neighborhoods.length > 3 ? ` +${zone.neighborhoods.length - 3}` : ''}`
                    : 'Nenhum bairro'
                  }
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatCurrency(zone.deliveryFee)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {zone.freeDeliveryMinimum 
                    ? `Acima de ${formatCurrency(zone.freeDeliveryMinimum)}`
                    : 'Não'
                  }
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{zone.estimatedTime} min</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(zone)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(zone)}
                  className="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
