/**
 * Modern Canvas Composable with Performance Optimizations
 * - Virtual rendering for large canvases
 * - OffscreenCanvas support
 * - RequestAnimationFrame throttling
 * - Element culling
 */

import { ref, computed, watch, onMounted, onUnmounted, type Ref } from 'vue'
import { useThrottleFn, useRafFn } from '@vueuse/core'
import type { CanvasElement, CanvasSettings } from '@/types/canvas'
import { isElementInViewport } from '@/utils/canvas'

export interface UseCanvasOptions {
  canvasRef: Ref<HTMLCanvasElement | undefined>
  elements: Ref<CanvasElement[]>
  settings: Ref<CanvasSettings>
  zoom: Ref<number>
  pan: Ref<{ x: number; y: number }>
  showGrid: Ref<boolean>
}

export function useCanvas(options: UseCanvasOptions) {
  const { canvasRef, elements, settings, zoom, pan, showGrid } = options

  const ctx = ref<CanvasRenderingContext2D | null>(null)
  const offscreenCanvas = ref<OffscreenCanvas | null>(null)
  const offscreenCtx = ref<OffscreenCanvasRenderingContext2D | null>(null)
  const isDirty = ref(true)
  const isRendering = ref(false)

  // Performance metrics
  const fps = ref(60)
  const renderTime = ref(0)
  const lastFrameTime = ref(0)

  // Viewport culling
  const visibleElements = computed(() => {
    if (!canvasRef.value) return elements.value

    const rect = canvasRef.value.getBoundingClientRect()
    return elements.value.filter(el =>
      isElementInViewport(
        el,
        -pan.value.x / zoom.value,
        -pan.value.y / zoom.value,
        rect.width / zoom.value,
        rect.height / zoom.value,
        zoom.value
      )
    )
  })

  // Initialize canvas contexts
  const initCanvas = () => {
    if (!canvasRef.value) return false

    const canvas = canvasRef.value
    const context = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true, // Better performance
    })

    if (!context) return false

    ctx.value = context

    // Try to create offscreen canvas for better performance
    if (typeof OffscreenCanvas !== 'undefined') {
      try {
        offscreenCanvas.value = new OffscreenCanvas(canvas.width, canvas.height)
        offscreenCtx.value = offscreenCanvas.value.getContext('2d', {
          alpha: false,
        }) as OffscreenCanvasRenderingContext2D
      } catch (e) {
        console.warn('OffscreenCanvas not supported, falling back to regular canvas')
      }
    }

    return true
  }

  // Resize canvas with device pixel ratio
  const resizeCanvas = () => {
    if (!canvasRef.value || !ctx.value) return

    const canvas = canvasRef.value
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    ctx.value.scale(dpr, dpr)

    // Resize offscreen canvas if available
    if (offscreenCanvas.value && offscreenCtx.value) {
      offscreenCanvas.value.width = canvas.width
      offscreenCanvas.value.height = canvas.height
      offscreenCtx.value.scale(dpr, dpr)
    }

    isDirty.value = true
  }

  // Optimized render function
  const render = () => {
    if (!ctx.value || !canvasRef.value || isRendering.value) return

    const startTime = performance.now()
    isRendering.value = true

    try {
      const canvas = canvasRef.value
      const rect = canvas.getBoundingClientRect()
      const context = ctx.value
      const dark = document.documentElement.classList.contains('dark')

      // Clear canvas
      context.clearRect(0, 0, rect.width, rect.height)

      // Background
      context.fillStyle = dark ? '#0f172a' : '#f8fafc'
      context.fillRect(0, 0, rect.width, rect.height)

      if (!settings.value) return

      // Apply transformations
      context.save()
      context.translate(pan.value.x, pan.value.y)
      context.scale(zoom.value, zoom.value)

      // Draw grid if enabled
      if (showGrid.value) {
        drawGrid(context, rect, dark)
      }

      // Draw canvas boundary
      drawCanvasBoundary(context, dark)

      // Draw only visible elements (culling optimization)
      visibleElements.value.forEach(element => {
        drawElement(context, element, dark)
      })

      context.restore()

      isDirty.value = false
    } finally {
      isRendering.value = false

      // Update performance metrics
      const endTime = performance.now()
      renderTime.value = endTime - startTime

      if (lastFrameTime.value > 0) {
        const frameDuration = endTime - lastFrameTime.value
        fps.value = Math.round(1000 / frameDuration)
      }
      lastFrameTime.value = endTime
    }
  }

  // Throttled render for better performance
  const throttledRender = useThrottleFn(render, 16) // ~60fps

  // Request animation frame render
  const { pause: pauseRaf, resume: resumeRaf } = useRafFn(
    () => {
      if (isDirty.value) {
        render()
      }
    },
    { immediate: false }
  )

  // Draw grid
  const drawGrid = (context: CanvasRenderingContext2D, _rect: DOMRect, dark: boolean) => {
    if (!settings.value) return

    const { gridSizeMeters, pixelsPerMeter, widthMeters, heightMeters } = settings.value
    const gridSizePx = gridSizeMeters * pixelsPerMeter
    const canvasWidthPx = widthMeters * pixelsPerMeter
    const canvasHeightPx = heightMeters * pixelsPerMeter

    // Skip if too zoomed out
    if (zoom.value < 0.1) return

    // Adjust grid density based on zoom
    const minGridSpacing = 10
    const actualGridSize = gridSizePx * zoom.value
    const gridStep =
      actualGridSize < minGridSpacing
        ? Math.ceil(minGridSpacing / actualGridSize) * gridSizeMeters
        : gridSizeMeters

    const adjustedGridSizePx = gridStep * pixelsPerMeter

    // Minor grid lines
    context.strokeStyle = dark ? 'rgba(71,85,105,0.3)' : 'rgba(203,213,225,0.5)'
    context.lineWidth = Math.max(0.5, 1 / zoom.value)

    for (let x = 0; x <= canvasWidthPx; x += adjustedGridSizePx) {
      context.beginPath()
      context.moveTo(x, 0)
      context.lineTo(x, canvasHeightPx)
      context.stroke()
    }

    for (let y = 0; y <= canvasHeightPx; y += adjustedGridSizePx) {
      context.beginPath()
      context.moveTo(0, y)
      context.lineTo(canvasWidthPx, y)
      context.stroke()
    }

    // Major grid lines
    context.strokeStyle = dark ? 'rgba(100,116,139,0.6)' : 'rgba(148,163,184,0.8)'
    context.lineWidth = Math.max(1, 2 / zoom.value)

    const majorGridSize = adjustedGridSizePx * 5
    const shouldDrawLabels = zoom.value > 0.3

    for (let x = 0; x <= canvasWidthPx; x += majorGridSize) {
      context.beginPath()
      context.moveTo(x, 0)
      context.lineTo(x, canvasHeightPx)
      context.stroke()

      if (x > 0 && shouldDrawLabels) {
        const meters = Math.round(x / pixelsPerMeter)
        context.save()
        context.fillStyle = dark ? 'rgba(148,163,184,0.8)' : 'rgba(100,116,139,0.8)'
        context.font = `bold ${Math.max(8, 10 / zoom.value)}px sans-serif`
        context.textAlign = 'center'
        context.fillText(`${meters}m`, x, Math.max(12, 15 / zoom.value))
        context.restore()
      }
    }

    for (let y = 0; y <= canvasHeightPx; y += majorGridSize) {
      context.beginPath()
      context.moveTo(0, y)
      context.lineTo(canvasWidthPx, y)
      context.stroke()

      if (y > 0 && shouldDrawLabels) {
        const meters = Math.round(y / pixelsPerMeter)
        context.save()
        context.fillStyle = dark ? 'rgba(148,163,184,0.8)' : 'rgba(100,116,139,0.8)'
        context.font = `bold ${Math.max(8, 10 / zoom.value)}px sans-serif`
        context.textAlign = 'left'
        context.fillText(`${meters}m`, Math.max(3, 5 / zoom.value), y - Math.max(3, 5 / zoom.value))
        context.restore()
      }
    }
  }

  // Draw canvas boundary
  const drawCanvasBoundary = (context: CanvasRenderingContext2D, dark: boolean) => {
    if (!settings.value) return

    const { widthMeters, heightMeters, pixelsPerMeter } = settings.value
    const canvasWidthPx = widthMeters * pixelsPerMeter
    const canvasHeightPx = heightMeters * pixelsPerMeter

    context.strokeStyle = dark ? 'rgba(251,191,36,0.8)' : 'rgba(245,158,11,0.8)'
    context.lineWidth = Math.max(2, 4 / zoom.value)
    context.setLineDash([10 / zoom.value, 5 / zoom.value])
    context.strokeRect(0, 0, canvasWidthPx, canvasHeightPx)
    context.setLineDash([])

    context.fillStyle = dark ? 'rgba(15,23,42,0.3)' : 'rgba(248,250,252,0.3)'
    context.fillRect(0, 0, canvasWidthPx, canvasHeightPx)

    // Dimension labels
    if (zoom.value > 0.2) {
      context.save()
      context.fillStyle = dark ? 'rgba(251,191,36,0.9)' : 'rgba(245,158,11,0.9)'
      context.font = `bold ${Math.max(12, 16 / zoom.value)}px sans-serif`
      context.textAlign = 'center'
      context.textBaseline = 'middle'

      context.fillText(
        `${widthMeters}m`,
        canvasWidthPx / 2,
        canvasHeightPx + Math.max(15, 20 / zoom.value)
      )

      context.save()
      context.translate(canvasWidthPx + Math.max(15, 20 / zoom.value), canvasHeightPx / 2)
      context.rotate(-Math.PI / 2)
      context.fillText(`${heightMeters}m`, 0, 0)
      context.restore()

      context.restore()
    }
  }

  // Draw element
  const drawElement = (
    context: CanvasRenderingContext2D,
    element: CanvasElement,
    dark: boolean
  ) => {
    context.save()
    context.globalAlpha = element.opacity || 1

    const color = element.color

    if (element.shape === 'line' && element.path && element.path.length > 1) {
      context.strokeStyle = color
      context.lineWidth = element.size / zoom.value
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.shadowColor = color
      context.shadowBlur = 10 / zoom.value

      context.beginPath()
      context.moveTo(element.path[0]!.x, element.path[0]!.y)
      for (let i = 1; i < element.path.length; i++) {
        context.lineTo(element.path[i]!.x, element.path[i]!.y)
      }
      context.stroke()
    } else if (element.shape === 'circle') {
      const radius = element.size / 2

      // Gradient fill
      const gradient = context.createRadialGradient(
        element.x,
        element.y,
        0,
        element.x,
        element.y,
        radius
      )
      gradient.addColorStop(0, hexToRgba(color, 0.3))
      gradient.addColorStop(1, hexToRgba(color, 0.1))

      context.fillStyle = gradient
      context.beginPath()
      context.arc(element.x, element.y, radius, 0, Math.PI * 2)
      context.fill()

      // Stroke
      context.strokeStyle = color
      context.lineWidth = 2 / zoom.value
      context.shadowColor = color
      context.shadowBlur = 8 / zoom.value
      context.beginPath()
      context.arc(element.x, element.y, radius, 0, Math.PI * 2)
      context.stroke()
    } else {
      const halfSize = element.size / 2

      // Gradient fill
      const gradient = context.createRadialGradient(
        element.x,
        element.y,
        0,
        element.x,
        element.y,
        halfSize
      )
      gradient.addColorStop(0, hexToRgba(color, 0.3))
      gradient.addColorStop(1, hexToRgba(color, 0.1))

      context.fillStyle = gradient
      context.fillRect(element.x - halfSize, element.y - halfSize, element.size, element.size)

      // Stroke
      context.strokeStyle = color
      context.lineWidth = 2 / zoom.value
      context.shadowColor = color
      context.shadowBlur = 8 / zoom.value
      context.strokeRect(element.x - halfSize, element.y - halfSize, element.size, element.size)
    }

    // Draw label
    if (element.name && element.shape !== 'line') {
      const fontSize = 12 / zoom.value
      context.font = `bold ${fontSize}px sans-serif`
      context.textAlign = 'center'
      context.textBaseline = 'top'
      context.shadowBlur = 0

      const textY = element.y + element.size / 2 + 8 / zoom.value

      context.strokeStyle = dark ? '#000' : '#fff'
      context.lineWidth = 3 / zoom.value
      context.strokeText(element.name, element.x, textY)

      context.fillStyle = dark ? '#fff' : '#000'
      context.fillText(element.name, element.x, textY)
    }

    context.restore()
  }

  // Helper: hex to rgba
  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }

  // Mark canvas as dirty when dependencies change
  watch(
    [elements, settings, zoom, pan, showGrid],
    () => {
      isDirty.value = true
    },
    { deep: true }
  )

  // Setup
  onMounted(() => {
    if (initCanvas()) {
      resizeCanvas()
      resumeRaf()

      window.addEventListener('resize', resizeCanvas)
    }
  })

  // Cleanup
  onUnmounted(() => {
    pauseRaf()
    window.removeEventListener('resize', resizeCanvas)
  })

  return {
    ctx,
    render: throttledRender,
    resizeCanvas,
    isDirty,
    fps,
    renderTime,
    visibleElements,
  }
}
