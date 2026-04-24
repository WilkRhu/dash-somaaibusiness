# Integração de Super Admin com Estabelecimentos

Este documento descreve como integrar o fluxo de `super_admin` para gerenciar estabelecimentos pela API.

## Visão Geral

O sistema possui rotas exclusivas para `super_admin` em:

- `GET /admin/establishments`
- `GET /admin/establishments/:id`
- `PATCH /admin/establishments/:id`
- `DELETE /admin/establishments/:id`
- `POST /admin/establishments/:id/members`
- `GET /admin/establishments/:id/members`
- `POST /admin/establishments/:id/employees`
- `DELETE /admin/establishments/:id/members/:userId`
- `PATCH /admin/establishments/:id/members/:userId/role`
- `PATCH /admin/establishments/:id/members/:userId`
- `POST /admin/establishments/:id/logo`
- `PATCH /admin/establishments/:id/loyalty-settings`
- `GET /admin/establishments/:id/loyalty-settings`
- `GET /admin/establishments/:id/fiscal-config`
- `PATCH /admin/establishments/:id/fiscal-config`
- `PATCH /admin/establishments/:id/fiscal-settings`
- `POST /admin/establishments/:id/mercadopago/connect`
- `GET /admin/establishments/:id/mercadopago/integration`
- `DELETE /admin/establishments/:id/mercadopago/disconnect`
- `POST /admin/establishments/:id/mercadopago/payment-preference`
- `GET /admin/establishments/:id/mercadopago/payment/:paymentId`

## Autenticação

Todas as rotas usam:

- `Authorization: Bearer <token>`
- Usuário com role `super_admin`

Exemplo:

```http
Authorization: Bearer eyJhbGciOi...
```

## Formato de Resposta

As rotas seguem o padrão:

```json
{
  "success": true,
  "data": {}
}
```

Algumas rotas incluem `message`.

## Exemplos de Uso

### 1. Listar estabelecimentos

```http
GET /admin/establishments
```

Resposta:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Mercado Central",
      "cnpj": "12.345.678/0001-99",
      "isActive": true
    }
  ]
}
```

### 2. Atualizar dados do estabelecimento

```http
PATCH /admin/establishments/:id
Content-Type: application/json
```

Payload:

```json
{
  "name": "Novo nome",
  "phone": "(81) 99999-9999",
  "city": "Recife",
  "state": "PE"
}
```

### 3. Remover um membro

```http
DELETE /admin/establishments/:id/members/:userId
```

### 4. Criar funcionário

```http
POST /admin/establishments/:id/employees
Content-Type: application/json
```

Payload:

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "(81) 98888-8888",
  "roles": ["business_sales"]
}
```

Se a senha não for enviada, o backend gera uma senha temporária.

### 5. Atualizar logo

```http
POST /admin/establishments/:id/logo
Content-Type: multipart/form-data
```

Campo esperado:

- `logo`: arquivo `jpeg`, `jpg`, `png` ou `webp`

Limite:

- máximo de `5MB`

### 6. Configurar fidelidade

```http
PATCH /admin/establishments/:id/loyalty-settings
Content-Type: application/json
```

Payload:

```json
{
  "loyaltyEnabled": true,
  "loyaltyPointsPerReal": 0.1
}
```

### 7. Configurar fiscal

```http
PATCH /admin/establishments/:id/fiscal-config
Content-Type: application/json
```

Payload exemplo:

```json
{
  "inscricaoEstadual": "123456789",
  "inscricaoMunicipal": "987654321",
  "regimeTributario": "1",
  "cnae": "4711301",
  "crt": "1",
  "autoIssueFiscalNote": true,
  "fiscalProvider": "focus_nfe",
  "fiscalEnvironment": "homologation"
}
```

### 8. Conectar Mercado Pago

```http
POST /admin/establishments/:id/mercadopago/connect
Content-Type: application/json
```

Payload:

```json
{
  "accessToken": "APP_USR-...",
  "publicKey": "APP_USR-..."
}
```

## Regras Importantes

- As rotas são exclusivas para `super_admin`.
- A lógica de serviço foi ajustada para aceitar bypass controlado com `force = true`.
- O `super_admin` agora pode usar essas rotas sem depender de membership real no estabelecimento.
- As rotas de `admin/*` existentes continuam funcionando para `admin` e `super_admin`.

## Casos de Uso Recomendados

Use essas rotas quando precisar:

- corrigir dados de um estabelecimento manualmente
- ajustar membros e permissões
- ativar ou remover integrações
- configurar fiscal e fidelidade
- auditar ou intervir em um estabelecimento específico

## Observações de Segurança

- Essas rotas devem ficar restritas ao backend autenticado.
- Idealmente, registre auditoria das ações executadas por `super_admin`.
- Para produção, evite expor essas ações em fluxos públicos ou sem logs.

## Arquivos Relacionados

- [`src/modules/business/establishments/controllers/super-admin-establishments.controller.ts`](/home/wilk/Documentos/workspace/somaaibackend/src/modules/business/establishments/controllers/super-admin-establishments.controller.ts)
- [`src/modules/business/establishments/establishments.service.ts`](/home/wilk/Documentos/workspace/somaaibackend/src/modules/business/establishments/establishments.service.ts)
- [`src/modules/business/establishments/establishments.module.ts`](/home/wilk/Documentos/workspace/somaaibackend/src/modules/business/establishments/establishments.module.ts)
