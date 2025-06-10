
import { useRef, useEffect, useState } from "react";
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
}

export const Canvas = ({ selectedTool, selectedPlant, onPlantUsed }: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [elements, setElements] = useState<DrawingElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentShape, setCurrentShape] = useState<DrawingElement | null>(null);

  const getMousePosition = (e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = zoom / 100;
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePosition(e);

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
    } else if (selectedTool === 'rectangle' || selectedTool === 'circle') {
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
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentShape) return;

    const pos = getMousePosition(e);
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
  };

  const handleMouseUp = () => {
    if (isDrawing && currentShape) {
      if ((currentShape.width && currentShape.width > 5) || (currentShape.radius && currentShape.radius > 5)) {
        setElements(prev => [...prev, currentShape]);
        toast.success(`${currentShape.type === 'rectangle' ? 'Retângulo' : 'Círculo'} criado!`);
      }
      setCurrentShape(null);
    }
    setIsDrawing(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleReset = () => {
    setZoom(100);
    setElements([]);
    setCurrentShape(null);
    setIsDrawing(false);
    toast.success("Canvas resetado");
  };

  const renderElement = (element: DrawingElement) => {
    if (element.type === 'plant') {
      return (
        <div
          key={element.id}
          className="absolute plant-icon cursor-move"
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
          className="absolute border-2 border-primary bg-primary/20 cursor-move"
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
          className="absolute border-2 border-primary bg-primary/20 rounded-full cursor-move"
          style={{
            left: element.x,
            top: element.y,
            width: element.radius ? element.radius * 2 : 0,
            height: element.radius ? element.radius * 2 : 0,
          }}
        />
      );
    }
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
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="bg-card px-3 py-1 rounded text-sm font-medium shadow-lg border">
          {zoom}%
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleZoomIn}
          className="shadow-lg"
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

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className="w-full h-full grid-pattern cursor-crosshair relative overflow-hidden"
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
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
              <p className="text-sm">
                Selecione plantas da biblioteca ao lado ou use as ferramentas para desenhar sua área
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
