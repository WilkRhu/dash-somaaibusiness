'use client';

import { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  isPlaying: boolean;
  onStop?: () => void;
}

export function AudioPlayer({ isPlaying, onStop }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      console.log('🔊 Iniciando reprodução de áudio');
      audioRef.current.play().catch((error) => {
        console.error('❌ Erro ao reproduzir áudio:', error);
      });
    } else {
      console.log('🔇 Parando reprodução de áudio');
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  return (
    <audio
      ref={audioRef}
      src="/audio/notificacao-pedido.mp3"
      loop
      preload="auto"
      style={{ display: 'none' }}
    />
  );
}
