import type { CanvasElement } from '@/types/canvas'

export class ElementRenderer {
  private getElementIcon(type: string, name: string): string {
    // Mapear elementos específicos para ícones
    const iconMap: Record<string, string> = {
      // Plantas
      Tomate: '🍅',
      Alface: '🥬',
      Cenoura: '🥕',
      Morango: '🍓',
      Pimentão: '🫑',
      Pepino: '🥒',
      Abóbora: '🎃',
      Milho: '🌽',
      Batata: '🥔',
      Cebola: '🧅',
      Alho: '🧄',
      Brócolis: '🥦',
      Berinjela: '🍆',
      Melancia: '🍉',
      Melão: '🍈',

      // Estruturas
      Cerca: '🚧',
      Portão: '🚪',
      Estufa: '🏠',
      Galpão: '🏚️',
      Composteira: '♻️',
      Reservatório: '💧',
      Irrigação: '💦',

      // Terreno
      Canteiro: '📦',
      Caminho: '🛤️',
      'Área de Descanso': '🪑',
    }

    return iconMap[name] || this.getDefaultIcon(type)
  }

  private getDefaultIcon(type: string): string {
    const defaults: Record<string, string> = {
      plant: '🌱',
      terrain: '🟫',
      structure: '🏗️',
    }
    return defaults[type] || '⬜'
  }

  draw(ctx: CanvasRenderingContext2D, element: CanvasElement, zoom: number, isDark: boolean) {
    ctx.save()
    ctx.globalAlpha = element.opacity || 1

    if (element.shape === 'line' && element.path && element.path.length > 1) {
      this.drawLine(ctx, element, zoom)
    } else {
      this.drawShape(ctx, element, zoom, isDark)
    }

    ctx.restore()
  }

  private drawLine(ctx: CanvasRenderingContext2D, element: CanvasElement, zoom: number) {
    if (!element.path) return

    ctx.strokeStyle = element.color
    ctx.lineWidth = element.size / zoom
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowColor = element.color
    ctx.shadowBlur = 10 / zoom

    ctx.beginPath()
    ctx.moveTo(element.path[0].x, element.path[0].y)
    for (let i = 1; i < element.path.length; i++) {
      ctx.lineTo(element.path[i].x, element.path[i].y)
    }
    ctx.stroke()
  }

  private drawShape(
    ctx: CanvasRenderingContext2D,
    element: CanvasElement,
    zoom: number,
    isDark: boolean
  ) {
    const radius = element.size / 2

    // Desenhar fundo com gradiente
    if (element.shape === 'circle') {
      const gradient = ctx.createRadialGradient(
        element.x,
        element.y,
        0,
        element.x,
        element.y,
        radius
      )
      gradient.addColorStop(0, this.rgba(element.color, 0.4))
      gradient.addColorStop(1, this.rgba(element.color, 0.1))

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(element.x, element.y, radius, 0, Math.PI * 2)
      ctx.fill()

      // Borda
      ctx.strokeStyle = element.color
      ctx.lineWidth = 2 / zoom
      ctx.shadowColor = element.color
      ctx.shadowBlur = 8 / zoom
      ctx.beginPath()
      ctx.arc(element.x, element.y, radius, 0, Math.PI * 2)
      ctx.stroke()
    } else {
      // Quadrado/Retângulo
      const halfSize = element.size / 2
      const gradient = ctx.createRadialGradient(
        element.x,
        element.y,
        0,
        element.x,
        element.y,
        halfSize
      )
      gradient.addColorStop(0, this.rgba(element.color, 0.4))
      gradient.addColorStop(1, this.rgba(element.color, 0.1))

      ctx.fillStyle = gradient
      ctx.fillRect(element.x - halfSize, element.y - halfSize, element.size, element.size)

      // Borda
      ctx.strokeStyle = element.color
      ctx.lineWidth = 2 / zoom
      ctx.shadowColor = element.color
      ctx.shadowBlur = 8 / zoom
      ctx.strokeRect(element.x - halfSize, element.y - halfSize, element.size, element.size)
    }

    // Desenhar ícone do elemento
    if (zoom > 0.3) {
      const icon = this.getElementIcon(element.type, element.name)
      const fontSize = Math.max(12, Math.min(element.size * 0.6, 48)) / zoom

      ctx.save()
      ctx.shadowBlur = 0
      ctx.font = `${fontSize}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(icon, element.x, element.y)
      ctx.restore()
    }

    // Desenhar nome do elemento
    if (element.name && element.shape !== 'line' && zoom > 0.4) {
      const fontSize = 12 / zoom
      ctx.font = `bold ${fontSize}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.shadowBlur = 0

      const textY = element.y + element.size / 2 + 8 / zoom

      // Contorno do texto
      ctx.strokeStyle = isDark ? '#000' : '#fff'
      ctx.lineWidth = 3 / zoom
      ctx.strokeText(element.name, element.x, textY)

      // Texto
      ctx.fillStyle = isDark ? '#fff' : '#000'
      ctx.fillText(element.name, element.x, textY)
    }
  }

  private rgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }
}
