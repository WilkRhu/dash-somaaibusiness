# Modal de Adicionar Produto - Inventário

## Visão Geral
Modal para adicionar novos produtos ao inventário de um estabelecimento. Permite cadastro completo de informações do produto, incluindo preços, estoque e categorias.

## Funcionalidades

### 1. Campos do Formulário

#### **Informações Básicas**
- **Nome do Produto** (obrigatório)
  - Tipo: Texto
  - Validação: 3-255 caracteres
  - Placeholder: "Ex: Arroz Integral 5kg"

- **Código de Barras** (opcional)
  - Tipo: Texto
  - Máximo: 50 caracteres
  - Placeholder: "7891234567890"
  - Máscara: Apenas números

- **Categoria** (opcional)
  - Tipo: Select/Dropdown
  - Opções: Lista de categorias existentes + "Nova categoria"
  - Permite criar nova categoria dinamicamente

- **Marca** (opcional)
  - Tipo: Texto
  - Máximo: 100 caracteres
  - Placeholder: "Ex: Tio João"

#### **Preços**
- **Preço de Custo** (obrigatório)
  - Tipo: Currency (BRL)
  - Validação: >= 0
  - Máscara: R$ 0,00
  - Placeholder: "R$ 0,00"

- **Preço de Venda** (obrigatório)
  - Tipo: Currency (BRL)
  - Validação: >= 0
  - Máscara: R$ 0,00
  - Placeholder: "R$ 0,00"
  - Validação adicional: Deve ser >= preço de custo

#### **Estoque**
- **Quantidade** (obrigatório)
  - Tipo: Número
  - Validação: >= 0
  - Placeholder: "0"
  - Unidade: Vinculada ao campo "Unidade"

- **Estoque Mínimo** (obrigatório)
  - Tipo: Número
  - Validação: >= 0
  - Placeholder: "0"
  - Finalidade: Define limite para alertas de estoque baixo

- **Unidade de Medida** (obrigatório)
  - Tipo: Select
  - Opções: 
    - **"un" (unidade)**: Produto vendido por unidade (ex: 1, 2, 3)
    - **"kg" (quilograma)**: Produto vendido por peso (ex: 2.5kg, 1.2kg)
    - **"g" (grama)**: Produto vendido por peso em gramas (ex: 350g, 500g)
    - **"l" (litro)**: Produto vendido por volume em litros (ex: 1.5L, 2L)
    - **"ml" (mililitro)**: Produto vendido por volume em mililitros (ex: 350ml, 500ml)
    - **"cx" (caixa)**: Produto vendido por caixa (ex: 1 caixa, 2 caixas)
    - **"pct" (pacote)**: Produto vendido por pacote (ex: 1 pacote, 3 pacotes)
    - **"m" (metro)**: Produto vendido por metro (ex: 2.5m, 3m)
  - Valor padrão: "un"
  - **Comportamento especial**: Para unidades de peso/volume (kg, g, l, ml, m), o PDV permitirá vender quantidades variáveis (ex: 2.5kg, 350ml, 1.2m)

#### **Informações Adicionais**
- **Data de Validade** (opcional)
  - Tipo: Date picker
  - Formato: DD/MM/YYYY
  - Validação: Data futura (>= hoje)

- **Imagem do Produto** (opcional)
  - Tipo: File upload
  - Formatos aceitos: JPG, PNG, GIF, WebP
  - Tamanho máximo: 5MB
  - Preview: Exibe miniatura após upload
  - Opção de remover imagem

- **Descrição** (opcional)
  - Tipo: Textarea
  - Máximo: 500 caracteres
  - Placeholder: "Descrição detalhada do produto..."
  - Contador de caracteres

### 2. Validações

#### **Validações em Tempo Real**
- Campos obrigatórios destacados se vazios
- Preço de venda >= preço de custo
- Quantidade e estoque mínimo >= 0
- Data de validade >= data atual
- Formato correto de código de barras (apenas números)

#### **Validações no Submit**
- Todos os campos obrigatórios preenchidos
- Preços válidos
- Quantidades válidas
- Imagem dentro dos limites de tamanho

### 3. Comportamentos Especiais

#### **Cálculo Automático**
- **Margem de Lucro**: Calculada automaticamente baseada em:
  ```
  margem = ((precoVenda - precoCusto) / precoCusto) * 100
  ```
  Exibida como porcentagem ao lado dos preços

