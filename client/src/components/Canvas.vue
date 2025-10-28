<template>
  <!-- Background -->
  <div
    class="w-full h-full relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-black dark:to-gray-950"
  >
    <!-- Draggable Canvas Window -->
    <div
      ref="windowElement"
      :style="{
        left: windowPosition.x + 'px',
        top: windowPosition.y + 'px',
        width: windowSize.width + 'px',
        height: windowSize.height + 'px',
      }"
      class="absolute bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden pointer-events-auto"
      :class="{ 'select-none': isDragging || isResizing }"
      @mousedown.stop
    >
      <!-- Resize Handles - Corner handles (visible) -->
      <div
        v-if="!isMaximized"
        class="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50 bg-blue-500 opacity-0 hover:opacity-100 transition-opacity rounded-tl-lg resize-handle"
        @mousedown.stop="startResize($event, 'nw')"
        title="Resize"
        aria-label="Redimensionar canto superior esquerdo"
      ></div>
      <div
        v-if="!isMaximized"
        class="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50 bg-blue-500 opacity-0 hover:opacity-100 transition-opacity rounded-tr-lg resize-handle"
        @mousedown.stop="startResize($event, 'ne')"
        title="Resize"
        aria-label="Redimensionar canto superior direito"
      ></div>
      <div
        v-if="!isMaximized"
        class="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50 bg-blue-500 opacity-0 hover:opacity-100 transition-opacity rounded-bl-lg resize-handle"
        @mousedown.stop="startResize($event, 'sw')"
        title="Resize"
        aria-label="Redimensionar canto inferior esquerdo"
      ></div>
      <div
        v-if="!isMaximized"
        class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 bg-blue-500 opacity-0 hover:opacity-100 transition-opacity rounded-br-lg resize-handle"
        @mousedown.stop="startResize($event, 'se')"
        title="Resize"
        aria-label="Redimensionar canto inferior direito"
      ></div>

      <!-- Edge resize handles (invisible but functional) -->
      <div
        v-if="!isMaximized"
        class="absolute top-0 left-4 right-4 h-2 cursor-n-resize z-40"
        @mousedown.stop="startResize($event, 'n')"
        aria-label="Redimensionar borda superior"
      ></div>
      <div
        v-if="!isMaximized"
        class="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize z-40"
        @mousedown.stop="startResize($event, 's')"
        aria-label="Redimensionar borda inferior"
      ></div>
      <div
        v-if="!isMaximized"
        class="absolute left-0 top-4 bottom-4 w-2 cursor-w-resize z-40"
        @mousedown.stop="startResize($event, 'w')"
        aria-label="Redimensionar borda esquerda"
      ></div>
      <div
        v-if="!isMaximized"
        class="absolute right-0 top-4 bottom-4 w-2 cursor-e-resize z-40"
        @mousedown.stop="startResize($event, 'e')"
        aria-label="Redimensionar borda direita"
      ></div>
      <!-- Window Header -->
      <div
        ref="headerElement"
        class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 cursor-move select-none"
        @mousedown.stop="startDrag"
      >
        <div class="flex items-center gap-3">
          <!-- Window Controls -->
          <div class="flex gap-2">
            <button
              @click.stop="minimizeWindow"
              class="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
              title="Minimize"
              aria-label="Minimizar janela"
              role="button"
            ></button>
            <button
              @click.stop="maximizeWindow"
              class="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
              title="Maximize/Restore"
              aria-label="Maximizar ou restaurar janela"
              role="button"
            ></button>
          </div>

          <div class="flex items-center gap-2">
            <Icon icon="mdi:canvas" class="w-5 h-5 text-amber-600" />
            <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Canvas</h3>
            </div>
          </div>
        </div>

        <!-- Canvas Info -->
        <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div v-if="canvasSettings" class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span class="font-medium"
              >{{ canvasSettings.widthMeters }}m × {{ canvasSettings.heightMeters }}m</span
            >
          </div>
          <div
            class="flex items-center gap-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded"
          >
            <Icon icon="mdi:magnify" class="w-3 h-3 text-purple-600 dark:text-purple-400" />
            <span class="font-bold text-purple-700 dark:text-purple-300"
              >{{ Math.round(zoom * 100) }}%</span
            >
          </div>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-orange-500"></div>
            <span class="font-medium">Elements: {{ elements.length }}</span>
          </div>
        </div>

        <!-- Window Actions -->
        <div class="flex items-center gap-2">
          <!-- Canvas Settings Button -->
          <button
            @click.stop="$emit('open-settings')"
            class="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all shadow-sm"
            title="Canvas Settings (Size, Grid, etc.)"
            aria-label="Configurações do canvas"
          >
            <Icon icon="mdi:cog" class="w-4 h-4" />
          </button>

          <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

          <button
            @click.stop="toggleGrid"
            :class="[
              'p-1.5 rounded transition-all',
              showGrid
                ? 'bg-amber-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
            ]"
            title="Toggle Grid"
            aria-label="Alternar grade"
          >
            <Icon icon="mdi:grid" class="w-4 h-4" />
          </button>

          <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

          <button
            @click.stop="fitToView"
            class="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-all shadow-sm"
            title="Fit to View (See entire canvas)"
            aria-label="Ajustar à visualização"
          >
            <Icon icon="mdi:fit-to-screen" class="w-4 h-4" />
          </button>
          <button
            @click.stop="zoom = Math.min(3, zoom * 1.2)"
            class="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            title="Zoom In (Entire Canvas)"
            aria-label="Aumentar zoom"
          >
            <Icon icon="mdi:plus" class="w-4 h-4" />
          </button>
          <button
            @click.stop="zoom = Math.max(0.05, zoom / 1.2)"
            class="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            title="Zoom Out (Entire Canvas)"
            aria-label="Diminuir zoom"
          >
            <Icon icon="mdi:minus" class="w-4 h-4" />
          </button>
          <button
            @click.stop="resetView"
            class="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            title="Reset View (1:1)"
            aria-label="Resetar visualização"
          >
            <Icon icon="mdi:restore" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Canvas Content -->
      <div
        class="relative w-full h-full bg-gray-50 dark:bg-gray-900 overflow-hidden"
        style="height: calc(100% - 52px)"
      >
        <canvas
          ref="canvasEl"
          class="w-full h-full block"
          style="margin: 0; padding: 0; border: 0; display: block"
          :style="{ cursor: shouldHideCursor ? 'none' : cursor }"
          @mousedown="onMouseDown"
          @mousemove="onMouseMove"
          @mouseup="onMouseUp"
          @mouseleave="onMouseUp"
          @wheel.prevent="onWheel"
          @dragover.prevent
          @drop.prevent="onDrop"
          @touchstart.prevent="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend.prevent="onTouchEnd"
        />

        <!-- Empty State -->
        <div
          v-if="elements.length === 0"
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div class="text-center space-y-4 opacity-50 animate-fade-in">
            <Icon icon="mdi:sprout" class="w-20 h-20 mx-auto text-green-500 animate-bounce-slow" />
            <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300">
              Comece a Planejar
            </h3>
            <p class="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
              Selecione uma ferramenta e arraste elementos da biblioteca para o canvas
            </p>
          </div>
        </div>

        <!-- Zoom Control Bar -->
        <div
          class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center gap-3 pointer-events-auto"
        >
          <button
            @click.stop="zoom = Math.max(0.05, zoom / 1.2)"
            class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Zoom Out (Entire Canvas)"
            aria-label="Diminuir zoom"
          >
            <Icon icon="mdi:minus" class="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>

          <input
            type="range"
            :value="zoom"
            @input="zoom = Number(($event.target as HTMLInputElement).value)"
            min="0.05"
            max="3"
            step="0.05"
            class="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />

          <span class="text-xs font-bold text-purple-700 dark:text-purple-300 w-12 text-center">
            {{ Math.round(zoom * 100) }}%
          </span>

          <button
            @click="zoom = Math.min(3, zoom * 1.2)"
            class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Zoom In (Entire Canvas)"
          >
            <Icon icon="mdi:plus" class="w-4 h-4 text-gray-700 dark:text-gray-300" />
          </button>

          <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

          <button
            @click="fitToView"
            class="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
            title="Fit Entire Canvas to View"
          >
            <Icon icon="mdi:fit-to-screen" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useCanvasDimensions } from '@/composables/useCanvasDimensions'
