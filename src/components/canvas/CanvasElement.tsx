
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
        <div className="w-10 h-10 text-2xl flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-all relative">
          {element.plant?.icon}
        </div>
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-card dark:bg-gray-700 text-foreground text-xs rounded shadow-lg border whitespace-nowrap z-20">
            {element.plant?.name}
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
          left: element.x - 25,
          top: element.y - 25,
          transform: `rotate(${element.rotation || 0}deg)`,
          zIndex: isSelected ? 10 : 1
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="w-12 h-12 text-2xl flex items-center justify-center rounded-lg shadow-md hover:shadow-lg transition-all relative">
          {element.terrain?.icon}
        </div>
        {showTooltip && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-card dark:bg-gray-700 text-foreground text-xs rounded shadow-lg border whitespace-nowrap z-20">
            {element.terrain?.name}
          </div>
        )}
      </div>
    );
  }

  if (element.type === 'rectangle') {
    return (
      <div
        className={cn(
          "absolute border-2 border-primary bg-primary/20 cursor-move transition-all",
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
      />
    );
  }

  if (element.type === 'circle') {
    return (
      <div
        className={cn(
          "absolute border-2 border-primary bg-primary/20 rounded-full cursor-move transition-all",
          selectionStyle
        )}
        style={{
          left: element.x,
          top: element.y,
          width: element.radius ? element.radius * 2 : 0,
          height: element.radius ? element.radius * 2 : 0,
          transform: `rotate(${element.rotation || 0}deg)`,
          zIndex: isSelected ? 10 : 1
        }}
      />
    );
  }

  return null;
};
