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
        "group relative p-3 rounded-lg border-0 bg-white dark:bg-gray-900 transition-all duration-150 cursor-pointer",
        "hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm",
        isSelected && "bg-blue-50 dark:bg-blue-950 ring-1 ring-blue-200 dark:ring-blue-800"
      )}
      onClick={handleClick}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex items-center gap-3">
        <div 
          className="flex items-center justify-center w-10 h-10 rounded-lg text-lg"
          style={{ backgroundColor: `${plant.color}15` }}
        >
          {plant.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
              {plant.name}
            </h3>
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-500/10 rounded-lg pointer-events-none" />
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
        "h-8 px-3 text-xs font-medium border-0 bg-transparent transition-all duration-150",
        isSelected 
          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
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
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Biblioteca de Plantas
        </h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar plantas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {memoizedCategories}
        </div>
      </div>

      {/* Plants List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {memoizedPlants.length > 0 ? (
            memoizedPlants
          ) : (
            <div className="text-center py-8">
              <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Nenhuma planta encontrada
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Selected Plant Info */}
      {selectedPlant && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ backgroundColor: `${selectedPlant.color}15` }}
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