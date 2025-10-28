import { ref } from 'vue'

const MIN_WINDOW_WIDTH = 400
const MIN_WINDOW_HEIGHT = 300
const DEFAULT_WINDOW_WIDTH = 900
const DEFAULT_WINDOW_HEIGHT = 700
const MIN_VISIBLE_PIXELS = 100
const HEADER_HEIGHT = 52

export function useCanvasWindow() {
  const windowElement = ref<HTMLElement>()
  const isDragging = ref(false)
  const dragOffset = ref({ x: 0, y: 0 })
  const windowPosition = ref({ x: 0, y: 0 })
  const windowSize = ref({ width: 800, height: 600 })
  const isMaximized = ref(false)
  const savedWindowState = ref({ x: 0, y: 0, width: 800, height: 600 })

  const isResizing = ref(false)
  const resizeDirection = ref<string>('')
  const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 })

  const startDrag = (event: MouseEvent) => {
    if (isMaximized.value) return

    isDragging.value = true
    dragOffset.value = {
      x: event.clientX - windowPosition.value.x,
      y: event.clientY - windowPosition.value.y,
    }

    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', stopDrag)
  }

  const handleDrag = (event: MouseEvent) => {
    if (!isDragging.value) return

    let newX = event.clientX - dragOffset.value.x
    let newY = event.clientY - dragOffset.value.y

    const canvasContainer = windowElement.value?.parentElement
    if (canvasContainer) {
      const containerRect = canvasContainer.getBoundingClientRect()
      const maxX = containerRect.width - MIN_VISIBLE_PIXELS
      const maxY = containerRect.height - MIN_VISIBLE_PIXELS

      newX = Math.max(-windowSize.value.width + MIN_VISIBLE_PIXELS, Math.min(newX, maxX))
      newY = Math.max(0, Math.min(newY, maxY))
    }

    windowPosition.value = { x: newX, y: newY }
  }

  const stopDrag = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleDrag)
    document.removeEventListener('mouseup', stopDrag)
  }

  const startResize = (event: MouseEvent, direction: string) => {
    if (isMaximized.value) return

    event.stopPropagation()
    isResizing.value = true
    resizeDirection.value = direction
    resizeStart.value = {
      x: event.clientX,
      y: event.clientY,
      width: windowSize.value.width,
      height: windowSize.value.height,
      posX: windowPosition.value.x,
      posY: windowPosition.value.y,
    }

    document.addEventListener('mousemove', handleResize)
    document.addEventListener('mouseup', stopResize)
  }

  const handleResize = (event: MouseEvent) => {
    if (!isResizing.value) return

    const deltaX = event.clientX - resizeStart.value.x
    const deltaY = event.clientY - resizeStart.value.y

    let newWidth = resizeStart.value.width
    let newHeight = resizeStart.value.height
    let newX = resizeStart.value.posX
    let newY = resizeStart.value.posY

    const canvasContainer = windowElement.value?.parentElement
    const containerRect = canvasContainer?.getBoundingClientRect()

    if (resizeDirection.value.includes('e')) {
      newWidth = Math.max(MIN_WINDOW_WIDTH, resizeStart.value.width + deltaX)
      if (containerRect && newX + newWidth > containerRect.width) {
        newWidth = containerRect.width - newX
      }
    }

    if (resizeDirection.value.includes('w')) {
      const potentialWidth = resizeStart.value.width - deltaX
      const potentialX = resizeStart.value.posX + deltaX

      if (potentialWidth >= MIN_WINDOW_WIDTH && potentialX >= 0) {
        newWidth = potentialWidth
        newX = potentialX
      } else if (potentialX < 0) {
        newWidth = resizeStart.value.width + resizeStart.value.posX
        newX = 0
      }
    }

    if (resizeDirection.value.includes('s')) {
      newHeight = Math.max(MIN_WINDOW_HEIGHT, resizeStart.value.height + deltaY)
      if (containerRect && newY + newHeight > containerRect.height) {
        newHeight = containerRect.height - newY
      }
    }

    if (resizeDirection.value.includes('n')) {
      const potentialHeight = resizeStart.value.height - deltaY
      const potentialY = resizeStart.value.posY + deltaY

      if (potentialHeight >= MIN_WINDOW_HEIGHT && potentialY >= 0) {
        newHeight = potentialHeight
        newY = potentialY
      } else if (potentialY < 0) {
        newHeight = resizeStart.value.height + resizeStart.value.posY
        newY = 0
      }
    }

    windowSize.value = { width: newWidth, height: newHeight }
    windowPosition.value = { x: newX, y: newY }
  }

  const stopResize = () => {
    if (!isResizing.value) return

    isResizing.value = false
    resizeDirection.value = ''
    document.removeEventListener('mousemove', handleResize)
    document.removeEventListener('mouseup', stopResize)

    if (!isMaximized.value) {
      savedWindowState.value = { ...windowPosition.value, ...windowSize.value }
    }
  }

  const minimizeWindow = () => {
    if (!isMaximized.value) {
      savedWindowState.value = { ...windowPosition.value, ...windowSize.value }
    }

    windowSize.value = { width: 300, height: HEADER_HEIGHT }
    windowPosition.value = {
      x: window.innerWidth - 320,
      y: window.innerHeight - HEADER_HEIGHT - 20,
    }
    isMaximized.value = false
  }

  const maximizeWindow = (containerElement?: HTMLElement) => {
    if (!containerElement) return

    const containerRect = containerElement.getBoundingClientRect()

    if (isMaximized.value) {
      windowPosition.value = {
        x: savedWindowState.value.x,
        y: savedWindowState.value.y,
      }
      windowSize.value = {
        width: savedWindowState.value.width,
        height: savedWindowState.value.height,
      }
      isMaximized.value = false
    } else {
      savedWindowState.value = { ...windowPosition.value, ...windowSize.value }
      windowPosition.value = { x: 0, y: 0 }
      windowSize.value = {
        width: containerRect.width,
        height: containerRect.height,
      }
      isMaximized.value = true
    }
  }

  const initializeWindow = (containerElement?: HTMLElement) => {
    if (!containerElement) return

    const containerRect = containerElement.getBoundingClientRect()

    windowSize.value = {
      width: containerRect.width,
      height: containerRect.height,
    }
    windowPosition.value = { x: 0, y: 0 }
    isMaximized.value = true

    savedWindowState.value = {
      x: Math.max(0, (containerRect.width - DEFAULT_WINDOW_WIDTH) / 2),
      y: Math.max(0, (containerRect.height - DEFAULT_WINDOW_HEIGHT) / 2),
      width: Math.min(DEFAULT_WINDOW_WIDTH, containerRect.width - 40),
      height: Math.min(DEFAULT_WINDOW_HEIGHT, containerRect.height - 40),
    }
  }

  const cleanup = () => {
    if (isDragging.value) {
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', stopDrag)
    }

    if (isResizing.value) {
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResize)
    }
  }

  return {
    windowElement,
    isDragging,
    isResizing,
    windowPosition,
    windowSize,
    isMaximized,
    startDrag,
    startResize,
    minimizeWindow,
    maximizeWindow,
    initializeWindow,
    cleanup,
  }
}
