import { ref, reactive, computed } from 'vue'
import type {
  CanvasElement,
  DrawingTool,
  Plant,
  Terrain,
  Structure,
  BrushSettings,
  CanvasSettings,
} from '@/types/canvas'

export function useCanvasInteraction(
  canvasEl: HTMLCanvasElement | undefined,
  zoom: number,
  pan: { x: number; y: number },
  selectedTool: DrawingTool | null,
  selectedElement: Plant | Terrain | Structure | null,
  brushSettings: BrushSettings,
  canvasSettings: CanvasSettings | undefined
) {
  const isDrawing = ref(false)
  const isPanning = ref(false)
  const currentPath = ref<{ x: number; y: number }[]>([])
  const lastPos = reactive({ x: 0, y: 0 })
  const touches = reactive(new Map<number, { x: number; y: number }>())
  const initialPinch = reactive({ dist: 0, zoom: 1, pan: { x: 0, y: 0 } })

  const cursor = computed(() => {
    if (isPanning.value) return 'grabbing'
    if (selectedElement) return 'crosshair'
    if (selectedTool) return 'crosshair'
    return 'grab'
  })

  const shouldHideCursor = computed(() => {
    return selectedElement !== null || selectedTool !== null
  })

  const toWorld = (sx: number, sy: number) => ({
    x: (sx - pan.x) / zoom,
    y: (sy - pan.y) / zoom,
  })

  const getType = (el: Plant | Terrain | Structure): 'plant' | 'terrain' | 'structure' => {
    if ('category' in el) return 'plant'
    if ('type' in el && el.type.includes('Solo')) return 'terrain'
    return 'structure'
  }

  const getColor = (type: 'plant' | 'terrain' | 'structure') => {
    const colors = {
      plant: '#22c55e',
      terrain: '#f59e0b',
      structure: '#3b82f6',
    }
    return colors[type] || '#6b7280'
  }

  const getSize = () => {
    if (!selectedElement || !canvasSettings) return 30
    const ppm = canvasSettings.pixelsPerMeter

    if ('canopyDiameterMeters' in selectedElement) {
      return selectedElement.canopyDiameterMeters * ppm
    }
    if ('widthMeters' in selectedElement) {
      return selectedElement.widthMeters * ppm
    }
    return ppm
  }

  return {
    isDrawing,
    isPanning,
    currentPath,
    lastPos,
    touches,
    initialPinch,
    cursor,
    shouldHideCursor,
    toWorld,
    getType,
    getColor,
    getSize,
  }
}
