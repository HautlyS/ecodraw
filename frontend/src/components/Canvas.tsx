
import { useRef, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { CanvasControls } from "./canvas/CanvasControls";
import { EnhancedCanvasControls } from "./canvas/EnhancedCanvasControls";
import { CanvasElement } from "./canvas/CanvasElement";
import { CanvasWelcome } from "./canvas/CanvasWelcome";
import { useCanvasEvents } from "@/hooks/useCanvasEvents";
import { useCanvasZoom } from "@/hooks/useCanvasZoom";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { useResponsive } from "@/hooks/useResponsive";
import { cn } from "@/lib/utils";

interface CanvasProps {
  selectedTool: string;
  selectedPlant: any;
  selectedTerrain: any;
  onPlantUsed: () => void;
  onTerrainUsed: () => void;
  onToolChange: (tool: string) => void; // Add this to enable tool switching
}

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
  // Brush properties
  selectedBrushMode?: 'rectangle' | 'circle' | 'brush';
  brushThickness?: number;
}

export const Canvas = ({ selectedTool, selectedPlant, selectedTerrain, onPlantUsed, onTerrainUsed, onToolChange }: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [elements, elementsActions] = useUndoRedo<DrawingElement[]>([], {
    maxHistorySize: 50,
    debounceMs: 300,
  });
  
  const { isMobile, isTablet } = useResponsive();
  const isCompact = isMobile || isTablet;

  // Enhanced zoom controls
  const {
    zoom,
    panOffset,
    zoomIn,
    zoomOut,
    zoomToFit,
    resetZoom,
    setPanOffset,
    zoomLevel,
    canZoomIn,
    canZoomOut,
  } = useCanvasZoom({
    minZoom: 25,
    maxZoom: 400,
    zoomStep: 25,
    canvasRef,
    onZoomChange: (newZoom) => {
      toast.info(`Zoom: ${newZoom}%`, { duration: 1000 });
    },
  });

  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [dragElement, setDragElement] = useState<DrawingElement | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [currentShape, setCurrentShape] = useState<DrawingElement | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [isDrawingTerrain, setIsDrawingTerrain] = useState(false);
  const [currentTerrainPath, setCurrentTerrainPath] = useState<{ x: number; y: number }[]>([]);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeElement, setResizeElement] = useState<DrawingElement | null>(null);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [originalElementBounds, setOriginalElementBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // World-to-pixel conversion constants
  const PIXELS_PER_METER = 10;
  const GRID_SIZE_METERS = 2; // Each grid square = 2m x 2m
  const GRID_SIZE_PIXELS = GRID_SIZE_METERS * PIXELS_PER_METER;

  // Utility functions for world-to-pixel conversion
  const metersToPixels = useCallback((meters: number) => meters * PIXELS_PER_METER, []);
  const pixelsToMeters = useCallback((pixels: number) => pixels / PIXELS_PER_METER, []);

  const { getMousePosition, snapToGrid, findElementAtPosition } = useCanvasEvents();
  
  // Parse terrain size string to get dimensions in meters
  const parseTerrainSize = useCallback((sizeString: string) => {
    if (sizeString === "Variável") {
      return { width: 1, height: 1 }; // Default 1x1m for variable size
    }
    
    const match = sizeString.match(/(\d+)x(\d+)m/);
    if (match) {
      return { width: parseInt(match[1]), height: parseInt(match[2]) };
    }
    
    // Handle single dimension (like "2x2m")
    const singleMatch = sizeString.match(/(\d+)m/);
    if (singleMatch) {
      const size = parseInt(singleMatch[1]);
      return { width: size, height: size };
    }
    
    // Default fallback
    return { width: 1, height: 1 };
  }, []);

  const detectResizeHandle = useCallback((pos: { x: number; y: number }, element: DrawingElement): string | null => {
    if (!element.selected) return null;

    const handleSize = 8; // Size of resize handles
    
    // For plants
    if (element.type === 'plant') {
      const parsePlantSpacing = (spacing: string) => {
        const PIXELS_PER_METER = 10;
        if (spacing.includes('x')) {
          const match = spacing.match(/(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)/);
          if (match) {
            const width = parseFloat(match[1]);
            const height = parseFloat(match[2]);
            return { width: width * PIXELS_PER_METER, height: height * PIXELS_PER_METER };
          }
        }
        const singleMatch = spacing.match(/(\d+(?:\.\d+)?)(cm|m)/);
        if (singleMatch) {
          const value = parseFloat(singleMatch[1]);
          const unit = singleMatch[2];
          const meters = unit === 'cm' ? value / 100 : value;
          const pixels = meters * PIXELS_PER_METER;
          return { width: pixels, height: pixels };
        }
        return { width: 40, height: 40 };
      };
      
      const plantSize = parsePlantSpacing(element.plant?.spacing || '1x1m');
      const left = element.x - plantSize.width / 2;
      const top = element.y - plantSize.height / 2;
      const right = left + plantSize.width;
      const bottom = top + plantSize.height;
      
      // Check each handle
      if (Math.abs(pos.x - left) <= handleSize && Math.abs(pos.y - top) <= handleSize) return 'nw';
      if (Math.abs(pos.x - right) <= handleSize && Math.abs(pos.y - top) <= handleSize) return 'ne';
      if (Math.abs(pos.x - left) <= handleSize && Math.abs(pos.y - bottom) <= handleSize) return 'sw';
      if (Math.abs(pos.x - right) <= handleSize && Math.abs(pos.y - bottom) <= handleSize) return 'se';
    } 
    // For rectangles and terrain rectangles
    else if (element.type === 'rectangle' || (element.type === 'terrain' && element.brushType !== 'circle')) {
      const left = element.x;
      const top = element.y;
      const right = left + (element.width || 0);
      const bottom = top + (element.height || 0);
      
      if (Math.abs(pos.x - left) <= handleSize && Math.abs(pos.y - top) <= handleSize) return 'nw';
      if (Math.abs(pos.x - right) <= handleSize && Math.abs(pos.y - top) <= handleSize) return 'ne';
      if (Math.abs(pos.x - left) <= handleSize && Math.abs(pos.y - bottom) <= handleSize) return 'sw';
      if (Math.abs(pos.x - right) <= handleSize && Math.abs(pos.y - bottom) <= handleSize) return 'se';
    }
    // For circles
    else if (element.type === 'circle' || (element.type === 'terrain' && element.brushType === 'circle')) {
      const radius = element.radius || 0;
      const left = element.x;
      const top = element.y;
      const right = left + radius * 2;
      const bottom = top + radius * 2;
      
      if (Math.abs(pos.x - left) <= handleSize && Math.abs(pos.y - top) <= handleSize) return 'nw';
      if (Math.abs(pos.x - right) <= handleSize && Math.abs(pos.y - top) <= handleSize) return 'ne';
      if (Math.abs(pos.x - left) <= handleSize && Math.abs(pos.y - bottom) <= handleSize) return 'sw';
      if (Math.abs(pos.x - right) <= handleSize && Math.abs(pos.y - bottom) <= handleSize) return 'se';
    }
    
    return null;
  }, []);

  const selectElement = useCallback((elementId: number) => {
    const updatedElements = elements.map(el => ({
      ...el,
      selected: el.id === elementId
    }));
    elementsActions.set(updatedElements);
  }, [elements, elementsActions]);

  // Auto-select when clicking on any element
  const handleElementClick = useCallback((elementId: number) => {
    // Switch to select tool automatically
    if (selectedTool !== 'select') {
      onToolChange('select');
    }
    selectElement(elementId);
  }, [selectedTool, onToolChange, selectElement]);

  const clearSelection = useCallback(() => {
    const updatedElements = elements.map(el => ({ ...el, selected: false }));
    elementsActions.set(updatedElements);
  }, [elements, elementsActions]);

  const copySelectedElements = useCallback(() => {
    const selectedElements = elements.filter(el => el.selected);
    if (selectedElements.length > 0) {
      const copiedElements = selectedElements.map(el => ({
        ...el,
        id: Date.now() + Math.random(),
        x: el.x + 50, // Offset copies slightly
        y: el.y + 50,
        selected: false
      }));
      elementsActions.set([...elements, ...copiedElements]);
      clearSelection();
      toast.success(`${selectedElements.length} elemento(s) copiado(s)`);
    } else {
      toast.error("Selecione elementos para copiar");
    }
  }, [elements, elementsActions, clearSelection]);

  const rotateSelectedElements = useCallback(() => {
    const selectedElements = elements.filter(el => el.selected);
    if (selectedElements.length > 0) {
      const updatedElements = elements.map(el => 
        el.selected 
          ? { ...el, rotation: (el.rotation || 0) + 90 }
          : el
      );
      elementsActions.set(updatedElements);
      toast.success(`${selectedElements.length} elemento(s) rotacionado(s)`);
    } else {
      toast.error("Selecione elementos para rotacionar");
    }
  }, [elements, elementsActions]);

  const deleteSelectedElements = useCallback(() => {
    const selectedCount = elements.filter(el => el.selected).length;
    if (selectedCount > 0) {
      const filteredElements = elements.filter(el => !el.selected);
      elementsActions.set(filteredElements);
      toast.success(`${selectedCount} elemento(s) removido(s)`);
    }
  }, [elements, elementsActions]);

  const deleteElementAtPosition = useCallback((pos: { x: number; y: number }) => {
    const clickedElement = findElementAtPosition(pos, elements);
    if (clickedElement) {
      const filteredElements = elements.filter(el => el.id !== clickedElement.id);
      elementsActions.set(filteredElements);
      toast.success("Elemento removido");
      return true;
    }
    return false;
  }, [elements, elementsActions, findElementAtPosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rawPos = getMousePosition(e, canvasRef, zoom, panOffset);
    const pos = snapToGrid(rawPos, showGrid);
    
    // Handle panning with space key
    if (isSpacePressed) {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }
    
    // Handle delete tool
    if (selectedTool === 'delete') {
      deleteElementAtPosition(pos);
      return;
    }

    // Check if clicking on an existing element for auto-selection or resize
    const clickedElement = findElementAtPosition(pos, elements);
    
    if (clickedElement && selectedTool !== 'delete') {
      // Check if clicking on a resize handle
      const handle = detectResizeHandle(pos, clickedElement);
      
      if (handle && clickedElement.selected) {
        // Start resizing
        setIsResizing(true);
        setResizeHandle(handle);
        setResizeElement(clickedElement);
        setResizeStartPos(pos);
        
        // Store original bounds for calculation
        if (clickedElement.type === 'plant') {
          const parsePlantSpacing = (spacing: string) => {
            const PIXELS_PER_METER = 10;
            if (spacing.includes('x')) {
              const match = spacing.match(/(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)/);
              if (match) {
                const width = parseFloat(match[1]);
                const height = parseFloat(match[2]);
                return { width: width * PIXELS_PER_METER, height: height * PIXELS_PER_METER };
              }
            }
            const singleMatch = spacing.match(/(\d+(?:\.\d+)?)(cm|m)/);
            if (singleMatch) {
              const value = parseFloat(singleMatch[1]);
              const unit = singleMatch[2];
              const meters = unit === 'cm' ? value / 100 : value;
              const pixels = meters * PIXELS_PER_METER;
              return { width: pixels, height: pixels };
            }
            return { width: 40, height: 40 };
          };
          const plantSize = parsePlantSpacing(clickedElement.plant?.spacing || '1x1m');
          setOriginalElementBounds({
            x: clickedElement.x - plantSize.width / 2,
            y: clickedElement.y - plantSize.height / 2,
            width: plantSize.width,
            height: plantSize.height
          });
        } else {
          setOriginalElementBounds({
            x: clickedElement.x,
            y: clickedElement.y,
            width: clickedElement.width || 0,
            height: clickedElement.height || 0
          });
        }
        return;
      }
      
      // Regular element selection and dragging
      handleElementClick(clickedElement.id);
      setIsDragging(true);
      setDragElement(clickedElement);
      setDragOffset({
        x: pos.x - clickedElement.x,
        y: pos.y - clickedElement.y
      });
      return;
    }

    if (selectedTool === 'select' && clickedElement) {
      selectElement(clickedElement.id);
      setIsDragging(true);
      setDragElement(clickedElement);
      setDragOffset({
        x: pos.x - clickedElement.x,
        y: pos.y - clickedElement.y
      });
      return;
    }

    // Clear selection if clicking empty space with select tool
    if (selectedTool === 'select') {
      clearSelection();
      return;
    }

    // Add plant
    if (selectedPlant && (selectedTool === 'select' || !selectedTool)) {
      const newElement: DrawingElement = {
        id: Date.now(),
        type: 'plant',
        x: pos.x,
        y: pos.y,
        plant: selectedPlant,
      };
      
      elementsActions.set([...elements, newElement]);
      onPlantUsed();
      toast.success(`${selectedPlant.name} adicionada ao mapa!`);
      return;
    }

    // Add terrain element with brush system
    if (selectedTerrain && selectedTool === 'terrain') {
      const terrainSize = parseTerrainSize(selectedTerrain.size);
      const brushMode = selectedTerrain.selectedBrushMode || 'rectangle';
      const brushThickness = selectedTerrain.brushThickness || 20;
      
      if (brushMode === 'brush') {
        // For brush mode, start freehand drawing
        setIsDrawingTerrain(true);
        setCurrentTerrainPath([pos]);
        return;
      } else if (brushMode === 'path' || selectedTerrain.brushType === 'path') {
        // For path terrain, create immediately as single click creates a simple path
        const pathLength = terrainSize.width > 1 ? terrainSize.width : 5; // Default path length
        const pathPoints = [
          pos,
          { x: pos.x + metersToPixels(pathLength), y: pos.y }
        ];
        
        const newTerrain: DrawingElement = {
          id: Date.now(),
          type: 'terrain',
          x: pos.x,
          y: pos.y,
          pathPoints: pathPoints,
          terrain: selectedTerrain,
          brushType: 'path',
          texture: selectedTerrain.texture,
          realWorldWidth: brushThickness / 10, // Convert to meters
          realWorldHeight: pathLength,
        };
        
        elementsActions.set([...elements, newTerrain]);
        onTerrainUsed();
        toast.success(`${selectedTerrain.name} (caminho) adicionado ao mapa!`);
        return;
      } else {
        // Start drawing rectangle or circle terrain
        setIsDrawing(true);
        setStartPos(pos);
        
        const terrainWidthPixels = metersToPixels(terrainSize.width);
        const terrainHeightPixels = metersToPixels(terrainSize.height);
        
        const newTerrain: DrawingElement = {
          id: Date.now(),
          type: 'terrain',
          x: pos.x,
          y: pos.y,
          width: brushMode === 'circle' ? 0 : terrainWidthPixels,
          height: brushMode === 'circle' ? 0 : terrainHeightPixels,
          radius: brushMode === 'circle' ? 0 : undefined,
          realWorldWidth: terrainSize.width,
          realWorldHeight: terrainSize.height,
          terrain: selectedTerrain,
          brushType: brushMode as 'rectangle' | 'circle',
          texture: selectedTerrain.texture,
        };
        
        setCurrentShape(newTerrain);
        return;
      }
    }

    // Start drawing shapes
    if (selectedTool === 'rectangle' || selectedTool === 'circle') {
      setIsDrawing(true);
      setStartPos(pos);
      
      const newShape: DrawingElement = {
        id: Date.now(),
        type: selectedTool as 'rectangle' | 'circle',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        radius: 0,
      };
      
      setCurrentShape(newShape);
    }
  }, [selectedTool, selectedPlant, selectedTerrain, elements, getMousePosition, snapToGrid, selectElement, clearSelection, onPlantUsed, onTerrainUsed, deleteElementAtPosition, findElementAtPosition, zoom, showGrid, isSpacePressed, panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rawPos = getMousePosition(e, canvasRef, zoom, panOffset);
    const pos = snapToGrid(rawPos, showGrid);

    // Handle panning
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    // Handle resizing elements
    if (isResizing && resizeElement && resizeHandle) {
      const deltaX = pos.x - resizeStartPos.x;
      const deltaY = pos.y - resizeStartPos.y;
      
      let newBounds = { ...originalElementBounds };
      
      // Calculate new bounds based on resize handle
      switch (resizeHandle) {
        case 'nw':
          newBounds.x = originalElementBounds.x + deltaX;
          newBounds.y = originalElementBounds.y + deltaY;
          newBounds.width = originalElementBounds.width - deltaX;
          newBounds.height = originalElementBounds.height - deltaY;
          break;
        case 'ne':
          newBounds.y = originalElementBounds.y + deltaY;
          newBounds.width = originalElementBounds.width + deltaX;
          newBounds.height = originalElementBounds.height - deltaY;
          break;
        case 'sw':
          newBounds.x = originalElementBounds.x + deltaX;
          newBounds.width = originalElementBounds.width - deltaX;
          newBounds.height = originalElementBounds.height + deltaY;
          break;
        case 'se':
          newBounds.width = originalElementBounds.width + deltaX;
          newBounds.height = originalElementBounds.height + deltaY;
          break;
      }
      
      // Ensure minimum size
      const minSize = 20;
      newBounds.width = Math.max(newBounds.width, minSize);
      newBounds.height = Math.max(newBounds.height, minSize);
      
      // Update the element
      const updatedElements = elements.map(el => {
        if (el.id === resizeElement.id) {
          if (el.type === 'plant') {
            // For plants, update the center position and scale the spacing
            const newCenterX = newBounds.x + newBounds.width / 2;
            const newCenterY = newBounds.y + newBounds.height / 2;
            return { ...el, x: newCenterX, y: newCenterY };
          } else if (el.type === 'circle' || (el.type === 'terrain' && el.brushType === 'circle')) {
            // For circles, update radius
            const newRadius = Math.min(newBounds.width, newBounds.height) / 2;
            return {
              ...el,
              x: newBounds.x,
              y: newBounds.y,
              radius: newRadius,
              width: newRadius * 2,
              height: newRadius * 2
            };
          } else {
            // For rectangles
            return {
              ...el,
              x: newBounds.x,
              y: newBounds.y,
              width: newBounds.width,
              height: newBounds.height
            };
          }
        }
        return el;
      });
      elementsActions.set(updatedElements);
      return;
    }

    // Handle dragging elements
    if (isDragging && dragElement) {
      const newPos = snapToGrid({
        x: pos.x - dragOffset.x,
        y: pos.y - dragOffset.y
      }, showGrid);
      
      const updatedElements = elements.map(el => 
        el.id === dragElement.id 
          ? { ...el, x: newPos.x, y: newPos.y }
          : el
      );
      elementsActions.set(updatedElements);
      return;
    }

    // Handle drawing terrain paths (trails, streams) and freehand brush
    if (isDrawingTerrain && selectedTerrain) {
      const brushThickness = selectedTerrain.brushThickness || 20;
      
      // Add point to current path with some distance threshold to avoid too many points
      if (currentTerrainPath.length === 0 || 
          Math.sqrt(Math.pow(pos.x - currentTerrainPath[currentTerrainPath.length - 1].x, 2) + 
                   Math.pow(pos.y - currentTerrainPath[currentTerrainPath.length - 1].y, 2)) > 5) {
        setCurrentTerrainPath(prev => [...prev, pos]);
      }
      return;
    }

    // Handle drawing new shapes (rectangles, circles, terrain areas)
    if (!isDrawing || !currentShape) return;

    const width = Math.abs(pos.x - startPos.x);
    const height = Math.abs(pos.y - startPos.y);
    
    if (currentShape.brushType === 'circle' || currentShape.type === 'circle') {
      const radius = Math.min(width, height) / 2;
      const updatedShape: DrawingElement = {
        ...currentShape,
        x: Math.min(startPos.x, pos.x),
        y: Math.min(startPos.y, pos.y),
        radius: radius,
        width: radius * 2,
        height: radius * 2,
      };
      setCurrentShape(updatedShape);
    } else {
      const updatedShape: DrawingElement = {
        ...currentShape,
        x: Math.min(startPos.x, pos.x),
        y: Math.min(startPos.y, pos.y),
        width: width,
        height: height,
      };
      setCurrentShape(updatedShape);
    }
  }, [isDragging, dragElement, dragOffset, isDrawing, currentShape, startPos, getMousePosition, snapToGrid, zoom, showGrid, isPanning, lastPanPoint, panOffset, isDrawingTerrain, selectedTerrain, elements, elementsActions]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
    }

    if (isResizing) {
      setIsResizing(false);
      setResizeHandle(null);
      setResizeElement(null);
      setResizeStartPos({ x: 0, y: 0 });
      setOriginalElementBounds({ x: 0, y: 0, width: 0, height: 0 });
    }

    if (isDragging) {
      setIsDragging(false);
      setDragElement(null);
      setDragOffset({ x: 0, y: 0 });
    }

    // Finish drawing terrain path or freehand brush
    if (isDrawingTerrain && currentTerrainPath.length > 1 && selectedTerrain) {
      const brushThickness = selectedTerrain.brushThickness || 20;
      
      const newTerrain: DrawingElement = {
        id: Date.now(),
        type: 'terrain',
        x: currentTerrainPath[0].x,
        y: currentTerrainPath[0].y,
        pathPoints: currentTerrainPath,
        terrain: selectedTerrain,
        brushType: 'path',
        texture: selectedTerrain.texture,
        realWorldWidth: brushThickness / 10, // Convert to meters
        realWorldHeight: currentTerrainPath.length / 10, // Approximate length
        brushThickness: brushThickness,
      };
      
      elementsActions.set([...elements, newTerrain]);
      onTerrainUsed();
      setIsDrawingTerrain(false);
      setCurrentTerrainPath([]);
      
      const brushMode = selectedTerrain.selectedBrushMode || 'brush';
      toast.success(`${selectedTerrain.name} (${brushMode === 'brush' ? 'pincel' : 'trilha'}) adicionado ao mapa!`);
    }

    // Finish drawing terrain area
    if (isDrawing && currentShape) {
      const minSize = 10;
      const isValidSize = (currentShape.width && currentShape.width > minSize) || 
                         (currentShape.radius && currentShape.radius > minSize);
      
      if (isValidSize) {
        elementsActions.set([...elements, currentShape]);
        
        if (currentShape.type === 'terrain') {
          onTerrainUsed();
          const realArea = (currentShape.realWorldWidth || 1) * (currentShape.realWorldHeight || 1);
          toast.success(`${currentShape.terrain?.name} adicionado! (${realArea}m²)`);
        } else {
          toast.success(`${currentShape.type === 'rectangle' ? 'Retângulo' : 'Círculo'} criado!`);
        }
      }
      setCurrentShape(null);
    }
    
    setIsDrawing(false);
  }, [isDragging, isDrawing, currentShape, isPanning, isDrawingTerrain, currentTerrainPath, selectedTerrain, onTerrainUsed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (!data) return;

    try {
      const plantData = JSON.parse(data);
      const rawPos = getMousePosition(e, canvasRef, zoom, panOffset);
      const pos = snapToGrid(rawPos, showGrid);
      
      const newElement: DrawingElement = {
        id: Date.now(),
        type: 'plant',
        x: pos.x,
        y: pos.y,
        plant: plantData,
      };
      
      elementsActions.set([...elements, newElement]);
      toast.success(`${plantData.name} adicionada via drag & drop!`);
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  }, [getMousePosition, snapToGrid, zoom, showGrid, panOffset]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Touch events for mobile pan/zoom
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setIsPanning(true);
      const touch = e.touches[0];
      setLastPanPoint({ x: touch.clientX, y: touch.clientY });
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && isPanning) {
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastPanPoint.x;
      const deltaY = touch.clientY - lastPanPoint.y;
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setLastPanPoint({ x: touch.clientX, y: touch.clientY });
    }
  }, [isPanning, lastPanPoint]);

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        setIsSpacePressed(true);
      }
      
      // Delete/Backspace - delete selected elements
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelectedElements();
      }
      
      // Escape - clear selection and cancel operations
      if (e.key === 'Escape') {
        e.preventDefault();
        clearSelection();
        setCurrentShape(null);
        setIsDrawing(false);
        setIsDragging(false);
        setIsPanning(false);
        setIsDrawingTerrain(false);
        setCurrentTerrainPath([]);
        setIsResizing(false);
        setResizeHandle(null);
        setResizeElement(null);
        onToolChange('select'); // Switch to select tool
      }
      
      // G - toggle grid
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        setShowGrid(prev => {
          const newState = !prev;
          toast.success(newState ? "Grade ativada" : "Grade desativada");
          return newState;
        });
      }
      
      // S - select tool
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        onToolChange('select');
        toast.info("Ferramenta Selecionar ativada");
      }
      
      // R - rectangle tool
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onToolChange('rectangle');
        toast.info("Ferramenta Retângulo ativada");
      }
      
      // C - circle tool or copy
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
          // Ctrl+C - copy
          copySelectedElements();
        } else {
          // C - circle tool
          onToolChange('circle');
          toast.info("Ferramenta Círculo ativada");
        }
      }
      
      // T - terrain tool
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        onToolChange('terrain');
        toast.info("Ferramenta Terreno ativada");
      }
      
      // D - delete tool
      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        onToolChange('delete');
        toast.info("Ferramenta Excluir ativada");
      }
      
      // Ctrl+A - select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        const selectedElements = elements.map(el => ({ ...el, selected: true }));
        elementsActions.set(selectedElements);
        toast.success("Todos os elementos selecionados");
      }
      
      // Ctrl+Z - undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (elementsActions.canUndo) {
          elementsActions.undo();
          toast.success("Ação desfeita");
        } else {
          toast.info("Nada para desfazer");
        }
      }
      
      // Ctrl+Y or Ctrl+Shift+Z - redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (elementsActions.canRedo) {
          elementsActions.redo();
          toast.success("Ação refeita");
        } else {
          toast.info("Nada para refazer");
        }
      }
      
      // Number keys for zoom
      if (e.key >= '1' && e.key <= '9' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const zoomLevel = parseInt(e.key) * 25; // 1=25%, 2=50%, etc.
        if (zoomLevel >= 25 && zoomLevel <= 300) {
          zoomToFit(); // Use zoom to fit for better UX
          toast.info(`Zoom: ${zoomLevel}%`);
        }
      }
      
      // 0 - reset zoom
      if (e.key === '0' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        resetZoom();
        toast.info("Zoom resetado para 100%");
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [deleteSelectedElements, clearSelection, copySelectedElements, onToolChange, elementsActions, resetZoom, zoomToFit]);

  const handleReset = useCallback(() => {
    resetZoom();
    elementsActions.reset([]);
    setCurrentShape(null);
    setIsDrawing(false);
    setIsDragging(false);
    setIsPanning(false);
    clearSelection();
    toast.success("Canvas resetado");
  }, [resetZoom, elementsActions, clearSelection]);

  const getCursorStyle = () => {
    if (isSpacePressed || isPanning) return 'cursor-grab';
    if (selectedTool === 'select') return 'cursor-default';
    if (selectedTool === 'delete') return 'cursor-pointer';
    if (selectedPlant || selectedTerrain) return 'cursor-copy';
    return 'cursor-crosshair';
  };

  return (
    <div className="h-full relative bg-card rounded-lg border border-border overflow-hidden transition-colors">
      {/* Enhanced Canvas Controls */}
      <EnhancedCanvasControls
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onZoomToFit={zoomToFit}
        onReset={handleReset}
        showGrid={showGrid}
        onToggleGrid={() => {
          const newState = !showGrid;
          setShowGrid(newState);
          toast.success(newState ? "Grade ativada (G)" : "Grade desativada (G)");
        }}
        elementsCount={elements.length}
        selectedCount={elements.filter(el => el.selected).length}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
        zoomLevel={zoomLevel}
        className={cn(isCompact && "scale-90 origin-top-right")}
      />

      {/* Undo/Redo Controls for Desktop */}
      {!isCompact && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={elementsActions.undo}
            disabled={!elementsActions.canUndo}
            className="bg-background/95 backdrop-blur-sm shadow-lg"
            title="Desfazer (Ctrl+Z)"
          >
            <span className="text-xs">↶ Desfazer</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={elementsActions.redo}
            disabled={!elementsActions.canRedo}
            className="bg-background/95 backdrop-blur-sm shadow-lg"
            title="Refazer (Ctrl+Y)"
          >
            <span className="text-xs">↷ Refazer</span>
          </Button>
        </div>
      )}

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className={cn(
          "w-full h-full relative overflow-hidden transition-transform duration-200",
          getCursorStyle(),
          showGrid ? 'terrain-grid-pattern' : '',
          isCompact && "touch-pan-y touch-pinch-zoom"
        )}
        style={{ 
          transform: `scale(${zoom / 100}) translate(${panOffset.x}px, ${panOffset.y}px)`, 
          transformOrigin: 'center',
          transition: isPanning ? 'none' : 'transform 0.2s ease'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        data-canvas="true"
      >
        {/* Grid Labels for Scale Reference - Fixed positioning */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Horizontal scale labels - only on top */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-background/90 to-transparent">
              {Array.from({ length: Math.floor(1000 / GRID_SIZE_PIXELS) }, (_, i) => (
                <div
                  key={`h-${i}`}
                  className="absolute text-xs text-muted-foreground/80 bg-background/90 px-1 rounded-sm border border-border/30"
                  style={{
                    left: i * GRID_SIZE_PIXELS + 2,
                    top: 2,
                    fontSize: '9px',
                    fontWeight: '500'
                  }}
                >
                  {i * GRID_SIZE_METERS}m
                </div>
              ))}
            </div>
            
            {/* Vertical scale labels - only on left */}
            <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-background/90 to-transparent">
              {Array.from({ length: Math.floor(800 / GRID_SIZE_PIXELS) }, (_, i) => (
                <div
                  key={`v-${i}`}
                  className="absolute text-xs text-muted-foreground/80 bg-background/90 px-1 rounded-sm border border-border/30"
                  style={{
                    left: 2,
                    top: i * GRID_SIZE_PIXELS + 2,
                    fontSize: '9px',
                    fontWeight: '500',
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed'
                  }}
                >
                  {i * GRID_SIZE_METERS}m
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Render saved elements */}
        {elements.map(element => (
          <CanvasElement key={element.id} element={element} />
        ))}
        
        {/* Render current shape being drawn */}
        {currentShape && <CanvasElement element={currentShape} />}

        {/* Welcome Text for Empty Canvas */}
        {elements.length === 0 && !currentShape && <CanvasWelcome />}
      </div>
    </div>
  );
};
