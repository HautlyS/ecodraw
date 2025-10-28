<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <!-- Toolbar -->
    <Toolbar
      :selected-tool="selectedTool"
      @tool-select="handleToolSelect"
      @undo="handleUndo"
      @redo="handleRedo"
      :can-undo="canUndo"
      :can-redo="canRedo"
      :is-dark="isDark"
      :canvas-width="canvasSettings.widthMeters"
      :canvas-height="canvasSettings.heightMeters"
      @setup="handleSetup"
      @toggle-theme="toggleTheme"
      @canvas-settings="showCanvasSettings = true"
      @help="handleHelp"
      @export="handleExport"
      @canvas-width-change="handleCanvasWidthChange"
      @canvas-height-change="handleCanvasHeightChange"
    />

    <!-- Main Content -->
    <div class="flex-1 flex min-h-0 relative">
      <!-- Canvas Area -->
      <div class="flex-1 relative overflow-hidden">
        <Canvas
          ref="canvasRef"
          :selected-tool="selectedTool"
          :selected-element="selectedElement"
          :brush-settings="brushSettings"
          :canvas-settings="canvasSettings"
          @history-change="handleHistoryChange"
          @item-placed="handleItemPlaced"
          @canvas-hover="handleCanvasHover"
          @show-help="handleHelp"
          @open-settings="showCanvasSettings = true"
          @grid-toggle="handleGridToggle"
        />

        <!-- Mouse Cursor -->
        <MouseCursor
          :selected-tool="selectedTool"
          :selected-element="selectedElement"
          :brush-settings="brushSettings"
          :is-canvas-hovered="isCanvasHovered"
          @open-library="openLibraryModal"
        />
      </div>

      <!-- Sidebar -->
      <div
        v-if="!isMobile"
        :class="[
          'transition-all duration-300 bg-white dark:bg-gray-900 shadow-lg border-l border-gray-200 dark:border-gray-800',
          sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-96',
        ]"
      >
        <!-- Sidebar Toggle -->
        <button
          @click="toggleSidebar"
          :class="[
            'absolute top-6 z-20 h-12 w-12 rounded-lg transition-all duration-200',
            'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg',
            'hover:shadow-xl hover:scale-105',
            'flex items-center justify-center group',
            sidebarCollapsed ? '-left-6' : 'left-6',
          ]"
        >
          <span
            v-if="sidebarCollapsed"
            class="text-lg text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
            >◀</span
          >
          <span
            v-else
            class="text-lg text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
            >▶</span
          >
        </button>

        <!-- Sidebar Content -->
        <div v-if="!sidebarCollapsed" class="h-full pt-4">
          <ToolsSidebar
            :selected-element="selectedElement"
            @tool-select="handleToolSelect"
            @brush-settings-change="handleBrushSettingsChange"
            @open-library="openLibraryModal"
            @clear-canvas="handleClearCanvas"
            @export-canvas="handleExport"
          />
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <MobileNavigation
      v-if="isMobile"
      :selected-tool="selectedTool"
      @tool-select="handleToolSelect"
      :active-library="activeLibrary"
      @library-change="handleLibraryChange"
      @show-library="showMobileLibrary = true"
    />

    <!-- Element Library Modal -->
    <ElementLibraryModal
      :is-open="showLibraryModal"
      @close="closeLibraryModal"
      @element-select="handleElementSelect"
      @element-drag="handleElementDrag"
    />

    <!-- Mobile Library Modal -->
    <MobileLibraryModal
      v-if="isMobile"
      :show="showMobileLibrary"
      @close="showMobileLibrary = false"
      :active-library="'plants'"
      @library-change="() => {}"
      :selected-plant="null"
      @plant-select="() => {}"
      :selected-terrain="null"
      @terrain-select="() => {}"
      :selected-structure="null"
      @structure-select="() => {}"
    />

    <!-- Welcome Modal -->
    <WelcomeModal :show="showWelcome" @close="showWelcome = false" />

    <!-- Keyboard Shortcuts -->
    <KeyboardShortcuts
      :show="showKeyboardShortcuts"
      @close="showKeyboardShortcuts = false"
      @tool-select="handleToolSelectFromKeyboard"
      @toggle-grid="handleToggleGrid"
      @zoom-in="handleZoomIn"
      @zoom-out="handleZoomOut"
      @reset-zoom="handleResetView"
      @undo="handleUndo"
      @redo="handleRedo"
      @export="handleExport"
      @clear-canvas="handleClearCanvas"
      @open-library="openLibraryModal"
      @deselect-all="handleDeselectAll"
    />

    <!-- Canvas Settings Modal -->
    <CanvasSettings
      :show="showCanvasSettings"
      :settings="canvasSettings"
      @close="showCanvasSettings = false"
      @update="handleCanvasSettingsUpdate"
    />

    <!-- Status Bar -->
    <StatusBar
      :selected-tool="selectedTool"
      :selected-element="selectedElement"
      :element-count="elements.length"
      :zoom="zoom"
      :show-grid="canvasSettings.showGrid"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useResponsive } from '@/composables/useResponsive'

