
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const [customPlants, setCustomPlants] = useState<Plant[]>([]);
  const [newPlant, setNewPlant] = useState({
    name: "",
    category: "",
    icon: "",
    spacing: "",
    season: "",
    difficulty: "easy" as const,
    waterNeeds: "medium" as const
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const basePlants: Plant[] = [
    // Frutíferas
    { id: "1", name: "Laranjeira", category: "frutifera", icon: "🍊", spacing: "4x4m", season: "Ano todo", difficulty: "medium", waterNeeds: "medium" },
    { id: "2", name: "Mangueira", category: "frutifera", icon: "🥭", spacing: "8x8m", season: "Verão", difficulty: "easy", waterNeeds: "low" },
    { id: "3", name: "Goiabeira", category: "frutifera", icon: "🟢", spacing: "5x5m", season: "Verão/Outono", difficulty: "easy", waterNeeds: "medium" },
    { id: "4", name: "Açaizeiro", category: "frutifera", icon: "🫐", spacing: "3x3m", season: "Inverno", difficulty: "hard", waterNeeds: "high" },
    { id: "5", name: "Limoeiro", category: "frutifera", icon: "🍋", spacing: "3x3m", season: "Ano todo", difficulty: "easy", waterNeeds: "medium" },
    { id: "6", name: "Bananeira", category: "frutifera", icon: "🍌", spacing: "3x3m", season: "Ano todo", difficulty: "easy", waterNeeds: "high" },
    { id: "40", name: "Abacateiro", category: "frutifera", icon: "🥑", spacing: "6x6m", season: "Outono", difficulty: "medium", waterNeeds: "medium" },
    { id: "41", name: "Coqueiro", category: "frutifera", icon: "🥥", spacing: "8x8m", season: "Ano todo", difficulty: "medium", waterNeeds: "low" },
    
    // Hortaliças
    { id: "7", name: "Alface", category: "hortalica", icon: "🥬", spacing: "30x30cm", season: "Outono/Inverno", difficulty: "easy", waterNeeds: "high" },
    { id: "8", name: "Tomate", category: "hortalica", icon: "🍅", spacing: "50x50cm", season: "Primavera/Verão", difficulty: "medium", waterNeeds: "high" },
    { id: "9", name: "Couve", category: "hortalica", icon: "🥬", spacing: "40x40cm", season: "Ano todo", difficulty: "easy", waterNeeds: "medium" },
    { id: "10", name: "Pimentão", category: "hortalica", icon: "🫑", spacing: "50x50cm", season: "Primavera/Verão", difficulty: "medium", waterNeeds: "high" },
    { id: "11", name: "Cenoura", category: "hortalica", icon: "🥕", spacing: "15x15cm", season: "Outono/Inverno", difficulty: "medium", waterNeeds: "medium" },
    { id: "12", name: "Rúcula", category: "hortalica", icon: "🌿", spacing: "20x20cm", season: "Outono/Inverno", difficulty: "easy", waterNeeds: "medium" },
    { id: "42", name: "Brócolis", category: "hortalica", icon: "🥦", spacing: "40x40cm", season: "Outono/Inverno", difficulty: "medium", waterNeeds: "high" },
    { id: "43", name: "Abobrinha", category: "hortalica", icon: "🥒", spacing: "1x1m", season: "Primavera/Verão", difficulty: "easy", waterNeeds: "medium" },
    
    // Medicinais
    { id: "13", name: "Capim-santo", category: "medicinal", icon: "🌿", spacing: "1x1m", season: "Ano todo", difficulty: "easy", waterNeeds: "low" },
    { id: "14", name: "Erva-cidreira", category: "medicinal", icon: "🌿", spacing: "50x50cm", season: "Ano todo", difficulty: "easy", waterNeeds: "medium" },
    { id: "15", name: "Boldo", category: "medicinal", icon: "🍃", spacing: "1.5x1.5m", season: "Ano todo", difficulty: "easy", waterNeeds: "low" },
    { id: "16", name: "Hortelã", category: "medicinal", icon: "🌿", spacing: "30x30cm", season: "Ano todo", difficulty: "easy", waterNeeds: "high" },
    { id: "17", name: "Alecrim", category: "medicinal", icon: "🌿", spacing: "60x60cm", season: "Ano todo", difficulty: "easy", waterNeeds: "low" },
    { id: "44", name: "Manjericão", category: "medicinal", icon: "🌿", spacing: "25x25cm", season: "Primavera/Verão", difficulty: "easy", waterNeeds: "medium" },
    
    // Grãos
    { id: "18", name: "Feijão", category: "grao", icon: "🫘", spacing: "10x40cm", season: "Outono/Inverno", difficulty: "easy", waterNeeds: "medium" },
    { id: "19", name: "Milho", category: "grao", icon: "🌽", spacing: "80x30cm", season: "Primavera/Verão", difficulty: "easy", waterNeeds: "medium" },
    { id: "20", name: "Quinoa", category: "grao", icon: "🌾", spacing: "30x30cm", season: "Outono", difficulty: "hard", waterNeeds: "low" },
    { id: "45", name: "Arroz", category: "grao", icon: "🌾", spacing: "20x20cm", season: "Verão", difficulty: "medium", waterNeeds: "high" },
    
    // Raízes
    { id: "21", name: "Mandioca", category: "raiz", icon: "🥔", spacing: "1x1m", season: "Primavera", difficulty: "easy", waterNeeds: "low" },
    { id: "22", name: "Batata-doce", category: "raiz", icon: "🍠", spacing: "40x30cm", season: "Primavera/Verão", difficulty: "easy", waterNeeds: "medium" },
    { id: "23", name: "Inhame", category: "raiz", icon: "🟤", spacing: "50x50cm", season: "Primavera/Verão", difficulty: "medium", waterNeeds: "medium" },
    { id: "46", name: "Batata", category: "raiz", icon: "🥔", spacing: "30x30cm", season: "Outono/Inverno", difficulty: "easy", waterNeeds: "medium" },
  ];

  const plants = [...basePlants, ...customPlants];

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
  }, [searchTerm, plants]);

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

  const handleDragStart = (e: React.DragEvent, plant: Plant) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(plant));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleAddCustomPlant = () => {
    if (!newPlant.name || !newPlant.category || !newPlant.icon || !newPlant.spacing || !newPlant.season) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const customPlant: Plant = {
      id: `custom-${Date.now()}`,
      ...newPlant
    };

    setCustomPlants(prev => [...prev, customPlant]);
    setNewPlant({
      name: "",
      category: "",
      icon: "",
      spacing: "",
      season: "",
      difficulty: "easy",
      waterNeeds: "medium"
    });
    setShowAddDialog(false);
    toast.success(`${newPlant.name} adicionada à biblioteca!`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getWaterColor = (waterNeeds: string) => {
    switch (waterNeeds) {
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'medium': return 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
      case 'high': return 'bg-blue-300 text-blue-800 dark:bg-blue-700 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border flex-shrink-0">
        <h2 className="text-base font-semibold mb-2">Biblioteca de Plantas</h2>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            placeholder="Buscar plantas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 text-xs h-8"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          💡 Arraste e solte plantas no canvas
        </p>
      </div>

      {/* Plant Categories */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <TabsList className="grid grid-cols-4 gap-1 p-2 m-2 h-auto flex-shrink-0">
            {categories.map((category) => (
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
                  {getPlantsByCategory(category.id).map((plant) => (
                    <div
                      key={plant.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, plant)}
                      onClick={() => onPlantSelect(plant)}
                      className={cn(
                        "p-2 rounded-lg border border-border cursor-pointer transition-all hover:shadow-md hover:border-accent hover:scale-[1.02] select-none",
                        selectedPlant?.id === plant.id && "border-accent bg-accent/10 shadow-md"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <div className="text-lg flex-shrink-0 w-8 h-8 rounded flex items-center justify-center">
                          {plant.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-xs truncate">{plant.name}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0.5 h-auto w-auto"
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
                          <p className="text-xs text-muted-foreground mb-1">{plant.spacing}</p>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              {plant.season}
                            </Badge>
                            <Badge className={cn("text-xs px-1 py-0", getDifficultyColor(plant.difficulty))}>
                              {plant.difficulty === 'easy' ? 'Fácil' : 
                               plant.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                            </Badge>
                            <Badge className={cn("text-xs px-1 py-0", getWaterColor(plant.waterNeeds))}>
                              💧{plant.waterNeeds === 'low' ? 'Baixa' : 
                                  plant.waterNeeds === 'medium' ? 'Média' : 'Alta'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {getPlantsByCategory(category.id).length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      <p className="text-xs">
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
      <div className="p-2 border-t border-border flex-shrink-0">
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full gap-1 text-xs h-8" size="sm">
              <Plus className="w-3 h-3" />
              Adicionar Planta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base">Adicionar Nova Planta</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="name" className="text-xs">Nome *</Label>
                <Input
                  id="name"
                  value={newPlant.name}
                  onChange={(e) => setNewPlant(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Manjericão roxo"
                  className="text-xs h-8"
                />
              </div>
              <div>
                <Label htmlFor="icon" className="text-xs">Emoji *</Label>
                <Input
                  id="icon"
                  value={newPlant.icon}
                  onChange={(e) => setNewPlant(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="🌿"
                  className="text-xs h-8"
                  maxLength={2}
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-xs">Categoria *</Label>
                <Select value={newPlant.category} onValueChange={(value) => setNewPlant(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="text-xs h-8">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frutifera">Frutífera</SelectItem>
                    <SelectItem value="hortalica">Hortaliça</SelectItem>
                    <SelectItem value="medicinal">Medicinal</SelectItem>
                    <SelectItem value="grao">Grão</SelectItem>
                    <SelectItem value="raiz">Raiz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="spacing" className="text-xs">Espaçamento *</Label>
                  <Input
                    id="spacing"
                    value={newPlant.spacing}
                    onChange={(e) => setNewPlant(prev => ({ ...prev, spacing: e.target.value }))}
                    placeholder="50x50cm"
                    className="text-xs h-8"
                  />
                </div>
                <div>
                  <Label htmlFor="season" className="text-xs">Época *</Label>
                  <Input
                    id="season"
                    value={newPlant.season}
                    onChange={(e) => setNewPlant(prev => ({ ...prev, season: e.target.value }))}
                    placeholder="Ano todo"
                    className="text-xs h-8"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Dificuldade</Label>
                  <Select value={newPlant.difficulty} onValueChange={(value: any) => setNewPlant(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger className="text-xs h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Fácil</SelectItem>
                      <SelectItem value="medium">Médio</SelectItem>
                      <SelectItem value="hard">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Água</Label>
                  <Select value={newPlant.waterNeeds} onValueChange={(value: any) => setNewPlant(prev => ({ ...prev, waterNeeds: value }))}>
                    <SelectTrigger className="text-xs h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddCustomPlant} className="text-xs h-8">
                Adicionar Planta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
