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
    texture: "soil",
    icon: "🟫",
    description: "Solo rico em nutrientes"
  },
  {
    id: "2",
    name: "Lago",
    category: "water",
    size: "variável",
    color: "#3b82f6",
    texture: "water",
    icon: "🌊",
    description: "Corpo d'água natural"
  },
  {
    id: "3",
    name: "Casa Principal",
    category: "structures",
    size: "10x8m",
    color: "#ef4444",
    texture: "building",
    icon: "🏠",
    description: "Residência principal"
  },
  {
    id: "4",
    name: "Cerca de Madeira",
    category: "fences",
    size: "variável",
    color: "#92400e",
    texture: "fence",
    icon: "🪵",
    description: "Delimitação de propriedade"
  },
  {
    id: "5",
    name: "Painel Solar",
    category: "energy",
    size: "4x2m",
    color: "#1f2937",
    texture: "solar",
    icon: "☀️",
    description: "Energia renovável"
  },
  {
    id: "6",
    name: "Trilha",
    category: "paths",
    size: "2m largura",
    color: "#a3a3a3",
    texture: "path",
    icon: "🛤️",
    description: "Caminho para circulação"
  },
  {
    id: "7",
    name: "Composteira",
    category: "structures",
    size: "2x2m",
    color: "#059669",
    texture: "compost",
    icon: "♻️",
    description: "Área de compostagem"
  },
  {
    id: "8",
    name: "Poço",
    category: "water",
    size: "1x1m",
    color: "#1e40af",
    texture: "well",
    icon: "🕳️",
    description: "Fonte de água subterrânea"
  }
];

const BRUSH_MODES = [
  { id: "rectangle", name: "Retângulo", icon: "⬜" },
  { id: "circle", name: "Círculo", icon: "⭕" },
  { id: "brush", name: "Pincel", icon: "🖌️" },
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

  return (
    <div
      className={cn(
        "group relative p-3 rounded-lg border-0 bg-white dark:bg-gray-900 transition-all duration-150 cursor-pointer",
        "hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm",
        isSelected && "bg-orange-50 dark:bg-orange-950 ring-1 ring-orange-200 dark:ring-orange-800"
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <div 
          className="flex items-center justify-center w-10 h-10 rounded-lg text-lg"
          style={{ backgroundColor: `${terrain.color}15` }}
        >
          {terrain.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
              {terrain.name}
            </h3>
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
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
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-500/10 rounded-lg pointer-events-none" />
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
        "h-8 px-3 text-xs font-medium border-0 bg-transparent transition-all duration-150",
        isSelected 
          ? "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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
        "h-8 px-3 text-xs font-medium border-0 bg-transparent transition-all duration-150",
        isSelected 
          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
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
      brushThickness: brushThickness[0]
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
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Biblioteca de Terreno
        </h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar terrenos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-4">
          {memoizedCategories}
        </div>

        {/* Brush Settings */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Modo do Pincel
            </Label>
            <div className="flex flex-wrap gap-1">
              {memoizedBrushModes}
            </div>
          </div>
          
          <div>
            <Label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
              Espessura: {brushThickness[0]}px
            </Label>
            <Slider
              value={brushThickness}
              onValueChange={setBrushThickness}
              max={100}
              min={5}
              step={5}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Terrains List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {memoizedTerrains.length > 0 ? (
            memoizedTerrains
          ) : (
            <div className="text-center py-8">
              <Mountain className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nenhum terreno encontrado
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Selected Terrain Info */}
      {selectedTerrain && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ backgroundColor: `${selectedTerrain.color}15` }}
            >
              {selectedTerrain.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                {selectedTerrain.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Modo: {selectedBrushMode} • {selectedTerrain.size}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

TerrainLibrary.displayName = "TerrainLibrary";