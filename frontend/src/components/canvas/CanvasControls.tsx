
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
        <div className="flex items-center gap-1 bg-card/95 backdrop-blur-md rounded-xl border border-border/60 shadow-lg p-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={onZoomOut}
            className="shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            disabled={zoom <= 25}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <div className="bg-background px-3 py-1.5 rounded-lg text-sm font-semibold shadow-inner border min-w-[70px] text-center text-primary">
            {zoom}%
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onZoomIn}
            className="shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            disabled={zoom >= 300}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-1 bg-card/95 backdrop-blur-md rounded-xl border border-border/60 shadow-lg p-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={onReset}
            className="shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
            title="Resetar canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant={showGrid ? "default" : "secondary"}
            size="sm"
            onClick={onToggleGrid}
            className="shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 font-semibold"
            title="Alternar grade (G)"
          >
            Grade
          </Button>
        </div>
      </div>

      {/* Status Info */}
      <div className="absolute top-4 right-4 z-10 bg-card/95 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold shadow-lg border border-border/60">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="text-primary font-bold">{elementsCount}</span>
            elemento{elementsCount !== 1 ? 's' : ''}
          </span>
          {selectedCount > 0 && (
            <>
              <span className="text-border">•</span>
              <span className="flex items-center gap-1">
                <span className="text-primary font-bold">{selectedCount}</span>
                selecionado{selectedCount !== 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );
};
