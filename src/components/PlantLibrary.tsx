import React, { useState, useMemo, memo, useCallback } from "react";
import { Search, Star, Leaf, Apple, Pill, Wheat, Carrot, Trees, Flower, Sprout } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEnhancedSearch } from "@/hooks/useEnhancedSearch";
import { Plant as PlantType } from "@/types/canvasTypes";
import { AutoSizer, List } from 'react-virtualized';

// Consolidated Plant Categories with Icons
const PLANT_CATEGORIES = [
  { id: "all", name: "Todas", icon: Leaf, color: "bg-gradient-to-r from-emerald-400 to-green-500" },
  { id: "favorites", name: "Favoritas", icon: Star, color: "bg-gradient-to-r from-yellow-400 to-orange-500" },
  { id: "trees", name: "Árvores", icon: Trees, color: "bg-gradient-to-r from-green-600 to-emerald-700" },
  { id: "fruits", name: "Frutíferas", icon: Apple, color: "bg-gradient-to-r from-red-400 to-pink-500" },
  { id: "vegetables", name: "Hortaliças", icon: Leaf, color: "bg-gradient-to-r from-green-400 to-lime-500" },
  { id: "herbs", name: "Ervas", icon: Trees, color: "bg-gradient-to-r from-teal-400 to-cyan-500" },
  { id: "flowers", name: "Flores", icon: Flower, color: "bg-gradient-to-r from-purple-400 to-pink-500" },
  { id: "medicinal", name: "Medicinais", icon: Pill, color: "bg-gradient-to-r from-blue-400 to-indigo-500" },
  { id: "grains", name: "Grãos", icon: Wheat, color: "bg-gradient-to-r from-amber-400 to-yellow-500" },
  { id: "roots", name: "Raízes", icon: Carrot, color: "bg-gradient-to-r from-orange-400 to-red-500" },
  { id: "shrubs", name: "Arbustos", icon: Trees, color: "bg-gradient-to-r from-emerald-500 to-green-600" },
  { id: "cover_crops", name: "Adubação Verde", icon: Sprout, color: "bg-gradient-to-r from-lime-400 to-green-500" },
] as const;

