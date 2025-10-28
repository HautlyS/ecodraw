<template>
  <div
    class="h-full flex flex-col p-6 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800"
  >
    <!-- Clean Drawing Tools -->
    <div class="space-y-6 mb-8">
      <div class="flex items-center gap-3 mb-6">
        <Icon icon="mdi:tools" class="text-2xl text-amber-600 dark:text-amber-500" />
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Tools</h3>
          <div class="text-xs text-gray-500 dark:text-gray-400">Drawing and placement tools</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="tool in drawingTools"
          :key="tool.id"
          @click="selectTool(tool)"
          :class="[
            'p-4 rounded-lg border transition-all duration-200 text-center group',
            selectedTool?.id === tool.id
              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950 shadow-md ring-2 ring-amber-200 dark:ring-amber-800'
              : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-gray-900 hover:shadow-sm',
          ]"
        >
          <Icon
            :icon="tool.iconifyIcon"
            class="text-3xl mb-2 group-hover:scale-110 transition-transform text-gray-700 dark:text-gray-300"
          />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ tool.name }}</span>
        </button>
      </div>
    </div>

    <!-- Clean Brush Settings -->
    <div v-if="selectedTool?.type === 'pencil'" class="space-y-6 mb-8">
      <div class="flex items-center gap-3 mb-6">
        <Icon icon="mdi:palette" class="text-2xl text-amber-600 dark:text-amber-500" />
        <div>
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Brush Settings</h4>
          <div class="text-xs text-gray-500 dark:text-gray-400">Customize brush properties</div>
        </div>
      </div>

      <div
        class="space-y-4 p-4 bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800"
      >
        <!-- Brush Size -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Size: {{ brushSettings.size }}px ({{ (brushSettings.size / 20).toFixed(1) }}m)
          </label>
          <input
            type="range"
            min="10"
            max="200"
            v-model="brushSettings.size"
            class="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer slider-amber"
          />
        </div>

        <!-- Brush Opacity -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Opacity: {{ Math.round(brushSettings.opacity * 100) }}%
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            v-model="brushSettings.opacity"
            class="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer slider-amber"
          />
        </div>

        <!-- Brush Hardness -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hardness: {{ Math.round(brushSettings.hardness * 100) }}%
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            v-model="brushSettings.hardness"
            class="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer slider-amber"
          />
        </div>
      </div>
    </div>

    <!-- Clean Element Selection -->
    <div class="space-y-6 mb-8">
      <div class="flex items-center gap-3 mb-6">
        <Icon icon="mdi:target" class="text-2xl text-amber-600 dark:text-amber-500" />
        <div>
          <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Active Element</h4>
          <div class="text-xs text-gray-500 dark:text-gray-400">Currently selected element</div>
        </div>
      </div>

      <button
        @click="openLibraryModal"
        :class="[
          'w-full p-4 rounded-lg border-2 transition-all duration-200 group',
          selectedElement
            ? 'border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-950 shadow-md'
            : 'border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50 dark:hover:bg-gray-900',
        ]"
      >
        <div v-if="selectedElement" class="text-center">
          <Icon
            :icon="getElementIconify(selectedElement)"
            class="text-4xl mb-2 group-hover:scale-110 transition-transform text-green-600 dark:text-green-500"
          />
          <div class="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {{ selectedElement.name }}
          </div>
          <div
            class="text-xs text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded"
          >
            {{ getElementCategory(selectedElement) }}
          </div>
        </div>
        <div v-else class="text-center">
          <Icon
            icon="mdi:plus-circle-outline"
            class="text-5xl mb-2 text-gray-400 dark:text-gray-600 group-hover:scale-110 transition-transform"
          />
          <div class="text-sm font-medium text-gray-700 dark:text-gray-300">Select Element</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">Click to open library</div>
        </div>
      </button>
    </div>

    <!-- Clean Quick Actions -->
    <div class="space-y-3 mt-auto">
      <div class="flex items-center gap-2 mb-4">
        <Icon icon="mdi:lightning-bolt" class="text-xl text-amber-600 dark:text-amber-500" />
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h4>
      </div>

      <button
        @click="$emit('clear-canvas')"
        class="w-full p-3 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200 font-medium flex items-center justify-center gap-2"
      >
        <Icon icon="mdi:delete-outline" class="text-xl" />
        Clear Canvas
      </button>

      <button
        @click="$emit('export-canvas')"
        class="w-full p-3 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-900 hover:bg-amber-100 dark:hover:bg-amber-900 hover:border-amber-300 dark:hover:border-amber-800 transition-all duration-200 font-medium flex items-center justify-center gap-2"
      >
        <Icon icon="mdi:camera" class="text-xl" />
        Export PNG
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import type { DrawingTool, BrushSettings, Plant, Terrain, Structure } from '@/types/canvas'

