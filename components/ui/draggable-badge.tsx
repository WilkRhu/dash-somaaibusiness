'use client';

import { useRef, useState, useEffect } from 'react';

interface DraggableBadgeProps {
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  storageKey?: string;
}

export function DraggableBadge({
  children,
  defaultPosition = { x: 24, y: 24 },
  storageKey = 'draggable-badge-pos',
}: DraggableBadgeProps) {
  const [pos, setPos] = useState(defaultPosition);
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setPos(JSON.parse(saved));
    } catch {}
  }, [storageKey]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: MouseEvent) => {
      const x = Math.min(Math.max(0, e.clientX - offset.current.x), window.innerWidth - (ref.current?.offsetWidth ?? 0));
      const y = Math.min(Math.max(0, e.clientY - offset.current.y), window.innerHeight - (ref.current?.offsetHeight ?? 0));
      setPos({ x, y });
    };

    const onUp = () => {
      setDragging(false);
      setPos((p) => {
        try { localStorage.setItem(storageKey, JSON.stringify(p)); } catch {}
        return p;
      });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, storageKey]);

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      style={{ position: 'fixed', left: pos.x, top: pos.y, zIndex: 50, cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none' }}
    >
      {children}
    </div>
  );
}
