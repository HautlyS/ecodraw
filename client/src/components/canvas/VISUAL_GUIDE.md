# 🎨 Guia Visual dos Elementos do Canvas

## 🌱 Plantas

### Aparência Visual

```
     🍅
   ╱    ╲
  │  ●   │  ← Gradiente radial verde
   ╲    ╱
     ▼
   Tomate  ← Label com contorno
```

### Características

- **Formato**: Círculo
- **Gradiente**: Centro mais opaco (40%) → Borda transparente (10%)
- **Borda**: Linha sólida de 2px na cor do elemento
- **Ícone**: Emoji centralizado (tamanho adaptativo ao zoom)
- **Label**: Nome abaixo com contorno branco/preto
- **Tamanho**: Baseado em `canopyDiameterMeters` × `pixelsPerMeter`

### Exemplos de Ícones

| Planta    | Ícone | Cor Padrão |
| --------- | ----- | ---------- |
| Tomate    | 🍅    | Verde      |
| Alface    | 🥬    | Verde      |
| Cenoura   | 🥕    | Verde      |
| Morango   | 🍓    | Verde      |
| Pimentão  | 🫑    | Verde      |
| Pepino    | 🥒    | Verde      |
| Abóbora   | 🎃    | Verde      |
| Milho     | 🌽    | Verde      |
| Batata    | 🥔    | Verde      |
| Cebola    | 🧅    | Verde      |
| Alho      | 🧄    | Verde      |
| Brócolis  | 🥦    | Verde      |
| Berinjela | 🍆    | Verde      |
| Melancia  | 🍉    | Verde      |
| Melão     | 🍈    | Verde      |
| Padrão    | 🌱    | Verde      |

## 🏗️ Estruturas

### Aparência Visual

```
   ┌─────────┐
   │   🚧    │  ← Gradiente radial azul
   │         │
   └─────────┘
       ▼
     Cerca     ← Label com contorno
```

### Características

- **Formato**: Quadrado/Retângulo
- **Gradiente**: Centro mais opaco (40%) → Cantos transparentes (10%)
- **Borda**: Linha sólida de 2px na cor do elemento
- **Ícone**: Emoji centralizado
- **Label**: Nome abaixo com contorno
- **Tamanho**: Baseado em `widthMeters` × `pixelsPerMeter`

### Exemplos de Ícones

| Estrutura    | Ícone | Cor Padrão | Descrição             |
| ------------ | ----- | ---------- | --------------------- |
| Cerca        | 🚧    | Azul       | Delimitação de área   |
| Portão       | 🚪    | Azul       | Entrada/saída         |
| Estufa       | 🏠    | Azul       | Cultivo protegido     |
| Galpão       | 🏚️    | Azul       | Armazenamento         |
| Composteira  | ♻️    | Azul       | Reciclagem orgânica   |
| Reservatório | 💧    | Azul       | Armazenamento de água |
| Irrigação    | 💦    | Azul       | Sistema de rega       |
| Padrão       | 🏗️    | Azul       | Estrutura genérica    |

## 🟫 Terreno

### Aparência Visual

#### Canteiro

```
   ┌─────────┐
   │   📦    │  ← Gradiente radial laranja
   │         │
   └─────────┘
       ▼
    Canteiro   ← Label com contorno
```

#### Caminho (Linha)

```
   🛤️ ─────────────── 🛤️
        Caminho
```

### Características

