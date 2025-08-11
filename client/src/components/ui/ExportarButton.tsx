import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Camera, Settings, Maximize2, FileImage } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export interface ExportarButtonProps {
  onExportCanvas: () => Promise<void>;
  onExportSelection?: () => Promise<void>;
  onExportHighRes: (options: { scale: number; format: 'png' | 'jpeg' }) => Promise<void>;
  hasSelection?: boolean;
  className?: string;
}

export const ExportarButton: React.FC<ExportarButtonProps> = ({
  onExportCanvas,
  onExportSelection,
  onExportHighRes,
  hasSelection = false,
  className
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [scale, setScale] = useState([3]); // Default to 3x for high quality
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [exportMode, setExportMode] = useState<'quick' | 'selection' | 'highres'>('quick');

  const handleQuickExport = async () => {
    setIsExporting(true);
    try {
      await onExportCanvas();
      toast.success('Canvas exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar canvas');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSelectionExport = async () => {
    if (!onExportSelection) return;
    
    setIsExporting(true);
    try {
      await onExportSelection();
      toast.success('Área selecionada exportada com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar seleção');
    } finally {
      setIsExporting(false);
    }
  };

  const handleHighResExport = async () => {
    setIsExporting(true);
    try {
      await onExportHighRes({ scale: scale[0], format });
      setDialogOpen(false);
      toast.success('Exportação de alta resolução concluída!');
    } catch (error) {
      toast.error('Erro na exportação de alta resolução');
    } finally {
      setIsExporting(false);
    }
  };

  const getResolutionText = () => {
    const baseRes = 1200; // Improved base resolution estimate
    const finalRes = baseRes * scale[0];
    return `~${finalRes}x${Math.round(finalRes * 0.7)}px`;
  };

  const getFileSizeEstimate = () => {
    const pixelCount = (1200 * scale[0]) * (840 * scale[0]);
    const bytesPerPixel = format === 'png' ? 4 : 3;
    const sizeInMB = (pixelCount * bytesPerPixel) / (1024 * 1024);
    return sizeInMB > 1 ? `${sizeInMB.toFixed(1)} MB` : `${(sizeInMB * 1024).toFixed(0)} KB`;
  };

  const getQualityLabel = () => {
    if (scale[0] <= 1) return 'Básica';
    if (scale[0] <= 2) return 'Boa';
    if (scale[0] <= 3) return 'Alta';
    if (scale[0] <= 4) return 'Máxima';
    return 'Ultra';
  };

  return (
    <div className={cn("flex items-center", className)}>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="sm"
            disabled={isExporting}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
            title="Exportar canvas"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exportando...' : 'Exportar'}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Download className="w-6 h-6 text-green-500" />
              Exportar Canvas
            </DialogTitle>
            <DialogDescription>
              Escolha como deseja exportar sua criação
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Export Mode Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Modo de Exportação</Label>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant={exportMode === 'quick' ? 'default' : 'outline'}
                  onClick={() => setExportMode('quick')}
                  className="flex items-center gap-3 p-4 h-auto justify-start"
                >
                  <Camera className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Exportação Rápida</div>
                    <div className="text-sm text-gray-500">Screenshot do canvas atual</div>
                  </div>
                </Button>

                {hasSelection && (
                  <Button
                    variant={exportMode === 'selection' ? 'default' : 'outline'}
                    onClick={() => setExportMode('selection')}
                    className="flex items-center gap-3 p-4 h-auto justify-start"
                  >
                    <Maximize2 className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">Exportar Seleção</div>
                      <div className="text-sm text-gray-500">Apenas a área selecionada</div>
                    </div>
                  </Button>
                )}

                <Button
                  variant={exportMode === 'highres' ? 'default' : 'outline'}
                  onClick={() => setExportMode('highres')}
                  className="flex items-center gap-3 p-4 h-auto justify-start"
                >
                  <Settings className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Alta Resolução</div>
                    <div className="text-sm text-gray-500">Configuração personalizada</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* High Resolution Settings */}
            {exportMode === 'highres' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configurações Avançadas</CardTitle>
                  <CardDescription>
                    Ajuste a qualidade e formato da exportação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Scale Slider */}
                  <div className="space-y-2">
                    <Label htmlFor="scale">
                      Qualidade: {scale[0]}x ({getQualityLabel()})
                    </Label>
                    <Slider
                      id="scale"
                      min={1}
                      max={5}
                      step={1}
                      value={scale}
                      onValueChange={setScale}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>1x (Básica)</span>
                      <span>5x (Ultra)</span>
                    </div>
                  </div>

                  {/* Format Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="format">Formato</Label>
                    <Select value={format} onValueChange={(value: 'png' | 'jpeg') => setFormat(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG (Melhor qualidade)</SelectItem>
                        <SelectItem value="jpeg">JPEG (Menor tamanho)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Preview Info */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Resolução:</span>
                      <span className="font-medium">{getResolutionText()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tamanho estimado:</span>
                      <span className="font-medium">{getFileSizeEstimate()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Qualidade:</span>
                      <span className="font-medium">{getQualityLabel()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Separator />

            {/* Export Button */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isExporting}
              >
                Cancelar
              </Button>
              <Button
                onClick={async () => {
                  if (exportMode === 'quick') {
                    await handleQuickExport();
                  } else if (exportMode === 'selection') {
                    await handleSelectionExport();
                  } else {
                    await handleHighResExport();
                  }
                }}
                disabled={isExporting}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                    {exportMode === 'highres' && ` ${scale[0]}x`}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
