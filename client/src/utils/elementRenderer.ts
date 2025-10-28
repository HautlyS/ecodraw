/**
 * Enhanced Element Renderer
 * Beautiful, realistic rendering of plants, terrain, and structures
 */

import type { CanvasElement } from '@/types/canvas'

export interface RenderContext {
  ctx: CanvasRenderingContext2D
  zoom: number
  isDark: boolean
}

/**
 * Render element with enhanced visuals
 */
export function renderElement(element: CanvasElement, context: RenderContext) {
  const { ctx } = context

  ctx.save()
  ctx.globalAlpha = element.opacity || 1

  // Render selection/hover highlight first (behind element)
  if (element.selected || element.hovered) {
    renderSelectionHighlight(element, context)
  }

  switch (element.type) {
    case 'plant':
      renderPlant(element, context)
      break
    case 'terrain':
      renderTerrain(element, context)
      break
    case 'structure':
      renderStructure(element, context)
      break
    default:
      renderDefault(element, context)
  }

  // Render icon on element (except for lines)
  if (element.shape !== 'line') {
    renderElementIcon(element, context)
  }

  // Render label
  if (element.name && element.shape !== 'line') {
    renderLabel(element, context)
  }

  // Render selection handles if selected
  if (element.selected && element.shape !== 'line') {
    renderSelectionHandles(element, context)
  }

  ctx.restore()
}

/**
 * Render selection/hover highlight
 */
function renderSelectionHighlight(element: CanvasElement, { ctx, zoom, isDark }: RenderContext) {
  // isDark can be used for theme-aware highlights in the future
  void isDark
  const halfSize = element.size / 2
  const padding = Math.max(4, 6 / zoom)

  ctx.save()

  if (element.selected) {
    // Selection highlight - blue
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)' // blue-500
    ctx.lineWidth = Math.max(2, 3 / zoom)
    ctx.shadowColor = 'rgba(59, 130, 246, 0.5)'
    ctx.shadowBlur = Math.max(4, 8 / zoom)
  } else if (element.hovered) {
    // Hover highlight - lighter blue
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.6)' // blue-400
    ctx.lineWidth = Math.max(1.5, 2 / zoom)
    ctx.shadowColor = 'rgba(96, 165, 250, 0.3)'
    ctx.shadowBlur = Math.max(3, 6 / zoom)
  }

  if (element.shape === 'circle') {
    ctx.beginPath()
    ctx.arc(element.x, element.y, halfSize + padding, 0, Math.PI * 2)
    ctx.stroke()
  } else {
    const x = element.x - halfSize - padding
    const y = element.y - halfSize - padding
    const size = element.size + padding * 2
    ctx.strokeRect(x, y, size, size)
  }

  ctx.restore()
}

/**
 * Render selection handles
 */
function renderSelectionHandles(element: CanvasElement, { ctx, zoom, isDark }: RenderContext) {
  // isDark can be used for theme-aware handles in the future
  void isDark
  const halfSize = element.size / 2
  const handleSize = Math.max(6, 8 / zoom)
  const handlePositions = [
    { x: element.x - halfSize, y: element.y - halfSize }, // top-left
    { x: element.x + halfSize, y: element.y - halfSize }, // top-right
    { x: element.x - halfSize, y: element.y + halfSize }, // bottom-left
    { x: element.x + halfSize, y: element.y + halfSize }, // bottom-right
  ]

  ctx.save()

  handlePositions.forEach(pos => {
    // Handle background
    ctx.fillStyle = '#3b82f6' // blue-500
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, handleSize / 2, 0, Math.PI * 2)
    ctx.fill()

    // Handle border
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = Math.max(1.5, 2 / zoom)
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, handleSize / 2, 0, Math.PI * 2)
    ctx.stroke()

    // Handle shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = Math.max(2, 3 / zoom)
    ctx.shadowOffsetY = Math.max(1, 1.5 / zoom)
  })

  ctx.restore()
}

