
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerrainElement {
  id: string;
  name: string;
  category: string;
  icon: string;
  size: string;
  description: string;
  color: string;
}

interface TerrainLibraryProps {
  selectedTerrain: TerrainElement | null;
  onTerrainSelect: (terrain: TerrainElement) => void;
}

export const TerrainLibrary = ({ selectedTerrain, onTerrainSelect }: TerrainLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const terrainElements: TerrainElement[] = [
    // Solos
    { id: "1", name: "Terra Argilosa", category: "solo", icon: "🟤", size: "Variável", description: "Solo rico em argila, retém água", color: "#8B4513" },
    { id: "2", name: "Terra Arenosa", category: "solo", icon: "🟡", size: "Variável", description: "Solo bem drenado", color: "#F4A460" },
    { id: "3", name: "Terra Humífera", category: "solo", icon: "🟫", size: "Variável", description: "Solo rico em matéria orgânica", color: "#654321" },
    { id: "4", name: "Solo Calcário", category: "solo", icon: "⚪", size: "Variável", description: "Solo alcalino", color: "#E5E5DC" },
    
    // Água
    { id: "5", name: "Nascente", category: "agua", icon: "💧", size: "2x2m", description: "Fonte natural de água", color: "#87CEEB" },
    { id: "6", name: "Poço Artesiano", category: "agua", icon: "🕳️", size: "1x1m", description: "Poço perfurado", color: "#4682B4" },
    { id: "7", name: "Açude", category: "agua", icon: "🏞️", size: "10x10m", description: "Reservatório de água", color: "#0000CD" },
    { id: "8", name: "Riacho", category: "agua", icon: "〰️", size: "Variável", description: "Curso d'água natural", color: "#20B2AA" },
    { id: "9", name: "Cisterra", category: "agua", icon: "⭕", size: "3x3m", description: "Reservatório de água da chuva", color: "#1E90FF" },
    
    // Estruturas
    { id: "10", name: "Viveiro de Mudas", category: "estrutura", icon: "🏠", size: "5x3m", description: "Estufa para mudas", color: "#90EE90" },
    { id: "11", name: "Composteira", category: "estrutura", icon: "♻️", size: "2x2m", description: "Local para compostagem", color: "#8FBC8F" },
    { id: "12", name: "Galinheiro", category: "estrutura", icon: "🏘️", size: "4x4m", description: "Abrigo para aves", color: "#D2B48C" },
    { id: "13", name: "Cerca Viva", category: "estrutura", icon: "🌿", size: "Variável", description: "Cerca natural", color: "#228B22" },
    { id: "14", name: "Porteira", category: "estrutura", icon: "🚪", size: "3x1m", description: "Entrada da propriedade", color: "#8B4513" },
    
    // Área Cercada
    { id: "15", name: "Área Cercada", category: "cerca", icon: "⬜", size: "Variável", description: "Delimitação com cerca", color: "#696969" },
    { id: "16", name: "Pasto", category: "cerca", icon: "🟩", size: "Variável", description: "Área para pastagem", color: "#32CD32" },
    { id: "17", name: "Horta Suspensa", category: "cerca", icon: "📦", size: "2x1m", description: "Canteiro elevado", color: "#8FBC8F" },
    
    // Pedras e Rochas
    { id: "18", name: "Rocha Grande", category: "rocha", icon: "🪨", size: "2x2m", description: "Formação rochosa", color: "#708090" },
    { id: "19", name: "Pedregulho", category: "rocha", icon: "🗿", size: "1x1m", description: "Pedra média", color: "#2F4F4F" },
    { id: "20", name: "Cascalho", category: "rocha", icon: "⚫", size: "Variável", description: "Área com pedras pequenas", color: "#A9A9A9" },
  ];

  const categories = [
    { id: "all", name: "Todos", icon: "🌍" },
    { id: "favorites", name: "Favoritos", icon: "⭐" },
    { id: "solo", name: "Solos", icon: "🟤" },
    { id: "agua", name: "Água", icon: "💧" },
    { id: "estrutura", name: "Estruturas", icon: "🏠" },
    { id: "cerca", name: "Cercas", icon: "⬜" },
    { id: "rocha", name: "Rochas", icon: "🪨" },
  ];

  const filteredElements = useMemo(() => {
    return terrainElements.filter(element => 
      element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getElementsByCategory = (categoryId: string) => {
    if (categoryId === "all") return filteredElements;
    if (categoryId === "favorites") return filteredElements.filter(element => favorites.includes(element.id));
    return filteredElements.filter(element => element.category === categoryId);
  };

  const toggleFavorite = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(elementId) 
        ? prev.filter(id => id !== elementId)
        : [...prev, elementId]
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-3">Elementos do Terreno</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar elementos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Categories */}
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
                  {getElementsByCategory(category.id).map((element) => (
                    <div
                      key={element.id}
                      onClick={() => onTerrainSelect(element)}
                      className={cn(
                        "p-3 rounded-lg border border-border cursor-pointer transition-all hover:shadow-md hover:border-accent",
                        selectedTerrain?.id === element.id && "border-accent bg-accent/10 shadow-md"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="text-2xl flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border-2"
                          style={{ backgroundColor: element.color + '20', borderColor: element.color }}
                        >
                          {element.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm truncate">{element.name}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-auto w-auto"
                              onClick={(e) => toggleFavorite(element.id, e)}
                            >
                              <Star 
                                className={cn(
                                  "w-3 h-3",
                                  favorites.includes(element.id) 
                                    ? "fill-yellow-400 text-yellow-400" 
                                    : "text-gray-400"
                                )}
                              />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{element.description}</p>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {element.size}
                            </Badge>
                            <Badge 
                              className="text-xs text-white"
                              style={{ backgroundColor: element.color }}
                            >
                              {element.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {getElementsByCategory(category.id).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">
                        {category.id === 'favorites' 
                          ? 'Nenhum elemento favoritado ainda'
                          : 'Nenhum elemento encontrado'
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

      {/* Add Custom Element */}
      <div className="p-3 border-t border-border">
        <Button variant="outline" className="w-full gap-2" size="sm">
          <Plus className="w-4 h-4" />
          Adicionar Elemento Personalizado
        </Button>
      </div>
    </div>
  );
};
