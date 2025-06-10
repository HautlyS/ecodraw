
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  elementsCount: number;
  selectedCount: number;
}

export const CanvasControls = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  showGrid,
  onToggleGrid,
  elementsCount,
  selectedCount
}: CanvasControlsProps) => {
  return (
    <>
      {/* Canvas Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onZoomOut}
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
          onClick={onZoomIn}
          className="shadow-lg"
          disabled={zoom >= 300}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onReset}
          className="shadow-lg ml-2"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant={showGrid ? "default" : "secondary"}
          size="sm"
          onClick={onToggleGrid}
          className="shadow-lg ml-2"
          title="Alternar grade (G)"
        >
          Grade
        </Button>
      </div>

      {/* Status Info */}
      <div className="absolute top-4 right-4 z-10 bg-card dark:bg-gray-700 px-3 py-1 rounded text-sm font-medium shadow-lg border">
        {elementsCount} elemento(s) | {selectedCount} selecionado(s)
      </div>
    </>
  );
};