/**
 * Render icon on element
 */
function renderElementIcon(element: CanvasElement, { ctx, zoom, isDark }: RenderContext) {
  // isDark can be used for theme-aware icons in the future
  void isDark
  const iconSize = Math.min(element.size * 0.4, Math.max(16, 20 / zoom))

  ctx.save()
  ctx.font = `${iconSize}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Get icon from element data
  const icon = getElementIconFromData(element.name, element.type)

  // Add subtle shadow for depth
  ctx.shadowColor = 'rgba(0,0,0,0.3)'
  ctx.shadowBlur = Math.max(2, 3 / zoom)
  ctx.shadowOffsetY = Math.max(1, 1.5 / zoom)

  ctx.fillText(icon, element.x, element.y)

  ctx.restore()
}

/**
 * Get icon for element from data
 */
function getElementIconFromData(name: string, type: 'plant' | 'terrain' | 'structure'): string {
  // Import icons from elements data
  const PLANT_ICONS: Record<string, string> = {
    Tomate: '🍅',
    Alface: '🥬',
    Cenoura: '🥕',
    Pimentão: '🫑',
    Couve: '🥬',
    Beterraba: '🫐',
    Manjericão: '🌿',
    Salsa: '🌿',
    Rúcula: '🥗',
    Espinafre: '🥬',
    Laranjeira: '🍊',
    Limoeiro: '🍋',
    Bananeira: '🍌',
    Abacateiro: '🥑',
    Morango: '🍓',
    Melancia: '🍉',
    Abóbora: '🎃',
    Milho: '🌽',
  }

  const TERRAIN_ICONS: Record<string, string> = {
    'Solo Fértil': '🟫',
    'Solo Arenoso': '🟨',
    'Solo Argiloso': '🟤',
    Compostagem: '♻️',
    'Solo Calcário': '⬜',
    'Solo Ácido': '🟧',
    Água: '💧',
    Pedra: '🪨',
    Grama: '🟩',
  }

  const STRUCTURE_ICONS: Record<string, string> = {
    Estufa: '🏠',
    Cerca: '🚧',
    'Sistema de Irrigação': '💧',
    Composteira: '♻️',
    Pergolado: '🏛️',
    'Canteiro Elevado': '📦',
    Reservatório: '🛢️',
    Galpão: '🏭',
    Casa: '🏡',
    Galinheiro: '🐔',
  }

  switch (type) {
    case 'plant':
      return PLANT_ICONS[name] || '🌱'
    case 'terrain':
      return TERRAIN_ICONS[name] || '🟫'
    case 'structure':
      return STRUCTURE_ICONS[name] || '🏗️'
    default:
      return '⚪'
  }
}

/**
 * Render plant with realistic appearance
 */
function renderPlant(element: CanvasElement, { ctx, zoom, isDark }: RenderContext) {
  const radius = element.size / 2
  const x = element.x
  const y = element.y

  // Shadow
  ctx.save()
  ctx.globalAlpha = 0.3
  ctx.fillStyle = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'
  ctx.beginPath()
  ctx.ellipse(x, y + radius * 0.9, radius * 0.8, radius * 0.3, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  if (element.shape === 'circle') {
    // Canopy - layered circles for depth
    const layers = 3
    for (let i = layers; i > 0; i--) {
      const layerRadius = radius * (0.6 + (i / layers) * 0.4)
      const layerAlpha = 0.3 + (i / layers) * 0.4

      // Gradient for each layer
      const gradient = ctx.createRadialGradient(
        x - layerRadius * 0.2,
        y - layerRadius * 0.2,
        0,
        x,
        y,
        layerRadius
      )

      const baseColor = hexToRgb(element.color)
      const lightColor = lightenColor(baseColor, 30)
      const darkColor = darkenColor(baseColor, 20)

      gradient.addColorStop(0, rgbToString(lightColor, layerAlpha))
      gradient.addColorStop(0.5, rgbToString(baseColor, layerAlpha))
      gradient.addColorStop(1, rgbToString(darkColor, layerAlpha * 0.8))

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, layerRadius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Trunk (for trees)
    if (radius > 30) {
      const trunkWidth = radius * 0.15
      const trunkHeight = radius * 0.4

      const trunkGradient = ctx.createLinearGradient(
        x - trunkWidth / 2,
        y + radius * 0.3,
        x + trunkWidth / 2,
        y + radius * 0.3
      )
      trunkGradient.addColorStop(0, '#654321')
      trunkGradient.addColorStop(0.5, '#8B4513')
      trunkGradient.addColorStop(1, '#654321')

      ctx.fillStyle = trunkGradient
      ctx.fillRect(x - trunkWidth / 2, y + radius * 0.3, trunkWidth, trunkHeight)
    }

    // Dashed border for plant area
    ctx.strokeStyle = element.color
    ctx.lineWidth = Math.max(1, 2 / zoom)
    ctx.globalAlpha = 0.6
    ctx.setLineDash([5 / zoom, 3 / zoom])
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Central icon circle
    const iconRadius = Math.min(radius * 0.4, 20 / zoom)
    const iconGradient = ctx.createRadialGradient(x, y, 0, x, y, iconRadius)
    iconGradient.addColorStop(0, 'rgba(255,255,255,0.95)')
    iconGradient.addColorStop(1, 'rgba(255,255,255,0.85)')

    ctx.fillStyle = iconGradient
    ctx.globalAlpha = 1
    ctx.beginPath()
    ctx.arc(x, y, iconRadius, 0, Math.PI * 2)
    ctx.fill()

    // Icon border
    ctx.strokeStyle = element.color
    ctx.lineWidth = Math.max(1.5, 2 / zoom)
    ctx.beginPath()
    ctx.arc(x, y, iconRadius, 0, Math.PI * 2)
    ctx.stroke()

    // Highlights
    ctx.globalAlpha = 0.4
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.6)'
    ctx.lineWidth = Math.max(0.5, 1 / zoom)
    ctx.beginPath()
    ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.4, 0, Math.PI * 2)
    ctx.stroke()
  } else {
    // Square plant (e.g., garden bed)
    const halfSize = element.size / 2

    // Background with pattern
    ctx.fillStyle = element.color
    ctx.globalAlpha = 0.3
    ctx.fillRect(x - halfSize, y - halfSize, element.size, element.size)

    // Grid pattern for organized planting
    ctx.strokeStyle = element.color
    ctx.lineWidth = Math.max(0.5, 1 / zoom)
    ctx.globalAlpha = 0.5

    const gridSize = element.size / 4
    for (let i = 1; i < 4; i++) {
      // Vertical lines
      ctx.beginPath()
      ctx.moveTo(x - halfSize + i * gridSize, y - halfSize)
      ctx.lineTo(x - halfSize + i * gridSize, y + halfSize)
      ctx.stroke()

      // Horizontal lines
      ctx.beginPath()
      ctx.moveTo(x - halfSize, y - halfSize + i * gridSize)
      ctx.lineTo(x + halfSize, y - halfSize + i * gridSize)
      ctx.stroke()
    }

    // Border
    ctx.strokeStyle = element.color
    ctx.lineWidth = Math.max(2, 3 / zoom)
    ctx.globalAlpha = 0.8
    ctx.strokeRect(x - halfSize, y - halfSize, element.size, element.size)
  }
}

/**
 * Get terrain texture pattern
 */
function getTerrainTexture(name: string): 'dots' | 'lines' | 'grid' | 'waves' {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('água') || lowerName.includes('water') || lowerName.includes('stream'))
    return 'waves'
  if (lowerName.includes('areia') || lowerName.includes('sand') || lowerName.includes('arenoso'))
    return 'dots'
  if (lowerName.includes('argila') || lowerName.includes('clay') || lowerName.includes('argiloso'))
    return 'lines'
  return 'grid'
}

/**
 * Render terrain with texture
 */
function renderTerrain(element: CanvasElement, { ctx, zoom }: RenderContext) {
  if (element.shape === 'line' && element.path && element.path.length > 1) {
    // Path-based terrain (trails, streams, paths)
    const strokeWidth = element.size / zoom

    // Shadow for depth
    ctx.save()
    ctx.strokeStyle = 'rgba(0,0,0,0.2)'
    ctx.lineWidth = strokeWidth + 2 / zoom
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(element.path[0]!.x + 1 / zoom, element.path[0]!.y + 1 / zoom)
    for (let i = 1; i < element.path.length; i++) {
      ctx.lineTo(element.path[i]!.x + 1 / zoom, element.path[i]!.y + 1 / zoom)
    }
    ctx.stroke()
    ctx.restore()

    // Main path with gradient
    const gradient = ctx.createLinearGradient(
      element.path[0]!.x,
      element.path[0]!.y,
      element.path[element.path.length - 1]!.x,
      element.path[element.path.length - 1]!.y
    )

    const baseColor = hexToRgb(element.color)
    gradient.addColorStop(0, rgbToString(lightenColor(baseColor, 20), 0.7))
    gradient.addColorStop(0.5, rgbToString(baseColor, 0.9))
    gradient.addColorStop(1, rgbToString(darkenColor(baseColor, 20), 0.7))

    ctx.strokeStyle = gradient
    ctx.lineWidth = strokeWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(element.path[0]!.x, element.path[0]!.y)
    for (let i = 1; i < element.path.length; i++) {
      ctx.lineTo(element.path[i]!.x, element.path[i]!.y)
    }
    ctx.stroke()

    // Add texture pattern on path
    if (strokeWidth > 5) {
      ctx.strokeStyle = rgbToString(baseColor, 0.4)
      ctx.lineWidth = Math.max(1, strokeWidth / 3)
      ctx.setLineDash([3 / zoom, 4 / zoom])
      ctx.beginPath()
      ctx.moveTo(element.path[0]!.x, element.path[0]!.y)
      for (let i = 1; i < element.path.length; i++) {
        ctx.lineTo(element.path[i]!.x, element.path[i]!.y)
      }
      ctx.stroke()
      ctx.setLineDash([])
    }
  } else {
    // Area-based terrain
    const halfSize = element.size / 2
    const x = element.x
    const y = element.y
    const isCircle = element.shape === 'circle'

    // Base fill with gradient
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, halfSize)
    const baseColor = hexToRgb(element.color)

    gradient.addColorStop(0, rgbToString(lightenColor(baseColor, 15), 0.5))
    gradient.addColorStop(0.5, rgbToString(baseColor, 0.6))
    gradient.addColorStop(1, rgbToString(darkenColor(baseColor, 15), 0.4))

    ctx.fillStyle = gradient

    if (isCircle) {
      ctx.beginPath()
      ctx.arc(x, y, halfSize, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillRect(x - halfSize, y - halfSize, element.size, element.size)
    }

    // Add texture pattern based on terrain type
    const texture = getTerrainTexture(element.name)
    ctx.save()
    ctx.globalAlpha = 0.3

    if (isCircle) {
      ctx.beginPath()
      ctx.arc(x, y, halfSize, 0, Math.PI * 2)
      ctx.clip()
    } else {
      ctx.beginPath()
      ctx.rect(x - halfSize, y - halfSize, element.size, element.size)
      ctx.clip()
    }

    switch (texture) {
      case 'dots':
        // Dotted pattern for sand/granular
        ctx.fillStyle = element.color
        const dotSpacing = Math.max(5, 8 / zoom)
        const dotSize = Math.max(0.5, 1.5 / zoom)
        for (let dx = -halfSize; dx < halfSize; dx += dotSpacing) {
          for (let dy = -halfSize; dy < halfSize; dy += dotSpacing) {
            const px = x + dx + (Math.random() - 0.5) * dotSpacing * 0.3
            const py = y + dy + (Math.random() - 0.5) * dotSpacing * 0.3
            ctx.beginPath()
            ctx.arc(px, py, dotSize, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        break

      case 'lines':
        // Horizontal lines for clay/layered
        ctx.strokeStyle = element.color
        ctx.lineWidth = Math.max(0.5, 1 / zoom)
        const lineSpacing = Math.max(4, 6 / zoom)
        for (let dy = -halfSize; dy < halfSize; dy += lineSpacing) {
          ctx.beginPath()
          ctx.moveTo(x - halfSize, y + dy)
          ctx.lineTo(x + halfSize, y + dy)
          ctx.stroke()
        }
        break

      case 'waves':
        // Wavy pattern for water
        ctx.strokeStyle = element.color
        ctx.lineWidth = Math.max(0.5, 1 / zoom)
        const waveSpacing = Math.max(6, 10 / zoom)
        for (let dy = -halfSize; dy < halfSize; dy += waveSpacing) {
          ctx.beginPath()
          for (let dx = -halfSize; dx < halfSize; dx += 2) {
            const wave = Math.sin(dx * 0.2) * 2
            if (dx === -halfSize) {
              ctx.moveTo(x + dx, y + dy + wave)
            } else {
              ctx.lineTo(x + dx, y + dy + wave)
            }
          }
          ctx.stroke()
        }
        break

      case 'grid':
      default:
        // Grid pattern for general terrain
        ctx.strokeStyle = element.color
        ctx.lineWidth = Math.max(0.5, 1 / zoom)
        const gridSpacing = Math.max(8, 12 / zoom)
        for (let i = -halfSize; i < halfSize; i += gridSpacing) {
          ctx.beginPath()
          ctx.moveTo(x + i, y - halfSize)
          ctx.lineTo(x + i, y + halfSize)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(x - halfSize, y + i)
          ctx.lineTo(x + halfSize, y + i)
          ctx.stroke()
        }
        break
    }

    ctx.restore()

    // Border with dashed style
    ctx.strokeStyle = element.color
    ctx.lineWidth = Math.max(1.5, 2 / zoom)
    ctx.globalAlpha = 0.7
    ctx.setLineDash([5 / zoom, 3 / zoom])

    if (isCircle) {
      ctx.beginPath()
      ctx.arc(x, y, halfSize, 0, Math.PI * 2)
      ctx.stroke()
    } else {
      ctx.strokeRect(x - halfSize, y - halfSize, element.size, element.size)
    }
    ctx.setLineDash([])

    // Central icon
    const iconSize = Math.min(halfSize * 0.5, 16 / zoom)
    ctx.globalAlpha = 1
    ctx.fillStyle = element.color
    ctx.font = `bold ${iconSize * 1.5}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(255,255,255,0.8)'
    ctx.shadowBlur = 3 / zoom
    ctx.fillText('🟫', x, y)
    ctx.shadowBlur = 0
  }
}

