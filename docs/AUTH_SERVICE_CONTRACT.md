# Contrato de API - Auth Service

## Informações Gerais

- **Base URL**: `http://localhost:3000/api/auth`
- **Versão**: 1.0.0
- **Autenticação**: JWT Bearer Token (onde indicado)
- **Content-Type**: `application/json`

---

## Endpoints

### 1. Registro de Usuário

**POST** `/api/auth/register`

Registra um novo usuário no sistema.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+55 11 99999-9999"
}
```

**Campos:**
| Campo | Tipo | Obrigatório | Descrição | Validação |
|-------|------|-------------|-----------|-----------|
| email | string | Sim | Email do usuário | Formato de email válido |
| password | string | Sim | Senha do usuário | Mínimo 6 caracteres |
| firstName | string | Sim | Primeiro nome | - |
| lastName | string | Sim | Sobrenome | - |
| phone | string | Não | Telefone | - |

#### Response

**Status: 201 Created**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true
  }
}
```

**Status: 400 Bad Request**

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password must be longer than or equal to 6 characters"],
  "error": "Bad Request"
}
```

---

### 2. Login

**POST** `/api/auth/login`

Autentica um usuário com email e senha.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Campos:**
| Campo | Tipo | Obrigatório | Descrição | Validação |
|-------|------|-------------|-----------|-----------|
| email | string | Sim | Email do usuário | Formato de email válido |
| password | string | Sim | Senha do usuário | Mínimo 6 caracteres |

#### Response

**Status: 200 OK**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true
  }
}
```

**Status: 401 Unauthorized**

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

---

### 3. Login com Google

**POST** `/api/auth/google`

Autentica ou registra um usuário usando Google OAuth.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ...",
  "email": "user@gmail.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://lh3.googleusercontent.com/...",
  "role": "USER"
}
```

**Campos:**
| Campo | Tipo | Obrigatório | Descrição | Validação |
|-------|------|-------------|-----------|-----------|
| idToken | string | Sim | Token ID do Google | - |
| email | string | Sim | Email do Google | Formato de email válido |
| firstName | string | Sim | Primeiro nome | - |
| lastName | string | Sim | Sobrenome | - |
| avatar | string | Não | URL da foto de perfil | - |
| role | string | Não | Papel do usuário (USER ou BUSINESS_OWNER) | - |

#### Response

**Status: 200 OK**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@gmail.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true
  }
}
```

**Status: 400 Bad Request**

```json
{
  "statusCode": 400,
  "message": "Invalid Google token",
  "error": "Bad Request"
}
```

---

### 4. Refresh Token

**POST** `/api/auth/refresh`

Renova o access token usando um refresh token válido.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Campos:**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| refreshToken | string | Sim | Refresh token válido |

#### Response

**Status: 200 OK**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isActive": true
  }
}
```

**Status: 401 Unauthorized**

```json
{
  "statusCode": 401,
  "message": "Invalid refresh token",
  "error": "Unauthorized"
}
```

---

### 5. Obter Usuário Atual

**GET** `/api/auth/me`

Retorna as informações do usuário autenticado.

#### Request

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response

**Status: 200 OK**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true
}
```

**Status: 401 Unauthorized**

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

---

### 6. Verificar Token

**POST** `/api/auth/verify-token`

Verifica se o token JWT é válido.

#### Request

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response

**Status: 200 OK**

```json
{
  "valid": true,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com"
  }
}
```

**Status: 401 Unauthorized**

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

---

## Modelos de Dados

### User

```typescript
{
  id: string;           // UUID
  email: string;        // Email único
  firstName: string;    // Primeiro nome
  lastName: string;     // Sobrenome
  isActive: boolean;    // Status ativo/inativo
}
```

### AuthResponse

```typescript
{
  accessToken: string;   // JWT access token (expira em 1h)
  refreshToken: string;  // JWT refresh token (expira em 7d)
  user: User;           // Dados do usuário
}
```

---

## Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Não autenticado ou token inválido |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro no servidor |

---

## Autenticação JWT

### Access Token
- **Duração**: 1 hora
- **Uso**: Incluir no header `Authorization: Bearer <token>`
- **Payload**:
```json
{
  "sub": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Refresh Token
- **Duração**: 7 dias
- **Uso**: Enviar no body de `/api/auth/refresh`
- **Propósito**: Renovar access token sem fazer login novamente

---

## Exemplos de Uso

### Exemplo 1: Registro e Login

```bash
# 1. Registrar novo usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secret123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# 2. Fazer login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secret123"
  }'
```

### Exemplo 2: Usar Token

```bash
# 1. Obter informações do usuário
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Verificar token
curl -X POST http://localhost:3000/api/auth/verify-token \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Exemplo 3: Renovar Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

---

## Tratamento de Erros

Todos os erros seguem o formato padrão do NestJS:

```json
{
  "statusCode": 400,
  "message": "Descrição do erro ou array de erros de validação",
  "error": "Nome do erro HTTP"
}
```

### Erros Comuns

| Erro | Status | Causa |
|------|--------|-------|
| Email já existe | 400 | Tentativa de registrar email duplicado |
| Credenciais inválidas | 401 | Email ou senha incorretos |
| Token inválido | 401 | JWT expirado ou malformado |
| Token do Google inválido | 400 | ID token do Google inválido |
| Validação falhou | 400 | Campos obrigatórios ausentes ou inválidos |

---

## Notas Importantes

1. **Segurança**:
   - Senhas são hasheadas com bcrypt
   - Tokens JWT são assinados com chave secreta
   - Refresh tokens são armazenados de forma segura

2. **Validação**:
   - Todos os campos são validados usando class-validator
   - Emails devem ser únicos no sistema
   - Senhas devem ter no mínimo 6 caracteres

3. **Google OAuth**:
   - Requer configuração de credenciais do Google Cloud
   - ID token deve ser obtido no frontend usando Google Sign-In
   - Usuários Google são criados automaticamente se não existirem

4. **Tokens**:
   - Access tokens expiram em 1 hora
   - Refresh tokens expiram em 7 dias
   - Use refresh token para renovar sem fazer login novamente

---

## Documentação Swagger

Acesse a documentação interativa em:
```
http://localhost:3000/api/docs
```

A documentação Swagger permite testar todos os endpoints diretamente no navegador.
