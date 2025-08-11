import React, { useState, useMemo, useCallback } from 'react';
import { Structure as StructureType } from '@/types/canvasTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Building, Home, Zap, Recycle, TreePine, Route, Settings, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

// Consolidated and Enhanced Structures Data
const STRUCTURES_DATA: StructureType[] = [
  // Água (Water structures)
  {
    id: 'cisterna',
    name: 'Cisterna',
    category: 'Água',
    icon: '💧',
    color: '#4A90E2',
    size: { width: 3, height: 3 },
    description: 'Cisterna para captação e armazenamento de água da chuva'
  },
  {
    id: 'caixa-dagua',
    name: 'Caixa d\'água',
    category: 'Água',
    icon: '🚰',
    color: '#5BA3F5',
    size: { width: 2, height: 2 },
    description: 'Reservatório elevado para distribuição de água'
  },
  {
    id: 'poco',
    name: 'Poço',
    category: 'Água',
    icon: '🕳️',
    color: '#2E86DE',
    size: { width: 1.5, height: 1.5 },
    description: 'Poço artesiano ou cacimba para captação de água subterrânea'
  },
  {
    id: 'lago-artificial',
    name: 'Lago artificial',
    category: 'Água',
    icon: '🏞️',
    color: '#3498DB',
    size: { width: 10, height: 8 },
    description: 'Lago artificial para irrigação e criação de peixes'
  },
  
  // Edificações (Buildings)
  {
    id: 'casa-principal',
    name: 'Casa principal',
    category: 'Edificações',
    icon: '🏠',
    color: '#8B6F47',
    size: { width: 8, height: 10 },
    description: 'Residência principal da propriedade'
  },
  {
    id: 'galpao',
    name: 'Galpão',
    category: 'Edificações',
    icon: '🏚️',
    color: '#A0826D',
    size: { width: 12, height: 8 },
    description: 'Galpão para armazenamento de equipamentos e produção'
  },
  {
    id: 'estufa',
    name: 'Estufa',
    category: 'Edificações',
    icon: '🏭',
    color: '#90EE90',
    size: { width: 6, height: 4 },
    description: 'Estufa para cultivo protegido'
  },
  {
    id: 'galinheiro',
    name: 'Galinheiro',
    category: 'Edificações',
    icon: '🐓',
    color: '#CD853F',
    size: { width: 4, height: 3 },
    description: 'Estrutura para criação de galinhas'
  },
  {
    id: 'celeiro',
    name: 'Celeiro',
    category: 'Edificações',
    icon: '🏘️',
    color: '#D2691E',
    size: { width: 6, height: 6 },
    description: 'Armazém para grãos e produtos agrícolas'
  },
  {
    id: 'barracao',
    name: 'Barracão',
    category: 'Edificações',
    icon: '🏭',
    color: '#78716c',
    size: { width: 6, height: 4 },
    description: 'Armazenamento de ferramentas e equipamentos'
  },
  
  // Energia (Energy)
  {
    id: 'painel-solar',
    name: 'Painel solar',
    category: 'Energia',
    icon: '☀️',
    color: '#FFD700',
    size: { width: 2, height: 1 },
    description: 'Painel fotovoltaico para geração de energia solar'
  },
  {
    id: 'turbina-eolica',
    name: 'Turbina eólica',
    category: 'Energia',
    icon: '💨',
    color: '#87CEEB',
    size: { width: 1, height: 8 },
    description: 'Turbina para geração de energia eólica'
  },
  {
    id: 'biodigestor',
    name: 'Biodigestor',
    category: 'Energia',
    icon: '♻️',
    color: '#228B22',
    size: { width: 3, height: 3 },
    description: 'Sistema para produção de biogás e biofertilizante'
  },
  
  // Compostagem (Composting)
  {
    id: 'composteira',
    name: 'Composteira',
    category: 'Compostagem',
    icon: '🌱',
    color: '#8B4513',
    size: { width: 2, height: 2 },
    description: 'Estrutura para compostagem de resíduos orgânicos'
  },
  {
    id: 'minhocario',
    name: 'Minhocário',
    category: 'Compostagem',
    icon: '🪱',
    color: '#654321',
    size: { width: 1.5, height: 1.5 },
    description: 'Sistema de vermicompostagem'
  },
  {
    id: 'leira-compostagem',
    name: 'Leira de compostagem',
    category: 'Compostagem',
    icon: '🏔️',
    color: '#8B7355',
    size: { width: 4, height: 1.5 },
    description: 'Leira para compostagem em grande escala'
  },
  
  // Cercas e Divisórias (Fences and Divisions)
  {
    id: 'cerca-viva',
    name: 'Cerca viva',
    category: 'Cercas',
    icon: '🌳',
    color: '#228B22',
    size: { width: 0.5, height: 2 },
    description: 'Cerca viva com plantas nativas'
  },
  {
    id: 'cerca-madeira',
    name: 'Cerca de madeira',
    category: 'Cercas',
    icon: '🪵',
    color: '#8B4513',
    size: { width: 0.3, height: 1.5 },
    description: 'Cerca tradicional de madeira'
  },
  {
    id: 'cerca-eletrica',
    name: 'Cerca Elétrica',
    category: 'Cercas',
    icon: '⚡',
    color: '#fbbf24',
    size: { width: 0.3, height: 1.5 },
    description: 'Cerca eletrificada para proteção'
  },
  {
    id: 'portao',
    name: 'Portão',
    category: 'Cercas',
    icon: '🚪',
    color: '#696969',
    size: { width: 3, height: 2 },
    description: 'Portão de entrada'
  },
  
  // Caminhos (Paths)
  {
    id: 'trilha-pedra',
    name: 'Trilha de pedra',
    category: 'Caminhos',
    icon: '🪨',
    color: '#808080',
    size: { width: 1, height: 1 },
    description: 'Caminho com pedras naturais'
  },
  {
    id: 'caminho-madeira',
    name: 'Caminho de madeira',
    category: 'Caminhos',
    icon: '🪜',
    color: '#A0522D',
    size: { width: 1, height: 1 },
    description: 'Deck ou caminho de madeira'
  },
  {
    id: 'estrada-terra',
    name: 'Estrada de terra',
    category: 'Caminhos',
    icon: '🛤️',
    color: '#D2691E',
    size: { width: 3, height: 1 },
    description: 'Estrada de terra batida'
  },
  
  // Infraestrutura (Infrastructure)
  {
    id: 'ponte',
    name: 'Ponte',
    category: 'Infraestrutura',
    icon: '🌉',
    color: '#708090',
    size: { width: 2, height: 4 },
    description: 'Ponte sobre curso d\'água'
  },
  {
    id: 'pergolado',
    name: 'Pergolado',
    category: 'Infraestrutura',
    icon: '🏛️',
    color: '#8B7D6B',
    size: { width: 4, height: 3 },
    description: 'Estrutura de sombreamento'
  },
  {
    id: 'banco-jardim',
    name: 'Banco de jardim',
    category: 'Infraestrutura',
    icon: '🪑',
    color: '#8B4513',
    size: { width: 1.5, height: 0.5 },
    description: 'Banco para área de descanso'
  },
  {
    id: 'forno-lenha',
    name: 'Forno a lenha',
    category: 'Infraestrutura',
    icon: '🔥',
    color: '#B22222',
    size: { width: 2, height: 2 },
    description: 'Forno tradicional a lenha'
  },
  
  // Irrigação (Irrigation)
  {
    id: 'aspersor',
    name: 'Aspersor',
    category: 'Irrigação',
    icon: '💦',
    color: '#4169E1',
    size: { width: 0.5, height: 0.5 },
    description: 'Aspersor para irrigação'
  },
  {
    id: 'gotejador',
    name: 'Gotejador',
    category: 'Irrigação',
    icon: '💧',
    color: '#1E90FF',
    size: { width: 0.3, height: 0.3 },
    description: 'Sistema de irrigação por gotejamento'
  },
  {
    id: 'canal-irrigacao',
    name: 'Canal de irrigação',
    category: 'Irrigação',
    icon: '〰️',
    color: '#4682B4',
    size: { width: 0.5, height: 10 },
    description: 'Canal para condução de água'
  },
  {
    id: 'valvula-irrigacao',
    name: 'Válvula de irrigação',
    category: 'Irrigação',
    icon: '🔧',
    color: '#696969',
    size: { width: 0.5, height: 0.5 },
    description: 'Válvula de controle de irrigação'
  }
];