// Components
import Toolbar from '@/components/Toolbar.vue'
import Canvas from '@/components/Canvas.vue'
import ToolsSidebar from '@/components/ToolsSidebar.vue'
import ElementLibraryModal from '@/components/ElementLibraryModal.vue'
import MouseCursor from '@/components/MouseCursor.vue'
import MobileNavigation from '@/components/MobileNavigation.vue'
import MobileLibraryModal from '@/components/MobileLibraryModal.vue'
import WelcomeModal from '@/components/WelcomeModal.vue'
import KeyboardShortcuts from '@/components/KeyboardShortcuts.vue'
import StatusBar from '@/components/StatusBar.vue'
import CanvasSettings from '@/components/CanvasSettings.vue'
import { useTheme } from '@/composables/useTheme'
import type { CanvasSettings as CanvasSettingsType } from '@/types/canvas'
import { toast } from 'vue-sonner'

// Types
import type { Plant, Terrain, Structure, DrawingTool, BrushSettings } from '@/types/canvas'

// Reactive state
const selectedTool = ref<DrawingTool | null>(null)
const selectedElement = ref<Plant | Terrain | Structure | null>(null)
const brushSettings = ref<BrushSettings>({
  size: 10,
  opacity: 1,
  hardness: 0.8,
})
const sidebarCollapsed = ref(false)
const showMobileLibrary = ref(false)
const showLibraryModal = ref(true)
const showWelcome = ref(true)
const showKeyboardShortcuts = ref(false)
const canUndo = ref(false)
const canRedo = ref(false)
const canvasRef = ref()
const elements = ref([])
const showGrid = ref(true)
const zoom = ref(1)
const isCanvasHovered = ref(false)

// Responsive
const { isMobile } = useResponsive()

// Theme
const { isDark, toggleTheme: themeToggle, loadTheme } = useTheme()

const toggleTheme = () => {
  themeToggle()
  toast.info(`${isDark.value ? 'Dark' : 'Light'} mode enabled`)
}

// Canvas Settings
const showCanvasSettings = ref(false)
const canvasSettings = ref<CanvasSettingsType>({
  widthMeters: 50,
  heightMeters: 50,
  gridSizeMeters: 1,
  showGrid: true,
  snapToGrid: true,
  pixelsPerMeter: 20,
})

// Load theme on mount
import { onMounted as vueOnMounted } from 'vue'
vueOnMounted(() => {
  loadTheme()
})

// Methods
const handleToolSelect = (tool: DrawingTool) => {
  selectedTool.value = tool
}

const handleBrushSettingsChange = (settings: BrushSettings) => {
  brushSettings.value = settings
}

const openLibraryModal = () => {
  showLibraryModal.value = true
}

const closeLibraryModal = () => {
  showLibraryModal.value = false
}

const handleElementSelect = (
  element: Plant | Terrain | Structure,
  type: 'plant' | 'terrain' | 'structure'
) => {
  selectedElement.value = element
}

const handleElementDrag = (
  element: Plant | Terrain | Structure,
  type: 'plant' | 'terrain' | 'structure',
  event: DragEvent
) => {
  // Handle drag start if needed
}

const handleCanvasHover = (isHovered: boolean) => {
  isCanvasHovered.value = isHovered
}

const handleUndo = () => {
  if (canUndo.value) {
    canvasRef.value?.undo()
    toast.success('Action undone')
  }
}

const handleRedo = () => {
  if (canRedo.value) {
    canvasRef.value?.redo()
    toast.success('Action redone')
  }
}

const handleExport = () => {
  canvasRef.value?.exportCanvas()
  toast.success('Canvas exported successfully!')
}

const handleHistoryChange = (undo: boolean, redo: boolean) => {
  canUndo.value = undo
  canRedo.value = redo
}

