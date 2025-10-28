<template>
  <div
    ref="containerRef"
    class="relative w-full h-full"
    role="application"
    :aria-label="ariaLabel"
    tabindex="0"
    @keydown="handleKeyDown"
  >
    <!-- Skip link for keyboard users -->
    <a
      href="#canvas-controls"
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
    >
      Skip to canvas controls
    </a>

    <!-- Canvas with ARIA attributes -->
    <canvas
      ref="canvasRef"
      :width="width"
      :height="height"
      :aria-label="canvasAriaLabel"
      role="img"
      tabindex="-1"
      class="w-full h-full"
    />

    <!-- Screen reader announcements -->
    <div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
      {{ announcement }}
    </div>

    <!-- Keyboard shortcuts help -->
    <div
      v-if="showKeyboardHelp"
      role="dialog"
      aria-labelledby="keyboard-help-title"
      aria-modal="true"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="showKeyboardHelp = false"
    >
      <div class="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-auto">
        <h2 id="keyboard-help-title" class="text-2xl font-bold mb-4">Keyboard Shortcuts</h2>

        <div class="space-y-4">
          <div v-for="(shortcuts, category) in keyboardShortcuts" :key="category">
            <h3 class="text-lg font-semibold mb-2">{{ category }}</h3>
            <dl class="grid grid-cols-2 gap-2">
              <template v-for="shortcut in shortcuts" :key="shortcut.key">
                <dt class="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {{ shortcut.key }}
                </dt>
                <dd class="text-sm">{{ shortcut.description }}</dd>
              </template>
            </dl>
          </div>
        </div>

        <button
          @click="showKeyboardHelp = false"
          class="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Focus indicator -->
    <div
      v-if="showFocusIndicator"
      :style="{
        left: focusPosition.x + 'px',
        top: focusPosition.y + 'px',
      }"
      class="absolute w-8 h-8 border-4 border-blue-600 rounded-full pointer-events-none animate-pulse"
      role="presentation"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useAccessibility } from '@/composables/useAccessibility'

interface Props {
  width: number
  height: number
  elements: any[]
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: 'Agroecology planning canvas',
})

const emit = defineEmits<{
  'keyboard-command': [command: string]
  'focus-element': [elementId: string]
}>()

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const announcement = ref('')
const showKeyboardHelp = ref(false)
const showFocusIndicator = ref(false)
const focusPosition = ref({ x: 0, y: 0 })

const { announce, handleKeyboardNav, prefersReducedMotion } = useAccessibility({
  announceChanges: true,
  enableKeyboardNav: true,
})

// Canvas description for screen readers
const canvasAriaLabel = computed(() => {
  const count = props.elements.length
  return `Canvas with ${count} element${count !== 1 ? 's' : ''}. Press ? for keyboard shortcuts.`
})

// Keyboard shortcuts configuration
const keyboardShortcuts = {
  Navigation: [
    { key: 'Arrow Keys', description: 'Move focus' },
    { key: 'Tab', description: 'Next element' },
    { key: 'Shift+Tab', description: 'Previous element' },
    { key: 'Home', description: 'First element' },
    { key: 'End', description: 'Last element' },
  ],
  Tools: [
    { key: 'V', description: 'Select tool' },
    { key: 'R', description: 'Rectangle tool' },
    { key: 'C', description: 'Circle tool' },
    { key: 'B', description: 'Brush tool' },
    { key: 'P', description: 'Pencil tool' },
  ],
  Actions: [
    { key: 'Ctrl+Z', description: 'Undo' },
    { key: 'Ctrl+Y', description: 'Redo' },
    { key: 'Ctrl+C', description: 'Copy' },
    { key: 'Ctrl+V', description: 'Paste' },
    { key: 'Delete', description: 'Delete selected' },
  ],
  View: [
    { key: '+', description: 'Zoom in' },
    { key: '-', description: 'Zoom out' },
    { key: '0', description: 'Reset zoom' },
    { key: 'G', description: 'Toggle grid' },
    { key: 'F', description: 'Fit to view' },
  ],
  Help: [
    { key: '?', description: 'Show keyboard shortcuts' },
    { key: 'Escape', description: 'Close dialogs / Deselect' },
  ],
}

// Handle keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  handleKeyboardNav(e, {
    '?': () => {
      showKeyboardHelp.value = true
      announce('Keyboard shortcuts dialog opened')
    },
    escape: () => {
      if (showKeyboardHelp.value) {
        showKeyboardHelp.value = false
        announce('Keyboard shortcuts dialog closed')
      } else {
        emit('keyboard-command', 'deselect')
        announce('Selection cleared')
      }
    },
    v: () => {
      emit('keyboard-command', 'select-tool')
      announce('Select tool activated')
    },
    r: () => {
      emit('keyboard-command', 'rectangle-tool')
      announce('Rectangle tool activated')
    },
    c: () => {
      emit('keyboard-command', 'circle-tool')
      announce('Circle tool activated')
    },
    b: () => {
      emit('keyboard-command', 'brush-tool')
      announce('Brush tool activated')
    },
    p: () => {
      emit('keyboard-command', 'pencil-tool')
      announce('Pencil tool activated')
    },
    g: () => {
      emit('keyboard-command', 'toggle-grid')
      announce('Grid toggled')
    },
    f: () => {
      emit('keyboard-command', 'fit-view')
      announce('Canvas fitted to view')
    },
    '+': () => {
      emit('keyboard-command', 'zoom-in')
      announce('Zoomed in')
    },
    '-': () => {
      emit('keyboard-command', 'zoom-out')
      announce('Zoomed out')
    },
    '0': () => {
      emit('keyboard-command', 'reset-zoom')
      announce('Zoom reset to 100%')
    },
    'ctrl+z': () => {
      emit('keyboard-command', 'undo')
      announce('Action undone')
    },
    'ctrl+y': () => {
      emit('keyboard-command', 'redo')
      announce('Action redone')
    },
    'ctrl+c': () => {
      emit('keyboard-command', 'copy')
      announce('Selection copied')
    },
    'ctrl+v': () => {
      emit('keyboard-command', 'paste')
      announce('Selection pasted')
    },
    delete: () => {
      emit('keyboard-command', 'delete')
      announce('Selection deleted')
    },
    arrowup: () => {
      emit('keyboard-command', 'move-up')
      showFocusIndicator.value = true
    },
    arrowdown: () => {
      emit('keyboard-command', 'move-down')
      showFocusIndicator.value = true
    },
    arrowleft: () => {
      emit('keyboard-command', 'move-left')
      showFocusIndicator.value = true
    },
    arrowright: () => {
      emit('keyboard-command', 'move-right')
      showFocusIndicator.value = true
    },
  })
}

// Watch elements for announcements
watch(
  () => props.elements.length,
  (newCount, oldCount) => {
    if (newCount > oldCount) {
      announce(`Element added. Total: ${newCount}`)
    } else if (newCount < oldCount) {
      announce(`Element removed. Total: ${newCount}`)
    }
  }
)

// Focus canvas on mount
onMounted(() => {
  containerRef.value?.focus()
})

defineExpose({
  announce,
  focus: () => containerRef.value?.focus(),
})
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus\:not-sr-only:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
</style>
