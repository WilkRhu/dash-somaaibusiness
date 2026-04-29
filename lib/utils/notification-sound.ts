/**
 * Toca um som de notificação usando Web Audio API.
 * Funciona sem arquivos externos.
 */
export function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Beep 1
    const play = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.4, ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
      osc.start(ctx.currentTime + startTime);
      osc.stop(ctx.currentTime + startTime + duration);
    };

    // 3 beeps ascendentes
    play(660, 0, 0.15);
    play(880, 0.18, 0.15);
    play(1100, 0.36, 0.2);
  } catch {
    // Web Audio API não disponível
  }
}
