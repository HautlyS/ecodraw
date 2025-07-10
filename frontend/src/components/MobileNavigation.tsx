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
  Grid3X3,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  activeLibrary: "plants" | "terrain";
  onLibraryChange: (library: "plants" | "terrain") => void;
}

const tools = [
  { id: "select", icon: MousePointer, label: "Selecionar" },
  { id: "move", icon: Hand, label: "Navegar" },
  { id: "rectangle", icon: Square, label: "Retângulo" },
  { id: "circle", icon: Circle, label: "Círculo" },
  { id: "terrain", icon: Palette, label: "Terreno" },
  { id: "grid", icon: Grid3X3, label: "Grade" },
  { id: "delete", icon: Trash2, label: "Excluir" },
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
        "flex-1 flex flex-col items-center gap-1 h-auto py-2 px-1 border-0 bg-transparent transition-all duration-150",
        "touch-target",
        isSelected 
          ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
    >
      <tool.icon className="w-5 h-5" />
      <span className="text-xs font-medium leading-none">{tool.label}</span>
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-500/10 rounded-md pointer-events-none" />
      )}
    </Button>
  );
});

MobileToolButton.displayName = "MobileToolButton";

const LibraryButton = memo(({ library, isActive, onSelect }: {
  library: "plants" | "terrain";
  isActive: boolean;
  onSelect: (library: "plants" | "terrain") => void;
}) => {
  const handleClick = useCallback(() => {
    onSelect(library);
  }, [library, onSelect]);

  const Icon = library === "plants" ? Leaf : Mountain;
  const label = library === "plants" ? "Plantas" : "Terreno";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 h-8 px-3 border-0 bg-transparent transition-all duration-150",
        isActive 
          ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
});

LibraryButton.displayName = "LibraryButton";

export const MobileNavigation = memo(({ 
  selectedTool, 
  onToolSelect, 
  activeLibrary, 
  onLibraryChange 
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
    </>
  ), [activeLibrary, onLibraryChange]);

  return (
    <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 contain-paint">
      <div className="safe-area-bottom">
        {/* Library Selector */}
        <div className="flex items-center justify-center gap-2 px-4 py-2 border-b border-gray-100 dark:border-gray-800">
          {memoizedLibraryButtons}
        </div>
        
        {/* Tools Grid */}
        <div className="flex items-center px-2 py-1">
          {memoizedTools}
        </div>
      </div>
    </div>
  );
});

MobileNavigation.displayName = "MobileNavigation";