import type {
  Plant,
  Terrain,
  Structure,
  CanvasElement,
  DrawingTool,
  BrushSettings,
} from '@/types/canvas'

interface Props {
  selectedTool: DrawingTool | null
  selectedElement: Plant | Terrain | Structure | null
  brushSettings: BrushSettings
  canvasSettings?: {
    widthMeters: number
    heightMeters: number
    gridSizeMeters: number
    showGrid: boolean
    snapToGrid: boolean
    pixelsPerMeter: number
  }
}
const props = defineProps<Props>()
const emit = defineEmits<{
  'history-change': [boolean, boolean]
  'item-placed': []
  'canvas-hover': [boolean]
  'show-help': []
  'open-settings': []
  'grid-toggle': [boolean]
}>()

const canvasEl = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D | null>(null)
const elements = ref<CanvasElement[]>([])
const history = ref<CanvasElement[][]>([])
const historyIndex = ref(-1)
const zoom = ref(1)
const pan = reactive({ x: 0, y: 0 })
const showGrid = ref(true)
const isDrawing = ref(false)
const isPanning = ref(false)
const currentPath = ref<{ x: number; y: number }[]>([])
const lastPos = reactive({ x: 0, y: 0 })
const touches = reactive(new Map<number, { x: number; y: number }>())
const initialPinch = reactive({ dist: 0, zoom: 1, pan: { x: 0, y: 0 } })

// Window dragging state
const windowElement = ref<HTMLElement>()
const headerElement = ref<HTMLElement>()
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const windowPosition = ref({ x: 0, y: 0 })
const windowSize = ref({ width: 800, height: 600 })
const isMaximized = ref(false)
const savedWindowState = ref({ x: 0, y: 0, width: 800, height: 600 })

// Window resizing state
const isResizing = ref(false)
const resizeDirection = ref<string>('')
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 })

const cursor = computed(() => {
  // Panning mode
  if (isPanning.value) return 'grabbing'

  // Placing element - show appropriate icon
  if (props.selectedElement) {
    if ('category' in props.selectedElement) return 'crosshair' // Plant
    if ('type' in props.selectedElement && props.selectedElement.type.includes('Solo')) {
      return 'crosshair' // Terrain
    }
    return 'crosshair' // Structure
  }

  // Drawing tool
  if (props.selectedTool) return 'crosshair'

  // Default - allow panning
  return 'grab'
})

// Hide default cursor when custom cursor should be shown
const shouldHideCursor = computed(() => {
  return props.selectedElement !== null || props.selectedTool !== null
})

// Window size constants
const MIN_WINDOW_WIDTH = 400
const MIN_WINDOW_HEIGHT = 300
const DEFAULT_WINDOW_WIDTH = 900
const DEFAULT_WINDOW_HEIGHT = 700
const MIN_VISIBLE_PIXELS = 100
const HEADER_HEIGHT = 52

