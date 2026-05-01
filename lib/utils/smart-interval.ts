/**
 * Cria um intervalo que pausa automaticamente quando a aba está oculta.
 * Retorna uma função de cleanup para usar no useEffect.
 */
export function smartInterval(callback: () => void, ms: number): () => void {
  const tick = () => {
    if (!document.hidden) callback();
  };

  const id = setInterval(tick, ms);
  return () => clearInterval(id);
}
