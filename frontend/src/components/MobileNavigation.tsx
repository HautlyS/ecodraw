import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/mobile-drawer";
import { 
  Menu, 
  X,
  MousePointer, 
  Square, 
  Circle, 
  Hand, 
  Palette,
  Grid3X3,
  Copy,
  RotateCw,
  Trash2,
  Layers,
  Leaf,
  Mountain
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  activeLibrary: "plants" | "terrain";
  onLibraryChange: (library: "plants" | "terrain") => void;
  className?: string;
}

export const MobileNavigation = ({
  selectedTool,
  onToolSelect,
  activeLibrary,
  onLibraryChange,
  className,
}: MobileNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const mainTools = [
    { 
      id: "select", 
      icon: MousePointer, 
      label: "Selecionar", 
      description: "Selecione e mova elementos"
    },
    { 
      id: "move", 
      icon: Hand, 
      label: "Navegar", 
      description: "Navegue pelo canvas"
    },
    { 
      id: "rectangle", 
      icon: Square, 
      label: "Retângulo", 
      description: "Desenhe retângulos"
    },
    { 
      id: "circle", 
      icon: Circle, 
      label: "Círculo", 
      description: "Desenhe círculos"
    },
    { 
      id: "terrain", 
      icon: Palette, 
      label: "Terreno", 
      description: "Pinte terreno",
      highlight: true
    },
  ];

  const utilityTools = [
    { id: "grid", icon: Grid3X3, label: "Grid", description: "Grade de alinhamento" },
    { id: "copy", icon: Copy, label: "Copiar", description: "Copie elementos" },
    { id: "rotate", icon: RotateCw, label: "Rotacionar", description: "Rotacione elementos" },
    { id: "delete", icon: Trash2, label: "Excluir", description: "Remova elementos" },
  ];

  const handleToolSelect = (toolId: string) => {
    onToolSelect(toolId);
    setIsOpen(false);
  };

  const currentTool = [...mainTools, ...utilityTools].find(tool => tool.id === selectedTool);

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border",
        "flex items-center justify-between px-4 py-2 md:hidden",
        className
      )}>
        {/* Library Switcher */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={activeLibrary === "plants" ? "default" : "ghost"}
            size="sm"
            onClick={() => onLibraryChange("plants")}
            className="gap-1 text-xs"
          >
            <Leaf className="w-4 h-4" />
            Plantas
          </Button>
          <Button
            variant={activeLibrary === "terrain" ? "default" : "ghost"}
            size="sm"
            onClick={() => onLibraryChange("terrain")}
            className="gap-1 text-xs"
          >
            <Mountain className="w-4 h-4" />
            Terreno
          </Button>
        </div>

        {/* Current Tool Display */}
        <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
          {currentTool && (
            <>
              <currentTool.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{currentTool.label}</span>
              {currentTool.highlight && (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  New
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Tools Menu */}
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Menu className="w-4 h-4" />
              Ferramentas
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh]">
            <DrawerHeader>
              <div className="flex items-center justify-between">
                <DrawerTitle>Selecionar Ferramenta</DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>
            
            <div className="px-4 pb-6 space-y-6">
              {/* Main Tools */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Ferramentas Principais
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {mainTools.map((tool) => (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? "default" : "outline"}
                      className={cn(
                        "flex flex-col gap-2 h-auto p-4 text-left",
                        selectedTool === tool.id && tool.highlight && 
                        "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-400"
                      )}
                      onClick={() => handleToolSelect(tool.id)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <tool.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{tool.label}</span>
                        {tool.highlight && (
                          <Badge variant="secondary" className="text-xs ml-auto">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground text-left">
                        {tool.description}
                      </p>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Utility Tools */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Ferramentas Auxiliares</h3>
                <div className="grid grid-cols-2 gap-2">
                  {utilityTools.map((tool) => (
                    <Button
                      key={tool.id}
                      variant={selectedTool === tool.id ? "default" : "outline"}
                      className="flex flex-col gap-2 h-auto p-4 text-left"
                      onClick={() => handleToolSelect(tool.id)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <tool.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{tool.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground text-left">
                        {tool.description}
                      </p>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Bottom padding to prevent content from being hidden behind the mobile nav */}
      <div className="h-16 md:hidden" />
    </>
  );
};