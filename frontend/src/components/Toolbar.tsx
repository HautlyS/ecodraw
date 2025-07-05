
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  Mountain
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

export const Toolbar = ({ selectedTool, onToolSelect }: ToolbarProps) => {
  const tools = [
    { id: "select", icon: MousePointer, label: "Selecionar", description: "Selecione e mova elementos" },
    { id: "move", icon: Hand, label: "Navegar", description: "Navegue pelo canvas" },
    { id: "rectangle", icon: Square, label: "Retângulo", description: "Desenhe retângulos" },
    { id: "circle", icon: Circle, label: "Círculo", description: "Desenhe círculos" },
    { id: "terrain", icon: Mountain, label: "Terreno", description: "Adicione elementos do terreno" },
    { id: "copy", icon: Copy, label: "Copiar", description: "Copie elementos selecionados" },
    { id: "delete", icon: Trash2, label: "Excluir", description: "Remova elementos" },
  ];

  const utilityTools = [
    { id: "grid", icon: Grid3X3, label: "Grid", description: "Alternar grade" },
    { id: "measure", icon: Ruler, label: "Medir", description: "Medir distâncias" },
    { id: "rotate", icon: RotateCw, label: "Rotacionar", description: "Rotacione elementos" },
  ];

  const renderToolButton = (tool: any) => (
    <Button
      key={tool.id}
      variant={selectedTool === tool.id ? "default" : "ghost"}
      size="sm"
      onClick={() => onToolSelect(tool.id)}
      className={cn(
        "gap-2 relative",
        selectedTool === tool.id && "nature-gradient text-white border-0"
      )}
      title={tool.description}
    >
      <tool.icon className="w-4 h-4" />
      <span className="hidden md:inline">{tool.label}</span>
    </Button>
  );

  return (
    <div className="flex items-center justify-between gap-2 p-4 border-b border-border bg-card/50 backdrop-blur-sm dark:bg-gray-800/50 transition-colors">
      <div className="flex items-center gap-4">
        {/* Main Tools */}
        <div className="flex items-center gap-1">
          {tools.map(renderToolButton)}
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Utility Tools */}
        <div className="flex items-center gap-1">
          {utilityTools.map(renderToolButton)}
        </div>
      </div>

      {/* Area Info & Help */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="hidden lg:flex items-center gap-4">
          <span>Área: 0 m²</span>
          <span>Escala: 1:100</span>
        </div>
        <div className="text-xs bg-muted px-2 py-1 rounded dark:bg-gray-700">
          <span className="hidden sm:inline">Atalhos: </span>
          Del = Excluir | Esc = Cancelar
        </div>
      </div>
    </div>
  );
};
