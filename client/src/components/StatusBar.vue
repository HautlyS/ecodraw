<template>
  <div
    class="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-2 flex items-center justify-between text-sm"
  >
    <!-- Left side - Tool and Element info -->
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-2">
        <span class="text-gray-500 dark:text-gray-400">Tool:</span>
        <span class="font-medium text-gray-700 dark:text-gray-300">
          {{ selectedTool ? selectedTool.name : 'None' }}
        </span>
      </div>

      <div v-if="selectedElement" class="flex items-center gap-2">
        <span class="text-gray-500 dark:text-gray-400">Element:</span>
        <div class="flex items-center gap-1">
          <div :class="['w-2 h-2 rounded-full', getElementColor()]"></div>
          <span class="font-medium text-gray-700 dark:text-gray-300">{{
            selectedElement.name
          }}</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-gray-500 dark:text-gray-400">Elements:</span>
        <span class="font-medium text-gray-700 dark:text-gray-300">{{ elementCount }}</span>
      </div>
    </div>

    <!-- Right side - Canvas info -->
    <div class="flex items-center gap-6">
      <div class="flex items-center gap-2">
        <span class="text-gray-500 dark:text-gray-400">Zoom:</span>
        <span class="font-medium text-gray-700 dark:text-gray-300"
          >{{ Math.round(zoom * 100) }}%</span
        >
      </div>

      <div class="flex items-center gap-2">
        <span class="text-gray-500 dark:text-gray-400">Grid:</span>
        <div
          :class="[
            'w-2 h-2 rounded-full',
            showGrid ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600',
          ]"
        ></div>
        <span class="font-medium text-gray-700 dark:text-gray-300">{{
          showGrid ? 'On' : 'Off'
        }}</span>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-gray-500 dark:text-gray-400">Ready</span>
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DrawingTool, Plant, Terrain, Structure } from '@/types/canvas'

interface Props {
  selectedTool: DrawingTool | null
  selectedElement: Plant | Terrain | Structure | null
  elementCount: number
  zoom: number
  showGrid: boolean
}

defineProps<Props>()

const getElementColor = () => {
  // This will be computed based on the selected element type
  return 'bg-blue-500' // Default color
}
</script>

<style scoped>
/* Status bar specific styles */
</style>
