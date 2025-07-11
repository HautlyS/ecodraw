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
}> = ({ structure, isSelected, onClick }) => (
  <Card 
    className={cn(
      "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
      isSelected 
        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50" 
        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
    )}
    onClick={onClick}
  >
    <CardContent className="p-3">
      <div className="flex items-start gap-3">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium text-sm shrink-0"
          style={{ backgroundColor: structure.color }}
        >
          {structure.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
              {structure.name}
            </h3>
            <Badge variant="secondary" className="text-xs">
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
    <div className={cn("flex flex-col h-full", className)}>
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar estruturas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          <Button
            key="all"
            variant={selectedCategory === 'all' ? "default" : "outline"}
            size="sm"
            className="text-xs h-8"
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
                className="text-xs h-8"
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
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {filteredStructures.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Building className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {isSearching ? 'Nenhuma estrutura encontrada' : 'Nenhuma estrutura disponível'}
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
