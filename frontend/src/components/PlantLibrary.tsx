import React, { useState, useMemo, memo, useCallback } from "react";
import { Search, Star, Leaf, Apple, Pill, Wheat, Carrot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEnhancedSearch } from "@/hooks/useEnhancedSearch";
import { Plant } from "@/types/canvasTypes";

const PLANT_CATEGORIES = [
  { id: "all", name: "Todas", icon: Leaf },
  { id: "favorites", name: "Favoritas", icon: Star },
  { id: "fruits", name: "Frutíferas", icon: Apple },
  { id: "vegetables", name: "Hortaliças", icon: Leaf },
  { id: "medicinal", name: "Medicinais", icon: Pill },
  { id: "grains", name: "Grãos", icon: Wheat },
  { id: "roots", name: "Raízes", icon: Carrot },
] as const;

const SAMPLE_PLANTS: Plant[] = [
  {
    id: "1",
    name: "Tomate",
    category: "vegetables",
    spacing: "60x40cm",
    color: "#ef4444",
    icon: "🍅",
    description: "Rico em licopeno"
  },
  {
    id: "2",
    name: "Alface",
    category: "vegetables",
    spacing: "30x30cm",
    color: "#22c55e",
    icon: "🥬",
    description: "Folhosa de crescimento rápido"
  },
  {
    id: "3",
    name: "Manga",
    category: "fruits",
    spacing: "8x8m",
    color: "#f59e0b",
    icon: "🥭",
    description: "Árvore frutífera tropical"
  },
  {
    id: "4",
    name: "Cenoura",
    category: "roots",
    spacing: "20x15cm",
    color: "#f97316",
    icon: "🥕",
    description: "Rica em betacaroteno"
  },
  {
    id: "5",
    name: "Milho",
    category: "grains",
    spacing: "80x30cm",
    color: "#eab308",
    icon: "🌽",
    description: "Cereal básico nutritivo"
  },
  {
    id: "6",
    name: "Hortelã",
    category: "medicinal",
    spacing: "25x25cm",
    color: "#10b981",
    icon: "🌿",
    description: "Planta aromática medicinal"
  },
  {
    id: "7",
    name: "Laranja",
    category: "fruits",
    spacing: "6x6m",
    color: "#f97316",
    icon: "🍊",
    description: "Cítrica rica em vitamina C"
  },
  {
    id: "8",
    name: "Batata",
    category: "roots",
    spacing: "40x30cm",
    color: "#a3a3a3",
    icon: "🥔",
    description: "Tubérculo energético"
  },
  {
    id: "9",
    name: "Feijão",
    category: "grains",
    spacing: "30x10cm",
    color: "#7c2d12",
    icon: "🫘",
    description: "Leguminosa rica em proteína"
  },
  {
    id: "10",
    name: "Alecrim",
    category: "medicinal",
    spacing: "50x50cm",
    color: "#059669",
    icon: "🌿",
    description: "Erva aromática antioxidante"
  }
];

interface PlantLibraryProps {
  selectedPlant: Plant | null;
  onPlantSelect: (plant: Plant | null) => void;
}

const PlantCard = memo(({ plant, isSelected, onSelect }: {
  plant: Plant;
  isSelected: boolean;
  onSelect: (plant: Plant) => void;
}) => {
  const handleClick = useCallback(() => {
    onSelect(plant);
  }, [plant, onSelect]);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(plant));
    e.dataTransfer.effectAllowed = 'copy';
  }, [plant]);

  return (
    <div
      className={cn(
        "group relative p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-200 cursor-pointer",
        "hover:shadow-lg hover:scale-[1.02] hover:border-green-300 dark:hover:border-green-700",
        isSelected && "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950 dark:to-emerald-950 ring-2 ring-green-400 dark:ring-green-600 shadow-lg scale-[1.02]"
      )}
      onClick={handleClick}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex items-center gap-3">
        <div 
          className="flex items-center justify-center w-12 h-12 rounded-xl text-lg shadow-md transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${plant.color}20`, boxShadow: `0 4px 12px ${plant.color}30` }}
        >
          {plant.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
              {plant.name}
            </h3>
            <Badge variant="outline" className="text-xs px-2 py-0.5 h-auto bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700">
              {PLANT_CATEGORIES.find(cat => cat.id === plant.category)?.name || plant.category}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-0.5">
            {plant.description}
          </p>
        </div>
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/10 rounded-xl pointer-events-none" />
      )}
    </div>
  );
});

PlantCard.displayName = "PlantCard";

const CategoryButton = memo(({ category, isSelected, onSelect }: {
  category: typeof PLANT_CATEGORIES[number];
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
          ? "bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg border-green-500 hover:shadow-xl" 
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-green-300 dark:hover:border-emerald-600"
      )}
    >
      <category.icon className="w-3.5 h-3.5 mr-1.5" />
      {category.name}
    </Button>
  );
});

CategoryButton.displayName = "CategoryButton";

export const PlantLibrary = memo(({ selectedPlant, onPlantSelect }: PlantLibraryProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { searchTerm, setSearchTerm, searchResults } = useEnhancedSearch(SAMPLE_PLANTS, {
    searchFields: ['name', 'description'],
    debounceMs: 200
  });

  const filteredPlants = useMemo(() => {
    let plants = searchTerm ? searchResults : SAMPLE_PLANTS;
    
    if (selectedCategory !== "all") {
      plants = plants.filter(plant => plant.category === selectedCategory);
    }
    
    return plants;
  }, [searchTerm, searchResults, selectedCategory]);

  const handlePlantSelect = useCallback((plant: Plant) => {
    onPlantSelect(selectedPlant?.id === plant.id ? null : plant);
  }, [selectedPlant?.id, onPlantSelect]);

  const memoizedCategories = useMemo(() => PLANT_CATEGORIES.map(category => (
    <CategoryButton
      key={category.id}
      category={category}
      isSelected={selectedCategory === category.id}
      onSelect={setSelectedCategory}
    />
  )), [selectedCategory]);

  const memoizedPlants = useMemo(() => filteredPlants.map(plant => (
    <PlantCard
      key={plant.id}
      plant={plant}
      isSelected={selectedPlant?.id === plant.id}
      onSelect={handlePlantSelect}
    />
  )), [filteredPlants, selectedPlant?.id, handlePlantSelect]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-400">
            Biblioteca de Plantas
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{SAMPLE_PLANTS.length} plantas</span>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar plantas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 focus:border-green-400 dark:focus:border-green-600 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-200"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {memoizedCategories}
        </div>
      </div>

      {/* Plants List */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {memoizedPlants.length > 0 ? (
            memoizedPlants
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center">
                <Leaf className="w-10 h-10 text-green-500 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nenhuma planta encontrada
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tente ajustar os filtros ou buscar por outro termo
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Selected Plant Info */}
      {selectedPlant && (
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-md"
              style={{ backgroundColor: `${selectedPlant.color}20`, boxShadow: `0 2px 8px ${selectedPlant.color}30` }}
            >
              {selectedPlant.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                {selectedPlant.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Espaçamento: {selectedPlant.spacing}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

PlantLibrary.displayName = "PlantLibrary";