- **Cálculo de Custo por Unidade de Medida**: Para produtos comprados em lote/fardo
  - **Campo adicional**: "Comprei em lote/fardo?"
    - Tipo: Checkbox
    - Quando marcado, exibe campos adicionais:
      - **Quantidade Total do Lote**: Número (ex: 50kg, 100 unidades)
      - **Preço Total do Lote**: Currency (BRL)
    - **Cálculo automático**:
      ```
      custoPorUnidade = precoTotalLote / quantidadeTotalLote
      ```
    - O custo por unidade é preenchido automaticamente no campo "Preço de Custo"

#### **Gestão de Categorias**
- Dropdown de categorias com busca
- Opção "Nova categoria" abre campo de texto
- Categorias criadas são salvas para uso futuro
- Validação de categoria duplicada

#### **Produtos Vendidos por Peso/Volume**
- **Indicador visual**: Para unidades kg, g, l, ml, m, exibe badge "Vendido por peso/volume"
- **Comportamento no PDV**: Permite vender quantidades variáveis (ex: 2.5kg, 350ml, 1.2m)
- **Validação especial**: Para produtos por peso/volume, a quantidade pode ser decimal
- **Conversão automática**: Se unidade for "kg" e usuário digitar em gramas, converte automaticamente (ex: 1500g → 1.5kg)

#### **Upload de Imagem**
- Drag & drop ou clique para selecionar
- Preview com miniatura
- Validação de formato e tamanho
- Botão para remover imagem
- Progresso de upload (se aplicável)

### 4. Estados do Modal

#### **Estados de Carregamento**
- **Carregando categorias**: Ao abrir o modal
- **Enviando dados**: Durante submit
- **Upload de imagem**: Durante upload de arquivo

#### **Estados de Erro**
- **Erro de validação**: Campos inválidos destacados
- **Erro de servidor**: Mensagem de erro específica
- **Erro de upload**: Formato/tamanho inválido

### 5. Ações do Usuário

#### **Botões**
- **Cancelar**: Fecha o modal sem salvar
- **Salvar**: Valida e envia os dados
  - Desabilitado durante envio
  - Exibe spinner durante processamento

#### **Atalhos de Teclado**
- **ESC**: Fecha o modal
- **Enter**: Submete o formulário (se válido)
- **Tab**: Navegação entre campos

### 6. Feedback ao Usuário

#### **Mensagens de Sucesso**
- "Produto adicionado com sucesso!"
- Redirecionamento automático ou atualização da lista

#### **Mensagens de Erro**
- Específicas por campo (ex: "Preço de venda deve ser maior que preço de custo")
- Gerais (ex: "Erro ao conectar com o servidor")

#### **Indicadores Visuais**
- Campos obrigatórios com asterisco (*)
- Campos inválidos com borda vermelha
- Mensagens de ajuda abaixo dos campos
- Contadores de caracteres

### 7. Integração com API

#### **Endpoint**
```
POST /api/business/establishments/:establishmentId/inventory
```

#### **Payload Enviado**
```typescript
{
  barcode?: string,
  name: string,
  category?: string,
  brand?: string,
  costPrice: number,
  salePrice: number,
  quantity: number,
  minQuantity: number,
  unit: string,
  expirationDate?: string, // ISO format
  image?: string, // URL or base64
  description?: string
}
```

#### **Headers**
```
Authorization: Bearer <token>
Content-Type: application/json
```

### 8. Design e Layout

#### **Estrutura do Modal**
- **Cabeçalho**: "Adicionar Produto" + botão fechar
- **Corpo**: Formulário em 2 colunas (responsivo)
- **Rodapé**: Botões Cancelar e Salvar

#### **Organização dos Campos**
**Coluna 1 (Informações Básicas):**
- Nome do Produto
- Código de Barras
- Categoria
- Marca

**Coluna 2 (Preços e Estoque):**
- Preço de Custo
  - Checkbox "Comprei em lote/fardo?" (exibe campos adicionais)
  - Se marcado: Quantidade Total do Lote + Preço Total do Lote
  - Custo por unidade calculado automaticamente
- Preço de Venda (com margem calculada)
- Quantidade + Unidade
  - Badge "Vendido por peso/volume" para kg, g, l, ml, m
- Estoque Mínimo

**Seção Inferior (Informações Adicionais):**
- Data de Validade
- Imagem do Produto
- Descrição

