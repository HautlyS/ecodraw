import React, { useState, useMemo, memo, useCallback } from "react";
import { Search, Mountain, Droplets, Wheat, Trees, Route, Square, Shield, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useEnhancedSearch } from "@/hooks/useEnhancedSearch";
import { Terrain as TerrainType } from "@/types/canvasTypes";

// Consolidated Terrain Categories with Modern Icons
const TERRAIN_CATEGORIES = [
  { id: "all", name: "Todos", icon: Mountain, color: "bg-gradient-to-r from-slate-400 to-gray-500" },
  { id: "cultivation", name: "Cultivo", icon: Wheat, color: "bg-gradient-to-r from-amber-400 to-orange-500" },
  { id: "water", name: "Água", icon: Droplets, color: "bg-gradient-to-r from-blue-400 to-cyan-500" },
  { id: "natural", name: "Natural", icon: Trees, color: "bg-gradient-to-r from-green-400 to-emerald-500" },
  { id: "paths", name: "Caminhos", icon: Route, color: "bg-gradient-to-r from-stone-400 to-slate-500" },
  { id: "zones", name: "Zonas", icon: Square, color: "bg-gradient-to-r from-purple-400 to-pink-500" },
  { id: "protection", name: "Proteção", icon: Shield, color: "bg-gradient-to-r from-red-400 to-rose-500" },
  { id: "favorites", name: "Favoritos", icon: Sparkles, color: "bg-gradient-to-r from-yellow-400 to-orange-500" },
] as const;

