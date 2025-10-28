<template>
  <div class="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-6 shadow-lg">
    <div class="flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-2xl shadow-lg"
        >
          <Icon icon="mdi:sprout" class="w-7 h-7" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Agroecologia Planner</h1>
          <div class="text-xs text-gray-500 dark:text-gray-400">Real-life scale planning</div>
        </div>
      </div>

      <!-- Canvas Size Input -->
      <div
        class="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 rounded-xl p-3 border border-gray-200 dark:border-gray-800 shadow-sm"
      >
        <Icon icon="mdi:ruler-square" class="w-5 h-5 text-amber-600 dark:text-amber-500" />
        <div class="flex items-center gap-2">
          <div class="flex flex-col">
            <label
              class="text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide"
              >Width</label
            >
            <div class="flex items-center gap-1">
              <input
                type="number"
                :value="canvasWidth"
                @input="
                  $emit('canvas-width-change', Number(($event.target as HTMLInputElement).value))
                "
                min="10"
                max="200"
                step="5"
                class="w-16 px-2 py-1 text-sm font-bold bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">m</span>
            </div>
          </div>

          <div class="w-px h-10 bg-gray-300 dark:bg-gray-700"></div>

          <div class="flex flex-col">
            <label
              class="text-[10px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wide"
              >Height</label
            >
            <div class="flex items-center gap-1">
              <input
                type="number"
                :value="canvasHeight"
                @input="
                  $emit('canvas-height-change', Number(($event.target as HTMLInputElement).value))
                "
                min="10"
                max="200"
                step="5"
                class="w-16 px-2 py-1 text-sm font-bold bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">m</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tools -->
      <div class="flex items-center gap-2">
        <button
          v-for="tool in tools"
          :key="tool.id"
          @click="$emit('tool-select', tool.id)"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border',
            selectedTool === tool.id
              ? 'bg-amber-600 text-white border-amber-600 shadow-md'
              : 'bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50 dark:hover:bg-gray-900',
          ]"
        >
          <Icon :icon="tool.icon" class="w-5 h-5" />
          <span class="hidden sm:inline">{{ tool.name }}</span>
        </button>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-950 rounded-lg p-1">
          <button
            @click="$emit('undo')"
            :disabled="!canUndo"
            :class="[
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
              canUndo
                ? 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-black'
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed',
            ]"
          >
            <Icon icon="mdi:undo" class="w-5 h-5" />
            <span class="hidden sm:inline">Undo</span>
          </button>

          <button
            @click="$emit('redo')"
            :disabled="!canRedo"
            :class="[
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
              canRedo
                ? 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-black'
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed',
            ]"
          >
            <Icon icon="mdi:redo" class="w-5 h-5" />
            <span class="hidden sm:inline">Redo</span>
          </button>
        </div>

        <button
          @click="$emit('toggle-theme')"
          class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 rounded-lg font-medium border border-gray-200 dark:border-gray-800 hover:bg-amber-50 dark:hover:bg-gray-900 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-200"
        >
          <Icon
            :icon="isDark ? 'mdi:white-balance-sunny' : 'mdi:moon-waning-crescent'"
            class="w-5 h-5"
          />
          <span class="hidden sm:inline">Theme</span>
        </button>

        <button
          @click="$emit('canvas-settings')"
          class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 rounded-lg font-medium border border-gray-200 dark:border-gray-800 hover:bg-amber-50 dark:hover:bg-gray-900 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-200"
        >
          <Icon icon="mdi:ruler-square" class="w-5 h-5" />
          <span class="hidden sm:inline">Canvas</span>
        </button>

        <button
          @click="$emit('help')"
          class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 rounded-lg font-medium border border-gray-200 dark:border-gray-800 hover:bg-amber-50 dark:hover:bg-gray-900 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-200"
        >
          <Icon icon="mdi:help-circle-outline" class="w-5 h-5" />
          <span class="hidden sm:inline">Help</span>
        </button>

        <button
          @click="$emit('export')"
          class="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <Icon icon="mdi:camera" class="w-6 h-6" />
          <span class="hidden sm:inline">EXPORT</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  selectedTool: string
  canUndo: boolean
  canRedo: boolean
  isDark?: boolean
  canvasWidth?: number
  canvasHeight?: number
}

withDefaults(defineProps<Props>(), {
  canvasWidth: 50,
  canvasHeight: 50,
})

defineEmits<{
  'tool-select': [tool: string]
  undo: []
  redo: []
  setup: []
  'toggle-theme': []
  'canvas-settings': []
  help: []
  export: []
  'canvas-width-change': [width: number]
  'canvas-height-change': [height: number]
}>()

const tools = [
  { id: 'select', name: 'Select', icon: 'mdi:cursor-default-click' },
  { id: 'plant', name: 'Plants', icon: 'mdi:sprout' },
  { id: 'terrain', name: 'Terrain', icon: 'mdi:terrain' },
  { id: 'structure', name: 'Structures', icon: 'mdi:office-building' },
]
</script>

<style scoped>
/* Clean, minimal toolbar styles */
</style>
