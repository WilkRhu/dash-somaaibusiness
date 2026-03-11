'use client';

import { useState } from 'react';
import { validateCertificateFile, validateCertificatePassword } from '@/lib/utils/fiscal-validators';
import { showToast } from '@/components/ui/toast';

interface CertificateUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onUpload: (file: File, password: string) => Promise<any>;
  isLoading?: boolean;
}

export function CertificateUploadModal({
  isOpen,
  onClose,
  onSuccess,
  onUpload,
  isLoading = false,
}: CertificateUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!validateCertificateFile(selectedFile)) {
        setErrors({
          file: 'Arquivo inválido. Use .pfx ou .p12 com máximo 5MB.',
        });
        setFile(null);
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.file;
          return newErrors;
        });
        setFile(selectedFile);
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (value && !validateCertificatePassword(value)) {
      setErrors((prev) => ({
        ...prev,
        password: 'Senha deve ter entre 4 e 50 caracteres.',
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.password;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar arquivo
    if (!file) {
      setErrors((prev) => ({
        ...prev,
        file: 'Selecione um arquivo de certificado.',
      }));
      return;
    }

    // Validar senha
    if (!password) {
      setErrors((prev) => ({
        ...prev,
        password: 'Digite a senha do certificado.',
      }));
      return;
    }

    if (!validateCertificatePassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password: 'Senha deve ter entre 4 e 50 caracteres.',
      }));
      return;
    }

    try {
      await onUpload(file, password);
      showToast('Certificado enviado com sucesso!', 'success');
      setFile(null);
      setPassword('');
      setErrors({});
      onSuccess?.();
      onClose();
    } catch (error: any) {
      showToast(error.message || 'Erro ao fazer upload do certificado', 'error');
      setErrors((prev) => ({
        ...prev,
        submit: error.message || 'Erro ao fazer upload do certificado',
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-brand-navy">Upload de Certificado Digital</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Informações */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Formatos aceitos:</strong> .pfx ou .p12
              <br />
              <strong>Tamanho máximo:</strong> 5MB
            </p>
          </div>

          {/* Seleção de Arquivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquivo do Certificado
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pfx,.p12"
                onChange={handleFileChange}
                disabled={isLoading}
                className="hidden"
                id="certificate-file"
              />
              <label
                htmlFor="certificate-file"
                className={`block w-full px-4 py-3 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                  file
                    ? 'border-green-400 bg-green-50'
                    : errors.file
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {file ? (
                  <div>
                    <p className="text-sm font-semibold text-green-700">✅ {file.name}</p>
                    <p className="text-xs text-green-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Clique para selecionar</p>
                    <p className="text-xs text-gray-500">ou arraste o arquivo aqui</p>
                  </div>
                )}
              </label>
            </div>
            {errors.file && <p className="text-sm text-red-600 mt-1">{errors.file}</p>}
          </div>

          {/* Senha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha do Certificado
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Digite a senha"
                disabled={isLoading}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent disabled:opacity-50 ${
                  errors.password ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          </div>

          {/* Erro de Submit */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !file || !password}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Enviando...' : 'Enviar Certificado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
