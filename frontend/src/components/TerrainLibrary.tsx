import React, { useState, useMemo, memo, useCallback } from "react";
import { Search, Mountain, Droplets, Home, Shield, Zap, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useEnhancedSearch } from "@/hooks/useEnhancedSearch";
import { Terrain } from "@/types/canvasTypes";

const TERRAIN_CATEGORIES = [
  { id: "all", name: "Todos", icon: Mountain },
  { id: "favorites", name: "Favoritos", icon: Sparkles },
  { id: "soil", name: "Solos", icon: Mountain },
  { id: "water", name: "Água", icon: Droplets },
  { id: "structures", name: "Estruturas", icon: Home },
  { id: "fences", name: "Cercas", icon: Shield },
  { id: "energy", name: "Energia", icon: Zap },
  { id: "paths", name: "Caminhos", icon: Mountain },
] as const;

const SAMPLE_TERRAINS: Terrain[] = [
  {
    id: "1",
    name: "Terra Fértil",
    category: "soil",
    size: "variável",
    color: "#8b5a2b",
    texture: "grass",
    icon: "🟫",
    description: "Solo rico em nutrientes para cultivo"
  },
  {
    id: "2",
    name: "Lago",
    category: "water",
    size: "variável",
    color: "#3b82f6",
    texture: "water",
    icon: "🌊",
    description: "Corpo d'água natural para irrigação"
  },
  {
    id: "3",
    name: "Casa Principal",
    category: "structures",
    size: "10x8m",
    color: "#ef4444",
    texture: "building",
    icon: "🏠",
    description: "Residência principal da propriedade"
  },
  {
    id: "4",
    name: "Cerca de Madeira",
    category: "fences",
    size: "variável",
    color: "#92400e",
    texture: "fence",
    icon: "🪵",
    description: "Delimitação e proteção da propriedade"
  },
  {
    id: "5",
    name: "Painel Solar",
    category: "energy",
    size: "4x2m",
    color: "#1f2937",
    texture: "solar",
    icon: "☀️",
    description: "Geração de energia renovável"
  },
  {
    id: "6",
    name: "Trilha Principal",
    category: "paths",
    size: "2m largura",
    color: "#a3a3a3",
    texture: "path",
    icon: "🛤️",
    description: "Caminho principal para circulação"
  },
  {
    id: "7",
    name: "Composteira",
    category: "structures",
    size: "2x2m",
    color: "#059669",
    texture: "compost",
    icon: "♻️",
    description: "Área para compostagem orgânica"
  },
  {
    id: "8",
    name: "Poço Artesiano",
    category: "water",
    size: "1x1m",
    color: "#1e40af",
    texture: "well",
    icon: "🕳️",
    description: "Fonte de água subterrânea"
  },
  {
    id: "9",
    name: "Horta Elevada",
    category: "structures",
    size: "3x1.5m",
    color: "#16a34a",
    texture: "structure",
    icon: "📦",
    description: "Canteiro elevado para hortaliças"
  },
  {
    id: "10",
    name: "Reservatório",
    category: "water",
    size: "variável",
    color: "#0ea5e9",
    texture: "water",
    icon: "🛁",
    description: "Reserva de água para irrigação"
  },
  {
    id: "11",
    name: "Barracão",
    category: "structures",
    size: "6x4m",
    color: "#78716c",
    texture: "building",
    icon: "🏭",
    description: "Armazenamento de ferramentas e equipamentos"
  },
  {
    id: "12",
    name: "Cerca Elétrica",
    category: "fences",
    size: "variável",
    color: "#fbbf24",
    texture: "fence",
    icon: "⚡",
    description: "Cerca eletrificada para proteção"
  },
  {
    id: "13",
    name: "Estrada de Terra",
    category: "paths",
    size: "3m largura",
    color: "#d97706",
    texture: "dirt_road",
    icon: "🛣️",
    description: "Estrada principal de acesso"
  },
  {
    id: "14",
    name: "Área Sombreada",
    category: "soil",
    size: "variável",
    color: "#065f46",
    texture: "grass",
    icon: "🌳",
    description: "Área coberta por árvores"
  },
  {
    id: "15",
    name: "Pedreira",
    category: "soil",
    size: "variável",
    color: "#6b7280",
    texture: "rock",
    icon: "🪨",
    description: "Área rochosa natural"
  }
];

const BRUSH_MODES = [
  { id: "rectangle", name: "Retângulo", icon: "⬜", description: "Forma retangular" },
  { id: "circle", name: "Círculo", icon: "⭕", description: "Forma circular" },
  { id: "brush", name: "Pincel", icon: "🖌️", description: "Desenho livre" },
] as const;

interface TerrainLibraryProps {
  selectedTerrain: Terrain | null;
  onTerrainSelect: (terrain: Terrain | null) => void;
}

const TerrainCard = memo(({ terrain, isSelected, onSelect }: {
  terrain: Terrain;
  isSelected: boolean;
  onSelect: (terrain: Terrain) => void;
}) => {
  const handleClick = useCallback(() => {
    onSelect(terrain);
  }, [terrain, onSelect]);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(terrain));
    e.dataTransfer.effectAllowed = 'copy';
  }, [terrain]);

  return (
    <div
      className={cn(
        "group relative p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-200 cursor-pointer",
        "hover:shadow-lg hover:scale-[1.02] hover:border-orange-300 dark:hover:border-orange-700",
        isSelected && "bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950 ring-2 ring-orange-400 dark:ring-orange-600 shadow-lg scale-[1.02]"
      )}
      onClick={handleClick}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex items-center gap-3">
        <div 
          className="flex items-center justify-center w-12 h-12 rounded-xl text-lg shadow-md transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${terrain.color}20`, boxShadow: `0 4px 12px ${terrain.color}30` }}
        >
          {terrain.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
              {terrain.name}
            </h3>
            <Badge variant="outline" className="text-xs px-2 py-0.5 h-auto bg-orange-100 dark:bg-orange-900/50 border-orange-300 dark:border-orange-700">
              {terrain.size}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">
            {terrain.description}
          </p>
        </div>
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/10 rounded-xl pointer-events-none" />
      )}
    </div>
  );
});