// Consolidated and Enhanced Terrain Data
const TERRAIN_DATA: TerrainType[] = [
  // Cultivo (Cultivation)
  {
    id: "campo-cultivo",
    name: "Campo de cultivo",
    category: "cultivation",
    color: "#8B4513",
    pattern: "solid",
    size: "variável",
    texture: "cultivation",
    icon: "🌾",
    description: "Área preparada para plantio geral"
  },
  {
    id: "canteiro-elevado",
    name: "Canteiro elevado",
    category: "cultivation",
    color: "#654321",
    pattern: "solid",
    size: "variável",
    texture: "cultivation",
    icon: "📦",
    description: "Canteiro elevado para hortaliças e ervas"
  },
  {
    id: "horta-mandala",
    name: "Horta mandala",
    category: "cultivation",
    color: "#228B22",
    pattern: "solid",
    size: "variável",
    texture: "cultivation",
    icon: "🌸",
    description: "Design circular permacultural"
  },
  {
    id: "espiral-ervas",
    name: "Espiral de ervas",
    category: "cultivation",
    color: "#32CD32",
    pattern: "solid",
    size: "variável",
    texture: "cultivation",
    icon: "🌿",
    description: "Estrutura espiral para ervas aromáticas"
  },
  {
    id: "terracos",
    name: "Terraços",
    category: "cultivation",
    color: "#8B7D6B",
    pattern: "solid",
    size: "variável",
    texture: "cultivation",
    icon: "🏔️",
    description: "Terraços para cultivo em declive"
  },
  {
    id: "leiras",
    name: "Leiras",
    category: "cultivation",
    color: "#A0522D",
    pattern: "solid",
    size: "variável",
    texture: "cultivation",
    icon: "🟫",
    description: "Leiras elevadas para drenagem"
  },

  // Água (Water)
  {
    id: "lago",
    name: "Lago",
    category: "water",
    color: "#1E90FF",
    pattern: "solid",
    size: "variável",
    texture: "water",
    icon: "🌊",
    description: "Corpo d'água natural ou artificial"
  },
  {
    id: "brejo",
    name: "Brejo",
    category: "water",
    color: "#4682B4",
    pattern: "solid",
    size: "variável",
    texture: "water",
    icon: "🏞️",
    description: "Área alagada para filtragem natural"
  },
  {
    id: "rio",
    name: "Rio",
    category: "water",
    color: "#4169E1",
    pattern: "solid",
    size: "variável",
    texture: "water",
    icon: "🏞️",
    description: "Curso d'água corrente"
  },
  {
    id: "acude",
    name: "Açude",
    category: "water",
    color: "#5F9EA0",
    pattern: "solid",
    size: "variável",
    texture: "water",
    icon: "🛁",
    description: "Reservatório de água"
  },
  {
    id: "bacia-retencao",
    name: "Bacia de retenção",
    category: "water",
    color: "#6495ED",
    pattern: "solid",
    size: "variável",
    texture: "water",
    icon: "💧",
    description: "Área para captação de água pluvial"
  },
  {
    id: "swale",
    name: "Swale",
    category: "water",
    color: "#87CEEB",
    pattern: "solid",
    size: "variável",
    texture: "water",
    icon: "〰️",
    description: "Valeta de infiltração permacultural"
  },
  {
    id: "poco-artesiano",
    name: "Poço Artesiano",
    category: "water",
    color: "#1e40af",
    pattern: "solid",
    size: "1x1m",
    texture: "water",
    icon: "🕳️",
    description: "Fonte de água subterrânea"
  },
  {
    id: "reservatorio",
    name: "Reservatório",
    category: "water",
    color: "#0ea5e9",
    pattern: "solid",
    size: "variável",
    texture: "water",
    icon: "🛁",
    description: "Reserva de água para irrigação"
  },

  // Natural (Natural areas)
  {
    id: "mata-nativa",
    name: "Mata nativa",
    category: "natural",
    color: "#006400",
    pattern: "solid",
    size: "variável",
    texture: "forest",
    icon: "🌳",
    description: "Floresta nativa preservada"
  },
  {
    id: "bosque",
    name: "Bosque",
    category: "natural",
    color: "#228B22",
    pattern: "solid",
    size: "variável",
    texture: "forest",
    icon: "🌲",
    description: "Área arborizada menos densa"
  },
  {
    id: "pasto",
    name: "Pasto",
    category: "natural",
    color: "#90EE90",
    pattern: "solid",
    size: "variável",
    texture: "grass",
    icon: "🌿",
    description: "Área de pastagem"
  },
  {
    id: "campo-nativo",
    name: "Campo nativo",
    category: "natural",
    color: "#9ACD32",
    pattern: "solid",
    size: "variável",
    texture: "grass",
    icon: "🌱",
    description: "Vegetação campestre natural"
  },
  {
    id: "area-regeneracao",
    name: "Área em regeneração",
    category: "natural",
    color: "#6B8E23",
    pattern: "solid",
    size: "variável",
    texture: "grass",
    icon: "🌱",
    description: "Área em processo de recuperação"
  },
  {
    id: "saf",
    name: "Sistema agroflorestal",
    category: "natural",
    color: "#556B2F",
    pattern: "solid",
    size: "variável",
    texture: "forest",
    icon: "🌳",
    description: "Sistema agroflorestal integrado"
  },
  {
    id: "area-sombreada",
    name: "Área Sombreada",
    category: "natural",
    color: "#065f46",
    pattern: "solid",
    size: "variável",
    texture: "grass",
    icon: "🌳",
    description: "Área coberta por árvores"
  },
  {
    id: "pedreira",
    name: "Pedreira",
    category: "natural",
    color: "#6b7280",
    pattern: "solid",
    size: "variável",
    texture: "rock",
    icon: "🪨",
    description: "Área rochosa natural"
  },

  // Caminhos (Paths)
  {
    id: "trilha",
    name: "Trilha",
    category: "paths",
    color: "#D2691E",
    pattern: "solid",
    size: "1.5m largura",
    texture: "path",
    icon: "🥾",
    description: "Caminho estreito de terra"
  },
  {
    id: "estrada-acesso",
    name: "Estrada de acesso",
    category: "paths",
    color: "#A0522D",
    pattern: "solid",
    size: "4m largura",
    texture: "path",
    icon: "🛤️",
    description: "Via principal de acesso"
  },
  {
    id: "caminho-pedestre",
    name: "Caminho pedestre",
    category: "paths",
    color: "#BC8F8F",
    pattern: "solid",
    size: "2m largura",
    texture: "path",
    icon: "🚶",
    description: "Passagem para pedestres"
  },
  {
    id: "carreador",
    name: "Carreador",
    category: "paths",
    color: "#8B7355",
    pattern: "solid",
    size: "3m largura",
    texture: "path",
    icon: "🚜",
    description: "Caminho para veículos agrícolas"
  },
  {
    id: "trilha-principal",
    name: "Trilha Principal",
    category: "paths",
    color: "#a3a3a3",
    pattern: "solid",
    size: "2m largura",
    texture: "path",
    icon: "🛤️",
    description: "Caminho principal para circulação"
  },
  {
    id: "estrada-terra",
    name: "Estrada de Terra",
    category: "paths",
    color: "#d97706",
    pattern: "solid",
    size: "3m largura",
    texture: "path",
    icon: "🛣️",
    description: "Estrada principal de acesso"
  },

  // Zonas (Zones)
  {
    id: "zona-1",
    name: "Zona 1 - Intensiva",
    category: "zones",
    color: "#FF6B6B",
    pattern: "solid",
    size: "variável",
    texture: "zone",
    icon: "🏠",
    description: "Área de uso intensivo próxima à casa"
  },
  {
    id: "zona-2",
    name: "Zona 2 - Cultivo",
    category: "zones",
    color: "#FFE66D",
    pattern: "solid",
    size: "variável",
    texture: "zone",
    icon: "🌱",
    description: "Área de cultivo semi-intensivo"
  },
  {
    id: "zona-3",
    name: "Zona 3 - Produção",
    category: "zones",
    color: "#95E1D3",
    pattern: "solid",
    size: "variável",
    texture: "zone",
    icon: "🚜",
    description: "Produção extensiva e pasto"
  },
  {
    id: "zona-4",
    name: "Zona 4 - Silvicultura",
    category: "zones",
    color: "#A8E6CF",
    pattern: "solid",
    size: "variável",
    texture: "zone",
    icon: "🌲",
    description: "Área de manejo florestal"
  },
  {
    id: "zona-5",
    name: "Zona 5 - Silvestre",
    category: "zones",
    color: "#C7CEEA",
    pattern: "solid",
    size: "variável",
    texture: "zone",
    icon: "🦋",
    description: "Área silvestre sem intervenção"
  },
  {
    id: "area-social",
    name: "Área social",
    category: "zones",
    color: "#FFB6C1",
    pattern: "solid",
    size: "variável",
    texture: "zone",
    icon: "🎪",
    description: "Espaço para eventos e convivência"
  },
  {
    id: "area-compostagem",
    name: "Área de compostagem",
    category: "zones",
    color: "#8B4513",
    pattern: "solid",
    size: "variável",
    texture: "zone",
    icon: "♻️",
    description: "Zona dedicada à compostagem"
  },

  // Proteção (Protection)
  {
    id: "quebra-vento",
    name: "Quebra-vento",
    category: "protection",
    color: "#2F4F4F",
    pattern: "solid",
    size: "variável",
    texture: "protection",
    icon: "🌬️",
    description: "Barreira contra ventos fortes"
  },
  {
    id: "faixa-protecao",
    name: "Faixa de proteção",
    category: "protection",
    color: "#708090",
    pattern: "solid",
    size: "variável",
    texture: "protection",
    icon: "🛡️",
    description: "Área de proteção ambiental"
  },
  {
    id: "aceiro",
    name: "Aceiro",
    category: "protection",
    color: "#F5DEB3",
    pattern: "solid",
    size: "variável",
    texture: "protection",
    icon: "🔥",
    description: "Faixa limpa contra incêndios"
  },
  {
    id: "zona-amortecimento",
    name: "Zona de amortecimento",
    category: "protection",
    color: "#778899",
    pattern: "solid",
    size: "variável",
    texture: "protection",
    icon: "🛡️",
    description: "Área de transição e proteção"
  }
];

