
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Share2, Save, Sprout } from "lucide-react";
import { toast } from "sonner";

export const Header = () => {
  const handleExport = () => {
    toast.success("Exportando mapa como PNG...", {
      description: "Seu mapa será baixado em breve!"
    });
  };

  const handleSave = () => {
    toast.success("Projeto salvo com sucesso!", {
      description: "Seu progresso foi salvo localmente."
    });
  };

  const handleShare = () => {
    toast.info("Funcionalidade em desenvolvimento", {
      description: "Em breve você poderá compartilhar seus projetos!"
    });
  };

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl nature-gradient">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Agroecologia Desenhada</h1>
            <p className="text-sm text-muted-foreground">Planeje sua área sustentável</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSave}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Compartilhar
          </Button>
          
          <Button 
            onClick={handleExport}
            className="gap-2 nature-gradient text-white border-0"
          >
            <Download className="w-4 h-4" />
            Exportar PNG
          </Button>
        </div>
      </div>
    </header>
  );
};
