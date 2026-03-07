'use client';

import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/auth-store';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: () => void;
  buttonText?: string;
  fullWidth?: boolean;
}

function GoogleLoginContent({ 
  onSuccess, 
  onError,
  buttonText = 'Entrar com Google',
  fullWidth = false
}: GoogleLoginButtonProps) {
  const { setUser } = useAuthStore();
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (credentialResponse: any) => {
      try {
        console.log('🔐 Google login iniciado...');
        const { data } = await apiClient.post('/auth/google/login', {
          idToken: credentialResponse.credential,
        });

        console.log('✅ Google login bem-sucedido:', data);

        const authData = data.data;
        if (authData.access_token) {
          localStorage.setItem('token', authData.access_token);
          if (authData.refresh_token) {
            localStorage.setItem('refreshToken', authData.refresh_token);
          }
          setUser(authData.user, authData.access_token);
        }

        onSuccess?.();
        router.push('/home');
      } catch (error: any) {
        console.error('❌ Erro no Google login:', error);
        const errorMessage = error.response?.data?.message || 'Erro ao fazer login com Google';
        alert(errorMessage);
        onError?.();
      }
    },
    onError: () => {
      console.error('Google login cancelado ou falhou');
      onError?.();
    },
  });

  return (
    <button
      onClick={() => login()}
      className={`px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-[#4C99C2] hover:bg-[#4C99C2]/5 transition-all flex items-center justify-center gap-3 font-semibold text-[#142D4A] ${fullWidth ? 'w-full' : ''}`}
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      {buttonText}
    </button>
  );
}

export default function GoogleLoginButton(props: GoogleLoginButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  if (!clientId) {
    return (
      <button
        disabled
        className={`px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center gap-2 font-semibold ${props.fullWidth ? 'w-full' : ''}`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Google OAuth não configurado
      </button>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLoginContent {...props} />
    </GoogleOAuthProvider>
  );
}