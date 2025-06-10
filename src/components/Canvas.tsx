
import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { toast } from "sonner";

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

  const getMousePosition = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = zoom / 100;
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale
    };
  }, [zoom]);

  const snapToGrid = useCallback((pos: { x: number; y: number }) => {
    if (!showGrid) return pos;
    const gridSize = 20;
    return {
      x: Math.round(pos.x / gridSize) * gridSize,
      y: Math.round(pos.y / gridSize) * gridSize
    };
  }, [showGrid]);

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
    const clickedElement = elements
      .slice()
      .reverse()
      .find(element => {
        if (element.type === 'plant' || element.type === 'terrain') {
          const distance = Math.sqrt(
            Math.pow(pos.x - element.x, 2) + Math.pow(pos.y - element.y, 2)
          );
          return distance <= 25;
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
      });

    if (clickedElement) {
      setElements(prev => prev.filter(el => el.id !== clickedElement.id));
      toast.success("Elemento removido");
      return true;
    }
    return false;
  }, [elements]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rawPos = getMousePosition(e);
    const pos = snapToGrid(rawPos);
    
    // Handle delete tool
    if (selectedTool === 'delete') {
      deleteElementAtPosition(pos);
      return;
    }

    // Check if clicking on an existing element for selection/dragging
    const clickedElement = elements
      .slice()
      .reverse()
      .find(element => {
        if (element.type === 'plant' || element.type === 'terrain') {
          const distance = Math.sqrt(
            Math.pow(pos.x - element.x, 2) + Math.pow(pos.y - element.y, 2)
          );
          return distance <= 30;
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
      });

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
  }, [selectedTool, selectedPlant, selectedTerrain, elements, getMousePosition, snapToGrid, selectElement, clearSelection, onPlantUsed, onTerrainUsed, deleteElementAtPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rawPos = getMousePosition(e);
    const pos = snapToGrid(rawPos);

    // Handle dragging existing elements
    if (isDragging && dragElement) {
      const newPos = snapToGrid({
        x: pos.x - dragOffset.x,
        y: pos.y - dragOffset.y
      });
      
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
  }, [isDragging, dragElement, dragOffset, isDrawing, currentShape, startPos, getMousePosition, snapToGrid]);

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
      const rawPos = getMousePosition(e as any);
      const pos = snapToGrid(rawPos);
      
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
  }, [getMousePosition, snapToGrid]);

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

  const renderElement = useCallback((element: DrawingElement) => {
    const isSelected = element.selected;
    const selectionStyle = isSelected ? 'ring-2 ring-accent ring-offset-2 shadow-lg' : '';

    if (element.type === 'plant') {
      return (
        <div
          key={element.id}
          className={`absolute plant-icon cursor-move transition-all ${selectionStyle}`}
          style={{
            left: element.x - 25,
            top: element.y - 25,
            transform: `rotate(${element.rotation || 0}deg)`,
            zIndex: isSelected ? 10 : 1
          }}
        >
          <div className="w-12 h-12 text-2xl flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full border-2 border-green-300 dark:border-green-600 shadow-md hover:shadow-lg transition-all">
            {element.plant?.icon}
          </div>
        </div>
      );
    } else if (element.type === 'terrain') {
      return (
        <div
          key={element.id}
          className={`absolute terrain-element cursor-move transition-all ${selectionStyle}`}
          style={{
            left: element.x - 30,
            top: element.y - 30,
            transform: `rotate(${element.rotation || 0}deg)`,
            zIndex: isSelected ? 10 : 1
          }}
        >
          <div 
            className="w-16 h-16 text-2xl flex items-center justify-center rounded-lg border-2 shadow-md hover:shadow-lg transition-all"
            style={{ 
              backgroundColor: element.terrain?.color + '30',
              borderColor: element.terrain?.color,
              color: element.terrain?.color
            }}
          >
            {element.terrain?.icon}
          </div>
        </div>
      );
    } else if (element.type === 'rectangle') {
      return (
        <div
          key={element.id}
          className={`absolute border-2 border-primary bg-primary/20 dark:border-primary-dark dark:bg-primary-dark/20 cursor-move transition-all ${selectionStyle}`}
          style={{
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            transform: `rotate(${element.rotation || 0}deg)`,
            zIndex: isSelected ? 10 : 1
          }}
        />
      );
    } else if (element.type === 'circle') {
      return (
        <div
          key={element.id}
          className={`absolute border-2 border-primary bg-primary/20 dark:border-primary-dark dark:bg-primary-dark/20 rounded-full cursor-move transition-all ${selectionStyle}`}
          style={{
            left: element.x,
            top: element.y,
            width: element.radius ? element.radius * 2 : 0,
            height: element.radius ? element.radius * 2 : 0,
            transform: `rotate(${element.rotation || 0}deg)`,
            zIndex: isSelected ? 10 : 1
          }}
        />
      );
    }
  }, []);

  const getCursorStyle = () => {
    if (selectedTool === 'select') return 'cursor-default';
    if (selectedTool === 'delete') return 'cursor-pointer';
    if (selectedTool === 'move') return 'cursor-grab';
    if (selectedPlant || selectedTerrain) return 'cursor-copy';
    return 'cursor-crosshair';
  };

  return (
    <div className="h-full relative bg-card dark:bg-gray-800 rounded-lg border border-border overflow-hidden transition-colors">
      {/* Canvas Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleZoomOut}
          className="shadow-lg"
          disabled={zoom <= 25}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="bg-card dark:bg-gray-700 px-3 py-1 rounded text-sm font-medium shadow-lg border min-w-[60px] text-center">
          {zoom}%
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleZoomIn}
          className="shadow-lg"
          disabled={zoom >= 300}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleReset}
          className="shadow-lg ml-2"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant={showGrid ? "default" : "secondary"}
          size="sm"
          onClick={() => setShowGrid(!showGrid)}
          className="shadow-lg ml-2"
          title="Alternar grade (G)"
        >
          Grade
        </Button>
      </div>

      {/* Status Info */}
      <div className="absolute top-4 right-4 z-10 bg-card dark:bg-gray-700 px-3 py-1 rounded text-sm font-medium shadow-lg border">
        {elements.length} elemento(s) | {elements.filter(el => el.selected).length} selecionado(s)
      </div>

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
        {elements.map(renderElement)}
        
        {/* Render current shape being drawn */}
        {currentShape && renderElement(currentShape)}

        {/* Welcome Text for Empty Canvas */}
        {elements.length === 0 && !currentShape && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-muted-foreground">
              <div className="w-16 h-16 mx-auto mb-4 nature-gradient rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">🌱</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Comece seu projeto agroecológico</h3>
              <p className="text-sm max-w-md">
                Selecione plantas da biblioteca ao lado ou use as ferramentas para desenhar sua área.
                <br />
                <strong>Arraste e solte</strong> plantas diretamente no canvas!
                <br />
                Use <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Del</kbd> para excluir, <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> para cancelar, <kbd className="px-1 py-0.5 bg-muted rounded text-xs">G</kbd> para grade.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
