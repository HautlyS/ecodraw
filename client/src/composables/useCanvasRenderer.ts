import { GridRenderer } from '@/components/canvas/renderers/GridRenderer'
import { ElementRenderer } from '@/components/canvas/renderers/ElementRenderer'
import type { CanvasElement, CanvasSettings } from '@/types/canvas'

export function useCanvasRenderer() {
  const gridRenderer = new GridRenderer()
  const elementRenderer = new ElementRenderer()
  let rafId: number | null = null

  const scheduleRender = (
    ctx: CanvasRenderingContext2D | null,
    canvasEl: HTMLCanvasElement | undefined,
    elements: CanvasElement[],
    zoom: number,
    pan: { x: number; y: number },
    showGrid: boolean,
    canvasSettings?: CanvasSettings,
    currentPath?: { x: number; y: number }[]
  ) => {
    if (rafId !== null) return
    rafId = requestAnimationFrame(() => {
      renderImmediate(ctx, canvasEl, elements, zoom, pan, showGrid, canvasSettings, currentPath)
      rafId = null
    })
  }

  const render = (
    ctx: CanvasRenderingContext2D | null,
    canvasEl: HTMLCanvasElement | undefined,
    elements: CanvasElement[],
    zoom: number,
    pan: { x: number; y: number },
    showGrid: boolean,
    canvasSettings?: CanvasSettings,
    currentPath?: { x: number; y: number }[]
  ) => {
    scheduleRender(ctx, canvasEl, elements, zoom, pan, showGrid, canvasSettings, currentPath)
  }

  const renderImmediate = (
    ctx: CanvasRenderingContext2D | null,
    canvasEl: HTMLCanvasElement | undefined,
    elements: CanvasElement[],
    zoom: number,
    pan: { x: number; y: number },
    showGrid: boolean,
    canvasSettings?: CanvasSettings,
    currentPath?: { x: number; y: number }[]
  ) => {
    if (!ctx || !canvasEl) return

    const rect = canvasEl.getBoundingClientRect()
    ctx.clearRect(0, 0, rect.width, rect.height)

    const isDark = document.documentElement.classList.contains('dark')

    // Background
    ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc'
    ctx.fillRect(0, 0, rect.width, rect.height)

    if (!canvasSettings) return

    // Apply zoom and pan
    ctx.save()
    ctx.translate(pan.x, pan.y)
    ctx.scale(zoom, zoom)

    // Draw grid
    if (showGrid) {
      gridRenderer.draw(ctx, canvasSettings, zoom, isDark)
    }

    // Draw canvas boundary
    const { widthMeters, heightMeters, pixelsPerMeter } = canvasSettings
    const canvasWidthPx = widthMeters * pixelsPerMeter
    const canvasHeightPx = heightMeters * pixelsPerMeter

    ctx.strokeStyle = isDark ? 'rgba(251,191,36,0.8)' : 'rgba(245,158,11,0.8)'
    ctx.lineWidth = Math.max(2, 4 / zoom)
    ctx.setLineDash([10 / zoom, 5 / zoom])
    ctx.strokeRect(0, 0, canvasWidthPx, canvasHeightPx)
    ctx.setLineDash([])

    ctx.fillStyle = isDark ? 'rgba(15,23,42,0.3)' : 'rgba(248,250,252,0.3)'
    ctx.fillRect(0, 0, canvasWidthPx, canvasHeightPx)

    // Dimension labels
    if (zoom > 0.2) {
      ctx.save()
      ctx.fillStyle = isDark ? 'rgba(251,191,36,0.9)' : 'rgba(245,158,11,0.9)'
      ctx.font = `bold ${Math.max(12, 16 / zoom)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      ctx.fillText(`${widthMeters}m`, canvasWidthPx / 2, canvasHeightPx + Math.max(15, 20 / zoom))

      ctx.save()
      ctx.translate(canvasWidthPx + Math.max(15, 20 / zoom), canvasHeightPx / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText(`${heightMeters}m`, 0, 0)
      ctx.restore()

      ctx.restore()
    }

    // Draw elements
    elements.forEach(el => elementRenderer.draw(ctx, el, zoom, isDark))

    // Draw current path
    if (currentPath && currentPath.length > 1 && currentPath[0]) {
      ctx.strokeStyle = '#22c55e'
      ctx.lineWidth = 2 / zoom
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.globalAlpha = 0.7
      ctx.beginPath()
      ctx.moveTo(currentPath[0].x, currentPath[0].y)
      for (let i = 1; i < currentPath.length; i++) {
        const point = currentPath[i]
        if (point) {
          ctx.lineTo(point.x, point.y)
        }
      }
      ctx.stroke()
    }

    ctx.restore()
  }

  const resize = (
    canvasEl: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    pan: { x: number; y: number },
    zoom: number,
    canvasSettings?: CanvasSettings
  ) => {
    const rect = canvasEl.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvasEl.width = rect.width * dpr
    canvasEl.height = rect.height * dpr
    canvasEl.style.width = `${rect.width}px`
    canvasEl.style.height = `${rect.height}px`

    ctx.scale(dpr, dpr)

    if (canvasSettings) {
      const { widthMeters, heightMeters, pixelsPerMeter } = canvasSettings
      const canvasWidthPx = widthMeters * pixelsPerMeter
      const canvasHeightPx = heightMeters * pixelsPerMeter

      pan.x = (rect.width - canvasWidthPx * zoom) / 2
      pan.y = (rect.height - canvasHeightPx * zoom) / 2
    }
  }

  const cleanup = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  return {
    render,
    resize,
    cleanup,
  }
}
