import React, { memo, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Palette,
  Undo,
  Redo,
  Download,
  Share2,
  Save,
  Sprout,
  Settings,
  Sun,
  Moon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { toast } from "sonner";

interface UnifiedToolbarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canvasSize: { width: number; height: number };
  onCanvasSizeChange: (size: { width: number; height: number }) => void;
  onExportCanvas?: () => void;
}

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
    description: "Navegue pelo canvas",
    category: "navigation"
  },
  { 
    id: "rectangle", 
    icon: Square, 
    label: "Retângulo", 
    description: "Desenhe retângulos",
    category: "shapes"
  },
  { 
    id: "circle", 
    icon: Circle, 
    label: "Círculo", 
    description: "Desenhe círculos",
    category: "shapes"
  },
  { 
    id: "terrain", 
    icon: Palette, 
    label: "Terreno", 
    description: "Pinte texturas",
    category: "terrain"
  },
];

const utilityTools = [
  { id: "grid", icon: Grid3X3, label: "Grade", description: "Alternar grade (G)" },
  { id: "copy", icon: Copy, label: "Copiar", description: "Copiar elementos (Ctrl+C)" },
  { id: "rotate", icon: RotateCw, label: "Rotacionar", description: "Rotacionar elementos (R)" },
  { id: "delete", icon: Trash2, label: "Excluir", description: "Remover elementos (Del)" },
];

const ToolButton = memo(({ tool, isSelected, onSelect, isUtility = false }: {
  tool: typeof tools[0] | typeof utilityTools[0];
  isSelected: boolean;
  onSelect: (id: string) => void;
  isUtility?: boolean;
}) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={() => onSelect(tool.id)}
    className={cn(
      "relative h-9 px-3 border-0 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150",
      isSelected && "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
      isUtility && "h-8 px-2"
    )}
    title={tool.description}
  >
    <tool.icon className={cn(
      "w-4 h-4",
      !isUtility && "mr-2"
    )} />
    {!isUtility && (
      <span className="text-sm font-medium">{tool.label}</span>
    )}
    {isSelected && (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-md pointer-events-none" />
    )}
  </Button>
));

ToolButton.displayName = "ToolButton";

export const UnifiedToolbar = memo(({ 
  selectedTool, 
  onToolSelect, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo,
  canvasSize,
  onCanvasSizeChange,
  onExportCanvas
}: UnifiedToolbarProps) => {
  const { theme, toggleTheme } = useTheme();

  const handleExport = useCallback(() => {
    // Simple export function - try to find canvas and export it
    const canvasElement = document.querySelector('[data-canvas="true"]') as HTMLElement;
    if (!canvasElement) {
      toast.error("Canvas não encontrado para exportação");
      return;
    }

    import('html2canvas').then(({ default: html2canvas }) => {
      html2canvas(canvasElement, {
        backgroundColor: '#f9fafb',
        scale: 2,
        logging: false,
        allowTaint: true,
        useCORS: true
      }).then(canvas => {
        canvas.toBlob((blob) => {
          if (!blob) {
            toast.error('Erro ao gerar imagem');
            return;
          }
          
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `canvas-export-${Date.now()}.png`;
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          URL.revokeObjectURL(url);
          
          toast.success('Canvas exportado com sucesso!');
        }, 'image/png', 0.9);
      }).catch((error) => {
        console.error('Export error:', error);
        toast.error('Erro ao exportar canvas');
      });
    }).catch((error) => {
      console.error('Failed to load html2canvas:', error);
      toast.error('Erro ao carregar biblioteca de exportação');
    });
  }, []);

  const handleSave = useCallback(() => {
    const projectData = {
      timestamp: new Date().toISOString(),
      canvasSize,
      version: "1.0"
    };
    localStorage.setItem('agroecologia-project', JSON.stringify(projectData));
    toast.success("Projeto salvo!");
  }, [canvasSize]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'Meu Projeto Agroecológico',
        text: 'Confira meu mapa de plantio',
        url: window.location.href
      }).catch(() => toast.info("Compartilhamento cancelado"));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado!");
    }
  }, []);

  const handleCanvasSizeChange = useCallback((field: 'width' | 'height', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      onCanvasSizeChange({
        ...canvasSize,
        [field]: numValue
      });
    }
  }, [canvasSize, onCanvasSizeChange]);

  const memoizedTools = useMemo(() => tools.map(tool => (
    <ToolButton
      key={tool.id}
      tool={tool}
      isSelected={selectedTool === tool.id}
      onSelect={onToolSelect}
    />
  )), [selectedTool, onToolSelect]);

  const memoizedUtilityTools = useMemo(() => utilityTools.map(tool => (
    <ToolButton
      key={tool.id}
      tool={tool}
      isSelected={selectedTool === tool.id}
      onSelect={onToolSelect}
      isUtility
    />
  )), [selectedTool, onToolSelect]);

  return (
    <div className="flex items-center justify-between h-12 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      {/* Left: Logo & Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
          <Sprout className="w-4 h-4 text-white" />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Agroecologia</h1>
        </div>
      </div>

      {/* Center: Tools */}
      <div className="flex items-center gap-1">
        {/* Main Tools */}
        <div className="flex items-center gap-1 p-1 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {memoizedTools}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Utility Tools */}
        <div className="flex items-center gap-1">
          {memoizedUtilityTools}
        </div>

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* History */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-8 w-8 p-0"
            title="Desfazer (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-8 w-8 p-0"
            title="Refazer (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right: Canvas Settings & Actions */}
      <div className="flex items-center gap-2">
        {/* Canvas Size */}
        <div className="hidden lg:flex items-center gap-2 text-sm">
          <Label htmlFor="canvas-width" className="text-xs text-gray-600 dark:text-gray-400">
            Tamanho:
          </Label>
          <Input
            id="canvas-width"
            type="number"
            value={canvasSize.width}
            onChange={(e) => handleCanvasSizeChange('width', e.target.value)}
            className="w-16 h-7 text-xs"
            min="1"
            max="200"
          />
          <span className="text-xs text-gray-500">×</span>
          <Input
            id="canvas-height"
            type="number"
            value={canvasSize.height}
            onChange={(e) => handleCanvasSizeChange('height', e.target.value)}
            className="w-16 h-7 text-xs"
            min="1"
            max="200"
          />
          <span className="text-xs text-gray-500">m</span>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="h-8 w-8 p-0"
          title="Alternar tema"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>

        {/* Actions */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="h-8 px-3"
          title="Salvar projeto"
        >
          <Save className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline text-sm">Salvar</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="h-8 px-3"
          title="Compartilhar"
        >
          <Share2 className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline text-sm">Compartilhar</span>
        </Button>

        <Button
          onClick={handleExport}
          size="sm"
          className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white"
          title="Exportar PNG"
        >
          <Download className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline text-sm">Exportar</span>
        </Button>
      </div>
    </div>
  );
});

UnifiedToolbar.displayName = "UnifiedToolbar";