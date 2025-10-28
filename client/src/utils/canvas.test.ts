import { describe, it, expect } from 'vitest'
import {
  hexToRgba,
  getElementColor,
  screenToWorld,
  worldToScreen,
  distance,
  snapToGrid,
  isPointInRect,
  isPointInCircle,
  clamp,
  generateId,
  deepClone,
  getCanvasDimensionsPx,
  calculateFitZoom,
  calculateCenterPan,
} from './canvas'
import type { CanvasSettings } from '@/types/canvas'

describe('Canvas Utils', () => {
  describe('hexToRgba', () => {
    it('converts hex to rgba correctly', () => {
      expect(hexToRgba('#ff0000', 0.5)).toBe('rgba(255,0,0,0.5)')
      expect(hexToRgba('#00ff00', 1)).toBe('rgba(0,255,0,1)')
      expect(hexToRgba('#0000ff', 0)).toBe('rgba(0,0,255,0)')
    })
  })

  describe('getElementColor', () => {
    it('returns correct colors for element types', () => {
      expect(getElementColor('plant')).toBe('#22c55e')
      expect(getElementColor('terrain')).toBe('#f59e0b')
      expect(getElementColor('structure')).toBe('#3b82f6')
    })
  })

  describe('screenToWorld', () => {
    it('converts screen coordinates to world coordinates', () => {
      const result = screenToWorld(100, 100, { x: 50, y: 50 }, 2)
      expect(result).toEqual({ x: 25, y: 25 })
    })
  })

  describe('worldToScreen', () => {
    it('converts world coordinates to screen coordinates', () => {
      const result = worldToScreen(25, 25, { x: 50, y: 50 }, 2)
      expect(result).toEqual({ x: 100, y: 100 })
    })
  })

  describe('distance', () => {
    it('calculates distance between two points', () => {
      expect(distance(0, 0, 3, 4)).toBe(5)
      expect(distance(0, 0, 0, 0)).toBe(0)
    })
  })

  describe('snapToGrid', () => {
    it('snaps value to grid', () => {
      expect(snapToGrid(23, 10)).toBe(20)
      expect(snapToGrid(27, 10)).toBe(30)
      expect(snapToGrid(25, 10)).toBe(30)
    })
  })

  describe('isPointInRect', () => {
    it('checks if point is inside rectangle', () => {
      expect(isPointInRect(5, 5, 0, 0, 10, 10)).toBe(true)
      expect(isPointInRect(15, 15, 0, 0, 10, 10)).toBe(false)
      expect(isPointInRect(0, 0, 0, 0, 10, 10)).toBe(true)
    })
  })

  describe('isPointInCircle', () => {
    it('checks if point is inside circle', () => {
      expect(isPointInCircle(5, 5, 0, 0, 10)).toBe(true)
      expect(isPointInCircle(15, 15, 0, 0, 10)).toBe(false)
      expect(isPointInCircle(0, 0, 0, 0, 0)).toBe(true)
    })
  })

  describe('clamp', () => {
    it('clamps value between min and max', () => {
      expect(clamp(5, 0, 10)).toBe(5)
      expect(clamp(-5, 0, 10)).toBe(0)
      expect(clamp(15, 0, 10)).toBe(10)
    })
  })

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(id1).toMatch(/^\d+-[a-z0-9]+$/)
    })
  })

  describe('deepClone', () => {
    it('deep clones objects', () => {
      const obj = { a: 1, b: { c: 2 } }
      const cloned = deepClone(obj)
      expect(cloned).toEqual(obj)
      expect(cloned).not.toBe(obj)
      expect(cloned.b).not.toBe(obj.b)
    })
  })

  describe('getCanvasDimensionsPx', () => {
    it('calculates canvas dimensions in pixels', () => {
      const settings: CanvasSettings = {
        widthMeters: 50,
        heightMeters: 30,
        gridSizeMeters: 1,
        showGrid: true,
        snapToGrid: true,
        pixelsPerMeter: 20,
      }
      const result = getCanvasDimensionsPx(settings)
      expect(result).toEqual({ width: 1000, height: 600 })
    })
  })

  describe('calculateFitZoom', () => {
    it('calculates optimal zoom to fit canvas', () => {
      const zoom = calculateFitZoom(1000, 600, 800, 600, 40)
      expect(zoom).toBeGreaterThan(0)
      expect(zoom).toBeLessThanOrEqual(1.5)
    })
  })

  describe('calculateCenterPan', () => {
    it('calculates center pan position', () => {
      const pan = calculateCenterPan(1000, 600, 800, 600, 1)
      expect(pan.x).toBeLessThan(0)
      expect(pan.y).toBe(0)
    })
  })
})
