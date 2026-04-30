/**
 * Calcula o tempo decorrido em minutos desde uma data
 * @param createdAt - Data em formato ISO string ou timestamp
 * @param now - Timestamp atual (padrão: Date.now())
 * @returns Tempo decorrido em minutos
 */
export function getElapsedMinutes(createdAt: string | number, now: number = Date.now()): number {
  try {
    let created: number;

    if (typeof createdAt === 'string') {
      const asNumber = Number(createdAt);
      if (!isNaN(asNumber) && createdAt.trim() !== '') {
        created = asNumber < 10000000000 ? asNumber * 1000 : asNumber;
      } else {
        created = new Date(createdAt).getTime();
      }
    } else {
      created = createdAt;
      if (created < 10000000000) {
        created *= 1000;
      }
    }

    if (isNaN(created)) return 0;

    const elapsed = Math.floor((now - created) / 60000);
    return Math.max(0, elapsed);
  } catch (error) {
    console.error('Erro ao calcular tempo decorrido:', error);
    return 0;
  }
}

/**
 * Formata tempo decorrido em minutos para string legível
 * @param minutes - Tempo em minutos
 * @returns String formatada (ex: "5m", "1h 30m")
 */
export function formatElapsedTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

/**
 * Retorna classe CSS baseada no tempo decorrido
 * @param minutes - Tempo em minutos
 * @param estimatedTime - Tempo estimado em minutos (opcional)
 * @returns Classe CSS para estilização
 */
export function getTimeColorClass(minutes: number, estimatedTime?: number): string {
  if (!estimatedTime) {
    if (minutes > 30) return 'text-red-600';
    if (minutes > 15) return 'text-orange-600';
    return 'text-green-600';
  }

  if (minutes > estimatedTime * 1.5) return 'text-red-600';
  if (minutes > estimatedTime) return 'text-orange-600';
  return 'text-green-600';
}
