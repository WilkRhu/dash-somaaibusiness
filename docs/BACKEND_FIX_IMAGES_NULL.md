# 🐛 Bug: Imagens dos Produtos Ficando NULL no Banco

## Problema

As imagens dos produtos estão sendo salvas como `null` no banco de dados, especialmente após editar um produto ou atualizar o estoque.

## Causa Raiz

O backend está **sobrescrevendo** o campo `images` com `null` quando recebe um PATCH/PUT que não inclui esse campo.

## Comportamento Esperado vs Atual

### ❌ Comportamento Atual (Errado)

```typescript
// Backend recebe PATCH sem campo images
PATCH /inventory/123
{
  "name": "Produto Atualizado",
  "salePrice": 10.50
  // images não está no payload
}

// Backend faz:
UPDATE inventory SET 
  name = 'Produto Atualizado',
  salePrice = 10.50,
  images = NULL  // ← ERRO! Está zerando as imagens
WHERE id = 123
```

### ✅ Comportamento Esperado (Correto)

```typescript
// Backend recebe PATCH sem campo images
PATCH /inventory/123
{
  "name": "Produto Atualizado",
  "salePrice": 10.50
  // images não está no payload
}

// Backend deve fazer:
UPDATE inventory SET 
  name = 'Produto Atualizado',
  salePrice = 10.50
  // NÃO atualizar images se não veio no payload
WHERE id = 123
```

## Endpoints Afetados

### 1. PATCH `/business/establishments/:id/inventory/:itemId`

**Problema:** Está sobrescrevendo `images` com null quando o campo não vem no body.

**Solução Backend:**
```typescript
// ❌ ERRADO
async update(id: string, dto: UpdateProductDto) {
  return this.repository.update(id, dto); // Sobrescreve tudo
}

// ✅ CORRETO
async update(id: string, dto: UpdateProductDto) {
  // Remover campos undefined/null que não devem ser atualizados
  const updateData = { ...dto };
  
  // Nunca atualizar images via PATCH - elas têm endpoint próprio
  delete updateData.images;
  delete updateData.image;
  
  return this.repository.update(id, updateData);
}
```

### 2. POST `/business/establishments/:id/inventory/:itemId/stock`

**Problema:** Ao atualizar estoque, está retornando o produto sem o campo `images`.

**Solução Backend:**
```typescript
// ✅ CORRETO
async updateStock(itemId: string, dto: UpdateStockDto) {
  // Atualizar apenas a quantidade
  await this.updateQuantity(itemId, dto.quantity);
  
  // Retornar o produto COMPLETO com todas as imagens
  return this.repository.findOne({
    where: { id: itemId },
    // Garantir que images está sendo carregado
  });
}
```

## Regras para o Backend

### ✅ Regras de Ouro

1. **NUNCA sobrescrever `images` ou `image` em endpoints de UPDATE**
   - Esses campos têm endpoints dedicados para gerenciamento

2. **Sempre retornar o objeto COMPLETO após updates**
   - Incluir `images`, `image` e todos os campos

3. **Usar PATCH semântico correto**
   - Apenas atualizar campos que vieram no payload
   - Ignorar campos `undefined`

4. **Validar antes de salvar**
   - Se `images` vier como `null` ou `undefined`, não atualizar

## Exemplo de DTO Correto no Backend

```typescript
// update-product.dto.ts
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  salePrice?: number;

  @IsOptional()
  @IsNumber()
  costPrice?: number;

  // ... outros campos

  // ❌ NÃO permitir atualizar images via PATCH
  // images e image devem ser gerenciados apenas via endpoints dedicados:
  // POST /inventory/:id/images (upload)
  // DELETE /inventory/:id/images (delete)
}
```

## Endpoints Dedicados para Imagens

### Upload de Imagens
```
POST /business/establishments/:id/inventory/:itemId/images
Content-Type: multipart/form-data

Body: FormData com campo 'images'
```

### Deletar Imagem
```
DELETE /business/establishments/:id/inventory/:itemId/images
Body: { "imageUrl": "url-da-imagem" }
```

## Como o Frontend Está Enviando

### ✅ Ao Editar Produto

O frontend **NÃO envia** `images` no PATCH:

```typescript
// edit-product-form.tsx
const dataToSend: any = {};

// Adicionar apenas campos modificados
if (formData.name !== product.name) dataToSend.name = formData.name;
if (formData.salePrice !== product.salePrice) dataToSend.salePrice = formData.salePrice;

// NUNCA enviar image ou images no update
// Eles são gerenciados separadamente

await onSubmit(dataToSend);
```

### ✅ Ao Adicionar Produto

O frontend envia `images` como array de base64:

```typescript
// add-product-form.tsx
const productData = {
  ...data,
  images: imagesBase64.length > 0 ? imagesBase64 : undefined,
};

await addProduct(productData);
```

## Teste para Validar a Correção

1. Criar um produto com imagens
2. Verificar que as imagens aparecem
3. Editar o nome do produto (sem tocar nas imagens)
4. Verificar que as imagens ainda estão lá ✅
5. Atualizar o estoque do produto
6. Verificar que as imagens ainda estão lá ✅

## SQL para Verificar o Problema

```sql
-- Ver produtos com images NULL que deveriam ter imagens
SELECT id, name, images, image, created_at, updated_at
FROM inventory_items
WHERE images IS NULL 
  AND image IS NULL
ORDER BY updated_at DESC;

-- Ver histórico de updates (se tiver audit log)
SELECT * FROM audit_log 
WHERE table_name = 'inventory_items' 
  AND column_name IN ('images', 'image')
ORDER BY created_at DESC;
```

## Resumo

O problema **NÃO é no frontend**. O frontend está:
- ✅ Enviando imagens corretamente ao criar produtos
- ✅ NÃO enviando `images` ao editar produtos
- ✅ Usando endpoints dedicados para gerenciar imagens

O problema **É no backend**:
- ❌ Está sobrescrevendo `images` com null em PATCH
- ❌ Não está preservando campos que não vieram no payload
- ❌ Pode estar retornando objetos incompletos após updates

**Ação necessária:** Backend precisa implementar PATCH semântico correto e nunca sobrescrever `images` quando o campo não vier no payload.
