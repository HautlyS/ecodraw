import React, { memo, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  MousePointer, 
  Square, 
  Circle, 
  Hand,
  Palette,
  Leaf,
  Mountain,
  Building,
  Grid3X3,
  Trash2,
  Library,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  activeLibrary: "plants" | "terrain" | "structures";
  onLibraryChange: (library: "plants" | "terrain" | "structures") => void;
  onShowLibrary?: () => void;
}

const tools = [
  { id: "select", icon: MousePointer, label: "Selecionar", color: "bg-gradient-to-r from-blue-400 to-cyan-500" },
  { id: "move", icon: Hand, label: "Navegar", color: "bg-gradient-to-r from-purple-400 to-pink-500" },
  { id: "rectangle", icon: Square, label: "Retângulo", color: "bg-gradient-to-r from-orange-400 to-red-500" },
  { id: "circle", icon: Circle, label: "Círculo", color: "bg-gradient-to-r from-pink-400 to-rose-500" },
  { id: "terrain", icon: Palette, label: "Terreno", color: "bg-gradient-to-r from-green-400 to-emerald-500" },
  { id: "grid", icon: Grid3X3, label: "Grade", color: "bg-gradient-to-r from-slate-400 to-gray-500" },
  { id: "delete", icon: Trash2, label: "Excluir", color: "bg-gradient-to-r from-red-400 to-rose-500" },
];

const MobileToolButton = memo(({ tool, isSelected, onSelect }: {
  tool: typeof tools[0];
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  const handleClick = useCallback(() => {
    onSelect(tool.id);
  }, [tool.id, onSelect]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        "flex-1 flex flex-col items-center gap-1 h-auto py-3 px-2 rounded-2xl transition-all duration-300 backdrop-blur-xl border touch-target",
        "hover:scale-105",
        isSelected 
          ? `${tool.color} text-white shadow-lg border-white/20` 
          : "bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border-white/20 dark:border-gray-700/20 hover:bg-white/80 dark:hover:bg-gray-700/80"
      )}
    >
      <tool.icon className="w-5 h-5" />
      <span className="text-xs font-semibold leading-none">{tool.label}</span>
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl pointer-events-none" />
      )}
    </Button>
  );
});

MobileToolButton.displayName = "MobileToolButton";

const LibraryButton = memo(({ library, isActive, onSelect }: {
  library: "plants" | "terrain" | "structures";
  isActive: boolean;
  onSelect: (library: "plants" | "terrain" | "structures") => void;
}) => {
  const handleClick = useCallback(() => {
    onSelect(library);
  }, [library, onSelect]);

  const config = {
    plants: { Icon: Leaf, label: "Plantas", color: "bg-gradient-to-r from-green-400 to-emerald-500" },
    terrain: { Icon: Mountain, label: "Terreno", color: "bg-gradient-to-r from-orange-400 to-amber-500" },
    structures: { Icon: Building, label: "Estruturas", color: "bg-gradient-to-r from-blue-400 to-indigo-500" }
  };

  const { Icon, label, color } = config[library];

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 h-10 px-4 rounded-2xl transition-all duration-300 backdrop-blur-xl border font-semibold",
        "hover:scale-105",
        isActive 
          ? `${color} text-white shadow-lg border-white/20` 
          : "bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 border-white/20 dark:border-gray-700/20 hover:bg-white/80 dark:hover:bg-gray-700/80"
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-semibold">{label}</span>
    </Button>
  );
});

LibraryButton.displayName = "LibraryButton";

export const MobileNavigation = memo(({ 
  selectedTool, 
  onToolSelect, 
  activeLibrary, 
  onLibraryChange,
  onShowLibrary 
}: MobileNavigationProps) => {
  const memoizedTools = useMemo(() => tools.map(tool => (
    <MobileToolButton
      key={tool.id}
      tool={tool}
      isSelected={selectedTool === tool.id}
      onSelect={onToolSelect}
    />
  )), [selectedTool, onToolSelect]);

  const memoizedLibraryButtons = useMemo(() => (
    <>
      <LibraryButton
        library="plants"
        isActive={activeLibrary === "plants"}
        onSelect={onLibraryChange}
      />
      <LibraryButton
        library="terrain"
        isActive={activeLibrary === "terrain"}
        onSelect={onLibraryChange}
      />
      <LibraryButton
        library="structures"
        isActive={activeLibrary === "structures"}
        onSelect={onLibraryChange}
      />
    </>
  ), [activeLibrary, onLibraryChange]);

  return (
    <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/20 contain-paint">
      <div className="safe-area-bottom">
        {/* Enhanced Library Selector */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 dark:border-gray-700/20">
          <div className="flex items-center gap-2">
            {memoizedLibraryButtons}
          </div>
          
          {/* Show Library Button */}
          {onShowLibrary && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowLibrary}
              className="h-10 px-4 rounded-2xl transition-all duration-300 backdrop-blur-xl border font-semibold hover:scale-105 bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-lg border-white/20"
            >
              <Library className="w-4 h-4 mr-2" />
              <span className="text-sm font-semibold">Abrir</span>
              <Sparkles className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
        
        {/* Enhanced Tools Grid */}
        <div className="flex items-center gap-2 px-3 py-3">
          {memoizedTools}
        </div>
      </div>
    </div>
  );
});

MobileNavigation.displayName = "MobileNavigation";