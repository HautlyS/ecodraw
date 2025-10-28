<template>
  <canvas
    ref="canvasEl"
    class="w-full h-full block"
    style="margin: 0; padding: 0; border: 0; display: block"
    :style="{ cursor: computedCursor }"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
    @wheel.prevent="onWheel"
    @dragover.prevent
    @drop.prevent="onDrop"
    @touchstart.prevent="onTouchStart"
    @touchmove.prevent="onTouchMove"
    @touchend.prevent="onTouchEnd"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { CanvasElement, CanvasSettings } from '@/types/canvas'

interface Props {
  elements: CanvasElement[]
  zoom: number
  pan: { x: number; y: number }
  showGrid: boolean
  canvasSettings?: CanvasSettings
  cursor: string
  shouldHideCursor: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'mouse-down': [MouseEvent]
  'mouse-move': [MouseEvent]
  'mouse-up': []
  wheel: [WheelEvent]
  drop: [DragEvent]
  'touch-start': [TouchEvent]
  'touch-move': [TouchEvent]
  'touch-end': [TouchEvent]
}>()

const canvasEl = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D | null>(null)

const computedCursor = computed(() => (props.shouldHideCursor ? 'none' : props.cursor))

const onMouseDown = (e: MouseEvent) => emit('mouse-down', e)
const onMouseMove = (e: MouseEvent) => emit('mouse-move', e)
const onMouseUp = () => emit('mouse-up')
const onWheel = (e: WheelEvent) => emit('wheel', e)
const onDrop = (e: DragEvent) => emit('drop', e)
const onTouchStart = (e: TouchEvent) => emit('touch-start', e)
const onTouchMove = (e: TouchEvent) => emit('touch-move', e)
const onTouchEnd = (e: TouchEvent) => emit('touch-end', e)

defineExpose({ canvasEl, ctx })
</script>
