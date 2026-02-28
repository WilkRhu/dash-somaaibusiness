'use client';

import { useState, useRef } from 'react';
import { InventoryItem } from '@/lib/types/inventory';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface ManageImagesModalProps {
  product: InventoryItem;
  onUpload: (images: File[]) => Promise<void>;
  onDelete: (imageUrl: string) => Promise<void>;
  onClose: () => void;
}

export function ManageImagesModal({ product, onUpload, onDelete, onClose }: ManageImagesModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productImages = product.images || [];
  const canAddMore = productImages.length + selectedImages.length < 4;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 4 - productImages.length - selectedImages.length;
    const filesToAdd = files.slice(0, remainingSlots);

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
      errors.push(`Você pode adicionar no máximo ${remainingSlots} imagens`);
    }

    if (validFiles.length > 0) {
      setSelectedImages([...selectedImages, ...validFiles]);

      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveSelected = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) return;

    setIsUploading(true);
    try {
      await onUpload(selectedImages);
      setSelectedImages([]);
      setPreviews([]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageUrl: string) => {
    setDeleteConfirm(imageUrl);
  };

  const confirmDeleteImage = async () => {
    if (!deleteConfirm) return;
    await onDelete(deleteConfirm);
    setDeleteConfirm(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-brand-navy">Gerenciar Imagens</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <p className="text-gray-600 mb-4">{product.name}</p>

        <div className="space-y-6">
          {/* Imagens Atuais */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Imagens Atuais ({productImages.length}/4)
            </h3>
            {productImages.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma imagem cadastrada</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {productImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      onClick={() => handleDelete(imageUrl)}
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
              </div>
            )}
          </div>

          {/* Novas Imagens */}
          {canAddMore && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Adicionar Novas Imagens</h3>
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
                      onClick={() => handleRemoveSelected(index)}
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

                {productImages.length + selectedImages.length < 4 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-brand-blue hover:bg-blue-50 transition-colors"
                  >
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm text-gray-500">Selecionar</span>
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

              <p className="text-xs text-gray-500 mt-2">
                Formatos aceitos: JPEG, PNG, WebP. Tamanho máximo: 5MB por imagem.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
          {selectedImages.length > 0 && (
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-green text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50"
            >
              {isUploading ? 'Enviando...' : `Enviar ${selectedImages.length} Imagem${selectedImages.length > 1 ? 'ns' : ''}`}
            </button>
          )}
        </div>

        {deleteConfirm && (
          <ConfirmModal
            title="Remover Imagem"
            message="Tem certeza que deseja remover esta imagem? Esta ação não pode ser desfeita."
            confirmText="Sim, Remover"
            cancelText="Cancelar"
            confirmVariant="danger"
            onConfirm={confirmDeleteImage}
            onCancel={() => setDeleteConfirm(null)}
          />
        )}
      </div>
    </div>
  );
}