// Window management
const startDrag = (event: MouseEvent) => {
  // Don't drag if maximized or if clicking on buttons
  if (isMaximized.value) return

  const target = event.target as HTMLElement
  // Prevent drag if clicking on buttons or interactive elements
  if (target.tagName === 'BUTTON' || target.closest('button')) {
    return
  }

  event.preventDefault()
  event.stopPropagation()

  isDragging.value = true
  dragOffset.value = {
    x: event.clientX - windowPosition.value.x,
    y: event.clientY - windowPosition.value.y,
  }

  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

const handleDrag = (event: MouseEvent) => {
  if (!isDragging.value) return

  event.preventDefault()

  // Calculate new position
  let newX = event.clientX - dragOffset.value.x
  let newY = event.clientY - dragOffset.value.y

  // Get canvas container bounds (the parent element)
  const canvasContainer = windowElement.value?.parentElement
  if (canvasContainer) {
    const containerRect = canvasContainer.getBoundingClientRect()

    // Allow some overhang but keep window mostly visible
    const maxX = containerRect.width - MIN_VISIBLE_PIXELS
    const maxY = containerRect.height - MIN_VISIBLE_PIXELS

    // Constrain position
    newX = Math.max(-windowSize.value.width + MIN_VISIBLE_PIXELS, Math.min(newX, maxX))
    newY = Math.max(0, Math.min(newY, maxY))
  }

  windowPosition.value = { x: newX, y: newY }
}

const stopDrag = () => {
  if (!isDragging.value) return

  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)

  // Save the new position after drag completes
  if (!isMaximized.value) {
    savedWindowState.value = { ...windowPosition.value, ...windowSize.value }
  }
}

// Window resizing handlers
const startResize = (event: MouseEvent, direction: string) => {
  if (isMaximized.value) return

  event.stopPropagation()
  isResizing.value = true
  resizeDirection.value = direction
  resizeStart.value = {
    x: event.clientX,
    y: event.clientY,
    width: windowSize.value.width,
    height: windowSize.value.height,
    posX: windowPosition.value.x,
    posY: windowPosition.value.y,
  }

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

const handleResize = (event: MouseEvent) => {
  if (!isResizing.value) return

  event.preventDefault()

  const deltaX = event.clientX - resizeStart.value.x
  const deltaY = event.clientY - resizeStart.value.y

  let newWidth = resizeStart.value.width
  let newHeight = resizeStart.value.height
  let newX = resizeStart.value.posX
  let newY = resizeStart.value.posY

  const minWidth = MIN_WINDOW_WIDTH
  const minHeight = MIN_WINDOW_HEIGHT

  // Get canvas container bounds for constraints
  const canvasContainer = windowElement.value?.parentElement
  const containerRect = canvasContainer?.getBoundingClientRect()

  // Handle different resize directions with boundary checks
  if (resizeDirection.value.includes('e')) {
    newWidth = Math.max(minWidth, resizeStart.value.width + deltaX)
    // Constrain to right edge
    if (containerRect && newX + newWidth > containerRect.width) {
      newWidth = containerRect.width - newX
    }
  }

  if (resizeDirection.value.includes('w')) {
    const potentialWidth = resizeStart.value.width - deltaX
    const potentialX = resizeStart.value.posX + deltaX

    // Check minimum width and left boundary
    if (potentialWidth >= minWidth && potentialX >= 0) {
      newWidth = potentialWidth
      newX = potentialX
    } else if (potentialX < 0) {
      // Hit left boundary - expand from left edge
      newWidth = resizeStart.value.width + resizeStart.value.posX
      newX = 0
    }
  }

  if (resizeDirection.value.includes('s')) {
    newHeight = Math.max(minHeight, resizeStart.value.height + deltaY)
    // Constrain to bottom edge
    if (containerRect && newY + newHeight > containerRect.height) {
      newHeight = containerRect.height - newY
    }
  }

  if (resizeDirection.value.includes('n')) {
    const potentialHeight = resizeStart.value.height - deltaY
    const potentialY = resizeStart.value.posY + deltaY

    // Check minimum height and top boundary
    if (potentialHeight >= minHeight && potentialY >= 0) {
      newHeight = potentialHeight
      newY = potentialY
    } else if (potentialY < 0) {
      // Hit top boundary - expand from top edge
      newHeight = resizeStart.value.height + resizeStart.value.posY
      newY = 0
    }
  }

  // Final safety constraints
  newWidth = Math.max(minWidth, newWidth)
  newHeight = Math.max(minHeight, newHeight)

  windowSize.value = { width: newWidth, height: newHeight }
  windowPosition.value = { x: newX, y: newY }

  // Throttled resize for better performance
  requestAnimationFrame(() => resize())
}

const stopResize = () => {
  if (!isResizing.value) return

  isResizing.value = false
  resizeDirection.value = ''
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)

  // Save the new state after resize completes
  if (!isMaximized.value) {
    savedWindowState.value = { ...windowPosition.value, ...windowSize.value }
  }
}

const minimizeWindow = () => {
  // Save current state
  if (!isMaximized.value) {
    savedWindowState.value = { ...windowPosition.value, ...windowSize.value }
  }

  // Minimize to bottom-right corner
  windowSize.value = { width: 300, height: HEADER_HEIGHT }
  windowPosition.value = {
    x: window.innerWidth - 320,
    y: window.innerHeight - HEADER_HEIGHT - 20,
  }
  isMaximized.value = false
}

