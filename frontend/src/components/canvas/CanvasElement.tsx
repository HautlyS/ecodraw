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

  if (element.type === 'terrain') {
    return (
      <div
        className={cn(
          "absolute terrain-element cursor-move transition-all group",
          selectionStyle
        )}
        style={{
          left: element.x - 30,
          top: element.y - 30,
          transform: `rotate(${element.rotation || 0}deg)`,
          zIndex: isSelected ? 10 : 1
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div 
          className="w-16 h-16 text-3xl flex items-center justify-center rounded-lg shadow-lg hover:shadow-xl transition-all relative border-2"
          style={{ 
            backgroundColor: element.terrain?.color + '20', 
            borderColor: element.terrain?.color,
            backdropFilter: 'blur(4px)'
          }}
        >
          <span className="filter drop-shadow-sm">{element.terrain?.icon}</span>
        </div>
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-card dark:bg-gray-700 text-foreground text-sm rounded shadow-lg border whitespace-nowrap z-20 min-w-max">
            <div className="font-medium">{element.terrain?.name}</div>
            <div className="text-muted-foreground text-xs">{element.terrain?.description}</div>
            <div className="text-muted-foreground text-xs">Tamanho: {element.terrain?.size}</div>
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