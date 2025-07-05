import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Grid3X3, 
  Maximize2,
  Info,
  Layers,
  Target,
  Minus,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

interface EnhancedCanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomToFit: () => void;
  onReset: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  elementsCount: number;
  selectedCount: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  zoomLevel: string;
  className?: string;
}

export const EnhancedCanvasControls = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomToFit,
  onReset,
  showGrid,
  onToggleGrid,
  elementsCount,
  selectedCount,
  canZoomIn,
  canZoomOut,
  zoomLevel,
  className,
}: EnhancedCanvasControlsProps) => {
  const { isMobile, isTablet } = useResponsive();

  const isCompact = isMobile || isTablet;

  return (
    <div className={cn("absolute top-4 right-4 z-10 flex flex-col gap-2", className)}>
      {/* Zoom Controls */}
      <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
        <CardContent className="p-2">
          <div className="flex flex-col gap-1">
            {/* Zoom Level Display */}
            <div className="flex items-center justify-center">
              <Badge 
                variant="secondary" 
                className="text-xs font-mono px-2 py-1 bg-primary/10 text-primary"
              >
                {zoomLevel}
              </Badge>
            </div>
            
            <Separator className="my-1" />
            
            {/* Zoom Buttons */}
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size={isCompact ? "sm" : "default"}
                onClick={onZoomIn}
                disabled={!canZoomIn}
                className="w-full gap-2 justify-start"
                title="Zoom In (Ctrl + +)"
              >
                <ZoomIn className="w-4 h-4" />
                {!isCompact && <span>Zoom In</span>}
              </Button>
              
              <Button
                variant="ghost"
                size={isCompact ? "sm" : "default"}
                onClick={onZoomOut}
                disabled={!canZoomOut}
                className="w-full gap-2 justify-start"
                title="Zoom Out (Ctrl + -)"
              >
                <ZoomOut className="w-4 h-4" />
                {!isCompact && <span>Zoom Out</span>}
              </Button>
              
              <Button
                variant="ghost"
                size={isCompact ? "sm" : "default"}
                onClick={onZoomToFit}
                className="w-full gap-2 justify-start"
                title="Zoom to Fit (Ctrl + 0)"
              >
                <Maximize2 className="w-4 h-4" />
                {!isCompact && <span>Fit</span>}
              </Button>
            </div>
            
            <Separator className="my-1" />
            
            {/* Quick Zoom Buttons for Mobile */}
            {isCompact && (
              <div className="grid grid-cols-3 gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onZoomToFit()}
                  className="text-xs px-1"
                  title="25%"
                >
                  25%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onZoomToFit()}
                  className="text-xs px-1"
                  title="100%"
                >
                  100%
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onZoomToFit()}
                  className="text-xs px-1"
                  title="200%"
                >
                  200%
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Controls */}
      <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
        <CardContent className="p-2">
          <div className="flex flex-col gap-1">
            <Button
              variant={showGrid ? "default" : "ghost"}
              size={isCompact ? "sm" : "default"}
              onClick={onToggleGrid}
              className="w-full gap-2 justify-start"
              title="Toggle Grid (G)"
            >
              <Grid3X3 className="w-4 h-4" />
              {!isCompact && <span>Grid</span>}
            </Button>
            
            <Button
              variant="ghost"
              size={isCompact ? "sm" : "default"}
              onClick={onReset}
              className="w-full gap-2 justify-start"
              title="Reset View (R)"
            >
              <RotateCcw className="w-4 h-4" />
              {!isCompact && <span>Reset</span>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Canvas Info */}
      <Card className="bg-background/95 backdrop-blur-sm border shadow-lg">
        <CardContent className="p-2">
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Layers className="w-3 h-3 text-primary" />
              <span className="font-medium">{elementsCount} elementos</span>
            </div>
            
            {selectedCount > 0 && (
              <div className="flex items-center gap-2">
                <Target className="w-3 h-3 text-accent" />
                <span className="font-medium text-accent">{selectedCount} selecionados</span>
              </div>
            )}
            
            {!isCompact && (
              <>
                <Separator className="my-1" />
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Info className="w-3 h-3" />
                  <span>1m = 10px</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Touch Instructions */}
      {isCompact && (
        <Card className="bg-primary/10 border-primary/20 shadow-lg">
          <CardContent className="p-2">
            <div className="text-xs text-primary space-y-1">
              <div className="font-medium">Controles Touch:</div>
              <div>📏 Pinçar: Zoom</div>
              <div>👆 Dois dedos: Pan</div>
              <div>👇 Toque longo: Menu</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};