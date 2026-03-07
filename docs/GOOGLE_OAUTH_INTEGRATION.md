# Google OAuth Integration

## Visão Geral

O SomaAI Business suporta autenticação com Google OAuth 2.0. A integração é **condicional** - funciona apenas quando as variáveis de ambiente `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` estão configuradas.

## Configuração no Google Cloud Console

### 1. Criar Projeto
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em "Select a Project" → "New Project"
3. Nomeie o projeto (ex: "SomaAI Business")
4. Clique em "Create"

### 2. Ativar Google OAuth API
1. Vá em "APIs & Services" → "Library"
2. Pesquise por "Google OAuth"
3. Selecione "Google OAuth 2.0 API"
4. Clique em "Enable"

### 3. Criar Credenciais OAuth
1. Vá em "APIs & Services" → "Credentials"
2. Clique em "Create Credentials" → "OAuth client ID"
3. Configure a tela de consentimento:
   - User Type: External
   - App name: SomaAI Business
   - User support email: seu@email.com
   - scopes: email, profile, openid
   - Save and Continue
4. Volte para "Create Credentials" → "OAuth client ID"
5. Application type: Web application
6. Name: SomaAI Business Web
7. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/google/callback` (desenvolvimento)
   - `https://api.seudominio.com/api/auth/google/callback` (produção)
8. Clique em "Create"
9. **Copie o Client ID e Client Secret**

## Configuração no Backend

### Variáveis de Ambiente (.env)

```env
# Google OAuth Configuration (Optional - leave empty to disable)
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Frontend URL (usado para redirect após login)
FRONTEND_URL=http://localhost:3001
```

### Verificar Status

```bash
GET /api/auth/google/status
```

Response:
```json
{
  "isEnabled": true,
  "clientIdConfigured": true
}
```

## Endpoints da API

### 1. Iniciar Login com Google

```bash
GET /api/auth/google
```

Response:
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "isEnabled": true
}
```

Redirect o usuário para `authUrl`.

### 2. Callback do Google

```bash
GET /api/auth/google/callback?code=AUTHORIZATION_CODE
```

O backend troca o code por tokens, cria/faz login do usuário e redirect para:
```
{FRONTEND_URL}/auth/callback?token={JWT_TOKEN}
```

### 3. Login com ID Token (Frontend)

```bash
POST /api/auth/google/login
Content-Type: application/json

{
  "idToken": "GOOGLE_ID_TOKEN",
  "userType": "business" // opcional
}
```

Response:
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@gmail.com",
      "avatar": "https://lh3.googleusercontent.com/...",
      "role": "user"
    }
  }
}
```

## Implementação no Frontend

### Instalação

```bash
npm install @react-oauth/google jwt-decode
```

### Componente de Login Google

```tsx
// components/GoogleLoginButton.tsx
'use client';

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api';

export default function GoogleLoginButton() {
  const router = useRouter();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const { data } = await apiClient.post('/auth/google/login', {
        idToken: credentialResponse.credential,
      });

      // Salvar token
      localStorage.setItem('token', data.data.access_token);
      
      // Redirect para dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleError = () => {
    console.error('Google login was cancelled or failed');
  };

  return (
    <GoogleOAuthProvider clientId="SEU_GOOGLE_CLIENT_ID">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
      />
    </GoogleOAuthProvider>
  );
}
```

### Página de Login com Google

```tsx
// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">SomaAI Business</CardTitle>
          <CardDescription>Entre com sua conta Google ou email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLoginButton />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Ou continue com email</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Callback Handler (Opcional)

Se usar redirect com code:

```tsx
// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const error = searchParams.get('error');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      router.push('/dashboard');
    } else if (error) {
      router.push(`/login?error=${error}`);
    } else {
      router.push('/login');
    }
  }, [token, error, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Autenticando...</p>
    </div>
  );
}
```

## Fluxo de Autenticação

### Fluxo 1: ID Token (Recomendado)
```
1. Usuário clica em "Entrar com Google"
2. Google mostra popup de consentimento
3. Frontend recebe ID Token
4. Frontend envia POST /api/auth/google/login com idToken
5. Backend verifica token, cria/faz login do usuário
6. Backend retorna JWT
7. Frontend salva token e redireciona para dashboard
```

### Fluxo 2: Redirect com Code
```
1. Frontend redireciona para GET /api/auth/google
2. Backend retorna URL do Google
3. Usuário é redirecionado para Google
4. Google redireciona para /api/auth/google/callback?code=XXX
5. Backend troca code por tokens, faz login
6. Backend redireciona para {FRONTEND_URL}/auth/callback?token=XXX
7. Frontend extrai token da URL e salva
8. Frontend redireciona para dashboard
```

## Tratamento de Erros

```typescript
// Exemplos de erros e como tratar

// Google OAuth não configurado
{
  "message": "Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env"
}

// Token inválido
{
  "message": "Invalid Google ID token"
}

// Email não verificado no Google
{
  "message": "Google email is not verified"
}

// Usuário cancelou login
// Redirect para: /login?error=google_cancelled
```

## Segurança

1. **Validação de ID Token**: O backend verifica o token diretamente com Google
2. **Email Verificado**: Apenas contas Google com email verificado são aceitas
3. **Senha Automática**: Usuários do Google recebem senha aleatória gerada
4. **Avatar Sync**: Avatar é atualizado automaticamente se mudar no Google

## Variáveis de Ambiente Resumo

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `GOOGLE_CLIENT_ID` | Client ID do Google Cloud Console | Sim (para habilitar) |
| `GOOGLE_CLIENT_SECRET` | Client Secret do Google Cloud Console | Sim (para habilitar) |
| `GOOGLE_CALLBACK_URL` | URL de callback | Não (padrão: localhost) |
| `FRONTEND_URL` | URL do frontend para redirect | Não |

## Checklist de Configuração

- [ ] Criar projeto no Google Cloud Console
- [ ] Ativar Google OAuth 2.0 API
- [ ] Configurar tela de consentimento OAuth
- [ ] Criar OAuth Client ID
- [ ] Adicionar URIs de redirect autorizados
- [ ] Copiar Client ID e Secret
- [ ] Adicionar variáveis ao .env
- [ ] Reiniciar backend
- [ ] Testar GET /api/auth/google/status
- [ ] Implementar botão de login no frontend
- [ ] Testar fluxo completo de autenticação

## Suporte

Dúvidas sobre configuração do Google OAuth: [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)