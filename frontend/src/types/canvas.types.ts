// Canvas Types and Interfaces for Type Safety

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Plant {
  id: string;
  name: string;
  category: string;
  icon: string;
  spacing: string;
  season: string;
  companion?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  waterNeeds: 'low' | 'medium' | 'high';
}

export interface Terrain {
  id: string;
  name: string;
  category: string;
  icon: string;
  size: string;
  description: string;
  color: string;
  texture: string;
  brushType: 'rectangle' | 'circle' | 'path';
  selectedBrushMode?: 'rectangle' | 'circle' | 'brush';
  brushThickness?: number;
}

export type ElementType = 'plant' | 'terrain' | 'rectangle' | 'circle';
export type BrushType = 'rectangle' | 'circle' | 'path';
export type BrushMode = 'rectangle' | 'circle' | 'brush';
export type ToolType = 'select' | 'delete' | 'plant' | 'terrain' | 'rectangle' | 'circle' | 'copy' | 'rotate' | 'pan' | 'navigate' | 'measure' | 'grid';

export interface DrawingElement {
  id: number;
  type: ElementType;
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
  brushType?: BrushType;
  texture?: string;
  // Path points for trail-like terrains
  pathPoints?: Position[];
  // Brush properties
  selectedBrushMode?: BrushMode;
  brushThickness?: number;
}

export interface CanvasProps {
  selectedTool: ToolType;
  selectedPlant: Plant | null;
  selectedTerrain: Terrain | null;
  onPlantUsed: () => void;
  onTerrainUsed: () => void;
  onToolChange: (tool: ToolType) => void;
  canvasSize?: Size;
  onCanvasSizeChange?: (size: Size) => void;
}

export interface CanvasState {
  elements: DrawingElement[];
  isDrawing: boolean;
  isDragging: boolean;
  isPanning: boolean;
  isSpacePressed: boolean;
  dragElement: DrawingElement | null;
  startPos: Position;
  dragOffset: Position;
  lastPanPoint: Position;
  currentShape: DrawingElement | null;
  showGrid: boolean;
  isDrawingTerrain: boolean;
  currentTerrainPath: Position[];
  isResizing: boolean;
  resizeHandle: string | null;
  resizeElement: DrawingElement | null;
  resizeStartPos: Position;
  originalElementBounds: { x: number; y: number; width: number; height: number };
}

export interface CanvasMetrics {
  pixelsPerMeter: number;
  gridSizeMeters: number;
  gridSizePixels: number;
  maxHorizontalGrids: number;
  maxVerticalGrids: number;
}

export interface ZoomState {
  zoom: number;
  panOffset: Position;
  minZoom: number;
  maxZoom: number;
  zoomStep: number;
}

export type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se';

export interface DragState {
  isDragging: boolean;
  dragElement: DrawingElement | null;
  dragOffset: Position;
}

export interface ResizeState {
  isResizing: boolean;
  resizeHandle: ResizeHandle | null;
  resizeElement: DrawingElement | null;
  resizeStartPos: Position;
  originalBounds: { x: number; y: number; width: number; height: number };
}
