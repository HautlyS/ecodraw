// Canvas utility functions for modularization

import { Position, Size, DrawingElement, ResizeHandle } from '@/types/canvas.types';

// Parsing utilities
export const parseTerrainSize = (sizeString: string): Size => {
  if (sizeString === "Variável") {
    return { width: 1, height: 1 }; // Default 1x1m for variable size
  }
  
  const match = sizeString.match(/(\d+)x(\d+)m/);
  if (match) {
    return { width: parseInt(match[1]), height: parseInt(match[2]) };
  }
  
  // Handle single dimension (like "2x2m")
  const singleMatch = sizeString.match(/(\d+)m/);
  if (singleMatch) {
    const size = parseInt(singleMatch[1]);
    return { width: size, height: size };
  }
  
  // Default fallback
  return { width: 1, height: 1 };
};

export const parsePlantSpacing = (spacing: string, pixelsPerMeter: number): Size => {
  if (spacing.includes('x')) {
    const match = spacing.match(/(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)/);
    if (match) {
      const width = parseFloat(match[1]);
      const height = parseFloat(match[2]);
      return { width: width * pixelsPerMeter, height: height * pixelsPerMeter };
    }
  }
  const singleMatch = spacing.match(/(\d+(?:\.\d+)?)(cm|m)/);
  if (singleMatch) {
    const value = parseFloat(singleMatch[1]);
    const unit = singleMatch[2];
    const meters = unit === 'cm' ? value / 100 : value;
    const pixels = meters * pixelsPerMeter;
    return { width: pixels, height: pixels };
  }
  return { width: 40, height: 40 };
};

// Bounds calculation utilities
export const getElementBounds = (element: DrawingElement, pixelsPerMeter: number) => {
  if (element.type === 'plant') {
    const plantSize = parsePlantSpacing(element.plant?.spacing || '1x1m', pixelsPerMeter);
    return {
      x: element.x - plantSize.width / 2,
      y: element.y - plantSize.height / 2,
      width: plantSize.width,
      height: plantSize.height
    };
  } else if (element.type === 'circle' || (element.type === 'terrain' && element.brushType === 'circle')) {
    const radius = element.radius || 0;
    return {
      x: element.x,
      y: element.y,
      width: radius * 2,
      height: radius * 2
    };
  } else {
    return {
      x: element.x,
      y: element.y,
      width: element.width || 0,
      height: element.height || 0
    };
  }
};

// Handle detection utility
export const detectResizeHandle = (
  pos: Position, 
  element: DrawingElement, 
  pixelsPerMeter: number
): ResizeHandle | null => {
  if (!element.selected) return null;

  const handleSize = 8; // Size of resize handles
  const bounds = getElementBounds(element, pixelsPerMeter);
  
  const left = bounds.x;
  const top = bounds.y;
  const right = left + bounds.width;
  const bottom = top + bounds.height;
  
  // Check each handle
  if (Math.abs(pos.x - left) <= handleSize && Math.abs(pos.y - top) <= handleSize) return 'nw';
  if (Math.abs(pos.x - right) <= handleSize && Math.abs(pos.y - top) <= handleSize) return 'ne';
  if (Math.abs(pos.x - left) <= handleSize && Math.abs(pos.y - bottom) <= handleSize) return 'sw';
  if (Math.abs(pos.x - right) <= handleSize && Math.abs(pos.y - bottom) <= handleSize) return 'se';
  
  return null;
};

// Resize calculation utility
export const calculateNewBounds = (
  originalBounds: { x: number; y: number; width: number; height: number },
  resizeHandle: ResizeHandle,
  deltaX: number,
  deltaY: number,
  minSize: number = 20
) => {
  const newBounds = { ...originalBounds };
  
  switch (resizeHandle) {
    case 'nw':
      newBounds.x = originalBounds.x + deltaX;
      newBounds.y = originalBounds.y + deltaY;
      newBounds.width = originalBounds.width - deltaX;
      newBounds.height = originalBounds.height - deltaY;
      break;
    case 'ne':
      newBounds.y = originalBounds.y + deltaY;
      newBounds.width = originalBounds.width + deltaX;
      newBounds.height = originalBounds.height - deltaY;
      break;
    case 'sw':
      newBounds.x = originalBounds.x + deltaX;
      newBounds.width = originalBounds.width - deltaX;
      newBounds.height = originalBounds.height + deltaY;
      break;
    case 'se':
      newBounds.width = originalBounds.width + deltaX;
      newBounds.height = originalBounds.height + deltaY;
      break;
  }
  
  // Ensure minimum size
  newBounds.width = Math.max(newBounds.width, minSize);
  newBounds.height = Math.max(newBounds.height, minSize);
  
  return newBounds;
};

// Element update utility
export const updateElementFromBounds = (
  element: DrawingElement,
  newBounds: { x: number; y: number; width: number; height: number }
): DrawingElement => {
  if (element.type === 'plant') {
    // For plants, update the center position
    const newCenterX = newBounds.x + newBounds.width / 2;
    const newCenterY = newBounds.y + newBounds.height / 2;
    return { ...element, x: newCenterX, y: newCenterY };
  } else if (element.type === 'circle' || (element.type === 'terrain' && element.brushType === 'circle')) {
    // For circles, update radius
    const newRadius = Math.min(newBounds.width, newBounds.height) / 2;
    return {
      ...element,
      x: newBounds.x,
      y: newBounds.y,
      radius: newRadius,
      width: newRadius * 2,
      height: newRadius * 2
    };
  } else {
    // For rectangles
    return {
      ...element,
      x: newBounds.x,
      y: newBounds.y,
      width: newBounds.width,
      height: newBounds.height
    };
  }
};

// ID generation utility
export const generateElementId = (): number => {
  return Date.now() + Math.random();
};

// Canvas metrics calculation
export const calculateCanvasMetrics = (
  canvasDimensions: Size,
  canvasSize: Size | undefined,
  canvasRealSize: Size
) => {
  const effectiveSize = canvasSize || canvasRealSize;
  const pixelsPerMeter = Math.min(
    canvasDimensions.width / effectiveSize.width,
    canvasDimensions.height / effectiveSize.height
  );
  const gridSizeMeters = 2; // Each grid square = 2m x 2m
  const gridSizePixels = gridSizeMeters * pixelsPerMeter;
  
  return {
    pixelsPerMeter,
    gridSizeMeters,
    gridSizePixels,
    maxHorizontalGrids: Math.floor(effectiveSize.width / gridSizeMeters),
    maxVerticalGrids: Math.floor(effectiveSize.height / gridSizeMeters),
  };
};

// Path point distance calculation
export const shouldAddPathPoint = (
  newPoint: Position,
  lastPoint: Position,
  minDistance: number = 5
): boolean => {
  const distance = Math.sqrt(
    Math.pow(newPoint.x - lastPoint.x, 2) + 
    Math.pow(newPoint.y - lastPoint.y, 2)
  );
  return distance > minDistance;
};

// Cursor style utility
export const getCanvasCursorStyle = (
  isSpacePressed: boolean,
  isPanning: boolean,
  selectedTool: string,
  hasSelectedPlant: boolean,
  hasSelectedTerrain: boolean
): string => {
  if (isSpacePressed || isPanning) return 'cursor-grab';
  if (selectedTool === 'select') return 'cursor-default';
  if (selectedTool === 'delete') return 'cursor-pointer';
  if (hasSelectedPlant || hasSelectedTerrain) return 'cursor-copy';
  return 'cursor-crosshair';
};
