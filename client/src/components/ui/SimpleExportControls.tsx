import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Camera, Maximize2, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface SimpleExportControlsProps {
  onExportCanvas: () => Promise<void>;
  onExportSelection: () => Promise<void>;
  onExportHighRes: (options: { scale: number; format: 'png' | 'jpeg' }) => Promise<void>;
  hasSelection?: boolean;
  className?: string;
}

export const SimpleExportControls: React.FC<SimpleExportControlsProps> = ({
  onExportCanvas,
  onExportSelection,
  onExportHighRes,
  hasSelection = false,
  className
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [scale, setScale] = useState('2');
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleExport = async (exportFn: () => Promise<void>, description: string) => {
    setIsExporting(true);
    try {
      await exportFn();
      toast.success(`${description} exportado com sucesso!`);
    } catch (error) {
      toast.error(`Erro ao exportar ${description.toLowerCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleHighResExport = async () => {
    setIsExporting(true);
    try {
      await onExportHighRes({ 
        scale: parseInt(scale), 
        format 
      });
      setDialogOpen(false);
      toast.success('Export de alta resolução concluído!');
    } catch (error) {
      toast.error('Erro no export de alta resolução');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Quick Screenshot Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport(onExportCanvas, 'Screenshot do canvas')}
        disabled={isExporting}
        className="flex items-center gap-2"
        title="Capturar screenshot do canvas"
      >
        <Camera className="w-4 h-4" />
        {isExporting ? 'Exportando...' : 'Screenshot'}
      </Button>

      {/* Export Selection Button */}
      {hasSelection && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport(onExportSelection, 'Área selecionada')}
          disabled={isExporting}
          className="flex items-center gap-2"
          title="Exportar área selecionada"
        >
          <Maximize2 className="w-4 h-4" />
          Área Selecionada
        </Button>
      )}

      {/* High Resolution Export Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            title="Exportar em alta resolução"
          >
            <Settings className="w-4 h-4" />
            Alta Resolução
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export de Alta Resolução
            </DialogTitle>
            <DialogDescription>
              Capture uma imagem de alta qualidade do canvas atual.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Scale Selection */}
            <div className="space-y-2">
              <Label htmlFor="scale">Qualidade de Resolução</Label>
              <Select value={scale} onValueChange={setScale}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a qualidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x - Normal (rápido)</SelectItem>
                  <SelectItem value="2">2x - Boa qualidade</SelectItem>
                  <SelectItem value="3">3x - Alta qualidade</SelectItem>
                  <SelectItem value="4">4x - Máxima qualidade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Format Selection */}
            <div className="space-y-2">
              <Label htmlFor="format">Formato</Label>
              <Select value={format} onValueChange={(value: 'png' | 'jpeg') => setFormat(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG (melhor qualidade)</SelectItem>
                  <SelectItem value="jpeg">JPEG (arquivo menor)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Info */}
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {scale}x resolução será {parseInt(scale) >= 3 ? 'alta qualidade' : 'boa qualidade'} para impressão.
              </p>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleHighResExport}
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar {scale}x {format.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
