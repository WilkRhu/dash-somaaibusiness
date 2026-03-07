'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';

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
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Controle de Estoque</h3>
                <p className="text-white/80">Gerencie produtos e alertas em tempo real</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">PDV Completo</h3>
                <p className="text-white/80">Ponto de venda integrado e eficiente</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📈</span>
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
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-[#4C99C2] hover:bg-[#4C99C2]/5 transition-all flex items-center justify-center gap-2 font-semibold text-[#142D4A]">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-[#4C99C2] hover:bg-[#4C99C2]/5 transition-all flex items-center justify-center gap-2 font-semibold text-[#142D4A]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                GitHub
              </button>
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
