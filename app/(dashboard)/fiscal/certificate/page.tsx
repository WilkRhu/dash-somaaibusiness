'use client';

import { useState, useEffect } from 'react';
import { useFiscalCertificate } from '@/lib/hooks/use-fiscal-certificate';
import { CertificateStatus } from '@/components/fiscal/certificate-status';
import { CertificateUploadModal } from '@/components/fiscal/modals/certificate-upload-modal';
import { showToast } from '@/components/ui/toast';

export default function CertificatePage() {
  const {
    certificate,
    isLoading,
    error,
    validationResult,
    uploadCertificate,
    validateCertificate,
    refetch,
  } = useFiscalCertificate();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Mostrar erro se houver
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
    }
  }, [error]);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const result = await validateCertificate();
      if (result) {
        showToast('Certificado validado com sucesso!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Erro ao validar certificado', 'error');
    } finally {
      setIsValidating(false);
    }
  };

  const handleUploadSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Certificado Digital</h1>
        <p className="text-gray-600 mt-2">
          Gerencie seu certificado digital para emitir notas fiscais
        </p>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2">
          <CertificateStatus
            certificate={certificate}
            onUpload={() => setIsUploadOpen(true)}
            onValidate={handleValidate}
            isLoading={isValidating}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Card de Informações */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-3">ℹ️ Informações</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>O que é?</strong>
                <br />
                Um certificado digital é um documento eletrônico que comprova sua identidade.
              </p>
              <p>
                <strong>Para quê?</strong>
                <br />
                Necessário para emitir notas fiscais eletrônicas (NFC-e e NF-e).
              </p>
              <p>
                <strong>Tipos:</strong>
                <br />
                A1 (arquivo) ou A3 (token/cartão)
              </p>
            </div>
          </div>

          {/* Card de Suporte */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">❓ Precisa de ajuda?</h3>
            <p className="text-sm text-blue-800 mb-3">
              Consulte a documentação sobre certificados digitais.
            </p>
            <a
              href="#"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Ver documentação →
            </a>
          </div>

          {/* Card de Status */}
          {certificate && (
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-3">📊 Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ativo:</span>
                  <span className={certificate.isActive ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {certificate.isActive ? 'Sim' : 'Não'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-semibold text-gray-900">{certificate.type}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resultado de Validação */}
      {validationResult && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Resultado da Validação</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`text-lg font-semibold ${validationResult.valid ? 'text-green-600' : 'text-red-600'}`}>
                {validationResult.valid ? '✅ Válido' : '❌ Inválido'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">CNPJ</p>
              <p className="text-lg font-semibold text-gray-900">{validationResult.cnpj}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Titular</p>
              <p className="text-lg font-semibold text-gray-900">{validationResult.holderName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expira em</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(validationResult.expiresAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dias até expiração</p>
              <p className={`text-lg font-semibold ${validationResult.daysUntilExpiration > 30 ? 'text-green-600' : 'text-yellow-600'}`}>
                {validationResult.daysUntilExpiration} dias
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expirado?</p>
              <p className={`text-lg font-semibold ${validationResult.isExpired ? 'text-red-600' : 'text-green-600'}`}>
                {validationResult.isExpired ? 'Sim' : 'Não'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Upload */}
      <CertificateUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
        onUpload={uploadCertificate}
        isLoading={isLoading}
      />
    </div>
  );
}