const BRUSH_MODES = [
  { id: "rectangle", name: "Retângulo", icon: "⬜", description: "Forma retangular", color: "bg-gradient-to-r from-blue-400 to-indigo-500" },
  { id: "circle", name: "Círculo", icon: "⭕", description: "Forma circular", color: "bg-gradient-to-r from-purple-400 to-pink-500" },
  { id: "brush", name: "Pincel", icon: "🖌️", description: "Desenho livre", color: "bg-gradient-to-r from-orange-400 to-red-500" },
] as const;

interface TerrainLibraryProps {
  selectedTerrain: TerrainType | null;
  onTerrainSelect: (terrain: TerrainType | null) => void;
}

const TerrainCard = memo(({ terrain, isSelected, onSelect }: {
  terrain: TerrainType;
  isSelected: boolean;
  onSelect: (terrain: TerrainType) => void;
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
        "group relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer",
        "bg-white/70 dark:bg-gray-900/70 border-white/20 dark:border-gray-800/20",
        "hover:bg-white/90 dark:hover:bg-gray-800/90 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10",
        isSelected && "bg-gradient-to-br from-orange-50/90 to-amber-50/90 dark:from-orange-950/90 dark:to-amber-950/90",
        isSelected && "ring-2 ring-orange-400/60 dark:ring-orange-600/60 shadow-2xl shadow-orange-500/20 scale-[1.02]"
      )}
      onClick={handleClick}
      draggable
      onDragStart={handleDragStart}
    >
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-gray-700/10 pointer-events-none" />
      
      <div className="relative p-4">
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center justify-center w-14 h-14 rounded-2xl text-xl shadow-lg transition-all duration-300 group-hover:scale-110"
            style={{ 
              backgroundColor: `${terrain.color}15`,
              boxShadow: `0 8px 32px ${terrain.color}20`,
              border: `1px solid ${terrain.color}20`
            }}
          >
            {terrain.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                {terrain.name}
              </h3>
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-1 h-auto rounded-full bg-orange-100/80 dark:bg-orange-900/50 border-orange-200/60 dark:border-orange-800/60 backdrop-blur-sm"
              >
                {terrain.size}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-2">
              {terrain.description}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-500">
                Textura: {terrain.texture}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Selection glow effect */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-amber-400/10 rounded-2xl pointer-events-none" />
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
        "h-11 px-4 text-xs font-semibold rounded-2xl transition-all duration-300 backdrop-blur-xl border",
        "hover:scale-105 hover:shadow-lg",
        isSelected 
          ? `${category.color} text-white shadow-lg border-white/20 hover:shadow-xl` 
          : "bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border-white/20 dark:border-gray-700/20 hover:bg-white/80 dark:hover:bg-gray-700/80"
      )}
    >
      <category.icon className="w-4 h-4 mr-2" />
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
        "h-10 px-4 text-xs font-semibold rounded-2xl transition-all duration-300 backdrop-blur-xl border",
        "hover:scale-105 hover:shadow-lg",
        isSelected 
          ? `${mode.color} text-white shadow-lg border-white/20 hover:shadow-xl` 
          : "bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border-white/20 dark:border-gray-700/20 hover:bg-white/80 dark:hover:bg-gray-700/80"
      )}
      title={mode.description}
    >
      <span className="mr-2">{mode.icon}</span>
      {mode.name}
    </Button>
  );
});

