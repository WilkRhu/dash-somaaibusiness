# SomaAI Business - Integração de Autenticação

## 🔐 Rotas de Autenticação (Backend)

O SomaAI Business usa o mesmo sistema de autenticação do Consumer, mas com roles específicas.

### Endpoints Disponíveis

```
POST /api/auth/register          # Registro de novo usuário
POST /api/auth/login             # Login
POST /api/auth/refresh           # Refresh token
POST /api/auth/forgot-password   # Recuperar senha
POST /api/auth/reset-password    # Resetar senha
GET  /api/auth/me                # Dados do usuário logado
```

## 📝 Fluxo de Autenticação

### 1. Registro (Register)

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@empresa.com",
  "password": "senha123",
  "phone": "+5511999999999",
   "userType": "business"  // ← NOVO: "consumer" ou "business"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@empresa.com",
    "role": "user",
    "isActive": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here"
}
```

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "joao@empresa.com",
  "password": "senha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@empresa.com",
    "role": "user",
    "isActive": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here"
}
```

### 3. Obter Dados do Usuário

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@empresa.com",
  "role": "user",
  "phone": "+5511999999999",
  "isActive": true,
  "establishments": [
    {
      "id": "establishment_uuid",
      "name": "Mercado do João",
      "role": "business_owner"
    }
  ]
}
```

## 🎨 Implementação no Frontend (Next.js)

### 1. Configurar Variáveis de Ambiente

Crie `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=seu_secret_aqui_gere_com_openssl
```

### 2. Criar API Client com Auth

**`lib/api/auth.ts`**

```typescript
import apiClient from './client';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  };
  token: string;
  refreshToken: string;
}

export const authApi = {
  // Registro
  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', dto);
    return data;
  },

  // Login
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', dto);
    return data;
  },

  // Obter dados do usuário
  me: async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  // Logout (limpar tokens)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
};
```

### 3. Criar Store de Autenticação (Zustand)

**`lib/stores/auth-store.ts`**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, AuthResponse } from '@/lib/api/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({ email, password });
          
          // Salvar token no localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (name, email, password, phone) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register({ name, email, password, phone });
          
          // Salvar token no localStorage
          localStorage.setItem('token', response.token);
          localStorage.setItem('refreshToken', response.refreshToken);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        authApi.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      loadUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        try {
          const user = await authApi.me();
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          // Token inválido, fazer logout
          authApi.logout();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### 4. Página de Login

**`app/(auth)/login/page.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">SomaAI Business</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

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

            <div className="text-center text-sm">
              <Link href="/forgot-password" className="text-blue-600 hover:underline">
                Esqueceu sua senha?
              </Link>
            </div>

            <div className="text-center text-sm">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-blue-600 hover:underline">
                Cadastre-se
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 5. Página de Registro

**`app/(auth)/register/page.tsx`**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, formData.phone);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para criar sua conta no SomaAI Business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="João Silva"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone (opcional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+55 11 99999-9999"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>

            <div className="text-center text-sm">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Faça login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 6. Middleware de Proteção de Rotas

**`middleware.ts`** (na raiz do projeto)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');

  // Se está tentando acessar dashboard sem token, redireciona para login
  if (isDashboard && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se está logado e tenta acessar login/register, redireciona para dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
```

### 7. Layout com Verificação de Auth

**`app/(dashboard)/layout.tsx`**

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

## 🧪 Testando a Integração

### 1. Testar Registro

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@teste.com",
    "password": "senha123",
    "phone": "+5511999999999"
  }'
```

### 2. Testar Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@teste.com",
    "password": "senha123"
  }'
```

### 3. Testar Rota Protegida

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🔄 Fluxo Completo

1. **Usuário acessa `/register`**
2. **Preenche formulário e envia**
3. **Backend cria usuário e retorna token**
4. **Frontend salva token no localStorage e Zustand**
5. **Redireciona para `/dashboard`**
6. **Todas as requisições incluem o token no header**
7. **Ao fazer logout, limpa token e redireciona para `/login`**

## 🚨 Tratamento de Erros

```typescript
// lib/api/client.ts - Adicionar interceptor de erro
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## ✅ Checklist de Integração

- [ ] Backend rodando em `http://localhost:3000`
- [ ] Frontend rodando em `http://localhost:3001`
- [ ] Variáveis de ambiente configuradas
- [ ] CORS habilitado no backend
- [ ] Página de login criada
- [ ] Página de registro criada
- [ ] Store de autenticação configurado
- [ ] Middleware de proteção de rotas
- [ ] Interceptor de token no axios
- [ ] Tratamento de erros 401

---

**Pronto para conectar frontend e backend!** 🚀
