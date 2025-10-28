<template>
  <div
    class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center gap-3 pointer-events-auto"
  >
    <button
      @click="$emit('zoom-out')"
      class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      title="Zoom Out"
    >
      <Icon icon="mdi:minus" class="w-4 h-4 text-gray-700 dark:text-gray-300" />
    </button>

    <input
      type="range"
      :value="zoom"
      @input="$emit('zoom-change', Number(($event.target as HTMLInputElement).value))"
      min="0.05"
      max="3"
      step="0.05"
      class="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
    />

    <span class="text-xs font-bold text-purple-700 dark:text-purple-300 w-12 text-center">
      {{ Math.round(zoom * 100) }}%
    </span>

    <button
      @click="$emit('zoom-in')"
      class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      title="Zoom In"
    >
      <Icon icon="mdi:plus" class="w-4 h-4 text-gray-700 dark:text-gray-300" />
    </button>

    <div class="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

    <button
      @click="$emit('fit-to-view')"
      class="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
      title="Fit to View"
    >
      <Icon icon="mdi:fit-to-screen" class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Props {
  zoom: number
}

defineProps<Props>()

defineEmits<{
  'zoom-in': []
  'zoom-out': []
  'zoom-change': [number]
  'fit-to-view': []
}>()
</script>
