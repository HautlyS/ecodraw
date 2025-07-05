
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
    const gridSize = 20;
    return {
      x: Math.round(pos.x / gridSize) * gridSize,
      y: Math.round(pos.y / gridSize) * gridSize
    };
  }, []);

  const isPointInElement = useCallback((pos: Position, element: DrawingElement): boolean => {
    if (element.type === 'plant' || element.type === 'terrain') {
      const distance = Math.sqrt(
        Math.pow(pos.x - element.x, 2) + Math.pow(pos.y - element.y, 2)
      );
      return distance <= (element.type === 'plant' ? 20 : 25);
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
