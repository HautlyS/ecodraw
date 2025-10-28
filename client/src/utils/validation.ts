/**
 * Validation Utilities
 * Input validation and sanitization functions
 */

import { CANVAS_CONSTRAINTS } from '@/constants/canvas'
import type { CanvasSettings } from '@/types/canvas'

/**
 * Validate canvas width
 */
export function validateCanvasWidth(width: number): boolean {
  return (
    typeof width === 'number' &&
    !isNaN(width) &&
    width >= CANVAS_CONSTRAINTS.MIN_WIDTH_METERS &&
    width <= CANVAS_CONSTRAINTS.MAX_WIDTH_METERS
  )
}

/**
 * Validate canvas height
 */
export function validateCanvasHeight(height: number): boolean {
  return (
    typeof height === 'number' &&
    !isNaN(height) &&
    height >= CANVAS_CONSTRAINTS.MIN_HEIGHT_METERS &&
    height <= CANVAS_CONSTRAINTS.MAX_HEIGHT_METERS
  )
}

/**
 * Validate grid size
 */
export function validateGridSize(size: number): boolean {
  return (
    typeof size === 'number' &&
    !isNaN(size) &&
    size >= CANVAS_CONSTRAINTS.MIN_GRID_SIZE_METERS &&
    size <= CANVAS_CONSTRAINTS.MAX_GRID_SIZE_METERS
  )
}

/**
 * Validate zoom level
 */
export function validateZoom(zoom: number): boolean {
  return (
    typeof zoom === 'number' &&
    !isNaN(zoom) &&
    zoom >= CANVAS_CONSTRAINTS.MIN_ZOOM &&
    zoom <= CANVAS_CONSTRAINTS.MAX_ZOOM
  )
}

/**
 * Validate canvas settings
 */
export function validateCanvasSettings(settings: Partial<CanvasSettings>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (settings.widthMeters !== undefined && !validateCanvasWidth(settings.widthMeters)) {
    errors.push(
      `Width must be between ${CANVAS_CONSTRAINTS.MIN_WIDTH_METERS} and ${CANVAS_CONSTRAINTS.MAX_WIDTH_METERS} meters`
    )
  }

  if (settings.heightMeters !== undefined && !validateCanvasHeight(settings.heightMeters)) {
    errors.push(
      `Height must be between ${CANVAS_CONSTRAINTS.MIN_HEIGHT_METERS} and ${CANVAS_CONSTRAINTS.MAX_HEIGHT_METERS} meters`
    )
  }

  if (settings.gridSizeMeters !== undefined && !validateGridSize(settings.gridSizeMeters)) {
    errors.push(
      `Grid size must be between ${CANVAS_CONSTRAINTS.MIN_GRID_SIZE_METERS} and ${CANVAS_CONSTRAINTS.MAX_GRID_SIZE_METERS} meters`
    )
  }

  if (settings.pixelsPerMeter !== undefined) {
    if (
      typeof settings.pixelsPerMeter !== 'number' ||
      isNaN(settings.pixelsPerMeter) ||
      settings.pixelsPerMeter < CANVAS_CONSTRAINTS.MIN_PIXELS_PER_METER ||
      settings.pixelsPerMeter > CANVAS_CONSTRAINTS.MAX_PIXELS_PER_METER
    ) {
      errors.push(
        `Pixels per meter must be between ${CANVAS_CONSTRAINTS.MIN_PIXELS_PER_METER} and ${CANVAS_CONSTRAINTS.MAX_PIXELS_PER_METER}`
      )
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Sanitize number input
 */
export function sanitizeNumber(value: any, min: number, max: number, defaultValue: number): number {
  const num = Number(value)
  if (isNaN(num)) return defaultValue
  return Math.min(Math.max(num, min), max)
}

/**
 * Sanitize string input
 */
export function sanitizeString(value: any, maxLength: number = 100): string {
  if (typeof value !== 'string') return ''
  return value.slice(0, maxLength).trim()
}

/**
 * Validate email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9_\-\.]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
}

/**
 * Validate JSON string
 */
export function validateJSON(jsonString: string): {
  valid: boolean
  data?: any
  error?: string
} {
  try {
    const data = JSON.parse(jsonString)
    return { valid: true, data }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    }
  }
}

/**
 * Validate color hex
 */
export function validateHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color)
}

/**
 * Sanitize hex color
 */
export function sanitizeHexColor(color: string, defaultColor: string = '#000000'): string {
  if (validateHexColor(color)) return color
  return defaultColor
}
