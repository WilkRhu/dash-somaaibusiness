'use client';

import { useState } from 'react';
import { validateNumberRange, validateDisablementJustification } from '@/lib/utils/fiscal-validators';
import { showToast } from '@/components/ui/toast';

interface DisablementFormProps {
  onSubmit: (startNumber: number, endNumber: number, justification: string) => Promise<void>;
  isLoading?: boolean;
}

export function DisablementForm({ onSubmit, isLoading = false }: DisablementFormProps) {
  const [startNumber, setStartNumber] = useState('');
  const [endNumber, setEndNumber] = useState('');
  const [justification, setJustification] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const start = parseInt(startNumber);
    const end = parseInt(endNumber);

    if (!startNumber || isNaN(start)) {
      newErrors.startNumber = 'Número inicial obrigatório';
    }

    if (!endNumber || isNaN(end)) {
      newErrors.endNumber = 'Número final obrigatório';
    }

    if (startNumber && endNumber && !validateNumberRange(start, end)) {
      newErrors.range = 'Intervalo inválido (número inicial deve ser menor ou igual ao final)';
    }

    if (!validateDisablementJustification(justification)) {
      newErrors.justification = 'Justificativa deve ter entre 15 e 1000 caracteres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Corrija os erros no formulário', 'error');
      return;
    }

    try {
      await onSubmit(start, end, justification);
      showToast('Inutilização criada com sucesso!', 'success');
      setStartNumber('');
      setEndNumber('');
      setJustification('');
      setErrors({});
    } catch (err: any) {
      setErrors({ submit: err.message || 'Erro ao criar inutilização' });
      showToast(err.message || 'Erro ao criar inutilização', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número Inicial *
          </label>
          <input
            type="number"
            value={startNumber}
            onChange={(e) => {
              setStartNumber(e.target.value);
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.startNumber;
                delete newErrors.range;
                return newErrors;
              });
            }}
            placeholder="1"
            min="1"
            max="999999999"
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50 ${
              errors.startNumber ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.startNumber && <p className="text-sm text-red-600 mt-1">{errors.startNumber}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número Final *
          </label>
          <input
            type="number"
            value={endNumber}
            onChange={(e) => {
              setEndNumber(e.target.value);
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.endNumber;
                delete newErrors.range;
                return newErrors;
              });
            }}
            placeholder="10"
            min="1"
            max="999999999"
            disabled={isLoading}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50 ${
              errors.endNumber ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.endNumber && <p className="text-sm text-red-600 mt-1">{errors.endNumber}</p>}
        </div>
      </div>

      {errors.range && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errors.range}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Justificativa *
        </label>
        <textarea
          value={justification}
          onChange={(e) => {
            setJustification(e.target.value);
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors.justification;
              return newErrors;
            });
          }}
          placeholder="Motivo da inutilização (mínimo 15 caracteres)"
          maxLength={1000}
          rows={4}
          disabled={isLoading}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50 ${
            errors.justification ? 'border-red-400' : 'border-gray-300'
          }`}
        />
        <div className="flex justify-between mt-2">
          <p className="text-xs text-gray-500">{justification.length}/1000</p>
          {errors.justification && <p className="text-xs text-red-600">{errors.justification}</p>}
        </div>
      </div>

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errors.submit}</p>
        </div>
      )}

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
          disabled={isLoading || !startNumber || !endNumber || !justification}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
        >
          {isLoading ? 'Enviando...' : '✓ Inutilizar'}
        </button>
      </div>
    </form>
  );
}
