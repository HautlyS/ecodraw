
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Star, Square, Circle, Paintbrush, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerrainElement {
  id: string;
  name: string;
  category: string;
  icon: string;
  size: string;
  description: string;
  color: string;
  texture: string;
  brushType: 'rectangle' | 'circle' | 'path';
  selectedBrushMode?: 'rectangle' | 'circle' | 'brush';
  brushThickness?: number;
}

interface TerrainLibraryProps {
  selectedTerrain: TerrainElement | null;
  onTerrainSelect: (terrain: TerrainElement) => void;
}

export const TerrainLibrary = ({ selectedTerrain, onTerrainSelect }: TerrainLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [brushMode, setBrushMode] = useState<'rectangle' | 'circle' | 'brush'>('rectangle');
  const [brushThickness, setBrushThickness] = useState(20);
  const [showSettings, setShowSettings] = useState(false);
  
  const terrainElements: TerrainElement[] = [
    // Solos - painted as large areas
    { id: "1", name: "Terra Argilosa", category: "solo", icon: "🟤", size: "Variável", description: "Solo rico em argila, retém água", color: "#8B4513", texture: "clay", brushType: "rectangle" },
    { id: "2", name: "Terra Arenosa", category: "solo", icon: "🟡", size: "Variável", description: "Solo bem drenado", color: "#F4A460", texture: "sand", brushType: "rectangle" },
    { id: "3", name: "Terra Humífera", category: "solo", icon: "🟫", size: "Variável", description: "Solo rico em matéria orgânica", color: "#654321", texture: "humus", brushType: "rectangle" },
    { id: "4", name: "Solo Calcário", category: "solo", icon: "⚪", size: "Variável", description: "Solo alcalino", color: "#E5E5DC", texture: "limestone", brushType: "rectangle" },
    { id: "30", name: "Terra Preta", category: "solo", icon: "⚫", size: "Variável", description: "Solo muito fértil", color: "#2F2F2F", texture: "fertile", brushType: "rectangle" },
    { id: "31", name: "Solo Pedregoso", category: "solo", icon: "🔘", size: "Variável", description: "Solo com muitas pedras", color: "#808080", texture: "rocky", brushType: "rectangle" },
    
    // Água - painted as irregular shapes
    { id: "5", name: "Nascente", category: "agua", icon: "💧", size: "2x2m", description: "Fonte natural de água", color: "#87CEEB", texture: "spring", brushType: "circle" },
    { id: "6", name: "Poço Artesiano", category: "agua", icon: "🕳️", size: "1x1m", description: "Poço perfurado", color: "#4682B4", texture: "well", brushType: "circle" },
    { id: "7", name: "Açude", category: "agua", icon: "🏞️", size: "10x10m", description: "Reservatório de água", color: "#0000CD", texture: "water", brushType: "rectangle" },
    { id: "8", name: "Riacho", category: "agua", icon: "〰️", size: "Variável", description: "Curso d'água natural", color: "#20B2AA", texture: "stream", brushType: "path" },
    { id: "9", name: "Cisterna", category: "agua", icon: "⭕", size: "3x3m", description: "Reservatório de água da chuva", color: "#1E90FF", texture: "water", brushType: "circle" },
    { id: "32", name: "Lagoa", category: "agua", icon: "🔵", size: "8x8m", description: "Corpo d'água natural", color: "#006994", texture: "water", brushType: "circle" },
    { id: "33", name: "Tanque", category: "agua", icon: "🔷", size: "4x4m", description: "Reservatório artificial", color: "#4169E1", texture: "water", brushType: "rectangle" },
    
    // Estruturas - painted as defined shapes
    { id: "10", name: "Viveiro de Mudas", category: "estrutura", icon: "🏠", size: "5x3m", description: "Estufa para mudas", color: "#90EE90", texture: "building", brushType: "rectangle" },
    { id: "11", name: "Composteira", category: "estrutura", icon: "♻️", size: "2x2m", description: "Local para compostagem", color: "#8FBC8F", texture: "compost", brushType: "rectangle" },
    { id: "12", name: "Galinheiro", category: "estrutura", icon: "🏘️", size: "4x4m", description: "Abrigo para aves", color: "#D2B48C", texture: "building", brushType: "rectangle" },
    { id: "13", name: "Cerca Viva", category: "estrutura", icon: "🌿", size: "Variável", description: "Cerca natural", color: "#228B22", texture: "hedge", brushType: "path" },
    { id: "14", name: "Porteira", category: "estrutura", icon: "🚪", size: "3x1m", description: "Entrada da propriedade", color: "#8B4513", texture: "gate", brushType: "rectangle" },
    { id: "34", name: "Galpão", category: "estrutura", icon: "🏢", size: "10x8m", description: "Edificação para armazenamento", color: "#A0522D", texture: "building", brushType: "rectangle" },
    { id: "35", name: "Casa", category: "estrutura", icon: "🏡", size: "8x8m", description: "Residência", color: "#CD853F", texture: "house", brushType: "rectangle" },
    { id: "36", name: "Curral", category: "estrutura", icon: "🏗️", size: "6x6m", description: "Área para gado", color: "#BC8F8F", texture: "corral", brushType: "rectangle" },
    
    // Área Cercada
    { id: "15", name: "Área Cercada", category: "cerca", icon: "⬜", size: "Variável", description: "Delimitação com cerca", color: "#696969", texture: "fence", brushType: "rectangle" },
    { id: "16", name: "Pasto", category: "cerca", icon: "🟩", size: "Variável", description: "Área para pastagem", color: "#32CD32", texture: "grass", brushType: "rectangle" },
    { id: "17", name: "Horta Suspensa", category: "cerca", icon: "📦", size: "2x1m", description: "Canteiro elevado", color: "#8FBC8F", texture: "garden", brushType: "rectangle" },
    { id: "37", name: "Quintal", category: "cerca", icon: "🏠", size: "Variável", description: "Área residencial cercada", color: "#9ACD32", texture: "yard", brushType: "rectangle" },
    
    // Pedras e Rochas
    { id: "18", name: "Rocha Grande", category: "rocha", icon: "🪨", size: "2x2m", description: "Formação rochosa", color: "#708090", texture: "rock", brushType: "circle" },
    { id: "19", name: "Pedregulho", category: "rocha", icon: "🗿", size: "1x1m", description: "Pedra média", color: "#2F4F4F", texture: "stone", brushType: "circle" },
    { id: "20", name: "Cascalho", category: "rocha", icon: "⚫", size: "Variável", description: "Área com pedras pequenas", color: "#A9A9A9", texture: "gravel", brushType: "rectangle" },
    { id: "38", name: "Paredão", category: "rocha", icon: "🧱", size: "Variável", description: "Formação rochosa vertical", color: "#696969", texture: "wall", brushType: "rectangle" },
    
    // Caminhos - painted as paths
    { id: "21", name: "Estrada de Terra", category: "caminho", icon: "🛤️", size: "Variável", description: "Via não pavimentada", color: "#DEB887", texture: "dirt_road", brushType: "path" },
    { id: "22", name: "Trilha", category: "caminho", icon: "👣", size: "Variável", description: "Caminho estreito", color: "#D2B48C", texture: "trail", brushType: "path" },
    { id: "23", name: "Ponte", category: "caminho", icon: "🌉", size: "4x1m", description: "Passagem sobre água", color: "#8B4513", texture: "bridge", brushType: "rectangle" },
    
    // Energia
    { id: "24", name: "Painel Solar", category: "energia", icon: "☀️", size: "2x2m", description: "Energia solar", color: "#FFD700", texture: "solar", brushType: "rectangle" },
    { id: "25", name: "Poste de Luz", category: "energia", icon: "💡", size: "1x1m", description: "Iluminação", color: "#FFFF00", texture: "pole", brushType: "circle" },
    { id: "26", name: "Gerador Eólico", category: "energia", icon: "💨", size: "3x3m", description: "Energia eólica", color: "#87CEEB", texture: "wind", brushType: "circle" },
    
    // Áreas Especiais
    { id: "27", name: "Área de Descanso", category: "especial", icon: "🪑", size: "3x3m", description: "Local para relaxar", color: "#DDA0DD", texture: "leisure", brushType: "circle" },
    { id: "28", name: "Fogueira", category: "especial", icon: "🔥", size: "2x2m", description: "Local para fogo", color: "#FF4500", texture: "fire", brushType: "circle" },
    { id: "29", name: "Mirante", category: "especial", icon: "👁️", size: "2x2m", description: "Ponto de observação", color: "#20B2AA", texture: "viewpoint", brushType: "circle" },
  ];

  const categories = [
    { id: "all", name: "Todos", icon: "🌍" },
    { id: "favorites", name: "Favoritos", icon: "⭐" },
    { id: "solo", name: "Solos", icon: "🟤" },
    { id: "agua", name: "Água", icon: "💧" },
    { id: "estrutura", name: "Estruturas", icon: "🏠" },
    { id: "cerca", name: "Cercas", icon: "⬜" },
    { id: "rocha", name: "Rochas", icon: "🪨" },
    { id: "caminho", name: "Caminhos", icon: "🛤️" },
    { id: "energia", name: "Energia", icon: "⚡" },
    { id: "especial", name: "Especiais", icon: "✨" },
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

  const handleTerrainSelect = (element: TerrainElement) => {
    const enhancedElement = {
      ...element,
      selectedBrushMode: brushMode,
      brushThickness: brushThickness
    };
    onTerrainSelect(enhancedElement);
  };

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border flex-shrink-0">
        <h2 className="text-base font-semibold mb-2">Elementos do Terreno</h2>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            placeholder="Buscar elementos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 text-xs h-8"
          />
        </div>
      </div>

      {/* Brush Mode Selector */}
      <div className="p-3 border-b border-border flex-shrink-0 bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Modo de Pintura</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowSettings(!showSettings)}
            className="h-6 w-6 p-0"
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-1 p-1 bg-background rounded-lg border">
          <Button
            variant={brushMode === 'rectangle' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBrushMode('rectangle')}
            className="flex items-center gap-1 text-xs h-8"
          >
            <Square className="w-3 h-3" />
            <span className="hidden sm:inline">Retângulo</span>
          </Button>
          <Button
            variant={brushMode === 'circle' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBrushMode('circle')}
            className="flex items-center gap-1 text-xs h-8"
          >
            <Circle className="w-3 h-3" />
            <span className="hidden sm:inline">Círculo</span>
          </Button>
          <Button
            variant={brushMode === 'brush' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBrushMode('brush')}
            className="flex items-center gap-1 text-xs h-8"
          >
            <Paintbrush className="w-3 h-3" />
            <span className="hidden sm:inline">Pincel</span>
          </Button>
        </div>
        
        {/* Brush Settings */}
        {showSettings && (
          <Card className="mt-2">
            <CardHeader className="p-2">
              <CardTitle className="text-xs">Configurações do Pincel</CardTitle>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Espessura: {brushThickness}px
                  </label>
                  <Slider
                    value={[brushThickness]}
                    onValueChange={(value) => setBrushThickness(value[0])}
                    min={5}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Modo atual:</span>
                  <Badge variant="secondary" className="text-xs">
                    {brushMode === 'rectangle' ? 'Retângulo' : 
                     brushMode === 'circle' ? 'Círculo' : 'Pincel Livre'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <TabsList className="grid grid-cols-5 gap-1 p-2 m-2 h-auto flex-shrink-0">
            {categories.slice(0, 10).map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="text-xs p-1 data-[state=active]:nature-gradient data-[state=active]:text-white flex flex-col gap-0.5 min-h-[44px]"
              >
                <span className="text-sm">{category.icon}</span>
                <span className="text-xs leading-tight">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 overflow-y-auto px-2">
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid gap-2">
                  {getElementsByCategory(category.id).map((element) => (
                    <div
                      key={element.id}
                      onClick={() => handleTerrainSelect(element)}
                      className={cn(
                        "p-2 rounded-lg border border-border cursor-pointer transition-all hover:shadow-md hover:border-accent hover:scale-[1.02]",
                        selectedTerrain?.id === element.id && "border-accent bg-accent/10 shadow-md ring-1 ring-accent/20"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <div 
                          className="text-lg flex-shrink-0 w-8 h-8 rounded flex items-center justify-center border-2 transition-all hover:scale-110"
                          style={{ 
                            backgroundColor: element.color + '30', 
                            borderColor: element.color,
                            boxShadow: `0 0 8px ${element.color}40`
                          }}
                        >
                          {element.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-xs truncate">{element.name}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0.5 h-auto w-auto hover:scale-110 transition-transform"
                              onClick={(e) => toggleFavorite(element.id, e)}
                            >
                              <Star 
                                className={cn(
                                  "w-3 h-3 transition-colors",
                                  favorites.includes(element.id) 
                                    ? "fill-yellow-400 text-yellow-400" 
                                    : "text-gray-400 hover:text-yellow-300"
                                )}
                              />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1 line-clamp-2">{element.description}</p>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs px-1 py-0 font-medium">
                              {element.size}
                            </Badge>
                            <Badge 
                              className="text-xs text-white px-1 py-0 font-medium shadow-sm"
                              style={{ backgroundColor: element.color }}
                            >
                              {element.brushType}
                            </Badge>
                            <Badge 
                              variant="outline"
                              className="text-xs px-1 py-0"
                              style={{ borderColor: element.color, color: element.color }}
                            >
                              {element.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {getElementsByCategory(category.id).length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <p className="text-xs">
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
      <div className="p-2 border-t border-border flex-shrink-0">
        <Button variant="outline" className="w-full gap-1 text-xs h-8" size="sm">
          <Plus className="w-3 h-3" />
          Adicionar Elemento
        </Button>
      </div>
    </div>
  );
};