- **Formato**: Quadrado (canteiro) ou Linha (caminho)
- **Gradiente**: Centro mais opaco → Bordas transparentes
- **Borda**: Linha sólida de 2px
- **Ícone**: Emoji representativo
- **Label**: Nome com contorno
- **Cor Padrão**: Laranja (#f59e0b)

### Exemplos de Ícones

| Terreno          | Ícone | Formato  | Descrição        |
| ---------------- | ----- | -------- | ---------------- |
| Canteiro         | 📦    | Quadrado | Área de plantio  |
| Caminho          | 🛤️    | Linha    | Passagem         |
| Área de Descanso | 🪑    | Quadrado | Zona de lazer    |
| Padrão           | 🟫    | Quadrado | Terreno genérico |

## 🎨 Efeitos Visuais

### Gradiente Radial

```typescript
// Código de exemplo
const gradient = ctx.createRadialGradient(
  centerX,
  centerY,
  0, // Centro
  centerX,
  centerY,
  radius // Borda
)
gradient.addColorStop(0, rgba(color, 0.4)) // Centro: 40% opaco
gradient.addColorStop(1, rgba(color, 0.1)) // Borda: 10% opaco
```

### Sombra (Shadow)

```typescript
ctx.shadowColor = elementColor
ctx.shadowBlur = 8 / zoom // Adaptativo ao zoom
```

### Label com Contorno

```typescript
// Contorno (stroke)
ctx.strokeStyle = isDark ? '#000' : '#fff'
ctx.lineWidth = 3 / zoom
ctx.strokeText(name, x, y)

// Texto (fill)
ctx.fillStyle = isDark ? '#fff' : '#000'
ctx.fillText(name, x, y)
```

## 📏 Dimensões e Escala

### Tamanho dos Elementos

#### Plantas

```
Tamanho = canopyDiameterMeters × pixelsPerMeter

Exemplo:
- Tomate: 0.8m de diâmetro
- pixelsPerMeter: 50
- Tamanho no canvas: 40px
```

#### Estruturas

```
Largura = widthMeters × pixelsPerMeter
Altura = heightMeters × pixelsPerMeter

Exemplo:
- Cerca: 2m × 1m
- pixelsPerMeter: 50
- Tamanho no canvas: 100px × 50px
```

### Adaptação ao Zoom

| Zoom    | Ícone | Label | Borda | Grid |
| ------- | ----- | ----- | ----- | ---- |
| < 0.1   | ❌    | ❌    | ❌    | ❌   |
| 0.1-0.2 | ❌    | ❌    | ✅    | ✅   |
| 0.2-0.3 | ❌    | ❌    | ✅    | ✅   |
| 0.3-0.4 | ✅    | ❌    | ✅    | ✅   |
| > 0.4   | ✅    | ✅    | ✅    | ✅   |

## 🎯 Comparação: Antes vs Depois

### Antes

```
   ┌─────┐
   │  ●  │  ← Apenas círculo verde
   └─────┘
```

### Depois

```
     🍅
   ╱    ╲
  │  ●   │  ← Círculo com gradiente + ícone
   ╲    ╱
     ▼
   Tomate  ← Label identificável
```

## 🌈 Paleta de Cores

### Cores Padrão

```css
--plant-color: #22c55e; /* Verde vibrante */
--structure-color: #3b82f6; /* Azul */
--terrain-color: #f59e0b; /* Laranja */
--grid-minor: rgba(203, 213, 225, 0.5); /* Cinza claro */
--grid-major: rgba(148, 163, 184, 0.8); /* Cinza médio */
--canvas-border: rgba(245, 158, 11, 0.8); /* Laranja borda */
```

### Modo Escuro

```css
--plant-color: #22c55e; /* Mantém verde */
--structure-color: #3b82f6; /* Mantém azul */
--terrain-color: #f59e0b; /* Mantém laranja */
--grid-minor: rgba(71, 85, 105, 0.3); /* Cinza escuro */
--grid-major: rgba(100, 116, 139, 0.6); /* Cinza médio escuro */
```

## 📐 Grade (Grid)

### Linhas Menores

```
│   │   │   │   │
├───┼───┼───┼───┤  ← A cada gridSizeMeters
│   │   │   │   │
```

### Linhas Maiores

```
║     5m    ║     10m    ║
╠═══════════╬═══════════╬  ← A cada 5 × gridSizeMeters
║           ║           ║
```

### Labels da Grade

```
    5m      10m     15m
    │       │       │
────┼───────┼───────┼────  ← Labels horizontais
    │       │       │
5m ─┤       │       │
    │       │       │
10m─┤       │       │      ← Labels verticais
    │       │       │
```

## 🎬 Animações e Transições

### Hover (Futuro)

```
Normal:  🍅 (opacity: 1.0)
Hover:   🍅 (opacity: 1.0, scale: 1.1, shadow: maior)
```

### Seleção (Futuro)

```
     🍅
   ╱    ╲
  │  ●   │  ← Borda pulsante
   ╲    ╱
  ┌──────┐
  │ Edit │  ← Controles de edição
  └──────┘
```

## 💡 Dicas de Design

1. **Contraste**: Sempre use contorno no texto para legibilidade
2. **Escala**: Ícones devem ser proporcionais ao elemento
3. **Consistência**: Mesma família de ícones (emojis)
4. **Feedback**: Elementos devem responder visualmente à interação
5. **Hierarquia**: Elementos maiores = mais importantes
6. **Espaçamento**: Respeite o `spacingMeters` entre plantas

## 🔮 Melhorias Futuras

- [ ] Ícones SVG customizados (mais detalhados)
- [ ] Animações de crescimento para plantas
- [ ] Indicadores de saúde (cor do gradiente)
- [ ] Sombras realistas baseadas na hora do dia
- [ ] Texturas para diferentes tipos de terreno
- [ ] Efeitos de clima (chuva, sol, vento)
