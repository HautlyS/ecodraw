import React, { useState, useMemo, memo, useCallback } from "react";
import { Search, Star, Filter, Grid, List, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plant as PlantType } from "@/types/canvasTypes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

interface ModernPlantGalleryProps {
  plants: PlantType[];
  selectedPlant?: PlantType | null;
  onPlantSelect: (plant: PlantType | null) => void;
  categories: Array<{ id: string; name: string; icon: React.ElementType; color: string }>;
}

// Modern Plant Card Component
const ModernPlantCard = memo(({ 
  plant, 
  isSelected, 
  onSelect,
  viewMode = 'grid'
}: {
  plant: PlantType;
  isSelected: boolean;
  onSelect: (plant: PlantType) => void;
  viewMode?: 'grid' | 'list';
}) => {
  const handleClick = useCallback(() => {
    onSelect(plant);
  }, [plant, onSelect]);

  if (viewMode === 'list') {
    return (
      <Card 
        className={cn(
          "group cursor-pointer transition-all duration-200 hover:shadow-md",
          "border border-gray-200/60 dark:border-gray-700/60 hover:border-green-300 dark:hover:border-green-600",
          "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
          isSelected && "ring-2 ring-green-500 border-green-500 shadow-lg bg-green-50/50 dark:bg-green-950/30"
        )}
        onClick={handleClick}
      >
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl shadow-sm border"
              style={{ 
                backgroundColor: plant.color + '20',
                borderColor: plant.color + '40'
              }}
            >
              {plant.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">
                {plant.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="secondary" 
                  className="text-xs h-5 px-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {plant.spacing}
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {plant.description}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
        "border border-gray-200/60 dark:border-gray-700/60 hover:border-green-300 dark:hover:border-green-600",
        "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
        isSelected && "ring-2 ring-green-500 border-green-500 shadow-lg bg-green-50/50 dark:bg-green-950/30"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4 text-center">
        <div 
          className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center text-3xl shadow-md border"
          style={{ 
            backgroundColor: plant.color + '20',
            borderColor: plant.color + '40'
          }}
        >
          {plant.icon}
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-2 line-clamp-2">
          {plant.name}
        </h3>
        <Badge 
          variant="secondary" 
          className="text-xs mb-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        >
          {plant.spacing}
        </Badge>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
          {plant.description}
        </p>
      </CardContent>
    </Card>
  );
});

ModernPlantCard.displayName = "ModernPlantCard";

export const ModernPlantGallery = memo(({ 
  plants, 
  selectedPlant, 
  onPlantSelect, 
  categories 
}: ModernPlantGalleryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and search plants
  const filteredPlants = useMemo(() => {
    let filtered = plants;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(plant => plant.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(plant => 
        plant.name.toLowerCase().includes(term) ||
        plant.description?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [plants, selectedCategory, searchTerm]);

  const handlePlantSelect = useCallback((plant: PlantType) => {
    const isCurrentlySelected = selectedPlant?.id === plant.id;
    onPlantSelect(isCurrentlySelected ? null : plant);
  }, [selectedPlant?.id, onPlantSelect]);

  const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-green-50/50 via-white/50 to-emerald-50/50 dark:from-gray-900/50 dark:via-gray-900/50 dark:to-gray-800/50">
      {/* Modern Header */}
      <div className="p-4 border-b border-gray-200/60 dark:border-gray-700/60 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Biblioteca de Plantas
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar plantas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Category Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2">
                {selectedCategoryObj && <selectedCategoryObj.icon className="h-4 w-4" />}
                <span>{selectedCategoryObj?.name || 'Todas as categorias'}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <DropdownMenuRadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
              {categories.map((category) => (
                <DropdownMenuRadioItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    <span>{category.name}</span>
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {filteredPlants.length} {filteredPlants.length === 1 ? 'planta encontrada' : 'plantas encontradas'}
        </div>
      </div>

      {/* Plants Grid/List */}
      <ScrollArea className="flex-1 p-4">
        <div className={cn(
          "gap-3",
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
            : "flex flex-col space-y-2"
        )}>
          {filteredPlants.map((plant) => (
            <ModernPlantCard
              key={plant.id}
              plant={plant}
              isSelected={selectedPlant?.id === plant.id}
              onSelect={handlePlantSelect}
              viewMode={viewMode}
            />
          ))}
        </div>

        {filteredPlants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-2">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
              Nenhuma planta encontrada
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Tente ajustar os filtros ou termo de busca
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
});

ModernPlantGallery.displayName = "ModernPlantGallery";