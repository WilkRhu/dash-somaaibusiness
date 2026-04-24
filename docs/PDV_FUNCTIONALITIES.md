# PDV (Ponto de Venda) - Funcionalidades e Interação

## Visão Geral
Sistema de PDV completo para estabelecimentos comerciais, com suporte online/offline, vendas por peso/volume, ofertas, e integração com inventário.

## Funcionalidades Principais

### 1. **Interface do PDV**

#### **Layout Principal**
- **Lado Esquerdo**: Produtos e lista de itens da venda
- **Lado Direito**: Carrinho, total e botões de ação
- **Modo tela cheia** (F11) para melhor experiência

#### **Status Indicators**
- **Caixa Livre**: Indicador verde quando não há itens no carrinho
- **Offline**: Indicador vermelho com contagem de vendas pendentes
- **Ofertas ativas**: Badge laranja em produtos com desconto

### 2. **Adição de Produtos**

#### **Múltiplas Formas de Adicionar**
1. **Código de Barras**
   - Campo dedicado com foco automático
   - Busca automática no inventário
   - Feedback sonoro/visual

2. **Busca por Nome/Código**
   - Campo de busca em tempo real
   - Filtra produtos enquanto digita
   - Exibe até 50 produtos em grid

3. **Produtos por Peso/Volume**
   - Botão "Por Peso" (ícone de balança)
   - Modal para selecionar produto
   - Modal para informar quantidade exata
   - **Unidades suportadas**: kg, g, l, ml

4. **Item Avulso**
   - Botão "Item Avulso" (ícone +)
   - Cria produto temporário no inventário
   - Para vendas de produtos não cadastrados

#### **Grid de Produtos**
- **Layout**: 4 colunas responsivas
- **Card por produto**:
  - Imagem do produto (ou placeholder)
  - Nome, marca, descrição (truncada)
  - Preço por unidade (R$ / unidade)
  - Status de estoque (verde/vermelho)
  - Badge de oferta (se aplicável)

### 3. **Carrinho e Gestão de Itens**

#### **Lista de Itens (Nota Fiscal)**
- Tabela com colunas: Item, Qtd, Unit., Desc., Total, Ações
- **Controle de quantidade**:
  - Botões + e - para ajustar
  - Quantidade exibida no centro
- **Desconto por item**:
  - Clique no valor para editar desconto
  - Modal específico para desconto do item
- **Remoção de item**: Ícone de lixeira

#### **Cálculos Automáticos**
- **Subtotal**: Soma de (quantidade × preço unitário)
- **Desconto por item**: Reduz valor do item específico
- **Desconto geral**: Aplicado sobre o subtotal
- **Total**: Subtotal - descontos

### 4. **Funcionalidades de Peso/Volume**

#### **Seleção de Produto por Peso**
1. **Modal de Seleção**
   - Filtra apenas produtos com unidades kg, g, l, ml
   - Exibe ícone específico por tipo (balança/líquido)
   - Mostra preço por unidade (R$/kg, R$/L, etc.)
   - Indica estoque disponível

2. **Modal de Informar Quantidade**
   - Campo numérico com unidade específica
   - **Step apropriado**:
     - g/ml: step="1" (inteiros)
     - kg/l: step="0.001" (decimais)
   - **Cálculo automático**:
     ```
     Total = Quantidade × Preço por unidade
     ```
   - Exemplo: 2.5kg × R$8,00/kg = R$20,00

3. **Nome no Carrinho**
   - Formato: "Nome do Produto (quantidadeunidade)"
   - Exemplo: "Arroz (2.5kg)"

#### **Comportamento no PDV**
- **Quantidades fracionadas**: Permitidas para kg, g, l, ml
- **Cálculo preciso**: Baseado no preço por unidade de medida
- **Controle de estoque**: Subtrai quantidade exata vendida

### 5. **Ofertas e Promoções**

#### **Integração com Sistema de Ofertas**
- **Verificação automática**: Ao carregar produtos
- **Badge visual**: "X% OFF" em laranja
- **Preço promocional**: Substitui preço original
- **Indicação no carrinho**: Badge "OFERTA" em itens com desconto

#### **Tipos de Ofertas**
- **Desconto percentual**: Ex: 10% OFF
- **Preço promocional fixo**: Ex: R$ 8,99 (era R$ 10,00)
- **Validade configurável**: Data início/fim

### 6. **Clientes**

#### **Busca Rápida de Cliente**
- Campo integrado no topo do PDV
- Busca por nome, CPF, telefone
- **Seleção**: Exibe nome do cliente selecionado
- **Venda vinculada**: Associa cliente à venda

