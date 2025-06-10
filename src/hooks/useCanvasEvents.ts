
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
}

export const useCanvasEvents = () => {
  const getMousePosition = useCallback((
    e: React.MouseEvent | MouseEvent | DragEvent,
    canvasRef: React.RefObject<HTMLDivElement>,
    zoom: number
  ): Position => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = zoom / 100;
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale
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
      return distance <= (element.type === 'plant' ? 25 : 30);
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
