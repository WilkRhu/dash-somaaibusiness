# Guia de Permissões e Controle de Acesso

## Visão Geral

O sistema implementa controle de acesso baseado em cargos (RBAC - Role-Based Access Control). Cada funcionário tem um cargo que define quais áreas e funcionalidades ele pode acessar.

## Como Funciona

### 1. Cargos Disponíveis

```typescript
enum BusinessRole {
  OWNER = 'business_owner',        // Proprietário
  ADMIN = 'business_admin',        // Administrador
  SALES = 'business_sales',        // Vendedor
  STOCK = 'business_stock',        // Es