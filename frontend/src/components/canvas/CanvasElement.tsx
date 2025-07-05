import { cn } from "@/lib/utils";
import { useState } from "react";

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
  // Real-world size in meters (for terrain elements)
  realWorldWidth?: number;
  realWorldHeight?: number;
  // Terrain brush properties
  brushType?: 'rectangle' | 'circle' | 'path';
  texture?: string;
  // Path points for trail-like terrains
  pathPoints?: { x: number; y: number }[];
}

interface CanvasElementProps {
  element: DrawingElement;
}

export const CanvasElement = ({ element }: CanvasElementProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const isSelected = element.selected;
  const selectionStyle = isSelected ? 'ring-2 ring-accent ring-offset-2 shadow-lg' : '';

  if (element.type === 'plant') {
    return (
      <div
        className={cn(
          "absolute plant-icon cursor-move transition-all group",
          selectionStyle
        )}
        style={{
          left: element.x - 20,
          top: element.y - 20,
          transform: `rotate(${element.rotation || 0}deg)`,
          zIndex: isSelected ? 10 : 1
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="w-10 h-10 text-2xl flex items-center justify-center rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md hover:shadow-lg transition-all relative border border-green-200 dark:border-green-700">
          {element.plant?.icon}
        </div>
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-card dark:bg-gray-700 text-foreground text-xs rounded shadow-lg border whitespace-nowrap z-20">
            {element.plant?.name}
            <br />
            <span className="text-muted-foreground text-xs">{element.plant?.spacing}</span>
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
    
    // Handle path-based terrain (trails, streams)
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
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(1,1)"
            />
            {/* Main path */}
            <path
              d={pathD}
              stroke={element.terrain?.color}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Path texture pattern */}
            <path
              d={pathD}
              stroke={element.terrain?.color + '60'}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2 3"
            />
          </svg>
          
          {/* Trail icon */}
          <div 
            className="absolute text-sm"
            style={{ 
              left: (maxX - minX) / 2,
              top: (maxY - minY) / 2,
              transform: 'translate(-50%, -50%)',
              color: element.terrain?.color,
              textShadow: '0 0 3px rgba(255,255,255,0.8)'
            }}
          >
            {element.terrain?.icon}
          </div>
          
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-card dark:bg-gray-700 text-foreground text-sm rounded shadow-lg border whitespace-nowrap z-20 min-w-max">
              <div className="font-medium">{element.terrain?.name}</div>
              <div className="text-muted-foreground text-xs">{element.terrain?.description}</div>
              <div className="text-muted-foreground text-xs">
                Comprimento: ~{Math.round(Math.sqrt(Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2)) / 10)}m
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Handle area-based terrain (rectangle/circle)
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
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-accent rounded-full"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-accent rounded-full"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-accent rounded-full"></div>
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
    return (
      <div
        className={cn(
          "absolute border-2 border-primary bg-primary/20 cursor-move transition-all rounded",
          selectionStyle
        )}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          transform: `rotate(${element.rotation || 0}deg)`,
          zIndex: isSelected ? 10 : 1
        }}
      >
        <div className="absolute top-1 left-1 text-xs bg-primary text-primary-foreground px-1 rounded">
          {Math.round((element.width || 0) / 10)}x{Math.round((element.height || 0) / 10)}m
        </div>
      </div>
    );
  }

  if (element.type === 'circle') {
    const diameter = element.radius ? element.radius * 2 : 0;
    return (
      <div
        className={cn(
          "absolute border-2 border-primary bg-primary/20 rounded-full cursor-move transition-all",
          selectionStyle
        )}
        style={{
          left: element.x,
          top: element.y,
          width: diameter,
          height: diameter,
          transform: `rotate(${element.rotation || 0}deg)`,
          zIndex: isSelected ? 10 : 1
        }}
      >
        <div className="absolute top-1 left-1 text-xs bg-primary text-primary-foreground px-1 rounded">
          ⌀{Math.round(diameter / 10)}m
        </div>
      </div>
    );
  }

  return null;
};