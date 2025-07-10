import { cn } from "@/lib/utils";
import { Plant, Terrain } from '../../types/canvasTypes';
import { useState } from "react";
import { parseSpacingToMeters, realWorldSizeToPixels, calculateIconSize, formatRealWorldSize } from "@/utils/plantSizes";
import { getPlantBorderColor, getShapeColor, hexToRgba, lightenColor, darkenColor } from "@/utils/colorUtils";

interface DrawingElement {
  id: number;
  type: 'plant' | 'terrain' | 'rectangle' | 'circle';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  plant?: Plant;
  terrain?: Terrain;
  selected?: boolean;
  rotation?: number;
  // Real-world size in meters (for terrain elements)
  realWorldWidth?: number;
  realWorldHeight?: number;
  // Terrain brush properties
  brushType?: 'rectangle' | 'circle' | 'path';
  texture?: string;
  // Path points for trail-like terrains
  pathPoints?: { x: number; y: number }[];
  // Brush properties
  selectedBrushMode?: 'rectangle' | 'circle' | 'brush';
  brushThickness?: number;
}

interface CanvasElementProps {
  element: DrawingElement;
  pixelsPerMeter?: number;
}

export const CanvasElement = ({ element, pixelsPerMeter = 10 }: CanvasElementProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const isSelected = element.selected;
  const selectionStyle = isSelected ? 'ring-2 ring-primary ring-offset-2 shadow-lg' : '';

  if (element.type === 'plant') {
    const realWorldSize = parseSpacingToMeters(element.plant?.spacing || '1x1m');
    const pixelSize = realWorldSizeToPixels(realWorldSize, pixelsPerMeter);
    const iconSize = calculateIconSize(pixelSize);
    
    // Get consistent color for this plant
    const borderColor = getPlantBorderColor(element.plant?.id || String(element.id));
    const backgroundColorLight = hexToRgba(borderColor, 0.1);
    const backgroundColorMedium = hexToRgba(borderColor, 0.2);
    const borderColorAlpha = hexToRgba(borderColor, 0.6);
    
    return (
      <div
        className={cn(
          "absolute plant-area cursor-move transition-all group border-2 border-dashed rounded-lg",
          selectionStyle,
          isSelected && "border-solid border-primary bg-primary/10"
        )}
        style={{
          left: element.x - pixelSize.width / 2,
          top: element.y - pixelSize.height / 2,
          width: pixelSize.width,
          height: pixelSize.height,
          transform: `rotate(${element.rotation || 0}deg)`,
          zIndex: isSelected ? 10 : 1,
          borderColor: isSelected ? undefined : borderColorAlpha,
          backgroundColor: isSelected ? undefined : backgroundColorLight,
          boxShadow: isSelected ? undefined : `0 0 8px ${hexToRgba(borderColor, 0.3)}`,
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Plant icon in center */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/95 dark:bg-gray-800/95 shadow-md hover:shadow-lg transition-all relative border-2 flex items-center justify-center"
          style={{
            width: iconSize,
            height: iconSize,
            fontSize: iconSize * 0.5,
            borderColor: borderColor,
            boxShadow: `0 2px 8px ${hexToRgba(borderColor, 0.4)}`,
          }}
        >
          {element.plant?.icon}
        </div>
        
        {/* Size indicator */}
        <div 
          className="absolute top-1 left-1 text-xs text-white px-1.5 py-0.5 rounded font-medium shadow-sm"
          style={{
            backgroundColor: borderColor,
            color: 'white',
          }}
        >
          {formatRealWorldSize(realWorldSize)}
        </div>
        
        {/* Selection handles */}
        {isSelected && (
          <>
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-nw-resize"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-ne-resize"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-sw-resize"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-se-resize"></div>
          </>
        )}
        
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-card dark:bg-gray-700 text-foreground text-sm rounded-lg shadow-lg border whitespace-nowrap z-20 min-w-max">
            <div className="font-medium" style={{ color: borderColor }}>{element.plant?.name}</div>
            <div className="text-muted-foreground text-xs">Espaçamento: {element.plant?.spacing}</div>
            <div className="text-muted-foreground text-xs">Época: {element.plant?.season}</div>
          </div>
        )}
      </div>
    );
  }

  // Terrain texture patterns
  const getTerrainPattern = (texture: string, color: string) => {
    switch (texture) {
      case 'water':
        return `radial-gradient(circle at 20% 20%, ${color}40 2px, transparent 2px),
                radial-gradient(circle at 80% 80%, ${color}60 1px, transparent 1px),
                linear-gradient(45deg, ${color}20 25%, transparent 25%)`;
      case 'grass':
        return `repeating-linear-gradient(
                  0deg, ${color}30, ${color}30 2px, transparent 2px, transparent 4px),
                repeating-linear-gradient(
                  90deg, ${color}20, ${color}20 1px, transparent 1px, transparent 3px)`;
      case 'sand':
        return `radial-gradient(circle at 25% 25%, ${color}40 1px, transparent 1px),
                radial-gradient(circle at 75% 75%, ${color}30 1px, transparent 1px)`;
      case 'rock':
        return `radial-gradient(ellipse at 30% 40%, ${color}60 3px, transparent 3px),
                radial-gradient(ellipse at 70% 20%, ${color}50 2px, transparent 2px)`;
      case 'trail':
      case 'dirt_road':
        return `repeating-linear-gradient(
                  45deg, ${color}40, ${color}40 3px, transparent 3px, transparent 6px)`;
      case 'building':
        return `repeating-linear-gradient(
                  0deg, ${color}50, ${color}50 5px, transparent 5px, transparent 10px),
                repeating-linear-gradient(
                  90deg, ${color}40, ${color}40 5px, transparent 5px, transparent 10px)`;
      default:
        return `repeating-linear-gradient(
                  45deg, ${color}30, ${color}30 2px, transparent 2px, transparent 8px)`;
    }
  };

  if (element.type === 'terrain') {
    const terrainWidth = element.width || 40;
    const terrainHeight = element.height || 40;
    const realWidth = element.realWorldWidth || 1;
    const realHeight = element.realWorldHeight || 1;
    const brushType = element.brushType || 'rectangle';
    
    // Handle path-based terrain (trails, streams, freehand brush)
    if (brushType === 'path' && element.pathPoints && element.pathPoints.length > 1) {
      const minX = Math.min(...element.pathPoints.map(p => p.x));
      const minY = Math.min(...element.pathPoints.map(p => p.y));
      const maxX = Math.max(...element.pathPoints.map(p => p.x));
      const maxY = Math.max(...element.pathPoints.map(p => p.y));
      
      const pathD = element.pathPoints.reduce((path, point, index) => {
        const relX = point.x - minX + 5;
        const relY = point.y - minY + 5;
        return index === 0 ? `M ${relX} ${relY}` : `${path} L ${relX} ${relY}`;
      }, '');
      
      const strokeWidth = element.brushThickness || 8;
      
      return (
        <div
          className={cn(
            "absolute terrain-path cursor-move transition-all",
            selectionStyle
          )}
          style={{
            left: minX - 5,
            top: minY - 5,
            width: maxX - minX + 10,
            height: maxY - minY + 10,
            transform: `rotate(${element.rotation || 0}deg)`,
            zIndex: isSelected ? 10 : 1,
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <svg
            width={maxX - minX + 10}
            height={maxY - minY + 10}
            className="absolute inset-0"
          >
            {/* Path shadow */}
            <path
              d={pathD}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth={strokeWidth + 2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(1,1)"
            />
            {/* Main path */}
            <path
              d={pathD}
              stroke={element.terrain?.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Path texture pattern - only for thinner paths */}
            {strokeWidth <= 12 && (
              <path
                d={pathD}
                stroke={element.terrain?.color + '60'}
                strokeWidth={Math.max(2, strokeWidth / 2)}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2 3"
              />
            )}
          </svg>
          
          {/* Trail icon */}
          <div 
            className="absolute text-sm pointer-events-none"
            style={{ 
              left: (maxX - minX) / 2,
              top: (maxY - minY) / 2,
              transform: 'translate(-50%, -50%)',
              color: element.terrain?.color,
              textShadow: '0 0 3px rgba(255,255,255,0.8)',
              fontSize: Math.min(strokeWidth, 16)
            }}
          >
            {element.terrain?.icon}
          </div>
          
          {/* Selection handles for paths */}
          {isSelected && (
            <>
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-move"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-move"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-move"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-move"></div>
            </>
          )}
          
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-card dark:bg-gray-700 text-foreground text-sm rounded shadow-lg border whitespace-nowrap z-20 min-w-max">
              <div className="font-medium">{element.terrain?.name}</div>
              <div className="text-muted-foreground text-xs">{element.terrain?.description}</div>
              <div className="text-muted-foreground text-xs">
                Espessura: {strokeWidth}px ({(strokeWidth / 10).toFixed(1)}m)
              </div>
              <div className="text-muted-foreground text-xs">
                Comprimento: ~{Math.round(Math.sqrt(Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2)) / 10)}m
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Handle area-based terrain
    if (element.brushType === 'brush') return null; // Remove icon for brush terrains
    const isCircle = brushType === 'circle';
    const borderRadius = isCircle ? '50%' : '4px';
    
    return (
      <div
        className={cn(
          "absolute terrain-brush cursor-move transition-all group border-2",
          selectionStyle
        )}
        style={{
          left: element.x,
          top: element.y,
          width: terrainWidth,
          height: terrainHeight,
          borderRadius: borderRadius,
          transform: `rotate(${element.rotation || 0}deg)`,
          backgroundColor: element.terrain?.color + '40',
          borderColor: element.terrain?.color,
          backgroundImage: getTerrainPattern(element.texture || 'default', element.terrain?.color || '#666'),
          backgroundSize: '8px 8px',
          zIndex: isSelected ? 10 : 1,
          boxShadow: `inset 0 0 0 1px ${element.terrain?.color}60`,
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Central icon for identification */}
        <div 
          className="absolute inset-0 flex items-center justify-center text-lg font-bold pointer-events-none"
          style={{ 
            color: element.terrain?.color,
            textShadow: '0 0 4px rgba(255,255,255,0.8), 0 0 8px rgba(255,255,255,0.6)',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
          }}
        >
          {element.terrain?.icon}
        </div>
        
        {/* Size indicator */}
        <div 
          className="absolute top-1 left-1 text-xs font-medium px-1 rounded text-white shadow-sm"
          style={{ backgroundColor: element.terrain?.color + 'CC' }}
        >
          {realWidth}×{realHeight}m
        </div>
        
        {/* Selection handles */}
        {isSelected && (
          <>
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-nw-resize"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-ne-resize"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-sw-resize"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-se-resize"></div>
          </>
        )}
        
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-card dark:bg-gray-700 text-foreground text-sm rounded shadow-lg border whitespace-nowrap z-20 min-w-max">
            <div className="font-medium">{element.terrain?.name}</div>
            <div className="text-muted-foreground text-xs">{element.terrain?.description}</div>
            <div className="text-muted-foreground text-xs">
              Área: {realWidth}×{realHeight}m ({realWidth * realHeight}m²)
            </div>
            <div className="text-muted-foreground text-xs">
              Textura: {element.texture}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (element.type === 'rectangle') {
    const shapeColor = getShapeColor(element.id);
    const lightColor = hexToRgba(shapeColor, 0.2);
    
    return (
      <div
        className={cn(
          "absolute border-2 cursor-move transition-all rounded-lg",
          selectionStyle
        )}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          transform: `rotate(${element.rotation || 0}deg)`,
          zIndex: isSelected ? 10 : 1,
          borderColor: shapeColor,
          backgroundColor: lightColor,
          boxShadow: `0 0 8px ${hexToRgba(shapeColor, 0.3)}`,
        }}
      >
        <div 
          className="absolute top-1 left-1 text-xs text-white px-1 rounded font-medium shadow-sm"
          style={{ backgroundColor: shapeColor }}
        >
          {Math.round((element.width || 0) / 10)}x{Math.round((element.height || 0) / 10)}m
        </div>
        
        {/* Selection handles */}
        {isSelected && (
          <>
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-nw-resize"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-ne-resize"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-sw-resize"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-se-resize"></div>
          </>
        )}
      </div>
    );
  }

  if (element.type === 'circle') {
    const diameter = element.radius ? element.radius * 2 : 0;
    const shapeColor = getShapeColor(element.id);
    const lightColor = hexToRgba(shapeColor, 0.2);
    
    return (
      <div
        className={cn(
          "absolute border-2 rounded-full cursor-move transition-all",
          selectionStyle
        )}
        style={{
          left: element.x,
          top: element.y,
          width: diameter,
          height: diameter,
          transform: `rotate(${element.rotation || 0}deg)`,
          zIndex: isSelected ? 10 : 1,
          borderColor: shapeColor,
          backgroundColor: lightColor,
          boxShadow: `0 0 8px ${hexToRgba(shapeColor, 0.3)}`,
        }}
      >
        <div 
          className="absolute top-1 left-1 text-xs text-white px-1 rounded font-medium shadow-sm"
          style={{ backgroundColor: shapeColor }}
        >
          ⌀{Math.round(diameter / 10)}m
        </div>
        
        {/* Selection handles */}
        {isSelected && (
          <>
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-nw-resize"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-ne-resize"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-sw-resize"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md cursor-se-resize"></div>
          </>
        )}
      </div>
    );
  }

  return null;
};