const maximizeWindow = () => {
  const canvasContainer = windowElement.value?.parentElement
  if (!canvasContainer) return

  const containerRect = canvasContainer.getBoundingClientRect()

  if (isMaximized.value) {
    // Restore to saved state
    windowPosition.value = {
      x: savedWindowState.value.x,
      y: savedWindowState.value.y,
    }
    windowSize.value = {
      width: savedWindowState.value.width,
      height: savedWindowState.value.height,
    }
    isMaximized.value = false
  } else {
    // Save current state before maximizing
    savedWindowState.value = { ...windowPosition.value, ...windowSize.value }

    // Maximize to fill the entire canvas container (100% of background)
    windowPosition.value = { x: 0, y: 0 }
    windowSize.value = {
      width: containerRect.width,
      height: containerRect.height,
    }
    isMaximized.value = true
  }
  nextTick(() => resize())
}

const resetView = () => {
  if (!canvasEl.value || !props.canvasSettings) return

  zoom.value = 1

  // Reset pan to center canvas content within the current window
  const rect = canvasEl.value.getBoundingClientRect()
  const { widthMeters, heightMeters, pixelsPerMeter } = props.canvasSettings
  const canvasWidthPx = widthMeters * pixelsPerMeter
  const canvasHeightPx = heightMeters * pixelsPerMeter

  pan.x = (rect.width - canvasWidthPx) / 2
  pan.y = Math.max(20, (rect.height - canvasHeightPx) / 2) // Center vertically if space allows

  render()
}

const fitToView = () => {
  if (!canvasEl.value || !props.canvasSettings) return

  const rect = canvasEl.value.getBoundingClientRect()
  const { widthMeters, heightMeters, pixelsPerMeter } = props.canvasSettings
  const canvasWidthPx = widthMeters * pixelsPerMeter
  const canvasHeightPx = heightMeters * pixelsPerMeter

  // Calculate zoom to fit entire canvas in view with padding
  const padding = 40 // pixels of padding around canvas
  const availableWidth = rect.width - padding * 2
  const availableHeight = rect.height - padding * 2

  const zoomX = availableWidth / canvasWidthPx
  const zoomY = availableHeight / canvasHeightPx

  // Use the smaller zoom to ensure entire canvas fits
  zoom.value = Math.min(zoomX, zoomY, 1.5) // Allow slight zoom in for better visibility
  zoom.value = Math.max(0.05, zoom.value) // Minimum zoom

  // Center the canvas with the new zoom
  const scaledWidth = canvasWidthPx * zoom.value
  const scaledHeight = canvasHeightPx * zoom.value

  pan.x = (rect.width - scaledWidth) / 2
  pan.y = (rect.height - scaledHeight) / 2

  render()
}

const init = () => {
  if (!canvasEl.value) return
  const c = canvasEl.value.getContext('2d', { alpha: false })
  if (!c) return
  ctx.value = c

  // Get canvas container bounds
  const canvasContainer = windowElement.value?.parentElement
  if (canvasContainer) {
    const containerRect = canvasContainer.getBoundingClientRect()

    // Default to 100% of canvas space (background area) - maximized
    windowSize.value = {
      width: containerRect.width,
      height: containerRect.height,
    }
    windowPosition.value = { x: 0, y: 0 }
    isMaximized.value = true

    // Save a reasonable default for when user un-maximizes
    savedWindowState.value = {
      x: Math.max(0, (containerRect.width - DEFAULT_WINDOW_WIDTH) / 2),
      y: Math.max(0, (containerRect.height - DEFAULT_WINDOW_HEIGHT) / 2),
      width: Math.min(DEFAULT_WINDOW_WIDTH, containerRect.width - 40),
      height: Math.min(DEFAULT_WINDOW_HEIGHT, containerRect.height - 40),
    }
  } else {
    // Fallback if container not found
    windowSize.value = { width: DEFAULT_WINDOW_WIDTH, height: DEFAULT_WINDOW_HEIGHT }
    windowPosition.value = {
      x: (window.innerWidth - DEFAULT_WINDOW_WIDTH) / 2,
      y: (window.innerHeight - DEFAULT_WINDOW_HEIGHT) / 2,
    }
    savedWindowState.value = { ...windowPosition.value, ...windowSize.value }
  }

  resize()
  window.addEventListener('resize', handleWindowResize)
}

const handleWindowResize = () => {
  const canvasContainer = windowElement.value?.parentElement
  if (!canvasContainer) return

  const containerRect = canvasContainer.getBoundingClientRect()

  if (!isMaximized.value) {
    // Keep window within bounds but don't auto-resize
    const maxX = Math.max(0, containerRect.width - MIN_VISIBLE_PIXELS)
    const maxY = Math.max(0, containerRect.height - MIN_VISIBLE_PIXELS)

    if (windowPosition.value.x > maxX) {
      windowPosition.value.x = maxX
    }
    if (windowPosition.value.y > maxY) {
      windowPosition.value.y = maxY
    }
  } else {
    // When maximized, fill the canvas container
    windowSize.value = {
      width: containerRect.width,
      height: containerRect.height,
    }
    windowPosition.value = { x: 0, y: 0 }
  }
  resize()
}

const resize = () => {
  if (!canvasEl.value || !ctx.value) return
  const rect = canvasEl.value.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1

  // Setting width/height clears the canvas and resets the context
  canvasEl.value.width = rect.width * dpr
  canvasEl.value.height = rect.height * dpr
  canvasEl.value.style.width = `${rect.width}px`
  canvasEl.value.style.height = `${rect.height}px`

  // Reapply DPR scaling after canvas reset
  ctx.value.scale(dpr, dpr)

  // Auto-center canvas content if settings are available
  if (props.canvasSettings) {
    // Recalculate pan to center the canvas content
    const { widthMeters, heightMeters, pixelsPerMeter } = props.canvasSettings
    const canvasWidthPx = widthMeters * pixelsPerMeter
    const canvasHeightPx = heightMeters * pixelsPerMeter

    // Center the canvas content within the available space
    pan.x = (rect.width - canvasWidthPx * zoom.value) / 2
    pan.y = (rect.height - canvasHeightPx * zoom.value) / 2
  }

  // Always render after resize
  render()
}