// Consolidated and Enhanced Plants Data
const PLANTS_DATA: PlantType[] = [
  // Trees (Árvores)
  {
    id: "tree-1",
    name: "Eucalipto",
    category: "trees",
    spacing: "3x3m",
    color: "#047857",
    icon: "🌳",
    description: "Árvore de crescimento rápido, usada para madeira e quebra-vento",
  },
  {
    id: "tree-2",
    name: "Ipê Amarelo",
    category: "trees",
    spacing: "5x5m",
    color: "#fbbf24",
    icon: "🌳",
    description: "Árvore nativa ornamental com flores amarelas",
  },
  {
    id: "tree-3",
    name: "Pau-Brasil",
    category: "trees",
    spacing: "4x4m",
    color: "#b91c1c",
    icon: "🌳",
    description: "Árvore nativa símbolo do Brasil",
  },
  {
    id: "tree-4",
    name: "Jatobá",
    category: "trees",
    spacing: "6x6m",
    color: "#92400e",
    icon: "🌳",
    description: "Árvore nativa de madeira nobre",
  },
  {
    id: "tree-5",
    name: "Cedro",
    category: "trees",
    spacing: "5x5m",
    color: "#7c2d12",
    icon: "🌲",
    description: "Árvore de madeira aromática e resistente",
  },

  // Fruit Trees (Frutíferas)
  {
    id: "fruit-1",
    name: "Abacateiro",
    category: "fruits",
    spacing: "8x8m",
    color: "#65a30d",
    icon: "🥑",
    description: "Árvore frutífera de abacate",
  },
  {
    id: "fruit-2",
    name: "Mangueira",
    category: "fruits",
    spacing: "10x10m",
    color: "#facc15",
    icon: "🥭",
    description: "Árvore frutífera tropical de manga",
  },
  {
    id: "fruit-3",
    name: "Laranjeira",
    category: "fruits",
    spacing: "4x4m",
    color: "#fb923c",
    icon: "🍊",
    description: "Árvore cítrica produtora de laranjas",
  },
  {
    id: "fruit-4",
    name: "Limoeiro",
    category: "fruits",
    spacing: "3x3m",
    color: "#fde047",
    icon: "🍋",
    description: "Árvore cítrica produtora de limões",
  },
  {
    id: "fruit-5",
    name: "Bananeira",
    category: "fruits",
    spacing: "3x3m",
    color: "#facc15",
    icon: "🍌",
    description: "Planta tropical produtora de bananas",
  },
  {
    id: "fruit-6",
    name: "Mamoeiro",
    category: "fruits",
    spacing: "2x2m",
    color: "#fb923c",
    icon: "🍈",
    description: "Árvore de crescimento rápido produtora de mamão",
  },
  {
    id: "fruit-7",
    name: "Goiabeira",
    category: "fruits",
    spacing: "5x5m",
    color: "#ec4899",
    icon: "🍐",
    description: "Árvore frutífera tropical de goiaba",
  },
  {
    id: "fruit-8",
    name: "Aceroleira",
    category: "fruits",
    spacing: "3x3m",
    color: "#dc2626",
    icon: "🍒",
    description: "Arbusto produtor de acerola rica em vitamina C",
  },
  {
    id: "fruit-9",
    name: "Jabuticabeira",
    category: "fruits",
    spacing: "4x4m",
    color: "#4c1d95",
    icon: "🫐",
    description: "Árvore nativa com frutos no tronco",
  },
  {
    id: "fruit-10",
    name: "Pitangueira",
    category: "fruits",
    spacing: "3x3m",
    color: "#dc2626",
    icon: "🍒",
    description: "Arbusto nativo com frutos vermelhos",
  },
  {
    id: "fruit-11",
    name: "Morango",
    category: "fruits",
    spacing: "30x25cm",
    color: "#dc2626",
    icon: "🍓",
    description: "Fruta rasteira doce"
  },
  {
    id: "fruit-12",
    name: "Limão",
    category: "fruits",
    spacing: "5x5m",
    color: "#eab308",
    icon: "🍋",
    description: "Cítrico ácido versátil"
  },

  // Vegetables (Hortaliças)
  {
    id: "veg-1",
    name: "Tomate",
    category: "vegetables",
    spacing: "60x40cm",
    color: "#ef4444",
    icon: "🍅",
    description: "Rico em licopeno"
  },
  {
    id: "veg-2",
    name: "Alface",
    category: "vegetables",
    spacing: "30x30cm",
    color: "#22c55e",
    icon: "🥬",
    description: "Folhosa de crescimento rápido"
  },
  {
    id: "veg-3",
    name: "Abóbora",
    category: "vegetables",
    spacing: "2x2m",
    color: "#f97316",
    icon: "🎃",
    description: "Trepadeira produtiva"
  },
  {
    id: "veg-4",
    name: "Cebola",
    category: "vegetables",
    spacing: "15x10cm",
    color: "#e11d48",
    icon: "🧅",
    description: "Bulbo aromático essencial"
  },
  {
    id: "veg-5",
    name: "Pimentão",
    category: "vegetables",
    spacing: "50x40cm",
    color: "#ef4444",
    icon: "🫑",
    description: "Fruto rico em vitamina C"
  },

  // Roots (Raízes)
  {
    id: "root-1",
    name: "Cenoura",
    category: "roots",
    spacing: "20x15cm",
    color: "#f97316",
    icon: "🥕",
    description: "Rica em betacaroteno"
  },
  {
    id: "root-2",
    name: "Batata",
    category: "roots",
    spacing: "40x30cm",
    color: "#a3a3a3",
    icon: "🥔",
    description: "Tubérculo energético"
  },
  {
    id: "root-3",
    name: "Mandioca",
    category: "roots",
    spacing: "1x1m",
    color: "#a16207",
    icon: "🥔",
    description: "Raiz rica em carboidratos"
  },

  // Grains (Grãos)
  {
    id: "grain-1",
    name: "Milho",
    category: "grains",
    spacing: "80x30cm",
    color: "#eab308",
    icon: "🌽",
    description: "Cereal básico nutritivo"
  },
  {
    id: "grain-2",
    name: "Feijão",
    category: "grains",
    spacing: "30x10cm",
    color: "#7c2d12",
    icon: "🫘",
    description: "Leguminosa rica em proteína"
  },
  {
    id: "grain-3",
    name: "Arroz",
    category: "grains",
    spacing: "20x20cm",
    color: "#f5f5f4",
    icon: "🌾",
    description: "Cereal aquático básico"
  },

  // Medicinal (Medicinais)
  {
    id: "med-1",
    name: "Hortelã",
    category: "medicinal",
    spacing: "25x25cm",
    color: "#10b981",
    icon: "🌿",
    description: "Planta aromática medicinal"
  },
  {
    id: "med-2",
    name: "Alecrim",
    category: "medicinal",
    spacing: "50x50cm",
    color: "#059669",
    icon: "🌿",
    description: "Erva aromática antioxidante"
  },
  {
    id: "med-3",
    name: "Camomila",
    category: "medicinal",
    spacing: "20x20cm",
    color: "#fbbf24",
    icon: "🌼",
    description: "Flor calmante medicinal"
  },
  {
    id: "med-4",
    name: "Gengibre",
    category: "medicinal",
    spacing: "40x30cm",
    color: "#d97706",
    icon: "🫚",
    description: "Rizoma anti-inflamatório"
  },
];

