# Canvas Component Architecture

## 📁 Estrutura de Arquivos

```
canvas/
├── CanvasWindow.vue          # Janela principal do canvas (drag, resize, maximize)
├── CanvasHeader.vue           # Cabeçalho com controles e informações
├── CanvasResizeHandles.vue    # Handles de redimensionamento
├── CanvasRenderer.vue         # Componente de renderização do canvas
├── CanvasEmptyState.vue       # Estado vazio (quando não há elementos)
├── CanvasZoomControl.vue      # Controles de zoom na parte inferior
└── renderers/
    ├── GridRenderer.ts        # Renderização da grade
    └── ElementRenderer.ts     # Renderização dos elementos (plantas, estruturas, terreno)

composables/
├── useCanvasWindow.ts         # Lógica de janela (drag, resize, maximize)
├── useCanvasHistory.ts        # Gerenciamento de histórico (undo/redo)
├── useCanvasRenderer.ts       # Lógica de renderização
└── useCanvasInteraction.ts    # Interações do usuário (mouse, touch)
```

## 🎨 Design dos Elementos

### Plantas 🌱

- **Formato**: Círculo com gradiente radial
- **Ícone**: Emoji específico da planta (🍅 tomate, 🥬 alface, etc.)
- **Tamanho**: Baseado em `canopyDiameterMeters` (diâmetro da copa)
- **Cor**: Verde (#22c55e) ou cor personalizada
- **Label**: Nome da planta abaixo do ícone

### Estruturas 🏗️

- **Formato**: Quadrado/Retângulo com gradiente
- **Ícones**:
  - Cerca: 🚧
  - Portão: 🚪
  - Estufa: 🏠
  - Galpão: 🏚️
  - Composteira: ♻️
  - Reservatório: 💧
- **Tamanho**: Baseado em `widthMeters` e `heightMeters`
- **Cor**: Azul (#3b82f6) ou cor personalizada

### Terreno 🟫

- **Formato**: Quadrado ou linha (para caminhos)
- **Ícones**:
  - Canteiro: 📦
  - Caminho: 🛤️
  - Área de Descanso: 🪑
- **Cor**: Laranja (#f59e0b) ou cor personalizada

## 🔧 Funcionalidades

### Janela do Canvas

- **Arrastar**: Clique e arraste no cabeçalho
- **Redimensionar**: Arraste os cantos ou bordas
- **Maximizar**: Botão verde no cabeçalho
- **Minimizar**: Botão amarelo no cabeçalho

### Interação com Elementos

- **Colocar**: Clique no canvas com ferramenta e elemento selecionados
- **Desenhar**: Use a ferramenta lápis para desenhar linhas
- **Pincel**: Desenhe continuamente com o pincel
- **Snap to Grid**: Elementos se alinham à grade quando ativado

### Visualização

- **Zoom**: Scroll do mouse ou controles na parte inferior
- **Pan**: Shift + Clique ou botão do meio do mouse
- **Fit to View**: Ajusta zoom para ver todo o canvas
- **Reset View**: Volta ao zoom 1:1

### Grade

- **Linhas Menores**: A cada X metros (configurável)
- **Linhas Maiores**: A cada 5X metros com labels
- **Adaptativa**: Densidade ajusta com o zoom

## 🎯 Melhorias Implementadas

1. **Modularização**: Código dividido em componentes pequenos e reutilizáveis
2. **Composables**: Lógica separada em funções composable
3. **Ícones Visuais**: Cada elemento tem um emoji representativo
4. **Performance**: Renderização otimizada com canvas nativo
5. **Responsividade**: Janela adaptável e redimensionável
6. **Acessibilidade**: Tooltips e labels claros

## 🚀 Como Usar

```vue
<template>
  <Canvas
    :selected-tool="selectedTool"
    :selected-element="selectedElement"
    :brush-settings="brushSettings"
    :canvas-settings="canvasSettings"
    @item-placed="handleItemPlaced"
    @history-change="handleHistoryChange"
    @open-settings="showSettings = true"
  />
</template>
```

## 📝 Próximos Passos

- [ ] Adicionar seleção e movimentação de elementos
- [ ] Implementar rotação de elementos
- [ ] Adicionar mais ícones personalizados
- [ ] Melhorar renderização de estruturas retangulares
- [ ] Adicionar preview ao arrastar elementos
- [ ] Implementar layers (camadas)
