import React, { useState, useMemo, useCallback } from 'react';
import { Structure } from '@/types/canvasTypes';
import { structures, structureCategories } from '@/data/structures';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Building, Home, Zap, Recycle, TreePine, Route, Settings, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StructureLibraryProps {
  selectedStructure?: Structure | null;
  onStructureSelect: (structure: Structure) => void;
  className?: string;
}

// Category icons mapping
const categoryIcons = {
  'Água': Droplets,
  'Edificações': Building,
  'Energia': Zap,
  'Compostagem': Recycle,
  'Cercas': TreePine,
  'Caminhos': Route,
  'Infraestrutura': Settings,
  'Irrigação': Droplets,
} as const;

const StructureCard: React.FC<{
  structure: Structure;
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
      "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border rounded-xl",
      "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm",
      isSelected 
        ? "border-blue-400 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 ring-2 ring-blue-400 dark:ring-blue-600 shadow-lg scale-[1.02]" 
        : "border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-700"
    )}
    onClick={onClick}
    draggable
    onDragStart={handleDragStart}
  >
    <CardContent className="p-3">
      <div className="flex items-start gap-3">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium text-sm shrink-0 shadow-md transition-transform hover:scale-110"
          style={{ backgroundColor: structure.color }}
        >
          {structure.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
              {structure.name}
            </h3>
            <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700">
              {structure.category}
            </Badge>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
            {structure.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>
              {structure.size.width}m × {structure.size.height}m
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
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
    if (!searchTerm) return structures;
    
    const term = searchTerm.toLowerCase();
    return structures.filter(structure => 
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

  const handleStructureClick = useCallback((structure: Structure) => {
    onStructureSelect(structure);
  }, [onStructureSelect]);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const structuresByCategory = useMemo(() => {
    return structureCategories.reduce((acc, category) => {
      acc[category] = filteredStructures.filter(s => s.category === category);
      return acc;
    }, {} as Record<string, Structure[]>);
  }, [filteredStructures]);

  return (
    <div className={cn("flex flex-col h-full bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50", className)}>
      {/* Header and Search Bar */}
      <div className="sticky top-0 z-10 p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Biblioteca de Estruturas
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{structures.length} estruturas</span>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar estruturas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200"
          />
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="sticky top-[120px] z-10 px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-b from-white/50 to-gray-50/30 dark:from-gray-900/50 dark:to-gray-800/30 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          <Button
            key="all"
            variant={selectedCategory === 'all' ? "default" : "outline"}
            size="sm"
            className={cn(
              "text-xs h-10 px-4 font-semibold border border-transparent rounded-lg transition-all duration-300",
              selectedCategory === 'all' 
                ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg border-blue-500 hover:shadow-xl" 
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-cyan-600"
            )}
            onClick={() => handleCategoryChange('all')}
          >
            <Building className="w-3 h-3 mr-1" />
            Todas
            <Badge variant="secondary" className="ml-1 px-1 py-0 text-[10px] h-4">
              {structures.length}
            </Badge>
          </Button>
          {structureCategories.map(category => {
            const Icon = categoryIcons[category] || Building;
            const count = structuresByCategory[category]?.length || 0;
            
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={cn(
                  "text-xs h-10 px-4 font-semibold border border-transparent rounded-lg transition-all duration-300",
                  selectedCategory === category 
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg border-blue-500 hover:shadow-xl" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-blue-300 dark:hover:border-cyan-600"
                )}
                onClick={() => handleCategoryChange(category)}
              >
                <Icon className="w-3 h-3 mr-1" />
                {category}
                {count > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1 py-0 text-[10px] h-4">
                    {count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Structure Grid */}
      <div className="flex-1">
        <ScrollArea className="h-full overflow-y-auto">
          <div className="p-4 space-y-4">
            {filteredStructures.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                <Building className="w-10 h-10 text-blue-500 dark:text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
    </div>
  );
};

export default StructureLibrary;
