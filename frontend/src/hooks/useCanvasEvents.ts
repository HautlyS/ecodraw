
import { useCallback } from "react";

interface Position {
  x: number;
  y: number;
}

interface DrawingElement {
  id: number;
  type: 'plant' | 'terrain' | 'rectangle' | 'circle';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  plant?: any;
  terrain?: any;
  selected?: boolean;
  rotation?: number;
  // Real-world size in meters (for terrain elements)
  realWorldWidth?: number;
  realWorldHeight?: number;
  // Terrain brush properties
  brushType?: 'rectangle' | 'circle' | 'path';
  texture?: string;
  // Path points for trail-like terrains
  pathPoints?: { x: number; y: number }[];
}

export const useCanvasEvents = () => {
  const getMousePosition = useCallback((
    e: React.MouseEvent | MouseEvent | DragEvent | React.TouchEvent,
    canvasRef: React.RefObject<HTMLDivElement>,
    zoom: number,
    panOffset: { x: number; y: number } = { x: 0, y: 0 }
  ): Position => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = zoom / 100;
    
    let clientX: number, clientY: number;
    
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return { x: 0, y: 0 };
    }
    
    return {
      x: (clientX - rect.left - panOffset.x) / scale,
      y: (clientY - rect.top - panOffset.y) / scale
    };
  }, []);

  const snapToGrid = useCallback((pos: Position, showGrid: boolean): Position => {
    if (!showGrid) return pos;
    const gridSize = 10; // 1 meter grid for precise placement
    return {
      x: Math.round(pos.x / gridSize) * gridSize,
      y: Math.round(pos.y / gridSize) * gridSize
    };
  }, []);

  const isPointInElement = useCallback((pos: Position, element: DrawingElement): boolean => {
    if (element.type === 'plant') {
      const distance = Math.sqrt(
        Math.pow(pos.x - element.x, 2) + Math.pow(pos.y - element.y, 2)
      );
      return distance <= 20;
    } else if (element.type === 'terrain') {
      // Handle path-based terrain (trails, streams)
      if (element.brushType === 'path' && element.pathPoints) {
        for (let i = 0; i < element.pathPoints.length - 1; i++) {
          const p1 = element.pathPoints[i];
          const p2 = element.pathPoints[i + 1];
          const distance = distanceFromPointToLine(pos, p1, p2);
          if (distance <= 6) return true; // 6px tolerance for path selection
        }
        return false;
      }
      
      // Handle area-based terrain (rectangle/circle)
      if (element.brushType === 'circle') {
        const centerX = element.x + (element.width || 0) / 2;
        const centerY = element.y + (element.height || 0) / 2;
        const radius = (element.width || 0) / 2;
        const distance = Math.sqrt(
          Math.pow(pos.x - centerX, 2) + Math.pow(pos.y - centerY, 2)
        );
        return distance <= radius;
      } else {
        // Rectangle terrain
        const width = element.width || 40;
        const height = element.height || 40;
        return pos.x >= element.x && pos.x <= element.x + width &&
               pos.y >= element.y && pos.y <= element.y + height;
      }
    } else if (element.type === 'rectangle') {
      return pos.x >= element.x && pos.x <= element.x + (element.width || 0) &&
             pos.y >= element.y && pos.y <= element.y + (element.height || 0);
    } else if (element.type === 'circle') {
      const centerX = element.x + (element.radius || 0);
      const centerY = element.y + (element.radius || 0);
      const distance = Math.sqrt(
        Math.pow(pos.x - centerX, 2) + Math.pow(pos.y - centerY, 2)
      );
      return distance <= (element.radius || 0);
    }
    return false;
  }, []);

  // Helper function to calculate distance from point to line segment
  const distanceFromPointToLine = (point: Position, lineStart: Position, lineEnd: Position): number => {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) return Math.sqrt(A * A + B * B);
    
    let param = dot / lenSq;
    param = Math.max(0, Math.min(1, param));
    
    const xx = lineStart.x + param * C;
    const yy = lineStart.y + param * D;
    
    const dx = point.x - xx;
    const dy = point.y - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  };

  const findElementAtPosition = useCallback((
    pos: Position, 
    elements: DrawingElement[]
  ): DrawingElement | null => {
    return elements
      .slice()
      .reverse()
      .find(element => isPointInElement(pos, element)) || null;
  }, [isPointInElement]);

  return {
    getMousePosition,
    snapToGrid,
    isPointInElement,
    findElementAtPosition
  };
};
