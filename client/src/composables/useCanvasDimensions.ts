/**
 * Centralized Canvas Dimensions Management
 * Provides standardized window sizing and responsive behavior
 */

import { ref, computed } from 'vue'
import type { CanvasSettings } from '@/types/canvas'

export interface WindowDimensions {
  width: number
  height: number
  x: number
  y: number
}

export interface ResponsiveBreakpoints {
  mobile: number
  tablet: number
  desktop: number
  wide: number
}

const BREAKPOINTS: ResponsiveBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
  wide: 1920,
}

// Standard window sizes for different screen types
const WINDOW_PRESETS = {
  mobile: { width: 350, height: 500 },
  tablet: { width: 600, height: 700 },
  desktop: { width: 900, height: 750 },
  wide: { width: 1200, height: 900 },
}

// Minimum and maximum constraints
const CONSTRAINTS = {
  minWidth: 400,
  minHeight: 350,
  maxWidthRatio: 0.85, // 85% of screen width
  maxHeightRatio: 0.8, // 80% of screen height
  headerHeight: 52,
  toolbarHeight: 64, // Altura real da toolbar
  sidebarWidth: 384, // 96 * 4 (w-96)
  padding: 40,
}

export function useCanvasDimensions() {
  const screenWidth = ref(window.innerWidth)
  const screenHeight = ref(window.innerHeight)

  // Current device type
  const deviceType = computed(() => {
    if (screenWidth.value < BREAKPOINTS.mobile) return 'mobile'
    if (screenWidth.value < BREAKPOINTS.tablet) return 'tablet'
    if (screenWidth.value < BREAKPOINTS.desktop) return 'desktop'
    return 'wide'
  })

  // Available space for canvas window
  const availableSpace = computed(() => ({
    width: screenWidth.value - CONSTRAINTS.sidebarWidth - CONSTRAINTS.padding,
    height: screenHeight.value - CONSTRAINTS.toolbarHeight - CONSTRAINTS.padding,
  }))

  /**
   * Calculate optimal window dimensions based on canvas settings
   * Width and height are INDEPENDENT - no forced aspect ratio
   */
  const calculateWindowDimensions = (
    canvasSettings: CanvasSettings,
    isMaximized = false
  ): WindowDimensions => {
    if (isMaximized) {
      return {
        width: screenWidth.value,
        height: screenHeight.value - CONSTRAINTS.toolbarHeight,
        x: 0,
        y: CONSTRAINTS.toolbarHeight,
      }
    }

    const { widthMeters, heightMeters, pixelsPerMeter } = canvasSettings

    // Calculate ideal canvas size in pixels
    const idealCanvasWidth = widthMeters * pixelsPerMeter
    const idealCanvasHeight = heightMeters * pixelsPerMeter

    // Add padding for window chrome (borders, header, etc.)
    const windowPadding = 80
    let windowWidth = idealCanvasWidth + windowPadding
    let windowHeight = idealCanvasHeight + windowPadding + CONSTRAINTS.headerHeight

    // Apply maximum constraints (but DON'T maintain aspect ratio)
    const maxWidth = Math.floor(screenWidth.value * CONSTRAINTS.maxWidthRatio)
    const maxHeight = Math.floor(screenHeight.value * CONSTRAINTS.maxHeightRatio)

    // Simply clamp to max values without affecting the other dimension
    windowWidth = Math.min(windowWidth, maxWidth)
    windowHeight = Math.min(windowHeight, maxHeight)

    // Apply minimum constraints
    windowWidth = Math.max(CONSTRAINTS.minWidth, Math.round(windowWidth))
    windowHeight = Math.max(CONSTRAINTS.minHeight, Math.round(windowHeight))

    // Center the window
    const x = Math.max(0, (screenWidth.value - windowWidth) / 2)
    const y = Math.max(
      CONSTRAINTS.toolbarHeight,
      (screenHeight.value - windowHeight) / 2 + CONSTRAINTS.toolbarHeight / 2
    )

    return { width: windowWidth, height: windowHeight, x, y }
  }

  /**
   * Get preset window size for current device
   */
  const getPresetWindowSize = (): WindowDimensions => {
    const preset = WINDOW_PRESETS[deviceType.value]
    return {
      ...preset,
      x: (screenWidth.value - preset.width) / 2,
      y: (screenHeight.value - preset.height) / 2 + CONSTRAINTS.toolbarHeight / 2,
    }
  }

  /**
   * Calculate optimal zoom level for canvas to fit in window
   */
  const calculateOptimalZoom = (
    canvasSettings: CanvasSettings,
    windowDimensions: WindowDimensions
  ): number => {
    const { widthMeters, heightMeters, pixelsPerMeter } = canvasSettings
    const canvasWidth = widthMeters * pixelsPerMeter
    const canvasHeight = heightMeters * pixelsPerMeter

    // Available space inside window (minus padding)
    const availableWidth = windowDimensions.width - 80
    const availableHeight = windowDimensions.height - CONSTRAINTS.headerHeight - 80

    // Calculate zoom to fit
    const zoomX = availableWidth / canvasWidth
    const zoomY = availableHeight / canvasHeight
    const zoom = Math.min(zoomX, zoomY, 1) // Don't zoom in beyond 100%

    return Math.max(0.1, Math.min(5, zoom))
  }

  /**
   * Validate and constrain window dimensions
   */
  const constrainWindowDimensions = (dimensions: WindowDimensions): WindowDimensions => {
    const width = Math.max(CONSTRAINTS.minWidth, Math.min(dimensions.width, screenWidth.value))
    const height = Math.max(
      CONSTRAINTS.minHeight,
      Math.min(dimensions.height, screenHeight.value - CONSTRAINTS.toolbarHeight)
    )
    const x = Math.max(0, Math.min(dimensions.x, screenWidth.value - width))
    // Y mínimo é 0 (pode ir até o topo da tela, abaixo da toolbar)
    const y = Math.max(0, Math.min(dimensions.y, screenHeight.value - height))

    return { width, height, x, y }
  }

  // Update screen dimensions on resize
  const updateScreenDimensions = () => {
    screenWidth.value = window.innerWidth
    screenHeight.value = window.innerHeight
  }

  // Listen for window resize
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateScreenDimensions)
  }

  return {
    screenWidth,
    screenHeight,
    deviceType,
    availableSpace,
    calculateWindowDimensions,
    getPresetWindowSize,
    calculateOptimalZoom,
    constrainWindowDimensions,
    CONSTRAINTS,
    BREAKPOINTS,
  }
}