TerrainCard.displayName = "TerrainCard";

const CategoryButton = memo(({ category, isSelected, onSelect }: {
  category: typeof TERRAIN_CATEGORIES[number];
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  const handleClick = useCallback(() => {
    onSelect(category.id);
  }, [category.id, onSelect]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        "h-10 px-4 text-xs font-semibold border border-transparent rounded-lg transition-all duration-300",
        isSelected 
          ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-lg border-orange-500 hover:shadow-xl" 
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-orange-300 dark:hover:border-amber-600"
      )}
    >
      <category.icon className="w-3.5 h-3.5 mr-1.5" />
      {category.name}
    </Button>
  );
});

CategoryButton.displayName = "CategoryButton";

const BrushModeButton = memo(({ mode, isSelected, onSelect }: {
  mode: typeof BRUSH_MODES[number];
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  const handleClick = useCallback(() => {
    onSelect(mode.id);
  }, [mode.id, onSelect]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        "h-10 px-4 text-xs font-semibold border border-transparent rounded-lg transition-all duration-300",
        isSelected 
          ? "bg-gradient-to-r from-blue-500 to-indigo-400 text-white shadow-lg border-blue-500 hover:shadow-xl" 
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-indigo-600"
      )}
      title={mode.description}
    >
      <span className="mr-1.5">{mode.icon}</span>
      {mode.name}
    </Button>
  );
});

BrushModeButton.displayName = "BrushModeButton";

export const TerrainLibrary = memo(({ selectedTerrain, onTerrainSelect }: TerrainLibraryProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrushMode, setSelectedBrushMode] = useState("rectangle");
  const [brushThickness, setBrushThickness] = useState([20]);
  const { searchTerm, setSearchTerm, searchResults } = useEnhancedSearch(SAMPLE_TERRAINS, {
    searchFields: ['name', 'description'],
    debounceMs: 200
  });

  const filteredTerrains = useMemo(() => {
    let terrains = searchTerm ? searchResults : SAMPLE_TERRAINS;
    
    if (selectedCategory !== "all") {
      terrains = terrains.filter(terrain => terrain.category === selectedCategory);
    }
    
    return terrains;
  }, [searchTerm, searchResults, selectedCategory]);

  const handleTerrainSelect = useCallback((terrain: Terrain) => {
    const isCurrentlySelected = selectedTerrain?.id === terrain.id;
    const terrainWithSettings = isCurrentlySelected ? null : {
      ...terrain,
      selectedBrushMode,
      brushThickness: brushThickness[0],
      // Ensure all terrains support all brush modes
      supportedModes: ["rectangle", "circle", "brush"]
    };
    onTerrainSelect(terrainWithSettings);
  }, [selectedTerrain?.id, onTerrainSelect, selectedBrushMode, brushThickness]);

  const memoizedCategories = useMemo(() => TERRAIN_CATEGORIES.map(category => (
    <CategoryButton
      key={category.id}
      category={category}
      isSelected={selectedCategory === category.id}
      onSelect={setSelectedCategory}
    />
  )), [selectedCategory]);

  const memoizedBrushModes = useMemo(() => BRUSH_MODES.map(mode => (
    <BrushModeButton
      key={mode.id}
      mode={mode}
      isSelected={selectedBrushMode === mode.id}
      onSelect={setSelectedBrushMode}
    />
  )), [selectedBrushMode]);

  const memoizedTerrains = useMemo(() => filteredTerrains.map(terrain => (
    <TerrainCard
      key={terrain.id}
      terrain={terrain}
      isSelected={selectedTerrain?.id === terrain.id}
      onSelect={handleTerrainSelect}
    />
  )), [filteredTerrains, selectedTerrain?.id, handleTerrainSelect]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent dark:from-orange-400 dark:to-amber-400">
            Biblioteca de Terreno
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{SAMPLE_TERRAINS.length} terrenos</span>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar terrenos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 focus:border-orange-400 dark:focus:border-orange-600 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all duration-200"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {memoizedCategories}
        </div>

        {/* Enhanced Brush Settings */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Modo de Aplicação
            </Label>
            <div className="flex flex-wrap gap-2">
              {memoizedBrushModes}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Todos os terrenos suportam todos os modos de aplicação
            </p>
          </div>
          
          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Espessura do Pincel: {brushThickness[0]}px
            </Label>
            <Slider
              value={brushThickness}
              onValueChange={setBrushThickness}
              max={100}
              min={5}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Fino (5px)</span>
              <span>Grosso (100px)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terrains List */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {memoizedTerrains.length > 0 ? (
            memoizedTerrains
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 flex items-center justify-center">
                <Mountain className="w-10 h-10 text-orange-500 dark:text-orange-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nenhum terreno encontrado
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tente ajustar os filtros ou buscar por outro termo
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Selected Terrain Info */}
      {selectedTerrain && (
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-md"
              style={{ backgroundColor: `${selectedTerrain.color}20`, boxShadow: `0 2px 8px ${selectedTerrain.color}30` }}
            >
              {selectedTerrain.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                {selectedTerrain.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Modo: {selectedBrushMode} • Tamanho: {selectedTerrain.size}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Espessura: {brushThickness[0]}px • Textura: {selectedTerrain.texture}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

TerrainLibrary.displayName = "TerrainLibrary";