const render = () => {
  if (!ctx.value || !canvasEl.value) return
  const c = ctx.value,
    rect = canvasEl.value.getBoundingClientRect()
  c.clearRect(0, 0, rect.width, rect.height)
  const dark = document.documentElement.classList.contains('dark')

  // Background
  c.fillStyle = dark ? '#0f172a' : '#f8fafc'
  c.fillRect(0, 0, rect.width, rect.height)

  // If no canvas settings yet, just show empty canvas
  if (!props.canvasSettings) return

  // Apply zoom and pan to EVERYTHING (grid, canvas, elements)
  c.save()
  c.translate(pan.x, pan.y)
  c.scale(zoom.value, zoom.value)

  // Draw grid - now affected by zoom
  if (showGrid.value) drawGridZoomed(c, rect)

  // Draw canvas boundary (the actual canvas area in meters)
  const { widthMeters, heightMeters, pixelsPerMeter } = props.canvasSettings
  const canvasWidthPx = widthMeters * pixelsPerMeter
  const canvasHeightPx = heightMeters * pixelsPerMeter

  // Canvas boundary - make it more visible to show real-world dimensions
  c.strokeStyle = dark ? 'rgba(251,191,36,0.8)' : 'rgba(245,158,11,0.8)'
  c.lineWidth = Math.max(2, 4 / zoom.value)
  c.setLineDash([10 / zoom.value, 5 / zoom.value]) // Dashed line
  c.strokeRect(0, 0, canvasWidthPx, canvasHeightPx)
  c.setLineDash([]) // Reset line dash

  // Canvas background
  c.fillStyle = dark ? 'rgba(15,23,42,0.3)' : 'rgba(248,250,252,0.3)'
  c.fillRect(0, 0, canvasWidthPx, canvasHeightPx)

  // Add dimension labels to canvas boundary
  if (zoom.value > 0.2) {
    c.save()
    c.fillStyle = dark ? 'rgba(251,191,36,0.9)' : 'rgba(245,158,11,0.9)'
    c.font = `bold ${Math.max(12, 16 / zoom.value)}px sans-serif`
    c.textAlign = 'center'
    c.textBaseline = 'middle'

    // Width label (bottom center)
    c.fillText(`${widthMeters}m`, canvasWidthPx / 2, canvasHeightPx + Math.max(15, 20 / zoom.value))

    // Height label (right center, rotated)
    c.save()
    c.translate(canvasWidthPx + Math.max(15, 20 / zoom.value), canvasHeightPx / 2)
    c.rotate(-Math.PI / 2)
    c.fillText(`${heightMeters}m`, 0, 0)
    c.restore()

    c.restore()
  }

  elements.value.forEach(el => drawElement(c, el))
  if (currentPath.value.length > 1) drawPath(c)
  c.restore()
}

// Grid drawn in world space (affected by zoom and pan)
const drawGridZoomed = (c: CanvasRenderingContext2D, rect: DOMRect) => {
  if (!props.canvasSettings) return
  const dark = document.documentElement.classList.contains('dark')
  const { gridSizeMeters, pixelsPerMeter, widthMeters, heightMeters } = props.canvasSettings

  const gridSizePx = gridSizeMeters * pixelsPerMeter
  const canvasWidthPx = widthMeters * pixelsPerMeter
  const canvasHeightPx = heightMeters * pixelsPerMeter

  // Skip grid if too zoomed out (performance optimization)
  if (zoom.value < 0.1) return

  // Adjust grid density based on zoom level
  const minGridSpacing = 10 // Minimum pixels between grid lines
  const actualGridSize = gridSizePx * zoom.value
  const gridStep =
    actualGridSize < minGridSpacing
      ? Math.ceil(minGridSpacing / actualGridSize) * gridSizeMeters
      : gridSizeMeters

  const adjustedGridSizePx = gridStep * pixelsPerMeter

  c.strokeStyle = dark ? 'rgba(71,85,105,0.3)' : 'rgba(203,213,225,0.5)'
  c.lineWidth = Math.max(0.5, 1 / zoom.value)

  // Draw vertical lines across the canvas
  for (let x = 0; x <= canvasWidthPx; x += adjustedGridSizePx) {
    c.beginPath()
    c.moveTo(x, 0)
    c.lineTo(x, canvasHeightPx)
    c.stroke()
  }

  // Draw horizontal lines across the canvas
  for (let y = 0; y <= canvasHeightPx; y += adjustedGridSizePx) {
    c.beginPath()
    c.moveTo(0, y)
    c.lineTo(canvasWidthPx, y)
    c.stroke()
  }

  // Draw major grid lines every 5 grid units (or adjusted for zoom)
  c.strokeStyle = dark ? 'rgba(100,116,139,0.6)' : 'rgba(148,163,184,0.8)'
  c.lineWidth = Math.max(1, 2 / zoom.value)

  const majorGridSize = adjustedGridSizePx * 5

  // Only draw labels if zoom is sufficient
  const shouldDrawLabels = zoom.value > 0.3

  // Major vertical lines
  for (let x = 0; x <= canvasWidthPx; x += majorGridSize) {
    c.beginPath()
    c.moveTo(x, 0)
    c.lineTo(x, canvasHeightPx)
    c.stroke()

    // Draw meter labels
    if (x > 0 && shouldDrawLabels) {
      const meters = Math.round(x / pixelsPerMeter)
      c.save()
      c.fillStyle = dark ? 'rgba(148,163,184,0.8)' : 'rgba(100,116,139,0.8)'
      c.font = `bold ${Math.max(8, 10 / zoom.value)}px sans-serif`
      c.textAlign = 'center'
      c.fillText(`${meters}m`, x, Math.max(12, 15 / zoom.value))
      c.restore()
    }
  }

  // Major horizontal lines
  for (let y = 0; y <= canvasHeightPx; y += majorGridSize) {
    c.beginPath()
    c.moveTo(0, y)
    c.lineTo(canvasWidthPx, y)
    c.stroke()

    // Draw meter labels
    if (y > 0 && shouldDrawLabels) {
      const meters = Math.round(y / pixelsPerMeter)
      c.save()
      c.fillStyle = dark ? 'rgba(148,163,184,0.8)' : 'rgba(100,116,139,0.8)'
      c.font = `bold ${Math.max(8, 10 / zoom.value)}px sans-serif`
      c.textAlign = 'left'
      c.fillText(`${meters}m`, Math.max(3, 5 / zoom.value), y - Math.max(3, 5 / zoom.value))
      c.restore()
    }
  }
}

