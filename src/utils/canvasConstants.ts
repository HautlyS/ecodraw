// Canvas Constants and Configuration
export const CANVAS_CONSTANTS = {
  // Grid and measurements
  GRID_SIZE_METERS: 2, // Each grid square = 2m x 2m
  
  // UI measurements
  HANDLE_SIZE: 8, // Size of resize handles in pixels
  MIN_ELEMENT_SIZE: 20, // Minimum size for elements in pixels
  MIN_SHAPE_SIZE: 10, // Minimum size for drawn shapes
  
  // Canvas boundaries
  DEFAULT_CANVAS_REAL_SIZE: { width: 50, height: 30 }, // meters
  DEFAULT_CANVAS_DIMENSIONS: { width: 1000, height: 800 }, // pixels
  
  // Zoom settings
  ZOOM_SETTINGS: {
    MOBILE: { min: 25, max: 200, step: 15 },
    TABLET: { min: 25, max: 200, step: 15 },
    DESKTOP: { min: 10, max: 300, step: 15 },
    LARGE_DESKTOP: { min: 10, max: 400, step: 10 },
    ULTRA_WIDE: { min: 10, max: 400, step: 10 }
  },
  
  // Tool cursors
  CURSORS: {
    select: 'cursor-default',
    delete: 'cursor-pointer',
    plant: 'cursor-copy',
    terrain: 'cursor-copy',
    rectangle: 'cursor-crosshair',
    circle: 'cursor-crosshair',
    panning: 'cursor-grab',
    grabbing: 'cursor-grabbing'
  },
  
  // Drawing settings
  TERRAIN_BRUSH: {
    DEFAULT_THICKNESS: 20,
    PATH_DISTANCE_THRESHOLD: 5, // Minimum distance between path points
    DEFAULT_PATH_LENGTH: 5 // Default path length for terrain
  },
  
  // Animation and transitions
  TRANSITIONS: {
    ZOOM_DURATION: 200,
    PAN_DURATION: 200,
    SELECTION_DURATION: 200
  },
  
  // Toast durations
  TOAST_DURATION: {
    SUCCESS: 2000,
    ERROR: 3000,
    INFO: 1000
  },
  
  // Performance settings
  PERFORMANCE: {
    UNDO_HISTORY_SIZE: 50,
    DEBOUNCE_MS: 300,
    VIEWPORT_BUFFER: 100 // Extra pixels around viewport for rendering
  }
} as const;

// Tool types
export type CanvasTool = 'select' | 'rectangle' | 'circle' | 'delete' | 'terrain';

// Canvas modes
export type CanvasMode = 'drawing' | 'selecting' | 'dragging' | 'resizing' | 'panning';

// Brush types for terrain
export type BrushType = 'rectangle' | 'circle' | 'path' | 'brush';

// Element types
export type ElementType = 'plant' | 'terrain' | 'rectangle' | 'circle';

// Resize handle positions
export type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se';

// Keyboard shortcuts mapping
export const KEYBOARD_SHORTCUTS = {
  // Tools
  's': 'select',
  'r': 'rectangle', 
  'c': 'circle',
  't': 'terrain',
  'd': 'delete',
  
  // Actions
  'g': 'toggleGrid',
  'Escape': 'cancel',
  'Delete': 'deleteSelected',
  'Backspace': 'deleteSelected',
  
  // Zoom
  '0': 'resetZoom',
  '1': '25%',
  '2': '50%',
  '3': '75%',
  '4': '100%',
  '5': '125%',
  '6': '150%',
  '7': '175%',
  '8': '200%',
  '9': '225%',
  
  // Copy/Paste
  'c+ctrl': 'copy',
  'c+meta': 'copy',
  
  // Undo/Redo
  'z+ctrl': 'undo',
  'z+meta': 'undo',
  'y+ctrl': 'redo',
  'y+meta': 'redo',
  'z+ctrl+shift': 'redo',
  'z+meta+shift': 'redo',
  
  // Select all
  'a+ctrl': 'selectAll',
  'a+meta': 'selectAll'
} as const;

// Default colors for elements
export const DEFAULT_COLORS = {
  SHAPES: [
    '#3B82F6', // Blue
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ],
  GRID: '#10B981', // Emerald
  SELECTION: '#3B82F6', // Blue
  HANDLES: '#3B82F6' // Blue
} as const;