#### **Benefícios**
- **Histórico de compras**: Futura implementação
- **Programa de fidelidade**: Futura implementação
- **Dados para relatórios**: Análise por cliente

### 7. **Finalização da Venda**

#### **Prévia da Venda (F2)**
- **Modal de confirmação**:
  - Lista completa de itens
  - Resumo financeiro
  - Data/hora atual
- **Ação**: "Continuar para Pagamento"

#### **Pagamento (Checkout)**
- **Modal de pagamento** com 5 opções:
  1. **Dinheiro** (ícone de cédula)
  2. **PIX** (ícone de smartphone)
  3. **Cartão de Débito** (ícone de cartão)
  4. **Cartão de Crédito** (ícone de cartão)
  5. **Transferência** (ícone de setas)

#### **Campos Específicos por Pagamento**
- **Dinheiro**:
  - Valor recebido (com validação ≥ total)
  - Valores rápidos sugeridos
  - **Cálculo de troco automático**
- **Todos os métodos**:
  - Número do caixa (1-99)
  - Observações (opcional)

### 8. **Funcionalidades Offline**

#### **Detecção de Conexão**
- **Online**: Operações normais
- **Offline**: 
  - Indicador vermelho "Offline"
  - Contador de vendas pendentes
  - Sincronização automática ao voltar

#### **Vendas Offline**
- **Salvamento local**: IndexedDB
- **Estrutura**: ID, itens, cliente, pagamento, total, data
- **Sincronização manual**: Botão "Sincronizar Agora"
- **Sincronização automática**: Ao voltar online

#### **Limitações Offline**
- ❌ Adição de novos produtos
- ❌ Verificação de ofertas
- ✅ Vendas com produtos já carregados
- ✅ Criação de itens avulsos (com conexão)

### 9. **Atalhos de Teclado**

#### **Atalhos Principais**
- **F2**: Finalizar venda (abre prévia)
- **ESC**: 
  - Fecha modais abertos
  - Se carrinho não vazio: pergunta limpar carrinho
- **F4**: Aplicar desconto geral
- **F11**: Alternar tela cheia

#### **Navegação**
- **Tab**: Entre campos
- **Enter**: 
  - No código de barras: adiciona produto
  - Em modais: confirma ação

### 10. **Histórico e Relatórios**

#### **Últimas Vendas**
- **Painel lateral**: Últimas 5 vendas concluídas
- **Colunas**: Nº venda, data/hora, pagamento, itens, total
- **Atualização automática**: Após cada venda

#### **Informações por Venda**
- **Número sequencial**: #001, #002, etc.
- **Data/hora completa**
- **Método de pagamento** com badge colorido
- **Quantidade de itens**
- **Valor total**

### 11. **Modais do Sistema**

#### **1. WeightInputModal**
- **Propósito**: Informar quantidade para produtos por peso/volume
- **Campos**: Quantidade (com unidade), cálculo automático do total
- **Validações**: Valor > 0, formato correto

#### **2. SelectWeightProductModal**
- **Propósito**: Selecionar produto para venda por peso/volume
- **Filtro**: Apenas produtos com unidades kg, g, l, ml
- **Layout**: Cards com imagem, nome, preço/unidade, estoque

#### **3. CheckoutModal**
- **Propósito**: Finalizar pagamento da venda
- **Seções**: Forma de pagamento, valor recebido (dinheiro), caixa, observações
- **Cálculos**: Troco automático para pagamento em dinheiro

#### **4. SalePreviewModal**
- **Propósito**: Prévia da venda antes do pagamento
- **Conteúdo**: Lista de itens, resumo financeiro, data/hora
- **Ação**: Confirmar para prosseguir ao pagamento

#### **5. DiscountModal**
- **Propósito**: Aplicar desconto (geral ou por item)
- **Tipos**: Valor fixo ou percentual
- **Validações**: Não pode exceder valor máximo

#### **6. AddCustomItemModal**
- **Propósito**: Adicionar item avulso não cadastrado
- **Campos**: Nome, preço unitário, quantidade
- **Criação**: Produto temporário no inventário

#### **7. ConfirmModal**
- **Propósito**: Confirmações gerais (ex: limpar carrinho)
- **Opções**: Confirmar/Cancelar com variantes (danger, etc.)

### 12. **Integração com Inventário**

#### **Sincronização em Tempo Real**
- **Atualização de estoque**: Após cada venda
- **Refetch automático**: Recarrega lista de produtos
- **Validação**: Não permite vender produto sem estoque

