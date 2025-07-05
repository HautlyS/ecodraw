
export const CanvasWelcome = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center text-muted-foreground">
        <div className="w-16 h-16 mx-auto mb-4 nature-gradient rounded-full flex items-center justify-center">
          <span className="text-2xl text-white">🌱</span>
        </div>
        <h3 className="text-lg font-medium mb-2">Comece seu projeto agroecológico</h3>
        <p className="text-sm max-w-md">
          Selecione plantas da biblioteca ao lado ou use as ferramentas para desenhar sua área.
          <br />
          <strong>Arraste e solte</strong> plantas diretamente no canvas!
          <br />
          Use <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Del</kbd> para excluir, <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Esc</kbd> para cancelar, <kbd className="px-1 py-0.5 bg-muted rounded text-xs">G</kbd> para grade.
        </p>
      </div>
    </div>
  );
};
