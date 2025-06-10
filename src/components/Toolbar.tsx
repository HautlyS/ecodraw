
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
  Ruler
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
}

export const Toolbar = ({ selectedTool, onToolSelect }: ToolbarProps) => {
  const tools = [
    { id: "select", icon: MousePointer, label: "Selecionar" },
    { id: "move", icon: Move, label: "Mover" },
    { id: "rectangle", icon: Square, label: "Retângulo" },
    { id: "circle", icon: Circle, label: "Círculo" },
    { id: "rotate", icon: RotateCw, label: "Rotacionar" },
    { id: "delete", icon: Trash2, label: "Excluir" },
  ];

  const utilityTools = [
    { id: "grid", icon: Grid3X3, label: "Grid" },
    { id: "measure", icon: Ruler, label: "Medir" },
  ];

  return (
    <div className="flex items-center gap-2 p-4 border-b border-border bg-card/50">
      {/* Main Tools */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolSelect(tool.id)}
            className={cn(
              "gap-2",
              selectedTool === tool.id && "nature-gradient text-white border-0"
            )}
            title={tool.label}
          >
            <tool.icon className="w-4 h-4" />
            {tool.label}
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Utility Tools */}
      <div className="flex items-center gap-1">
        {utilityTools.map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onToolSelect(tool.id)}
            className={cn(
              "gap-2",
              selectedTool === tool.id && "nature-gradient text-white border-0"
            )}
            title={tool.label}
          >
            <tool.icon className="w-4 h-4" />
            {tool.label}
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Area Info */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground ml-auto">
        <span>Área: 0 m²</span>
        <span>Escala: 1:100</span>
      </div>
    </div>
  );
};
