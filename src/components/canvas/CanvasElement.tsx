
import { cn } from "@/lib/utils";

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
  const isSelected = element.selected;
  const selectionStyle = isSelected ? 'ring-2 ring-accent ring-offset-2 shadow-lg' : '';

  if (element.type === 'plant') {
    return (
      <div
        className={cn(
          "absolute plant-icon cursor-move transition-all",
          selectionStyle
        )}
        style={{
          left: element.x - 25,
          top: element.y - 25,
          transform: `rotate(${element.rotation || 0}deg)`,
          zIndex: isSelected ? 10 : 1
        }}
      >
        <div className="w-12 h-12 text-2xl flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-full border-2 border-green-300 dark:border-green-600 shadow-md hover:shadow-lg transition-all">
          {element.plant?.icon}
        </div>
      </div>
    );
  }

  if (element.type === 'terrain') {
    return (
      <div
        className={cn(
          "absolute terrain-element cursor-move transition-all",
          selectionStyle
        )}
        style={{
          left: element.x - 30,
          top: element.y - 30,
          transform: `rotate(${element.rotation || 0}deg)`,
          zIndex: isSelected ? 10 : 1
        }}
      >
        <div 
          className="w-16 h-16 text-2xl flex items-center justify-center rounded-lg border-2 shadow-md hover:shadow-lg transition-all"
          style={{ 
            backgroundColor: element.terrain?.color + '30',
            borderColor: element.terrain?.color,
            color: element.terrain?.color
          }}
        >
          {element.terrain?.icon}
        </div>
      </div>
    );
  }

  if (element.type === 'rectangle') {
    return (
      <div
        className={cn(
          "absolute border-2 border-primary bg-primary/20 dark:border-primary-dark dark:bg-primary-dark/20 cursor-move transition-all",
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
          "absolute border-2 border-primary bg-primary/20 dark:border-primary-dark dark:bg-primary-dark/20 rounded-full cursor-move transition-all",
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
</CanvasElement>

