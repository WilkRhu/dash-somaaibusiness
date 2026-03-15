'use client';

import { useState, useRef, useEffect } from 'react';
import { useEstablishmentStore } from '@/lib/stores/establishment-store';
import { useEstablishments } from '@/lib/hooks/use-establishments';

export function EstablishmentSelector() {
  const { currentEstablishment, setCurrentEstablishment } = useEstablishmentStore();
  const { establishments } = useEstablishments();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (establishments.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.581m0 0H9m0 0h5.581m0 0a2.121 2.121 0 01-4.242 0m9.242 0c.299-1.031.157-2.185-.568-3.055a2.114 2.114 0 00-.772-.293m0 0a2.121 2.121 0 00-4.242 0m15.362 5.853c-.265.978-.742 1.883-1.386 2.622M16.737 20.129a9.009 9.009 0 01-12.608-1.973m0 0a9 9 0 1112.608 1.973" />
        </svg>
        <span className="truncate max-w-xs">
          {currentEstablishment?.name || 'Selecionar estabelecimento'}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {establishments.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              Nenhum estabelecimento disponível
            </div>
          ) : (
            establishments.map((establishment) => (
              <button
                key={establishment.id}
                onClick={() => {
                  setCurrentEstablishment(establishment);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  currentEstablishment?.id === establishment.id
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {currentEstablishment?.id === establishment.id && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{establishment.name}</p>
                    {establishment.address && (
                      <p className="text-xs text-gray-500">{establishment.address}</p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
