
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
    <div className="flex items-center justify-between gap-2 p-3 border-b border-border/60 bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-md dark:from-gray-800/80 dark:to-gray-900/60 transition-all shadow-sm">
      <div className="flex items-center gap-3">
        {/* Main Tools */}
        <div className="flex items-center gap-1 p-1 bg-background/50 rounded-lg border border-border/30 shadow-inner">
          {tools.map(tool => renderToolButton(tool))}
        </div>

        <Separator orientation="vertical" className="h-6 opacity-60" />

        {/* Utility Tools */}
        <div className="flex items-center gap-1 p-1 bg-background/30 rounded-lg border border-border/20">
          {utilityTools.map(tool => renderToolButton(tool, true))}
        </div>
      </div>

      {/* Enhanced Info Panel */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="hidden lg:flex items-center gap-4 bg-background/40 px-3 py-1.5 rounded-lg border border-border/30">
          <div className="flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>Escala: 1m = 10px</span>
          </div>
          <Separator orientation="vertical" className="h-4 opacity-40" />
          <span>Grade: 1m</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs bg-gradient-to-r from-muted/80 to-muted/60 px-3 py-1.5 rounded-full border border-border/40 dark:from-gray-700/80 dark:to-gray-600/60">
          <span className="hidden sm:inline font-medium">Atalhos:</span>
          <div className="flex items-center gap-1">
            <code className="font-mono bg-background/50 px-1 rounded">G</code>
            <span className="text-xs">Grade</span>
          </div>
          <div className="flex items-center gap-1">
            <code className="font-mono bg-background/50 px-1 rounded">S</code>
            <span className="text-xs">Selecionar</span>
          </div>
          <div className="flex items-center gap-1">
            <code className="font-mono bg-background/50 px-1 rounded">T</code>
            <span className="text-xs">Terreno</span>
          </div>
          <div className="flex items-center gap-1">
            <code className="font-mono bg-background/50 px-1 rounded">Del</code>
            <span className="text-xs">Excluir</span>
          </div>
          <div className="flex items-center gap-1">
            <code className="font-mono bg-background/50 px-1 rounded">Esc</code>
            <span className="text-xs">Cancelar</span>
          </div>
        </div>
      </div>
    </div>
  );
};
