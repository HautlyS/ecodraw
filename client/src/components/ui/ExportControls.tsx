import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Settings, Image as ImageIcon, FileImage } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export interface ExportControlsProps {
  onExportHighRes: (options: { scale: number; format: 'png' | 'jpeg' }) => Promise<void>;
  onExportSelection: () => Promise<void>;
  onExportElements: () => Promise<void>;
  onExportFull: () => Promise<void>;
  hasSelection?: boolean;
  hasSelectedElements?: boolean;
  className?: string;
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  onExportHighRes,
  onExportSelection,
  onExportElements,
  onExportFull,
  hasSelection = false,
  hasSelectedElements = false,
  className
}) => {
  const [scale, setScale] = useState([4]);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleExport = async (exportFn: () => Promise<void>, type: string) => {
    setIsExporting(true);
    try {
      await exportFn();
      toast.success(`${type} exportado com sucesso!`);
    } catch (error) {
      toast.error(`Erro ao exportar ${type.toLowerCase()}`);
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
    const baseRes = 1000; // Base resolution estimate
    const finalRes = baseRes * scale[0];
    return `~${finalRes}x${Math.round(finalRes * 0.6)}px`;
  };

  const getFileSizeEstimate = () => {
    const pixelCount = (1000 * scale[0]) * (600 * scale[0]);
    const bytesPerPixel = format === 'png' ? 4 : 3;
    const sizeInMB = (pixelCount * bytesPerPixel) / (1024 * 1024);
    return sizeInMB > 1 ? `${sizeInMB.toFixed(1)} MB` : `${(sizeInMB * 1024).toFixed(0)} KB`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Quick Export Buttons */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport(onExportFull, 'Canvas completo')}
        disabled={isExporting}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Exportar Tudo
      </Button>

      {hasSelection && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport(onExportSelection, 'Área selecionada')}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          <ImageIcon className="w-4 h-4" />
          Exportar Seleção
        </Button>
      )}

      {hasSelectedElements && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleExport(onExportElements, 'Elementos selecionados')}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          <FileImage className="w-4 h-4" />
          Exportar Elementos
        </Button>
      )}

      {/* High Resolution Export Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Settings className="w-4 h-4" />
            Alta Resolução
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Exportação de Alta Resolução
            </DialogTitle>
            <DialogDescription>
              Configure as opções para exportar uma imagem de alta qualidade do seu canvas.
            </DialogDescription>
          </DialogHeader>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configurações de Exportação</CardTitle>
              <CardDescription>
                Ajuste a qualidade e formato da imagem exportada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scale Slider */}
              <div className="space-y-2">
                <Label htmlFor="scale">
                  Escala de Resolução: {scale[0]}x
                </Label>
                <Slider
                  id="scale"
                  min={1}
                  max={8}
                  step={1}
                  value={scale}
                  onValueChange={setScale}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>1x (Normal)</span>
                  <span>8x (Máximo)</span>
                </div>
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <Label htmlFor="format">Formato da Imagem</Label>
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

              {/* Preview Information */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Resolução estimada:</span>
                  <span className="font-medium">{getResolutionText()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tamanho do arquivo:</span>
                  <span className="font-medium">{getFileSizeEstimate()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Qualidade:</span>
                  <span className="font-medium">
                    {scale[0] <= 2 ? 'Baixa' : scale[0] <= 4 ? 'Média' : scale[0] <= 6 ? 'Alta' : 'Máxima'}
                  </span>
                </div>
              </div>

              {/* Export Button */}
              <Button
                onClick={handleHighResExport}
                disabled={isExporting}
                className="w-full"
                size="lg"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar {scale[0]}x ({format.toUpperCase()})
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
};
