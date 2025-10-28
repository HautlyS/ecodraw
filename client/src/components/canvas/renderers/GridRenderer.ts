import type { CanvasSettings } from '@/types/canvas'

export class GridRenderer {
  draw(
    ctx: CanvasRenderingContext2D,
    canvasSettings: CanvasSettings,
    zoom: number,
    isDark: boolean
  ) {
    const { gridSizeMeters, pixelsPerMeter, widthMeters, heightMeters } = canvasSettings
    const gridSizePx = gridSizeMeters * pixelsPerMeter
    const canvasWidthPx = widthMeters * pixelsPerMeter
    const canvasHeightPx = heightMeters * pixelsPerMeter

    // Skip grid if too zoomed out
    if (zoom < 0.1) return

    // Adjust grid density based on zoom
    const minGridSpacing = 10
    const actualGridSize = gridSizePx * zoom
    const gridStep =
      actualGridSize < minGridSpacing
        ? Math.ceil(minGridSpacing / actualGridSize) * gridSizeMeters
        : gridSizeMeters

    const adjustedGridSizePx = gridStep * pixelsPerMeter

    // Minor grid lines
    ctx.strokeStyle = isDark ? 'rgba(71,85,105,0.3)' : 'rgba(203,213,225,0.5)'
    ctx.lineWidth = Math.max(0.5, 1 / zoom)

    for (let x = 0; x <= canvasWidthPx; x += adjustedGridSizePx) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasHeightPx)
      ctx.stroke()
    }

    for (let y = 0; y <= canvasHeightPx; y += adjustedGridSizePx) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasWidthPx, y)
      ctx.stroke()
    }

    // Major grid lines
    ctx.strokeStyle = isDark ? 'rgba(100,116,139,0.6)' : 'rgba(148,163,184,0.8)'
    ctx.lineWidth = Math.max(1, 2 / zoom)

    const majorGridSize = adjustedGridSizePx * 5
    const shouldDrawLabels = zoom > 0.3

    for (let x = 0; x <= canvasWidthPx; x += majorGridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvasHeightPx)
      ctx.stroke()

      if (x > 0 && shouldDrawLabels) {
        const meters = Math.round(x / pixelsPerMeter)
        ctx.save()
        ctx.fillStyle = isDark ? 'rgba(148,163,184,0.8)' : 'rgba(100,116,139,0.8)'
        ctx.font = `bold ${Math.max(8, 10 / zoom)}px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(`${meters}m`, x, Math.max(12, 15 / zoom))
        ctx.restore()
      }
    }

    for (let y = 0; y <= canvasHeightPx; y += majorGridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasWidthPx, y)
      ctx.stroke()

      if (y > 0 && shouldDrawLabels) {
        const meters = Math.round(y / pixelsPerMeter)
        ctx.save()
        ctx.fillStyle = isDark ? 'rgba(148,163,184,0.8)' : 'rgba(100,116,139,0.8)'
        ctx.font = `bold ${Math.max(8, 10 / zoom)}px sans-serif`
        ctx.textAlign = 'left'
        ctx.fillText(`${meters}m`, Math.max(3, 5 / zoom), y - Math.max(3, 5 / zoom))
        ctx.restore()
      }
    }
  }
}
