
import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface CanvasProps {
  selectedTool: string;
  selectedPlant: any;
  onPlantUsed: () => void;
}

interface DrawingElement {
  id: number;
  type: 'plant' | 'rectangle' | 'circle';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  plant?: any;
  selected?: boolean;
}

export const Canvas = ({ selectedTool, selectedPlant, onPlantUsed }: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragElement, setDragElement] = useState<DrawingElement | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentShape, setCurrentShape] = useState<DrawingElement | null>(null);

  const getMousePosition = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = zoom / 100;
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale
    };
  }, [zoom]);

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

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const pos = getMousePosition(e);
    
    // Check if clicking on an existing element for selection/dragging
    const clickedElement = elements
      .slice()
      .reverse()
      .find(element => {
        if (element.type === 'plant') {
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

    if (selectedTool === 'delete' && clickedElement) {
      setElements(prev => prev.filter(el => el.id !== clickedElement.id));
      toast.success("Elemento removido");
      return;
    }

    // Clear selection if clicking empty space
    if (selectedTool === 'select') {
      clearSelection();
      return;
    }

    // Add plant
    if (selectedPlant) {
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
  }, [selectedTool, selectedPlant, elements, getMousePosition, selectElement, clearSelection, onPlantUsed]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const pos = getMousePosition(e);

    // Handle dragging existing elements
    if (isDragging && dragElement) {
      const newX = pos.x - dragOffset.x;
      const newY = pos.y - dragOffset.y;
      
      setElements(prev => prev.map(el => 
        el.id === dragElement.id 
          ? { ...el, x: newX, y: newY }
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
  }, [isDragging, dragElement, dragOffset, isDrawing, currentShape, startPos, getMousePosition]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDragElement(null);
      setDragOffset({ x: 0, y: 0 });
    }

    if (isDrawing && currentShape) {
      const minSize = 5;
      if ((currentShape.width && currentShape.width > minSize) || 
          (currentShape.radius && currentShape.radius > minSize)) {
        setElements(prev => [...prev, currentShape]);
        toast.success(`${currentShape.type === 'rectangle' ? 'Retângulo' : 'Círculo'} criado!`);
      }
      setCurrentShape(null);
    }
    setIsDrawing(false);
  }, [isDragging, isDrawing, currentShape]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelectedElements();
      }
      if (e.key === 'Escape') {
        clearSelection();
        setCurrentShape(null);
        setIsDrawing(false);
        setIsDragging(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteSelectedElements, clearSelection]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 25, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 25, 50));
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
    const selectionStyle = isSelected ? 'ring-2 ring-accent ring-offset-2' : '';

    if (element.type === 'plant') {
      return (
        <div
          key={element.id}
          className={`absolute plant-icon cursor-move transition-all ${selectionStyle}`}
          style={{
            left: element.x - 20,
            top: element.y - 20,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-10 h-10 text-2xl flex items-center justify-center bg-green-100 rounded-full border-2 border-green-300 shadow-md">
            {element.plant?.icon}
          </div>
        </div>
      );
    } else if (element.type === 'rectangle') {
      return (
        <div
          key={element.id}
          className={`absolute border-2 border-primary bg-primary/20 cursor-move transition-all ${selectionStyle}`}
          style={{
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
          }}
        />
      );
    } else if (element.type === 'circle') {
      return (
        <div
          key={element.id}
          className={`absolute border-2 border-primary bg-primary/20 rounded-full cursor-move transition-all ${selectionStyle}`}
          style={{
            left: element.x,
            top: element.y,
            width: element.radius ? element.radius * 2 : 0,
            height: element.radius ? element.radius * 2 : 0,
          }}
        />
      );
    }
  }, []);

  const getCursorStyle = () => {
    if (selectedTool === 'select') return 'cursor-default';
    if (selectedTool === 'delete') return 'cursor-pointer';
    if (selectedPlant) return 'cursor-copy';
    return 'cursor-crosshair';
  };

  return (
    <div className="h-full relative bg-card rounded-lg border border-border overflow-hidden">
      {/* Canvas Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleZoomOut}
          className="shadow-lg"
          disabled={zoom <= 50}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="bg-card px-3 py-1 rounded text-sm font-medium shadow-lg border min-w-[60px] text-center">
          {zoom}%
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleZoomIn}
          className="shadow-lg"
          disabled={zoom >= 200}
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
      </div>

      {/* Status Info */}
      <div className="absolute top-4 right-4 z-10 bg-card px-3 py-1 rounded text-sm font-medium shadow-lg border">
        {elements.length} elemento(s) | {elements.filter(el => el.selected).length} selecionado(s)
      </div>

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className={`w-full h-full grid-pattern relative overflow-hidden ${getCursorStyle()}`}
        style={{ 
          transform: `scale(${zoom / 100})`, 
          transformOrigin: 'center',
          transition: 'transform 0.2s ease'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
                Use Ctrl+Clique para seleção múltipla e Delete para remover elementos.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
