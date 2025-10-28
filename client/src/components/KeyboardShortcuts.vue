<template>
  <Teleport to="body">
    <div
      v-if="showShortcuts"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click="closeShortcuts"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50"></div>

      <!-- Shortcuts Modal -->
      <div
        class="relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-2xl max-h-[80vh] overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-lg"
            >
              <Icon icon="mdi:keyboard" class="w-5 h-5" />
            </div>
            <h2 class="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h2>
          </div>
          <button
            @click="closeShortcuts"
            class="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <Icon icon="mdi:close" class="w-5 h-5" />
          </button>
        </div>

        <!-- Content -->
        <div class="overflow-y-auto max-h-[60vh] p-6">
          <div class="space-y-6">
            <!-- General Shortcuts -->
            <div>
              <h3 class="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                General
              </h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Show/Hide shortcuts</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">?</kbd>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Open element library</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">L</kbd>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Toggle grid</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">G</kbd>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Export canvas</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl + E</kbd>
                </div>
              </div>
            </div>

            <!-- Tool Shortcuts -->
            <div>
              <h3 class="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                Tools
              </h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Select tool</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">V</kbd>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Square tool</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">R</kbd>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Circle tool</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">C</kbd>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Brush tool</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">B</kbd>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Pencil tool</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">P</kbd>
                </div>
              </div>
            </div>

            <!-- Navigation Shortcuts -->
            <div>
              <h3 class="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                Navigation
              </h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Zoom in</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">+</kbd>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Zoom out</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">-</kbd>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Reset zoom</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">0</kbd>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Pan canvas</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Space + Drag</kbd>
                </div>
              </div>
            </div>

            <!-- Edit Shortcuts -->
            <div>
              <h3 class="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span class="w-2 h-2 bg-orange-500 rounded-full"></span>
                Edit
              </h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Undo</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl + Z</kbd>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Redo</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl + Y</kbd>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Clear canvas</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Ctrl + Delete</kbd>
                </div>
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span class="text-sm text-gray-700">Deselect all</span>
                  <kbd class="px-2 py-1 bg-gray-200 rounded text-xs font-mono">Escape</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div class="text-sm text-gray-500">
            Press <kbd class="px-1 py-0.5 bg-gray-200 rounded text-xs font-mono">?</kbd> anytime to
            toggle this help
          </div>
          <button
            @click="closeShortcuts"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  show?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  'tool-select': [toolId: string]
  'toggle-grid': []
  'zoom-in': []
  'zoom-out': []
  'reset-zoom': []
  undo: []
  redo: []
  export: []
  'clear-canvas': []
  'open-library': []
  'deselect-all': []
}>()

const showShortcuts = ref(props.show || false)

const closeShortcuts = () => {
  showShortcuts.value = false
  emit('close')
}

const handleKeydown = (event: KeyboardEvent) => {
  // Prevent shortcuts when typing in inputs
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    return
  }

  const key = event.key.toLowerCase()
  const ctrl = event.ctrlKey || event.metaKey
  const shift = event.shiftKey

  // Prevent default for handled shortcuts
  const preventDefault = () => {
    event.preventDefault()
    event.stopPropagation()
  }

  // Help shortcuts
  if (key === '?' && !ctrl && !shift) {
    preventDefault()
    showShortcuts.value = !showShortcuts.value
    return
  }

  // Close shortcuts modal
  if (key === 'escape') {
    if (showShortcuts.value) {
      preventDefault()
      closeShortcuts()
      return
    }
    emit('deselect-all')
    return
  }

  // General shortcuts
  if (key === 'l' && !ctrl && !shift) {
    preventDefault()
    emit('open-library')
    return
  }

  if (key === 'g' && !ctrl && !shift) {
    preventDefault()
    emit('toggle-grid')
    return
  }

  // Tool shortcuts
  if (key === 'v' && !ctrl && !shift) {
    preventDefault()
    emit('tool-select', 'select')
    return
  }

  if (key === 'r' && !ctrl && !shift) {
    preventDefault()
    emit('tool-select', 'square')
    return
  }

  if (key === 'c' && !ctrl && !shift) {
    preventDefault()
    emit('tool-select', 'circle')
    return
  }

  if (key === 'b' && !ctrl && !shift) {
    preventDefault()
    emit('tool-select', 'brush')
    return
  }

  if (key === 'p' && !ctrl && !shift) {
    preventDefault()
    emit('tool-select', 'pencil')
    return
  }

  // Zoom shortcuts
  if ((key === '+' || key === '=') && !ctrl && !shift) {
    preventDefault()
    emit('zoom-in')
    return
  }

  if (key === '-' && !ctrl && !shift) {
    preventDefault()
    emit('zoom-out')
    return
  }

  if (key === '0' && !ctrl && !shift) {
    preventDefault()
    emit('reset-zoom')
    return
  }

  // Edit shortcuts with Ctrl
  if (ctrl) {
    if (key === 'z' && !shift) {
      preventDefault()
      emit('undo')
      return
    }

    if (key === 'y' || (key === 'z' && shift)) {
      preventDefault()
      emit('redo')
      return
    }

    if (key === 'e') {
      preventDefault()
      emit('export')
      return
    }

    if (key === 'delete' || key === 'backspace') {
      preventDefault()
      emit('clear-canvas')
      return
    }
  }
}

// Watch for prop changes
import { watch } from 'vue'
watch(
  () => props.show,
  newValue => {
    if (newValue !== undefined) {
      showShortcuts.value = newValue
    }
  }
)

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Expose methods
defineExpose({
  show: () => {
    showShortcuts.value = true
  },
  hide: () => {
    showShortcuts.value = false
  },
  toggle: () => {
    showShortcuts.value = !showShortcuts.value
  },
})
</script>

<style scoped>
kbd {
  font-family:
    ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
}
</style>
