'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    console.log('Tentando fazer login...', { email });
    
    try {
      await login(email, password);
      console.log('Login bem-sucedido, redirecionando...');
      router.push('/home');
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao fazer login. Verifique suas credenciais.');
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
            Gestão Inteligente para Seu Negócio
          </h2>
          
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            Sistema completo de gestão empresarial com controle de estoque, 
            vendas, ofertas e relatórios em tempo real.
          </p>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Controle de Estoque</h3>
                <p className="text-white/80">Gerencie produtos e alertas em tempo real</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">PDV Completo</h3>
                <p className="text-white/80">Ponto de venda integrado e eficiente</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Relatórios Detalhados</h3>
                <p className="text-white/80">Análises completas para decisões inteligentes</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-1">1000+</div>
              <div className="text-white/80 text-sm">Empresas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">50K+</div>
              <div className="text-white/80 text-sm">Vendas/mês</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">99.9%</div>
              <div className="text-white/80 text-sm">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
                Bem-vindo de volta!
              </h2>
              <p className="text-[#142D4A]/60">
                Entre com suas credenciais para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

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
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-[#4C99C2] focus:ring-[#4C99C2]"
                  />
                  <span className="text-sm text-[#142D4A]/70">Lembrar-me</span>
                </label>
                <a href="#" className="text-sm text-[#4C99C2] hover:text-[#3A7A9A] font-semibold">
                  Esqueceu a senha?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#4C99C2] to-[#7CBD6A] text-white rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[#142D4A]/60">
                Não tem uma conta?{' '}
                <Link href="/register" className="text-[#4C99C2] hover:text-[#3A7A9A] font-semibold">
                  Criar conta
                </Link>
              </p>
            </div>

            {/* Divider */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-[#142D4A]/40">ou continue com</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Social Login */}
            <div className="mt-6 grid grid-cols-1 gap-4">
              <GoogleLoginButton fullWidth />
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