const handleItemPlaced = () => {
  if (isMobile.value) {
    showMobileLibrary.value = false
  }
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// Legacy methods for mobile compatibility
const setSelectedPlant = (plant: Plant | null) => {
  selectedElement.value = plant
}

const setSelectedTerrain = (terrain: Terrain | null) => {
  selectedElement.value = terrain
}

const setSelectedStructure = (structure: Structure | null) => {
  selectedElement.value = structure
}

const handleToggleGrid = () => {
  showGrid.value = !showGrid.value
  canvasRef.value?.toggleGrid()
  toast.info(`Grid ${showGrid.value ? 'enabled' : 'disabled'}`)
}

const handleZoomIn = () => {
  zoom.value = Math.min(3, zoom.value + 0.1)
  canvasRef.value?.setZoom(zoom.value)
}

const handleZoomOut = () => {
  zoom.value = Math.max(0.1, zoom.value - 0.1)
  canvasRef.value?.setZoom(zoom.value)
}

const handleZoomChange = (newZoom: number) => {
  zoom.value = newZoom
  canvasRef.value?.setZoom(zoom.value)
}

const handleClearCanvas = () => {
  if (confirm('Tem certeza que deseja limpar o canvas? Esta ação não pode ser desfeita.')) {
    elements.value = []
    canvasRef.value?.clearCanvas()
    toast.success('Canvas cleared')
  }
}

const handleResetView = () => {
  zoom.value = 1
  canvasRef.value?.resetView()
  toast.info('View reset to center')
}

const handleSetup = () => {
  // Open setup/configuration modal or sidebar
  // For now, let's toggle the sidebar and show setup options
  if (sidebarCollapsed.value) {
    sidebarCollapsed.value = false
  }
  // You can add a setup modal here later
  alert('Setup panel opened! Configure your workspace settings in the sidebar.')
}

const handleToolSelectFromKeyboard = (toolId: string) => {
  // Map keyboard shortcuts to actual tools
  const toolMap: Record<string, DrawingTool> = {
    square: {
      id: 'square',
      name: 'Square',
      icon: 'mdi:square',
      type: 'shape',
      cursor: 'crosshair',
    },
    circle: {
      id: 'circle',
      name: 'Circle',
      icon: 'mdi:circle',
      type: 'shape',
      cursor: 'crosshair',
    },
    brush: {
      id: 'brush',
      name: 'Brush',
      icon: 'mdi:brush',
      type: 'brush',
      cursor: 'crosshair',
    },
    pencil: {
      id: 'pencil',
      name: 'Pencil',
      icon: 'mdi:pencil',
      type: 'pencil',
      cursor: 'crosshair',
    },
    select: {
      id: 'select',
      name: 'Select',
      icon: 'mdi:cursor-default-click',
      type: 'select',
      cursor: 'default',
    },
  }

  const tool = toolMap[toolId]
  if (tool) {
    selectedTool.value = tool
  }
}

const handleDeselectAll = () => {
  selectedTool.value = null
  selectedElement.value = null
}

const handleHelp = () => {
  showKeyboardShortcuts.value = true
}

const handleCanvasSettingsUpdate = (settings: CanvasSettingsType) => {
  canvasSettings.value = settings
  showGrid.value = settings.showGrid
  // Update canvas with new settings
  canvasRef.value?.updateSettings()
  toast.success(`Canvas set to ${settings.widthMeters}m × ${settings.heightMeters}m`)
}

const handleGridToggle = (gridVisible: boolean) => {
  canvasSettings.value = {
    ...canvasSettings.value,
    showGrid: gridVisible,
  }
  showGrid.value = gridVisible
}

const handleCanvasWidthChange = (width: number) => {
  if (width >= 10 && width <= 200) {
    // Create a new object to trigger reactivity
    canvasSettings.value = {
      ...canvasSettings.value,
      widthMeters: width,
    }
    // Update canvas with new settings
    nextTick(() => {
      canvasRef.value?.updateSettings()
    })
    toast.info(`Canvas width: ${width}m`)
  }
}

const handleCanvasHeightChange = (height: number) => {
  if (height >= 10 && height <= 200) {
    // Create a new object to trigger reactivity
    canvasSettings.value = {
      ...canvasSettings.value,
      heightMeters: height,
    }
    // Update canvas with new settings
    nextTick(() => {
      canvasRef.value?.updateSettings()
    })
    toast.info(`Canvas height: ${height}m`)
  }
}

const handleExportJson = () => {
  const projectData = {
    elements: elements.value,
    settings: {
      zoom: zoom.value,
      showGrid: showGrid.value,
    },
    metadata: {
      name: 'Projeto Agroecologia',
      created: new Date().toISOString(),
      version: '1.0.0',
    },
  }

  const blob = new Blob([JSON.stringify(projectData, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'agroecologia-projeto.json'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
/* Clean, minimal styles */
</style>
