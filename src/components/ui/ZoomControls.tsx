import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, RotateCcw, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ZoomControlsProps {
  zoom: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomToFit: () => void;
  onResetZoom: () => void;
  className?: string;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoom,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
  onZoomToFit,
  onResetZoom,
  className
}) => {
  return (
    <div className={cn(
      "flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-gray-200 dark:border-gray-700",
      className
    )}>
      {/* Zoom Out */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Diminuir zoom"
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      {/* Zoom Level Display */}
      <div className="px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 min-w-[4rem] text-center">
        {Math.round(zoom)}%
      </div>
      
      {/* Zoom In */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Aumentar zoom"
      >
        <Plus className="h-4 w-4" />
      </Button>
      
      {/* Separator */}
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
      
      {/* Zoom to Fit */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onZoomToFit}
        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Ajustar à tela"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
      
      {/* Reset Zoom */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onResetZoom}
        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Resetar zoom (100%)"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};
