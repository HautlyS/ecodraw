<template>
  <div
    class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/20 dark:border-gray-700/20"
  >
    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
      <Icon icon="mdi:cog" class="w-6 h-6" />
      Configurações
    </h3>

    <div class="space-y-4">
      <!-- Grid Settings -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Icon icon="mdi:grid" class="w-5 h-5" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Mostrar Grade</span>
        </div>
        <button
          @click="$emit('toggle-grid')"
          :class="[
            'w-12 h-6 rounded-full transition-all duration-200',
            showGrid ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600',
          ]"
        >
          <div
            :class="[
              'w-5 h-5 bg-white rounded-full shadow-md transition-all duration-200',
              showGrid ? 'translate-x-6' : 'translate-x-0.5',
            ]"
          ></div>
        </button>
      </div>

      <!-- Zoom Control -->
      <div>
        <div class="flex items-center gap-2 mb-2">
          <Icon icon="mdi:magnify" class="w-5 h-5" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Zoom: {{ Math.round(zoom * 100) }}%</span
          >
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="$emit('zoom-out')"
            class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <span class="text-sm">−</span>
          </button>
          <input
            type="range"
            :value="zoom"
            @input="$emit('zoom-change', parseFloat(($event.target as HTMLInputElement).value))"
            min="0.1"
            max="3"
            step="0.1"
            class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <button
            @click="$emit('zoom-in')"
            class="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <span class="text-sm">+</span>
          </button>
        </div>
      </div>

      <!-- Canvas Actions -->
      <div class="space-y-2">
        <div class="flex items-center gap-2 mb-2">
          <Icon icon="mdi:palette" class="w-5 h-5" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Canvas</span>
        </div>

        <button
          @click="$emit('clear-canvas')"
          class="w-full p-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <Icon icon="mdi:delete" class="w-4 h-4" />
          Limpar Canvas
        </button>

        <button
          @click="$emit('reset-view')"
          class="w-full p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <Icon icon="mdi:target" class="w-4 h-4" />
          Resetar Visualização
        </button>
      </div>

      <!-- Export Options -->
      <div class="space-y-2">
        <div class="flex items-center gap-2 mb-2">
          <Icon icon="mdi:export" class="w-5 h-5" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Exportar</span>
        </div>

        <button
          @click="$emit('export-png')"
          class="w-full p-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <Icon icon="mdi:image" class="w-4 h-4" />
          Exportar PNG
        </button>

        <button
          @click="$emit('export-json')"
          class="w-full p-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/40 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <Icon icon="mdi:file-document" class="w-4 h-4" />
          Exportar Projeto
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  showGrid: boolean
  zoom: number
}

defineProps<Props>()

defineEmits<{
  'toggle-grid': []
  'zoom-in': []
  'zoom-out': []
  'zoom-change': [zoom: number]
  'clear-canvas': []
  'reset-view': []
  'export-png': []
  'export-json': []
}>()
</script>
