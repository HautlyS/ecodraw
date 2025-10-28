<template>
  <div
    class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 cursor-move select-none"
    @mousedown="$emit('drag-start', $event)"
  >
    <div class="flex items-center gap-3">
      <!-- Window Controls -->
      <div class="flex gap-2">
        <button
          @click.stop="$emit('minimize')"
          class="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
          title="Minimize"
          aria-label="Minimizar janela"
          role="button"
        ></button>
        <button
          @click.stop="$emit('maximize')"
          class="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
          title="Maximize/Restore"
          aria-label="Maximizar ou restaurar janela"
          role="button"
        ></button>
      </div>

      <div class="flex items-center gap-2">
        <Icon icon="mdi:canvas" class="w-5 h-5 text-amber-600" />
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Canvas</h3>
      </div>
    </div>

    <!-- Canvas Info -->
    <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
      <div v-if="canvasSettings" class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
        <span class="font-medium">
          {{ canvasSettings.widthMeters }}m × {{ canvasSettings.heightMeters }}m
        </span>
      </div>
      <div class="flex items-center gap-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded">
        <Icon icon="mdi:magnify" class="w-3 h-3 text-purple-600 dark:text-purple-400" />
        <span class="font-bold text-purple-700 dark:text-purple-300">
          {{ Math.round(zoom * 100) }}%
        </span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-orange-500"></div>
        <span class="font-medium">Elementos: {{ elementsCount }}</span>
      </div>
    </div>

    <!-- Window Actions -->
    <div class="flex items-center gap-2">
      <button
        @click.stop="$emit('open-settings')"
        class="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all shadow-sm"
        title="Canvas Settings"
        aria-label="Configurações do canvas"
      >
        <Icon icon="mdi:cog" class="w-4 h-4" />
      </button>

      <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

      <button
        @click.stop="$emit('toggle-grid')"
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
        @click.stop="$emit('fit-to-view')"
        class="p-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-all shadow-sm"
        title="Fit to View"
        aria-label="Ajustar à visualização"
      >
        <Icon icon="mdi:fit-to-screen" class="w-4 h-4" />
      </button>
      <button
        @click.stop="$emit('zoom-in')"
        class="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        title="Zoom In"
        aria-label="Aumentar zoom"
      >
        <Icon icon="mdi:plus" class="w-4 h-4" />
      </button>
      <button
        @click.stop="$emit('zoom-out')"
        class="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        title="Zoom Out"
        aria-label="Diminuir zoom"
      >
        <Icon icon="mdi:minus" class="w-4 h-4" />
      </button>
      <button
        @click.stop="$emit('reset-view')"
        class="p-1.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        title="Reset View"
        aria-label="Resetar visualização"
      >
        <Icon icon="mdi:restore" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { CanvasSettings } from '@/types/canvas'

interface Props {
  zoom: number
  elementsCount: number
  canvasSettings?: CanvasSettings
  showGrid: boolean
  isMaximized: boolean
}

defineProps<Props>()

defineEmits<{
  'drag-start': [MouseEvent]
  minimize: []
  maximize: []
  'toggle-grid': []
  'fit-to-view': []
  'zoom-in': []
  'zoom-out': []
  'reset-view': []
  'open-settings': []
}>()
</script>