// Enhanced categories with colors and icons
const STRUCTURE_CATEGORIES = [
  { id: 'all', name: 'Todas', icon: Building, color: 'bg-gradient-to-r from-slate-400 to-gray-500' },
  { id: 'Água', name: 'Água', icon: Droplets, color: 'bg-gradient-to-r from-blue-400 to-cyan-500' },
  { id: 'Edificações', name: 'Edificações', icon: Home, color: 'bg-gradient-to-r from-amber-400 to-orange-500' },
  { id: 'Energia', name: 'Energia', icon: Zap, color: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
  { id: 'Compostagem', name: 'Compostagem', icon: Recycle, color: 'bg-gradient-to-r from-green-400 to-emerald-500' },
  { id: 'Cercas', name: 'Cercas', icon: TreePine, color: 'bg-gradient-to-r from-green-500 to-emerald-600' },
  { id: 'Caminhos', name: 'Caminhos', icon: Route, color: 'bg-gradient-to-r from-stone-400 to-slate-500' },
  { id: 'Infraestrutura', name: 'Infraestrutura', icon: Settings, color: 'bg-gradient-to-r from-purple-400 to-pink-500' },
  { id: 'Irrigação', name: 'Irrigação', icon: Droplets, color: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
] as const;

interface StructureLibraryProps {
  selectedStructure?: StructureType | null;
  onStructureSelect: (structure: StructureType) => void;
  className?: string;
}

const StructureCard: React.FC<{
  structure: StructureType;
  isSelected: boolean;
  onClick: () => void;
}> = ({ structure, isSelected, onClick }) => {
  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(structure));
    e.dataTransfer.effectAllowed = 'copy';
  }, [structure]);

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 cursor-pointer",
        "bg-white/70 dark:bg-gray-900/70 border-white/20 dark:border-gray-800/20",
        "hover:bg-white/90 dark:hover:bg-gray-800/90 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10",
        isSelected && "bg-gradient-to-br from-blue-50/90 to-indigo-50/90 dark:from-blue-950/90 dark:to-indigo-950/90",
        isSelected && "ring-2 ring-blue-400/60 dark:ring-blue-600/60 shadow-2xl shadow-blue-500/20 scale-[1.02]"
      )}
      onClick={onClick}
      draggable
      onDragStart={handleDragStart}
    >
      {/* Glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-gray-700/10 pointer-events-none" />
      
      <CardContent className="relative p-4">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-medium text-lg shrink-0 shadow-lg transition-all duration-300 group-hover:scale-110"
            style={{ 
              backgroundColor: structure.color,
              boxShadow: `0 8px 32px ${structure.color}30`,
              border: `1px solid ${structure.color}20`
            }}
          >
            {structure.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                {structure.name}
              </h3>
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-1 h-auto rounded-full bg-blue-100/80 dark:bg-blue-900/50 border-blue-200/60 dark:border-blue-800/60 backdrop-blur-sm"
              >
                {structure.category}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
              {structure.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">
                {structure.size.width}m × {structure.size.height}m
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Selection glow effect */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-indigo-400/10 rounded-2xl pointer-events-none" />
      )}
    </Card>
  );
};

