import { Mountain, Leaf, Square, Circle } from "lucide-react";

export const CanvasWelcome = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center max-w-md mx-auto p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border shadow-lg">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-foreground">
          Começar seu projeto agroecológico
        </h3>
        
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Selecione plantas da biblioteca ao lado ou use as ferramentas para 
          desenhar sua área.
        </p>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Leaf className="w-4 h-4 text-green-500" />
            <span>Arraste plantas</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mountain className="w-4 h-4 text-brown-500" />
            <span>Use terreno</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Square className="w-4 h-4 text-blue-500" />
            <span>Desenhe áreas</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Circle className="w-4 h-4 text-purple-500" />
            <span>Forme círculos</span>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          💡 <strong>Dica:</strong> Use <kbd className="px-1 py-0.5 bg-muted rounded">Esc</kbd> para cancelar, <kbd className="px-1 py-0.5 bg-muted rounded">Del</kbd> para excluir
        </div>
      </div>
    </div>
  );
};