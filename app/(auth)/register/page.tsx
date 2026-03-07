'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  // Verificar força da senha
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: '', label: '', color: '' };
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { level: 'fraca', label: 'Senha fraca', color: 'bg-red-500' };
    if (score <= 3) return { level: 'media', label: 'Senha média', color: 'bg-yellow-500' };
    if (score <= 4) return { level: 'boa', label: 'Senha boa', color: 'bg-blue-500' };
    return { level: 'forte', label: 'Senha forte', color: 'bg-green-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    
    if (!acceptTerms) {
      setError('Você precisa aceitar os termos de uso');
      return;
    }
    
    console.log('Tentando registrar...', { name, email });
    
    try {
      await register(name, email, password, phone || undefined);
      console.log('Registro bem-sucedido, redirecionando...');
      router.push('/home');
    } catch (err: any) {
      console.error('Erro no registro:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#4C99C2] via-[#7CBD6A] to-[#4C99C2] relative overflow-hidden animate-gradient">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white/20 rounded-lg rotate-12 animate-float"></div>
        <div className="absolute bottom-32 right-20 w-24 h-24 border-2 border-white/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/10 rounded-lg rotate-45 animate-float" style={{ animationDelay: '2s' }}></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="mb-8 flex items-center gap-4">
            <Image 
              src="https://somaaiuploads.s3.us-east-1.amazonaws.com/logomarca/logobusiness.png" 
              alt="SomaAI Business Logo" 
              width={60} 
              height={60}
              className="drop-shadow-lg"
              unoptimized
              priority
            />
            <div>
              <h1 className="text-5xl font-bold">SomaAI Business</h1>
              <div className="w-20 h-1 bg-white rounded-full mt-2"></div>
            </div>
          </div>
          
          <h2 className="text-3xl font-semibold mb-6">
            Comece sua jornada hoje
          </h2>
          
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            Junte-se a milhares de empresas que já transformaram sua gestão 
            com o SomaAI Business.
          </p>

          {/* Benefits */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Teste Grátis por 14 dias</h3>
                <p className="text-white/80">Sem necessidade de cartão de crédito</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Suporte Dedicado</h3>
                <p className="text-white/80">Equipe pronta para ajudar você</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Configuração Rápida</h3>
                <p className="text-white/80">Comece a usar em minutos</p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <p className="text-white/90 italic mb-4">
              "O SomaAI Business revolucionou a forma como gerenciamos nosso negócio. 
              Simples, eficiente e completo!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <div>
                <div className="font-semibold">João Silva</div>
                <div className="text-sm text-white/70">CEO, Empresa XYZ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F5F7F9]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 flex items-center justify-center gap-3">
            <Image 
              src="https://somaaiuploads.s3.us-east-1.amazonaws.com/logomarca/logobusiness.png" 
              alt="SomaAI Business Logo" 
              width={50} 
              height={50}
              unoptimized
              priority
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4C99C2] to-[#7CBD6A] bg-clip-text text-transparent">
              SomaAI Business
            </h1>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#4C99C2] to-[#7CBD6A] rounded-2xl mb-4 shadow-lg">
                <Image 
                  src="https://somaaiuploads.s3.us-east-1.amazonaws.com/logomarca/logobusiness.png" 
                  alt="SomaAI Business Logo" 
                  width={50} 
                  height={50}
                  unoptimized
                  priority
                />
              </div>
              <h2 className="text-3xl font-bold text-[#142D4A] mb-2">
                Criar sua conta
              </h2>
              <p className="text-[#142D4A]/60">
                Preencha os dados para começar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#142D4A] mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4C99C2] focus:outline-none transition-colors text-[#142D4A]"
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#142D4A] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4C99C2] focus:outline-none transition-colors text-[#142D4A]"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#142D4A] mb-2">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#4C99C2] focus:outline-none transition-colors text-[#142D4A]"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4C99C2] transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Indicador de força da senha */}
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${strength.color}`}
                          style={{ width: `${(password.length / 12) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs font-semibold ${
                        strength.level === 'fraca' ? 'text-red-500' :
                        strength.level === 'media' ? 'text-yellow-500' :
                        strength.level === 'boa' ? 'text-blue-500' :
                        'text-green-500'
                      }`}>
                        {strength.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Use pelo menos 8 caracteres com letras, números e símbolos
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#142D4A] mb-2">
                  Confirmar senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-[#142D4A] ${
                    confirmPassword 
                      ? password === confirmPassword 
                        ? 'border-green-500' 
                        : 'border-red-500'
                      : 'border-gray-200 focus:border-[#4C99C2]'
                  }`}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                {confirmPassword && (
                  <p className={`text-xs mt-1 ${
                    password === confirmPassword ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {password === confirmPassword ? '✓ Senhas coincidem' : '✗ Senhas não coincidem'}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded border-gray-300 text-[#4C99C2] focus:ring-[#4C99C2]"
                  required
                />
                <label htmlFor="terms" className="text-sm text-[#142D4A]/70">
                  Eu aceito os{' '}
                  <a href="#" className="text-[#4C99C2] hover:text-[#3A7A9A] font-semibold">
                    Termos de Uso
                  </a>
                  {' '}e{' '}
                  <a href="#" className="text-[#4C99C2] hover:text-[#3A7A9A] font-semibold">
                    Política de Privacidade
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#4C99C2] to-[#7CBD6A] text-white rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[#142D4A]/60">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-[#4C99C2] hover:text-[#3A7A9A] font-semibold">
                  Fazer login
                </Link>
              </p>
            </div>

            {/* Divider */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-[#142D4A]/40">ou registre-se com</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Register */}
            <div className="mt-6 grid grid-cols-1 gap-4">
              <GoogleLoginButton buttonText="Cadastrar com Google" fullWidth />
            </div>
          </div>

          {/* Back to home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-[#142D4A]/60 hover:text-[#4C99C2] text-sm font-medium">
              ← Voltar para home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