const drawElement = (c: CanvasRenderingContext2D, el: CanvasElement) => {
  c.save()
  c.globalAlpha = el.opacity || 1
  const col = el.color || getColor(el.type)
  if (el.shape === 'line' && el.path && el.path.length > 1) {
    c.strokeStyle = col
    c.lineWidth = el.size / zoom.value
    c.lineCap = 'round'
    c.lineJoin = 'round'
    c.shadowColor = col
    c.shadowBlur = 10 / zoom.value
    c.beginPath()
    c.moveTo(el.path[0].x, el.path[0].y)
    for (let i = 1; i < el.path.length; i++) c.lineTo(el.path[i].x, el.path[i].y)
    c.stroke()
  } else if (el.shape === 'circle') {
    const r = el.size / 2
    const g = c.createRadialGradient(el.x, el.y, 0, el.x, el.y, r)
    g.addColorStop(0, rgba(col, 0.3))
    g.addColorStop(1, rgba(col, 0.1))
    c.fillStyle = g
    c.beginPath()
    c.arc(el.x, el.y, r, 0, Math.PI * 2)
    c.fill()
    c.strokeStyle = col
    c.lineWidth = 2 / zoom.value
    c.shadowColor = col
    c.shadowBlur = 8 / zoom.value
    c.beginPath()
    c.arc(el.x, el.y, r, 0, Math.PI * 2)
    c.stroke()
  } else {
    const hs = el.size / 2
    const g = c.createRadialGradient(el.x, el.y, 0, el.x, el.y, hs)
    g.addColorStop(0, rgba(col, 0.3))
    g.addColorStop(1, rgba(col, 0.1))
    c.fillStyle = g
    c.fillRect(el.x - hs, el.y - hs, el.size, el.size)
    c.strokeStyle = col
    c.lineWidth = 2 / zoom.value
    c.shadowColor = col
    c.shadowBlur = 8 / zoom.value
    c.strokeRect(el.x - hs, el.y - hs, el.size, el.size)
  }
  if (el.name && el.shape !== 'line') {
    const dark = document.documentElement.classList.contains('dark'),
      fs = 12 / zoom.value
    c.font = `bold ${fs}px sans-serif`
    c.textAlign = 'center'
    c.textBaseline = 'top'
    c.shadowBlur = 0
    const ty = el.y + el.size / 2 + 8 / zoom.value
    c.strokeStyle = dark ? '#000' : '#fff'
    c.lineWidth = 3 / zoom.value
    c.strokeText(el.name, el.x, ty)
    c.fillStyle = dark ? '#fff' : '#000'
    c.fillText(el.name, el.x, ty)
  }
  c.restore()
}

const drawPath = (c: CanvasRenderingContext2D) => {
  if (!props.selectedElement) return
  const col = props.selectedElement.color || getColor(getType(props.selectedElement))
  c.save()
  c.strokeStyle = col
  c.lineWidth = props.brushSettings.size / zoom.value
  c.lineCap = 'round'
  c.lineJoin = 'round'
  c.globalAlpha = props.brushSettings.opacity * 0.7
  c.beginPath()
  c.moveTo(currentPath.value[0].x, currentPath.value[0].y)
  for (let i = 1; i < currentPath.value.length; i++)
    c.lineTo(currentPath.value[i].x, currentPath.value[i].y)
  c.stroke()
  c.restore()
}

const rgba = (hex: string, a: number) => {
  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}
const toWorld = (sx: number, sy: number) => ({
  x: (sx - pan.x) / zoom.value,
  y: (sy - pan.y) / zoom.value,
})
const getType = (el: Plant | Terrain | Structure): 'plant' | 'terrain' | 'structure' =>
  'category' in el ? 'plant' : 'type' in el && el.type.includes('Solo') ? 'terrain' : 'structure'
const getColor = (t: 'plant' | 'terrain' | 'structure') =>
  ({ plant: '#22c55e', terrain: '#f59e0b', structure: '#3b82f6' })[t] || '#6b7280'
const getSize = () => {
  if (!props.selectedElement || !props.canvasSettings) return 30
  const ppm = props.canvasSettings.pixelsPerMeter
  if ('canopyDiameterMeters' in props.selectedElement)
    return props.selectedElement.canopyDiameterMeters * ppm
  if ('widthMeters' in props.selectedElement) return props.selectedElement.widthMeters * ppm
  return ppm
}