interface Props {
  selectedElement: Plant | Terrain | Structure | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'tool-select': [tool: DrawingTool]
  'brush-settings-change': [settings: BrushSettings]
  'open-library': []
  'clear-canvas': []
  'export-canvas': []
}>()

const selectedTool = ref<DrawingTool | null>(null)

const brushSettings = ref<BrushSettings>({
  size: 10,
  opacity: 1,
  hardness: 0.8,
})

const drawingTools: DrawingTool[] = [
  {
    id: 'square',
    name: 'Quadrado',
    icon: 'mdi:square-outline',
    iconifyIcon: 'mdi:square-outline',
    type: 'shape',
    cursor: 'crosshair',
  },
  {
    id: 'circle',
    name: 'Círculo',
    icon: 'mdi:circle-outline',
    iconifyIcon: 'mdi:circle-outline',
    type: 'shape',
    cursor: 'crosshair',
  },
  {
    id: 'brush',
    name: 'Pincel',
    icon: 'mdi:brush',
    iconifyIcon: 'mdi:brush',
    type: 'brush',
    cursor: 'crosshair',
  },
  {
    id: 'pencil',
    name: 'Lápis',
    icon: 'mdi:pencil',
    iconifyIcon: 'mdi:pencil',
    type: 'pencil',
    cursor: 'crosshair',
  },
]

const selectTool = (tool: DrawingTool) => {
  selectedTool.value = tool
  emit('tool-select', tool)
}

const openLibraryModal = () => {
  emit('open-library')
}

const getElementIconify = (element: Plant | Terrain | Structure) => {
  if ('category' in element) return 'mdi:sprout' // Plant
  if ('type' in element && element.type.includes('Solo')) return 'mdi:terrain' // Terrain
  return 'mdi:office-building' // Structure
}

const getElementCategory = (element: Plant | Terrain | Structure) => {
  if ('category' in element) return element.category
  if ('type' in element) return element.type
  return 'Estrutura'
}

// Watch brush settings changes
watch(
  brushSettings,
  newSettings => {
    emit('brush-settings-change', newSettings)
  },
  { deep: true }
)
</script>

<style scoped>
/* Custom Slider Styles - Amber/Golden Theme */
.slider-amber::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #d97706;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider-amber::-webkit-slider-track {
  background: #e5e7eb;
  border-radius: 8px;
  height: 8px;
}

.slider-amber::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #d97706;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.slider-amber::-moz-range-track {
  background: #e5e7eb;
  border-radius: 8px;
  height: 8px;
}

/* Dark mode slider styles */
.dark .slider-amber::-webkit-slider-thumb {
  background: #f59e0b;
  border-color: #000000;
}

.dark .slider-amber::-webkit-slider-track {
  background: #1f2937;
}

.dark .slider-amber::-moz-range-thumb {
  background: #f59e0b;
  border-color: #000000;
}

.dark .slider-amber::-moz-range-track {
  background: #1f2937;
}
</style>
