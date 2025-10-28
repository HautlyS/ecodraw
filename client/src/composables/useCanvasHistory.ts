import { ref } from 'vue'
import type { CanvasElement } from '@/types/canvas'

export function useCanvasHistory() {
  const elements = ref<CanvasElement[]>([])
  const history = ref<CanvasElement[][]>([])
  const historyIndex = ref(-1)

  const saveHistory = () => {
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }

    history.value.push(JSON.parse(JSON.stringify(elements.value)))
    historyIndex.value = history.value.length - 1

    if (history.value.length > 50) {
      history.value.shift()
      historyIndex.value--
    }
  }

  const undo = () => {
    if (historyIndex.value > 0) {
      historyIndex.value--
      elements.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
      return true
    }
    return false
  }

  const redo = () => {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      elements.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
      return true
    }
    return false
  }

  const canUndo = () => historyIndex.value > 0
  const canRedo = () => historyIndex.value < history.value.length - 1

  const addElement = (element: CanvasElement) => {
    elements.value.push(element)
    saveHistory()
  }

  const clear = () => {
    elements.value = []
    saveHistory()
  }

  return {
    elements,
    saveHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    addElement,
    clear,
  }
}
