
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plant {
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

interface PlantLibraryProps {
  selectedPlant: Plant | null;
  onPlantSelect: (plant: Plant) => void;
}

export const PlantLibrary = ({ selectedPlant, onPlantSelect }: PlantLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const plants: Plant[] = [
    // Frutíferas
    { id: "1", name: "Laranjeira", category: "frutifera", icon: "🍊", spacing: "4x4m", season: "Ano todo", difficulty: "medium", waterNeeds: "medium" },
    { id: "2", name: "Mangueira", category: "frutifera", icon: "🥭", spacing: "8x8m", season: "Verão", difficulty: "easy", waterNeeds: "low" },
    { id: "3", name: "Goiabeira", category: "frutifera", icon: "🟢", spacing: "5x5m", season: "Verão/Outono", difficulty: "easy", waterNeeds: "medium" },
    { id: "4", name: "Açaizeiro", category: "frutifera", icon: "🫐", spacing: "3x3m", season: "Inverno", difficulty: "hard", waterNeeds: "high" },
    { id: "5", name: "Limoeiro", category: "frutifera", icon: "🍋", spacing: "3x3m", season: "Ano todo", difficulty: "easy", waterNeeds: "medium" },
    
    // Hortaliças
    { id: "6", name: "Alface", category: "hortalica", icon: "🥬", spacing: "30x30cm", season: "Outono/Inverno", difficulty: "easy", waterNeeds: "high" },
    { id: "7", name: "Tomate", category: "hortalica", icon: "🍅", spacing: "50x50cm", season: "Primavera/Verão", difficulty: "medium", waterNeeds: "high" },
    { id: "8", name: "Couve", category: "hortalica", icon: "🥬", spacing: "40x40cm", season: "Ano todo", difficulty: "easy", waterNeeds: "medium" },
    { id: "9", name: "Pimentão", category: "hortalica", icon: "🫑", spacing: "50x50cm", season: "Primavera/Verão", difficulty: "medium", waterNeeds: "high" },
    { id: "10", name: "Cenoura", category: "hortalica", icon: "🥕", spacing: "15x15cm", season: "Outono/Inverno", difficulty: "medium", waterNeeds: "medium" },
    
    // Medicinais
    { id: "11", name: "Capim-santo", category: "medicinal", icon: "🌿", spacing: "1x1m", season: "Ano todo", difficulty: "easy", waterNeeds: "low" },
    { id: "12", name: "Erva-cidreira", category: "medicinal", icon: "🌿", spacing: "50x50cm", season: "Ano todo", difficulty: "easy", waterNeeds: "medium" },
    { id: "13", name: "Boldo", category: "medicinal", icon: "🍃", spacing: "1.5x1.5m", season: "Ano todo", difficulty: "easy", waterNeeds: "low" },
    { id: "14", name: "Hortelã", category: "medicinal", icon: "🌿", spacing: "30x30cm", season: "Ano todo", difficulty: "easy", waterNeeds: "high" },
    
    // Grãos
    { id: "15", name: "Feijão", category: "grao", icon: "🫘", spacing: "10x40cm", season: "Outono/Inverno", difficulty: "easy", waterNeeds: "medium" },
    { id: "16", name: "Milho", category: "grao", icon: "🌽", spacing: "80x30cm", season: "Primavera/Verão", difficulty: "easy", waterNeeds: "medium" },
    { id: "17", name: "Quinoa", category: "grao", icon: "🌾", spacing: "30x30cm", season: "Outono", difficulty: "hard", waterNeeds: "low" },
    
    // Raízes
    { id: "18", name: "Mandioca", category: "raiz", icon: "🥔", spacing: "1x1m", season: "Primavera", difficulty: "easy", waterNeeds: "low" },
    { id: "19", name: "Batata-doce", category: "raiz", icon: "🍠", spacing: "40x30cm", season: "Primavera/Verão", difficulty: "easy", waterNeeds: "medium" },
    { id: "20", name: "Inhame", category: "raiz", icon: "🟤", spacing: "50x50cm", season: "Primavera/Verão", difficulty: "medium", waterNeeds: "medium" },
  ];

  const categories = [
    { id: "all", name: "Todas", icon: "🌱" },
    { id: "favorites", name: "Favoritas", icon: "⭐" },
    { id: "frutifera", name: "Frutíferas", icon: "🍎" },
    { id: "hortalica", name: "Hortaliças", icon: "🥬" },
    { id: "medicinal", name: "Medicinais", icon: "🌿" },
    { id: "grao", name: "Grãos", icon: "🌾" },
    { id: "raiz", name: "Raízes", icon: "🥕" },
  ];

  const filteredPlants = useMemo(() => {
    return plants.filter(plant => 
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getPlantsByCategory = (categoryId: string) => {
    if (categoryId === "all") return filteredPlants;
    if (categoryId === "favorites") return filteredPlants.filter(plant => favorites.includes(plant.id));
    return filteredPlants.filter(plant => plant.category === categoryId);
  };

  const toggleFavorite = (plantId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(plantId) 
        ? prev.filter(id => id !== plantId)
        : [...prev, plantId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWaterColor = (waterNeeds: string) => {
    switch (waterNeeds) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-blue-200 text-blue-800';
      case 'high': return 'bg-blue-300 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-3">Biblioteca de Plantas</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar plantas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Plant Categories */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <TabsList className="grid grid-cols-4 gap-1 p-2 m-2 h-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="text-xs p-2 data-[state=active]:nature-gradient data-[state=active]:text-white flex flex-col gap-1"
              >
                <span className="text-sm">{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0 p-2">
                <div className="grid gap-2">
                  {getPlantsByCategory(category.id).map((plant) => (
                    <div
                      key={plant.id}
                      onClick={() => onPlantSelect(plant)}
                      className={cn(
                        "p-3 rounded-lg border border-border cursor-pointer transition-all hover:shadow-md hover:border-accent",
                        selectedPlant?.id === plant.id && "border-accent bg-accent/10 shadow-md"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">{plant.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm truncate">{plant.name}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-auto w-auto"
                              onClick={(e) => toggleFavorite(plant.id, e)}
                            >
                              <Star 
                                className={cn(
                                  "w-3 h-3",
                                  favorites.includes(plant.id) 
                                    ? "fill-yellow-400 text-yellow-400" 
                                    : "text-gray-400"
                                )}
                              />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{plant.spacing}</p>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {plant.season}
                            </Badge>
                            <Badge className={cn("text-xs", getDifficultyColor(plant.difficulty))}>
                              {plant.difficulty === 'easy' ? 'Fácil' : 
                               plant.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                            </Badge>
                            <Badge className={cn("text-xs", getWaterColor(plant.waterNeeds))}>
                              💧 {plant.waterNeeds === 'low' ? 'Baixa' : 
                                   plant.waterNeeds === 'medium' ? 'Média' : 'Alta'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {getPlantsByCategory(category.id).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">
                        {category.id === 'favorites' 
                          ? 'Nenhuma planta favoritada ainda'
                          : 'Nenhuma planta encontrada'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>

      {/* Add Custom Plant */}
      <div className="p-3 border-t border-border">
        <Button variant="outline" className="w-full gap-2" size="sm">
          <Plus className="w-4 h-4" />
          Adicionar Planta Personalizada
        </Button>
      </div>
    </div>
  );
};
