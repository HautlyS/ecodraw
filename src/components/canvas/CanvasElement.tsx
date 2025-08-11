import React, { useState, memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Plant, Terrain } from '../../types/canvasTypes';
import { parseSpacingToMeters, realWorldSizeToPixels, calculateIconSize, formatRealWorldSize } from "@/utils/plantSizes";
import { getPlantBorderColor, getShapeColor, hexToRgba, lightenColor, darkenColor } from "@/utils/colorUtils";
import { motion } from 'framer-motion';

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
  realWorldWidth?: number;
  realWorldHeight?: number;
  brushType?: 'rectangle' | 'circle' | 'path' | 'brush';
  texture?: string;
  pathPoints?: { x: number; y: number }[];
  selectedBrushMode?: 'rectangle' | 'circle' | 'brush';
  brushThickness?: number;
}

interface CanvasElementProps {
  element: DrawingElement;
  pixelsPerMeter?: number;
  onResizeStart?: (elementId: number, handle: string, event: React.MouseEvent) => void;
  onElementClick?: (elementId: number, event: React.MouseEvent) => void;
}

const CanvasElementComponent = ({ element, pixelsPerMeter = 10, onResizeStart, onElementClick }: CanvasElementProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const isSelected = element.selected;
  const selectionStyle = isSelected ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg' : '';

  const handleMouseEnter = useCallback(() => setShowTooltip(true), []);
  const handleMouseLeave = useCallback(() => setShowTooltip(false), []);
  
  const handleResizeStart = useCallback((handle: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onResizeStart) {
      onResizeStart(element.id, handle, e);
    }
  }, [element.id, onResizeStart]);
  
  const handleElementClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onElementClick) {
      onElementClick(element.id, e);
    }
  }, [element.id, onElementClick]);

  // Improved plant rendering with better selection area
  if (element.type === 'plant') {
    const realWorldSize = parseSpacingToMeters(element.plant?.spacing || '1x1m');
    const pixelSize = realWorldSizeToPixels(realWorldSize, pixelsPerMeter);
    const iconSize = calculateIconSize(pixelSize);
    
    // Proportional clickable area - smaller minimum size for better proportionality
    const minClickableSize = 24; // Reduced from 32 to 24
    const maxClickableSize = 120; // Add maximum to prevent huge selection areas
    
    // Scale factor for clickable area relative to actual size
    const scaleFactor = 1.2; // 20% larger than actual size for easier selection
    
    const clickableSize = {
      width: Math.max(minClickableSize, Math.min(maxClickableSize, pixelSize.width * scaleFactor)),
      height: Math.max(minClickableSize, Math.min(maxClickableSize, pixelSize.height * scaleFactor))
    };
    
    const borderColor = getPlantBorderColor(element.plant?.id || String(element.id));
    const backgroundColorLight = hexToRgba(borderColor, 0.1);
    const borderColorAlpha = hexToRgba(borderColor, 0.6);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "absolute plant-area cursor-move transition-all group border-2 border-dashed rounded-lg",
          "hover:border-solid hover:shadow-md",
          selectionStyle,
          isSelected && "border-solid border-blue-500 bg-blue-50 dark:bg-blue-950"
        )}
        style={{
          left: element.x - clickableSize.width / 2,
          top: element.y - clickableSize.height / 2,
          width: clickableSize.width,
          height: clickableSize.height,
          transform: `rotate(${element.rotation || 0}deg)`,
          zIndex: isSelected ? 10 : 1,
          borderColor: isSelected ? undefined : borderColorAlpha,
          backgroundColor: isSelected ? undefined : backgroundColorLight,
          boxShadow: isSelected ? undefined : `0 0 8px ${hexToRgba(borderColor, 0.3)}`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Plant visual area (actual size) */}
        <div 
          className="absolute border border-dashed opacity-60"
          style={{
            left: (clickableSize.width - pixelSize.width) / 2,
            top: (clickableSize.height - pixelSize.height) / 2,
            width: pixelSize.width,
            height: pixelSize.height,
            borderColor: borderColor,
            backgroundColor: 'transparent',
          }}
        />
        
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
        
        {/* Plant name label - Always visible */}
        <div 
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded font-medium shadow-sm text-white whitespace-nowrap"
          style={{
            backgroundColor: borderColor,
          }}
        >
          {element.plant?.name}
        </div>
        
        {/* Selection handles */}
        {isSelected && (
          <>
            <div 
              className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-nw-resize hover:bg-blue-600 transition-colors z-20"
              onMouseDown={handleResizeStart('nw')}
            ></div>
            <div 
              className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-ne-resize hover:bg-blue-600 transition-colors z-20"
              onMouseDown={handleResizeStart('ne')}
            ></div>
            <div 
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-sw-resize hover:bg-blue-600 transition-colors z-20"
              onMouseDown={handleResizeStart('sw')}
            ></div>
            <div 
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-se-resize hover:bg-blue-600 transition-colors z-20"
              onMouseDown={handleResizeStart('se')}
            ></div>
          </>
        )}
        
        {/* Hover tooltip with detailed info */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm rounded-lg shadow-lg border whitespace-nowrap z-20 min-w-max">
            <div className="font-semibold" style={{ color: borderColor }}>{element.plant?.name}</div>
            <div className="text-gray-600 dark:text-gray-400 text-xs">Espaçamento: {element.plant?.spacing}</div>
            <div className="text-gray-600 dark:text-gray-400 text-xs">Área: {formatRealWorldSize(realWorldSize)}</div>
            {element.plant?.description && (
              <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">{element.plant.description}</div>
            )}
          </div>
        )}
      </motion.div>
    );
  }

  // Terrain texture patterns - Enhanced
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
      case 'path':
        return `repeating-linear-gradient(
                  45deg, ${color}40, ${color}40 3px, transparent 3px, transparent 6px)`;
      case 'building':
      case 'structure':
        return `repeating-linear-gradient(
                  0deg, ${color}50, ${color}50 5px, transparent 5px, transparent 10px),
                repeating-linear-gradient(
                  90deg, ${color}40, ${color}40 5px, transparent 5px, transparent 10px)`;
      case 'fence':
        return `repeating-linear-gradient(
                  90deg, ${color}60, ${color}60 2px, transparent 2px, transparent 8px)`;
      case 'solar':
        return `repeating-linear-gradient(
                  0deg, ${color}70, ${color}70 1px, transparent 1px, transparent 3px),
                repeating-linear-gradient(
                  90deg, ${color}50, ${color}50 1px, transparent 1px, transparent 6px)`;
      case 'compost':
        return `radial-gradient(circle at 30% 30%, ${color}50 2px, transparent 2px),
                radial-gradient(circle at 70% 70%, ${color}60 1px, transparent 1px),
                repeating-linear-gradient(30deg, ${color}20, ${color}20 1px, transparent 1px, transparent 4px)`;
      case 'well':
        return `radial-gradient(circle at 50% 50%, ${color}80 10px, ${color}40 10px, ${color}40 15px, transparent 15px)`;
      default:
        return `repeating-linear-gradient(
                  45deg, ${color}30, ${color}30 2px, transparent 2px, transparent 8px)`;
    }
  };

  // Enhanced terrain rendering
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
        <motion.div
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "absolute terrain-path cursor-move transition-all hover:opacity-90",
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
            {/* Path texture pattern */}
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
          
          {/* Trail name label */}
          <div 
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded font-medium shadow-sm text-white whitespace-nowrap"
            style={{ backgroundColor: element.terrain?.color }}
          >
            {element.terrain?.name}
          </div>
          
          {/* Selection handles for paths */}
          {isSelected && (
            <>
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-move"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-move"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-move"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-move"></div>
            </>
          )}
          
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm rounded-lg shadow-lg border whitespace-nowrap z-20 min-w-max">
              <div className="font-semibold">{element.terrain?.name}</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs">{element.terrain?.description}</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs">
                Espessura: {strokeWidth}px ({(strokeWidth / 10).toFixed(1)}m)
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-xs">
                Comprimento: ~{Math.round(Math.sqrt(Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2)) / 10)}m
              </div>
            </div>
          )}
        </motion.div>
      );
    }
    
    // Handle area-based terrain (rectangle, circle, brush)
    const isCircle = brushType === 'circle';
    const borderRadius = isCircle ? '50%' : '8px';
    
    // Proportional clickable size for small terrain elements
    const minClickableSize = 24;
    const maxClickableSize = 120;
    const scaleFactor = 1.2;
    const clickableWidth = Math.max(minClickableSize, Math.min(maxClickableSize, terrainWidth * scaleFactor));
    const clickableHeight = Math.max(minClickableSize, Math.min(maxClickableSize, terrainHeight * scaleFactor));
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "absolute terrain-area cursor-move transition-all group border-2 hover:shadow-md",
          selectionStyle,
          isSelected && "border-orange-500 bg-orange-50 dark:bg-orange-950"
        )}
        style={{
          left: element.x - (clickableWidth - terrainWidth) / 2,
          top: element.y - (clickableHeight - terrainHeight) / 2,
          width: clickableWidth,
          height: clickableHeight,
          borderRadius: isCircle ? '50%' : '8px',
          transform: `rotate(${element.rotation || 0}deg)`,
          backgroundColor: element.terrain?.color + '40',
          borderColor: isSelected ? undefined : element.terrain?.color,
          backgroundImage: getTerrainPattern(element.texture || 'default', element.terrain?.color || '#666'),
          backgroundSize: '8px 8px',
          zIndex: isSelected ? 10 : 1,
          boxShadow: `inset 0 0 0 1px ${element.terrain?.color}60`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Actual terrain area indicator */}
        <div 
          className="absolute border border-dashed opacity-60"
          style={{
            left: (clickableWidth - terrainWidth) / 2,
            top: (clickableHeight - terrainHeight) / 2,
            width: terrainWidth,
            height: terrainHeight,
            borderRadius: isCircle ? '50%' : '4px',
            borderColor: element.terrain?.color,
            backgroundColor: 'transparent',
          }}
        />
        
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
        
        {/* Terrain name label - Always visible */}
        <div 
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded font-medium shadow-sm text-white whitespace-nowrap"
          style={{ backgroundColor: element.terrain?.color }}
        >
          {element.terrain?.name}
        </div>
        
        {/* Selection handles */}
        {isSelected && (
          <>
            <div 
              className="absolute -top-2 -left-2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-md cursor-nw-resize hover:bg-orange-600 transition-colors z-20"
              onMouseDown={handleResizeStart('nw')}
            ></div>
            <div 
              className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-md cursor-ne-resize hover:bg-orange-600 transition-colors z-20"
              onMouseDown={handleResizeStart('ne')}
            ></div>
            <div 
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-md cursor-sw-resize hover:bg-orange-600 transition-colors z-20"
              onMouseDown={handleResizeStart('sw')}
            ></div>
            <div 
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-orange-500 rounded-full border-2 border-white shadow-md cursor-se-resize hover:bg-orange-600 transition-colors z-20"
              onMouseDown={handleResizeStart('se')}
            ></div>
          </>
        )}
        
        {/* Hover tooltip with detailed info */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm rounded-lg shadow-lg border whitespace-nowrap z-20 min-w-max">
            <div className="font-semibold">{element.terrain?.name}</div>
            <div className="text-gray-600 dark:text-gray-400 text-xs">{element.terrain?.description}</div>
            <div className="text-gray-600 dark:text-gray-400 text-xs">
              Área: {realWidth}×{realHeight}m ({realWidth * realHeight}m²)
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-xs">
              Modo: {brushType} • Textura: {element.texture}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // Enhanced rectangle rendering
  if (element.type === 'rectangle') {
    const shapeColor = getShapeColor(element.id);
    const lightColor = hexToRgba(shapeColor, 0.2);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "absolute border-2 cursor-move transition-all rounded-lg hover:shadow-md",
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Shape name label */}
        <div 
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded font-medium shadow-sm text-white whitespace-nowrap"
          style={{ backgroundColor: shapeColor }}
        >
          Retângulo
        </div>
        
        {/* Selection handles */}
        {isSelected && (
          <>
            <div 
              className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-nw-resize hover:bg-blue-600 transition-colors z-20"
              onMouseDown={handleResizeStart('nw')}
            ></div>
            <div 
              className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-ne-resize hover:bg-blue-600 transition-colors z-20"
              onMouseDown={handleResizeStart('ne')}
            ></div>
            <div 
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-sw-resize hover:bg-blue-600 transition-colors z-20"
              onMouseDown={handleResizeStart('sw')}
            ></div>
            <div 
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-se-resize hover:bg-blue-600 transition-colors z-20"
              onMouseDown={handleResizeStart('se')}
            ></div>
          </>
        )}
        
        {/* Hover tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm rounded-lg shadow-lg border whitespace-nowrap z-20">
            <div className="font-semibold">Retângulo</div>
            <div className="text-gray-600 dark:text-gray-400 text-xs">
              Tamanho: {Math.round((element.width || 0) / 10)}×{Math.round((element.height || 0) / 10)}m
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-xs">
              Área: {Math.round(((element.width || 0) * (element.height || 0)) / 100)}m²
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // Enhanced circle rendering
  if (element.type === 'circle') {
    const diameter = element.radius ? element.radius * 2 : 0;
    const shapeColor = getShapeColor(element.id);
    const lightColor = hexToRgba(shapeColor, 0.2);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "absolute border-2 rounded-full cursor-move transition-all hover:shadow-md",
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Shape name label */}
        <div 
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded font-medium shadow-sm text-white whitespace-nowrap"
          style={{ backgroundColor: shapeColor }}
        >
          Círculo
        </div>
        
        {/* Selection handles */}
        {isSelected && (
          <>
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-nw-resize"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-ne-resize"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-sw-resize"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md cursor-se-resize"></div>
          </>
        )}
        
        {/* Hover tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm rounded-lg shadow-lg border whitespace-nowrap z-20">
            <div className="font-semibold">Círculo</div>
            <div className="text-gray-600 dark:text-gray-400 text-xs">
              Diâmetro: {Math.round(diameter / 10)}m
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-xs">
              Área: {Math.round((Math.PI * Math.pow(diameter / 2, 2)) / 100)}m²
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return null;
};

export const CanvasElement = memo(CanvasElementComponent);
CanvasElement.displayName = "CanvasElement";