'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ticketsApi } from '@/lib/api/tickets';

export default function ContactSalesPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: 'Interesse em Enterprise',
    description: '',
    contactPhoneRaw: '',
    contactEmail: '',
    priority: 'high',
    category: 'sales',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Hidden fields for API
  const HIDDEN_PRIORITY = 'high';
  const HIDDEN_CATEGORY = 'sales';

  // Formatar telefone para exibição
  const formatPhoneDisplay = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, 11)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await ticketsApi.create({
        subject: formData.subject,
        description: formData.description,
        contactPhone: formData.contactPhoneRaw ? `+55${formData.contactPhoneRaw}` : undefined,
        contactEmail: formData.contactEmail || undefined,
        priority: HIDDEN_PRIORITY as any,
        category: HIDDEN_CATEGORY as any,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#4C99C2] via-[#7CBD6A] to-[#4C99C2] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-brand-navy mb-4">Ticket Enviado com Sucesso!</h2>
          <p className="text-brand-navy/70 mb-6">
            Obrigado pelo interesse. Em breve nossa equipe comercial entrará em contato com você.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#4C99C2] to-[#7CBD6A] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4C99C2] via-[#7CBD6A] to-[#4C99C2] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <Image
              src="https://somaaiuploads.s3.us-east-1.amazonaws.com/logomarca/logobusiness.png"
              alt="SomaAI Business Logo"
              width={50}
              height={50}
              unoptimized
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4C99C2] to-[#7CBD6A] bg-clip-text text-transparent">
              SomaAI Business
            </h1>
          </Link>
          <h2 className="text-3xl font-bold text-brand-navy mb-2">Plano Enterprise</h2>
          <p className="text-brand-navy/70">
            Preencha o formulário abaixo e nossa equipe comercial entrará em contato
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-2">Assunto *</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4C99C2] focus:outline-none transition-colors text-brand-navy"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-navy mb-2">Celular *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/50">+55</span>
                <input
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formatPhoneDisplay(formData.contactPhoneRaw)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, contactPhoneRaw: value });
                  }}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:border-[#4C99C2] focus:outline-none transition-colors text-brand-navy"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-navy mb-2">Email *</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4C99C2] focus:outline-none transition-colors text-brand-navy"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-navy mb-2">Descrição *</label>
            <textarea
              rows={4}
              placeholder="Conte-nos sobre sua empresa e suas necessidades..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4C99C2] focus:outline-none transition-colors text-brand-navy resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-[#4C99C2] to-[#7CBD6A] text-white rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Solicitar Contato'}
          </button>

          <Link
            href="/"
            className="block text-center text-brand-navy/60 hover:text-brand-navy transition-colors"
          >
            ← Voltar para Home
          </Link>
        </form>
      </div>
    </div>
  );
}