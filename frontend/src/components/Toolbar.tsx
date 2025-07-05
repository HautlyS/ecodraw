
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  MousePointer, 
  Square, 
  Circle, 
  Move, 
  RotateCw, 
  Trash2,
  Grid3X3,
  Ruler,
  Hand,
  Copy,
  Mountain,
  Palette,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

export const Toolbar = ({ selectedTool, onToolSelect }: ToolbarProps) => {
  const tools = [
    { 
      id: "select", 
      icon: MousePointer, 
      label: "Selecionar", 
      description: "Selecione e mova elementos",
      category: "selection"
    },
    { 
      id: "move", 
      icon: Hand, 
      label: "Navegar", 
      description: "Navegue pelo canvas (Espaço + arrastar)",
      category: "navigation"
    },
    { 
      id: "rectangle", 
      icon: Square, 
      label: "Retângulo", 
      description: "Desenhe retângulos de área",
      category: "shapes"
    },
    { 
      id: "circle", 
      icon: Circle, 
      label: "Círculo", 
      description: "Desenhe círculos de área",
      category: "shapes"
    },
    { 
      id: "terrain", 
      icon: Palette, 
      label: "Terreno", 
      description: "Pinte texturas no terreno",
      category: "terrain",
      highlight: true
    },
  ];

  const utilityTools = [
    { id: "grid", icon: Grid3X3, label: "Grid", description: "Alternar grade de alinhamento (G)" },
    { id: "copy", icon: Copy, label: "Copiar", description: "Copie elementos selecionados (Ctrl+C)" },
    { id: "rotate", icon: RotateCw, label: "Rotacionar", description: "Rotacione elementos selecionados (R)" },
    { id: "delete", icon: Trash2, label: "Excluir", description: "Remova elementos (Del)" },
  ];

  const renderToolButton = (tool: any, isUtility = false) => (
    <Button
      key={tool.id}
      variant={selectedTool === tool.id ? "default" : "ghost"}
      size="sm"
      onClick={() => onToolSelect(tool.id)}
      className={cn(
        "gap-2 relative transition-all duration-200 hover:scale-105 border",
        selectedTool === tool.id && tool.highlight && "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/25",
        selectedTool === tool.id && !tool.highlight && "nature-gradient text-white border-primary shadow-md shadow-primary/25",
        selectedTool !== tool.id && "hover:bg-accent/80 hover:border-accent border-transparent",
        selectedTool === tool.id && "ring-2 ring-offset-2 ring-primary/50"
      )}
      title={tool.description}
    >
      <tool.icon className={cn(
        "w-4 h-4 transition-all",
        selectedTool === tool.id && "drop-shadow-sm scale-110"
      )} />
      <span className="hidden md:inline font-medium">{tool.label}</span>
      {tool.highlight && (
        <Badge 
          variant="secondary" 
          className="absolute -top-1 -right-1 text-xs px-1 bg-orange-500 text-white border-0 animate-pulse"
        >
          New
        </Badge>
      )}
      {selectedTool === tool.id && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-md pointer-events-none" />
      )}
    </Button>
  );

  return (
    <div className="flex items-center justify-between gap-2 p-4 border-b border-border/60 bg-gradient-to-r from-card/95 to-card/90 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-4">
        {/* Main Tools */}
        <div className="flex items-center gap-1 p-1.5 bg-background/70 rounded-xl border border-border/40 shadow-inner backdrop-blur-sm">
          {tools.map(tool => renderToolButton(tool))}
        </div>

        <Separator orientation="vertical" className="h-8 opacity-60" />

        {/* Utility Tools */}
        <div className="flex items-center gap-1 p-1.5 bg-background/50 rounded-xl border border-border/30 backdrop-blur-sm">
          {utilityTools.map(tool => renderToolButton(tool, true))}
        </div>
      </div>

      {/* Enhanced Info Panel */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="hidden lg:flex items-center gap-4 bg-background/60 px-4 py-2 rounded-xl border border-border/40 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <span className="font-medium">Escala: 1m = 10px</span>
          </div>
          <Separator orientation="vertical" className="h-5 opacity-40" />
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-primary" />
            <span className="font-medium">Grade: 2m</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-xs bg-gradient-to-r from-muted/90 to-muted/70 px-4 py-2 rounded-full border border-border/50 dark:from-gray-700/90 dark:to-gray-600/70 backdrop-blur-sm">
          <span className="hidden sm:inline font-semibold text-primary">Atalhos:</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <code className="font-mono bg-background/70 px-1.5 py-0.5 rounded text-xs font-medium border">G</code>
              <span className="text-xs font-medium">Grade</span>
            </div>
            <div className="flex items-center gap-1">
              <code className="font-mono bg-background/70 px-1.5 py-0.5 rounded text-xs font-medium border">S</code>
              <span className="text-xs font-medium">Selecionar</span>
            </div>
            <div className="flex items-center gap-1">
              <code className="font-mono bg-background/70 px-1.5 py-0.5 rounded text-xs font-medium border">T</code>
              <span className="text-xs font-medium">Terreno</span>
            </div>
            <div className="flex items-center gap-1">
              <code className="font-mono bg-background/70 px-1.5 py-0.5 rounded text-xs font-medium border">Del</code>
              <span className="text-xs font-medium">Excluir</span>
            </div>
            <div className="flex items-center gap-1">
              <code className="font-mono bg-background/70 px-1.5 py-0.5 rounded text-xs font-medium border">Esc</code>
              <span className="text-xs font-medium">Cancelar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
