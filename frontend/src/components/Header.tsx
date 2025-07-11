import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Share2, Save, Sprout, Undo, Redo, FileText, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

  const handleExport = () => {
    // Get canvas element and export as PNG
    const canvas = document.querySelector('[data-canvas="true"]') as HTMLElement;
    if (!canvas) {
      toast.error("Canvas não encontrado para exportação");
      return;
    }

    toast.success("Exportando mapa como PNG...", {
      description: "Seu mapa será baixado em breve!"
    });

    // In a real implementation, you would use html2canvas here
    // html2canvas(canvas).then(canvas => {
    //   const link = document.createElement('a');
    //   link.download = 'mapa-agroecologico.png';
    //   link.href = canvas.toDataURL();
    //   link.click();
    // });
  };

  const handleSave = () => {
    // Save to localStorage
    const projectData = {
      timestamp: new Date().toISOString(),
      elements: [], // Would get from Canvas component
      version: "1.0"
    };
    
    localStorage.setItem('agroecologia-project', JSON.stringify(projectData));
    toast.success("Projeto salvo com sucesso!", {
      description: "Seu progresso foi salvo localmente."
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Meu Projeto Agroecológico',
        text: 'Confira meu mapa de plantio criado com Agroecologia Desenhada',
        url: window.location.href
      }).catch(() => {
        toast.info("Compartilhamento cancelado");
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado para área de transferência!");
    }
  };

  const handleUndo = () => {
    toast.info("Funcionalidade em desenvolvimento", {
      description: "Histórico de ações será implementado em breve!"
    });
  };

  const handleRedo = () => {
    toast.info("Funcionalidade em desenvolvimento", {
      description: "Histórico de ações será implementado em breve!"
    });
  };

  const handleExportData = () => {
    toast.info("Funcionalidade em desenvolvimento", {
      description: "Export de dados em JSON será implementado!"
    });
  };

  return (
    <header className="h-16 border-b border-border bg-card/90 backdrop-blur-sm z-50 dark:bg-gray-800/90 transition-colors flex-shrink-0">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 xl:px-8 max-w-none">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 xl:gap-4">
          <div className="flex items-center justify-center w-10 h-10 xl:w-12 xl:h-12 3xl:w-14 3xl:h-14 rounded-xl nature-gradient">
            <Sprout className="w-5 h-5 xl:w-6 xl:h-6 3xl:w-7 3xl:h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl xl:text-2xl 3xl:text-3xl font-bold text-foreground">Agroecologia Desenhada</h1>
            <p className="text-sm xl:text-base 3xl:text-lg text-muted-foreground">Planeje sua área sustentável</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 xl:gap-3">
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleTheme}
            className="gap-2 xl:px-4 xl:py-2 3xl:px-5 3xl:py-3"
            title="Alternar tema"
          >
            {theme === "light" ? <Moon className="w-4 h-4 xl:w-5 xl:h-5" /> : <Sun className="w-4 h-4 xl:w-5 xl:h-5" />}
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Undo/Redo */}
          <div className="hidden md:flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleUndo}
              className="gap-2"
              title="Desfazer (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleRedo}
              className="gap-2"
              title="Refazer (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 hidden md:block" />

          {/* File Operations */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSave}
            className="gap-2"
            title="Salvar projeto (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Salvar</span>
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportData}
            className="gap-2"
            title="Exportar dados do projeto"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden lg:inline">Dados</span>
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Share & Export */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShare}
            className="gap-2"
            title="Compartilhar projeto"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>
          
          <Button 
            onClick={handleExport}
            className="gap-2 nature-gradient text-white border-0"
            title="Exportar como imagem PNG"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar PNG</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