#### **Responsividade**
- 2 colunas em desktop
- 1 coluna em mobile
- Campos reorganizados para melhor fluxo
- Tamanhos de fonte ajustados

### 9. Acessibilidade

#### **ARIA Labels**
- Labels descritivos para todos os campos
- Mensagens de erro com `aria-live="polite"`
- Botões com textos significativos

#### **Navegação por Teclado**
- Foco gerenciado corretamente
- Trap de foco dentro do modal
- Atalhos claros

#### **Contraste e Legibilidade**
- Cores com contraste adequado
- Tamanhos de fonte acessíveis
- Espaçamento suficiente entre elementos

### 10. Considerações Técnicas

#### **Performance**
- Lazy loading de categorias
- Debounce para validações em tempo real
- Otimização de re-renders

#### **Segurança**
- Sanitização de inputs
- Validação no frontend e backend
- Proteção contra XSS

#### **Testes**
- Testes unitários para validações
- Testes de integração com API
- Testes de acessibilidade

---

## Exemplo de Uso

```typescript
// Abrindo o modal
<AddProductModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  establishmentId="bad24a28-e8b8-4660-a7d3-13dfe0acdff0"
  onSuccess={(product) => {
    // Atualizar lista de produtos
    refreshInventory();
    // Fechar modal
    setIsModalOpen(false);
  }}
/>
```

## Próximas Melhorias

1. **Importação em massa** via CSV/Excel
2. **Leitor de código de barras** via câmera
3. **Sugestões automáticas** baseadas em produtos similares
4. **Integração com fornecedores** para auto-complete de marcas
5. **Histórico de preços** visualização gráfica
6. **Alertas configuráveis** para estoque mínimo
7. **Multi-idioma** suporte a localização
8. **Templates de produtos** para cadastro rápido

### 11. Funcionalidades Específicas de Peso/Volume

#### **Produtos Vendidos por Peso/Volume**
- **Unidades suportadas**:
  - **Peso**: kg (quilograma), g (grama)
  - **Volume**: l (litro), ml (mililitro)
  - **Comprimento**: m (metro)
  - **Embalagem**: cx (caixa), pct (pacote)
  - **Unidade**: un (unidade)

#### **Comportamento no PDV (Ponto de Venda)**
- Para unidades de peso/volume (kg, g, l, ml, m):
  - PDV permite vender quantidades fracionadas (ex: 2.5kg, 350ml, 1.5m)
  - Cálculo automático do valor baseado no preço por unidade
  - Conversão automática de unidades (ex: 1500g → 1.5kg)

#### **Cálculo de Custo por Lote/Fardo**
- **Opção "Comprei em lote/fardo"**:
  - Ativa campos adicionais:
    - Quantidade total do lote (ex: 50kg, 100 unidades)
    - Preço total do lote
  - Cálculo automático:
    ```
    Custo por unidade = Preço Total do Lote / Quantidade Total
    ```
  - Exemplo: Lote de 50kg por R$100,00
    - Custo por kg = R$100 / 50kg = R$2,00/kg

#### **Validações Específicas**
- Para unidades de peso/volume: aceita valores decimais (ex: 0.5kg, 1.25L)
- Para unidades contáveis (un, cx, pct): apenas valores inteiros
- Conversão automática de unidades (ex: 1500g → 1.5kg)
- Validação de unidade compatível com tipo de produto

#### **Exemplos de Uso**
1. **Arroz (kg)**: Produto vendido por peso, PDV permite vender 0.5kg, 1.2kg, etc.
2. **Leite (L)**: Vendido por litro, PDV permite 0.5L, 1.5L, etc.
3. **Tecido (m)**: Vendido por metro, PDV permite 0.75m, 1.5m, etc.
4. **Ovos (un)**: Vendido por unidade, apenas quantidades inteiras

#### **Cálculos Automáticos**
- **Preço por unidade de medida**:
  ```
  Preço por kg = Preço de venda / 1kg
  Preço por litro = Preço de venda / 1L
  ```
- **Cálculo no PDV**:
  ```
  Valor venda = Quantidade × Preço por unidade de medida
  ```
  Ex: 2.5kg × R$8,00/kg = R$20,00

#### **Benefícios**
1. **Flexibilidade no PDV**: Venda de quantidades fracionadas
2. **Precisão no custo**: Cálculo exato por unidade de medida
3. **Controle de estoque**: Controle preciso por grama/ml/cm
4. **Precisão no preço**: Cálculo exato baseado na quantidade vendida