
import { useRef, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { CanvasControls } from "./canvas/CanvasControls";
import { CanvasElement } from "./canvas/CanvasElement";
import { CanvasWelcome } from "./canvas/CanvasWelcome";
import { useCanvasEvents } from "@/hooks/useCanvasEvents";

interface CanvasProps {
  selectedTool: string;
  selectedPlant: any;
  selectedTerrain: any;
  onPlantUsed: () => void;
  onTerrainUsed: () => void;
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

export const Canvas = ({ selectedTool, selectedPlant, selectedTerrain, onPlantUsed, onTerrainUsed }: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragElement, setDragElement] = useState<DrawingElement | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentShape, setCurrentShape] = useState<DrawingElement | null>(null);
  const [showGrid, setShowGrid] = useState(true);

  const { getMousePosition, snapToGrid, findElementAtPosition } = useCanvasEvents();

  const selectElement = useCallback((elementId: number) => {
    setElements(prev => prev.map(el => ({
      ...el,
      selected: el.id === elementId
    })));
  }, []);

  const clearSelection = useCallback(() => {
    setElements(prev => prev.map(el => ({ ...el, selected: false })));
  }, []);

  const deleteSelectedElements = useCallback(() => {
    const selectedCount = elements.filter(el => el.selected).length;
    if (selectedCount > 0) {
      setElements(prev => prev.filter(el => !el.selected));
      toast.success(`${selectedCount} elemento(s) removido(s)`);
    }
  }, [elements]);

  const deleteElementAtPosition = useCallback((pos: { x: number; y: number }) => {
    const clickedElement = findElementAtPosition(pos, elements);
    if (clickedElement) {
      setElements(prev => prev.filter(el => el.id !== clickedElement.id));
      toast.success("Elemento removido");
      return true;
    }
    return false;
  }, [elements, findElementAtPosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rawPos = getMousePosition(e, canvasRef, zoom);
    const pos = snapToGrid(rawPos, showGrid);
    
    // Handle delete tool
    if (selectedTool === 'delete') {
      deleteElementAtPosition(pos);
      return;
    }

    // Check if clicking on an existing element for selection/dragging
    const clickedElement = findElementAtPosition(pos, elements);

    if (selectedTool === 'select' && clickedElement) {
      selectElement(clickedElement.id);
      setIsDragging(true);
      setDragElement(clickedElement);
      setDragOffset({
        x: pos.x - clickedElement.x,
        y: pos.y - clickedElement.y
      });
      return;
    }

    // Clear selection if clicking empty space with select tool
    if (selectedTool === 'select') {
      clearSelection();
      return;
    }

    // Add plant
    if (selectedPlant && (selectedTool === 'select' || !selectedTool)) {
      const newElement: DrawingElement = {
        id: Date.now(),
        type: 'plant',
        x: pos.x,
        y: pos.y,
        plant: selectedPlant,
      };
      
      setElements(prev => [...prev, newElement]);
      onPlantUsed();
      toast.success(`${selectedPlant.name} adicionada ao mapa!`);
      return;
    }

    // Add terrain element
    if (selectedTerrain && selectedTool === 'terrain') {
      const newElement: DrawingElement = {
        id: Date.now(),
        type: 'terrain',
        x: pos.x,
        y: pos.y,
        terrain: selectedTerrain,
      };
      
      setElements(prev => [...prev, newElement]);
      onTerrainUsed();
      toast.success(`${selectedTerrain.name} adicionado ao mapa!`);
      return;
    }

    // Start drawing shapes
    if (selectedTool === 'rectangle' || selectedTool === 'circle') {
      setIsDrawing(true);
      setStartPos(pos);
      
      const newShape: DrawingElement = {
        id: Date.now(),
        type: selectedTool as 'rectangle' | 'circle',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        radius: 0,
      };
      
      setCurrentShape(newShape);
    }
  }, [selectedTool, selectedPlant, selectedTerrain, elements, getMousePosition, snapToGrid, selectElement, clearSelection, onPlantUsed, onTerrainUsed, deleteElementAtPosition, findElementAtPosition, zoom, showGrid]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rawPos = getMousePosition(e, canvasRef, zoom);
    const pos = snapToGrid(rawPos, showGrid);

    // Handle dragging existing elements
    if (isDragging && dragElement) {
      const newPos = snapToGrid({
        x: pos.x - dragOffset.x,
        y: pos.y - dragOffset.y
      }, showGrid);
      
      setElements(prev => prev.map(el => 
        el.id === dragElement.id 
          ? { ...el, x: newPos.x, y: newPos.y }
          : el
      ));
      return;
    }

    // Handle drawing new shapes
    if (!isDrawing || !currentShape) return;

    const width = Math.abs(pos.x - startPos.x);
    const height = Math.abs(pos.y - startPos.y);
    
    const updatedShape: DrawingElement = {
      ...currentShape,
      x: Math.min(startPos.x, pos.x),
      y: Math.min(startPos.y, pos.y),
      width: width,
      height: height,
      radius: currentShape.type === 'circle' ? Math.min(width, height) / 2 : 0,
    };
    
    setCurrentShape(updatedShape);
  }, [isDragging, dragElement, dragOffset, isDrawing, currentShape, startPos, getMousePosition, snapToGrid, zoom, showGrid]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDragElement(null);
      setDragOffset({ x: 0, y: 0 });
    }

    if (isDrawing && currentShape) {
      const minSize = 10;
      if ((currentShape.width && currentShape.width > minSize) || 
          (currentShape.radius && currentShape.radius > minSize)) {
        setElements(prev => [...prev, currentShape]);
        toast.success(`${currentShape.type === 'rectangle' ? 'Retângulo' : 'Círculo'} criado!`);
      }
      setCurrentShape(null);
    }
    setIsDrawing(false);
  }, [isDragging, isDrawing, currentShape]);

  // Handle drop from plant library
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;

    try {
      const plantData = JSON.parse(data);
      const rawPos = getMousePosition(e, canvasRef, zoom);
      const pos = snapToGrid(rawPos, showGrid);
      
      const newElement: DrawingElement = {
        id: Date.now(),
        type: 'plant',
        x: pos.x,
        y: pos.y,
        plant: plantData,
      };
      
      setElements(prev => [...prev, newElement]);
      toast.success(`${plantData.name} adicionada via drag & drop!`);
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  }, [getMousePosition, snapToGrid, zoom, showGrid]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelectedElements();
      }
      if (e.key === 'Escape') {
        clearSelection();
        setCurrentShape(null);
        setIsDrawing(false);
        setIsDragging(false);
      }
      if (e.key === 'g' || e.key === 'G') {
        setShowGrid(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteSelectedElements, clearSelection]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 25, 300));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 25, 25));
  }, []);

  const handleReset = useCallback(() => {
    setZoom(100);
    setElements([]);
    setCurrentShape(null);
    setIsDrawing(false);
    setIsDragging(false);
    clearSelection();
    toast.success("Canvas resetado");
  }, [clearSelection]);

  const getCursorStyle = () => {
    if (selectedTool === 'select') return 'cursor-default';
    if (selectedTool === 'delete') return 'cursor-pointer';
    if (selectedTool === 'move') return 'cursor-grab';
    if (selectedPlant || selectedTerrain) return 'cursor-copy';
    return 'cursor-crosshair';
  };

  return (
    <div className="h-full relative bg-card dark:bg-gray-800 rounded-lg border border-border overflow-hidden transition-colors">
      <CanvasControls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        elementsCount={elements.length}
        selectedCount={elements.filter(el => el.selected).length}
      />

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className={`w-full h-full relative overflow-hidden ${getCursorStyle()} ${showGrid ? 'grid-pattern' : ''}`}
        style={{ 
          transform: `scale(${zoom / 100})`, 
          transformOrigin: 'center',
          transition: 'transform 0.2s ease'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        data-canvas="true"
      >
        {/* Render saved elements */}
        {elements.map(element => (
          <CanvasElement key={element.id} element={element} />
        ))}
        
        {/* Render current shape being drawn */}
        {currentShape && <CanvasElement element={currentShape} />}

        {/* Welcome Text for Empty Canvas */}
        {elements.length === 0 && !currentShape && <CanvasWelcome />}
      </div>
    </div>
  );
};
