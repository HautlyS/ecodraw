// Utility functions for consistent plant and terrain size calculations

export interface RealWorldSize {
  width: number;  // in meters
  height: number; // in meters
}

export interface PixelSize {
  width: number;  // in pixels
  height: number; // in pixels
}

/**
 * Parse spacing string to get dimensions in meters
 * Examples: "30x30cm", "1x1m", "50cm", "2m"
 */
export function parseSpacingToMeters(spacing: string): RealWorldSize {
  // Handle XxY format (e.g., "30x30cm", "1x1m")
  if (spacing.includes('x')) {
    const match = spacing.match(/(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)(cm|m)?/);
    if (match) {
      const width = parseFloat(match[1]);
      const height = parseFloat(match[2]);
      const unit = match[3] || 'm';
      
      const widthInMeters = unit === 'cm' ? width / 100 : width;
      const heightInMeters = unit === 'cm' ? height / 100 : height;
      
      return { width: widthInMeters, height: heightInMeters };
    }
  }
  
  // Handle single dimension (e.g., "50cm", "2m")
  const singleMatch = spacing.match(/(\d+(?:\.\d+)?)(cm|m)/);
  if (singleMatch) {
    const value = parseFloat(singleMatch[1]);
    const unit = singleMatch[2];
    const meters = unit === 'cm' ? value / 100 : value;
    
    return { width: meters, height: meters };
  }
  
  // Default to 1x1m if format is not recognized
  console.warn(`Unrecognized spacing format: ${spacing}, defaulting to 1x1m`);
  return { width: 1, height: 1 };
}

/**
 * Convert meters to pixels based on current scale
 */
export function metersToPixels(meters: number, pixelsPerMeter: number): number {
  return meters * pixelsPerMeter;
}

/**
 * Convert real world size to pixel size
 */
export function realWorldSizeToPixels(
  realSize: RealWorldSize, 
  pixelsPerMeter: number
): PixelSize {
  return {
    width: metersToPixels(realSize.width, pixelsPerMeter),
    height: metersToPixels(realSize.height, pixelsPerMeter)
  };
}

/**
 * Format real world size for display
 */
export function formatRealWorldSize(size: RealWorldSize): string {
  if (size.width === size.height) {
    return size.width < 1 ? `${size.width * 100}cm` : `${size.width}m`;
  }
  
  const formatValue = (value: number) => 
    value < 1 ? `${value * 100}cm` : `${value}m`;
  
  return `${formatValue(size.width)}×${formatValue(size.height)}`;
}

/**
 * Calculate appropriate icon size based on plant's real world size
 */
export function calculateIconSize(pixelSize: PixelSize): number {
  const avgSize = (pixelSize.width + pixelSize.height) / 2;
  
  // Scale icon to be 30-50% of the plant area, with min/max constraints
  const iconSize = avgSize * 0.4;
  
  // Ensure icon is between 16px and 80px
  return Math.max(16, Math.min(80, iconSize));
}