const place = (x: number, y: number) => {
  if (!props.selectedElement || !props.selectedTool || !props.canvasSettings) return

  let finalX = x
  let finalY = y

  // Apply snap-to-grid if enabled
  if (props.canvasSettings.snapToGrid) {
    const gridSizePx = props.canvasSettings.gridSizeMeters * props.canvasSettings.pixelsPerMeter
    finalX = Math.round(x / gridSizePx) * gridSizePx
    finalY = Math.round(y / gridSizePx) * gridSizePx
  }

  const t = getType(props.selectedElement),
    sh = props.selectedTool.id === 'square' ? 'square' : 'circle',
    sz = props.selectedTool.type === 'pencil' ? props.brushSettings.size : getSize()
  const el: CanvasElement = {
    id: `${Date.now()}-${Math.random()}`,
    type: t,
    name: props.selectedElement.name,
    x: finalX,
    y: finalY,
    size: sz,
    shape: sh,
    color: props.selectedElement.color || getColor(t),
    opacity: props.selectedTool.type === 'pencil' ? props.brushSettings.opacity : 1,
  }
  elements.value.push(el)
  if (!isDrawing.value || props.selectedTool.type !== 'pencil') saveHistory()
  render()
  emit('item-placed')
}

const finalizePath = () => {
  if (currentPath.value.length < 2 || !props.selectedElement) return
  const t = getType(props.selectedElement),
    xs = currentPath.value.map(p => p.x),
    ys = currentPath.value.map(p => p.y)
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2,
    cy = (Math.min(...ys) + Math.max(...ys)) / 2
  const el: CanvasElement = {
    id: `${Date.now()}-${Math.random()}`,
    type: t,
    name: props.selectedElement.name,
    x: cx,
    y: cy,
    size: props.brushSettings.size,
    shape: 'line',
    color: props.selectedElement.color || getColor(t),
    opacity: props.brushSettings.opacity,
    path: [...currentPath.value],
  }
  elements.value.push(el)
  saveHistory()
  render()
}

const saveHistory = () => {
  if (historyIndex.value < history.value.length - 1)
    history.value = history.value.slice(0, historyIndex.value + 1)
  history.value.push(JSON.parse(JSON.stringify(elements.value)))
  historyIndex.value = history.value.length - 1
  if (history.value.length > 50) {
    history.value.shift()
    historyIndex.value--
  }
  emit('history-change', historyIndex.value > 0, historyIndex.value < history.value.length - 1)
}

const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--
    elements.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    render()
    emit('history-change', historyIndex.value > 0, historyIndex.value < history.value.length - 1)
  }
}
const redo = () => {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++
    elements.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    render()
    emit('history-change', historyIndex.value > 0, historyIndex.value < history.value.length - 1)
  }
}
const toggleGrid = () => {
  showGrid.value = !showGrid.value
  // Emit the change to parent to keep settings in sync
  emit('grid-toggle', showGrid.value)
  render()
}
const exportCanvas = () => {
  if (!canvasEl.value) return
  const l = document.createElement('a')
  l.download = `garden-${Date.now()}.png`
  l.href = canvasEl.value.toDataURL('image/png')
  l.click()
}
const updateSettings = () => {
  nextTick(() => {
    if (canvasEl.value && ctx.value) {
      resize()
      render()
    }
  })
}

const onMouseDown = (e: MouseEvent) => {
  const rect = canvasEl.value?.getBoundingClientRect()
  if (!rect) return

  // Adjust for window zoom - get position relative to the scaled canvas
  const sx = e.clientX - rect.left
  const sy = e.clientY - rect.top

  if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
    isPanning.value = true
    lastPos.x = sx
    lastPos.y = sy
    return
  }
  if (e.button === 0 && props.selectedTool && props.selectedElement) {
    const w = toWorld(sx, sy)
    if (props.selectedTool.type === 'shape') place(w.x, w.y)
    else if (props.selectedTool.type === 'brush') {
      isDrawing.value = true
      lastPos.x = w.x
      lastPos.y = w.y
      place(w.x, w.y)
    } else if (props.selectedTool.type === 'pencil') {
      isDrawing.value = true
      currentPath.value = [w]
    }
  }
}

const onMouseMove = (e: MouseEvent) => {
  const rect = canvasEl.value?.getBoundingClientRect()
  if (!rect) return
  const sx = e.clientX - rect.left,
    sy = e.clientY - rect.top
  if (isPanning.value) {
    pan.x += sx - lastPos.x
    pan.y += sy - lastPos.y
    lastPos.x = sx
    lastPos.y = sy
    render()
    return
  }
  if (isDrawing.value && props.selectedTool && props.selectedElement) {
    const w = toWorld(sx, sy)
    if (props.selectedTool.type === 'brush') {
      const d = Math.hypot(w.x - lastPos.x, w.y - lastPos.y)
      if (d >= getSize() * 0.7) {
        place(w.x, w.y)
        lastPos.x = w.x
        lastPos.y = w.y
      }
    } else if (props.selectedTool.type === 'pencil') {
      currentPath.value.push(w)
      render()
    }
  }
}

const onMouseUp = () => {
  if (isDrawing.value && props.selectedTool?.type === 'pencil' && currentPath.value.length > 1)
    finalizePath()
  isDrawing.value = false
  isPanning.value = false
  currentPath.value = []
}

const onWheel = (e: WheelEvent) => {
  const rect = canvasEl.value?.getBoundingClientRect()
  if (!rect) return

  // Get mouse position relative to canvas
  const mx = e.clientX - rect.left
  const my = e.clientY - rect.top

  // Get world coordinates before zoom
  const worldBefore = toWorld(mx, my)

  // Store old zoom
  const oldZoom = zoom.value

  // Update zoom (zoom in/out based on scroll direction)
  const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
  zoom.value = Math.max(0.05, Math.min(3, zoom.value * zoomFactor))

  // Get world coordinates after zoom (with new zoom but old pan)
  const worldAfter = toWorld(mx, my)

  // Adjust pan to keep the mouse position fixed in world space
  pan.x += (worldAfter.x - worldBefore.x) * zoom.value
  pan.y += (worldAfter.y - worldBefore.y) * zoom.value

  render()
}

