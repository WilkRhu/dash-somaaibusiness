'use client';

import { useState, useRef } from 'react';
import { showToast } from '../ui/toast';

interface CustomerImageUploadProps {
  currentImage?: string;
  onImageChange: (base64Image: string) => void;
}

export function CustomerImageUpload({ currentImage, onImageChange }: CustomerImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      showToast({ type: 'error', message: 'Por favor, selecione uma imagem válida' });
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast({ type: 'error', message: 'A imagem deve ter no máximo 5MB' });
      return;
    }

    setIsLoading(true);

    try {
      // Converter para base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageChange(base64String);
        setIsLoading(false);
      };
      reader.onerror = () => {
        showToast({ type: 'error', message: 'Erro ao processar imagem' });
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      showToast({ type: 'error', message: 'Erro ao processar imagem' });
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Foto do Cliente
      </label>

      <div className="flex items-center gap-4">
        {/* Preview da Imagem */}
        <div className="relative">
          {preview ? (
            <>
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              {!isLoading && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md z-10"
                  title="Remover imagem"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isLoading}
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
          >
            {isLoading ? 'Processando...' : preview ? 'Alterar Foto' : 'Escolher Foto'}
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            JPG, PNG ou WebP. Máximo 5MB.
          </p>
        </div>
      </div>
    </div>
  );
}
