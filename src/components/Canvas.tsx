
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface CanvasProps {
  selectedTool: string;
  selectedPlant: any;
  onPlantUsed: () => void;
}

export const Canvas = ({ selectedTool, selectedPlant, onPlantUsed }: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [elements, setElements] = useState<any[]>([]);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedPlant) {
      const newElement = {
        id: Date.now(),
        type: 'plant',
        x,
        y,
        plant: selectedPlant,
      };
      
      setElements(prev => [...prev, newElement]);
      onPlantUsed();
      toast.success(`${selectedPlant.name} adicionada ao mapa!`);
    } else if (selectedTool === 'rectangle') {
      // Add rectangle drawing logic
      toast.info("Clique e arraste para desenhar um retângulo");
    } else if (selectedTool === 'circle') {
      // Add circle drawing logic  
      toast.info("Clique e arraste para desenhar um círculo");
    }
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
    toast.success("Canvas resetado");
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
        className="w-full h-full grid-pattern cursor-crosshair relative"
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
        onClick={handleCanvasClick}
      >
        {/* Render elements */}
        {elements.map((element) => (
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
        ))}

        {/* Welcome Text for Empty Canvas */}
        {elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
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