const onDrop = (e: DragEvent) => {
  if (!e.dataTransfer) return
  try {
    const d = JSON.parse(e.dataTransfer.getData('application/json')),
      rect = canvasEl.value?.getBoundingClientRect()
    if (!rect) return
    const w = toWorld(e.clientX - rect.left, e.clientY - rect.top),
      sz = props.canvasSettings?.pixelsPerMeter || 30
    const el: CanvasElement = {
      id: `${Date.now()}-${Math.random()}`,
      type: d.type,
      name: d.element.name,
      x: w.x,
      y: w.y,
      size: sz,
      shape: 'circle',
      color: d.element.color || getColor(d.type),
    }
    elements.value.push(el)
    saveHistory()
    render()
    emit('item-placed')
  } catch {}
}

const onTouchStart = (e: TouchEvent) => {
  const rect = canvasEl.value?.getBoundingClientRect()
  if (!rect) return
  touches.clear()
  for (let i = 0; i < e.touches.length; i++) {
    const t = e.touches[i]
    touches.set(t.identifier, {
      x: t.clientX - rect.left,
      y: t.clientY - rect.top,
    })
  }
  if (e.touches.length === 1) {
    const t = e.touches[0],
      w = toWorld(t.clientX - rect.left, t.clientY - rect.top)
    if (props.selectedTool && props.selectedElement) {
      if (props.selectedTool.type === 'shape') place(w.x, w.y)
      else if (props.selectedTool.type === 'brush') {
        isDrawing.value = true
        lastPos.x = w.x
        lastPos.y = w.y
        place(w.x, w.y)
      } else if (props.selectedTool.type === 'pencil') {
        isDrawing.value = true
        currentPath.value = [w]
      }
    }
  } else if (e.touches.length === 2) {
    const ts = Array.from(touches.values())
    initialPinch.dist = Math.hypot(ts[1].x - ts[0].x, ts[1].y - ts[0].y)
    initialPinch.zoom = zoom.value
    initialPinch.pan = { ...pan }
    isPanning.value = true
    isDrawing.value = false
    currentPath.value = []
  }
}

const onTouchMove = (e: TouchEvent) => {
  const rect = canvasEl.value?.getBoundingClientRect()
  if (!rect) return
  const ct = new Map<number, { x: number; y: number }>()
  for (let i = 0; i < e.touches.length; i++) {
    const t = e.touches[i]
    ct.set(t.identifier, { x: t.clientX - rect.left, y: t.clientY - rect.top })
  }
  if (e.touches.length === 1 && isDrawing.value) {
    const t = e.touches[0],
      w = toWorld(t.clientX - rect.left, t.clientY - rect.top)
    if (props.selectedTool?.type === 'brush') {
      const d = Math.hypot(w.x - lastPos.x, w.y - lastPos.y)
      if (d >= getSize() * 0.7) {
        place(w.x, w.y)
        lastPos.x = w.x
        lastPos.y = w.y
      }
    } else if (props.selectedTool?.type === 'pencil') {
      currentPath.value.push(w)
      render()
    }
  } else if (e.touches.length === 2 && isPanning.value) {
    const ts = Array.from(ct.values()),
      ots = Array.from(touches.values()),
      d = Math.hypot(ts[1].x - ts[0].x, ts[1].y - ts[0].y)
    if (initialPinch.dist > 0)
      zoom.value = Math.max(0.1, Math.min(5, initialPinch.zoom * (d / initialPinch.dist)))
    const cx = (ts[0].x + ts[1].x) / 2,
      cy = (ts[0].y + ts[1].y) / 2,
      ocx = (ots[0].x + ots[1].x) / 2,
      ocy = (ots[0].y + ots[1].y) / 2
    pan.x += cx - ocx
    pan.y += cy - ocy
    render()
  }
  touches.clear()
  ct.forEach((v, k) => touches.set(k, v))
}

const onTouchEnd = (e: TouchEvent) => {
  if (e.touches.length === 0) {
    if (isDrawing.value && props.selectedTool?.type === 'pencil' && currentPath.value.length > 1)
      finalizePath()
    isDrawing.value = false
    isPanning.value = false
    currentPath.value = []
    touches.clear()
    initialPinch.dist = 0
  } else if (e.touches.length === 1) {
    isPanning.value = false
    initialPinch.dist = 0
  }
}

defineExpose({ undo, redo, exportCanvas, updateSettings, toggleGrid })

watch(
  () => props.selectedTool,
  () => {
    isDrawing.value = false
    currentPath.value = []
  }
)

watch(
  () => props.canvasSettings,
  (newSettings, oldSettings) => {
    if (newSettings) {
      // Sync local showGrid with settings
      if (newSettings.showGrid !== undefined) {
        showGrid.value = newSettings.showGrid
      }

      // Only update canvas content, NOT window size
      // The window size should remain independent of canvas content size
      nextTick(() => {
        if (canvasEl.value && ctx.value) {
          // Just re-render with new settings, don't resize window
          render()
        }
      })
    }
  },
  { deep: true, immediate: true }
)

onMounted(() =>
  nextTick(() => {
    init()
    saveHistory()
  })
)

onUnmounted(() => {
  // Clean up all event listeners
  window.removeEventListener('resize', handleWindowResize)

  // Clean up drag listeners
  if (isDragging.value) {
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDrag)
  }

  // Clean up resize listeners
  if (isResizing.value) {
    document.removeEventListener('mousemove', handleResize)
    document.removeEventListener('mouseup', stopResize)
  }
})
</script>

<style scoped>
.shadow-2xl {
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
}
:global(.dark) .shadow-2xl {
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
}
</style>
