<template>
  <div
    v-if="isVisible"
    ref="cursorElement"
    :style="{
      left: position.x + 'px',
      top: position.y + 'px',
      transform: 'translate(-50%, -50%)',
    }"
    class="fixed pointer-events-none z-50 transition-all duration-75 ease-out"
  >
    <!-- Dynamic Cursor -->
    <div class="relative">
      <!-- Placing Element - Show Icon -->
      <div v-if="selectedElement" class="flex flex-col items-center gap-1">
        <div class="bg-white rounded-full p-2 shadow-lg border-2 border-gray-900">
          <Icon :icon="getElementIcon()" class="w-6 h-6 text-gray-900" />
        </div>
        <div class="bg-gray-900 text-white text-xs px-2 py-1 rounded font-bold shadow-lg">
          {{ selectedElement.name }}
        </div>
      </div>

      <!-- Drawing Tool - Show Crosshair -->
      <div v-else-if="selectedTool" class="relative">
        <!-- Bold White Crosshair -->
        <div class="relative w-8 h-8">
          <div
            class="absolute top-1/2 left-0 w-full h-0.5 bg-white transform -translate-y-1/2 shadow-lg"
          ></div>
          <div
            class="absolute top-0 left-1/2 w-0.5 h-full bg-white transform -translate-x-1/2 shadow-lg"
          ></div>
          <div
            class="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
          ></div>
        </div>
      </div>

      <!-- Default - Simple Dot -->
      <div v-else class="w-3 h-3 bg-white rounded-full shadow-lg border-2 border-gray-900"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import type { DrawingTool, BrushSettings, Plant, Terrain, Structure } from '@/types/canvas'

interface Props {
  selectedTool: DrawingTool | null
  selectedElement: Plant | Terrain | Structure | null
  brushSettings: BrushSettings
  isCanvasHovered: boolean
}

const props = defineProps<Props>()

const cursorElement = ref<HTMLElement>()
const position = ref({ x: 0, y: 0 })
const isVisible = ref(false)

const getElementIcon = () => {
  if (!props.selectedElement) return 'mdi:cursor-default-click'

  // Plant
  if ('category' in props.selectedElement) return 'mdi:sprout'

  // Terrain
  if ('type' in props.selectedElement && props.selectedElement.type.includes('Solo')) {
    return 'mdi:terrain'
  }

  // Structure
  return 'mdi:home'
}

const updatePosition = (event: MouseEvent) => {
  position.value = {
    x: event.clientX,
    y: event.clientY,
  }
}

onMounted(() => {
  document.addEventListener('mousemove', updatePosition)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', updatePosition)
})

// Show cursor only when canvas is hovered
watch(
  () => props.isCanvasHovered,
  newValue => {
    isVisible.value = newValue
  },
  { immediate: true }
)
</script>
<style scoped>
/* Hide default cursor when custom cursor is visible */
</style>
