# Análise: Fluxo de Scan SomaAI Business - Validação de Estabelecimento

## 🔴 PROBLEMA IDENTIFICADO

O fluxo de scan do SomaAI Business **NÃO contempla validação de estabelecimento** quando o app mobile envia a informação do produto para o PDV via websocket.

---

## 📊 Fluxo Atual (Sem Validação)

```
App Mobile (Scan)
    ↓
    └─→ WebSocket: emit('scan', { barcode, timestamp, userId })
            ↓
            └─→ ScannerGateway.handleScan()
                    ↓
                    └─→ ScannerService.findProductByBarcode(barcode)
                            ↓
                            └─→ ProductRepository.findByBarcode(barcode)
                                    ↓
                                    └─→ Query InventoryItem WHERE barcode = ?
                                            ↓
                                            └─→ Retorna produto (SEM VALIDAR ESTABELECIMENTO)
                    ↓
                    └─→ Emite 'scan-result' para TODOS os dashboards
                            └─→ this.server.to('dashboard').emit('scan-result', result)
```

---

## 🚨 Problemas de Segurança

### 1. **Sem Validação de Estabelecimento no Scan**
- `ScannerGateway.handleScan()` não recebe `establishmentId`
- `ProductRepository.findByBarcode()` busca produto em qualquer estabelecimento
- Qualquer app mobile pode escanear produtos de qualquer estabelecimento

**Código problemático:**
```typescript
// scanner.gateway.ts - handleScan
async handleScan(
  @ConnectedSocket() client: Socket,
  @MessageBody() data: { barcode: string; timestamp: string; userId?: string },
) {
  // ❌ Não há validação de estabelecimento
  const product = await this.scannerService.findProductByBarcode(data.barcode);
  
  // ❌ Envia para TODOS os dashboards, sem filtrar por estabelecimento
  this.server.to('dashboard').emit('scan-result', result);
}
```

### 2. **Sem Validação de Estabelecimento no Produto**
- `ProductRepository.findByBarcode()` busca em `InventoryItem` sem filtro de `establishmentId`

**Código problemático:**
```typescript
// product.repository.ts - findByBarcode
async findByBarcode(barcode: string): Promise<ProductData | null> {
  const result = await this.dataSource
    .getRepository(InventoryItem)
    .createQueryBuilder('item')
    .where('item.barcode = :barcode', { barcode })
    // ❌ Sem WHERE item.establishmentId = ?
    .select('item.name', 'normalizedName')
    .getRawOne();
}
```

### 3. **Broadcast para Todos os Dashboards**
- Todos os PDVs conectados recebem o scan, independente do estabelecimento
- Não há isolamento de dados por estabelecimento

**Código problemático:**
```typescript
// scanner.gateway.ts - handleScan
this.server.to('dashboard').emit('scan-result', result);
// ❌ Envia para TODOS os dashboards, sem filtrar por estabelecimento
```

---

## ✅ Solução Recomendada

### 1. **Adicionar establishmentId ao Handshake do WebSocket**

```typescript
// scanner.gateway.ts - handleConnection
async handleConnection(client: Socket) {
  const { deviceId, type, userId, establishmentId } = client.handshake.query;
  
  // ✅ Validar que o usuário pertence ao estabelecimento
  if (type === 'mobile' && establishmentId) {
    const member = await this.establishmentsService.getMember(
      establishmentId,
      userId,
    );
    if (!member) {
      client.disconnect();
      return;
    }
    client.data.establishmentId = establishmentId;
  }
  
  // Entrar em sala específica do estabelecimento
  const establishmentRoom = `establishment-${establishmentId}`;
  client.join(establishmentRoom);
}
```

### 2. **Validar Estabelecimento no Scan**

```typescript
// scanner.gateway.ts - handleScan
@SubscribeMessage('scan')
async handleScan(
  @ConnectedSocket() client: Socket,
  @MessageBody() data: { barcode: string; timestamp: string; userId?: string },
) {
  const establishmentId = client.data.establishmentId;
  
  if (!establishmentId) {
    client.emit('scan-error', { message: 'Estabelecimento não informado' });
    return;
  }
  
  // ✅ Buscar produto apenas do estabelecimento
  const product = await this.scannerService.findProductByBarcode(
    data.barcode,
    establishmentId,
  );
  
  // ✅ Emitir apenas para dashboards do mesmo estabelecimento
  const establishmentRoom = `establishment-${establishmentId}`;
  this.server.to(establishmentRoom).emit('scan-result', result);
}
```

### 3. **Filtrar por Estabelecimento no Repository**

```typescript
// product.repository.ts - findByBarcode
async findByBarcode(
  barcode: string,
  establishmentId: string,
): Promise<ProductData | null> {
  const result = await this.dataSource
    .getRepository(InventoryItem)
    .createQueryBuilder('item')
    .where('item.barcode = :barcode', { barcode })
    .andWhere('item.establishmentId = :establishmentId', { establishmentId })
    // ✅ Filtrar por estabelecimento
    .select('item.name', 'normalizedName')
    .getRawOne();
}
```

### 4. **Atualizar ScannerService**

```typescript
// scanner.service.ts
async findProductByBarcode(barcode: string, establishmentId: string) {
  return this.productService.findByBarcode(barcode, establishmentId);
}
```

---

## 📋 Checklist de Implementação

- [ ] Adicionar `establishmentId` ao handshake do WebSocket
- [ ] Validar membership do usuário ao conectar
- [ ] Criar rooms por estabelecimento (`establishment-{id}`)
- [ ] Atualizar `handleScan()` para validar `establishmentId`
- [ ] Atualizar `ProductRepository.findByBarcode()` para filtrar por `establishmentId`
- [ ] Atualizar `ScannerService.findProductByBarcode()` para passar `establishmentId`
- [ ] Atualizar `SalesService` para usar o novo fluxo
- [ ] Testar isolamento de dados entre estabelecimentos
- [ ] Adicionar testes de segurança

---

## 🔒 Impacto de Segurança

**Severidade:** 🔴 **ALTA**

- Qualquer usuário pode escanear produtos de qualquer estabelecimento
- Dados de produtos são expostos sem validação
- Possível vazamento de informações entre estabelecimentos
- Violação de isolamento de dados multi-tenant

---

## 📝 Arquivos Afetados

1. `src/modules/scanner/scanner.gateway.ts` - Adicionar validação
2. `src/modules/scanner/scanner.service.ts` - Passar establishmentId
3. `src/modules/products/repositories/product.repository.ts` - Filtrar por estabelecimento
4. `src/modules/products/services/product.service.ts` - Passar establishmentId
5. `src/modules/business/sales/sales.service.ts` - Usar novo fluxo