const CategoryButton = ({ category, isSelected, onSelect }: {
  category: typeof STRUCTURE_CATEGORIES[number];
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  const handleClick = useCallback(() => {
    onSelect(category.id);
  }, [category.id, onSelect]);

  const count = useMemo(() => {
    if (category.id === 'all') return STRUCTURES_DATA.length;
    return STRUCTURES_DATA.filter(s => s.category === category.id).length;
  }, [category.id]);

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
      {count > 0 && (
        <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-[10px] h-5 rounded-full bg-white/20 border-white/20">
          {count}
        </Badge>
      )}
    </Button>
  );
};

export const StructureLibrary: React.FC<StructureLibraryProps> = ({
  selectedStructure,
  onStructureSelect,
  className
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm) return STRUCTURES_DATA;
    
    const term = searchTerm.toLowerCase();
    return STRUCTURES_DATA.filter(structure => 
      structure.name.toLowerCase().includes(term) ||
      structure.description.toLowerCase().includes(term) ||
      structure.category.toLowerCase().includes(term)
    );
  }, [searchTerm]);
  
  const isSearching = searchTerm.length > 0;

  const filteredStructures = useMemo(() => {
    let filtered = searchResults;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(structure => structure.category === selectedCategory);
    }
    
    return filtered;
  }, [searchResults, selectedCategory]);

  const handleStructureClick = useCallback((structure: StructureType) => {
    onStructureSelect(structure);
  }, [onStructureSelect]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  return (
    <div className={cn("flex flex-col h-full bg-gradient-to-br from-blue-50/50 via-white/50 to-indigo-50/50 dark:from-gray-900/50 dark:via-gray-900/50 dark:to-gray-800/50", className)}>
      {/* Header with Glass Morphism */}
      <div className="sticky top-0 z-20 p-4 border-b border-white/20 dark:border-gray-700/20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
              <Building className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              Biblioteca de Estruturas
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{STRUCTURES_DATA.length} estruturas</span>
          </div>
        </div>
        
        {/* Search with Glass Morphism */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar estruturas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 text-sm rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border-white/20 dark:border-gray-700/20 focus:border-blue-400/60 dark:focus:border-blue-600/60 focus:ring-2 focus:ring-blue-200/50 dark:focus:ring-blue-800/50 transition-all duration-200"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {STRUCTURE_CATEGORIES.map(category => (
            <CategoryButton
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onSelect={handleCategoryChange}
            />
          ))}
        </div>
      </div>

      {/* Structure Grid */}
      <div className="flex-1">
        <ScrollArea className="h-full overflow-y-auto">
          <div className="p-4 space-y-3">
            {filteredStructures.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-100/80 to-indigo-100/80 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
                  <Building className="w-12 h-12 text-blue-500 dark:text-blue-400" />
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isSearching ? 'Nenhuma estrutura encontrada' : 'Nenhuma estrutura disponível'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isSearching ? 'Tente ajustar os filtros ou buscar por outro termo' : 'Adicione estruturas para começar'}
                </p>
              </div>
            ) : (
              filteredStructures.map(structure => (
                <StructureCard
                  key={structure.id}
                  structure={structure}
                  isSelected={selectedStructure?.id === structure.id}
                  onClick={() => handleStructureClick(structure)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Selected Structure Info with Glass Morphism */}
      {selectedStructure && (
        <div className="p-4 border-t border-white/20 dark:border-gray-700/20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl">
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/60 dark:to-indigo-950/60 border border-white/20 dark:border-gray-700/20">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-medium text-lg shadow-lg"
              style={{ 
                backgroundColor: selectedStructure.color,
                boxShadow: `0 4px 16px ${selectedStructure.color}30`,
                border: `1px solid ${selectedStructure.color}20`
              }}
            >
              {selectedStructure.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {selectedStructure.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {selectedStructure.description}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  Dimensões: {selectedStructure.size.width}m × {selectedStructure.size.height}m
                </span>
                <span className="text-gray-500">•</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  Categoria: {selectedStructure.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StructureLibrary;