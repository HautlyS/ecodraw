/**
 * Canvas Worker
 * Offload heavy canvas computations to background thread
 */

import type { CanvasElement } from '@/types/canvas'

interface CalculateElementsMessage {
  type: 'calculateElements'
  payload: {
    elements: CanvasElement[]
    viewport: {
      x: number
      y: number
      width: number
      height: number
    }
    zoom: number
  }
}

interface OptimizePathMessage {
  type: 'optimizePath'
  payload: {
    path: { x: number; y: number }[]
    tolerance: number
  }
}

type WorkerMessage = CalculateElementsMessage | OptimizePathMessage

// Douglas-Peucker path simplification algorithm
function simplifyPath(
  points: { x: number; y: number }[],
  tolerance: number
): { x: number; y: number }[] {
  if (points.length <= 2) return points

  const getPerpendicularDistance = (
    point: { x: number; y: number },
    lineStart: { x: number; y: number },
    lineEnd: { x: number; y: number }
  ): number => {
    const dx = lineEnd.x - lineStart.x
    const dy = lineEnd.y - lineStart.y

    if (dx === 0 && dy === 0) {
      return Math.hypot(point.x - lineStart.x, point.y - lineStart.y)
    }

    const t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (dx * dx + dy * dy)
    const clampedT = Math.max(0, Math.min(1, t))
    const projX = lineStart.x + clampedT * dx
    const projY = lineStart.y + clampedT * dy

    return Math.hypot(point.x - projX, point.y - projY)
  }

  const simplifyRecursive = (
    points: { x: number; y: number }[],
    start: number,
    end: number
  ): { x: number; y: number }[] => {
    let maxDistance = 0
    let maxIndex = 0

    for (let i = start + 1; i < end; i++) {
      const distance = getPerpendicularDistance(points[i]!, points[start]!, points[end]!)
      if (distance > maxDistance) {
        maxDistance = distance
        maxIndex = i
      }
    }

    if (maxDistance > tolerance) {
      const left = simplifyRecursive(points, start, maxIndex)
      const right = simplifyRecursive(points, maxIndex, end)
      return [...left.slice(0, -1), ...right]
    }

    return [points[start]!, points[end]!]
  }

  return simplifyRecursive(points, 0, points.length - 1)
}

// Calculate visible elements
function calculateVisibleElements(
  elements: CanvasElement[],
  viewport: { x: number; y: number; width: number; height: number },
  zoom: number
): CanvasElement[] {
  return elements.filter(element => {
    const elementBounds = getElementBounds(element)

    return !(
      elementBounds.x + elementBounds.width < viewport.x ||
      elementBounds.x > viewport.x + viewport.width ||
      elementBounds.y + elementBounds.height < viewport.y ||
      elementBounds.y > viewport.y + viewport.height
    )
  })
}

// Get element bounds
function getElementBounds(element: CanvasElement): {
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

// Message handler
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const { type, payload } = e.data

  try {
    switch (type) {
      case 'calculateElements': {
        const visibleElements = calculateVisibleElements(
          payload.elements,
          payload.viewport,
          payload.zoom
        )

        self.postMessage({
          type: 'calculateElements',
          result: visibleElements,
        })
        break
      }

      case 'optimizePath': {
        const optimizedPath = simplifyPath(payload.path, payload.tolerance)

        self.postMessage({
          type: 'optimizePath',
          result: optimizedPath,
        })
        break
      }

      default:
        throw new Error(`Unknown message type: ${type}`)
    }
  } catch (error) {
    self.postMessage({
      type,
      result: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}

export {}