/**
 * Render structure with 3D effect
 */
function renderStructure(element: CanvasElement, { ctx, zoom, isDark }: RenderContext) {
  const halfSize = element.size / 2
  const x = element.x
  const y = element.y

  if (element.shape === 'circle') {
    // Circular structure (e.g., silo, water tank, reservoir)

    // Shadow
    ctx.save()
    ctx.globalAlpha = 0.35
    ctx.fillStyle = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.35)'
    ctx.beginPath()
    ctx.ellipse(
      x + halfSize * 0.1,
      y + halfSize * 0.9,
      halfSize * 0.9,
      halfSize * 0.3,
      0,
      0,
      Math.PI * 2
    )
    ctx.fill()
    ctx.restore()

    // Main body with 3D gradient
    const gradient = ctx.createLinearGradient(x - halfSize, y, x + halfSize, y)
    const baseColor = hexToRgb(element.color)

    gradient.addColorStop(0, rgbToString(darkenColor(baseColor, 35), 1))
    gradient.addColorStop(0.25, rgbToString(darkenColor(baseColor, 15), 1))
    gradient.addColorStop(0.5, rgbToString(baseColor, 1))
    gradient.addColorStop(0.75, rgbToString(lightenColor(baseColor, 25), 1))
    gradient.addColorStop(1, rgbToString(darkenColor(baseColor, 20), 1))

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, halfSize, 0, Math.PI * 2)
    ctx.fill()

    // Highlight shine
    ctx.globalAlpha = 0.5
    const highlightGradient = ctx.createRadialGradient(
      x - halfSize * 0.35,
      y - halfSize * 0.35,
      0,
      x - halfSize * 0.35,
      y - halfSize * 0.35,
      halfSize * 0.7
    )
    highlightGradient.addColorStop(0, 'rgba(255,255,255,0.9)')
    highlightGradient.addColorStop(0.5, 'rgba(255,255,255,0.3)')
    highlightGradient.addColorStop(1, 'rgba(255,255,255,0)')

    ctx.fillStyle = highlightGradient
    ctx.beginPath()
    ctx.arc(x, y, halfSize, 0, Math.PI * 2)
    ctx.fill()

    // Metallic bands (for tanks/silos)
    if (element.size > 30) {
      ctx.globalAlpha = 0.3
      ctx.strokeStyle = rgbToString(darkenColor(baseColor, 50), 1)
      ctx.lineWidth = Math.max(1, 2 / zoom)
      const bands = 3
      for (let i = 1; i <= bands; i++) {
        const bandRadius = halfSize * (i / (bands + 1))
        ctx.beginPath()
        ctx.arc(x, y, bandRadius, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    // Outline
    ctx.globalAlpha = 1
    ctx.strokeStyle = rgbToString(darkenColor(baseColor, 45), 1)
    ctx.lineWidth = Math.max(2, 3 / zoom)
    ctx.beginPath()
    ctx.arc(x, y, halfSize, 0, Math.PI * 2)
    ctx.stroke()
  } else {
    // Rectangular structure (e.g., building, greenhouse, shed)

    // Shadow
    ctx.save()
    ctx.globalAlpha = 0.35
    ctx.fillStyle = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.35)'
    ctx.fillRect(x - halfSize + halfSize * 0.15, y + halfSize * 0.7, element.size, halfSize * 0.4)
    ctx.restore()

    // 3D effect - back wall (roof)
    const depth = halfSize * 0.35
    const baseColor = hexToRgb(element.color)
    ctx.fillStyle = rgbToString(darkenColor(baseColor, 45), 1)
    ctx.beginPath()
    ctx.moveTo(x - halfSize, y - halfSize)
    ctx.lineTo(x - halfSize + depth, y - halfSize - depth)
    ctx.lineTo(x + halfSize + depth, y - halfSize - depth)
    ctx.lineTo(x + halfSize, y - halfSize)
    ctx.closePath()
    ctx.fill()

    // Roof edge highlight
    ctx.strokeStyle = rgbToString(lightenColor(baseColor, 10), 0.5)
    ctx.lineWidth = Math.max(1, 1.5 / zoom)
    ctx.beginPath()
    ctx.moveTo(x - halfSize, y - halfSize)
    ctx.lineTo(x - halfSize + depth, y - halfSize - depth)
    ctx.lineTo(x + halfSize + depth, y - halfSize - depth)
    ctx.stroke()

    // 3D effect - side wall
    ctx.fillStyle = rgbToString(darkenColor(baseColor, 28), 1)
    ctx.beginPath()
    ctx.moveTo(x + halfSize, y - halfSize)
    ctx.lineTo(x + halfSize + depth, y - halfSize - depth)
    ctx.lineTo(x + halfSize + depth, y + halfSize - depth)
    ctx.lineTo(x + halfSize, y + halfSize)
    ctx.closePath()
    ctx.fill()

    // Main front face with gradient
    const gradient = ctx.createLinearGradient(
      x - halfSize,
      y - halfSize,
      x + halfSize,
      y + halfSize
    )

    gradient.addColorStop(0, rgbToString(lightenColor(baseColor, 18), 1))
    gradient.addColorStop(0.5, rgbToString(baseColor, 1))
    gradient.addColorStop(1, rgbToString(darkenColor(baseColor, 18), 1))

    ctx.fillStyle = gradient
    ctx.fillRect(x - halfSize, y - halfSize, element.size, element.size)

    // Windows/details
    if (element.size > 40) {
      const windowColor = isDark ? 'rgba(255,255,200,0.7)' : 'rgba(100,150,220,0.5)'
      ctx.fillStyle = windowColor
      const windowSize = element.size * 0.15
      const windowSpacing = element.size * 0.3

      for (let wx = -1; wx <= 1; wx++) {
        for (let wy = -1; wy <= 1; wy++) {
          if (wy === 1) continue // No windows at bottom
          const winX = x + wx * windowSpacing - windowSize / 2
          const winY = y + wy * windowSpacing - windowSize / 2

          // Window fill
          ctx.fillRect(winX, winY, windowSize, windowSize)

          // Window frame
          ctx.strokeStyle = rgbToString(darkenColor(baseColor, 50), 1)
          ctx.lineWidth = Math.max(0.5, 1 / zoom)
          ctx.strokeRect(winX, winY, windowSize, windowSize)

          // Window cross
          ctx.beginPath()
          ctx.moveTo(winX + windowSize / 2, winY)
          ctx.lineTo(winX + windowSize / 2, winY + windowSize)
          ctx.moveTo(winX, winY + windowSize / 2)
          ctx.lineTo(winX + windowSize, winY + windowSize / 2)
          ctx.stroke()
        }
      }
    }

    // Outline
    ctx.strokeStyle = rgbToString(darkenColor(baseColor, 45), 1)
    ctx.lineWidth = Math.max(2, 3 / zoom)
    ctx.strokeRect(x - halfSize, y - halfSize, element.size, element.size)

    // Door
    if (element.size > 30) {
      const doorWidth = element.size * 0.22
      const doorHeight = element.size * 0.38
      const doorX = x - doorWidth / 2
      const doorY = y + halfSize - doorHeight

      // Door shadow
      ctx.fillStyle = rgbToString(darkenColor(baseColor, 55), 1)
      ctx.fillRect(doorX, doorY, doorWidth, doorHeight)

      // Door frame
      ctx.strokeStyle = rgbToString(darkenColor(baseColor, 60), 1)
      ctx.lineWidth = Math.max(1.5, 2 / zoom)
      ctx.strokeRect(doorX, doorY, doorWidth, doorHeight)

      // Door handle
      if (element.size > 50) {
        ctx.fillStyle = rgbToString(lightenColor(baseColor, 30), 1)
        const handleSize = Math.max(2, 3 / zoom)
        ctx.beginPath()
        ctx.arc(doorX + doorWidth * 0.75, doorY + doorHeight * 0.5, handleSize, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
}

/**
 * Render default element
 */
function renderDefault(element: CanvasElement, { ctx, zoom }: RenderContext) {
  const halfSize = element.size / 2
  const gradient = ctx.createRadialGradient(element.x, element.y, 0, element.x, element.y, halfSize)

  gradient.addColorStop(0, hexToRgba(element.color, 0.4))
  gradient.addColorStop(1, hexToRgba(element.color, 0.1))

  ctx.fillStyle = gradient

  if (element.shape === 'circle') {
    ctx.beginPath()
    ctx.arc(element.x, element.y, halfSize, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.fillRect(element.x - halfSize, element.y - halfSize, element.size, element.size)
  }

  ctx.strokeStyle = element.color
  ctx.lineWidth = Math.max(1, 2 / zoom)

  if (element.shape === 'circle') {
    ctx.beginPath()
    ctx.arc(element.x, element.y, halfSize, 0, Math.PI * 2)
    ctx.stroke()
  } else {
    ctx.strokeRect(element.x - halfSize, element.y - halfSize, element.size, element.size)
  }
}

/**
 * Render element label - Always visible with improved contrast
 */
function renderLabel(element: CanvasElement, { ctx, zoom }: RenderContext) {
  const fontSize = Math.max(9, 11 / zoom)
  ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'

  // Position label above element
  const textY = element.y - element.size / 2 - Math.max(4, 6 / zoom)

  // Measure text for background
  const metrics = ctx.measureText(element.name)
  const padding = Math.max(4, 5 / zoom)
  const bgWidth = metrics.width + padding * 2
  const bgHeight = fontSize + padding * 2
  const bgX = element.x - bgWidth / 2
  const bgY = textY - bgHeight

  // Background with element color
  ctx.save()
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = 'rgba(0,0,0,0.2)'
  ctx.shadowBlur = Math.max(2, 4 / zoom)
  ctx.shadowOffsetY = Math.max(1, 2 / zoom)

  // Rounded rectangle background
  const radius = Math.max(2, 3 / zoom)
  ctx.beginPath()
  ctx.moveTo(bgX + radius, bgY)
  ctx.lineTo(bgX + bgWidth - radius, bgY)
  ctx.quadraticCurveTo(bgX + bgWidth, bgY, bgX + bgWidth, bgY + radius)
  ctx.lineTo(bgX + bgWidth, bgY + bgHeight - radius)
  ctx.quadraticCurveTo(bgX + bgWidth, bgY + bgHeight, bgX + bgWidth - radius, bgY + bgHeight)
  ctx.lineTo(bgX + radius, bgY + bgHeight)
  ctx.quadraticCurveTo(bgX, bgY + bgHeight, bgX, bgY + bgHeight - radius)
  ctx.lineTo(bgX, bgY + radius)
  ctx.quadraticCurveTo(bgX, bgY, bgX + radius, bgY)
  ctx.closePath()
  ctx.fill()

  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  // Border with element color
  ctx.strokeStyle = element.color + '40'
  ctx.lineWidth = Math.max(1, 1.5 / zoom)
  ctx.stroke()

  // Subtle inner border
  ctx.strokeStyle = element.color + '20'
  ctx.lineWidth = Math.max(0.5, 1 / zoom)
  ctx.stroke()

  ctx.restore()

  // Text with element color
  ctx.fillStyle = element.color
  ctx.shadowColor = 'rgba(255,255,255,0.5)'
  ctx.shadowBlur = Math.max(1, 2 / zoom)
  ctx.fillText(element.name, element.x, textY)
  ctx.shadowBlur = 0
}

// Helper functions

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1]!, 16),
        g: parseInt(result[2]!, 16),
        b: parseInt(result[3]!, 16),
      }
    : { r: 0, g: 0, b: 0 }
}

function rgbToString(rgb: { r: number; g: number; b: number }, alpha: number = 1): string {
  return `rgba(${Math.round(rgb.r)},${Math.round(rgb.g)},${Math.round(rgb.b)},${alpha})`
}

function lightenColor(rgb: { r: number; g: number; b: number }, percent: number) {
  return {
    r: Math.min(255, rgb.r + (255 - rgb.r) * (percent / 100)),
    g: Math.min(255, rgb.g + (255 - rgb.g) * (percent / 100)),
    b: Math.min(255, rgb.b + (255 - rgb.b) * (percent / 100)),
  }
}

function darkenColor(rgb: { r: number; g: number; b: number }, percent: number) {
  return {
    r: Math.max(0, rgb.r * (1 - percent / 100)),
    g: Math.max(0, rgb.g * (1 - percent / 100)),
    b: Math.max(0, rgb.b * (1 - percent / 100)),
  }
}

function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex)
  return rgbToString(rgb, alpha)
}
