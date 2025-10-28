<template>
  <!-- Corner handles (visible) -->
  <div
    class="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50 bg-blue-500 opacity-0 hover:opacity-100 transition-opacity rounded-tl-lg resize-handle"
    @mousedown.stop="$emit('resize-start', $event, 'nw')"
    title="Resize"
    aria-label="Redimensionar canto superior esquerdo"
  ></div>
  <div
    class="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50 bg-blue-500 opacity-0 hover:opacity-100 transition-opacity rounded-tr-lg resize-handle"
    @mousedown.stop="$emit('resize-start', $event, 'ne')"
    title="Resize"
    aria-label="Redimensionar canto superior direito"
  ></div>
  <div
    class="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50 bg-blue-500 opacity-0 hover:opacity-100 transition-opacity rounded-bl-lg resize-handle"
    @mousedown.stop="$emit('resize-start', $event, 'sw')"
    title="Resize"
    aria-label="Redimensionar canto inferior esquerdo"
  ></div>
  <div
    class="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 bg-blue-500 opacity-0 hover:opacity-100 transition-opacity rounded-br-lg resize-handle"
    @mousedown.stop="$emit('resize-start', $event, 'se')"
    title="Resize"
    aria-label="Redimensionar canto inferior direito"
  ></div>

  <!-- Edge resize handles (invisible but functional) -->
  <div
    class="absolute top-0 left-4 right-4 h-2 cursor-n-resize z-40"
    @mousedown.stop="$emit('resize-start', $event, 'n')"
    aria-label="Redimensionar borda superior"
  ></div>
  <div
    class="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize z-40"
    @mousedown.stop="$emit('resize-start', $event, 's')"
    aria-label="Redimensionar borda inferior"
  ></div>
  <div
    class="absolute left-0 top-4 bottom-4 w-2 cursor-w-resize z-40"
    @mousedown.stop="$emit('resize-start', $event, 'w')"
    aria-label="Redimensionar borda esquerda"
  ></div>
  <div
    class="absolute right-0 top-4 bottom-4 w-2 cursor-e-resize z-40"
    @mousedown.stop="$emit('resize-start', $event, 'e')"
    aria-label="Redimensionar borda direita"
  ></div>
</template>

<script setup lang="ts">
defineEmits<{
  'resize-start': [MouseEvent, string]
}>()
</script>

<style scoped>
/* Melhoria visual dos resize handles */
.resize-handle:hover {
  transform: scale(1.2);
  transition: transform 0.2s ease;
}
</style>
