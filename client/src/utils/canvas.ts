/**
 * Canvas Utility Functions
 * Helper functions for canvas operations
 */

import type { CanvasElement, CanvasSettings } from '@/types/canvas'
import { CANVAS_COLORS } from '@/constants/canvas'

/**
 * Convert hex color to rgba
 */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

/**
 * Get color for element type
 */
export function getElementColor(type: 'plant' | 'terrain' | 'structure'): string {
  const colorMap = {
    plant: CANVAS_COLORS.PLANT,
    terrain: CANVAS_COLORS.TERRAIN,
    structure: CANVAS_COLORS.STRUCTURE,
  }
  return colorMap[type] || CANVAS_COLORS.DEFAULT
}

/**
 * Convert screen coordinates to world coordinates
 */
export function screenToWorld(
  screenX: number,
  screenY: number,
  pan: { x: number; y: number },
  zoom: number
): { x: number; y: number } {
  return {
    x: (screenX - pan.x) / zoom,
    y: (screenY - pan.y) / zoom,
  }
}

/**
 * Convert world coordinates to screen coordinates
 */
export function worldToScreen(
  worldX: number,
  worldY: number,
  pan: { x: number; y: number },
  zoom: number
): { x: number; y: number } {
  return {
    x: worldX * zoom + pan.x,
    y: worldY * zoom + pan.y,
  }
}

/**
 * Calculate distance between two points
 */
export function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.hypot(x2 - x1, y2 - y1)
}

/**
 * Snap value to grid
 */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize
}

/**
 * Check if point is inside rectangle
 */
export function isPointInRect(
  px: number,
  py: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
): boolean {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh
}

/**
 * Check if point is inside circle
 */
export function isPointInCircle(
  px: number,
  py: number,
  cx: number,
  cy: number,
  radius: number
): boolean {
  return distance(px, py, cx, cy) <= radius
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Calculate canvas dimensions in pixels
 */
export function getCanvasDimensionsPx(settings: CanvasSettings): {
  width: number
  height: number
} {
  return {
    width: settings.widthMeters * settings.pixelsPerMeter,
    height: settings.heightMeters * settings.pixelsPerMeter,
  }
}

/**
 * Calculate optimal zoom to fit canvas in view
 */
export function calculateFitZoom(
  canvasWidth: number,
  canvasHeight: number,
  viewWidth: number,
  viewHeight: number,
  padding: number = 40
): number {
  const availableWidth = viewWidth - padding * 2
  const availableHeight = viewHeight - padding * 2

  const zoomX = availableWidth / canvasWidth
  const zoomY = availableHeight / canvasHeight

  return Math.min(zoomX, zoomY, 1.5) // Max 1.5x zoom
}

/**
 * Calculate center pan position
 */
export function calculateCenterPan(
  canvasWidth: number,
  canvasHeight: number,
  viewWidth: number,
  viewHeight: number,
  zoom: number
): { x: number; y: number } {
  const scaledWidth = canvasWidth * zoom
  const scaledHeight = canvasHeight * zoom

  return {
    x: (viewWidth - scaledWidth) / 2,
    y: (viewHeight - scaledHeight) / 2,
  }
}

/**
 * Export canvas to data URL
 */
export function exportCanvasToDataURL(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpg' = 'png',
  quality: number = 1
): string {
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
  return canvas.toDataURL(mimeType, quality)
}

/**
 * Download data URL as file
 */
export function downloadDataURL(dataURL: string, filename: string): void {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataURL
  link.click()
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get element bounds
 */
export function getElementBounds(element: CanvasElement): {
  x: number
  y: number
  width: number
  height: number
} {
  if (element.shape === 'line' && element.path) {
    const xs = element.path.map(p => p.x)
    const ys = element.path.map(p => p.y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }
  }

  const halfSize = element.size / 2
  return {
    x: element.x - halfSize,
    y: element.y - halfSize,
    width: element.size,
    height: element.size,
  }
}

/**
 * Check if element is in viewport
 */
export function isElementInViewport(
  element: CanvasElement,
  viewX: number,
  viewY: number,
  viewWidth: number,
  viewHeight: number,
  zoom: number
): boolean {
  const bounds = getElementBounds(element)
  const screenBounds = {
    x: bounds.x * zoom,
    y: bounds.y * zoom,
    width: bounds.width * zoom,
    height: bounds.height * zoom,
  }

  return !(
    screenBounds.x + screenBounds.width < viewX ||
    screenBounds.x > viewX + viewWidth ||
    screenBounds.y + screenBounds.height < viewY ||
    screenBounds.y > viewY + viewHeight
  )
}
