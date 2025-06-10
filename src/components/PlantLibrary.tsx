
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plant {
  id: string;
  name: string;
  category: string;
  icon: string;
  spacing: string;
  season: string;
  companion?: string[];
}

interface PlantLibraryProps {
  selectedPlant: Plant | null;
  onPlantSelect: (plant: Plant) => void;
}

export const PlantLibrary = ({ selectedPlant, onPlantSelect }: PlantLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const plants: Plant[] = [
    // Frutíferas
    { id: "1", name: "Laranjeira", category: "frutifera", icon: "🍊", spacing: "4x4m", season: "Ano todo" },
    { id: "2", name: "Mangueira", category: "frutifera", icon: "🥭", spacing: "8x8m", season: "Verão" },
    { id: "3", name: "Goiabeira", category: "frutifera", icon: "🟢", spacing: "5x5m", season: "Verão/Outono" },
    { id: "4", name: "Açaizeiro", category: "frutifera", icon: "🫐", spacing: "3x3m", season: "Inverno" },
    
    // Hortaliças
    { id: "5", name: "Alface", category: "hortalica", icon: "🥬", spacing: "30x30cm", season: "Outono/Inverno" },
    { id: "6", name: "Tomate", category: "hortalica", icon: "🍅", spacing: "50x50cm", season: "Primavera/Verão" },
    { id: "7", name: "Couve", category: "hortalica", icon: "🥬", spacing: "40x40cm", season: "Ano todo" },
    { id: "8", name: "Pimentão", category: "hortalica", icon: "🫑", spacing: "50x50cm", season: "Primavera/Verão" },
    
    // Medicinais
    { id: "9", name: "Capim-santo", category: "medicinal", icon: "🌿", spacing: "1x1m", season: "Ano todo" },
    { id: "10", name: "Erva-cidreira", category: "medicinal", icon: "🌿", spacing: "50x50cm", season: "Ano todo" },
    { id: "11", name: "Boldo", category: "medicinal", icon: "🍃", spacing: "1.5x1.5m", season: "Ano todo" },
    
    // Grãos
    { id: "12", name: "Feijão", category: "grao", icon: "🫘", spacing: "10x40cm", season: "Outono/Inverno" },
    { id: "13", name: "Milho", category: "grao", icon: "🌽", spacing: "80x30cm", season: "Primavera/Verão" },
    { id: "14", name: "Quinoa", category: "grao", icon: "🌾", spacing: "30x30cm", season: "Outono" },
    
    // Raízes
    { id: "15", name: "Mandioca", category: "raiz", icon: "🥔", spacing: "1x1m", season: "Primavera" },
    { id: "16", name: "Batata-doce", category: "raiz", icon: "🍠", spacing: "40x30cm", season: "Primavera/Verão" },
  ];

  const categories = [
    { id: "all", name: "Todas", icon: "🌱" },
    { id: "frutifera", name: "Frutíferas", icon: "🍎" },
    { id: "hortalica", name: "Hortaliças", icon: "🥬" },
    { id: "medicinal", name: "Medicinais", icon: "🌿" },
    { id: "grao", name: "Grãos", icon: "🌾" },
    { id: "raiz", name: "Raízes", icon: "🥕" },
  ];

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getPlantsByCategory = (categoryId: string) => {
    if (categoryId === "all") return filteredPlants;
    return filteredPlants.filter(plant => plant.category === categoryId);
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
          <TabsList className="grid grid-cols-3 gap-1 p-2 m-2">
            {categories.slice(0, 6).map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="text-xs p-1 data-[state=active]:nature-gradient data-[state=active]:text-white"
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
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
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{plant.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{plant.name}</h4>
                          <p className="text-xs text-muted-foreground">{plant.spacing}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {plant.season}
                        </Badge>
                      </div>
                    </div>
                  ))}
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
