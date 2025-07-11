import { toast } from 'sonner';
import { DrawingElement } from '@/types/canvasTypes';

export interface ExportOptions {
  quality?: number;
  format?: 'png' | 'jpeg';
  filename?: string;
  backgroundColor?: string;
}

export const exportCanvasArea = async (
  canvasElement: HTMLElement,
  selectionArea: { x: number; y: number; width: number; height: number },
  options: ExportOptions = {}
): Promise<void> => {
  const {
    quality = 0.9,
    format = 'png',
    filename = `canvas-export-${Date.now()}`,
    backgroundColor = '#ffffff'
  } = options;

  try {
    toast.info('Preparando exportação...', { duration: 2000 });

    // Create a temporary container for the selected area
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = `${selectionArea.width}px`;
    tempContainer.style.height = `${selectionArea.height}px`;
    tempContainer.style.backgroundColor = backgroundColor;
    tempContainer.style.overflow = 'hidden';
    tempContainer.style.borderRadius = '8px';
    
    // Clone the canvas content
    const canvasClone = canvasElement.cloneNode(true) as HTMLElement;
    canvasClone.style.position = 'relative';
    canvasClone.style.left = `-${selectionArea.x}px`;
    canvasClone.style.top = `-${selectionArea.y}px`;
    canvasClone.style.transform = 'none';
    canvasClone.style.margin = '0';
    canvasClone.style.padding = '0';
    
    // Remove any absolute positioning from child elements that might interfere
    const absoluteElements = canvasClone.querySelectorAll('[style*="position: absolute"]');
    absoluteElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      if (htmlElement.style.position === 'absolute') {
        // Preserve the positioning but remove transforms that might cause issues
        htmlElement.style.transform = htmlElement.style.transform.replace(/scale\([^)]*\)/g, '');
      }
    });
    
    tempContainer.appendChild(canvasClone);
    document.body.appendChild(tempContainer);
    
    toast.info('Gerando imagem...', { duration: 3000 });
    
    // Generate the image using html2canvas
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(tempContainer, {
      width: selectionArea.width,
      height: selectionArea.height,
      backgroundColor: backgroundColor,
      scale: 2, // Higher resolution
      logging: false,
      allowTaint: true,
      useCORS: true,
      removeContainer: true,
      ignoreElements: (element) => {
        // Ignore elements that might cause issues
        return element.classList.contains('ignore-export') ||
               element.tagName === 'SCRIPT' ||
               element.tagName === 'STYLE';
      }
    });
    
    // Clean up the temporary container
    document.body.removeChild(tempContainer);
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error('Erro ao gerar imagem');
        return;
      }
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.${format}`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success('Imagem exportada com sucesso!', {
        description: `Arquivo salvo como ${filename}.${format}`
      });
    }, `image/${format}`, quality);
    
  } catch (error) {
    console.error('Export error:', error);
    toast.error('Erro ao exportar imagem', {
      description: 'Tente novamente ou verifique se há elementos selecionados'
    });
  }
};

export const exportFullCanvas = async (
  canvasElement: HTMLElement,
  options: ExportOptions = {}
): Promise<void> => {
  const {
    quality = 0.9,
    format = 'png',
    filename = `canvas-full-${Date.now()}`,
    backgroundColor = '#ffffff'
  } = options;

  try {
    toast.info('Exportando canvas completo...', { duration: 2000 });
    
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: backgroundColor,
      scale: 2,
      logging: false,
      allowTaint: true,
      useCORS: true,
      removeContainer: true,
      ignoreElements: (element) => {
        return element.classList.contains('ignore-export') ||
               element.tagName === 'SCRIPT' ||
               element.tagName === 'STYLE';
      }
    });
    
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error('Erro ao gerar imagem');
        return;
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.${format}`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast.success('Canvas exportado com sucesso!', {
        description: `Arquivo salvo como ${filename}.${format}`
      });
    }, `image/${format}`, quality);
    
  } catch (error) {
    console.error('Export error:', error);
    toast.error('Erro ao exportar canvas');
  }
};

export const exportSelectedElements = async (
  elements: DrawingElement[],
  canvasElement: HTMLElement,
  options: ExportOptions = {}
): Promise<void> => {
  if (elements.length === 0) {
    toast.error('Nenhum elemento selecionado para exportar');
    return;
  }

  // Calculate bounding box of selected elements
  const bounds = elements.reduce((acc, element) => {
    const left = element.x;
    const top = element.y;
    const right = element.x + (element.width || 50);
    const bottom = element.y + (element.height || 50);
    
    return {
      left: Math.min(acc.left, left),
      top: Math.min(acc.top, top),
      right: Math.max(acc.right, right),
      bottom: Math.max(acc.bottom, bottom)
    };
  }, {
    left: Infinity,
    top: Infinity,
    right: -Infinity,
    bottom: -Infinity
  });

  const padding = 20;
  const selectionArea = {
    x: bounds.left - padding,
    y: bounds.top - padding,
    width: bounds.right - bounds.left + (padding * 2),
    height: bounds.bottom - bounds.top + (padding * 2)
  };

  await exportCanvasArea(canvasElement, selectionArea, {
    ...options,
    filename: `elementos-selecionados-${Date.now()}`
  });
};