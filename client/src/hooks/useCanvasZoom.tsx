import { useState, useCallback, useRef, useEffect } from 'react';

interface ZoomState {
  zoom: number;
  panOffset: { x: number; y: number };
  isDragging: boolean;
  isPanning: boolean;
}

interface ZoomControls {
  zoom: number;
  panOffset: { x: number; y: number };
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  resetZoom: () => void;
  setZoom: (zoom: number) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  handleWheel: (e: WheelEvent) => void;
  handlePinch: (e: TouchEvent) => void;
  handleTouchStart: (e: TouchEvent) => void;
  handleTouchMove: (e: TouchEvent) => void;
  handleTouchEnd: (e: TouchEvent) => void;
  zoomLevel: string;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

interface UseCanvasZoomOptions {
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
  canvasRef?: React.RefObject<HTMLElement>;
  onZoomChange?: (zoom: number) => void;
}

export function useCanvasZoom({
  minZoom = 25,
  maxZoom = 400,
  zoomStep = 25,
  canvasRef,
  onZoomChange,
}: UseCanvasZoomOptions = {}): ZoomControls {
  const [state, setState] = useState<ZoomState>({
    zoom: 100,
    panOffset: { x: 0, y: 0 },
    isDragging: false,
    isPanning: false,
  });

  const lastTouchRef = useRef<{ distance: number; center: { x: number; y: number } } | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const zoomIn = useCallback(() => {
    setState(prev => {
      const newZoom = Math.min(prev.zoom + zoomStep, maxZoom);
      onZoomChange?.(newZoom);
      return { ...prev, zoom: newZoom };
    });
  }, [zoomStep, maxZoom, onZoomChange]);

  const zoomOut = useCallback(() => {
    setState(prev => {
      const newZoom = Math.max(prev.zoom - zoomStep, minZoom);
      onZoomChange?.(newZoom);
      return { ...prev, zoom: newZoom };
    });
  }, [zoomStep, minZoom, onZoomChange]);

  const setZoom = useCallback((zoom: number) => {
    const clampedZoom = Math.min(Math.max(zoom, minZoom), maxZoom);
    setState(prev => ({ ...prev, zoom: clampedZoom }));
    onZoomChange?.(clampedZoom);
  }, [minZoom, maxZoom, onZoomChange]);

  const setPanOffset = useCallback((offset: { x: number; y: number }) => {
    setState(prev => ({ ...prev, panOffset: offset }));
  }, []);

  const zoomToFit = useCallback(() => {
    if (!canvasRef?.current) {
      setZoom(100);
      setPanOffset({ x: 0, y: 0 });
      return;
    }

    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const canvasElements = canvas.querySelectorAll('[data-canvas-element="true"]');
    
    if (canvasElements.length === 0) {
      setZoom(100);
      setPanOffset({ x: 0, y: 0 });
      return;
    }

    // Calculate bounding box of all elements
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    canvasElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      const x = rect.left - canvasRect.left;
      const y = rect.top - canvasRect.top;
      
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + rect.width);
      maxY = Math.max(maxY, y + rect.height);
    });

    if (minX === Infinity) {
      setZoom(100);
      setPanOffset({ x: 0, y: 0 });
      return;
    }

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const contentCenterX = minX + contentWidth / 2;
    const contentCenterY = minY + contentHeight / 2;

    // Calculate zoom to fit with padding
    const padding = 50;
    const zoomX = (containerRect.width - padding * 2) / contentWidth * 100;
    const zoomY = (containerRect.height - padding * 2) / contentHeight * 100;
    const fitZoom = Math.min(zoomX, zoomY, maxZoom);

    // Calculate pan to center
    const containerCenterX = containerRect.width / 2;
    const containerCenterY = containerRect.height / 2;
    const offsetX = containerCenterX - contentCenterX;
    const offsetY = containerCenterY - contentCenterY;

    setZoom(fitZoom);
    setPanOffset({ x: offsetX, y: offsetY });
  }, [canvasRef, setZoom, setPanOffset, maxZoom]);

  const resetZoom = useCallback(() => {
    setZoom(100);
    setPanOffset({ x: 0, y: 0 });
  }, [setZoom, setPanOffset]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
      setState(prev => {
        const newZoom = Math.min(Math.max(prev.zoom + delta, minZoom), maxZoom);
        onZoomChange?.(newZoom);
        return { ...prev, zoom: newZoom };
      });
    } else {
      // Pan
      setState(prev => ({
        ...prev,
        panOffset: {
          x: prev.panOffset.x - e.deltaX,
          y: prev.panOffset.y - e.deltaY,
        },
      }));
    }
  }, [zoomStep, minZoom, maxZoom, onZoomChange]);

  const getTouchDistance = (touches: TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const getTouchCenter = (touches: TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      lastTouchRef.current = { distance, center };
      setState(prev => ({ ...prev, isPanning: true }));
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && lastTouchRef.current) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      
      // Zoom based on distance change
      const scale = distance / lastTouchRef.current.distance;
      const deltaZoom = (scale - 1) * 50; // Sensitivity adjustment
      
      setState(prev => {
        const newZoom = Math.min(Math.max(prev.zoom + deltaZoom, minZoom), maxZoom);
        onZoomChange?.(newZoom);
        
        // Pan based on center movement
        const panDeltaX = center.x - lastTouchRef.current!.center.x;
        const panDeltaY = center.y - lastTouchRef.current!.center.y;
        
        return {
          ...prev,
          zoom: newZoom,
          panOffset: {
            x: prev.panOffset.x + panDeltaX,
            y: prev.panOffset.y + panDeltaY,
          },
        };
      });
      
      lastTouchRef.current = { distance, center };
    } else if (e.touches.length === 1 && touchStartRef.current && state.isPanning) {
      // Single finger pan
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      
      setState(prev => ({
        ...prev,
        panOffset: {
          x: prev.panOffset.x + deltaX,
          y: prev.panOffset.y + deltaY,
        },
      }));
      
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }
  }, [state.isPanning, minZoom, maxZoom, onZoomChange]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.touches.length < 2) {
      lastTouchRef.current = null;
      setState(prev => ({ ...prev, isPanning: false }));
    }
    if (e.touches.length === 0) {
      touchStartRef.current = null;
    }
  }, []);

  const handlePinch = useCallback((e: TouchEvent) => {
    // This is handled in handleTouchMove for better integration
    e.preventDefault();
  }, []);

  // Add wheel event listener to canvas
  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canvasRef, handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  const zoomLevel = `${Math.round(state.zoom)}%`;
  const canZoomIn = state.zoom < maxZoom;
  const canZoomOut = state.zoom > minZoom;

  return {
    zoom: state.zoom,
    panOffset: state.panOffset,
    zoomIn,
    zoomOut,
    zoomToFit,
    resetZoom,
    setZoom,
    setPanOffset,
    handleWheel,
    handlePinch,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    zoomLevel,
    canZoomIn,
    canZoomOut,
  };
}