<template>
  <div
    ref="windowElement"
    :style="{
      left: position.x + 'px',
      top: position.y + 'px',
      width: size.width + 'px',
      height: size.height + 'px',
    }"
    class="absolute bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden pointer-events-auto"
    :class="{ 'select-none': isDragging || isResizing }"
    @mousedown.stop
  >
    <!-- Resize Handles -->
    <CanvasResizeHandles v-if="!isMaximized" @resize-start="handleResizeStart" />

    <!-- Window Header -->
    <CanvasHeader
      :zoom="zoom"
      :elements-count="elementsCount"
      :canvas-settings="canvasSettings"
      :show-grid="showGrid"
      :is-maximized="isMaximized"
      @drag-start="handleDragStart"
      @minimize="$emit('minimize')"
      @maximize="$emit('maximize')"
      @toggle-grid="$emit('toggle-grid')"
      @fit-to-view="$emit('fit-to-view')"
      @zoom-in="$emit('zoom-in')"
      @zoom-out="$emit('zoom-out')"
      @reset-view="$emit('reset-view')"
      @open-settings="$emit('open-settings')"
    />

    <!-- Canvas Content -->
    <div
      class="relative w-full h-full bg-gray-50 dark:bg-gray-900 overflow-hidden"
      style="height: calc(100% - 52px)"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CanvasResizeHandles from './CanvasResizeHandles.vue'
import CanvasHeader from './CanvasHeader.vue'
import type { CanvasSettings } from '@/types/canvas'

interface Props {
  zoom: number
  elementsCount: number
  canvasSettings?: CanvasSettings
  showGrid: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  isDragging: boolean
  isResizing: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  minimize: []
  maximize: []
  'toggle-grid': []
  'fit-to-view': []
  'zoom-in': []
  'zoom-out': []
  'reset-view': []
  'open-settings': []
  'drag-start': [MouseEvent]
  'resize-start': [MouseEvent, string]
}>()

const windowElement = ref<HTMLElement>()

const handleDragStart = (event: MouseEvent) => {
  emit('drag-start', event)
}

const handleResizeStart = (event: MouseEvent, direction: string) => {
  emit('resize-start', event, direction)
}

defineExpose({ windowElement })
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
