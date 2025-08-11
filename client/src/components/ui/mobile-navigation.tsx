import React, { useState, useCallback } from "react";
import { Menu, X, Settings, Palette, Save, Upload, Download, Grid, Move, Square, Circle, Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Tool {
  id: string;
  name: string;
  icon: React.ElementType;
  description?: string;
  isActive?: boolean;
}

interface MobileNavigationProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
  onSave?: () => void;
  onLoad?: () => void;
  onExport?: () => void;
  onGridToggle?: () => void;
  showGrid?: boolean;
  children?: React.ReactNode;
}

const MAIN_TOOLS: Tool[] = [
  { id: "move", name: "Navegar", icon: Move, description: "Mover e selecionar elementos" },
  { id: "plant", name: "Plantas", icon: Palette, description: "Adicionar plantas ao canvas" },
  { id: "terrain", name: "Terreno", icon: Paintbrush, description: "Pintar terrenos e texturas" },
  { id: "rectangle", name: "Retângulo", icon: Square, description: "Desenhar formas retangulares" },
  { id: "circle", name: "Círculo", icon: Circle, description: "Desenhar formas circulares" },
];

const UTILITY_TOOLS: Tool[] = [
  { id: "grid", name: "Grade", icon: Grid, description: "Mostrar/ocultar grade" },
  { id: "save", name: "Salvar", icon: Save, description: "Salvar projeto" },
  { id: "load", name: "Carregar", icon: Upload, description: "Carregar projeto" },
  { id: "export", name: "Exportar", icon: Download, description: "Exportar como imagem" },
];

const ToolButton = ({ tool, isSelected, onSelect, variant = "default" }: {
  tool: Tool;
  isSelected: boolean;
  onSelect: (toolId: string) => void;
  variant?: "default" | "compact";
}) => {
  const handleClick = useCallback(() => {
    onSelect(tool.id);
  }, [tool.id, onSelect]);

  if (variant === "compact") {
    return (
      <Button
        variant={isSelected ? "default" : "ghost"}
        size="sm"
        onClick={handleClick}
        className={cn(
          "h-12 w-12 p-0 rounded-xl transition-all duration-200",
          isSelected 
            ? "bg-green-500 hover:bg-green-600 text-white shadow-lg" 
            : "bg-white/80 hover:bg-green-50 text-gray-700 border border-gray-200"
        )}
        title={tool.description}
      >
        <tool.icon className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant={isSelected ? "default" : "ghost"}
      className={cn(
        "w-full justify-start h-12 px-4 rounded-xl transition-all duration-200",
        isSelected 
          ? "bg-green-500 hover:bg-green-600 text-white shadow-lg" 
          : "bg-white/60 hover:bg-green-50 text-gray-700 border border-gray-200"
      )}
      onClick={handleClick}
    >
      <tool.icon className="h-5 w-5 mr-3" />
      <div className="flex flex-col items-start">
        <span className="font-medium">{tool.name}</span>
        {tool.description && (
          <span className="text-xs opacity-70 line-clamp-1">{tool.description}</span>
        )}
      </div>
    </Button>
  );
};

export const MobileNavigation = ({
  selectedTool,
  onToolSelect,
  onSave,
  onLoad,
  onExport,
  onGridToggle,
  showGrid,
  children
}: MobileNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToolSelect = useCallback((toolId: string) => {
    if (toolId === "save" && onSave) {
      onSave();
      setIsOpen(false);
      return;
    }
    if (toolId === "load" && onLoad) {
      onLoad();
      setIsOpen(false);
      return;
    }
    if (toolId === "export" && onExport) {
      onExport();
      setIsOpen(false);
      return;
    }
    if (toolId === "grid" && onGridToggle) {
      onGridToggle();
      return;
    }
    
    onToolSelect(toolId);
    setIsOpen(false);
  }, [onToolSelect, onSave, onLoad, onExport, onGridToggle]);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <Palette className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100">Agroecologia</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Canvas Design</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Tools */}
            <div className="flex items-center gap-1">
              {MAIN_TOOLS.slice(0, 3).map(tool => (
                <ToolButton
                  key={tool.id}
                  tool={tool}
                  isSelected={selectedTool === tool.id}
                  onSelect={handleToolSelect}
                  variant="compact"
                />
              ))}
            </div>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-12 w-12 p-0 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80 p-0">
                <div className="flex flex-col h-full">
                  <SheetHeader className="p-6 pb-4">
                    <SheetTitle className="text-left">Ferramentas</SheetTitle>
                  </SheetHeader>
                  
                  <Tabs defaultValue="tools" className="flex-1">
                    <TabsList className="grid w-full grid-cols-2 mx-6 mb-4">
                      <TabsTrigger value="tools">Desenho</TabsTrigger>
                      <TabsTrigger value="actions">Ações</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="tools" className="mt-0 px-6">
                      <ScrollArea className="h-[calc(100vh-200px)]">
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                            FERRAMENTAS PRINCIPAIS
                          </h3>
                          {MAIN_TOOLS.map(tool => (
                            <ToolButton
                              key={tool.id}
                              tool={tool}
                              isSelected={selectedTool === tool.id}
                              onSelect={handleToolSelect}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    
                    <TabsContent value="actions" className="mt-0 px-6">
                      <ScrollArea className="h-[calc(100vh-200px)]">
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                            AÇÕES DO PROJETO
                          </h3>
                          {UTILITY_TOOLS.map(tool => (
                            <ToolButton
                              key={tool.id}
                              tool={{
                                ...tool,
                                name: tool.id === "grid" ? (showGrid ? "Ocultar Grade" : "Mostrar Grade") : tool.name
                              }}
                              isSelected={tool.id === "grid" ? showGrid : false}
                              onSelect={handleToolSelect}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:hidden pt-14">
        {children}
      </div>

      {/* Desktop fallback */}
      <div className="hidden lg:block">
        {children}
      </div>
    </>
  );
};