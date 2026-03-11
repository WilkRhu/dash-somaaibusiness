'use client';

import { useState } from 'react';
import { validateCorrectionText } from '@/lib/utils/fiscal-validators';
import { showToast } from '@/components/ui/toast';

interface CorrectionFormProps {
  onSubmit: (correctionText: string) => Promise<void>;
  isLoading?: boolean;
}

export function CorrectionForm({ onSubmit, isLoading = false }: CorrectionFormProps) {
  const [correctionText, setCorrectionText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCorrectionText(correctionText)) {
      setError('Texto deve ter entre 15 e 1000 caracteres');
      showToast('Texto inválido', 'error');
      return;
    }

    try {
      await onSubmit(correctionText);
      showToast('Carta de correção criada com sucesso!', 'success');
      setCorrectionText('');
      setError('');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar carta de correção');
      showToast(err.message || 'Erro ao criar carta de correção', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Texto da Correção *
        </label>
        <textarea
          value={correctionText}
          onChange={(e) => {
            setCorrectionText(e.target.value);
            setError('');
          }}
          placeholder="Descreva a correção necessária (mínimo 15 caracteres)"
          maxLength={1000}
          rows={6}
          disabled={isLoading}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50 ${
            error ? 'border-red-400' : 'border-gray-300'
          }`}
        />
        <div className="flex justify-between mt-2">
          <p className="text-xs text-gray-500">{correctionText.length}/1000</p>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || correctionText.length < 15}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Enviando...' : '✓ Criar Correção'}
        </button>
      </div>
    </form>
  );
}
