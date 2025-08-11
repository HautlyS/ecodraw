
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
      <DialogContent className="max-w-2xl glass-card border-green-200/30 dark:border-green-700/30">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl nature-gradient shadow-lg">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-400">
                Bem-vindo ao Canvas Agroecológico!
              </DialogTitle>
              <DialogDescription className="text-green-700 dark:text-green-300">
                Crie projetos sustentáveis com design visual intuitivo
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-green-50/50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-700/50">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl nature-gradient-soft">
                <Mouse className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-200">1. Explore nossa biblioteca</h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Navegue por plantas nativas, estruturas sustentáveis e elementos de terreno
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl water-gradient">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">2. Projete visualmente</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Use ferramentas intuitivas para criar mapas detalhados da sua propriedade
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/50">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl earth-gradient">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-800 dark:text-amber-200">3. Exporte e implemente</h4>
                <p className="text-sm text-amber-600 dark:text-amber-300">
                  Baixe em alta resolução para usar no planejamento real da propriedade
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🌱</span>
              <strong className="text-green-800 dark:text-green-200">Dica inicial:</strong>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Comece explorando a biblioteca de plantas no painel lateral direito. 
              Clique em qualquer elemento para adicioná-lo ao seu canvas de design.
            </p>
          </div>

          <Button 
            onClick={onClose} 
            className="w-full h-12 nature-gradient text-white border-0 hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl"
          >
            <Sprout className="w-5 h-5 mr-2" />
            Começar Meu Projeto
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
