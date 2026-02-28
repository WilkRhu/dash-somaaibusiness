'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onImagesChange, maxImages = 4 }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = maxImages - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    // Validar tamanho e tipo
    const validFiles: File[] = [];
    const errors: string[] = [];

    filesToAdd.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name} é muito grande (máx. 5MB)`);
      } else if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        errors.push(`${file.name} não é um formato válido`);
      } else {
        validFiles.push(file);
      }
    });

    if (files.length > remainingSlots) {
      errors.push(`Você pode adicionar no máximo ${maxImages} imagens`);
    }

    if (validFiles.length > 0) {
      const newImages = [...images, ...validFiles];
      onImagesChange(newImages);

      // Criar previews
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }

    // Limpar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    onImagesChange(newImages);
    setPreviews(newPreviews);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Imagens do Produto (até {maxImages})
        </label>
        <span className="text-xs text-gray-500">
          {images.length}/{maxImages}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-brand-blue hover:bg-blue-50 transition-colors"
          >
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm text-gray-500">Adicionar Imagem</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        Formatos aceitos: JPEG, PNG, WebP. Tamanho máximo: 5MB por imagem.
      </p>
    </div>
  );
}
