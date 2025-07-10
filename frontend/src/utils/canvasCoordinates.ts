import { CANVAS_CONSTANTS } from './canvasConstants';

// Coordinate system utilities for canvas transformations

export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface CanvasTransform {
  zoom: number;
  panOffset: Point;
}

export interface CanvasViewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Calculate pixels per meter based on canvas dimensions and real-world size
 */
export const calculatePixelsPerMeter = (
  canvasDimensions: Dimensions,
  canvasRealSize: Dimensions
): number => {
  return Math.min(
    canvasDimensions.width / canvasRealSize.width,
    canvasDimensions.height / canvasRealSize.height
  );
};

/**
 * Convert meters to pixels
 */
export const metersToPixels = (meters: number, pixelsPerMeter: number): number => {
  return meters * pixelsPerMeter;
};

/**
 * Convert pixels to meters
 */
export const pixelsToMeters = (pixels: number, pixelsPerMeter: number): number => {
  return pixels / pixelsPerMeter;
};

/**
 * Get mouse position relative to canvas with zoom and pan transformations
 */
export const getCanvasMousePosition = (
  event: React.MouseEvent | MouseEvent | React.DragEvent,
  canvasRef: React.RefObject<HTMLElement>,
  transform: CanvasTransform
): Point => {
  if (!canvasRef.current) return { x: 0, y: 0 };
  
  const rect = canvasRef.current.getBoundingClientRect();
  const clientX = 'clientX' in event ? event.clientX : 0;
  const clientY = 'clientY' in event ? event.clientY : 0;
  
  // Get position relative to canvas
  const rawX = clientX - rect.left;
  const rawY = clientY - rect.top;
  
  // Apply inverse transform (zoom and pan)
  const x = (rawX - transform.panOffset.x) / (transform.zoom / 100);
  const y = (rawY - transform.panOffset.y) / (transform.zoom / 100);
  
  return { x, y };
};

/**
 * Snap point to grid if grid is enabled
 */
export const snapToGrid = (
  point: Point, 
  gridEnabled: boolean, 
  pixelsPerMeter: number
): Point => {
  if (!gridEnabled) return point;
  
  const gridSizePixels = CANVAS_CONSTANTS.GRID_SIZE_METERS * pixelsPerMeter;
  
  return {
    x: Math.round(point.x / gridSizePixels) * gridSizePixels,
    y: Math.round(point.y / gridSizePixels) * gridSizePixels
  };
};

/**
 * Calculate grid dimensions based on canvas size
 */
export const calculateGridDimensions = (
  canvasRealSize: Dimensions
): { horizontal: number; vertical: number } => {
  return {
    horizontal: Math.floor(canvasRealSize.width / CANVAS_CONSTANTS.GRID_SIZE_METERS),
    vertical: Math.floor(canvasRealSize.height / CANVAS_CONSTANTS.GRID_SIZE_METERS)
  };
};

/**
 * Calculate canvas viewport in world coordinates
 */
export const calculateViewport = (
  canvasDimensions: Dimensions,
  transform: CanvasTransform
): CanvasViewport => {
  const scale = transform.zoom / 100;
  const width = canvasDimensions.width / scale;
  const height = canvasDimensions.height / scale;
  
  return {
    x: -transform.panOffset.x / scale,
    y: -transform.panOffset.y / scale,
    width,
    height
  };
};

/**
 * Check if a point is within the viewport (with buffer for performance)
 */
export const isPointInViewport = (
  point: Point,
  viewport: CanvasViewport,
  buffer: number = CANVAS_CONSTANTS.PERFORMANCE.VIEWPORT_BUFFER
): boolean => {
  return (
    point.x >= viewport.x - buffer &&
    point.x <= viewport.x + viewport.width + buffer &&
    point.y >= viewport.y - buffer &&
    point.y <= viewport.y + viewport.height + buffer
  );
};

/**
 * Check if a rectangle intersects with the viewport
 */
export const isRectInViewport = (
  rect: { x: number; y: number; width: number; height: number },
  viewport: CanvasViewport,
  buffer: number = CANVAS_CONSTANTS.PERFORMANCE.VIEWPORT_BUFFER
): boolean => {
  return !(
    rect.x + rect.width < viewport.x - buffer ||
    rect.x > viewport.x + viewport.width + buffer ||
    rect.y + rect.height < viewport.y - buffer ||
    rect.y > viewport.y + viewport.height + buffer
  );
};

/**
 * Calculate distance between two points
 */
export const calculateDistance = (point1: Point, point2: Point): number => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate bounds for a set of points
 */
export const calculateBounds = (points: Point[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} => {
  if (points.length === 0) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  }
  
  const minX = Math.min(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxX = Math.max(...points.map(p => p.x));
  const maxY = Math.max(...points.map(p => p.y));
  
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
};

/**
 * Transform a point by rotation around a center
 */
export const rotatePoint = (point: Point, center: Point, angleDegrees: number): Point => {
  const angleRadians = (angleDegrees * Math.PI) / 180;
  const cos = Math.cos(angleRadians);
  const sin = Math.sin(angleRadians);
  
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos
  };
};
