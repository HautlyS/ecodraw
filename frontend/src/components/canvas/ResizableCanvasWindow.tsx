import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';

interface ResizableCanvasWindowProps {
  children: React.ReactNode;
  zoom: number;
  onResize?: (width: number, height: number) => void;
  className?: string;
}

export const ResizableCanvasWindow: React.FC<ResizableCanvasWindowProps> = ({
  children,
  zoom,
  onResize,
  className
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const { isCompact, isWideScreen } = useResponsive();

  const handleMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeHandle(handle);
    
    const rect = windowRef.current?.getBoundingClientRect();
    if (rect) {
      setWindowSize({ width: rect.width, height: rect.height });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeHandle || !windowRef.current) return;

    const rect = windowRef.current.getBoundingClientRect();
    const containerRect = windowRef.current.parentElement?.getBoundingClientRect();
    
    if (!containerRect) return;

    let newWidth = windowSize.width;
    let newHeight = windowSize.height;

    switch (resizeHandle) {
      case 'se':
        newWidth = Math.min(
          Math.max(400, e.clientX - rect.left),
          containerRect.width - 32
        );
        newHeight = Math.min(
          Math.max(300, e.clientY - rect.top),
          containerRect.height - 32
        );
        break;
      case 'sw':
        newWidth = Math.min(
          Math.max(400, rect.right - e.clientX),
          containerRect.width - 32
        );
        newHeight = Math.min(
          Math.max(300, e.clientY - rect.top),
          containerRect.height - 32
        );
        break;
      case 'ne':
        newWidth = Math.min(
          Math.max(400, e.clientX - rect.left),
          containerRect.width - 32
        );
        newHeight = Math.min(
          Math.max(300, rect.bottom - e.clientY),
          containerRect.height - 32
        );
        break;
      case 'nw':
        newWidth = Math.min(
          Math.max(400, rect.right - e.clientX),
          containerRect.width - 32
        );
        newHeight = Math.min(
          Math.max(300, rect.bottom - e.clientY),
          containerRect.height - 32
        );
        break;
    }

    if (windowRef.current) {
      windowRef.current.style.width = `${newWidth}px`;
      windowRef.current.style.height = `${newHeight}px`;
    }

    onResize?.(newWidth, newHeight);
  }, [isResizing, resizeHandle, windowSize, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = `${resizeHandle}-resize`;
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isResizing, handleMouseMove, handleMouseUp, resizeHandle]);

  return (
    <div className="flex-1 relative overflow-hidden bg-muted/10">
      <div
        ref={windowRef}
        className={cn(
          "absolute bg-card rounded-lg border-2 border-border shadow-xl overflow-hidden",
          "transition-all duration-200 canvas-window",
          isWideScreen ? "inset-6" : "inset-4",
          className
        )}
        style={{
          minWidth: '400px',
          minHeight: '300px',
          resize: isCompact ? 'none' : 'both',
        }}
      >
        {/* Window Header */}
        <div className="h-10 window-header border-b border-border flex items-center justify-between px-4 select-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors cursor-pointer"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors cursor-pointer"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/70 hover:bg-green-500 transition-colors cursor-pointer"></div>
            </div>
            <div className="text-sm font-medium text-foreground">
              Agroecologia Canvas
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="bg-background/80 px-2 py-1 rounded border">
              {Math.round(zoom)}%
            </span>
          </div>
        </div>

        {/* Canvas Content */}
        <div className="relative w-full h-full overflow-hidden" style={{ height: 'calc(100% - 2.5rem)' }}>
          {children}
        </div>

        {/* Resize Handles */}
        {!isCompact && (
          <>
            {/* Corner handles */}
            <div
              className="resize-handle bottom-0 right-0 w-4 h-4 cursor-se-resize"
              onMouseDown={(e) => handleMouseDown(e, 'se')}
            />
            <div
              className="resize-handle bottom-0 left-0 w-4 h-4 cursor-sw-resize"
              onMouseDown={(e) => handleMouseDown(e, 'sw')}
            />
            <div
              className="resize-handle top-10 right-0 w-4 h-4 cursor-ne-resize"
              onMouseDown={(e) => handleMouseDown(e, 'ne')}
            />
            <div
              className="resize-handle top-10 left-0 w-4 h-4 cursor-nw-resize"
              onMouseDown={(e) => handleMouseDown(e, 'nw')}
            />
          </>
        )}
      </div>
    </div>
  );
};