#### **Produtos com Estoque Baixo**
- **Indicação visual**: Texto "Indisponível" em vermelho
- **Desabilitação**: Botão do produto fica cinza
- **Badge de estoque**: Verde (disponível) / Vermelho (indisponível)

### 13. **Fluxo Completo de Venda**

#### **Passo 1: Adicionar Produtos**
1. Escanear código de barras OU
2. Buscar por nome e clicar OU
3. Selecionar "Por Peso" → escolher produto → informar quantidade OU
4. Adicionar "Item Avulso"

#### **Passo 2: Gerenciar Carrinho**
1. Ajustar quantidades (+/-)
2. Aplicar descontos por item (clicar no valor)
3. Remover itens indesejados (ícone lixeira)

#### **Passo 3: Aplicar Descontos (Opcional)**
1. Pressionar F4 ou clicar "Desconto"
2. Informar valor ou percentual
3. Confirmar aplicação

#### **Passo 4: Finalizar Venda**
1. Pressionar F2 ou clicar "FINALIZAR VENDA"
2. Verificar prévia da venda
3. Clicar "Continuar para Pagamento"

#### **Passo 5: Pagamento**
1. Selecionar forma de pagamento
2. Preencher campos específicos:
   - Dinheiro: valor recebido
   - Todos: número do caixa
   - Opcional: observações
3. Clicar "Confirmar Venda"

#### **Passo 6: Pós-Venda**
1. **Online**: Venda registrada, estoque atualizado
2. **Offline**: Venda salva localmente, sincroniza depois
3. **Feedback**: Toast de sucesso, carrinho limpo
4. **Histórico**: Atualiza lista de últimas vendas

### 14. **Considerações Técnicas**

#### **Performance**
- **Lazy loading**: Imagens sob demanda
- **Virtual scrolling**: Para listas longas
- **Debounce**: Busca em tempo real
- **Cache**: Produtos em memória

#### **Segurança**
- **Validações**: Frontend e backend
- **Transações**: Atomicidade nas vendas
- **Backup**: Vendas offline resilientes

#### **Acessibilidade**
- **ARIA labels**: Todos os elementos interativos
- **Contraste**: Cores WCAG compliant
- **Teclado**: Navegação completa
- **Screen readers**: Textos descritivos

### 15. **Próximas Melhorias**

#### **Planejadas**
1. **Leitor de código de barras físico**
2. **Impressão de cupom fiscal**
3. **Venda rápida por teclado numérico**
4. **Devoluções e cancelamentos**
5. **Relatórios em tempo real**
6. **Controle de turnos**
7. **Fechamento de caixa**
8. **Integração com SAT/ECF**

#### **Em Desenvolvimento**
- ✅ Sistema online/offline
- ✅ Vendas por peso/volume
- ✅ Ofertas e promoções
- ✅ Clientes
- ✅ Histórico de vendas

---

## Resumo de Comandos Rápidos

| Tecla | Ação |
|-------|------|
| **F2** | Finalizar venda (abre prévia) |
| **ESC** | Fechar modal / Limpar carrinho |
| **F4** | Aplicar desconto geral |
| **F11** | Tela cheia |
| **Tab** | Navegar entre campos |
| **Enter** | Confirmar ação |

## Unidades Suportadas para Peso/Volume

| Unidade | Tipo | Step | Exemplo de Uso |
|---------|------|------|----------------|
| **kg** | Peso | 0.001 | 2.5kg de arroz |
| **g** | Peso | 1 | 350g de queijo |
| **l** | Volume | 0.001 | 1.5L de leite |
| **ml** | Volume | 1 | 500ml de refrigerante |
| **un** | Unidade | 1 | 3 unidades de pão |
| **cx** | Caixa | 1 | 2 caixas de leite |
| **pct** | Pacote | 1 | 1 pacote de biscoito |

## Estados do Sistema

| Estado | Indicador | Comportamento |
|--------|-----------|---------------|
| **Online** | Verde "Caixa Livre" | Operações normais |
| **Offline** | Vermelho "Offline" | Vendas salvas localmente |
| **Com vendas pendentes** | Contador laranja | Sincronização disponível |
| **Produto sem estoque** | Vermelho "Indisponível" | Não pode ser adicionado |
| **Produto com oferta** | Laranja "X% OFF" | Preço promocional aplicado |

---

**Nota**: O PDV foi projetado para ser intuitivo, rápido e confiável, funcionando mesmo sem conexão com a internet.