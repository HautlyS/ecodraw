
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sprout, Mouse, Download, Palette } from "lucide-react";

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

export const WelcomeModal = ({ open, onClose }: WelcomeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl nature-gradient">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">Bem-vindo ao Agroecologia Desenhada!</DialogTitle>
              <DialogDescription>
                Crie mapas de plantio sustentáveis de forma visual e intuitiva
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Mouse className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-medium text-sm">1. Selecione suas plantas</h4>
                <p className="text-xs text-muted-foreground">
                  Browse through our library of native and sustainable plants
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Palette className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-medium text-sm">2. Desenhe sua área</h4>
                <p className="text-xs text-muted-foreground">
                  Use ferramentas para delimitar terrenos e organizar plantios
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <Download className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-medium text-sm">3. Exporte seu projeto</h4>
                <p className="text-xs text-muted-foreground">
                  Baixe como PNG em alta qualidade para implementação
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              💡 <strong>Dica:</strong> Comece selecionando plantas da biblioteca ao lado 
              e clique no canvas para posicioná-las em sua área de cultivo.
            </p>
          </div>

          <Button 
            onClick={onClose} 
            className="w-full nature-gradient text-white border-0"
          >
            Começar a Desenhar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
