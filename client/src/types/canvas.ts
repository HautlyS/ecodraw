export interface Plant {
  id: string
  name: string
  category: string
  description: string
  color?: string
  // Real-life dimensions in meters
  spacingMeters: number // Recommended spacing from other plants
  canopyDiameterMeters: number // Crown/canopy diameter when mature
  heightMeters?: number // Mature height
}

export interface Terrain {
  id: string
  name: string
  type: string
  description: string
  color?: string
}

export interface Structure {
  id: string
  name: string
  type: string
  description: string
  color?: string
  // Real-life dimensions in meters
  widthMeters: number
  heightMeters: number
  lengthMeters?: number
}

export interface CanvasElement {
  id: string
  type: 'plant' | 'terrain' | 'structure'
  name: string
  x: number // Position in pixels
  y: number // Position in pixels
  size: number // Size in pixels (converted from meters)
  sizeMeters?: number // Real-life size in meters
  shape: 'circle' | 'square' | 'rectangle' | 'line'
  color: string
  rotation?: number
  opacity?: number
  path?: { x: number; y: number }[]
  width?: number // For rectangles (in pixels)
  height?: number // For rectangles (in pixels)
  selected?: boolean // Selection state
  hovered?: boolean // Hover state
}

export interface DrawingTool {
  id: string
  name: string
  icon: string
  iconifyIcon?: string
  type: 'shape' | 'brush' | 'pencil' | 'select'
  cursor?: string
}

export interface BrushSettings {
  size: number
  opacity: number
  hardness: number
}

export interface CanvasSettings {
  widthMeters: number
  heightMeters: number
  gridSizeMeters: number
  showGrid: boolean
  snapToGrid: boolean
  pixelsPerMeter: number
}