interface PlantLibraryProps {
  selectedPlant: PlantType | null;
  onPlantSelect: (plant: PlantType | null) => void;
}

const PlantCard = memo(({ plant, isSelected, onSelect }: {
  plant: PlantType;
  isSelected: boolean;
  onSelect: (plant: PlantType) => void;
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
        "group relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer",
        "bg-white/70 dark:bg-gray-900/70 border-white/20 dark:border-gray-800/20",
        "hover:bg-white/90 dark:hover:bg-gray-800/90 hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/10",
        isSelected && "bg-gradient-to-br from-green-50/90 to-emerald-50/90 dark:from-green-950/90 dark:to-emerald-950/90",
        isSelected && "ring-2 ring-green-400/60 dark:ring-green-600/60 shadow-2xl shadow-green-500/20 scale-[1.02]"
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
              backgroundColor: `${plant.color}15`,
              boxShadow: `0 8px 32px ${plant.color}20`,
              border: `1px solid ${plant.color}20`
            }}
          >
            {plant.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                {plant.name}
              </h3>
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-1 h-auto rounded-full bg-green-100/80 dark:bg-green-900/50 border-green-200/60 dark:border-green-800/60 backdrop-blur-sm"
              >
                {PLANT_CATEGORIES.find(cat => cat.id === plant.category)?.name || plant.category}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-2">
              {plant.description}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-500">
                Espaçamento: {plant.spacing}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Selection glow effect */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-emerald-400/10 rounded-2xl pointer-events-none" />
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

export const PlantLibrary = memo(({ selectedPlant, onPlantSelect }: PlantLibraryProps) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { searchTerm, setSearchTerm, searchResults } = useEnhancedSearch(PLANTS_DATA, {
    searchFields: ['name', 'description'],
    debounceMs: 200
  });

  const filteredPlants = useMemo(() => {
    let plants = searchTerm ? searchResults : PLANTS_DATA;
    
    if (selectedCategory !== "all") {
      plants = plants.filter(plant => plant.category === selectedCategory);
    }
    
    return plants;
  }, [searchTerm, searchResults, selectedCategory]);

  const handlePlantSelect = useCallback((plant: PlantType) => {
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
    <div className="flex flex-col h-full bg-gradient-to-br from-green-50/50 via-white/50 to-emerald-50/50 dark:from-gray-900/50 dark:via-gray-900/50 dark:to-gray-800/50">
      {/* Header with Glass Morphism */}
      <div className="sticky top-0 z-20 p-4 border-b border-white/20 dark:border-gray-700/20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-400">
              Biblioteca de Plantas
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{PLANTS_DATA.length} plantas</span>
          </div>
        </div>
        
        {/* Search with Glass Morphism */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar plantas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 text-sm rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/20 dark:border-gray-700/20 focus:border-green-400/60 dark:focus:border-green-600/60 focus:ring-2 focus:ring-green-200/50 dark:focus:ring-green-800/50 transition-all duration-200"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {memoizedCategories}
        </div>
      </div>

      {/* Virtualized Plants List */}
      <div className="flex-1 overflow-hidden">
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              rowCount={filteredPlants.length}
              rowHeight={80} // Adjust based on card height
              rowRenderer={({ index, key, style }) => {
                const plant = filteredPlants[index];
                return (
                  <div key={key} style={style} className="px-4">
                    <PlantCard
                      plant={plant}
                      isSelected={selectedPlant?.id === plant.id}
                      onSelect={handlePlantSelect}
                    />
                  </div>
                );
              }}
              noRowsRenderer={() => (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-100/80 to-emerald-100/80 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
                    <Leaf className="w-12 h-12 text-green-500 dark:text-green-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nenhuma planta encontrada
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tente ajustar os filtros ou buscar por outro termo
                  </p>
                </div>
              )}
            />
          )}
        </AutoSizer>
      </div>

      {/* Selected Plant Info with Glass Morphism */}
      {selectedPlant && (
        <div className="p-4 border-t border-white/20 dark:border-gray-700/20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-r from-green-50/60 to-emerald-50/60 dark:from-green-950/60 dark:to-emerald-950/60 border border-white/20 dark:border-gray-700/20">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg shadow-lg"
              style={{ 
                backgroundColor: `${selectedPlant.color}15`,
                boxShadow: `0 4px 16px ${selectedPlant.color}20`,
                border: `1px solid ${selectedPlant.color}20`
              }}
            >
              {selectedPlant.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {selectedPlant.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {selectedPlant.description}
              </p>
              <p className="text-xs font-medium text-green-600 dark:text-green-400">
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