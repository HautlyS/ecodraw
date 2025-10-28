/**
 * Canvas Constants
 * Centralized configuration for canvas behavior and constraints
 */

export const CANVAS_CONSTRAINTS = {
  // Dimension limits (in meters)
  MIN_WIDTH_METERS: 10,
  MAX_WIDTH_METERS: 200,
  MIN_HEIGHT_METERS: 10,
  MAX_HEIGHT_METERS: 200,

  // Grid settings
  MIN_GRID_SIZE_METERS: 0.5,
  MAX_GRID_SIZE_METERS: 10,
  DEFAULT_GRID_SIZE_METERS: 1,

  // Zoom settings
  MIN_ZOOM: 0.05,
  MAX_ZOOM: 3,
  DEFAULT_ZOOM: 1,
  ZOOM_STEP: 0.1,
  ZOOM_WHEEL_FACTOR: 0.1,

  // Pixels per meter (scale)
  DEFAULT_PIXELS_PER_METER: 20,
  MIN_PIXELS_PER_METER: 10,
  MAX_PIXELS_PER_METER: 50,

  // Performance
  MAX_HISTORY_ITEMS: 50,
  RENDER_THROTTLE_MS: 16, // ~60fps
  AUTO_SAVE_DEBOUNCE_MS: 2000,

  // Canvas window
  DEFAULT_WINDOW_WIDTH: 900,
  DEFAULT_WINDOW_HEIGHT: 700,
  MIN_WINDOW_WIDTH: 400,
  MIN_WINDOW_HEIGHT: 300,

  // Grid rendering
  MIN_GRID_SPACING_PX: 10, // Minimum pixels between grid lines
  MAJOR_GRID_INTERVAL: 5, // Major grid line every N grid units

  // Element constraints
  MIN_ELEMENT_SIZE: 0.1, // meters
  MAX_ELEMENT_SIZE: 50, // meters

  // Brush settings
  MIN_BRUSH_SIZE: 10,
  MAX_BRUSH_SIZE: 200,
  DEFAULT_BRUSH_SIZE: 10,
  MIN_BRUSH_OPACITY: 0.1,
  MAX_BRUSH_OPACITY: 1,
  DEFAULT_BRUSH_OPACITY: 1,
  MIN_BRUSH_HARDNESS: 0,
  MAX_BRUSH_HARDNESS: 1,
  DEFAULT_BRUSH_HARDNESS: 0.8,
} as const

export const CANVAS_COLORS = {
  // Element type colors
  PLANT: '#22c55e',
  TERRAIN: '#f59e0b',
  STRUCTURE: '#3b82f6',
  DEFAULT: '#6b7280',

  // Grid colors (light mode)
  GRID_LIGHT: 'rgba(203,213,225,0.5)',
  GRID_MAJOR_LIGHT: 'rgba(148,163,184,0.8)',
  GRID_LABEL_LIGHT: 'rgba(100,116,139,0.8)',

  // Grid colors (dark mode)
  GRID_DARK: 'rgba(71,85,105,0.3)',
  GRID_MAJOR_DARK: 'rgba(100,116,139,0.6)',
  GRID_LABEL_DARK: 'rgba(148,163,184,0.8)',

  // Canvas boundary
  BOUNDARY_LIGHT: 'rgba(245,158,11,0.8)',
  BOUNDARY_DARK: 'rgba(251,191,36,0.8)',

  // Background
  BG_LIGHT: '#f8fafc',
  BG_DARK: '#0f172a',
  CANVAS_BG_LIGHT: 'rgba(248,250,252,0.3)',
  CANVAS_BG_DARK: 'rgba(15,23,42,0.3)',
} as const

export const KEYBOARD_SHORTCUTS = {
  // Tools
  SELECT: 'v',
  SQUARE: 'r',
  CIRCLE: 'c',
  BRUSH: 'b',
  PENCIL: 'p',

  // Actions
  UNDO: 'ctrl+z',
  REDO: 'ctrl+y',
  EXPORT: 'ctrl+e',
  SAVE: 'ctrl+s',
  OPEN: 'ctrl+o',

  // View
  ZOOM_IN: '+',
  ZOOM_OUT: '-',
  RESET_ZOOM: '0',
  FIT_VIEW: 'f',
  TOGGLE_GRID: 'g',

  // Library
  OPEN_LIBRARY: 'l',

  // Selection
  SELECT_ALL: 'ctrl+a',
  DESELECT: 'escape',
  DELETE: 'delete',
  DUPLICATE: 'ctrl+d',

  // Help
  HELP: '?',
} as const

export const ELEMENT_CATEGORIES = {
  PLANTS: 'plants',
  TERRAIN: 'terrain',
  STRUCTURES: 'structures',
} as const

export const TOOL_TYPES = {
  SHAPE: 'shape',
  BRUSH: 'brush',
  PENCIL: 'pencil',
  SELECT: 'select',
} as const

export const SHAPE_TYPES = {
  CIRCLE: 'circle',
  SQUARE: 'square',
  RECTANGLE: 'rectangle',
  LINE: 'line',
} as const

export const EXPORT_FORMATS = {
  PNG: 'png',
  JPG: 'jpg',
  SVG: 'svg',
  JSON: 'json',
} as const

export const LOCAL_STORAGE_KEYS = {
  THEME: 'theme',
  CANVAS_SETTINGS: 'canvas_settings',
  RECENT_PROJECTS: 'recent_projects',
  USER_PREFERENCES: 'user_preferences',
  AUTO_SAVE: 'auto_save_',
} as const
