import { toast } from 'sonner';

export interface ExportOptions {
  quality?: number;
  format?: 'png' | 'jpeg';
  filename?: string;
  scale?: number;
}

// Enhanced function to capture the actual canvas as it appears on screen
export const captureCanvasScreenshot = async (
  canvasElement: HTMLElement,
  options: ExportOptions = {}
): Promise<void> => {
  const {
    quality = 0.98,
    format = 'png',
    filename = `canvas-${Date.now()}`,
    scale = 3 // Improved quality
  } = options;

  try {
    toast.info('Capturando imagem do canvas...', { duration: 2000 });

    // Dynamic import of html2canvas
    const { default: html2canvas } = await import('html2canvas');
    
    // Take screenshot of the canvas element
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: '#ffffff',
      scale: scale,
      logging: false,
      allowTaint: true,
      useCORS: true,
      width: canvasElement.offsetWidth,
      height: canvasElement.offsetHeight,
      windowWidth: canvasElement.scrollWidth,
      windowHeight: canvasElement.scrollHeight,
      foreignObjectRendering: true,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector('[data-canvas="true"]');
        if (clonedElement) {
          clonedElement.style.transform = 'none';
          clonedElement.style.transformOrigin = 'initial';
        }
      }
    });
    
    // Convert to blob and download
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
        description: `Arquivo salvo como ${filename}.${format} (${canvas.width}x${canvas.height}px)`
      });
    }, `image/${format}`, quality);
    
  } catch (error) {
    console.error('Export error:', error);
    toast.error('Erro ao exportar canvas', {
      description: 'Tente novamente ou atualize a página'
    });
  }
};

// Capture specific area of the canvas
export const captureCanvasArea = async (
  canvasElement: HTMLElement,
  selectionArea: { x: number; y: number; width: number; height: number },
  options: ExportOptions = {}
): Promise<void> => {
  const {
    quality = 0.95,
    format = 'png',
    filename = `canvas-area-${Date.now()}`,
    scale = 2
  } = options;

  try {
    toast.info('Capturando área selecionada...', { duration: 2000 });

    const { default: html2canvas } = await import('html2canvas');
    
    // Capture the full canvas first
    const fullCanvas = await html2canvas(canvasElement, {
      backgroundColor: '#ffffff',
      scale: scale,
      logging: false,
      allowTaint: true,
      useCORS: true,
      width: canvasElement.offsetWidth,
      height: canvasElement.offsetHeight,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector('[data-canvas="true"]');
        if (clonedElement) {
          clonedElement.style.transform = 'none';
          clonedElement.style.transformOrigin = 'initial';
        }
      }
    });
    
    // Create a new canvas for the cropped area
    const croppedCanvas = document.createElement('canvas');
    const ctx = croppedCanvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Set dimensions for the cropped area
    croppedCanvas.width = selectionArea.width * scale;
    croppedCanvas.height = selectionArea.height * scale;
    
    // Draw the selected area onto the new canvas
    ctx.drawImage(
      fullCanvas,
      selectionArea.x * scale, // Source x
      selectionArea.y * scale, // Source y
      selectionArea.width * scale, // Source width
      selectionArea.height * scale, // Source height
      0, // Destination x
      0, // Destination y
      croppedCanvas.width, // Destination width
      croppedCanvas.height // Destination height
    );
    
    // Convert to blob and download
    croppedCanvas.toBlob((blob) => {
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
      
      toast.success('Área exportada com sucesso!', {
        description: `Arquivo salvo como ${filename}.${format} (${croppedCanvas.width}x${croppedCanvas.height}px)`
      });
    }, `image/${format}`, quality);
    
  } catch (error) {
    console.error('Export error:', error);
    toast.error('Erro ao exportar área', {
      description: 'Tente novamente ou selecione uma área menor'
    });
  }
};

// High-resolution canvas capture
export const captureHighResCanvas = async (
  canvasElement: HTMLElement,
  options: ExportOptions = {}
): Promise<void> => {
  const {
    quality = 0.98,
    format = 'png',
    filename = `canvas-hires-${Date.now()}`,
    scale = 4 // 4x for high resolution
  } = options;

  try {
    toast.info('Gerando imagem de alta resolução...', { duration: 3000 });

    const { default: html2canvas } = await import('html2canvas');
    
    // Capture with high resolution
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: '#ffffff',
      scale: scale,
      logging: false,
      allowTaint: true,
      useCORS: true,
      width: canvasElement.offsetWidth,
      height: canvasElement.offsetHeight,
      foreignObjectRendering: true,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector('[data-canvas="true"]');
        if (clonedElement) {
          clonedElement.style.transform = 'none';
          clonedElement.style.transformOrigin = 'initial';
        }
      }
    });
    
    // Convert to blob and download
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
      
      toast.success('Imagem de alta resolução exportada!', {
        description: `Arquivo salvo como ${filename}.${format} (${canvas.width}x${canvas.height}px)`
      });
    }, `image/${format}`, quality);
    
  } catch (error) {
    console.error('Export error:', error);
    toast.error('Erro ao exportar alta resolução', {
      description: 'Tente novamente com uma resolução menor'
    });
  }
};

// Export visible viewport
export const exportViewport = async (
  canvasElement: HTMLElement,
  options: ExportOptions = {}
): Promise<void> => {
  return captureCanvasScreenshot(canvasElement, {
    ...options,
    filename: options.filename || `viewport-${Date.now()}`
  });
};

// Export full canvas
export const exportFullCanvas = async (
  canvasElement: HTMLElement,
  options: ExportOptions = {}
): Promise<void> => {
  return captureCanvasScreenshot(canvasElement, {
    ...options,
    filename: options.filename || `canvas-full-${Date.now()}`
  });
};

// Export selected area
export const exportSelectedArea = async (
  canvasElement: HTMLElement,
  selectionArea: { x: number; y: number; width: number; height: number },
  options: ExportOptions = {}
): Promise<void> => {
  return captureCanvasArea(canvasElement, selectionArea, {
    ...options,
    filename: options.filename || `selection-${Date.now()}`
  });
};

// Legacy compatibility
export const exportCanvasArea = exportSelectedArea;
export const exportSelectedElements = exportViewport;
export const exportHighResolutionCanvas = captureHighResCanvas;