BrushModeButton.displayName = "BrushModeButton";

export const TerrainLibrary = memo(({ selectedTerrain, onTerrainSelect }: TerrainLibraryProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrushMode, setSelectedBrushMode] = useState("rectangle");
  const [brushThickness, setBrushThickness] = useState([20]);
  const { searchTerm, setSearchTerm, searchResults } = useEnhancedSearch(TERRAIN_DATA, {
    searchFields: ['name', 'description'],
    debounceMs: 200
  });

  const filteredTerrains = useMemo(() => {
    let terrains = searchTerm ? searchResults : TERRAIN_DATA;
    
    if (selectedCategory !== "all") {
      terrains = terrains.filter(terrain => terrain.category === selectedCategory);
    }
    
    return terrains;
  }, [searchTerm, searchResults, selectedCategory]);

  const handleTerrainSelect = useCallback((terrain: TerrainType) => {
    const isCurrentlySelected = selectedTerrain?.id === terrain.id;
    const terrainWithSettings = isCurrentlySelected ? null : {
      ...terrain,
      selectedBrushMode: selectedBrushMode as 'rectangle' | 'circle' | 'brush',
      brushThickness: brushThickness[0],
      supportedModes: ["rectangle", "circle", "brush"] as const
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
    <div className="flex flex-col h-full bg-gradient-to-br from-orange-50/50 via-white/50 to-amber-50/50 dark:from-gray-900/50 dark:via-gray-900/50 dark:to-gray-800/50">
      {/* Header with Glass Morphism */}
      <div className="sticky top-0 z-20 p-4 border-b border-white/20 dark:border-gray-700/20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent dark:from-orange-400 dark:to-amber-400">
              Biblioteca de Terreno
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse shadow-lg shadow-orange-400/50"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{TERRAIN_DATA.length} terrenos</span>
          </div>
        </div>
        
        {/* Search with Glass Morphism */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar terrenos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 text-sm rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/20 dark:border-gray-700/20 focus:border-orange-400/60 dark:focus:border-orange-600/60 focus:ring-2 focus:ring-orange-200/50 dark:focus:ring-orange-800/50 transition-all duration-200"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {memoizedCategories}
        </div>

        {/* Enhanced Brush Settings with Glass Morphism */}
        <div className="space-y-4 p-4 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
          <div>
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
              Modo de Aplicação
            </Label>
            <div className="flex flex-wrap gap-2">
              {memoizedBrushModes}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Todos os terrenos suportam todos os modos de aplicação
            </p>
          </div>
          
          <div>
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
              Espessura do Pincel: {brushThickness[0]}px
            </Label>
            <div className="px-2">
              <Slider
                value={brushThickness}
                onValueChange={setBrushThickness}
                max={100}
                min={5}
                step={5}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
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
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-orange-100/80 to-amber-100/80 dark:from-orange-900/20 dark:to-amber-900/20 flex items-center justify-center backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
                <Mountain className="w-12 h-12 text-orange-500 dark:text-orange-400" />
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Nenhum terreno encontrado
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tente ajustar os filtros ou buscar por outro termo
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Selected Terrain Info with Glass Morphism */}
      {selectedTerrain && (
        <div className="p-4 border-t border-white/20 dark:border-gray-700/20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-r from-orange-50/60 to-amber-50/60 dark:from-orange-950/60 dark:to-amber-950/60 border border-white/20 dark:border-gray-700/20">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-lg"
              style={{ 
                backgroundColor: `${selectedTerrain.color}15`,
                boxShadow: `0 4px 16px ${selectedTerrain.color}20`,
                border: `1px solid ${selectedTerrain.color}20`
              }}
            >
              {selectedTerrain.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {selectedTerrain.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {selectedTerrain.description}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  Modo: {selectedBrushMode}
                </span>
                <span className="text-gray-500">•</span>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  Tamanho: {selectedTerrain.size}
                </span>
                <span className="text-gray-500">•</span>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  Espessura: {brushThickness[0]}px
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

TerrainLibrary.displayName = "TerrainLibrary";