import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Plant,
  Terrain,
  Structure,
  CanvasElement,
  DrawingTool,
  BrushSettings,
  CanvasSettings,
} from '@/types/canvas'
import { CANVAS_CONSTRAINTS, LOCAL_STORAGE_KEYS } from '@/constants/canvas'
import { deepClone, generateId } from '@/utils/canvas'

export const useCanvasStore = defineStore('canvas', () => {
  // State
  const selectedTool = ref<DrawingTool | null>(null)
  const selectedElement = ref<Plant | Terrain | Structure | null>(null)
  const brushSettings = ref<BrushSettings>({
    size: 10,
    opacity: 1,
    hardness: 0.8,
  })
  const elements = ref<CanvasElement[]>([])
  const history = ref<CanvasElement[][]>([])
  const historyIndex = ref(-1)
  const zoom = ref(1)
  const showGrid = ref(true)
  const pan = ref({ x: 0, y: 0 })
  const selectedElementIds = ref<Set<string>>(new Set())
  const clipboard = ref<CanvasElement[]>([])

  const canvasSettings = ref<CanvasSettings>({
    widthMeters: 50,
    heightMeters: 50,
    gridSizeMeters: 1,
    showGrid: true,
    snapToGrid: true,
    pixelsPerMeter: 20,
  })

  // Getters
  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)
  const selectedElements = computed(() =>
    elements.value.filter(el => selectedElementIds.value.has(el.id))
  )
  const hasSelection = computed(() => selectedElementIds.value.size > 0)

  // Actions
  const setSelectedTool = (tool: DrawingTool | null) => {
    selectedTool.value = tool
  }

  const setSelectedElement = (element: Plant | Terrain | Structure | null) => {
    selectedElement.value = element
  }

  const setBrushSettings = (settings: BrushSettings) => {
    brushSettings.value = settings
  }

  const addElement = (element: CanvasElement) => {
    elements.value.push(element)
    saveToHistory()
  }

  const removeElement = (id: string) => {
    const index = elements.value.findIndex(el => el.id === id)
    if (index !== -1) {
      elements.value.splice(index, 1)
      selectedElementIds.value.delete(id)
      saveToHistory()
    }
  }

  const removeSelectedElements = () => {
    elements.value = elements.value.filter(el => !selectedElementIds.value.has(el.id))
    selectedElementIds.value.clear()
    saveToHistory()
  }

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    const element = elements.value.find(el => el.id === id)
    if (element) {
      Object.assign(element, updates)
      saveToHistory()
    }
  }

  const selectElement = (id: string, addToSelection = false) => {
    if (!addToSelection) {
      selectedElementIds.value.clear()
    }
    selectedElementIds.value.add(id)
  }

  const deselectElement = (id: string) => {
    selectedElementIds.value.delete(id)
  }

  const deselectAll = () => {
    selectedElementIds.value.clear()
  }

  const selectAll = () => {
    elements.value.forEach(el => selectedElementIds.value.add(el.id))
  }

  const copySelected = () => {
    clipboard.value = deepClone(selectedElements.value)
  }

  const pasteClipboard = () => {
    if (clipboard.value.length === 0) return

    const newElements = clipboard.value.map(el => ({
      ...deepClone(el),
      id: generateId(),
      x: el.x + 20,
      y: el.y + 20,
    }))

    elements.value.push(...newElements)
    selectedElementIds.value.clear()
    newElements.forEach(el => selectedElementIds.value.add(el.id))
    saveToHistory()
  }

  const duplicateSelected = () => {
    copySelected()
    pasteClipboard()
  }

  const saveToHistory = () => {
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }

    history.value.push(deepClone(elements.value))
    historyIndex.value = history.value.length - 1

    if (history.value.length > CANVAS_CONSTRAINTS.MAX_HISTORY_ITEMS) {
      history.value.shift()
      historyIndex.value--
    }
  }

  const undo = () => {
    if (canUndo.value) {
      historyIndex.value--
      elements.value = deepClone(history.value[historyIndex.value]) || []
    }
  }

  const redo = () => {
    if (canRedo.value) {
      historyIndex.value++
      elements.value = deepClone(history.value[historyIndex.value]) || []
    }
  }

  const clearCanvas = () => {
    elements.value = []
    saveToHistory()
  }

  const toggleGrid = () => {
    showGrid.value = !showGrid.value
  }

  const setZoom = (newZoom: number) => {
    zoom.value = Math.max(
      CANVAS_CONSTRAINTS.MIN_ZOOM,
      Math.min(CANVAS_CONSTRAINTS.MAX_ZOOM, newZoom)
    )
  }

  const setPan = (newPan: { x: number; y: number }) => {
    pan.value = newPan
  }

  const updateCanvasSettings = (settings: Partial<CanvasSettings>) => {
    canvasSettings.value = { ...canvasSettings.value, ...settings }
    saveCanvasSettings()
  }

  const saveCanvasSettings = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CANVAS_SETTINGS, JSON.stringify(canvasSettings.value))
    } catch (error) {
      console.error('Failed to save canvas settings:', error)
    }
  }

  const loadCanvasSettings = () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CANVAS_SETTINGS)
      if (saved) {
        const parsed = JSON.parse(saved)
        canvasSettings.value = { ...canvasSettings.value, ...parsed }
      }
    } catch (error) {
      console.error('Failed to load canvas settings:', error)
    }
  }

  const exportProject = () => {
    return {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      settings: canvasSettings.value,
      elements: elements.value,
      zoom: zoom.value,
      pan: pan.value,
    }
  }

  const importProject = (project: any) => {
    try {
      if (project.settings) {
        canvasSettings.value = project.settings
      }
      if (project.elements) {
        elements.value = project.elements
        saveToHistory()
      }
      if (project.zoom) {
        zoom.value = project.zoom
      }
      if (project.pan) {
        pan.value = project.pan
      }
      return true
    } catch (error) {
      console.error('Failed to import project:', error)
      return false
    }
  }

  // Initialize history
  const initializeHistory = () => {
    history.value = [[]]
    historyIndex.value = 0
  }

  // Load settings on initialization
  loadCanvasSettings()

  return {
    // State
    selectedTool,
    selectedElement,
    brushSettings,
    elements,
    zoom,
    showGrid,
    pan,
    selectedElementIds,
    clipboard,
    canvasSettings,

    // Getters
    canUndo,
    canRedo,
    selectedElements,
    hasSelection,

    // Actions
    setSelectedTool,
    setSelectedElement,
    setBrushSettings,
    addElement,
    removeElement,
    removeSelectedElements,
    updateElement,
    selectElement,
    deselectElement,
    deselectAll,
    selectAll,
    copySelected,
    pasteClipboard,
    duplicateSelected,
    undo,
    redo,
    clearCanvas,
    toggleGrid,
    setZoom,
    setPan,
    updateCanvasSettings,
    exportProject,
    importProject,
    initializeHistory,
  }
})
