'use client';

import { useState } from 'react';
import { Advertisement, CreateAdvertisementDto, UpdateAdvertisementDto } from '@/lib/api/advertisements';

interface AdvertisementFormProps {
  advertisement?: Advertisement;
  onSubmit: (data: CreateAdvertisementDto | UpdateAdvertisementDto) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function AdvertisementForm({
  advertisement,
  onSubmit,
  isLoading = false,
  onCancel,
}: AdvertisementFormProps) {
  const [formData, setFormData] = useState<CreateAdvertisementDto>({
    title: advertisement?.title || '',
    description: advertisement?.description || '',
    imageUrl: advertisement?.imageUrl || '',
    backgroundColor: advertisement?.backgroundColor || '#10b981',
    gradientColors: advertisement?.gradientColors || ['#10b981', '#059669'],
    actionUrl: advertisement?.actionUrl || '',
    actionLabel: advertisement?.actionLabel || 'Aproveitar',
    startDate: advertisement?.startDate?.split('T')[0] || '',
    endDate: advertisement?.endDate?.split('T')[0] || '',
    priority: advertisement?.priority || 1,
    platform: advertisement?.platform || 'all',
    isActive: advertisement?.isActive ?? true,
    minAge: advertisement?.minAge,
    maxAge: advertisement?.maxAge,
    targetGenders: advertisement?.targetGenders || [],
  });

  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? checked 
        : (name === 'minAge' || name === 'maxAge' || name === 'priority')
        ? (value ? Number(value) : undefined)
        : value,
    }));
  };

  const handleGenderToggle = (gender: string) => {
    setFormData((prev) => ({
      ...prev,
      targetGenders: prev.targetGenders?.includes(gender as any)
        ? prev.targetGenders.filter((g) => g !== gender)
        : [...(prev.targetGenders || []), gender as any],
    }));
  };

  const handleGradientChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      gradientColors: prev.gradientColors.map((color, i) => (i === index ? value : color)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validações básicas
      if (!formData.title.trim()) {
        throw new Error('Título é obrigatório');
      }
      if (!formData.description.trim()) {
        throw new Error('Descrição é obrigatória');
      }
      if (!formData.imageUrl.trim()) {
        throw new Error('URL da imagem é obrigatória');
      }
      if (!formData.actionUrl.trim()) {
        throw new Error('URL de ação é obrigatória');
      }
      if (!formData.startDate) {
        throw new Error('Data de início é obrigatória');
      }
      if (!formData.endDate) {
        throw new Error('Data de término é obrigatória');
      }

      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (startDate >= endDate) {
        throw new Error('Data de término deve ser após a data de início');
      }

      // Validar idades
      if (formData.minAge !== undefined && formData.maxAge !== undefined) {
        if (formData.minAge > formData.maxAge) {
          throw new Error('Idade mínima não pode ser maior que a idade máxima');
        }
      }

      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar publicidade');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: Promoção Especial"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting || isLoading}
          />
        </div>

        {/* Prioridade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prioridade
          </label>
          <input
            type="number"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            min="1"
            max="100"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting || isLoading}
          />
        </div>
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Ex: Ganhe 20% de desconto em sua próxima compra"
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting || isLoading}
        />
      </div>

      {/* URL da Imagem */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL da Imagem *
        </label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://cdn.example.com/image.jpg"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting || isLoading}
        />
        {formData.imageUrl && (
          <div className="mt-2">
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="h-32 w-full object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EImagem inválida%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        )}
      </div>

      {/* Cores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor de Fundo
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.backgroundColor}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  backgroundColor: e.target.value,
                }))
              }
              className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              disabled={isSubmitting || isLoading}
            />
            <input
              type="text"
              value={formData.backgroundColor}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  backgroundColor: e.target.value,
                }))
              }
              placeholder="#10b981"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting || isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cores do Gradiente
          </label>
          <div className="space-y-2">
            {formData.gradientColors.map((color, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleGradientChange(index, e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  disabled={isSubmitting || isLoading}
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => handleGradientChange(index, e.target.value)}
                  placeholder="#10b981"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting || isLoading}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* URLs de Ação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL de Ação *
          </label>
          <input
            type="url"
            name="actionUrl"
            value={formData.actionUrl}
            onChange={handleChange}
            placeholder="https://somaai.com/promo"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting || isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Texto do Botão
          </label>
          <input
            type="text"
            name="actionLabel"
            value={formData.actionLabel}
            onChange={handleChange}
            placeholder="Aproveitar"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting || isLoading}
          />
        </div>
      </div>

      {/* Datas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Início *
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting || isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Término *
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting || isLoading}
          />
        </div>
      </div>

      {/* Plataforma e Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plataforma
          </label>
          <select
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting || isLoading}
          >
            <option value="all">Todas</option>
            <option value="mobile">Mobile</option>
            <option value="web">Web</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300"
              disabled={isSubmitting || isLoading}
            />
            <span className="text-sm font-medium text-gray-700">Ativo</span>
          </label>
        </div>
      </div>

      {/* Segmentação Demográfica */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Segmentação Demográfica (Opcional)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idade Mínima
            </label>
            <input
              type="number"
              name="minAge"
              value={formData.minAge || ''}
              onChange={handleChange}
              placeholder="Ex: 18"
              min="0"
              max="120"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting || isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idade Máxima
            </label>
            <input
              type="number"
              name="maxAge"
              value={formData.maxAge || ''}
              onChange={handleChange}
              placeholder="Ex: 65"
              min="0"
              max="120"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting || isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Gêneros Alvo (Deixe em branco para todos)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { value: 'woman_cisgender', label: 'Mulher (Cisgênero)' },
              { value: 'man_cisgender', label: 'Homem (Cisgênero)' },
              { value: 'woman_trans', label: 'Mulher Trans / Travesti' },
              { value: 'man_trans', label: 'Homem Trans' },
              { value: 'non_binary', label: 'Não-binário' },
              { value: 'agender', label: 'Agênero' },
              { value: 'gender_fluid', label: 'Gênero-fluido' },
              { value: 'other', label: 'Outro' },
              { value: 'prefer_not_to_say', label: 'Prefiro não informar' },
            ].map((gender) => (
              <label key={gender.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.targetGenders?.includes(gender.value as any) || false}
                  onChange={() => handleGenderToggle(gender.value)}
                  className="w-4 h-4 rounded border-gray-300"
                  disabled={isSubmitting || isLoading}
                />
                <span className="text-sm text-gray-700">{gender.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-6 border-t">
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
        >
          {isSubmitting || isLoading ? 'Salvando...' : 'Salvar Publicidade'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting || isLoading}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors font-medium"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
